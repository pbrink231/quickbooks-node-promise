const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const QuickBooks = require('..')

var jsonParser = bodyParser.json()

const port = process.env.PORT || 3000;
const app = express();
//app.use(cors('*'));


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

