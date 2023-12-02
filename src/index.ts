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
import _, { any } from "underscore";
import qs from "qs";
import jwt from "jsonwebtoken";
import fetch, { Response } from "node-fetch";
import FormData from "form-data";
import Tokens from "csrf";
import crypto from "crypto";
import {
  dateNotExpired,
  getAuthBase64,
  getConfigWithStoreMethod,
  getDateCheck,
  getDateString,
  getQueryString,
} from "./helpers";
import { QuickbooksTypes } from "./qbTypes";

const csrf = new Tokens();

export interface WebhookEntity {
  /** The name of the entity that changed (customer, Invoice, etc.) */
  name: EntityName;
  /** The ID of the changed entity */
  id: string;
  /** The type of change */
  operation: "Create" | "Update" | "Delete" | "Merge" | "Void";
  /** The latest timestamp in UTC */
  lastUpdated: string;
  /** The ID of the deleted or merged entity (this only applies to merge events) */
  deletedID?: string;
}

type QuickbooksTypesKeys = keyof QuickbooksTypes;
type QuickbooksTypesArrayed = {
  [P in QuickbooksTypesKeys]: QuickbooksTypes[P][];
};

export interface WebhookEventNotification {
  realmId: string;
  dataChangeEvent: {
    entities: WebhookEntity[];
  };
}

export interface WebhookPayload {
  eventNotifications: WebhookEventNotification[]
}

export interface TokenData {
  access_token: string;
  token_type: string; // 'bearer',
  x_refresh_token_expires_in: number; // 8726400,
  refresh_token: string;
  id_token?: string; // (Optional) Used only for user OpenID verification
  expires_in: 3600;
}

export interface TokenExtraFields {
  access_expire_timestamp?: number | Date;
  refresh_expire_timestamp?: number | Date;
}
export interface RealmTokenData {
  realmID: number | string;
  /** @deprecated - data is just joined with realm and no longer a seperate property */
  token: TokenData;
}

export interface StoreTokenData extends Partial<TokenData> {
  realmID?: number | string;
  access_token: string;
  access_expire_timestamp?: number | Date;
  refresh_expire_timestamp?: number | Date;
}

export interface StoreSaveTokenData extends StoreTokenData, RealmTokenData {
  realmID: number | string;
  access_token: string;
  access_expire_timestamp?: number | Date;
  refresh_expire_timestamp?: number | Date;
}

export interface StoreGetTokenData {
  realmID: number | string;
}

export interface QBStoreStrategy {
  getQBToken(storeGetTokenData: StoreGetTokenData, appConfig: AppConfigClean, extra: any): Promise<StoreTokenData>;
  storeQBToken(storeSaveTokenData: StoreSaveTokenData, appConfig: AppConfigClean, extra: any): Promise<StoreTokenData>;
}

export class DefaultStore implements QBStoreStrategy {
  realmInfo: { [key: string]: StoreTokenData } = {};
  constructor() {
    this.realmInfo = {};
  }
  getQBToken(getTokenData: StoreGetTokenData) {
    const realmID = getTokenData.realmID.toString();
    if (!this.realmInfo[realmID]) {
      return Promise.reject("missing realm informaiton");
    }

    const token = this.realmInfo[realmID];
    if (!token) {
      return Promise.reject("Realm token information is missing");
    }

    return Promise.resolve(token)
  }
  storeQBToken(storeTokenData: StoreTokenData) {
    const realmID = storeTokenData.realmID.toString();
    this.realmInfo[realmID] = storeTokenData;
    return Promise.resolve(storeTokenData)

  }
}

// missing Batch?

export enum EntityName {
  Account = "Account",
  Attachable = "Attachable",
  Bill = "Bill",
  BillPayment = "BillPayment",
  Budget = "Budget",
  Class = "Class",
  CreditMemo = "CreditMemo",
  CompanyInfo = "CompanyInfo",
  Customer = "Customer",
  Department = "Department",
  Deposit = "Deposit",
  Employee = "Employee",
  Estimate = "Estimate",
  Exchangerate = "Exchangerate",
  Invoice = "Invoice",
  Item = "Item",
  JournalCode = "JournalCode",
  JournalEntry = "JournalEntry",
  Payment = "Payment",
  PaymentMethod = "PaymentMethod",
  Preferences = "Preferences",
  Purchase = "Purchase",
  PurchaseOrder = "PurchaseOrder",
  RefundReceipt = "RefundReceipt",
  SalesReceipt = "SalesReceipt",
  TaxAgency = "TaxAgency",
  TaxService = "TaxService",
  TaxCode = "TaxCode",
  TaxRate = "TaxRate",
  Term = "Term",
  TimeActivity = "TimeActivity",
  Transfer = "Transfer",
  Vendor = "Vendor",
  VendorCredit = "VendorCredit",
  // Reports = "Reports"
}

export enum ReportName {
  AccountList = "AccountList",
  AgedPayableDetail = "AgedPayableDetail",
  AgedPayables = "AgedPayables",
  AgedReceivableDetail = "AgedReceivableDetail",
  AgedReceivables = "AgedReceivables",
  BalanceSheet = "BalanceSheet",
  CashFlow = "CashFlow",
  ClassSales = "ClassSales",
  CustomerBalance = "CustomerBalance",
  CustomerBalanceDetail = "CustomerBalanceDetail",
  CustomerIncome = "CustomerIncome",
  CustomerSales = "CustomerSales",
  DepartmentSales = "DepartmentSales",
  GeneralLedger = "GeneralLedger",
  InventoryValuationSummary = "InventoryValuationSummary",
  ItemSales = "ItemSales",
  ProfitAndLoss = "ProfitAndLoss",
  ProfitAndLossDetail = "ProfitAndLossDetail",
  TaxSummary = "TaxSummary",
  TransactionList = "TransactionList",
  TrialBalance = "TrialBalance",
  VendorBalance = "VendorBalance",
  VendorBalanceDetail = "VendorBalanceDetail",
  VendorExpenses = "VendorExpenses",
}

export type CreateInput<T extends keyof QuickbooksTypes> = Partial<
  QuickbooksTypes[T]
>;

export type UpdateInput<T extends keyof QuickbooksTypes> = Partial<
  QuickbooksTypes[T]
>;

export type DeleteInput<T extends keyof QuickbooksTypes> =
  | number
  | string
  | Partial<QuickbooksTypes[T]>;

export interface RequestOptions {
  url: string;
  qs?: Record<string, any>;
  headers?: object;
  fullurl?: boolean;
  formData?: FormData;
  returnHeadersInBody?: boolean;
}

interface BaseRequest {
  time: string;
}

interface HeaderAdditions {
  specialHeaders: {
    intuitTid: string;
    server: string;
    qboVersion: string;
    expires: string;
    date: string;
  }
}

type QueryRequest<K extends keyof QuickbooksTypes> = {
  startPosition: number;
  totalCount: number;
  maxResults: number;
} & Record<K, Array<QuickbooksTypes[K]>>

type QueryResponse<K extends keyof QuickbooksTypes> = {
  QueryResponse: {
    [P in keyof (QueryRequest<K>)]?: (QueryRequest<K>)[P];
  }
  time: string;
}

export interface CriteriaItem {
  field: string;
  value: string;
  operator?: "IN" | "=" | "<" | ">" | "<=" | ">=" | "LIKE" | null;
  /**
   * @deprecated The method should not be used
   */
  count?: boolean;
}

export type QuerySortInput = ([string, "ASC" | "DESC" | null] | string)[] | [string, "ASC" | "DESC" | null] | string;

export type QuerySort = [string, "ASC" | "DESC"][];

export interface QueryBase {
  limit?: number;
  offset?: number;
  asc?: string;
  desc?: string;
  sort?: QuerySort;
  fetchAll?: boolean;
  /**
   * @deprecated The method should not be used
   */
  count?: boolean;
}

export interface QueryData extends QueryBase {
  items?: CriteriaItem[];
}

export interface QueryDataWithProperties {
  limit?: number;
  offset?: number;
  asc?: string;
  desc?: string;
  fetchAll?: boolean;
  sort?: QuerySortInput;
  items?: CriteriaItem[];
  /**
 * @deprecated The method should not be used
 */
  count?: boolean;
  [key: string]: any;
}

export type QueryInput =
  | string
  | QueryDataWithProperties
  | CriteriaItem
  | CriteriaItem[];

interface GetExchangeRateOptions {
  /** Currency code, 3 characters */
  sourceCurrencyCode: string;
  /** yyyy-mm-dd. if not given will use current date */
  asOfDate?: string;
}

type DeleteResponse<K extends keyof QuickbooksTypes> = Record<K, {
  status: string
  domain: string
  Id: string
}>;

type DeleteNewResponse<K extends keyof QuickbooksTypes> = {
  [P in keyof (BaseRequest & HeaderAdditions & DeleteResponse<K>)]: (BaseRequest & HeaderAdditions & DeleteResponse<K>)[P];
}

export interface AttachableResponseData {
  AttachableResponse: {
    Attachable: {
      Id: string;
      SyncToken: string;
      [module: string]: any;
    };
    time: string;
  };
}

class QBFetchError extends Error {
  response: Response;
  constructor(msg: string, response: Response) {
    super(msg);
    this.response = response;
  }
}

interface ResponseErrorJson {
  warnings: null | any;
  intuitObject: null | any;
  fault: {
    error: {
      message: string;
      detail: string;
      code: string;
      element: null | any;
    }[];
    type: string;
  };
  report: null | any;
  queryResponse: null | any;
  batchItemResponse: any[];
  attachableResponse: any[];
  syncErrorResponse: null | any;
  requestId: null | any;
  time: number;
  status: null | any;
  cdcresponse: any[];
}

class QBResponseError extends Error {
  errorResponse: ResponseErrorJson;
  constructor(msg: string, errorResponse: ResponseErrorJson) {
    super(msg);
    this.errorResponse = errorResponse;
  }
}

