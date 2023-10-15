export interface TokenData {
  access_token: string;
  token_type: string; // 'bearer',
  x_refresh_token_expires_in: number; // 8726400,
  refresh_token: string;
  id_token: string;
  expires_in: 3600;
}
export interface RealmTokenData {
  realmId: number | string;
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

declare class QBStoreStrategy {
  static getQBToken(realm: { realmId: number | string }): StoreTokenData;
  static saveQBToken(storeTokenData: StoreSaveTokenData): StoreTokenData;
}

export interface AppConfig {
  appKey: string;
  appSecret: string;
  redirectUrl: string;
  /* default is 37, check for your version in the documents */
  minorversion?: number;
  /* default is false */
  useProduction?: string;
  /* default is false */
  debug: boolean;
  storeStrategy: QBStoreStrategy;
  scope: string[];
}

declare class Quickbooks {
  constructor(appConfig: AppConfig, realmID: number | string);
  static authorizeUrl(appConfig: AppConfig): string;
  static createToken(
    appConfig: AppConfig,
    authCode: string,
    realmID: string
  ): Promise<TokenData>;
  createToken(authCode: string, realmID: string): Promise<TokenData>;
  static saveToken(
    storeStrategy: QBStoreStrategy,
    tokenData: RealmTokenData
  ): Promise<StoreTokenData>;
  saveToken(tokenData: RealmTokenData): Promise<StoreTokenData>;
}

export = Quickbooks;
