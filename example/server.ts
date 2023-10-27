import Quickbooks, {
  AppConfig,
  DefaultStore,
  QBStoreStrategy,
  QueryData,
  QueryDataWithProperties,
  StoreGetTokenData,
  StoreSaveTokenData,
  StoreTokenData,
  WebhookPayload,
} from "../src/index";
import "dotenv/config";
import express from "express";
import { Invoice } from "../src/qbTypes";

const { NODE_ENV, QB_APP_KEY, QB_APP_SECRET, QB_REDIRECT_URL, QB_USE_PROD, QB_WEBHOOK_VERIFIER_TOKEN } =
  process.env;

// QB config
const QBAppconfig: AppConfig = {
  appKey: QB_APP_KEY ?? "",
  appSecret: QB_APP_SECRET ?? "",
  redirectUrl: QB_REDIRECT_URL ?? "",
  useProduction: QB_USE_PROD /* default is false */,
  debug: NODE_ENV == "production" ? false : true /* default is false */,
  storeStrategy: new DefaultStore(),
  webhookVerifierToken: QB_WEBHOOK_VERIFIER_TOKEN,
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
})

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
  try {
    const newToken = await Quickbooks.createToken(
      QBAppconfig,
      authCode,
      realmID
    );
    res.send(newToken); // Should not send token out
  } catch (err) {
    console.log("Error getting token", err);
    res.send(err).status(500);
  }
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

  var qbo = new Quickbooks(QBAppconfig, realmID);

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
    res.send(foundInvoices.QueryResponse.Invoice);
  } catch (err: any) {
    console.log("could not run accounts because", err);
    res.send(err);
  }
});

app.post("/quickbooks/findinvoicesquery", async (req, res) => {
  const realmID = req.query.realmID;
  const entityID = req.query.entityID;
  const body = req.body;
  if (!realmID || typeof realmID !== "string") {
    res.status(500).send("realmID is required");
    return;
  }

  var qbo = new Quickbooks(QBAppconfig, realmID);

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

app.post("/quickbooks/countinvoicesquery", async (req, res) => {
  const realmID = req.query.realmID;
  const entityID = req.query.entityID;
  const body = req.body;
  if (!realmID || typeof realmID !== "string") {
    res.status(500).send("realmID is required");
    return;
  }

  var qbo = new Quickbooks(QBAppconfig, realmID);

  try {
    const countInvoices = await qbo.countInvoices(body);
    res.send(countInvoices);
  } catch (err: any) {
    res.send(err);
  }
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

app.get("/quickbooks/createInvoice", async (req, res) => {
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
    const pdfData = await qbo.createInvoice({
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
    res.send(pdfData);
  } catch (err) {
    console.log("could not get invoice", err);
    res.send(err);
  }
});

app.get("/quickbooks/reports", async (req, res) => {
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
    //  @ts-ignore
    const pdfData = await qbo.getReports(entityID);
    res.send(pdfData);
  } catch (err) {
    console.log("could not get report", err);
    res.send(err);
  }
});

app.get("/quickbooks/bigInvoice", async (req, res) => {
  const realmID = req.query.realmID;
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
      name: "JLSPORT",
    },
    CustomerMemo: {
      value: "Thank you for your business and have a great day!",
    },
    BillAddr: {
      Id: "98",
      Line1: "4 Shadbush",
      City: "Westport",
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
      Address: "peterg@varpro.org",
    },
  };

  var qbo = new Quickbooks(QBAppconfig, realmID);

  try {
    const pdfData = await qbo.createInvoice(newInvoice);
    res.send(pdfData);
  } catch (err) {
    console.log("could not get report", err);
    res.send(err);
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
