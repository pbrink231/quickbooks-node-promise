/**
 * @file Node.js client for QuickBooks V3 API
 * @name quickbooks-promise
 * @author Peter Brink <michael_cohen@intuit.com>
 * @license ISC
 * @copyright (c) 2019 Peter Brink
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee
 * is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE
 * INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE
 * FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION,
 * ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * Modified from:
 * https://github.com/mcohen01/node-quickbooks
 * 2014 Michael Cohen
 */

import { v4 as uuidv4 } from "uuid";
import _ from "underscore";
import qs from "qs";
import jwt from "jsonwebtoken";
import fetch, { Response } from "node-fetch";
import util from "util";
import Tokens from "csrf";
import {
  checkConfig,
  dateNotExpired,
  getDateCheck,
  getQueryString,
} from "./helpers";

const csrf = new Tokens();

export interface TokenData {
  access_token: string;
  token_type: string; // 'bearer',
  x_refresh_token_expires_in: number; // 8726400,
  refresh_token: string;
  id_token: string;
  expires_in: 3600;
}
export interface RealmTokenData {
  realmID: number | string;
  token: TokenData;
}

export interface StoreSaveTokenData extends RealmTokenData {
  access_expire_timestamp: number;
  refresh_expire_timestamp: number;
}

export interface StoreTokenData {
  realmID?: number | string;
  access_token: string;
  refresh_token: string;
  access_expire_timestamp: number;
  refresh_expire_timestamp: number;
  id_token?: string; // (Optional) Used only for user OpenID verification
}

export interface StoreGetTokenData {
  realmID: number | string;
}

export interface QBStoreStrategy {
  getQBToken(storeGetTokenData: StoreGetTokenData): Promise<StoreTokenData>;
  storeQBToken(storeSaveTokenData: StoreSaveTokenData): Promise<StoreTokenData>;
}

export interface AppConfig {
  appKey: string;
  appSecret: string;
  redirectUrl: string;
  /** null for latest version */
  minorversion?: number | null;
  /** default is false */
  useProduction?: string | boolean;
  storeStrategy: QBStoreStrategy;
  scope: string[];
  /** default is false */
  debug?: boolean | string;
  /** CSRF Token */
  state?: string;
}

export interface RequestOptions {
  url: string;
  qs?: Record<string, any>;
  headers?: object;
  fullurl?: boolean;
}

export interface CriteriaItem {
  field: string;
  value: string;
  operator?: string;
  /**
   * @deprecated The method should not be used
   */
  count?: boolean;
}

export interface QueryBase {
  count?: boolean;
  limit?: number;
  offset?: number;
  asc?: string;
  desc?: string;
  sort?: [string, "ASC" | "DESC" | null][];
  fetchAll?: boolean;
}

export interface QueryData extends QueryBase {
  items: CriteriaItem[];
}

export type QueryInput = string | QueryData | CriteriaItem | CriteriaItem[];

interface QueryResponse {
  startPosition: number;
  totalCount: number;
  maxResults: number;
}
interface QueryResponseData {
  QueryResponse: {
    startPosition: number;
    totalCount: number;
    maxResults: number;
    [module: string]: any;
  };
  time: string;
}

interface GetResponseData {
  [module: string]: any;
  time: string;
}

export interface DeleteResponse {
  Invoice: {
    status: string;
    domain: string;
    Id: string;
  };
  time: string;
}

class QBFetchError extends Error {
  response: Response;
  constructor(msg: string, response: Response) {
    super(msg);
    this.response = response;
  }
}

class Quickbooks {
  static AUTHORIZATION_URL = "https://appcenter.intuit.com/connect/oauth2";
  static TOKEN_URL =
    "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";
  static USER_INFO_URL =
    "https://sandbox-accounts.platform.intuit.com/v1/openid_connect/userinfo";
  static REVOKE_URL =
    "https://developer.api.intuit.com/v2/oauth2/tokens/revoke";
  static IDTOKEN_ISSUER_URL = "https://oauth.platform.intuit.com/op/v1";
  static JWKS_URL = "https://oauth.platform.intuit.com/op/v1/jwks";
  static APP_CENTER_BASE = "https://appcenter.intuit.com";
  static V3_ENDPOINT_BASE_URL =
    "https://sandbox-quickbooks.api.intuit.com/v3/company/";
  static QUERY_OPERATORS = ["=", "IN", "<", ">", "<=", ">=", "LIKE"];
  static EXPIRATION_BUFFER = 60 * 1000; // 1 minute buffer
  static scopes = {
    Accounting: "com.intuit.quickbooks.accounting",
    Payment: "com.intuit.quickbooks.payment",
    Payroll: "com.intuit.quickbooks.payroll",
    TimeTracking: "com.intuit.quickbooks.payroll.timetracking",
    Benefits: "com.intuit.quickbooks.payroll.benefits",
    Profile: "profile",
    Email: "email",
    Phone: "phone",
    Address: "address",
    OpenId: "openid",
    Intuit_name: "intuit_name",
  };

  config: AppConfig;
  appKey: string;
  appSecret: string;
  redirectUrl: string;
  storeStrategy: QBStoreStrategy;
  useProduction: boolean;
  minorversion?: number | null;
  debug: boolean;
  realmID: number | string;
  endpoint: string;

  /**
   * Node.js client encapsulating access to the QuickBooks V3 Rest API. An instance
   * of this class should be instantiated on behalf of each user and company accessing the api.
   */
  constructor(appConfig: AppConfig, realmID: string | number) {
    if (!realmID) throw new Error("realmID is required");
    checkConfig(appConfig);
    this.config = appConfig;

    this.appKey = appConfig.appKey;
    this.appSecret = appConfig.appSecret;
    this.redirectUrl = appConfig.redirectUrl;
    this.storeStrategy = appConfig.storeStrategy;
    this.useProduction =
      appConfig.useProduction === "true" || appConfig.useProduction === true
        ? true
        : false;
    this.minorversion = appConfig.minorversion;
    this.debug =
      appConfig.debug === "true" || appConfig.debug === true ? true : false;

    this.realmID = realmID;
    this.endpoint = this.useProduction
      ? Quickbooks.V3_ENDPOINT_BASE_URL.replace("sandbox-", "")
      : Quickbooks.V3_ENDPOINT_BASE_URL;
    if ("production" !== process.env.NODE_ENV && this.debug) {
      console.log("using enpoint for calls", this.endpoint);
    }
  }

  /**
   * Redirect link to Authorization Page
   */
  static authorizeUrl = (appConfig: AppConfig) => {
    checkConfig(appConfig);

    let scopes = Array.isArray(appConfig.scope)
      ? appConfig.scope.join(" ")
      : appConfig.scope;
    let querys = {
      client_id: appConfig.appKey,
      redirect_uri: appConfig.redirectUrl, //Make sure this path matches entry in application dashboard
      scope: scopes,
      response_type: "code",
      state: appConfig.state || csrf.create(csrf.secretSync()),
    };

    let authorizeUri = `${Quickbooks.AUTHORIZATION_URL}?${qs.stringify(
      querys
    )}`;
    return authorizeUri;
  };

  /**
   * Redirect link to Authorization Page
   */
  authorizeUrl = () => {
    return Quickbooks.authorizeUrl(this.config);
  };

  /**
   * Save token
   */
  static saveToken = (
    storeStrategy: QBStoreStrategy,
    tokenData: RealmTokenData
  ) => {
    // Get expired dates
    let extraInfo = {
      access_expire_timestamp: Date.now() + tokenData.token.expires_in * 1000,
      refresh_expire_timestamp:
        Date.now() + tokenData.token.x_refresh_token_expires_in * 1000,
    };
    return storeStrategy.storeQBToken(Object.assign({}, extraInfo, tokenData));
  };

  /**
   * Save token
   */
  saveToken = (token: TokenData) => {
    return Quickbooks.saveToken(this.storeStrategy, {
      realmID: this.realmID,
      token,
    });
  };

