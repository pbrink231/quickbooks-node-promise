import Quickbooks, {
  AppConfig,
  QBStoreStrategy,
  StoreGetTokenData,
  StoreSaveTokenData,
  StoreTokenData,
} from "../src/index";
import "dotenv/config";
import express from "express";

const { NODE_ENV, QB_APP_KEY, QB_APP_SECRET, QB_REDIRECT_URL, QB_USE_PROD } =
  process.env;

  class QBStore implements QBStoreStrategy {
    realmInfo: { [key: string]: StoreTokenData } = {};
    constructor() {
      this.realmInfo = {};
    }
    getQBToken(getTokenData: StoreGetTokenData) {
      const realmID = getTokenData.realmID.toString();
      return new Promise<StoreTokenData>((resolve, reject) => {
        console.log("realm info", this.realmInfo[realmID]);
        if (!this.realmInfo[realmID]) {
          reject("missing realm informaiton");
        }
        const token = this.realmInfo[realmID];
        resolve(token);
      });
    }
    storeQBToken({
      realmID,
      token,
      access_expire_timestamp,
      refresh_expire_timestamp,
    }: StoreSaveTokenData) {
      return new Promise<StoreTokenData>((resolve) => {
        this.realmInfo[realmID] = {
          realmID: realmID,
          access_token: token.access_token,
          refresh_token: token.refresh_token,
          access_expire_timestamp: access_expire_timestamp,
          refresh_expire_timestamp: refresh_expire_timestamp,
        };
        const storeToken = this.realmInfo[realmID];
        resolve(storeToken);
      });
    }
  }
  

// QB config
const QBAppconfig: AppConfig = {
  appKey: QB_APP_KEY ?? '',
  appSecret: QB_APP_SECRET ?? '',
  redirectUrl: QB_REDIRECT_URL ?? '',
  useProduction: QB_USE_PROD /* default is false */,
  debug: NODE_ENV == "production" ? false : true /* default is false */,
  storeStrategy: new QBStore(),
  scope: [
    Quickbooks.scopes.Accounting,
    Quickbooks.scopes.OpenId,
    Quickbooks.scopes.Profile,
    Quickbooks.scopes.Email,
    Quickbooks.scopes.Phone,
    Quickbooks.scopes.Address,
  ],
};

const port = process.env.PORT || 3000;
const app = express();
//app.use(cors('*'));
app.use(express.json());

app.get("/health", (req, res) => {
  res.send("Looking goood!!");
});

// --- End points required to get inital token
// QB requestToken - Used to start the process
app.get("/quickbooks/requestToken", (req, res) => {
  let authUrl = Quickbooks.authorizeUrl(QBAppconfig);
  res.redirect(authUrl);
});

// QB token callback - This endpoint must match what you put in your quickbooks app and config
app.get("/quickbooks/callback", async (req, res) => {
  let realmID = req.query.realmId;
  let authCode = req.query.code;
  // let state = req.query.state;
  if (!realmID || typeof realmID !== "string") {
    res.status(500).send("realmID is required");
    return;
  }
  if (!authCode || typeof authCode !== "string") {
    res.status(500).send("authCode is required");
    return;
  }
  Quickbooks.createToken(QBAppconfig, authCode, realmID)
    .then((newToken) => {
      res.send(newToken); // Should not send token out
    })
    .catch((err) => {
      console.log("Error getting token", err);
      res.send(err).status(500);
    });
});


app.get("/quickbooks/getinvoice", async (req, res) => {
  const realmID = req.query.realmID;
  const entityID = req.query.entityID;
  if (!realmID || typeof realmID !== "string") {
    res.status(500).send("realmID is required");
    return;
  }
  if (!entityID || typeof entityID !== "string") {
    res.status(500).send("entityID is required");
    return;
  }

  var qbo = new Quickbooks(QBAppconfig, realmID);

  try {
    const grabbedInvoice = await qbo.getInvoice(entityID);
    res.send(grabbedInvoice.Invoice);
  } catch (err: any) {
    console.log("could not get invoice", err);
    res.send(err);
  }
});

app.get("/quickbooks/findinvoices", async (req, res) => {
  const realmID = req.query.realmID;
  const entityID = req.query.entityID;
  if (!realmID || typeof realmID !== "string") {
    res.status(500).send("realmID is required");
    return;
  }
  if (!entityID || typeof entityID !== "string") {
    res.status(500).send("entityID is required");
    return;
  }

  var qbo = new Quickbooks(QBAppconfig, realmID);

  qbo
    .findAccounts()
    .then((jsonResponse) => {
      res.send(jsonResponse.QueryResponse.Account);
    })
    .catch((err: any) => {
      console.log("could not run accounts because", err);
      res.send(err);
    });
});

app.get("/quickbooks/getInvoicePDF", async (req, res) => {
  const realmID = req.query.realmID;
  const entityID = req.query.entityID;
  if (!realmID || typeof realmID !== "string") {
    res.status(500).send("Realm is required");
    return;
  }
  if (!entityID || typeof entityID !== "string") {
    res.status(500).send("Entity ID is required");
    return;
  }

  var qbo = new Quickbooks(QBAppconfig, realmID);

  try {
    const pdfData = await qbo.getInvoicePdf(entityID);
    res.contentType("application/pdf");
    res.send(pdfData);
  } catch (err) {
    console.log("could not get invoice", err);
    res.send(err);
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
