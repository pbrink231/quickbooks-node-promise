require("dotenv").config();
const express = require("express");
const QuickBooks = require("..");

const port = process.env.PORT || 3000;
const app = express();
//app.use(cors('*'));

app.get("/health", (req, res) => {
  res.send("Looking goood!!");
});

const { NODE_ENV, QB_APP_KEY, QB_APP_SECRET, QB_REDIRECT_URL, QB_USE_PROD } =
  process.env;

// for example only, save to a better location
let realmInfo = {};

class QBStoreStrategy {
  getQBToken({ realmID }) {
    return new Promise((resolve, reject) => {
      console.log("realm info", realmInfo[realmID]);
      if (!realmInfo[realmID]) {
        reject("missing realm informaiton");
      } else {
        resolve(realmInfo[realmID]);
      }
    });
  }
  storeQBToken({
    realmID,
    token,
    access_expire_timestamp,
    refresh_expire_timestamp,
  }) {
    return new Promise((resolve) => {
      realmInfo[realmID] = {
        realmID: realmID,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        access_expire_timestamp: access_expire_timestamp,
        refresh_expire_timestamp: refresh_expire_timestamp,
      };
      resolve(realmInfo[realmID]);
    });
  }
}

// QB config
QBAppconfig = {
  appKey: QB_APP_KEY,
  appSecret: QB_APP_SECRET,
  redirectUrl: QB_REDIRECT_URL,
  minorversion: 69 /* default is 69, check for your version in the documents */,
  useProduction: QB_USE_PROD /* default is false */,
  debug: NODE_ENV == "production" ? false : true /* default is false */,
  storeStrategy: new QBStoreStrategy(),
  scope: [
    QuickBooks.scopes.Accounting,
    QuickBooks.scopes.OpenId,
    QuickBooks.scopes.Profile,
    QuickBooks.scopes.Email,
    QuickBooks.scopes.Phone,
    QuickBooks.scopes.Address,
  ],
};

// --- End points required to get inital token
// QB requestToken - Used to start the process
app.get("/quickbooks/requestToken", (req, res) => {
  let authUrl = QuickBooks.authorizeUrl(QBAppconfig);
  res.redirect(authUrl);
});

// QB token callback - This endpoint must match what you put in your quickbooks app and config
app.get("/quickbooks/callback", async (req, res) => {
  let realmID = req.query.realmId;
  let authCode = req.query.code;
  let state = req.query.state;
  QuickBooks.createToken(QBAppconfig, authCode, realmID)
    .then((newToken) => {
      res.send(newToken); // Should not send token out
    })
    .catch((err) => {
      console.log("Error getting token", err);
      res.send(err).status(500);
    });
});

//--- Example grabbing data ----
// QB User Info
app.get("/quickbooks/userinfo", (req, res) => {
  const realmID = req.query.realmID;
  if (!realmID) {
    res.status(500).send("realmID is required");
    return;
  }

  var qbo = new QuickBooks(QBAppconfig, realmID);
  qbo
    .getUserInfo()
    .then((userInfo) => {
      res.send(userInfo);
    })
    .catch((err) => {
      res.send(err);
    });
});

// QB test
app.get("/quickbooks/getaccounts", async (req, res) => {
  const realmID = req.query.realmID;
  if (!realmID) {
    res.status(500).send("realmID is required");
    return;
  }

  var qbo = new QuickBooks(QBAppconfig, realmID);

  qbo
    .findAccounts()
    .then((jsonResponse) => {
      res.send(jsonResponse.QueryResponse.Account);
    })
    .catch((err) => {
      console.log("could not run accounts because", err);
      res.send(err);
    });
});

app.get("/quickbooks/getprefs", async (req, res) => {
  const realmID = req.query.realmID;
  if (!realmID) {
    res.status(500).send("realmID is required");
    return;
  }

  var qbo = new QuickBooks(QBAppconfig, realmID);

  qbo
    .getPreferences()
    .then((jsonResponse) => {
      res.send(jsonResponse.Preferences);
    })
    .catch((err) => {
      console.log("could not get prefs", err);
      res.send(err);
    });
});

app.get("/quickbooks/getinvoices", async (req, res) => {
  const realmID = req.query.realmID;
  if (!realmID) {
    res.status(500).send("realmID is required");
    return;
  }

  var qbo = new QuickBooks(QBAppconfig, realmID);

  qbo.reportInventoryValuationSummary;
  qbo
    .findInvoices()
    .then((jsonResponse) => {
      res.send(jsonResponse.QueryResponse.Invoice);
    })
    .catch((err) => {
      console.log("could not run invoices because", err);
      res.send(err);
    });
});

app.get("/quickbooks/getinvoice", async (req, res) => {
  const realmID = req.query.realmID;
  const entityID = req.query.entityID;
  if (!realmID) {
    res.status(500).send("realmID is required");
    return;
  }
  if (!entityID) {
    res.status(500).send("entityID is required");
    return;
  }

  var qbo = new QuickBooks(QBAppconfig, realmID);

  qbo
    .getInvoice(entityID)
    .then((jsonResponse) => {
      res.send(jsonResponse.Invoice);
    })
    .catch((err) => {
      console.log("could not get invoice", err);
      res.send(err);
    });
});

