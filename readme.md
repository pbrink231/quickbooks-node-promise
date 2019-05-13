# This is still early so use with caution

## Overview

I made this because there is node-quickbooks which is really good but made on callbacks and I didnt want to get into that.  I also wanted to auto refresh the tokens on calls since access_tokens only last 60 minutes.


#  Setup

**Check the example for node express setup endpoints**

## Install

```
npm i quickbooks-node-promise
```


## Create Store Strategy
The store strategy is used to save token information and retreive token information.  It returns a promise.

```javascript
class QBStoreStrategy {
  /**
   * Uses a realmID to lookup the token information.
   * Should return back in an object
   * 
   * @param {number} realmID the quickbooks companyID
   * @returns {object} Promise
   */
  getQBToken({ realmID }) {
    return new Promise((resolve) => {
      // Get token infomraiton using realmID here

      // Return object which includes the access_expire_timestamp & refresh_expire_timestamp
      let newToken = {
        access_token: my_access_token,
        refresh_token: my_refresh_token,
        access_expire_timestamp: my_access_expire_timestamp,
        refresh_expire_timestamp: my_access_expire_timestamp,
        id_token: my_id_token // (Optional) Used only for user OpenID verification
      }
      resolve(newToken)
    })
  }

  /**
   * Used to store the new token information
   * Will be looked up using the realmID   
   * 
   * @param {number} realmID the quickbooks companyID
   * @param {object} token
   * @param {string} token.access_token used to access quickbooks resource
   * @param {string} token.refresh_token This should be securely stored
   * @param {number} token.expires_in access_token expire time in seconds, 3600 usually
   * @param {number} token.x_refresh_token_expires_in refresh_token expire time in seconds.  does not always renew on fresh
   * @param {string} token.id_token (Optional) OpenID user token - sent only on original access, not included in refresh token
   * @param {string} token.token_type This will be "Bearer"
   * @param {object} access_expire_timestamp JS Date object when the access_token expires, calculated from expires_in
   * @param {object} refresh_expire_timestamp JS Date object when the refresh_token expires, calculated from x_refresh_token_expires_in
   * @returns {object} Promise
   */
  storeQBToken({ realmID, token, access_expire_timestamp, refresh_expire_timestamp }) {
    return new Promise((resolve) => {
      // Store information to DB or your location here now

      // Return object which includes the access_expire_timestamp & refresh_expire_timestamp
      let newToken = {
        access_token: my_access_token,
        refresh_token: my_refresh_token,
        access_expire_timestamp: my_access_expire_timestamp,
        refresh_expire_timestamp: my_access_expire_timestamp,
        id_token: my_id_token // (Optional) Used only for user OpenID verification
      }
      resolve(newToken)
    })
  }
}
```

## Config setup

A config setup is needed for each app.  Some values have defaults but should supply your own

```javascript
// QB config
QBAppconfig = {
  appKey: QB_APP_KEY,
  appSecret: QB_APP_SECRET,
  redirectUrl: QB_REDIRECT_URL,
  minorversion: 37, /* default if ommited is 37, check for your version in the documents */
  useProduction: QB_USE_PROD, /* default is false */
  debug: (NODE_ENV == "production" ? false : true), /* default is false */
  storeStrategy: new QBStoreStrategy(),  // if ommited uses storage inside the created object
  scope: [
    QuickBooks.scopes.Accounting,
    QuickBooks.scopes.OpenId,
    QuickBooks.scopes.Profile,
    QuickBooks.scopes.Email,
    QuickBooks.scopes.Phone,
    QuickBooks.scopes.Address
  ]
}
```

### Scopes available:

```javascript
QuickBooks.scopes = {
  Accounting: 'com.intuit.quickbooks.accounting',
  Payment: 'com.intuit.quickbooks.payment',
  Payroll: 'com.intuit.quickbooks.payroll',
  TimeTracking: 'com.intuit.quickbooks.payroll.timetracking',
  Benefits: 'com.intuit.quickbooks.payroll.benefits',
  Profile: 'profile',
  Email:  'email',
  Phone: 'phone',
  Address: 'address',
  OpenId: 'openid',
  Intuit_name: 'intuit_name'
}
```


