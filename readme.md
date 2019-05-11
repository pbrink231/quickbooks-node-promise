# This is still early so use with caution

## Overview

I made this because there is node-quickbooks which is really good but made on callbacks and I didnt want to get into that.  I also wanted to auto refresh the tokens on calls since access_tokens only last 60 minutes.


#  Setup

There is a default StoreStrategy which uses memory and is internal to the object.  Best to create your own store strategy.

```javascript
class QBStoreStrategy {
  getQBToken({ realmID }) {
    /**
     * Uses a realmID to lookup the token information.
     * Should return back in an object
     * let token = {
     *  access_token
     *  refresh_token              // This should be securely stored
     *  access_expire_timestamp    // Datetime when the access token expires - if not returned assumed bad for each request
     *  refresh_expire_timestamp   // Datetime when the refresh token expires - if not returned assumed good for each request
     *  ID token                   // (Optional) Used for OpenID information
     * }
     */
    return token  // includes the access_expire_timestamp & refresh_expire_timestamp
  }
  storeQBToken({ realmID, token, access_expire_timestamp, refresh_expire_timestamp }) {
    /**
     * Used to store the new token information
     * Will be looked up using the realmID
     * 
     * realmID - Big Integer - the quickbooks companyID
     * token - {
     *  refresh_token
     *  access_token
     *  expires_in                    // access_token expire time in seconds, 3600 usually
     *  x_refresh_token_expires_in    // refresh_token expire time in seconds
     *  id_token                      // (sometimes) - OpenID user token - sent only on original access, not included after refresh token
     *  token_type                    // usually "Bearer"
     * }
     * access_expire_timestamp        // datetime when the access_token expires, calculated from expires_in
     * refresh_expire_timestamp       // datetime when the refresh_token expires, calculated from x_refresh_token_expires_in
     */

    return token  // includes the access_expire_timestamp & refresh_expire_timestamp
  }
}
```

Also need a config setup

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

Available scopes are:

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