app.get("/quickbooks/createinvoice", async (req, res) => {
  const realmID = req.query.realmID;
  if (!realmID) {
    res.status(500).send("realmID is required");
    return;
  }

  var qbo = new QuickBooks(QBAppconfig, realmID);

  let prefs = await qbo
    .getPreferences()
    .then((json) => {
      return json.Preferences;
    })
    .catch((err) => {
      res.send(err);
    });
  let defaultDiscountAccount = prefs.SalesFormsPrefs.DefaultDiscountAccount;
  let defaultMessage = prefs.SalesFormsPrefs.DefaultCustomerMessage;

  newInvoice = {
    DocNumber: "CR1052",
    TxnDate: "2019-04-12",
    CustomField: [
      {
        DefinitionId: "1",
        StringValue: "123 - Marloone",
      },
    ],
    CustomerRef: {
      value: "61",
    },
    Line: [
      {
        Description: "Some first item here description here",
        Amount: 230,
        DetailType: "SalesItemLineDetail",
        SalesItemLineDetail: {
          ItemRef: {
            value: "26",
          },
          UnitPrice: 23,
          Qty: 10,
        },
      },
      {
        Description: "and here",
        Amount: 12,
        DetailType: "SalesItemLineDetail",
        SalesItemLineDetail: {
          ItemRef: {
            value: "27",
          },
          UnitPrice: 12,
          Qty: 1,
        },
      },
      {
        Amount: 82.95,
        DetailType: "DiscountLineDetail",
        DiscountLineDetail: {
          DiscountAccountRef: {
            value: defaultDiscountAccount,
          },
        },
      },
      {
        Amount: 20,
        DetailType: "SalesItemLineDetail",
        SalesItemLineDetail: {
          ItemRef: {
            value: "SHIPPING_ITEM_ID",
          },
        },
      },
    ],
    CurrencyRef: {
      value: "USD",
    },
    CustomerMemo: {
      value: defaultMessage,
    },
    BillAddr: {
      Line1: "bla bla",
      City: "Some City",
      Country: "USA",
      CountrySubDivisionCode: "CT",
      PostalCode: "06850",
    },
    SalesTermRef: {
      value: "11",
    },
    DueDate: "2019-06-17",
    ShipMethodRef: {
      value: "fedex",
      name: "fedex",
    },
    ShipDate: "2019-05-22",
    TrackingNum: "aaaaaa",
    ApplyTaxAfterDiscount: true,
    BillEmail: {
      Address: "someemail@email.com",
    },
  };

  qbo
    .createInvoice(newInvoice)
    .then((jsonResponse) => {
      res.send(jsonResponse);
    })
    .catch((err) => {
      console.log("could not create invoice", err);
      res.send(err);
    });
});

app.get("/quickbooks/updateinvoice", async (req, res) => {
  const realmID = req.query.realmID;
  if (!realmID) {
    res.status(500).send("Realm is required");
    return;
  }

  var qbo = new QuickBooks(QBAppconfig, realmID);

  let sparseUpdate = {
    Id: "160",
    SyncToken: "3",
    sparse: true,
    BillAddr: {
      Line1: "Some customer",
      Line2: "123 Gramercy st",
      City: "Some city",
      Country: "USA",
      CountrySubDivisionCode: "CT",
      PostalCode: "06850",
    },
    Line: [
      // will remove items not in this list from the invoice
      {
        Id: "13",
        Description: "8765876",
        Amount: 625,
        DetailType: "SalesItemLineDetail",
        SalesItemLineDetail: {
          ItemRef: {
            value: "26",
          },
          UnitPrice: 25,
          Qty: 25,
        },
      },
    ],
  };

  qbo
    .updateInvoice(sparseUpdate)
    .then((jsonResponse) => {
      res.send(jsonResponse);
    })
    .catch((err) => {
      console.log("could not update invoice", err);
      res.send(err);
    });
});

app.get("/quickbooks/getInvoicePDF", async (req, res) => {
  const realmID = req.query.realmID;
  const entityID = req.query.entityID;
  if (!realmID) {
    res.status(500).send("Realm is required");
    return;
  }
  if (!entityID) {
    res.status(500).send("Entity ID is required");
    return;
  }

  var qbo = new QuickBooks(QBAppconfig, realmID);

  try {
    const pdfData = await qbo.getInvoicePdf(entityID);
    res.contentType("application/pdf");
    res.send(pdfData);
  } catch (err) {
    console.log("could not get invoice", err);
    res.send(err);
  }
});

app.get("/quickbooks/sendInvoicePdf", async (req, res) => {
  const realmID = req.query.realmID;
  const entityID = req.query.entityID;
  const email = req.query.email;
  if (!realmID) {
    res.status(500).send("Realm is required");
    return;
  }
  if (!entityID) {
    res.status(500).send("Entity ID is required");
    return;
  }
  if (!email) {
    res.status(500).send("Email is required");
    return;
  }

  var qbo = new QuickBooks(QBAppconfig, realmID);

  qbo
    .sendInvoicePdf(entityID, email)
    .then((jsonResponse) => {
      res.send(jsonResponse);
    })
    .catch((err) => {
      console.log("could not send invoice", err);
      res.send(err);
    });
});

app.get("/quickbooks/getcustomerbalance", async (req, res) => {
  const realmID = req.query.realmID;
  if (!realmID) {
    res.status(500).send("Realm is required");
    return;
  }

  var qbo = new QuickBooks(QBAppconfig, realmID);

  qbo
    .reportCustomerBalance({ customer: 61 })
    .then((jsonResponse) => {
      res.send(jsonResponse);
    })
    .catch((err) => {
      console.log("could not get customer balance", err);
      res.send(err);
    });
});

app.get("/quickbooks/refreshtoken", async (req, res) => {
  const realmID = req.query.realmID;
  if (!realmID) {
    res.status(500).send("Realm is required");
    return;
  }

  var qbo = new QuickBooks(QBAppconfig, realmID);

  qbo
    .refreshAccessToken()
    .then((newToken) => {
      res.send(newToken);
    })
    .catch((err) => {
      console.log("could not run invoices because", err);
      res.send(err);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