interface AppConfigBase {
  /** Required for token management such as creating, refreshing or revoking tokens.  not needed if supplying a token and just need to hit normal endpoints */
  appKey?: string;
  /** Required for token management such as creating, refreshing or revoking tokens.  not needed if supplying a token and just need to hit normal endpoints */
  appSecret?: string;
  /** Required if using Oauth flow.  Must be the same as the url put on the quickbooks developer portal */
  redirectUrl?: string;
  /** Required if using Oauth flow. */
  scope?: string[];
  /** null for latest version */
  minorversion?: number | null;
  /** Used for verifying the webook */
  webhookVerifierToken?: string;
  /** default is false */
  useProduction?: string | boolean;
  /** default is false */
  debug?: boolean | string;
  /** CSRF Token */
  state?: string;
  /** default is true, will auto refresh auth token if about to expire */
  autoRefresh?: boolean;
  /**
   * number of seconds before token expires that will trigger to get a new token
   *
   * defualt is 60 seconds (1 minute)
   */
  autoRefreshBufferSeconds?: number;
}

export type StoreMethod = 'Class' | 'Function' | 'Internal';

export interface AppConfigStoreInternal {
  accessToken?: string;
  refreshToken?: string;
}

export interface AppConfigStoreClass {
  storeStrategy: QBStoreStrategy;
}

export interface AppConfigStoreFunctions {
  saveToken: (realmId: number | string, saveTokenData: StoreTokenData, appConfig: AppConfigClean, extra: any) => Promise<StoreTokenData>;
  getToken: (realmId: number | string, appConfig: AppConfigClean, extra: any) => Promise<StoreTokenData>;
}

export type AppConfig = AppConfigBase &
  (AppConfigStoreInternal | AppConfigStoreClass | AppConfigStoreFunctions);

interface AppConfigCleanInternal extends AppConfigStoreInternal {
  storeMethod: 'Internal';
}

interface AppConfigCleanClass extends AppConfigStoreClass {
  storeMethod: 'Class';
}

interface AppConfigCleanFunctions extends AppConfigStoreFunctions {
  storeMethod: 'Function';
}

export interface AppConfigCleanBase extends AppConfigBase {
  useProduction: boolean;
  debug: boolean;
  autoRefresh: boolean;
  autoRefreshBufferSeconds: number;
  endpoint: string;
}

