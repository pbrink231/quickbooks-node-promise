require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const QuickBooks = require('..')

var jsonParser = bodyParser.json()

const port = process.env.PORT || 3000;
const app = express();
//app.use(cors('*'));

app.get('/health', (req, res) => {
  res.sendStatus(200)
})

const {
  NODE_ENV,
  QB_APP_KEY,
  QB_APP_SECRET,
  QB_REDIRECT_URL,
  QB_USE_PROD
} = process.env;

// for example only, save to a better location
let realmInfo = {}


class QBStoreStrategy {
  getQBToken({ realmID }) {
    return new Promise((resolve, reject) => {
      console.log('realm info', realmInfo[realmID])
      if (!realmInfo[realmID]) {
        reject("missing realm informaiton")
      } else {
        resolve(realmInfo[realmID])
      }
    })
  }
  storeQBToken({ realmID, token, access_expire_timestamp, refresh_expire_timestamp }) {
    return new Promise((resolve) => {
      realmInfo[realmID] = {
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        access_expire_timestamp: access_expire_timestamp,
        refresh_expire_timestamp: refresh_expire_timestamp
      }
      console.log('saving realm info', realmInfo[realmID])
      resolve(realmInfo[realmID])
    })
  }
}


// QB config
QBAppconfig = {
  appKey: QB_APP_KEY,
  appSecret: QB_APP_SECRET,
  redirectUrl: QB_REDIRECT_URL,
  minorversion: 37, /* default is 37, check for your version in the documents */
  useProduction: QB_USE_PROD, /* default is false */
  debug: (NODE_ENV == "production" ? false : true), /* default is false */
  storeStrategy: new QBStoreStrategy(),
  scope: [
    QuickBooks.scopes.Accounting,
    QuickBooks.scopes.OpenId,
    QuickBooks.scopes.Profile,
    QuickBooks.scopes.Email,
    QuickBooks.scopes.Phone,
    QuickBooks.scopes.Address
  ]
}

// --- End points required to get inital token
// QB requestToken - Used to start the process
app.get('/quickbooks/requestToken', (req, res) => {
  let authUrl = QuickBooks.authorizeUrl(QBAppconfig)
  res.redirect(authUrl);
});

// QB token callback - This endpoint must match what you put in your quickbooks app and config
app.get('/quickbooks/callback', async (req, res) => {
  let realmID = req.query.realmId
  let authCode = req.query.code
  QuickBooks.createToken(QBAppconfig, authCode, realmID)
  .then(newToken => {
    res.send(newToken)  // Should not send token out
  }).catch(err => {
    console.log('Error getting token', err)
    res.send(err).status(500);
  })
});


//--- Example grabbing data ----
// QB User Info
app.get('/quickbooks/userinfo', (req, res) => {
  const realmID = req.query.realmID;
  if (!realmID) {
    res.send("Realm is required").sendStatus(500)
    return
  }
  
  var qbo = new QuickBooks(QBAppconfig, realmID)
  qbo.getUserInfo().then(userInfo => {
    res.send(userInfo)
  }).catch(err => {
    res.send(err)
  })
})

// QB test
app.get('/quickbooks/getaccounts', async (req, res) => {
  const realmID = req.query.realmID;
  if (!realmID) {
    res.send("Realm is required").sendStatus(500)
    return
  }

  var qbo = new QuickBooks(QBAppconfig, realmID)

  qbo.findAccounts().then(jsonResponse => {
    res.send(jsonResponse.QueryResponse.Account)
  }).catch(err => {
    console.log('could not run accounts because', err)
    res.send(err)
  })
})

app.get('/quickbooks/getinvoices', async (req, res) => {
  const realmID = req.query.realmID;
  if (!realmID) {
    res.send("Realm is required").sendStatus(500)
    return
  }

  var qbo = new QuickBooks(QBAppconfig, realmID)

  qbo.findInvoices().then(jsonResponse => {
    res.send(jsonResponse.QueryResponse.Invoice)
  }).catch(err => {
    console.log('could not run invoices because', err)
    res.send(err)
  });
})

app.get('/quickbooks/refreshtoken', async (req, res) => {
  const realmID = req.query.realmID;
  if (!realmID) {
    res.send("Realm is required").sendStatus(500)
    return
  }

  var qbo = new QuickBooks(QBAppconfig, realmID)

  qbo.refreshAccessToken().then(newToken => {
    res.send(newToken)
  }).catch(err => {
    console.log('could not run invoices because', err)
    res.send(err)
  });
})

app.listen(port, () => console.log(`Listening on port ${port}`));

