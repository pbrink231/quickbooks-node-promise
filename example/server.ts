import Quickbooks, {
  AppConfig,
  AppConfigStoreFunctions,
  DefaultStore,
  QBStoreStrategy,
  QueryData,
  QueryDataWithProperties,
  QuickbookEntityType,
  StoreGetTokenData,
  StoreSaveTokenData,
  StoreTokenData,
  WebhookPayload,
} from "../src/index";
import "dotenv/config";
import express from "express";
import { Invoice } from "../src/qbTypes";
import * as path from "path";
import * as fs from "fs";

const { NODE_ENV, QB_APP_KEY, QB_APP_SECRET, QB_REDIRECT_URL, QB_USE_PROD, QB_WEBHOOK_VERIFIER_TOKEN } =
  process.env;

const realms: { [realmId: string]: StoreTokenData } = {};

let usingRealm: string | undefined = undefined;

const storeFunctions: AppConfigStoreFunctions = {
  getToken(realmId, appConfig) {
    return Promise.resolve(realms[realmId]);
  },
  saveToken(realmId, saveTokenData, appConfig, extra) {
    realms[realmId] = saveTokenData;
    return Promise.resolve(saveTokenData);
  },
}
// QB config
const QBAppconfig: AppConfig = {
  appKey: QB_APP_KEY ?? undefined,
  appSecret: QB_APP_SECRET ?? undefined,
  redirectUrl: QB_REDIRECT_URL ?? undefined,
  ...storeFunctions,
  scope: [
    Quickbooks.scopes.Accounting,
    Quickbooks.scopes.OpenId,
    Quickbooks.scopes.Profile,
    Quickbooks.scopes.Email,
    Quickbooks.scopes.Phone,
    Quickbooks.scopes.Address,
  ],
};

// QB config minimal, not used in this example
const QBAppconfigMinimal: AppConfig = {
  autoRefresh: false,
  accessToken: '123'
};

