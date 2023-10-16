import Quickbooks, { QBStoreStrategy, StoreGetTokenData, StoreSaveTokenData, StoreTokenData } from '../index.js';
import 'dotenv/config'
import express from 'express';

const { NODE_ENV, QB_APP_KEY, QB_APP_SECRET, QB_REDIRECT_URL, QB_USE_PROD } =
  process.env;

class store extends QBStoreStrategy {
    realmInfo: { [key: string]: StoreTokenData } = {};
    constructor() {
        super();
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

const QBAppconfig: AppConfig = {
    appKey: 'appKey',
    appSecret: 'appSecret',
    redirectUrl: 'redirectUrl',
    scope: ['scope'],
    storeStrategy: new store(),
}

const port = process.env.PORT || 3000;
const app = express();
//app.use(cors('*'));
app.use(express.json())




app.get("/health", (req, res) => {
  res.send("Looking goood!!");
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

  const grabbedInvoice = qbo.getInvoice(entityID)
    .then((jsonResponse) => {
      res.send(jsonResponse.Invoice);
    })
    .catch((err: any) => {
      console.log("could not get invoice", err);
      res.send(err);
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

  qbo.findAccounts()
  .then((jsonResponse) => {
    res.send(jsonResponse.QueryResponse.Account);
  })
  .catch((err: any) => {
    console.log("could not run accounts because", err);
    res.send(err);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));