export type AppConfigClean = AppConfigCleanBase &
  (AppConfigCleanInternal | AppConfigCleanClass | AppConfigCleanFunctions);

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
  static EXPIRATION_BUFFER_SECONDS = 60; // 1 minute buffer
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

  config: AppConfigClean;
  realmID: number | string;
  storeTokenData?: StoreTokenData;
  useProduction: boolean;
  extra: any;

  /**
   * Node.js client encapsulating access to the QuickBooks V3 Rest API. An instance
   * of this class should be instantiated on behalf of each user and company accessing the api.
   */
  constructor(appConfig: AppConfig, realmID: string | number, extra?: any) {
    if (!realmID) throw new Error("realmID is required");
    const checkedAppConfig = getConfigWithStoreMethod(appConfig);

    if (checkedAppConfig.autoRefresh && (!checkedAppConfig.appKey || !checkedAppConfig.appSecret)) {
      throw new Error("appKey and appSecret are required for autoRefresh");
    }

    this.config = checkedAppConfig;
    this.extra = extra;
    this.realmID = realmID;

    if (this.config.storeMethod === 'Internal') {
      this.storeTokenData = {
        realmID: realmID,
        access_token: this.config.accessToken,
        refresh_token: this.config.refreshToken,
      }
    }

    if ("production" !== process.env.NODE_ENV && this.config.debug) {
      console.log("using enpoint for calls", this.config.endpoint);
    }
  }

  static generateCsrf = () => {
    return csrf.create(csrf.secretSync())
  };

  /**
   * Redirect link to Authorization Page
   * 
   * Can use generateCsrf to create a state string
   */
  static authorizeUrl = (appConfig: AppConfig, state?: string) => {
    if (!appConfig.appKey) throw new Error("appKey is missing");
    if (!appConfig.redirectUrl) throw new Error("RedirectUrl is missing");
    if (!appConfig.scope) throw new Error("scope is missing");

    let scopes = Array.isArray(appConfig.scope)
      ? appConfig.scope.join(" ")
      : appConfig.scope
    let querys = {
      client_id: appConfig.appKey,
      redirect_uri: appConfig.redirectUrl, //Make sure this path matches entry in application dashboard
      scope: scopes,
      response_type: "code",
      state: state ?? appConfig.state ?? csrf.create(csrf.secretSync()),
    };

    let authorizeUri = `${Quickbooks.AUTHORIZATION_URL}?${qs.stringify(
      querys
    )}`;
    return authorizeUri;
  };

  /**
   * Save token
   * 
   * @deprecated - use Quickbooks instance method going forward
   */
  static saveToken = (
    appConfig: AppConfig,
    tokenData: RealmTokenData
  ) => {
    // Get expired dates
    const realmId = tokenData.realmID.toString();
    const qbo = new Quickbooks(appConfig, realmId);
    return qbo.saveToken(tokenData);
  };

  /**
   * Save token
   * @param tokenData - token information sent back from Quickbooks or as simple as { access_token: string },  Realm token information is depricated going forward
   */
  saveToken = (tokenInput: TokenData | RealmTokenData) => {
    let tokenData: TokenData | null = null;
    if ("token" in tokenInput) {
      console.warn('tokenInput.token is depricated and will be removed in future versions on Quickbooks saveToken method')
      tokenData = tokenInput.token;
    } else {
      tokenData = tokenInput as TokenData;
    }
    let storeData: StoreTokenData = {
      ...tokenData,
      realmID: this.realmID,
      access_expire_timestamp: Date.now() + tokenData.expires_in * 1000,
      refresh_expire_timestamp:
        Date.now() + tokenData.x_refresh_token_expires_in * 1000,
    };

    if (this.config.storeMethod === 'Internal') {
      this.storeTokenData = storeData
      return Promise.resolve(storeData)
    }
    if (this.config.storeMethod === 'Function') {
      return this.config.saveToken(this.realmID, storeData, this.config, this.extra);
    }
    if (this.config.storeMethod === 'Class') {
      const appConfigStore = this.config;
      return appConfigStore.storeStrategy.storeQBToken({
        realmID: this.realmID,
        token: tokenData,
        ...storeData,
      }, this.config, this.extra);
    }
  };

  /**
   * Creates new token for the realmID from the returned authorization code received in the callback request
   * 
   * @deprecated - use Quickbooks instance method going forward
   */
  static createToken = async (
    appConfig: AppConfig,
    authCode: string,
    realmID: string | number
  ) => {
    const qbo = new Quickbooks(appConfig, realmID);
    return qbo.createToken(authCode);
  };

  /**
   * Creates new token for the realmID from the returned authorization code received in the callback request
   * @param authCode - The code returned in your callback as a param called "code"
   * @param realmID - DEPRICATED The company identifier in your callback as a param called "realmId"
   * @returns new token with expiration dates from storeStrategy
   */
  createToken = async (authCode: string, realmID?: string | number) => {
    if (realmID) {
      console.warn('realmID is depricated and will be removed in future versions on Quickbooks createToken method')
    }

    if (!this.config.redirectUrl) throw new Error("RedirectUrl is missing");
    if (!this.config.appKey) throw new Error("appKey is missing");
    if (!this.config.appSecret) throw new Error("appScret is missing");

    const auth = getAuthBase64(this.config)

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
        redirect_uri: this.config.redirectUrl, //Make sure this path matches entry in application dashboard
      }),
    };

    const response = await fetch(Quickbooks.TOKEN_URL, fetchOptions)
    if (!response.ok) {
      throw new QBFetchError(response.statusText, response);
    }
    const newTokenData: TokenData = await response.json();
    return this.saveToken(newTokenData);
  };

  /**
   * Check if access_token is valid
   *
   * uses default expire time buffer
   * @param token - returned from storeStrategy
   * @param timoutBufferSeconds - optional timout in seconds, default is 1 min
   * @return token has expired or not
   */
  static isAccessTokenExpired = (
    token: StoreTokenData,
    timoutBufferSeconds?: number
  ) => {
    const expireBufferSeconds = timoutBufferSeconds
      ? timoutBufferSeconds
      : Quickbooks.EXPIRATION_BUFFER_SECONDS;
    if (!token.access_expire_timestamp) {
      return true;
    } else {
      return dateNotExpired(token.access_expire_timestamp, expireBufferSeconds);
    }
  };

  /**
   * Check if there is a valid (not expired) access token
   * @param token - returned from storeStrategy
   * @param timoutBufferSeconds - optional timout in seconds, default is 1 min
   * @return token has expired or not
   */
  static isRefreshTokenExpired = (
    token: StoreTokenData,
    timoutBufferSeconds?: number
  ) => {
    const expireBufferSeconds = timoutBufferSeconds
      ? timoutBufferSeconds
      : Quickbooks.EXPIRATION_BUFFER_SECONDS;
    if (!token.refresh_expire_timestamp) {
      return true;
    } else {
      return dateNotExpired(
        token.refresh_expire_timestamp,
        expireBufferSeconds
      );
    }
  };

  /**
   * Get token
   * 
   * @deprecated use Quickbooks instance method going forward
   */
  static getToken = (
    appConfig: AppConfig,
    info: StoreGetTokenData
  ) => {
    const qbo = new Quickbooks(appConfig, info.realmID);
    return qbo.getToken();
  };

  /**
   * Get token
   */
  getToken = () => {
    const getStoreData: StoreGetTokenData = { realmID: this.realmID };

    if (this.config.storeMethod === 'Internal') {
      return Promise.resolve(this.storeTokenData)
    }
    if (this.config.storeMethod === 'Function') {
      return this.config.getToken(this.realmID, this.config, this.extra);
    }
    if (this.config.storeMethod === 'Class') {
      return this.config.storeStrategy.getQBToken(getStoreData, this.config, this.extra);
    }
  };

  /**
   * Get token and refresh if needed
   *
   * If config has autoRefresh false then return token regardless
   */
  getTokenWithRefresh = async () => {
    let storeTokenData = await this.getToken();
    if (!this.config.autoRefresh) {
      return storeTokenData;
    }
    if (storeTokenData.refresh_token &&
      !Quickbooks.isAccessTokenExpired(storeTokenData, this.config.autoRefreshBufferSeconds)) {
      storeTokenData = await this.refreshWithAccessToken(storeTokenData.refresh_token);
    }
    return storeTokenData;
  };

  refreshAcessTokenWithToken = async (refreshToken: string) => {
    if ("production" !== process.env.NODE_ENV && this.config.debug) {
      console.log("Refreshing quickbooks access_token");
    }
    if (!refreshToken) throw Error("Refresh Token missing");

    const auth = getAuthBase64(this.config)

    let fetchOptions = {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + auth,
      },
      body: qs.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    };

    const response = await fetch(Quickbooks.TOKEN_URL, fetchOptions)
    if (!response.ok) {
      throw new QBFetchError(response.statusText, response);
    }
    const newTokenData: TokenData = await response.json();
    return this.saveToken(newTokenData);

  }

  /**
   * Use the refresh token to obtain a new access token.
   * @param token - has the refresh_token
   * @returns returns fresh token with access_token and refresh_token
   *
   * @deprecated use new method refreshAccessTokenWithToken going forward
   */
  refreshWithAccessToken = async (
    storeTokenOrRefreshString: { refresh_token: string } | string
  ) => {
    let refreshString: string | null = null;
    if (typeof storeTokenOrRefreshString === "string") {
      refreshString = storeTokenOrRefreshString;
    } else {
      refreshString = storeTokenOrRefreshString.refresh_token;
    }
    return this.refreshAcessTokenWithToken(refreshString);
  };

  /**
   * Use the refresh token to obtain a new access token.
   */
  refreshAccessToken = async () => {
    const tokenData = await this.getToken()
    if (!tokenData.refresh_token) throw Error("Refresh Token missing");
    return this.refreshAcessTokenWithToken(tokenData.refresh_token);
  };

  revokeAccessOtherToken = async (token: string) => {
    if (!this.config.appKey) throw new Error("appKey is missing");
    if (!this.config.appSecret) throw new Error("appScret is missing");

    if (!token) throw Error("Token missing to revoke");

    const auth = getAuthBase64(this.config)

    let fetchOptions = {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + auth,
      },
      body: qs.stringify({
        token: token,
      }),
    };

    const response = await fetch(Quickbooks.REVOKE_URL, fetchOptions)
    if (response.ok) {
      return response;
    }
    throw new QBFetchError(response.statusText, response);
  }

  /**
   * Use either refresh token or access token to revoke access (OAuth2).
   *
   * @param useRefresh - boolean - Indicates which token to use: true to use the refresh token, false to use the access token.
   */
  revokeAccess = async (useRefresh?: boolean) => {
    const token = await this.getToken()

    const revokeToken = useRefresh ? token.refresh_token : token.access_token;

    return this.revokeAccessOtherToken(revokeToken);
  };

  /**
   * Validate id_token
   *
   */
  validateIdToken = async () => {
    const token = await this.getToken();
    if (!token.id_token) throw Error("ID Token missing");

    if (!this.config.appKey) throw new Error("appKey is missing");

    // Decode ID Token
    const token_parts = token.id_token.split(".");
    const id_token_header = JSON.parse(atob(token_parts[0]));
    const id_token_payload = JSON.parse(atob(token_parts[1]));

    const id_token_signature = atob(token_parts[2]);
    //
    // Step 1 : First check if the issuer is as mentioned in "issuer"
    if (id_token_payload.iss != Quickbooks.IDTOKEN_ISSUER_URL) return false;

    // Step 2 : check if the aud field in idToken is same as application's key
    if (id_token_payload.aud != this.config.appKey) return false;

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

  static verifyWebhook = (
    verifierToken: string,
    payload: WebhookPayload,
    signature: string,
  ) => {
    var webhookPayloadJson = JSON.stringify(payload);
    if (!verifierToken) {
      return false
    }
    if (!signature) {
      return false
    }
    // empty payload is fine
    if (!payload) {
      return true;
    }

    var hash = crypto.createHmac('sha256', verifierToken).update(webhookPayloadJson).digest('base64');
    if (signature !== hash) {
      return false
    }
    return true
  }

  static VerifyWebhookWithConfig = (
    appConfig: AppConfig,
    payload: WebhookPayload,
    signature: string,
  ) => {
    return Quickbooks.verifyWebhook(appConfig.webhookVerifierToken, payload, signature,)
  }

  verifyWebhook = (
    payload: WebhookPayload,
    signature: string,
  ) => {
    return Quickbooks.verifyWebhook(this.config.webhookVerifierToken, payload, signature)
  }


  /*** API HELPER FUNCTIONS  ***/
  request = async <T>(verb: string, options: RequestOptions, entity: any) => {
    let token = await this.getTokenWithRefresh();
    if (!token) throw Error("Token missing");
    if (!token.access_token) throw Error("Access Token missing");

    const opts: {
      qs: Record<string, any>;
      headers: Record<string, any>;
      body?: string | FormData;
      encoding?: null;
      returnHeadersInBody?: boolean;
    } = {
      qs: options.qs || {},
      headers: options.headers || {},
      returnHeadersInBody: options.returnHeadersInBody || false,
    };

    let url: string | null = null;
    if (options.fullurl) {
      url = options.url;
    } else {
      url = this.config.endpoint + this.realmID + options.url;
    }

    if (entity && entity.allowDuplicateDocNum) {
      delete entity.allowDuplicateDocNum;
      opts.qs.include = "allowduplicatedocnum";
    }
    if (verb == "post") {
      opts.qs.requestid = uuidv4();
    }

    if (this.config.minorversion) {
      opts.qs.minorversion = this.config.minorversion;
    }
    opts.headers["Authorization"] = "Bearer " + token.access_token;
    opts.headers["accept"] = "application/json";

    if (entity !== null) {
      opts.body = JSON.stringify(entity);
      opts.headers["Content-Type"] = "application/json";
    }
    if (options.formData) {
      opts.body = options.formData;
    }

    const fetchOptions = {
      method: verb,
      headers: opts.headers,
      body: opts.body,
    };
    url = `${url}?${qs.stringify(opts.qs)}`;

    if ("production" !== process.env.NODE_ENV && this.config.debug) {
      console.log("invoking endpoint:", url);
      console.log("fetch options", fetchOptions);
    }

    const response = await fetch(url, fetchOptions);
    if (response.ok) {

      const returnedObject: T = await response.json();
      if (opts.returnHeadersInBody) {
        const specialHeaders: HeaderAdditions['specialHeaders'] = {
          intuitTid: response.headers.get("intuit_tid"),
          server: response.headers.get("Server"),
          qboVersion: response.headers.get("QBO-Version"),
          expires: response.headers.get("Expires"),
          date: response.headers.get("Date"),
        }
        return { ...returnedObject, specialHeaders } as T
      }
      return returnedObject;
    } else {
      try {
        const body = await response.json();
        if (body?.Fault?.Error) {
          throw new QBResponseError(`Error of type ${body.Fault.type}`, body);
        }
      } catch (e) {
        // ignore
        throw e;
      }
      throw new QBFetchError(response.statusText, response);
    }
  };

  requestPdf = async (entityName: EntityName, id: string | number) => {
    let token = await this.getTokenWithRefresh();
    if (!token) throw Error("Token missing");
    if (!token.access_token) throw Error("Access Token missing");

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
    if (this.config.minorversion) {
      qsv.minorversion = this.config.minorversion;
    }

    const sendUrl = `${this.config.endpoint}${this.realmID
      }/${entityName.toLowerCase()}/${id}/pdf?${qs.stringify(qsv)}`;

    if ("production" !== process.env.NODE_ENV && this.config.debug) {
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
  create = <K extends keyof QuickbooksTypes>(
    entityName: K,
    entity: Partial<QuickbooksTypes[K]>
  ) => {
    const url = "/" + entityName.toLowerCase();
    return this.request<{
      [P in keyof (BaseRequest & HeaderAdditions & Record<K, QuickbooksTypes[K]>)]: (BaseRequest & HeaderAdditions &
        Record<K, QuickbooksTypes[K]>)[P];
    }>("post", { url: url, returnHeadersInBody: true }, entity);
  };

  read = <K extends keyof QuickbooksTypes>(
    entityName: K,
    id: string | number | null,
    options?: object
  ) => {
    let url = "/" + entityName.toLowerCase();
    if (id) url = `${url}/${id}`;
    return this.request<{
      [P in keyof (BaseRequest & HeaderAdditions & Record<K, QuickbooksTypes[K]>)]: (BaseRequest & HeaderAdditions &
        Record<K, QuickbooksTypes[K]>)[P];
    }>("get", { url: url, qs: options, returnHeadersInBody: true }, null);
  };

  update = <K extends Exclude<keyof QuickbooksTypes, EntityName.Exchangerate>>(
    entityName: K,
    entity: Partial<QuickbooksTypes[K]>
  ) => {
    if (entityName === EntityName.Exchangerate) {
      throw new Error("Exchangerate entity cannot be updated");
    }
    let url = "/" + entityName.toLowerCase();
    let qs = { operation: "update" };
    let opts: RequestOptions = { url: url, qs: qs, returnHeadersInBody: true };
    return this.request<{
      [P in keyof (BaseRequest & HeaderAdditions & Record<K, QuickbooksTypes[K]>)]: (BaseRequest & HeaderAdditions &
        Record<K, QuickbooksTypes[K]>)[P];
    }>("post", opts, entity);
  };

  delete = async <K extends keyof QuickbooksTypes>(
    entityName: K,
    idOrEntity: string | number | Partial<QuickbooksTypes[K]>
  ) => {
    // requires minimum Id and SyncToken
    // if passed Id as numeric value then grab entity and send it to delete
    let url = "/" + entityName.toLowerCase();
    let qs = { operation: "delete" };
    if (_.isObject(idOrEntity)) {
      return this.request<{
        [P in keyof (DeleteResponse<K> & HeaderAdditions)]: (DeleteResponse<K> & HeaderAdditions)[P];
      }>(
        "post",
        { url: url, qs: qs, returnHeadersInBody: true },
        idOrEntity
      );
    } else {
      const entity = await this.read(entityName, idOrEntity);
      return this.request<{
        [P in keyof (DeleteResponse<K> & HeaderAdditions)]: (DeleteResponse<K> & HeaderAdditions)[P];
      }>("post", { url: url, qs: qs, returnHeadersInBody: true }, entity);
    }
  };

  void = async <K extends keyof QuickbooksTypes>(
    entityName: K,
    idOrEntity: string | number | Partial<QuickbooksTypes[K]>
  ) => {
    // requires minimum Id and SyncToken
    // if passed Id as numeric value then grab entity and send it to delete
    const url = "/" + entityName.toLowerCase();
    let qs = { operation: "void" };
    if (_.isObject(idOrEntity)) {
      return this.request<{
        [P in keyof (BaseRequest & HeaderAdditions &
          Record<K, QuickbooksTypes[K]>)]: (BaseRequest & HeaderAdditions &
            Record<K, QuickbooksTypes[K]>)[P];
      }>("post", { url: url, qs: qs, returnHeadersInBody: true }, idOrEntity);
    } else {
      const entity = await this.read(entityName, idOrEntity);
      return this.request<{
        [P in keyof (BaseRequest & HeaderAdditions &
          Record<K, QuickbooksTypes[K]>)]: (BaseRequest & HeaderAdditions &
            Record<K, QuickbooksTypes[K]>)[P];
      }>("post", { url: url, qs: qs, returnHeadersInBody: true }, entity);
    }
  };

  // **********************  Query Api **********************
  query = async <K extends keyof QuickbooksTypes>(
    entityName: K,
    queryInput?: QueryInput | null
  ) => {
    const [query, queryData] = getQueryString(entityName, queryInput ?? null);
    if ("production" !== process.env.NODE_ENV && this.config.debug) {
      console.log("using query:", query);
      console.log("query data:", queryData);
    }
    const url = "/query";
    let qs = {
      query: query,
    };

    if (queryData?.count) {
      throw new Error("Count is not supported, use count[Entity] for count");
    }

    const data = await this.request<{
      [P in keyof (QueryResponse<K> & HeaderAdditions)]: (QueryResponse<K> & HeaderAdditions)[P];
    }>("get", { url: url, qs: qs, returnHeadersInBody: true }, null);
    if (
      queryData?.fetchAll &&
      queryData?.limit &&
      data &&
      data.QueryResponse &&
      data.QueryResponse.maxResults === queryData.limit &&
      data.QueryResponse[entityName] &&
      Array.isArray(data.QueryResponse[entityName])
    ) {
      if (!queryData.offset) {
        queryData.offset = queryData.limit;
      } else {
        queryData.offset = queryData.offset + queryData.limit;
      }
      const more = await this.query(entityName, queryData);
      if (data.QueryResponse[entityName]) {
        (data.QueryResponse[entityName] as QuickbooksTypes[K][]) =
          data.QueryResponse[entityName].concat(
            more.QueryResponse[entityName] || []
          );
        (data.QueryResponse.maxResults as number) =
          data.QueryResponse.maxResults + (more.QueryResponse.maxResults || 0);
        (data.QueryResponse.totalCount as number) =
          data.QueryResponse.totalCount + (more.QueryResponse.totalCount || 0);
        data.time = more.time || data.time;
      }
    }
    return data;
  };

  queryCount = async <K extends keyof QuickbooksTypes>(
    entityName: K,
    queryInput?: QueryInput | null
  ) => {
    const [query, queryData] = getQueryString(
      entityName,
      queryInput ?? null,
      true
    );
    const url = "/query";
    let qs = {
      query: query,
    };

    return this.request<{
      QueryResponse: { totalCount: number };
      time: string;
    } & HeaderAdditions>("get", { url: url, qs: qs, returnHeadersInBody: true }, null);
  };

  // **********************  Report Api **********************
  report = <T>(reportType: ReportName, criteria: any) => {
    let url = "/reports/" + reportType;
    return this.request<T>("get", { url: url, qs: criteria }, null);
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

  unwrap = (data: any, baseProperty: string) => {
    const name = baseProperty;
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
  changeDataCapture = <K extends keyof QuickbooksTypes | (keyof QuickbooksTypes)[]>(
    entities: K,
    since: Date | number | string
  ) => {
    const dateString = getDateString(since);

    let url = "/cdc";
    let qs = {
      entities: typeof entities === "string" ? entities : entities.join(","),
      changedSince: dateString,
    };
    return this.request<{
      CDCResponse: {
        QueryResponse: ({
          startPosition?: number
          maxResults?: number
          totalCount?: number
        } & Pick<Partial<QuickbooksTypesArrayed>, K extends Array<any> ? K[number] : K>)[]
      }[]
      time: string
    } & HeaderAdditions>("get", { url: url, qs: qs, returnHeadersInBody: true }, null);
  };

  /**
   * Updates QuickBooks version of Attachable
   *
   * @param  attachable - The persistent Attachable, including Id and SyncToken fields
   */
  updateAttachable = (attachable: any) => {
    return this.update(EntityName.Attachable, attachable);
  };

  /**
   * Uploads a file as an Attachable in QBO, optionally linking it to the specified
   * QBO Entity.
   *
   * @param filename - the name of the file
   * @param contentType - the mime type of the file
   * @param buffer - Buffer of file contents
   * @param entityType - optional string name of the QBO entity the Attachable will be linked to (e.g. Invoice)
   * @param entityId - optional Id of the QBO entity the Attachable will be linked to
   */
  upload = async (
    filename: string,
    contentType: string,
    buffer: Buffer,
    entityType: (something: any, somethingElse: any) => any | string | null,
    entityId?: number
  ) => {
    const formData = new FormData();
    formData.append("file_metadata_01", JSON.stringify({
      AttachableRef: [
        {
          EntityRef: {
            type: entityType,
            value: entityId + "",
          },
        },
      ],
      ContentType: contentType,
      FileName: filename
    }), { filename: "attachment.json", contentType: "application/json" });
    formData.append("file_content_01", buffer, { filename, contentType });

    const data = await this.request("post", { url: "/upload", formData }, null);
  };

  /**
   * Creates the Account in QuickBooks
   *
   * @param  {object} account - The unsaved account, to be persisted in QuickBooks
   */
  createAccount = (account: CreateInput<EntityName.Account>) => {
    return this.create(EntityName.Account, account);
  };

  /**
   * Creates the Attachable in QuickBooks
   *
   * @param  {object} attachable - The unsaved attachable, to be persisted in QuickBooks
   */
  createAttachable = (attachable: CreateInput<EntityName.Attachable>) => {
    return this.create(EntityName.Attachable, attachable);
  };

  /**
   * Creates the Bill in QuickBooks
   *
   * @param  {object} bill - The unsaved bill, to be persisted in QuickBooks
   */
  createBill = (bill: CreateInput<EntityName.Bill>) => {
    return this.create(EntityName.Bill, bill);
  };

  /**
   * Creates the BillPayment in QuickBooks
   *
   * @param  {object} billPayment - The unsaved billPayment, to be persisted in QuickBooks
   */
  createBillPayment = (billPayment: CreateInput<EntityName.BillPayment>) => {
    return this.create(EntityName.BillPayment, billPayment);
  };

  /**
   * Creates the Class in QuickBooks
   *
   * @param classqb - The unsaved class, to be persisted in QuickBooks
   */
  createClass = (classqb: CreateInput<EntityName.Class>) => {
    return this.create(EntityName.Class, classqb);
  };

  /**
   * Creates the CreditMemo in QuickBooks
   *
   * @param  {object} creditMemo - The unsaved creditMemo, to be persisted in QuickBooks
   */
  createCreditMemo = (creditMemo: CreateInput<EntityName.CreditMemo>) => {
    return this.create(EntityName.CreditMemo, creditMemo);
  };

  /**
   * Creates the Customer in QuickBooks
   *
   * @param  {object} customer - The unsaved customer, to be persisted in QuickBooks
   */
  createCustomer = (customer: CreateInput<EntityName.Customer>) => {
    return this.create(EntityName.Customer, customer);
  };

  /**
   * Creates the Department in QuickBooks
   *
   * @param  {object} department - The unsaved department, to be persisted in QuickBooks
   */
  createDepartment = (department: CreateInput<EntityName.Department>) => {
    return this.create(EntityName.Department, department);
  };

  /**
   * Creates the Deposit in QuickBooks
   *
   * @param  {object} deposit - The unsaved Deposit, to be persisted in QuickBooks
   */
  createDeposit = (deposit: CreateInput<EntityName.Deposit>) => {
    return this.create(EntityName.Deposit, deposit);
  };

  /**
   * Creates the Employee in QuickBooks
   *
   * @param  {object} employee - The unsaved employee, to be persisted in QuickBooks
   */
  createEmployee = (employee: CreateInput<EntityName.Employee>) => {
    return this.create(EntityName.Employee, employee);
  };

  /**
   * Creates the Estimate in QuickBooks
   *
   * @param  {object} estimate - The unsaved estimate, to be persisted in QuickBooks
   */
  createEstimate = (estimate: CreateInput<EntityName.Estimate>) => {
    return this.create(EntityName.Estimate, estimate);
  };

  /**
   * Creates the Invoice in QuickBooks
   *
   * @param  {object} invoice - The unsaved invoice, to be persisted in QuickBooks
   */
  createInvoice = (invoice: CreateInput<EntityName.Invoice>) => {
    return this.create(EntityName.Invoice, invoice);
  };

  /**
   * Creates the Item in QuickBooks
   *
   * @param  {object} item - The unsaved item, to be persisted in QuickBooks
   */
  createItem = (item: CreateInput<EntityName.Item>) => {
    return this.create(EntityName.Item, item);
  };

  /**
   * Creates the JournalCode in QuickBooks
   *
   * @param  {object} journalCode - The unsaved journalCode, to be persisted in QuickBooks
   */
  createJournalCode = (journalCode: CreateInput<EntityName.JournalCode>) => {
    return this.create(EntityName.JournalCode, journalCode);
  };

  /**
   * Creates the JournalEntry in QuickBooks
   *
   * @param  {object} journalEntry - The unsaved journalEntry, to be persisted in QuickBooks
   */
  createJournalEntry = (journalEntry: CreateInput<EntityName.JournalEntry>) => {
    return this.create(EntityName.JournalEntry, journalEntry);
  };

  /**
 * Creates the Payment in QuickBooks
 *
 * @param  {object} payment - The unsaved payment, to be persisted in QuickBooks

 */
  createPayment = (payment: CreateInput<EntityName.Payment>) => {
    return this.create(EntityName.Payment, payment);
  };

  /**
   * Creates the PaymentMethod in QuickBooks
   *
   * @param  {object} paymentMethod - The unsaved paymentMethod, to be persisted in QuickBooks
   */
  createPaymentMethod = (
    paymentMethod: CreateInput<EntityName.PaymentMethod>
  ) => {
    return this.create(EntityName.PaymentMethod, paymentMethod);
  };

  /**
   * Creates the Purchase in QuickBooks
   *
   * @param  {object} purchase - The unsaved purchase, to be persisted in QuickBooks
   */
  createPurchase = (purchase: CreateInput<EntityName.Purchase>) => {
    return this.create(EntityName.Purchase, purchase);
  };

  /**
   * Creates the PurchaseOrder in QuickBooks
   *
   * @param  {object} purchaseOrder - The unsaved purchaseOrder, to be persisted in QuickBooks
   */
  createPurchaseOrder = (
    purchaseOrder: CreateInput<EntityName.PurchaseOrder>
  ) => {
    return this.create(EntityName.PurchaseOrder, purchaseOrder);
  };

  /**
   * Creates the RefundReceipt in QuickBooks
   *
   * @param  {object} refundReceipt - The unsaved refundReceipt, to be persisted in QuickBooks
   */
  createRefundReceipt = (
    refundReceipt: CreateInput<EntityName.RefundReceipt>
  ) => {
    return this.create(EntityName.RefundReceipt, refundReceipt);
  };

  /**
   * Creates the SalesReceipt in QuickBooks
   *
   * @param  {object} salesReceipt - The unsaved salesReceipt, to be persisted in QuickBooks
   */
  createSalesReceipt = (salesReceipt: CreateInput<EntityName.SalesReceipt>) => {
    return this.create(EntityName.SalesReceipt, salesReceipt);
  };

  /**
   * Creates the TaxAgency in QuickBooks
   *
   * @param  {object} taxAgency - The unsaved taxAgency, to be persisted in QuickBooks
   */
  createTaxAgency = (taxAgency: CreateInput<EntityName.TaxAgency>) => {
    return this.create(EntityName.TaxAgency, taxAgency);
  };

  /**
   * Creates the Term in QuickBooks
   *
   * @param  {object} term - The unsaved term, to be persisted in QuickBooks
   */
  createTerm = (term: CreateInput<EntityName.Term>) => {
    return this.create(EntityName.Term, term);
  };

  /**
   * Creates the TimeActivity in QuickBooks
   *
   * @param  {object} timeActivity - The unsaved timeActivity, to be persisted in QuickBooks
   */
  createTimeActivity = (timeActivity: CreateInput<EntityName.TimeActivity>) => {
    return this.create(EntityName.TimeActivity, timeActivity);
  };

  /**
   * Creates the Transfer in QuickBooks
   *
   * @param  {object} transfer - The unsaved Transfer, to be persisted in QuickBooks
   */
  createTransfer = (transfer: CreateInput<EntityName.Transfer>) => {
    return this.create(EntityName.Transfer, transfer);
  };

  /**
   * Creates the Vendor in QuickBooks
   *
   * @param  {object} vendor - The unsaved vendor, to be persisted in QuickBooks
   */
  createVendor = (vendor: CreateInput<EntityName.Vendor>) => {
    return this.create(EntityName.Vendor, vendor);
  };

  /**
   * Creates the VendorCredit in QuickBooks
   *
   * @param  {object} vendorCredit - The unsaved vendorCredit, to be persisted in QuickBooks
   */
  createVendorCredit = (vendorCredit: CreateInput<EntityName.VendorCredit>) => {
    return this.create(EntityName.VendorCredit, vendorCredit);
  };

  /**
   * Creates the TaxService in QuickBooks
   *
   * Different return than other create methods, does not include entity name in top level
   *
   * @param  {object} taxService - The unsaved taxService, to be persisted in QuickBooks
   */
  createTaxService = (taxService: any) => {
    return this.request<any>(
      "post",
      { url: "/taxservice/taxcode" },
      taxService
    );
  };

  /**
   * Retrieves the Account from QuickBooks
   *
   * @param Id - The Id of persistent Account
   */
  getAccount = (id: string | number) => {
    return this.read(EntityName.Account, id);
  };

  /**
   * Retrieves the Attachable from QuickBooks
   *
   * @param Id - The Id of persistent Attachable
   */
  getAttachable = (id: string | number) => {
    return this.read(EntityName.Attachable, id);
  };

  /**
   * Retrieves the Bill from QuickBooks
   *
   * @param Id - The Id of persistent Bill
   */
  getBill = (id: string | number) => {
    return this.read(EntityName.Bill, id);
  };

  /**
   * Retrieves the BillPayment from QuickBooks
   *
   * @param Id - The Id of persistent BillPayment
   */
  getBillPayment = (id: string | number) => {
    return this.read(EntityName.BillPayment, id);
  };

  /**
   * Retrieves the Class from QuickBooks
   *
   * @param Id - The Id of persistent Class
   */
  getClass = (id: string | number) => {
    return this.read(EntityName.Class, id);
  };

  /**
   * Retrieves the CompanyInfo from QuickBooks
   *
   * @param Id - The Id of persistent CompanyInfo
   */
  getCompanyInfo = (id: string | number) => {
    return this.read(EntityName.CompanyInfo, id);
  };

  /**
   * Retrieves the CreditMemo from QuickBooks
   *
   * @param Id - The Id of persistent CreditMemo
   */
  getCreditMemo = (id: string | number) => {
    return this.read(EntityName.CreditMemo, id);
  };

  /**
   * Retrieves the Customer from QuickBooks
   *
   * @param Id - The Id of persistent Customer
   */
  getCustomer = (id: string | number) => {
    return this.read(EntityName.Customer, id);
  };

  /**
   * Retrieves the Department from QuickBooks
   *
   * @param Id - The Id of persistent Department
   */
  getDepartment = (id: string | number) => {
    return this.read(EntityName.Department, id);
  };

  /**
   * Retrieves the Deposit from QuickBooks
   *
   * @param Id - The Id of persistent Deposit
   */
  getDeposit = (id: string | number) => {
    return this.read(EntityName.Deposit, id);
  };

  /**
   * Retrieves the Employee from QuickBooks
   *
   * @param Id - The Id of persistent Employee
   */
  getEmployee = (id: string | number) => {
    return this.read(EntityName.Employee, id);
  };

  /**
   * Retrieves the Estimate from QuickBooks
   *
   * @param Id - The Id of persistent Estimate
   */
  getEstimate = (id: string | number) => {
    return this.read(EntityName.Estimate, id);
  };

  /**
   * Retrieves an ExchangeRate from QuickBooks
   *
   * @param options - An object with options including the required `sourcecurrencycode` parameter and optional `asofdate` parameter.
   */
  getExchangeRate = (options: GetExchangeRateOptions) => {
    const url = "/exchangerate";
    return this.read(EntityName.Exchangerate, null, options);
  };

  /**
   * Retrieves the Invoice from QuickBooks
   *
   * @param Id - The Id of persistent Invoice
   */
  getInvoice = (id: string | number) => {
    return this.read(EntityName.Invoice, id);
  };

  /**
   * Retrieves the Item from QuickBooks
   *
   * @param Id - The Id of persistent Item
   */
  getItem = (id: string | number) => {
    return this.read(EntityName.Item, id);
  };

  /**
   * Retrieves the JournalCode from QuickBooks
   *
   * @param Id - The Id of persistent JournalCode
   */
  getJournalCode = (id: string | number) => {
    return this.read(EntityName.JournalCode, id);
  };

  /**
   * Retrieves the JournalEntry from QuickBooks
   *
   * @param Id - The Id of persistent JournalEntry
   */
  getJournalEntry = (id: string | number) => {
    return this.read(EntityName.JournalEntry, id);
  };

  /**
   * Retrieves the Payment from QuickBooks
   *
   * @param Id - The Id of persistent Payment
   */
  getPayment = (id: string | number) => {
    return this.read(EntityName.Payment, id);
  };

  /**
   * Retrieves the PaymentMethod from QuickBooks
   *
   * @param Id - The Id of persistent PaymentMethod
   */
  getPaymentMethod = (id: string | number) => {
    return this.read(EntityName.PaymentMethod, id);
  };

  /**
   * Retrieves the Preferences from QuickBooks
   *
   */
  getPreferences = () => {
    return this.read(EntityName.Preferences, null);
  };

  /**
   * Retrieves the Purchase from QuickBooks
   *
   * @param Id - The Id of persistent Purchase
   */
  getPurchase = (id: string | number) => {
    return this.read(EntityName.Purchase, id);
  };

  /**
   * Retrieves the PurchaseOrder from QuickBooks
   *
   * @param Id - The Id of persistent PurchaseOrder
   */
  getPurchaseOrder = (id: string | number) => {
    return this.read(EntityName.PurchaseOrder, id);
  };

  /**
   * Retrieves the RefundReceipt from QuickBooks
   *
   * @param Id - The Id of persistent RefundReceipt
   */
  getRefundReceipt = (id: string | number) => {
    return this.read(EntityName.RefundReceipt, id);
  };

  /**
   * Retrieves the Reports from QuickBooks
   *
   * @param Id - The Id of persistent Reports
   */
  // getReports = (id: string | number) => {
  //   return this.read(EntityName.Reports, id);
  // };

  /**
   * Retrieves the SalesReceipt from QuickBooks
   *
   * @param Id - The Id of persistent SalesReceipt
   */
  getSalesReceipt = (id: string | number) => {
    return this.read(EntityName.SalesReceipt, id);
  };

  /**
   * Retrieves the TaxAgency from QuickBooks
   *
   * @param Id - The Id of persistent TaxAgency
   */
  getTaxAgency = (id: string | number) => {
    return this.read(EntityName.TaxAgency, id);
  };

  /**
   * Retrieves the TaxCode from QuickBooks
   *
   * @param Id - The Id of persistent TaxCode
   */
  getTaxCode = (id: string | number) => {
    return this.read(EntityName.TaxCode, id);
  };

  /**
   * Retrieves the TaxRate from QuickBooks
   *
   * @param Id - The Id of persistent TaxRate
   */
  getTaxRate = (id: string | number) => {
    return this.read(EntityName.TaxRate, id);
  };

  /**
   * Retrieves the Term from QuickBooks
   *
   * @param Id - The Id of persistent Term
   */
  getTerm = (id: string | number) => {
    return this.read(EntityName.Term, id);
  };

  /**
   * Retrieves the TimeActivity from QuickBooks
   *
   * @param Id - The Id of persistent TimeActivity
   */
  getTimeActivity = (id: string | number) => {
    return this.read(EntityName.TimeActivity, id);
  };

  /**
   * Retrieves the Transfer from QuickBooks
   *
   * @param Id - The Id of persistent Term
   */
  getTransfer = (id: string | number) => {
    return this.read(EntityName.Transfer, id);
  };

  /**
   * Retrieves the Vendor from QuickBooks
   *
   * @param Id - The Id of persistent Vendor
   */
  getVendor = (id: string | number) => {
    return this.read(EntityName.Vendor, id);
  };

  /**
   * Retrieves the VendorCredit from QuickBooks
   *
   * @param Id - The Id of persistent VendorCredit
   */
  getVendorCredit = (id: string | number) => {
    return this.read(EntityName.VendorCredit, id);
  };

  /**
   * Retrieves the Estimate PDF from QuickBooks
   *
   * @param Id - The Id of persistent Estimate
   */
  getEstimatePdf = (id: string | number) => {
    return this.requestPdf(EntityName.Estimate, id);
  };

  /**
   * Retrieves the Invoice PDF from QuickBooks
   *
   * @param Id - The Id of persistent Invoice
   */
  getInvoicePdf = (id: string | number) => {
    return this.requestPdf(EntityName.Invoice, id);
  };

  /**
   * Retrieves the SalesReceipt PDF from QuickBooks
   *
   * @param Id - The Id of persistent SalesReceipt
   */
  getSalesReceiptPdf = (id: string | number) => {
    return this.requestPdf(EntityName.SalesReceipt, id);
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
    return this.unwrap(data, EntityName.Estimate);
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
    return this.unwrap(data, EntityName.Invoice);
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
    return this.unwrap(data, EntityName.SalesReceipt);
  };

  /**
   * Updates QuickBooks version of Account
   *
   * @param account - The persistent Account, including Id and SyncToken fields
   */
  updateAccount = (account: UpdateInput<EntityName.Account>) => {
    return this.update(EntityName.Account, account);
  };

  /**
   * Updates QuickBooks version of Bill
   *
   * @param bill - The persistent Bill, including Id and SyncToken fields
   */
  updateBill = (bill: UpdateInput<EntityName.Bill>) => {
    return this.update(EntityName.Bill, bill);
  };

  /**
   * Updates QuickBooks version of BillPayment
   *
   * @param billPayment - The persistent BillPayment, including Id and SyncToken fields
   */
  updateBillPayment = (billPayment: UpdateInput<EntityName.BillPayment>) => {
    return this.update(EntityName.BillPayment, billPayment);
  };

  /**
   * Updates QuickBooks version of Class
   *
   * @param classqb - The persistent Class, including Id and SyncToken fields
   */
  updateClass = (classqb: UpdateInput<EntityName.Class>) => {
    return this.update(EntityName.Class, classqb);
  };

  /**
   * Updates QuickBooks version of CompanyInfo
   *
   * @param companyInfo - The persistent CompanyInfo, including Id and SyncToken fields
   */
  updateCompanyInfo = (companyInfo: UpdateInput<EntityName.CompanyInfo>) => {
    return this.update(EntityName.CompanyInfo, companyInfo);
  };

  /**
   * Updates QuickBooks version of CreditMemo
   *
   * @param creditMemo - The persistent CreditMemo, including Id and SyncToken fields
   */
  updateCreditMemo = (creditMemo: UpdateInput<EntityName.CreditMemo>) => {
    return this.update(EntityName.CreditMemo, creditMemo);
  };

  /**
   * Updates QuickBooks version of Customer
   *
   * @param customer - The persistent Customer, including Id and SyncToken fields
   */
  updateCustomer = (customer: UpdateInput<EntityName.Customer>) => {
    return this.update(EntityName.Customer, customer);
  };

  /**
   * Updates QuickBooks version of Department
   *
   * @param department - The persistent Department, including Id and SyncToken fields
   */
  updateDepartment = (department: UpdateInput<EntityName.Department>) => {
    return this.update(EntityName.Department, department);
  };

  /**
   * Updates QuickBooks version of Deposit
   *
   * @param deposit - The persistent Deposit, including Id and SyncToken fields
   */
  updateDeposit = (deposit: UpdateInput<EntityName.Deposit>) => {
    return this.update(EntityName.Deposit, deposit);
  };

  /**
   * Updates QuickBooks version of Employee
   *
   * @param employee - The persistent Employee, including Id and SyncToken fields
   */
  updateEmployee = (employee: UpdateInput<EntityName.Employee>) => {
    return this.update(EntityName.Employee, employee);
  };

  /**
   * Updates QuickBooks version of Estimate
   *
   * @param estimate - The persistent Estimate, including Id and SyncToken fields
   */
  updateEstimate = (estimate: UpdateInput<EntityName.Estimate>) => {
    return this.update(EntityName.Estimate, estimate);
  };

  /**
   * Updates QuickBooks version of Invoice
   *
   * @param invoice - The persistent Invoice, including Id and SyncToken fields
   */
  updateInvoice = (invoice: UpdateInput<EntityName.Invoice>) => {
    return this.update(EntityName.Invoice, invoice);
  };

  /**
   * Updates QuickBooks version of Item
   *
   * @param item - The persistent Item, including Id and SyncToken fields
   */
  updateItem = (item: UpdateInput<EntityName.Item>) => {
    return this.update(EntityName.Item, item);
  };

  /**
   * Updates QuickBooks version of JournalCode
   *
   * @param journalCode - The persistent JournalCode, including Id and SyncToken fields
   */
  updateJournalCode = (journalCode: UpdateInput<EntityName.JournalCode>) => {
    return this.update(EntityName.JournalCode, journalCode);
  };

  /**
   * Updates QuickBooks version of JournalEntry
   *
   * @param journalEntry - The persistent JournalEntry, including Id and SyncToken fields
   */
  updateJournalEntry = (journalEntry: UpdateInput<EntityName.JournalEntry>) => {
    return this.update(EntityName.JournalEntry, journalEntry);
  };

  /**
   * Updates QuickBooks version of Payment
   *
   * @param payment - The persistent Payment, including Id and SyncToken fields
   */
  updatePayment = (payment: UpdateInput<EntityName.Payment>) => {
    return this.update(EntityName.Payment, payment);
  };

  /**
   * Updates QuickBooks version of PaymentMethod
   *
   * @param paymentMethod - The persistent PaymentMethod, including Id and SyncToken fields
   */
  updatePaymentMethod = (
    paymentMethod: UpdateInput<EntityName.PaymentMethod>
  ) => {
    return this.update(EntityName.PaymentMethod, paymentMethod);
  };

  /**
   * Updates QuickBooks version of Preferences
   *
   * @param preferences - The persistent Preferences, including Id and SyncToken fields
   */
  updatePreferences = (preferences: UpdateInput<EntityName.Preferences>) => {
    return this.update(EntityName.Preferences, preferences);
  };

  /**
   * Updates QuickBooks version of Purchase
   *
   * @param purchase - The persistent Purchase, including Id and SyncToken fields
   */
  updatePurchase = (purchase: UpdateInput<EntityName.Purchase>) => {
    return this.update(EntityName.Purchase, purchase);
  };

  /**
   * Updates QuickBooks version of PurchaseOrder
   *
   * @param purchaseOrder - The persistent PurchaseOrder, including Id and SyncToken fields
   */
  updatePurchaseOrder = (
    purchaseOrder: UpdateInput<EntityName.PurchaseOrder>
  ) => {
    return this.update(EntityName.PurchaseOrder, purchaseOrder);
  };

  /**
   * Updates QuickBooks version of RefundReceipt
   *
   * @param refundReceipt - The persistent RefundReceipt, including Id and SyncToken fields
   */
  updateRefundReceipt = (
    refundReceipt: UpdateInput<EntityName.RefundReceipt>
  ) => {
    return this.update(EntityName.RefundReceipt, refundReceipt);
  };

  /**
   * Updates QuickBooks version of SalesReceipt
   *
   * @param salesReceipt - The persistent SalesReceipt, including Id and SyncToken fields
   */
  updateSalesReceipt = (salesReceipt: UpdateInput<EntityName.SalesReceipt>) => {
    return this.update(EntityName.SalesReceipt, salesReceipt);
  };

  /**
   * Updates QuickBooks version of TaxAgency
   *
   * @param taxAgency - The persistent TaxAgency, including Id and SyncToken fields
   */
  updateTaxAgency = (taxAgency: UpdateInput<EntityName.TaxAgency>) => {
    return this.update(EntityName.TaxAgency, taxAgency);
  };

  /**
   * Updates QuickBooks version of TaxCode
   *
   * @param taxCode - The persistent TaxCode, including Id and SyncToken fields
   */
  updateTaxCode = (taxCode: UpdateInput<EntityName.TaxCode>) => {
    return this.update(EntityName.TaxCode, taxCode);
  };

  /**
   * Updates QuickBooks version of TaxRate
   *
   * @param taxRate - The persistent TaxRate, including Id and SyncToken fields
   */
  updateTaxRate = (taxRate: UpdateInput<EntityName.TaxRate>) => {
    return this.update(EntityName.TaxRate, taxRate);
  };

  /**
   * Updates QuickBooks version of Term
   *
   * @param term - The persistent Term, including Id and SyncToken fields
   */
  updateTerm = (term: UpdateInput<EntityName.Term>) => {
    return this.update(EntityName.Term, term);
  };

  /**
   * Updates QuickBooks version of TimeActivity
   *
   * @param timeActivity - The persistent TimeActivity, including Id and SyncToken fields
   */
  updateTimeActivity = (timeActivity: UpdateInput<EntityName.TimeActivity>) => {
    return this.update(EntityName.TimeActivity, timeActivity);
  };

  /**
   * Updates QuickBooks version of Transfer
   *
   * @param Transfer - The persistent Transfer, including Id and SyncToken fields
   */
  updateTransfer = (transfer: UpdateInput<EntityName.Transfer>) => {
    return this.update(EntityName.Transfer, transfer);
  };

  /**
   * Updates QuickBooks version of Vendor
   *
   * @param vendor - The persistent Vendor, including Id and SyncToken fields
   */
  updateVendor = (vendor: UpdateInput<EntityName.Vendor>) => {
    return this.update(EntityName.Vendor, vendor);
  };

  /**
   * Updates QuickBooks version of VendorCredit
   *
   * @param vendorCredit - The persistent VendorCredit, including Id and SyncToken fields
   */
  updateVendorCredit = (vendorCredit: UpdateInput<EntityName.VendorCredit>) => {
    return this.update(EntityName.VendorCredit, vendorCredit);
  };

  /**
   * Updates QuickBooks version of ExchangeRate
   *
   * @param exchangeRate - The persistent ExchangeRate, including Id and SyncToken fields
   */
  updateExchangeRate = (exchangeRate: UpdateInput<EntityName.Exchangerate>) => {
    return this.update(EntityName.Exchangerate, exchangeRate);
  };

  /**
   * Deletes the Attachable from QuickBooks
   *
   * @param idOrEntity - The persistent Attachable to be deleted, or the Id of the Attachable, in which case an extra GET request will be issued to first retrieve the Attachable
   */
  deleteAttachable = (idOrEntity: DeleteInput<EntityName.Attachable>) => {
    return this.delete(EntityName.Attachable, idOrEntity);
  };

  /**
   * Deletes the Bill from QuickBooks
   *
   * @param idOrEntity - The persistent Bill to be deleted, or the Id of the Bill, in which case an extra GET request will be issued to first retrieve the Bill
   */
  deleteBill = (idOrEntity: DeleteInput<EntityName.Bill>) => {
    return this.delete(EntityName.Bill, idOrEntity);
  };

  /**
   * Deletes the BillPayment from QuickBooks
   *
   * @param idOrEntity - The persistent BillPayment to be deleted, or the Id of the BillPayment, in which case an extra GET request will be issued to first retrieve the BillPayment
   */
  deleteBillPayment = (idOrEntity: DeleteInput<EntityName.BillPayment>) => {
    return this.delete(EntityName.BillPayment, idOrEntity);
  };

  /**
   * Deletes the CreditMemo from QuickBooks
   *
   * @param idOrEntity - The persistent CreditMemo to be deleted, or the Id of the CreditMemo, in which case an extra GET request will be issued to first retrieve the CreditMemo
   */
  deleteCreditMemo = (idOrEntity: DeleteInput<EntityName.CreditMemo>) => {
    return this.delete(EntityName.CreditMemo, idOrEntity);
  };

  /**
   * Deletes the Deposit from QuickBooks
   *
   * @param idOrEntity - The persistent Deposit to be deleted, or the Id of the Deposit, in which case an extra GET request will be issued to first retrieve the Deposit
   */
  deleteDeposit = (idOrEntity: DeleteInput<EntityName.Deposit>) => {
    return this.delete(EntityName.Deposit, idOrEntity);
  };

  /**
   * Deletes the Estimate from QuickBooks
   *
   * @param idOrEntity - The persistent Estimate to be deleted, or the Id of the Estimate, in which case an extra GET request will be issued to first retrieve the Estimate
   */
  deleteEstimate = (idOrEntity: DeleteInput<EntityName.Estimate>) => {
    return this.delete(EntityName.Estimate, idOrEntity);
  };

  /**
   * Deletes the Invoice from QuickBooks
   *
   * @param idOrEntity - The persistent Invoice to be deleted, or the Id of the Invoice, in which case an extra GET request will be issued to first retrieve the Invoice
   */
  deleteInvoice = (idOrEntity: DeleteInput<EntityName.Invoice>) => {
    return this.delete(EntityName.Invoice, idOrEntity);
  };

  /**
   * Deletes the JournalCode from QuickBooks
   *
   * @param idOrEntity - The persistent JournalCode to be deleted, or the Id of the JournalCode, in which case an extra GET request will be issued to first retrieve the JournalCode
   */
  deleteJournalCode = (idOrEntity: DeleteInput<EntityName.JournalCode>) => {
    return this.delete(EntityName.JournalCode, idOrEntity);
  };

  /**
   * Deletes the JournalEntry from QuickBooks
   *
   * @param idOrEntity - The persistent JournalEntry to be deleted, or the Id of the JournalEntry, in which case an extra GET request will be issued to first retrieve the JournalEntry
   */
  deleteJournalEntry = (idOrEntity: DeleteInput<EntityName.JournalEntry>) => {
    return this.delete(EntityName.JournalEntry, idOrEntity);
  };

  /**
   * Deletes the Payment from QuickBooks
   *
   * @param idOrEntity - The persistent Payment to be deleted, or the Id of the Payment, in which case an extra GET request will be issued to first retrieve the Payment
   */
  deletePayment = (idOrEntity: DeleteInput<EntityName.Payment>) => {
    return this.delete(EntityName.Payment, idOrEntity);
  };

  /**
   * Deletes the Purchase from QuickBooks
   *
   * @param idOrEntity - The persistent Purchase to be deleted, or the Id of the Purchase, in which case an extra GET request will be issued to first retrieve the Purchase
   */
  deletePurchase = (idOrEntity: DeleteInput<EntityName.Purchase>) => {
    return this.delete(EntityName.Purchase, idOrEntity);
  };

  /**
   * Deletes the PurchaseOrder from QuickBooks
   *
   * @param idOrEntity - The persistent PurchaseOrder to be deleted, or the Id of the PurchaseOrder, in which case an extra GET request will be issued to first retrieve the PurchaseOrder
   */
  deletePurchaseOrder = (idOrEntity: DeleteInput<EntityName.PurchaseOrder>) => {
    return this.delete(EntityName.PurchaseOrder, idOrEntity);
  };

  /**
   * Deletes the RefundReceipt from QuickBooks
   *
   * @param idOrEntity - The persistent RefundReceipt to be deleted, or the Id of the RefundReceipt, in which case an extra GET request will be issued to first retrieve the RefundReceipt
   */
  deleteRefundReceipt = (idOrEntity: DeleteInput<EntityName.RefundReceipt>) => {
    return this.delete(EntityName.RefundReceipt, idOrEntity);
  };

  /**
   * Deletes the SalesReceipt from QuickBooks
   *
   * @param idOrEntity - The persistent SalesReceipt to be deleted, or the Id of the SalesReceipt, in which case an extra GET request will be issued to first retrieve the SalesReceipt
   */
  deleteSalesReceipt = (idOrEntity: DeleteInput<EntityName.SalesReceipt>) => {
    return this.delete(EntityName.SalesReceipt, idOrEntity);
  };

  /**
   * Deletes the TimeActivity from QuickBooks
   *
   * @param idOrEntity - The persistent TimeActivity to be deleted, or the Id of the TimeActivity, in which case an extra GET request will be issued to first retrieve the TimeActivity
   */
  deleteTimeActivity = (idOrEntity: DeleteInput<EntityName.TimeActivity>) => {
    return this.delete(EntityName.TimeActivity, idOrEntity);
  };

  /**
   * Deletes the Transfer from QuickBooks
   *
   * @param idOrEntity - The persistent Transfer to be deleted, or the Id of the Transfer, in which case an extra GET request will be issued to first retrieve the Transfer
   */
  deleteTransfer = (idOrEntity: DeleteInput<EntityName.Transfer>) => {
    return this.delete(EntityName.Transfer, idOrEntity);
  };

  /**
   * Deletes the VendorCredit from QuickBooks
   *
   * @param idOrEntity - The persistent VendorCredit to be deleted, or the Id of the VendorCredit, in which case an extra GET request will be issued to first retrieve the VendorCredit
   */
  deleteVendorCredit = (idOrEntity: DeleteInput<EntityName.VendorCredit>) => {
    return this.delete(EntityName.VendorCredit, idOrEntity);
  };

  /**
   * Voids the Invoice from QuickBooks
   *
   * @param idOrEntity - The persistent Invoice to be voided, or the Id of the Invoice, in which case an extra GET request will be issued to first retrieve the Invoice
   */
  voidInvoice = (idOrEntity: DeleteInput<EntityName.Invoice>) => {
    return this.void(EntityName.Invoice, idOrEntity);
  };

  /**
   * Voids QuickBooks version of Payment
   *
   * @param payment - The persistent Payment, including Id and SyncToken fields
   */
  voidPayment = (payment: UpdateInput<EntityName.Payment>) => {
    // if object then add sparse true
    if (typeof payment === "object") {
      payment.sparse = true;
    }
    return this.update(EntityName.Payment, payment);
  };

  /**
   * Finds all Accounts in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findAccounts = (criteria?: QueryInput) => {
    return this.query(EntityName.Account, criteria);
  };

  /**
   * Finds all Attachables in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findAttachables = (criteria?: QueryInput) => {
    return this.query(EntityName.Attachable, criteria);
  };

  /**
   * Finds all Bills in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findBills = (criteria?: QueryInput) => {
    return this.query(EntityName.Bill, criteria);
  };

  /**
   * Finds all BillPayments in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findBillPayments = (criteria?: QueryInput) => {
    return this.query(EntityName.BillPayment, criteria);
  };

  /**
   * Finds all Budgets in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findBudgets = (criteria?: QueryInput) => {
    return this.query(EntityName.Budget, criteria);
  };

  /**
   * Finds all Classs in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findClasses = (criteria?: QueryInput) => {
    return this.query(EntityName.Class, criteria);
  };

  /**
   * Finds all CompanyInfos in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findCompanyInfos = (criteria?: QueryInput) => {
    return this.query(EntityName.CompanyInfo, criteria);
  };

  /**
   * Finds all CreditMemos in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findCreditMemos = (criteria?: QueryInput) => {
    return this.query(EntityName.CreditMemo, criteria);
  };

  /**
   * Finds all Customers in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findCustomers = (criteria?: QueryInput) => {
    return this.query(EntityName.Customer, criteria);
  };

  /**
   * Finds all Departments in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findDepartments = (criteria?: QueryInput) => {
    return this.query(EntityName.Department, criteria);
  };

  /**
   * Finds all Deposits in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findDeposits = (criteria?: QueryInput) => {
    return this.query(EntityName.Deposit, criteria);
  };

  /**
   * Finds all Employees in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findEmployees = (criteria?: QueryInput) => {
    return this.query(EntityName.Employee, criteria);
  };

  /**
   * Finds all Estimates in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findEstimates = (criteria?: QueryInput) => {
    return this.query(EntityName.Estimate, criteria);
  };

  /**
   * Finds all Invoices in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findInvoices = (criteria?: QueryInput) => {
    return this.query(EntityName.Invoice, criteria);
  };

  /**
   * Finds all Items in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findItems = (criteria?: QueryInput) => {
    return this.query(EntityName.Item, criteria);
  };

  /**
   * Finds all JournalCodes in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findJournalCodes = (criteria?: QueryInput) => {
    return this.query(EntityName.JournalCode, criteria);
  };

  /**
   * Finds all JournalEntrys in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findJournalEntries = (criteria?: QueryInput) => {
    return this.query(EntityName.JournalEntry, criteria);
  };

  /**
   * Finds all Payments in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findPayments = (criteria?: QueryInput) => {
    return this.query(EntityName.Payment, criteria);
  };

  /**
   * Finds all PaymentMethods in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findPaymentMethods = (criteria?: QueryInput) => {
    return this.query(EntityName.PaymentMethod, criteria);
  };

  /**
   * Finds all Preferencess in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findPreferenceses = (criteria?: QueryInput) => {
    return this.query(EntityName.Preferences, criteria);
  };

  /**
   * Finds all Purchases in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findPurchases = (criteria?: QueryInput) => {
    return this.query(EntityName.Purchase, criteria);
  };

  /**
   * Finds all PurchaseOrders in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findPurchaseOrders = (criteria?: QueryInput) => {
    return this.query(EntityName.PurchaseOrder, criteria);
  };

  /**
   * Finds all RefundReceipts in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findRefundReceipts = (criteria?: QueryInput) => {
    return this.query(EntityName.RefundReceipt, criteria);
  };

  /**
   * Finds all SalesReceipts in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findSalesReceipts = (criteria?: QueryInput) => {
    return this.query(EntityName.SalesReceipt, criteria);
  };

  /**
   * Finds all TaxAgencys in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findTaxAgencies = (criteria?: QueryInput) => {
    return this.query(EntityName.TaxAgency, criteria);
  };

  /**
   * Finds all TaxCodes in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findTaxCodes = (criteria?: QueryInput) => {
    return this.query(EntityName.TaxCode, criteria);
  };

  /**
   * Finds all TaxRates in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findTaxRates = (criteria?: QueryInput) => {
    return this.query(EntityName.TaxRate, criteria);
  };

  /**
   * Finds all Terms in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findTerms = (criteria?: QueryInput) => {
    return this.query(EntityName.Term, criteria);
  };

  /**
   * Finds all TimeActivitys in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findTimeActivities = (criteria?: QueryInput) => {
    return this.query(EntityName.TimeActivity, criteria);
  };

  /**
   * Finds all Transfers in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findTransfers = (criteria?: QueryInput) => {
    return this.query(EntityName.Transfer, criteria);
  };

  /**
   * Finds all Vendors in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findVendors = (criteria?: QueryInput) => {
    return this.query(EntityName.Vendor, criteria);
  };

  /**
   * Finds all VendorCredits in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findVendorCredits = (criteria?: QueryInput) => {
    return this.query(EntityName.VendorCredit, criteria);
  };

  /**
   * Finds all ExchangeRates in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  findExchangeRates = (criteria?: QueryInput) => {
    return this.query(EntityName.Exchangerate, criteria);
  };

  /**
   * Finds all Accounts in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countAccounts = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.Account, criteria);
  };

  /**
   * Finds all Attachables in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countAttachables = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.Attachable, criteria);
  };

  /**
   * Finds all Bills in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countBills = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.Bill, criteria);
  };

  /**
   * Finds all BillPayments in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countBillPayments = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.BillPayment, criteria);
  };

  /**
   * Finds all Budgets in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countBudgets = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.Budget, criteria);
  };

  /**
   * Finds all Classs in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countClasses = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.Class, criteria);
  };

  /**
   * Finds all CompanyInfos in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countCompanyInfos = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.CompanyInfo, criteria);
  };

  /**
   * Finds all CreditMemos in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countCreditMemos = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.CreditMemo, criteria);
  };

  /**
   * Finds all Customers in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countCustomers = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.Customer, criteria);
  };

  /**
   * Finds all Departments in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countDepartments = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.Department, criteria);
  };

  /**
   * Finds all Deposits in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countDeposits = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.Deposit, criteria);
  };

  /**
   * Finds all Employees in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countEmployees = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.Employee, criteria);
  };

  /**
   * Finds all Estimates in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countEstimates = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.Estimate, criteria);
  };

  /**
   * Finds all Invoices in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countInvoices = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.Invoice, criteria);
  };

  /**
   * Finds all Items in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countItems = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.Item, criteria);
  };

  /**
   * Finds all JournalCodes in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countJournalCodes = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.JournalCode, criteria);
  };

  /**
   * Finds all JournalEntrys in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countJournalEntries = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.JournalEntry, criteria);
  };

  /**
   * Finds all Payments in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countPayments = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.Payment, criteria);
  };

  /**
   * Finds all PaymentMethods in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countPaymentMethods = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.PaymentMethod, criteria);
  };

  /**
   * Finds all Preferencess in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countPreferenceses = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.Preferences, criteria);
  };

  /**
   * Finds all Purchases in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countPurchases = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.Purchase, criteria);
  };

  /**
   * Finds all PurchaseOrders in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countPurchaseOrders = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.PurchaseOrder, criteria);
  };

  /**
   * Finds all RefundReceipts in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countRefundReceipts = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.RefundReceipt, criteria);
  };

  /**
   * Finds all SalesReceipts in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countSalesReceipts = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.SalesReceipt, criteria);
  };

  /**
   * Finds all TaxAgencys in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countTaxAgencies = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.TaxAgency, criteria);
  };

  /**
   * Finds all TaxCodes in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countTaxCodes = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.TaxCode, criteria);
  };

  /**
   * Finds all TaxRates in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countTaxRates = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.TaxRate, criteria);
  };

  /**
   * Finds all Terms in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countTerms = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.Term, criteria);
  };

  /**
   * Finds all TimeActivitys in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countTimeActivities = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.TimeActivity, criteria);
  };

  /**
   * Finds all Transfers in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countTransfers = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.Transfer, criteria);
  };

  /**
   * Finds all Vendors in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countVendors = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.Vendor, criteria);
  };

  /**
   * Finds all VendorCredits in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countVendorCredits = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.VendorCredit, criteria);
  };

  /**
   * Finds all ExchangeRates in QuickBooks, optionally matching the specified criteria
   *
   * @param criteria - (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'"
   */
  countExchangeRates = (criteria?: QueryInput) => {
    return this.queryCount(EntityName.Exchangerate, criteria);
  };

  /**
   * Retrieves the BalanceSheet Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportBalanceSheet = (options?: any) => {
    return this.report<any>(ReportName.BalanceSheet, options);
  };

  /**
   * Retrieves the ProfitAndLoss Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportProfitAndLoss = (options?: any) => {
    return this.report<any>(ReportName.ProfitAndLoss, options);
  };

  /**
   * Retrieves the ProfitAndLossDetail Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportProfitAndLossDetail = (options?: any) => {
    return this.report<any>(ReportName.ProfitAndLossDetail, options);
  };

  /**
   * Retrieves the TrialBalance Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportTrialBalance = (options?: any) => {
    return this.report<any>(ReportName.TrialBalance, options);
  };

  /**
   * Retrieves the CashFlow Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportCashFlow = (options?: any) => {
    return this.report<any>(ReportName.CashFlow, options);
  };

  /**
   * Retrieves the InventoryValuationSummary Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportInventoryValuationSummary = (options?: any) => {
    return this.report<any>(ReportName.InventoryValuationSummary, options);
  };

  /**
   * Retrieves the CustomerSales Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportCustomerSales = (options?: any) => {
    return this.report<any>(ReportName.CustomerSales, options);
  };

  /**
   * Retrieves the ItemSales Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportItemSales = (options?: any) => {
    return this.report<any>(ReportName.ItemSales, options);
  };

  /**
   * Retrieves the CustomerIncome Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportCustomerIncome = (options?: any) => {
    return this.report<any>(ReportName.CustomerIncome, options);
  };

  /**
   * Retrieves the CustomerBalance Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportCustomerBalance = (options?: any) => {
    return this.report<any>(ReportName.CustomerBalance, options);
  };

  /**
   * Retrieves the CustomerBalanceDetail Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportCustomerBalanceDetail = (options?: any) => {
    return this.report<any>(ReportName.CustomerBalanceDetail, options);
  };

  /**
   * Retrieves the AgedReceivables Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportAgedReceivables = (options?: any) => {
    return this.report<any>(ReportName.AgedReceivables, options);
  };

  /**
   * Retrieves the AgedReceivableDetail Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportAgedReceivableDetail = (options?: any) => {
    return this.report<any>(ReportName.AgedReceivableDetail, options);
  };

  /**
   * Retrieves the VendorBalance Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportVendorBalance = (options?: any) => {
    return this.report<any>(ReportName.VendorBalance, options);
  };

  /**
   * Retrieves the VendorBalanceDetail Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportVendorBalanceDetail = (options?: any) => {
    return this.report<any>(ReportName.VendorBalanceDetail, options);
  };

  /**
   * Retrieves the AgedPayables Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportAgedPayables = (options?: any) => {
    return this.report<any>(ReportName.AgedPayables, options);
  };

  /**
   * Retrieves the AgedPayableDetail Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportAgedPayableDetail = (options?: any) => {
    return this.report<any>(ReportName.AgedPayableDetail, options);
  };

  /**
   * Retrieves the VendorExpenses Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportVendorExpenses = (options?: any) => {
    return this.report<any>(ReportName.VendorExpenses, options);
  };

  /**
   * Retrieves the TransactionList Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportTransactionList = (options?: any) => {
    return this.report<any>(ReportName.TransactionList, options);
  };

  /**
   * Retrieves the GeneralLedgerDetail Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportGeneralLedgerDetail = (options?: any) => {
    return this.report<any>(ReportName.GeneralLedger, options);
  };

  /**
   * Retrieves the TaxSummary Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportTaxSummary = (options?: any) => {
    return this.report<any>(ReportName.TaxSummary, options);
  };

  /**
   * Retrieves the DepartmentSales Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportDepartmentSales = (options?: any) => {
    return this.report<any>(ReportName.DepartmentSales, options);
  };

  /**
   * Retrieves the ClassSales Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportClassSales = (options?: any) => {
    return this.report<any>(ReportName.ClassSales, options);
  };

  /**
   * Retrieves the AccountListDetail Report from QuickBooks
   *
   * @param options - (Optional) Map of key-value pairs passed as options to the Report
   */
  reportAccountListDetail = (options?: any) => {
    return this.report<any>(ReportName.AccountList, options);
  };
}

export default Quickbooks;
export { Quickbooks };