// QB config example, not used in this example
const QBAppconfigSample: AppConfig = {
  appKey: QB_APP_KEY ?? undefined,
  appSecret: QB_APP_SECRET ?? undefined,
  redirectUrl: QB_REDIRECT_URL ?? undefined,
  useProduction: QB_USE_PROD /* default is false */,
  debug: NODE_ENV == "production" ? false : true /* default is false */,
  webhookVerifierToken: QB_WEBHOOK_VERIFIER_TOKEN,
  storeStrategy: new DefaultStore(),
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

const statesMap: {
  [state: string]: {
    expire: Date;
    used: boolean;
  }
} = {};

// --- End points required to get inital token
// QB requestToken - Used to start the process
app.get("/requestToken", (req, res) => {
  const newState = Quickbooks.generateCsrf();
  statesMap[newState] = {
    expire: new Date(Date.now() + 60 * 5 * 1000), // 5 minutes
    used: false,
  };

  const authUrl = Quickbooks.authorizeUrl(QBAppconfig, newState);
  res.redirect(authUrl);
});

// QB token callback - This endpoint must match what you put in your quickbooks app and config
app.get("/callback", async (req, res) => {
  let realmID = req.query.realmId;
  let authCode = req.query.code;
  let state = req.query.state;

  // check state
  if (!state || typeof state !== "string") {
    res.sendStatus(404)
    console.log("state is required");
    return;
  }
  const stateData = statesMap[state];
  console.log("stateData", state, stateData);
  if (!stateData) {
    res.sendStatus(404)
    console.log("state not found");
    return;
  }
  if (stateData.expire < new Date()) {
    res.sendStatus(404)
    console.log("state expired");
    return;
  }
  if (stateData.used) {
    res.sendStatus(404)
    console.log("state already used");
    return;
  }
  stateData.used = true;

  // check realm and authCode
  if (!realmID || typeof realmID !== "string" || !authCode || typeof authCode !== "string") {
    res.sendStatus(404)
    return;
  }

  // create token
  try {
    const qbo = new Quickbooks(QBAppconfig, realmID);
    const newToken = await qbo.createToken(authCode);
    res.send(newToken); // Should not send token out
    usingRealm = realmID;
    console.log(`try http://localhost:${port}/findinvoices?realmID=${realmID}`);
  } catch (err) {
    console.log("Error getting token", err);
    res.send(err).status(500);
  }
});

// Url created inside of quickbooks dev portal
// Also requires webhookVerifierToken on the AppConfig
app.post("/qbwebhook", (req, res) => {
  const webhookPayload = req.body as WebhookPayload
  const signature = req.get('intuit-signature');
  console.log("signature", signature, "webhookPayload", JSON.stringify(webhookPayload, null, 2))

  if (!signature) {
    console.log("no signature");
    res.status(401).send('FORBIDDEN');
    return;
  }

  const signatureCheck = Quickbooks.VerifyWebhookWithConfig(QBAppconfig, webhookPayload, signature);
  if (!signatureCheck) {
    console.log("signatureCheck failed");
    res.status(401).send('FORBIDDEN');
    return
  }

  console.log("webhookPayload is verified");
  res.status(200).send('SUCCESS');

  // do stuff here
})

app.get("/cdc", async (req, res) => {
  const realmID = req.query.realmID ?? usingRealm;
  if (!realmID || typeof realmID !== "string") {
    res.status(500).send("realmID is required");
    return;
  }

  const qbo = new Quickbooks(QBAppconfig, realmID);

  const testDateString = '2021-09-01'
  // minus 30 days from today
  const testDateDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const cdcData = await qbo.changeDataCapture(['Invoice', 'Customer'], testDateDate);

  console.log("cdcData", cdcData);
  console.log("cdcData Custermer", cdcData.CDCResponse[0].QueryResponse[0].Customer);

  res.send(cdcData);
})


app.get("/findinvoices", async (req, res) => {
  const realmID = req.query.realmID ?? usingRealm;
  if (!realmID || typeof realmID !== "string") {
    res.status(500).send("realmID is required");
    return;
  }

  const qbo = new Quickbooks(QBAppconfig, realmID);

  const queryData: QueryDataWithProperties = {
    limit: 10,
  };

  try {
    const foundInvoices = await qbo.findInvoices(queryData);
    res.send(foundInvoices.QueryResponse.Invoice);
  } catch (err: any) {
    console.log("could not run accounts because", err);
    res.send(err);
  }
});

app.get("/getinvoice", async (req, res) => {
  const realmID = req.query.realmID ?? usingRealm;
  const entityID = req.query.entityID;
  if (!realmID || typeof realmID !== "string") {
    res.status(500).send("realmID is required");
    return;
  }
  if (!entityID || typeof entityID !== "string") {
    res.status(500).send("entityID is required");
    return;
  }

  const qbo = new Quickbooks(QBAppconfig, realmID);

  try {
    const grabbedInvoice = await qbo.getInvoice(entityID);
    res.send(grabbedInvoice.Invoice);
  } catch (err: any) {
    console.log("could not get invoice", err);
    res.send(err);
  }
});

app.get("/findInvoicesTest", async (req, res) => {
  const realmID = req.query.realmID ?? usingRealm;
  const entityID = req.query.entityID;
  if (!realmID || typeof realmID !== "string") {
    res.status(500).send("realmID is required");
    return;
  }

  const qbo = new Quickbooks(QBAppconfig, realmID);

  const queryData: QueryDataWithProperties = {
    offset: 1,
    limit: 10,
    items: [
      {
        field: "DocNumber",
        value: "%01",
        operator: "LIKE",
      },
    ],
  };

  try {
    const foundInvoices = await qbo.findInvoices(queryData);
    res.send(foundInvoices);
  } catch (err: any) {
    console.log("could not run accounts because", err);
    res.send(err);
  }
});

app.post("/findinvoicesquery", async (req, res) => {
  const realmID = req.query.realmID ?? usingRealm;
  const entityID = req.query.entityID;
  const body = req.body;
  if (!realmID || typeof realmID !== "string") {
    res.status(500).send("realmID is required");
    return;
  }

  const qbo = new Quickbooks(QBAppconfig, realmID);

  try {
    const foundInvoices = await qbo.findInvoices(body);
    res.send(foundInvoices);
  } catch (err: any) {
    console.log("could not run accounts because", err);
    if (err?.response) {
      console.log("err.response", err.response);
      if (err.response?.Fault) {
        console.log("err.response.Fault", err.response.Fault);
      }
      console.log("err.response.data", err.response.data);
      console.log("err.response.status", await err.response.json());
    }
    res.send(err);
  }
});

app.post("/countinvoicesquery", async (req, res) => {
  const realmID = req.query.realmID ?? usingRealm;
  const entityID = req.query.entityID;
  const body = req.body;
  if (!realmID || typeof realmID !== "string") {
    res.status(500).send("realmID is required");
    return;
  }

  const qbo = new Quickbooks(QBAppconfig, realmID);

  try {
    const countInvoices = await qbo.countInvoices(body);
    res.send(countInvoices);
  } catch (err: any) {
    res.send(err);
  }
});

app.get("/getInvoicePDF", async (req, res) => {
  const realmID = req.query.realmID ?? usingRealm;
  const entityID = req.query.entityID;
  if (!realmID || typeof realmID !== "string") {
    res.status(500).send("Realm is required");
    return;
  }
  if (!entityID || typeof entityID !== "string") {
    res.status(500).send("Entity ID is required");
    return;
  }

  const qbo = new Quickbooks(QBAppconfig, realmID);

  try {
    const pdfData = await qbo.getInvoicePdf(entityID);
    res.contentType("application/pdf");
    res.send(pdfData);
  } catch (err) {
    console.log("could not get invoice", err);
    res.send(err);
  }
});

app.post("/createInvoice", async (req, res) => {
  const realmID = req.query.realmID ?? usingRealm;
  const entityID = req.query.entityID;
  if (!realmID || typeof realmID !== "string") {
    res.status(500).send("Realm is required");
    return;
  }
  if (!entityID || typeof entityID !== "string") {
    res.status(500).send("Entity ID is required");
    return;
  }

  const qbo = new Quickbooks(QBAppconfig, realmID);

  try {
    const newInvoiceData = await qbo.createInvoice({
      DueDate: "2021-09-30",
      Line: [
        {
          Amount: 100.0,
          DetailType: "SalesItemLineDetail",
          SalesItemLineDetail: {
            ItemRef: {
              value: "1",
            },
          },
        },
      ],
    });
    res.contentType("application/pdf");
    res.send(newInvoiceData);
  } catch (err) {
    console.log("could not get invoice", err);
    res.send(err);
  }
});

app.get("/reports", async (req, res) => {
  const realmID = req.query.realmID ?? usingRealm;
  const entityID = req.query.entityID;
  if (!realmID || typeof realmID !== "string") {
    res.status(500).send("Realm is required");
    return;
  }
  if (!entityID || typeof entityID !== "string") {
    res.status(500).send("Entity ID is required");
    return;
  }

  const qbo = new Quickbooks(QBAppconfig, realmID);

  try {
    //  @ts-ignore
    const pdfData = await qbo.getReports(entityID);
    res.send(pdfData);
  } catch (err) {
    console.log("could not get report", err);
    res.send(err);
  }
});

app.post("/bigInvoice", async (req, res) => {
  const realmID = req.query.realmID ?? usingRealm;
  if (!realmID || typeof realmID !== "string") {
    res.status(500).send("Realm is required");
    return;
  }

  const newInvoice: Invoice = {
    CustomField: [
      {
        DefinitionId: "1",
        StringValue: "483 - Testing",
      },
    ],
    DocNumber: "1045",
    TxnDate: "2019-05-18",
    CurrencyRef: {
      value: "USD",
    },
    Line: [
      {
        Id: "1",
        Description: "Some first item here description here",
        Amount: 300,
        DetailType: "SalesItemLineDetail",
        SalesItemLineDetail: {
          ItemRef: {
            value: "24",
            name: "another item",
          },
          UnitPrice: 20,
          Qty: 15,
          TaxCodeRef: {
            value: "NON",
          },
        },
      },
      {
        Id: "2",
        LineNum: 2,
        Description: "and here",
        Amount: 12,
        DetailType: "SalesItemLineDetail",
        SalesItemLineDetail: {
          ItemRef: {
            value: "25",
            name: "item 3",
          },
          UnitPrice: 12,
          Qty: 1,
          TaxCodeRef: {
            value: "NON",
          },
        },
      },
      {
        Amount: 82.95,
        DetailType: "DiscountLineDetail",
        DiscountLineDetail: {},
      },
      {
        Amount: 312,
        DetailType: "SubTotalLineDetail",
        SubTotalLineDetail: {},
      },
    ],
    CustomerRef: {
      value: "61",
      name: "Test Customer",
    },
    CustomerMemo: {
      value: "Thank you for your business and have a great day!",
    },
    BillAddr: {
      Id: "98",
      Line1: "42 Earth St",
      City: "Hitchhiker",
      Country: "USA",
      CountrySubDivisionCode: "CT",
      PostalCode: "06880",
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
    TrackingNum: "aaaaaaa",
    TotalAmt: 312,
    ApplyTaxAfterDiscount: true,
    PrintStatus: "NotSet",
    EmailStatus: "NotSet",
    BillEmail: {
      Address: "somebody@gmail.come",
    },
  };

  const qbo = new Quickbooks(QBAppconfig, realmID);

  try {
    const pdfData = await qbo.createInvoice(newInvoice);
    res.send(pdfData);
  } catch (err) {
    console.log("could not get report", err);
    res.send(err);
  }
});

app.post("/deleteInvoice", async (req, res) => {
  const realmID = req.query.realmID ?? usingRealm;
  const entityID = req.query.entityID;

  if (!realmID || typeof realmID !== "string") {
    res.status(500).send("realmID is required");
    return;
  }
  if (!entityID || typeof entityID !== "string") {
    res.status(500).send("entityID is required");
    return;
  }

  const qbo = new Quickbooks(QBAppconfig, realmID);

  try {
    const deletedInvoice = await qbo.deleteInvoice(entityID);
    deletedInvoice.Invoice.Id = entityID;
    res.send(deletedInvoice);
  } catch (err: any) {
    res.send(err);
  }
});

app.post("/uploadInvoiceFile", async (req, res) => {
  const realmID = req.query.realmID ?? usingRealm;
  const entityID = req.query.entityID;

  if (!realmID || typeof realmID !== "string") {
    res.status(500).send("realmID is required");
    return;
  }
  if (!entityID || typeof entityID !== "string") {
    res.status(500).send("entityID is required");
    return;
  }


  try {
    const qbo = new Quickbooks(QBAppconfig, realmID);

    const filePath = path.join(__dirname, 'sample.pdf');
    const fileData = fs.readFileSync(filePath);
    const uploadResponse = await qbo.upload('sample.pdf', 'application/pdf', fileData, 'Invoice', entityID);
    console.log("uploadResponse", uploadResponse);
    const firstAttchment = uploadResponse.AttachableResponse[0].Attachable;
    const attachableInvoiceId = firstAttchment?.AttachableRef?.[0].EntityRef?.value
    const fileName = firstAttchment?.FileName
    res.send(uploadResponse);
  } catch (err) {
    console.log("err", err);
    res.send(err);
  }
});

app.get("/userinfo", async (req, res) => {
  const realmID = req.query.realmID ?? usingRealm;
  if (!realmID || typeof realmID !== "string") {
    res.status(500).send("realmID is required");
    return;
  }

  const qbo = new Quickbooks(QBAppconfig, realmID);

  try {
    const userInfo = await qbo.getUserInfo();
    res.send(userInfo);
  } catch (err: any) {
    res.send(err);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
  console.log(`try http://localhost:${port}/requestToken`)
});