  /**
   * Creates new token for the realmID from the returned authorization code received in the callback request
   */
  static createToken = (
    appConfig: AppConfig,
    authCode: string,
    realmID: string | number
  ) => {
    checkConfig(appConfig);

    const auth = Buffer.from(
      appConfig.appKey + ":" + appConfig.appSecret
    ).toString("base64");

    let fetchOptions = {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + auth,
      },
      body: qs.stringify({
        grant_type: "authorization_code",
        code: authCode, // From Callback request
        redirect_uri: appConfig.redirectUrl, //Make sure this path matches entry in application dashboard
      }),
    };

    return fetch(Quickbooks.TOKEN_URL, fetchOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new QBFetchError(response.statusText, response);
        }
      })
      .then((newToken: TokenData) => {
        return Quickbooks.saveToken(appConfig.storeStrategy, {
          realmID,
          token: newToken,
        });
      });
  };

  /**
   * Creates new token for the realmID from the returned authorization code received in the callback request
   * @param authCode - The code returned in your callback as a param called "code"
   * @param realmID - The company identifier in your callback as a param called "realmId"
   * @returns new token with expiration dates from storeStrategy
   */
  createToken = (authCode: string, realmID: string | number) => {
    return Quickbooks.createToken(this.config, authCode, realmID);
  };

  /**
   * Check if access_token is valid
   * @param token - returned from storeStrategy
   * @return token has expired or not
   */
  static isAccessTokenValid = (token: StoreTokenData) => {
    if (!token.access_expire_timestamp) {
      console.log("Access Token expire date MISSING, ASSUMING EXPIRED");
      return false;
    } else {
      return dateNotExpired(
        token.access_expire_timestamp,
        Quickbooks.EXPIRATION_BUFFER
      );
    }
  };

  /**
   * Check if there is a valid (not expired) access token
   * @param token - returned from storeStrategy
   * @return token has expired or not
   */
  static isRefreshTokenValid = (token: StoreTokenData) => {
    if (!token.refresh_expire_timestamp) {
      console.log("Refresh Token expire date MISSING, ASSUMING NOT EXPIRED");
      return true;
    } else {
      return dateNotExpired(
        token.refresh_expire_timestamp,
        Quickbooks.EXPIRATION_BUFFER
      );
    }
  };

  /**
   * Get token
   */
  static getToken = (
    storeStrategy: QBStoreStrategy,
    info: StoreGetTokenData
  ) => {
    return storeStrategy.getQBToken(info);
  };

  /**
   * Get token
   */
  getToken = () => {
    const getStoreData: StoreGetTokenData = { realmID: this.realmID };
    return Quickbooks.getToken(this.storeStrategy, getStoreData);
  };

  /**
   * Use the refresh token to obtain a new access token.
   * @param token - has the refresh_token
   * @returns returns fresh token with access_token and refresh_token
   *
   */
  refreshWithAccessToken = (token: StoreTokenData) => {
    if ("production" !== process.env.NODE_ENV && this.debug) {
      console.log("Refreshing quickbooks access_token");
    }
    if (!token.refresh_token) throw Error("Refresh Token missing");

    const auth = Buffer.from(this.appKey + ":" + this.appSecret).toString(
      "base64"
    );

    let fetchOptions = {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + auth,
      },
      body: qs.stringify({
        grant_type: "refresh_token",
        refresh_token: token.refresh_token,
      }),
    };

    return fetch(Quickbooks.TOKEN_URL, fetchOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new QBFetchError(response.statusText, response);
        }
      })
      .then((newToken: TokenData) => {
        return Quickbooks.saveToken(this.storeStrategy, {
          realmID: this.realmID,
          token: newToken,
        });
      });
  };

  /**
   * Use the refresh token to obtain a new access token.
   * @returns returns fresh token with access_token and refresh_token
   *
   */
  refreshAccessToken = () => {
    return this.getToken().then((token) => {
      return this.refreshWithAccessToken(token);
    });
  };

  /**
   * Use either refresh token or access token to revoke access (OAuth2).
   *
   * @param useRefresh - boolean - Indicates which token to use: true to use the refresh token, false to use the access token.
   */
  revokeAccess = (useRefresh?: boolean) => {
    return this.getToken().then((token) => {
      const revokeToken = useRefresh ? token.refresh_token : token.access_token;

      if (!revokeToken) throw Error("Token missing");

      const auth = Buffer.from(this.appKey + ":" + this.appSecret).toString(
        "base64"
      );

      let fetchOptions = {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + auth,
        },
        body: qs.stringify({
          token: revokeToken,
        }),
      };

      return fetch(Quickbooks.REVOKE_URL, fetchOptions).then((response) => {
        if (response.ok) {
          return response;
        } else {
          throw new QBFetchError(response.statusText, response);
        }
      });
    });
  };

  /**
   * Validate id_token
   *
   */
  validateIdToken = async () => {
    const token = await this.getToken();
    if (!token.id_token) throw Error("ID Token missing");

    const auth = Buffer.from(this.appKey + ":" + this.appSecret).toString(
      "base64"
    );

    // Decode ID Token
    const token_parts = token.id_token.split(".");
    const id_token_header = JSON.parse(atob(token_parts[0]));
    const id_token_payload = JSON.parse(atob(token_parts[1]));

    const id_token_signature = atob(token_parts[2]);
    //
    // Step 1 : First check if the issuer is as mentioned in "issuer"
    if (id_token_payload.iss != Quickbooks.IDTOKEN_ISSUER_URL) return false;

    // Step 2 : check if the aud field in idToken is same as application's key
    if (id_token_payload.aud != this.appKey) return false;

    // Step 3 : ensure the timestamp has not elapsed
    if (id_token_payload.exp < Date.now() / 1000) return false;

    let fetchOptions = {
      method: "get",
      headers: {
        Accept: "application/json",
      },
    };

    return fetch(Quickbooks.JWKS_URL, fetchOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new QBFetchError(response.statusText, response);
        }
      })
      .then((json) => {
        const key = json.keys.find((el: any) => el.kid == id_token_header.kid);
        const cert = this.getPublicKey(key.n, key.e);
        if (!token.id_token) {
          throw new Error("ID Token missing");
        }
        return jwt.verify(token.id_token, cert);
      })
      .then((res) => {
        if (res) {
          return true;
        }
      });
  };

  /**
   * get Public Key
   * @param modulus
   * @param exponent
   */
  getPublicKey = (modulus: any, exponent: any) => {
    const getPem = require("rsa-pem-from-mod-exp");
    const pem = getPem(modulus, exponent);
    return pem;
  };

  /*** API HELPER FUNCTIONS  ***/
  request = async <T>(verb: string, options: RequestOptions, entity: any) => {
    let token = await this.getToken();
    if (!token.access_token) throw Error("Access Token missing");
    if (!Quickbooks.isAccessTokenValid(token)) {
      token = await this.refreshWithAccessToken(token);
    }

    const opts: {
      qs: Record<string, any>;
      headers: Record<string, any>;
      body?: string;
      encoding?: null;
    } = {
      qs: options.qs || {},
      headers: options.headers || {},
    };

    let url: string | null = null;
    if (options.fullurl) {
      url = options.url;
    } else {
      url = this.endpoint + this.realmID + options.url;
    }

    if (entity && entity.allowDuplicateDocNum) {
      delete entity.allowDuplicateDocNum;
      opts.qs.include = "allowduplicatedocnum";
    }
    if (verb == "post") {
      opts.qs.requestid = uuidv4();
    }

    if (this.minorversion) {
      opts.qs.minorversion = this.minorversion;
    }
    opts.headers["Authorization"] = "Bearer " + token.access_token;
    opts.headers["accept"] = "application/json";

    if (entity !== null) {
      opts.body = JSON.stringify(entity);
      opts.headers["Content-Type"] = "application/json";
    }

    const fetchOptions = {
      method: verb,
      headers: opts.headers,
      body: opts.body,
    };
    url = `${url}?${qs.stringify(opts.qs)}`;

    if ("production" !== process.env.NODE_ENV && this.debug) {
      console.log("invoking endpoint:", url);
      console.log("fetch options", fetchOptions);
    }

    const response = await fetch(url, fetchOptions);
    if (response.ok) {
      const returnedObject: T = await response.json();
      return returnedObject;
    } else {
      try {
        const body = await response.json();
        if (body?.Fault?.Error) {
          throw new Error(`Error of type ${body.Fault.Error.type}`);
        }
      } catch (e) {
        // ignore
      }
      throw new QBFetchError(response.statusText, response);
    }
  };

  requestPdf = async (entityName: string, id: string | number) => {
    let token = await this.getToken();
    if (!token.access_token) throw Error("Access Token missing");
    if (!Quickbooks.isAccessTokenValid(token)) {
      token = await this.refreshWithAccessToken(token);
    }

    const fetchOptions = {
      method: "get",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        accept: "application/pdf",
      },
    };
    const qsv: {
      minorversion?: number;
    } = {};
    if (this.minorversion) {
      qsv.minorversion = this.minorversion;
    }

    const sendUrl = `${this.endpoint}${
      this.realmID
    }/${entityName.toLowerCase()}/${id}/pdf?${qs.stringify(qsv)}`;

    if ("production" !== process.env.NODE_ENV && this.debug) {
      console.log("invoking endpoint:", sendUrl);
      console.log("fetch options", fetchOptions);
    }

    const response = await fetch(sendUrl, fetchOptions);
    if (response.ok) {
      return response.buffer();
    } else {
      throw new QBFetchError(response.statusText, response);
    }
  };

  // **********************  CRUD Api **********************
  create = <T>(entityName: string, entity: any) => {
    const url = "/" + entityName.toLowerCase();
    return this.request<T>("post", { url: url }, entity);
  };

  read = <T>(entityName: string, id: string | null) => {
    let url = "/" + entityName.toLowerCase();
    if (id) url = url + "/" + id;
    return this.request<GetResponseData>("get", { url: url }, null);
  };

  update = <T>(entityName: string, entity: any) => {
    if (
      _.isUndefined(entity.Id) ||
      _.isEmpty(entity.Id + "") ||
      _.isUndefined(entity.SyncToken) ||
      _.isEmpty(entity.SyncToken + "")
    ) {
      if (entityName !== "exchangerate") {
        throw new Error(
          entityName +
            " must contain Id and SyncToken fields: " +
            util.inspect(entity, { showHidden: false, depth: null })
        );
      }
    }
    if (!entity.hasOwnProperty("sparse")) {
      entity.sparse = true;
    }
    let url = "/" + entityName.toLowerCase();
    let qs = { operation: "update" };
    let opts = { url: url, qs: qs };
    return this.request("post", opts, entity);
  };

  delete = async (entityName: string, idOrEntity: any) => {
    // requires minimum Id and SyncToken
    // if passed Id as numeric value then grab entity and send it to delete
    let url = "/" + entityName.toLowerCase();
    let qs = { operation: "delete" };
    if (_.isObject(idOrEntity)) {
      return this.request<DeleteResponse>(
        "post",
        { url: url, qs: qs },
        idOrEntity
      );
    } else {
      const entity = await this.read<any>(entityName, idOrEntity);
      return this.request<DeleteResponse>("post", { url: url, qs: qs }, entity);
    }
  };

  void = async (entityName: string, idOrEntity: any) => {
    // requires minimum Id and SyncToken
    // if passed Id as numeric value then grab entity and send it to delete
    const url = "/" + entityName.toLowerCase();
    let qs = { operation: "void" };
    if (_.isObject(idOrEntity)) {
      return this.request("post", { url: url, qs: qs }, idOrEntity);
    } else {
      const entity = await this.read<any>(entityName, idOrEntity);
      return this.request("post", { url: url, qs: qs }, entity);
    }
  };

  // **********************  Query Api **********************
  query = async (entityName: string, queryInput: QueryInput) => {
    const [query, queryData] = getQueryString(entityName, queryInput);
    const url = "/query";
    let qs = {
      query: query,
    };
    const data = await this.request<QueryResponseData>(
      "get",
      { url: url, qs: qs },
      null
    );
    const fields = Object.keys(data.QueryResponse);
    const key = _.find(fields, (k) => {
      return k.toLowerCase() === entityName.toLowerCase();
    });
    if (!key) {
      throw new Error(
        "Could not find entity in response: " +
          util.inspect(data, { showHidden: false, depth: null })
      );
    }
    if (
      queryData?.fetchAll &&
      queryData?.limit &&
      data &&
      data.QueryResponse &&
      data.QueryResponse.maxResults === queryData.limit
    ) {
      if (!queryData.offset) {
        queryData.offset = queryData.limit + 1;
      } else {
        queryData.offset = queryData.offset + queryData.limit + 1;
      }
      const more = await this.query(entityName, queryInput);
      data.QueryResponse[key] = data.QueryResponse[key].concat(
        more.QueryResponse[key] || []
      );
      data.QueryResponse.maxResults =
        data.QueryResponse.maxResults + (more.QueryResponse.maxResults || 0);
      data.time = more.time || data.time;
      return data;
    } else {
      return data;
    }
  };

  // **********************  Report Api **********************
  report = <T>(reportType: string, criteria: any) => {
    let url = "/reports/" + reportType;
    return this.request<T>("get", { url: url, qs: criteria }, null);
  };

  capitalize = (s: string) => {
    return s.substring(0, 1).toUpperCase() + s.substring(1);
  };

  pluralize = (s: string) => {
    const last = s.substring(s.length - 1);
    if (last === "s") {
      return s + "es";
    } else if (last === "y") {
      return s.substring(0, s.length - 1) + "ies";
    } else {
      return s + "s";
    }
  };

  unwrap = (data: any, entityName: string) => {
    const name = this.capitalize(entityName);
    return (data || {})[name] || data;
  };

  /*** API CALLS HERE ***/
  /**
   * Get user info (OAuth2).
   *
   */
  getUserInfo = () => {
    let useUrl = this.useProduction
      ? Quickbooks.USER_INFO_URL.replace("sandbox-", "")
      : Quickbooks.USER_INFO_URL;

    return this.request("get", { url: useUrl, fullurl: true }, null);
  };

  /**
 * Batch operation to enable an application to perform multiple operations in a single request.
 * The following batch items are supported:
     create
     update
     delete
     query
 * The maximum number of batch items in a single request is 25.
 *
 * @param items - JavaScript array of batch items
 */
  batch = (items: any[]) => {
    return this.request("post", { url: "/batch" }, { BatchItemRequest: items });
  };

  /**
   * The change data capture (CDC) operation returns a list of entities that have changed since a specified time.
   *
   * @param  entities - Comma separated list or JavaScript array of entities to search for changes
   * @param  since - JS Date object, JS Date milliseconds, or string in ISO 8601 - to look back for changes until
   */
  changeDataCapture = (
    entities: string | string[],
    since: Date | number | string
  ) => {
    const dateToCheck = getDateCheck(since);
    if (!dateToCheck) {
      throw new Error("Invalid date passed to changeDataCapture");
    }

    let url = "/cdc";
    let qs = {
      entities: typeof entities === "string" ? entities : entities.join(","),
      changedSince: new Date(dateToCheck).toISOString(),
    };
    return this.request("get", { url: url, qs: qs }, null);
  };

  /**
   * Updates QuickBooks version of Attachable
   *
   * @param  attachable - The persistent Attachable, including Id and SyncToken fields
   */
  updateAttachable = (attachable: any) => {
    return this.update("attachable", attachable);
  };

  /**
   * Uploads a file as an Attachable in QBO, optionally linking it to the specified
   * QBO Entity.
   *
   * @param filename - the name of the file
   * @param contentType - the mime type of the file
   * @param stream - ReadableStream of file contents
   * @param entityType - optional string name of the QBO entity the Attachable will be linked to (e.g. Invoice)
   * @param entityId - optional Id of the QBO entity the Attachable will be linked to
   */
  upload = async (
    filename: string,
    contentType: string,
    stream: ReadableStream,
    entityType: (something: any, somethingElse: any) => any | string | null,
    entityId?: number
  ) => {
    const opts = {
      url: "/upload",
      formData: {
        file_content_01: {
          value: stream,
          options: {
            filename: filename,
            contentType: contentType,
          },
        },
      },
    };
    const data = await this.request("post", opts, null);
    const dataUnwraped = this.unwrap(data, "AttachableResponse");
    if (dataUnwraped[0].Fault) {
      return entityType(dataUnwraped[0], null);
    } else if (_.isFunction(entityType)) {
      return entityType(null, dataUnwraped[0].Attachable);
    } else {
      const id = dataUnwraped[0].Attachable.Id;
      return this.updateAttachable({
        Id: id,
        SyncToken: "0",
        AttachableRef: [
          {
            EntityRef: {
              type: entityType,
              value: entityId + "",
            },
          },
        ],
      });
    }
  };

  /**
   * Creates the Account in QuickBooks
   *
   * @param  {object} account - The unsaved account, to be persisted in QuickBooks
   */
  createAccount = (account: any) => {
    return this.create<any>("account", account);
  };

  /**
   * Creates the Attachable in QuickBooks
   *
   * @param  {object} attachable - The unsaved attachable, to be persisted in QuickBooks
   */
  createAttachable = (attachable: any) => {
    return this.create<any>("attachable", attachable);
  };

  /**
   * Creates the Bill in QuickBooks
   *
   * @param  {object} bill - The unsaved bill, to be persisted in QuickBooks
   */
  createBill = (bill: any) => {
    return this.create<any>("bill", bill);
  };

  /**
   * Creates the BillPayment in QuickBooks
   *
   * @param  {object} billPayment - The unsaved billPayment, to be persisted in QuickBooks
   */
  createBillPayment = (billPayment: any) => {
    return this.create<any>("billPayment", billPayment);
  };

  /**
   * Creates the Class in QuickBooks
   *
   * @param classqb - The unsaved class, to be persisted in QuickBooks
   */
  createClass = (classqb: any) => {
    return this.create<any>("class", classqb);
  };

  /**
   * Creates the CreditMemo in QuickBooks
   *
   * @param  {object} creditMemo - The unsaved creditMemo, to be persisted in QuickBooks
   */
  createCreditMemo = (creditMemo: any) => {
    return this.create<any>("creditMemo", creditMemo);
  };

  /**
   * Creates the Customer in QuickBooks
   *
   * @param  {object} customer - The unsaved customer, to be persisted in QuickBooks
   */
  createCustomer = (customer: any) => {
    return this.create<any>("customer", customer);
  };

  /**
   * Creates the Department in QuickBooks
   *
   * @param  {object} department - The unsaved department, to be persisted in QuickBooks
   */
  createDepartment = (department: any) => {
    return this.create<any>("department", department);
  };

  /**
   * Creates the Deposit in QuickBooks
   *
   * @param  {object} deposit - The unsaved Deposit, to be persisted in QuickBooks
   */
  createDeposit = (deposit: any) => {
    return this.create<any>("deposit", deposit);
  };

  /**
   * Creates the Employee in QuickBooks
   *
   * @param  {object} employee - The unsaved employee, to be persisted in QuickBooks
   */
  createEmployee = (employee: any) => {
    return this.create<any>("employee", employee);
  };

  /**
   * Creates the Estimate in QuickBooks
   *
   * @param  {object} estimate - The unsaved estimate, to be persisted in QuickBooks
   */
  createEstimate = (estimate: any) => {
    return this.create<any>("estimate", estimate);
  };

  /**
   * Creates the Invoice in QuickBooks
   *
   * @param  {object} invoice - The unsaved invoice, to be persisted in QuickBooks
   */
  createInvoice = (invoice: any) => {
    return this.create<any>("invoice", invoice);
  };

  /**
   * Creates the Item in QuickBooks
   *
   * @param  {object} item - The unsaved item, to be persisted in QuickBooks
   */
  createItem = (item: any) => {
    return this.create<any>("item", item);
  };

  /**
   * Creates the JournalCode in QuickBooks
   *
   * @param  {object} journalCode - The unsaved journalCode, to be persisted in QuickBooks
   */
  createJournalCode = (journalCode: any) => {
    return this.create<any>("journalCode", journalCode);
  };

  /**
   * Creates the JournalEntry in QuickBooks
   *
   * @param  {object} journalEntry - The unsaved journalEntry, to be persisted in QuickBooks
   */
  createJournalEntry = (journalEntry: any) => {
    return this.create<any>("journalEntry", journalEntry);
  };

  /**
 * Creates the Payment in QuickBooks
 *
 * @param  {object} payment - The unsaved payment, to be persisted in QuickBooks

 */
  createPayment = (payment: any) => {
    return this.create<any>("payment", payment);
  };

  /**
   * Creates the PaymentMethod in QuickBooks
   *
   * @param  {object} paymentMethod - The unsaved paymentMethod, to be persisted in QuickBooks
   */
  createPaymentMethod = (paymentMethod: any) => {
    return this.create<any>("paymentMethod", paymentMethod);
  };

  /**
   * Creates the Purchase in QuickBooks
   *
   * @param  {object} purchase - The unsaved purchase, to be persisted in QuickBooks
   */
  createPurchase = (purchase: any) => {
    return this.create<any>("purchase", purchase);
  };

  /**
   * Creates the PurchaseOrder in QuickBooks
   *
   * @param  {object} purchaseOrder - The unsaved purchaseOrder, to be persisted in QuickBooks
   */
  createPurchaseOrder = (purchaseOrder: any) => {
    return this.create<any>("purchaseOrder", purchaseOrder);
  };

  /**
   * Creates the RefundReceipt in QuickBooks
   *
   * @param  {object} refundReceipt - The unsaved refundReceipt, to be persisted in QuickBooks
   */
  createRefundReceipt = (refundReceipt: any) => {
    return this.create<any>("refundReceipt", refundReceipt);
  };

  /**
   * Creates the SalesReceipt in QuickBooks
   *
   * @param  {object} salesReceipt - The unsaved salesReceipt, to be persisted in QuickBooks
   */
  createSalesReceipt = (salesReceipt: any) => {
    return this.create<any>("salesReceipt", salesReceipt);
  };

  /**
   * Creates the TaxAgency in QuickBooks
   *
   * @param  {object} taxAgency - The unsaved taxAgency, to be persisted in QuickBooks
   */
  createTaxAgency = (taxAgency: any) => {
    return this.create<any>("taxAgency", taxAgency);
  };

  /**
   * Creates the TaxService in QuickBooks
   *
   * @param  {object} taxService - The unsaved taxService, to be persisted in QuickBooks
   */
  createTaxService = (taxService: any) => {
    return this.create<any>("taxService/taxcode", taxService);
  };

  /**
   * Creates the Term in QuickBooks
   *
   * @param  {object} term - The unsaved term, to be persisted in QuickBooks
   */
  createTerm = (term: any) => {
    return this.create<any>("term", term);
  };

  /**
   * Creates the TimeActivity in QuickBooks
   *
   * @param  {object} timeActivity - The unsaved timeActivity, to be persisted in QuickBooks
   */
  createTimeActivity = (timeActivity: any) => {
    return this.create<any>("timeActivity", timeActivity);
  };

  /**
   * Creates the Transfer in QuickBooks
   *
   * @param  {object} transfer - The unsaved Transfer, to be persisted in QuickBooks
   */
  createTransfer = (transfer: any) => {
    return this.create<any>("transfer", transfer);
  };

  /**
   * Creates the Vendor in QuickBooks
   *
   * @param  {object} vendor - The unsaved vendor, to be persisted in QuickBooks
   */
  createVendor = (vendor: any) => {
    return this.create<any>("vendor", vendor);
  };

  /**
   * Creates the VendorCredit in QuickBooks
   *
   * @param  {object} vendorCredit - The unsaved vendorCredit, to be persisted in QuickBooks
   */
  createVendorCredit = (vendorCredit: any) => {
    return this.create<any>("vendorCredit", vendorCredit);
  };

  /**
   * Retrieves the Account from QuickBooks
   *
   * @param Id - The Id of persistent Account
   */
  getAccount = (id: string) => {
    return this.read<any>("account", id);
  };

  /**
   * Retrieves the Attachable from QuickBooks
   *
   * @param Id - The Id of persistent Attachable
   */
  getAttachable = (id: string) => {
    return this.read<any>("attachable", id);
  };

  /**
   * Retrieves the Bill from QuickBooks
   *
   * @param Id - The Id of persistent Bill
   */
  getBill = (id: string) => {
    return this.read<any>("bill", id);
  };

  /**
   * Retrieves the BillPayment from QuickBooks
   *
   * @param Id - The Id of persistent BillPayment
   */
  getBillPayment = (id: string) => {
    return this.read<any>("billPayment", id);
  };

  /**
   * Retrieves the Class from QuickBooks
   *
   * @param Id - The Id of persistent Class
   */
  getClass = (id: string) => {
    return this.read<any>("class", id);
  };

  /**
   * Retrieves the CompanyInfo from QuickBooks
   *
   * @param Id - The Id of persistent CompanyInfo
   */
  getCompanyInfo = (id: string) => {
    return this.read<any>("companyInfo", id);
  };

  /**
   * Retrieves the CreditMemo from QuickBooks
   *
   * @param Id - The Id of persistent CreditMemo
   */
  getCreditMemo = (id: string) => {
    return this.read<any>("creditMemo", id);
  };

  /**
   * Retrieves the Customer from QuickBooks
   *
   * @param Id - The Id of persistent Customer
   */
  getCustomer = (id: string) => {
    return this.read<any>("customer", id);
  };

  /**
   * Retrieves the Department from QuickBooks
   *
   * @param Id - The Id of persistent Department
   */
  getDepartment = (id: string) => {
    return this.read<any>("department", id);
  };

  /**
   * Retrieves the Deposit from QuickBooks
   *
   * @param Id - The Id of persistent Deposit
   */
  getDeposit = (id: string) => {
    return this.read<any>("deposit", id);
  };

  /**
   * Retrieves the Employee from QuickBooks
   *
   * @param Id - The Id of persistent Employee
   */
  getEmployee = (id: string) => {
    return this.read<any>("employee", id);
  };

  /**
   * Retrieves the Estimate from QuickBooks
   *
   * @param Id - The Id of persistent Estimate
   */
  getEstimate = (id: string) => {
    return this.read<any>("estimate", id);
  };

  /**
   * Retrieves an ExchangeRate from QuickBooks
   *
   * @param  {object} options - An object with options including the required `sourcecurrencycode` parameter and optional `asofdate` parameter.
   */
  getExchangeRate = (options: any) => {
    const url = "/exchangerate";
    return this.request("get", { url: url, qs: options }, null);
  };

  /**
   * Retrieves the Estimate PDF from QuickBooks
   *
   * @param Id - The Id of persistent Estimate
   */
  getEstimatePdf = (id: string) => {
    return this.requestPdf("Estimate", id);
  };

  /**
   * Emails the Estimate PDF from QuickBooks to the address supplied in Estimate.BillEmail.EmailAddress
   * or the specified 'sendTo' address
   *
   * @param Id - The Id of persistent Estimate
   * @param  {string} sendTo - optional email address to send the PDF to. If not provided, address supplied in Estimate.BillEmail.EmailAddress will be used
   */
  sendEstimatePdf = async (id: string, sendTo: string) => {
    const path = "/estimate/" + id + "/send";
    let qs: {
      sendTo?: string;
    } = {};
    if (sendTo) {
      qs.sendTo = sendTo;
    }
    const data = await this.request("post", { url: path, qs: qs }, null);
    return this.unwrap(data, "Estimate");
  };

  /**
   * Retrieves the Invoice from QuickBooks
   *
   * @param Id - The Id of persistent Invoice
   */
  getInvoice = (id: string) => {
    return this.read<any>("invoice", id);
  };

  /**
   * Retrieves the Invoice PDF from QuickBooks
   *
   * @param Id - The Id of persistent Invoice
   */
  getInvoicePdf = (id: string) => {
    return this.requestPdf("Invoice", id);
  };

  /**
   * Emails the Invoice PDF from QuickBooks to the address supplied in Invoice.BillEmail.EmailAddress
   * or the specified 'sendTo' address
   *
   * @param Id - The Id of persistent Invoice
   * @param  {string} sendTo - optional email address to send the PDF to. If not provided, address supplied in Invoice.BillEmail.EmailAddress will be used
   */
  sendInvoicePdf = async (id: string, sendTo: string) => {
    const path = "/invoice/" + id + "/send";
    let qs: {
      sendTo?: string;
    } = {};
    if (sendTo) {
      qs.sendTo = sendTo;
    }
    const data = await this.request("post", { url: path, qs: qs }, null);
    return this.unwrap(data, "Invoice");
  };

  /**
   * Retrieves the Item from QuickBooks
   *
   * @param Id - The Id of persistent Item
   */
  getItem = (id: string) => {
    return this.read<any>("item", id);
  };

  /**
   * Retrieves the JournalCode from QuickBooks
   *
   * @param Id - The Id of persistent JournalCode
   */
  getJournalCode = (id: string) => {
    return this.read<any>("journalCode", id);
  };

  /**
   * Retrieves the JournalEntry from QuickBooks
   *
   * @param Id - The Id of persistent JournalEntry
   */
  getJournalEntry = (id: string) => {
    return this.read<any>("journalEntry", id);
  };

  /**
   * Retrieves the Payment from QuickBooks
   *
   * @param Id - The Id of persistent Payment
   */
  getPayment = (id: string) => {
    return this.read<any>("payment", id);
  };

  /**
   * Retrieves the PaymentMethod from QuickBooks
   *
   * @param Id - The Id of persistent PaymentMethod
   */
  getPaymentMethod = (id: string) => {
    return this.read<any>("paymentMethod", id);
  };

  /**
   * Retrieves the Preferences from QuickBooks
   *
   */
  getPreferences = () => {
    return this.read<any>("preferences", null);
  };

  /**
   * Retrieves the Purchase from QuickBooks
   *
   * @param Id - The Id of persistent Purchase
   */
  getPurchase = (id: string) => {
    return this.read<any>("purchase", id);
  };

  /**
   * Retrieves the PurchaseOrder from QuickBooks
   *
   * @param Id - The Id of persistent PurchaseOrder
   */
  getPurchaseOrder = (id: string) => {
    return this.read<any>("purchaseOrder", id);
  };

  /**
   * Retrieves the RefundReceipt from QuickBooks
   *
   * @param Id - The Id of persistent RefundReceipt
   */
  getRefundReceipt = (id: string) => {
    return this.read<any>("refundReceipt", id);
  };

  /**
   * Retrieves the Reports from QuickBooks
   *
   * @param Id - The Id of persistent Reports
   */
  getReports = (id: string) => {
    return this.read<any>("reports", id);
  };

  /**
   * Retrieves the SalesReceipt from QuickBooks
   *
   * @param Id - The Id of persistent SalesReceipt
   */
  getSalesReceipt = (id: string) => {
    return this.read<any>("salesReceipt", id);
  };

  /**
   * Retrieves the SalesReceipt PDF from QuickBooks
   *
   * @param Id - The Id of persistent SalesReceipt
   */
  getSalesReceiptPdf = (id: string) => {
    return this.requestPdf("salesReceipt", id);
  };

  /**
   * Emails the SalesReceipt PDF from QuickBooks to the address supplied in SalesReceipt.BillEmail.EmailAddress
   * or the specified 'sendTo' address
   *
   * @param Id - The Id of persistent SalesReceipt
   * @param  {string} sendTo - optional email address to send the PDF to. If not provided, address supplied in SalesReceipt.BillEmail.EmailAddress will be used
   */
  sendSalesReceiptPdf = async (id: string, sendTo: string) => {
    const path = "/salesreceipt/" + id + "/send";
    let qs: {
      sendTo?: string;
    } = {};
    if (sendTo) {
      qs.sendTo = sendTo;
    }
    const data = await this.request("post", { url: path, qs: qs }, null);
    return this.unwrap(data, "SalesReceipt");
  };

  /**
   * Retrieves the TaxAgency from QuickBooks
   *
   * @param Id - The Id of persistent TaxAgency
   */
  getTaxAgency = (id: string) => {
    return this.read<any>("taxAgency", id);
  };

  /**
   * Retrieves the TaxCode from QuickBooks
   *
   * @param Id - The Id of persistent TaxCode
   */
  getTaxCode = (id: string) => {
    return this.read<any>("taxCode", id);
  };

  /**
   * Retrieves the TaxRate from QuickBooks
   *
   * @param Id - The Id of persistent TaxRate
   */
  getTaxRate = (id: string) => {
    return this.read<any>("taxRate", id);
  };

  /**
   * Retrieves the Term from QuickBooks
   *
   * @param Id - The Id of persistent Term
   */
  getTerm = (id: string) => {
    return this.read<any>("term", id);
  };

  /**
   * Retrieves the TimeActivity from QuickBooks
   *
   * @param Id - The Id of persistent TimeActivity
   */
  getTimeActivity = (id: string) => {
    return this.read<any>("timeActivity", id);
  };

  /**
   * Retrieves the Transfer from QuickBooks
   *
   * @param Id - The Id of persistent Term
   */
  getTransfer = (id: string) => {
    return this.read<any>("transfer", id);
  };

  /**
   * Retrieves the Vendor from QuickBooks
   *
   * @param Id - The Id of persistent Vendor
   */
  getVendor = (id: string) => {
    return this.read<any>("vendor", id);
  };

  /**
   * Retrieves the VendorCredit from QuickBooks
   *
   * @param Id - The Id of persistent VendorCredit
   */
  getVendorCredit = (id: string) => {
    return this.read<any>("vendorCredit", id);
  };

  /**
   * Updates QuickBooks version of Account
   *
   * @param account - The persistent Account, including Id and SyncToken fields
   */
  updateAccount = (account: any) => {
    return this.update<any>("account", account);
  };

  /**
   * Updates QuickBooks version of Bill
   *
   * @param bill - The persistent Bill, including Id and SyncToken fields
   */
  updateBill = (bill: any) => {
    return this.update<any>("bill", bill);
  };

  /**
   * Updates QuickBooks version of BillPayment
   *
   * @param billPayment - The persistent BillPayment, including Id and SyncToken fields
   */
  updateBillPayment = (billPayment: any) => {
    return this.update<any>("billPayment", billPayment);
  };

  /**
   * Updates QuickBooks version of Class
   *
   * @param classqb - The persistent Class, including Id and SyncToken fields
   */
  updateClass = (classqb: any) => {
    return this.update<any>("class", classqb);
  };

  /**
   * Updates QuickBooks version of CompanyInfo
   *
   * @param companyInfo - The persistent CompanyInfo, including Id and SyncToken fields
   */
  updateCompanyInfo = (companyInfo: any) => {
    return this.update<any>("companyInfo", companyInfo);
  };

  /**
   * Updates QuickBooks version of CreditMemo
   *
   * @param creditMemo - The persistent CreditMemo, including Id and SyncToken fields
   */
  updateCreditMemo = (creditMemo: any) => {
    return this.update<any>("creditMemo", creditMemo);
  };

  /**
   * Updates QuickBooks version of Customer
   *
   * @param customer - The persistent Customer, including Id and SyncToken fields
   */
  updateCustomer = (customer: any) => {
    return this.update<any>("customer", customer);
  };

  /**
   * Updates QuickBooks version of Department
   *
   * @param department - The persistent Department, including Id and SyncToken fields
   */
  updateDepartment = (department: any) => {
    return this.update<any>("department", department);
  };

  /**
   * Updates QuickBooks version of Deposit
   *
   * @param deposit - The persistent Deposit, including Id and SyncToken fields
   */
  updateDeposit = (deposit: any) => {
    return this.update<any>("deposit", deposit);
  };

  /**
   * Updates QuickBooks version of Employee
   *
   * @param employee - The persistent Employee, including Id and SyncToken fields
   */
  updateEmployee = (employee: any) => {
    return this.update<any>("employee", employee);
  };

  /**
   * Updates QuickBooks version of Estimate
   *
   * @param estimate - The persistent Estimate, including Id and SyncToken fields
   */
  updateEstimate = (estimate: any) => {
    return this.update<any>("estimate", estimate);
  };

  /**
   * Updates QuickBooks version of Invoice
   *
   * @param invoice - The persistent Invoice, including Id and SyncToken fields
   */
  updateInvoice = (invoice: any) => {
    return this.update<any>("invoice", invoice);
  };

  /**
   * Updates QuickBooks version of Item
   *
   * @param item - The persistent Item, including Id and SyncToken fields
   */
  updateItem = (item: any) => {
    return this.update<any>("item", item);
  };

  /**
   * Updates QuickBooks version of JournalCode
   *
   * @param journalCode - The persistent JournalCode, including Id and SyncToken fields
   */
  updateJournalCode = (journalCode: any) => {
    return this.update<any>("journalCode", journalCode);
  };

  /**
   * Updates QuickBooks version of JournalEntry
   *
   * @param journalEntry - The persistent JournalEntry, including Id and SyncToken fields
   */
  updateJournalEntry = (journalEntry: any) => {
    return this.update<any>("journalEntry", journalEntry);
  };

  /**
   * Updates QuickBooks version of Payment
   *
   * @param payment - The persistent Payment, including Id and SyncToken fields
   */
  updatePayment = (payment: any) => {
    return this.update<any>("payment", payment);
  };

  /**
   * Updates QuickBooks version of PaymentMethod
   *
   * @param paymentMethod - The persistent PaymentMethod, including Id and SyncToken fields
   */
  updatePaymentMethod = (paymentMethod: any) => {
    return this.update<any>("paymentMethod", paymentMethod);
  };

  /**
   * Updates QuickBooks version of Preferences
   *
   * @param preferences - The persistent Preferences, including Id and SyncToken fields
   */
  updatePreferences = (preferences: any) => {
    return this.update<any>("preferences", preferences);
  };

  /**
   * Updates QuickBooks version of Purchase
   *
   * @param purchase - The persistent Purchase, including Id and SyncToken fields
   */
  updatePurchase = (purchase: any) => {
    return this.update<any>("purchase", purchase);
  };

  /**
   * Updates QuickBooks version of PurchaseOrder
   *
   * @param purchaseOrder - The persistent PurchaseOrder, including Id and SyncToken fields
   */
  updatePurchaseOrder = (purchaseOrder: any) => {
    return this.update<any>("purchaseOrder", purchaseOrder);
  };

  /**
   * Updates QuickBooks version of RefundReceipt
   *
   * @param refundReceipt - The persistent RefundReceipt, including Id and SyncToken fields
   */
  updateRefundReceipt = (refundReceipt: any) => {
    return this.update<any>("refundReceipt", refundReceipt);
  };

  /**
   * Updates QuickBooks version of SalesReceipt
   *
   * @param salesReceipt - The persistent SalesReceipt, including Id and SyncToken fields
   */
  updateSalesReceipt = (salesReceipt: any) => {
    return this.update<any>("salesReceipt", salesReceipt);
  };

  /**
   * Updates QuickBooks version of TaxAgency
   *
   * @param taxAgency - The persistent TaxAgency, including Id and SyncToken fields
   */
  updateTaxAgency = (taxAgency: any) => {
    return this.update<any>("taxAgency", taxAgency);
  };

  /**
   * Updates QuickBooks version of TaxCode
   *
   * @param taxCode - The persistent TaxCode, including Id and SyncToken fields
   */
  updateTaxCode = (taxCode: any) => {
    return this.update<any>("taxCode", taxCode);
  };

  /**
   * Updates QuickBooks version of TaxRate
   *
   * @param taxRate - The persistent TaxRate, including Id and SyncToken fields
   */
  updateTaxRate = (taxRate: any) => {
    return this.update<any>("taxRate", taxRate);
  };

  /**
   * Updates QuickBooks version of Term
   *
   * @param term - The persistent Term, including Id and SyncToken fields
   */
  updateTerm = (term: any) => {
    return this.update<any>("term", term);
  };

  /**
   * Updates QuickBooks version of TimeActivity
   *
   * @param timeActivity - The persistent TimeActivity, including Id and SyncToken fields
   */
  updateTimeActivity = (timeActivity: any) => {
    return this.update<any>("timeActivity", timeActivity);
  };

  /**
   * Updates QuickBooks version of Transfer
   *
   * @param Transfer - The persistent Transfer, including Id and SyncToken fields
   */
  updateTransfer = (transfer: any) => {
    return this.update<any>("transfer", transfer);
  };

  /**
   * Updates QuickBooks version of Vendor
   *
   * @param vendor - The persistent Vendor, including Id and SyncToken fields
   */
  updateVendor = (vendor: any) => {
    return this.update<any>("vendor", vendor);
  };

  /**
   * Updates QuickBooks version of VendorCredit
   *
   * @param vendorCredit - The persistent VendorCredit, including Id and SyncToken fields
   */
  updateVendorCredit = (vendorCredit: any) => {
    return this.update<any>("vendorCredit", vendorCredit);
  };

  /**
   * Updates QuickBooks version of ExchangeRate
   *
   * @param exchangeRate - The persistent ExchangeRate, including Id and SyncToken fields
   */
  updateExchangeRate = (exchangeRate: any) => {
    return this.update<any>("exchangerate", exchangeRate);
  };

  /**
   * Deletes the Attachable from QuickBooks
   *
   * @param idOrEntity - The persistent Attachable to be deleted, or the Id of the Attachable, in which case an extra GET request will be issued to first retrieve the Attachable
   */
  deleteAttachable = (idOrEntity: any) => {
    return this.delete("attachable", idOrEntity);
  };

  /**
   * Deletes the Bill from QuickBooks
   *
   * @param idOrEntity - The persistent Bill to be deleted, or the Id of the Bill, in which case an extra GET request will be issued to first retrieve the Bill
   */
  deleteBill = (idOrEntity: any) => {
    return this.delete("bill", idOrEntity);
  };

  /**
   * Deletes the BillPayment from QuickBooks
   *
   * @param idOrEntity - The persistent BillPayment to be deleted, or the Id of the BillPayment, in which case an extra GET request will be issued to first retrieve the BillPayment
   */
  deleteBillPayment = (idOrEntity: any) => {
    return this.delete("billPayment", idOrEntity);
  };

  /**
   * Deletes the CreditMemo from QuickBooks
   *
   * @param idOrEntity - The persistent CreditMemo to be deleted, or the Id of the CreditMemo, in which case an extra GET request will be issued to first retrieve the CreditMemo
   */
  deleteCreditMemo = (idOrEntity: any) => {
    return this.delete("creditMemo", idOrEntity);
  };

  /**
   * Deletes the Deposit from QuickBooks
   *
   * @param idOrEntity - The persistent Deposit to be deleted, or the Id of the Deposit, in which case an extra GET request will be issued to first retrieve the Deposit
   */
  deleteDeposit = (idOrEntity: any) => {
    return this.delete("deposit", idOrEntity);
  };

  /**
   * Deletes the Estimate from QuickBooks
   *
   * @param idOrEntity - The persistent Estimate to be deleted, or the Id of the Estimate, in which case an extra GET request will be issued to first retrieve the Estimate
   */
  deleteEstimate = (idOrEntity: any) => {
    return this.delete("estimate", idOrEntity);
  };

  /**
   * Deletes the Invoice from QuickBooks
   *
   * @param idOrEntity - The persistent Invoice to be deleted, or the Id of the Invoice, in which case an extra GET request will be issued to first retrieve the Invoice
   */
  deleteInvoice = (idOrEntity: any) => {
    return this.delete("invoice", idOrEntity);
  };

  /**
   * Deletes the JournalCode from QuickBooks
   *
   * @param idOrEntity - The persistent JournalCode to be deleted, or the Id of the JournalCode, in which case an extra GET request will be issued to first retrieve the JournalCode
   */
  deleteJournalCode = (idOrEntity: any) => {
    return this.delete("journalCode", idOrEntity);
  };

  /**
   * Deletes the JournalEntry from QuickBooks
   *
   * @param idOrEntity - The persistent JournalEntry to be deleted, or the Id of the JournalEntry, in which case an extra GET request will be issued to first retrieve the JournalEntry
   */
  deleteJournalEntry = (idOrEntity: any) => {
    return this.delete("journalEntry", idOrEntity);
  };

  /**
   * Deletes the Payment from QuickBooks
   *
   * @param idOrEntity - The persistent Payment to be deleted, or the Id of the Payment, in which case an extra GET request will be issued to first retrieve the Payment
   */
  deletePayment = (idOrEntity: any) => {
    return this.delete("payment", idOrEntity);
  };

  /**
   * Deletes the Purchase from QuickBooks
   *
   * @param idOrEntity - The persistent Purchase to be deleted, or the Id of the Purchase, in which case an extra GET request will be issued to first retrieve the Purchase
   */
  deletePurchase = (idOrEntity: any) => {
    return this.delete("purchase", idOrEntity);
  };

  /**
   * Deletes the PurchaseOrder from QuickBooks
   *
   * @param idOrEntity - The persistent PurchaseOrder to be deleted, or the Id of the PurchaseOrder, in which case an extra GET request will be issued to first retrieve the PurchaseOrder
   */
  deletePurchaseOrder = (idOrEntity: any) => {
    return this.delete("purchaseOrder", idOrEntity);
  };

  /**
   * Deletes the RefundReceipt from QuickBooks
   *
   * @param idOrEntity - The persistent RefundReceipt to be deleted, or the Id of the RefundReceipt, in which case an extra GET request will be issued to first retrieve the RefundReceipt
   */
  deleteRefundReceipt = (idOrEntity: any) => {
    return this.delete("refundReceipt", idOrEntity);
  };

  /**
   * Deletes the SalesReceipt from QuickBooks
   *
   * @param idOrEntity - The persistent SalesReceipt to be deleted, or the Id of the SalesReceipt, in which case an extra GET request will be issued to first retrieve the SalesReceipt
   */
  deleteSalesReceipt = (idOrEntity: any) => {
    return this.delete("salesReceipt", idOrEntity);
  };

  /**
   * Deletes the TimeActivity from QuickBooks
   *
   * @param idOrEntity - The persistent TimeActivity to be deleted, or the Id of the TimeActivity, in which case an extra GET request will be issued to first retrieve the TimeActivity
   */
  deleteTimeActivity = (idOrEntity: any) => {
    return this.delete("timeActivity", idOrEntity);
  };

  /**
   * Deletes the Transfer from QuickBooks
   *
   * @param idOrEntity - The persistent Transfer to be deleted, or the Id of the Transfer, in which case an extra GET request will be issued to first retrieve the Transfer
   */
  deleteTransfer = (idOrEntity: any) => {
    return this.delete("transfer", idOrEntity);
  };

  /**
   * Deletes the VendorCredit from QuickBooks
   *
   * @param idOrEntity - The persistent VendorCredit to be deleted, or the Id of the VendorCredit, in which case an extra GET request will be issued to first retrieve the VendorCredit
   */
  deleteVendorCredit = (idOrEntity: any) => {
    return this.delete("vendorCredit", idOrEntity);
  };

  /**
   * Voids the Invoice from QuickBooks
   *
   * @param idOrEntity - The persistent Invoice to be voided, or the Id of the Invoice, in which case an extra GET request will be issued to first retrieve the Invoice
   */
  voidInvoice = (idOrEntity: any) => {
    return this.void("invoice", idOrEntity);
  };

  /**
   * Voids QuickBooks version of Payment
   *
   * @param payment - The persistent Payment, including Id and SyncToken fields
   */
  voidPayment = (payment: any) => {
    payment.void = true;
    payment.sparse = true;
    return this.update("payment", payment);
  };

  /**
   * Finds all Accounts in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findAccounts = (criteria?: QueryInput) => {
    return this.query("account", criteria);
  };

  /**
   * Finds all Attachables in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findAttachables = (criteria?: QueryInput) => {
    return this.query("attachable", criteria);
  };

  /**
   * Finds all Bills in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findBills = (criteria?: QueryInput) => {
    return this.query("bill", criteria);
  };

  /**
   * Finds all BillPayments in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findBillPayments = (criteria?: QueryInput) => {
    return this.query("billPayment", criteria);
  };

  /**
   * Finds all Budgets in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findBudgets = (criteria?: QueryInput) => {
    return this.query("budget", criteria);
  };

  /**
   * Finds all Classs in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findClasses = (criteria?: QueryInput) => {
    return this.query("class", criteria);
  };

  /**
   * Finds all CompanyInfos in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findCompanyInfos = (criteria?: QueryInput) => {
    return this.query("companyInfo", criteria);
  };

  /**
   * Finds all CreditMemos in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findCreditMemos = (criteria?: QueryInput) => {
    return this.query("creditMemo", criteria);
  };

  /**
   * Finds all Customers in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findCustomers = (criteria?: QueryInput) => {
    return this.query("customer", criteria);
  };

  /**
   * Finds all Departments in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findDepartments = (criteria?: QueryInput) => {
    return this.query("department", criteria);
  };

  /**
   * Finds all Deposits in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findDeposits = (criteria?: QueryInput) => {
    return this.query("deposit", criteria);
  };

  /**
   * Finds all Employees in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findEmployees = (criteria?: QueryInput) => {
    return this.query("employee", criteria);
  };

  /**
   * Finds all Estimates in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findEstimates = (criteria?: QueryInput) => {
    return this.query("estimate", criteria);
  };

  /**
   * Finds all Invoices in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findInvoices = (criteria?: QueryInput) => {
    return this.query("invoice", criteria);
  };

  /**
   * Finds all Items in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findItems = (criteria?: QueryInput) => {
    return this.query("item", criteria);
  };

  /**
   * Finds all JournalCodes in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findJournalCodes = (criteria?: QueryInput) => {
    return this.query("journalCode", criteria);
  };

  /**
   * Finds all JournalEntrys in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findJournalEntries = (criteria?: QueryInput) => {
    return this.query("journalEntry", criteria);
  };

  /**
   * Finds all Payments in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findPayments = (criteria?: QueryInput) => {
    return this.query("payment", criteria);
  };

  /**
   * Finds all PaymentMethods in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findPaymentMethods = (criteria?: QueryInput) => {
    return this.query("paymentMethod", criteria);
  };

  /**
   * Finds all Preferencess in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findPreferenceses = (criteria?: QueryInput) => {
    return this.query("preferences", criteria);
  };

  /**
   * Finds all Purchases in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findPurchases = (criteria?: QueryInput) => {
    return this.query("purchase", criteria);
  };

  /**
   * Finds all PurchaseOrders in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findPurchaseOrders = (criteria?: QueryInput) => {
    return this.query("purchaseOrder", criteria);
  };

  /**
   * Finds all RefundReceipts in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findRefundReceipts = (criteria?: QueryInput) => {
    return this.query("refundReceipt", criteria);
  };

  /**
   * Finds all SalesReceipts in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findSalesReceipts = (criteria?: QueryInput) => {
    return this.query("salesReceipt", criteria);
  };

  /**
   * Finds all TaxAgencys in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findTaxAgencies = (criteria?: QueryInput) => {
    return this.query("taxAgency", criteria);
  };

  /**
   * Finds all TaxCodes in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findTaxCodes = (criteria?: QueryInput) => {
    return this.query("taxCode", criteria);
  };

  /**
   * Finds all TaxRates in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findTaxRates = (criteria?: QueryInput) => {
    return this.query("taxRate", criteria);
  };

  /**
   * Finds all Terms in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findTerms = (criteria?: QueryInput) => {
    return this.query("term", criteria);
  };

  /**
   * Finds all TimeActivitys in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findTimeActivities = (criteria?: QueryInput) => {
    return this.query("timeActivity", criteria);
  };

  /**
   * Finds all Transfers in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findTransfers = (criteria?: QueryInput) => {
    return this.query("transfer", criteria);
  };

  /**
   * Finds all Vendors in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findVendors = (criteria?: QueryInput) => {
    return this.query("vendor", criteria);
  };

  /**
   * Finds all VendorCredits in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findVendorCredits = (criteria?: QueryInput) => {
    return this.query("vendorCredit", criteria);
  };

  /**
   * Finds all ExchangeRates in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findExchangeRates = (criteria?: QueryInput) => {
    return this.query("exchangerate", criteria);
  };

  /**
   * Retrieves the BalanceSheet Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportBalanceSheet = (options?: any) => {
    return this.report<any>("BalanceSheet", options);
  };

  /**
   * Retrieves the ProfitAndLoss Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportProfitAndLoss = (options?: any) => {
    return this.report<any>("ProfitAndLoss", options);
  };

  /**
   * Retrieves the ProfitAndLossDetail Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportProfitAndLossDetail = (options?: any) => {
    return this.report<any>("ProfitAndLossDetail", options);
  };

  /**
   * Retrieves the TrialBalance Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportTrialBalance = (options?: any) => {
    return this.report<any>("TrialBalance", options);
  };

  /**
   * Retrieves the CashFlow Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportCashFlow = (options?: any) => {
    return this.report<any>("CashFlow", options);
  };

  /**
   * Retrieves the InventoryValuationSummary Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportInventoryValuationSummary = (options?: any) => {
    return this.report<any>("InventoryValuationSummary", options);
  };

  /**
   * Retrieves the CustomerSales Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportCustomerSales = (options?: any) => {
    return this.report<any>("CustomerSales", options);
  };

  /**
   * Retrieves the ItemSales Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportItemSales = (options?: any) => {
    return this.report<any>("ItemSales", options);
  };

  /**
   * Retrieves the CustomerIncome Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportCustomerIncome = (options?: any) => {
    return this.report<any>("CustomerIncome", options);
  };

  /**
   * Retrieves the CustomerBalance Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportCustomerBalance = (options?: any) => {
    return this.report<any>("CustomerBalance", options);
  };

  /**
   * Retrieves the CustomerBalanceDetail Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportCustomerBalanceDetail = (options?: any) => {
    return this.report<any>("CustomerBalanceDetail", options);
  };

  /**
   * Retrieves the AgedReceivables Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportAgedReceivables = (options?: any) => {
    return this.report<any>("AgedReceivables", options);
  };

  /**
   * Retrieves the AgedReceivableDetail Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportAgedReceivableDetail = (options?: any) => {
    return this.report<any>("AgedReceivableDetail", options);
  };

  /**
   * Retrieves the VendorBalance Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportVendorBalance = (options?: any) => {
    return this.report<any>("VendorBalance", options);
  };

  /**
   * Retrieves the VendorBalanceDetail Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportVendorBalanceDetail = (options?: any) => {
    return this.report<any>("VendorBalanceDetail", options);
  };

  /**
   * Retrieves the AgedPayables Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportAgedPayables = (options?: any) => {
    return this.report<any>("AgedPayables", options);
  };

  /**
   * Retrieves the AgedPayableDetail Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportAgedPayableDetail = (options?: any) => {
    return this.report<any>("AgedPayableDetail", options);
  };

  /**
   * Retrieves the VendorExpenses Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportVendorExpenses = (options?: any) => {
    return this.report<any>("VendorExpenses", options);
  };

  /**
   * Retrieves the TransactionList Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportTransactionList = (options?: any) => {
    return this.report<any>("TransactionList", options);
  };

  /**
   * Retrieves the GeneralLedgerDetail Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportGeneralLedgerDetail = (options?: any) => {
    return this.report<any>("GeneralLedger", options);
  };

  /**
   * Retrieves the TaxSummary Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportTaxSummary = (options?: any) => {
    return this.report<any>("TaxSummary", options);
  };

  /**
   * Retrieves the DepartmentSales Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportDepartmentSales = (options?: any) => {
    return this.report<any>("DepartmentSales", options);
  };

  /**
   * Retrieves the ClassSales Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportClassSales = (options?: any) => {
    return this.report<any>("ClassSales", options);
  };

  /**
   * Retrieves the AccountListDetail Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportAccountListDetail = (options?: any) => {
    return this.report<any>("AccountList", options);
  };
}

export default Quickbooks;
export { Quickbooks };
