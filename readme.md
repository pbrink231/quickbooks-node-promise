# Overview

This library was created for Quickbooks OAuth2.  It converted a lot of node-quickbooks into promises.

Will handle the authentication and auto renew Access Tokens when they are expired.

## Example grabbing resource
```javascript
const QuickBooks = require("quickbooks-node-promise");
const qbo = new QuickBooks(appConfig, realmID);
const customers = await qbo.findCustomers({ Id: "1234" });
const customer = customer.QueryResponse.Customer[0]
console.log(`Hi my customer's name is ${customer.Name}`)
```

#  Setup

**Check the example for node express setup endpoints**

[Example of server on github](https://github.com/pbrink231/quickbooks-node-promise/tree/master/example)

## Install

```
npm i quickbooks-node-promise
```

## Config setup

A config setup is needed for each app.  Some values have defaults but should supply your own

```javascript
// QB config
QBAppconfig = {
  appKey: QB_APP_KEY,
  appSecret: QB_APP_SECRET,
  redirectUrl: QB_REDIRECT_URL,
  storeStrategy: new DefaultStore(), /* should create your own, can use the exported DefaultStore */
  minorversion: 69, /* OPTIONAL, default is the latest */
  useProduction: QB_USE_PROD, /* OPTIONAL, default is false */
  debug: (NODE_ENV == "production" ? false : true), /* OPTIONAL, default is false */
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

## Create Store Strategy
The store strategy is used to Save and Retreive token information.  Both methods return a promise.  The example below uses memory to store the token.  Should create your own store strategy to save to a database or some other location.

```ts
class QBStore implements QBStoreStrategy {
  realmInfo: { [key: string]: StoreTokenData } = {};
  constructor() {
    this.realmInfo = {};
  }
  /**
   * Uses a realmID to lookup the token information.
   * Must return a promise with the token information
   * give { realmID: number} as input
   */
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
  /**
   * Used to store the new token information
   * Will be looked up using the realmID
   */
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
```

<a name="QuickBooks"></a>

# QuickBooks Methods
**Kind**: global class  

* [QuickBooks](#QuickBooks)
    * [new QuickBooks(appConfig, realmID)](#new_QuickBooks_new)
    * _instance_
        * [.authorizeUrl()](#QuickBooks+authorizeUrl) ΓçÆ <code>string</code>
        * [.createToken(authCode, realmID)](#QuickBooks+createToken) ΓçÆ <code>object</code>
        * [.saveToken(token)](#QuickBooks+saveToken)
        * [.getToken()](#QuickBooks+getToken)
        * [.refreshWithAccessToken(token)](#QuickBooks+refreshWithAccessToken) ΓçÆ <code>Token</code>
        * [.refreshAccessToken()](#QuickBooks+refreshAccessToken) ΓçÆ <code>Token</code>
        * [.revokeAccess(useRefresh)](#QuickBooks+revokeAccess)
        * [.validateIdToken()](#QuickBooks+validateIdToken)
        * [.getPublicKey(modulus, exponent)](#QuickBooks+getPublicKey)
        * [.getUserInfo()](#QuickBooks+getUserInfo)
        * [.batch(items)](#QuickBooks+batch)
        * [.changeDataCapture(entities, since)](#QuickBooks+changeDataCapture)
        * [.upload(filename, contentType, stream, entityType, entityId)](#QuickBooks+upload)
        * [.createAccount(account)](#QuickBooks+createAccount)
        * [.createAttachable(attachable)](#QuickBooks+createAttachable)
        * [.createBill(bill)](#QuickBooks+createBill)
        * [.createBillPayment(billPayment)](#QuickBooks+createBillPayment)
        * [.createClass(class)](#QuickBooks+createClass)
        * [.createCreditMemo(creditMemo)](#QuickBooks+createCreditMemo)
        * [.createCustomer(customer)](#QuickBooks+createCustomer)
        * [.createDepartment(department)](#QuickBooks+createDepartment)
        * [.createDeposit(deposit)](#QuickBooks+createDeposit)
        * [.createEmployee(employee)](#QuickBooks+createEmployee)
        * [.createEstimate(estimate)](#QuickBooks+createEstimate)
        * [.createInvoice(invoice)](#QuickBooks+createInvoice)
        * [.createItem(item)](#QuickBooks+createItem)
        * [.createJournalCode(journalCode)](#QuickBooks+createJournalCode)
        * [.createJournalEntry(journalEntry)](#QuickBooks+createJournalEntry)
        * [.createPayment(payment)](#QuickBooks+createPayment)
        * [.createPaymentMethod(paymentMethod)](#QuickBooks+createPaymentMethod)
        * [.createPurchase(purchase)](#QuickBooks+createPurchase)
        * [.createPurchaseOrder(purchaseOrder)](#QuickBooks+createPurchaseOrder)
        * [.createRefundReceipt(refundReceipt)](#QuickBooks+createRefundReceipt)
        * [.createSalesReceipt(salesReceipt)](#QuickBooks+createSalesReceipt)
        * [.createTaxAgency(taxAgency)](#QuickBooks+createTaxAgency)
        * [.createTaxService(taxService)](#QuickBooks+createTaxService)
        * [.createTerm(term)](#QuickBooks+createTerm)
        * [.createTimeActivity(timeActivity)](#QuickBooks+createTimeActivity)
        * [.createTransfer(transfer)](#QuickBooks+createTransfer)
        * [.createVendor(vendor)](#QuickBooks+createVendor)
        * [.createVendorCredit(vendorCredit)](#QuickBooks+createVendorCredit)
        * [.getAccount(Id)](#QuickBooks+getAccount)
        * [.getAttachable(Id)](#QuickBooks+getAttachable)
        * [.getBill(Id)](#QuickBooks+getBill)
        * [.getBillPayment(Id)](#QuickBooks+getBillPayment)
        * [.getClass(Id)](#QuickBooks+getClass)
        * [.getCompanyInfo(Id)](#QuickBooks+getCompanyInfo)
        * [.getCreditMemo(Id)](#QuickBooks+getCreditMemo)
        * [.getCustomer(Id)](#QuickBooks+getCustomer)
        * [.getDepartment(Id)](#QuickBooks+getDepartment)
        * [.getDeposit(Id)](#QuickBooks+getDeposit)
        * [.getEmployee(Id)](#QuickBooks+getEmployee)
        * [.getEstimate(Id)](#QuickBooks+getEstimate)
        * [.getExchangeRate(options)](#QuickBooks+getExchangeRate)
        * [.getEstimatePdf(Id)](#QuickBooks+getEstimatePdf)
        * [.sendEstimatePdf(Id, sendTo)](#QuickBooks+sendEstimatePdf)
        * [.getInvoice(Id)](#QuickBooks+getInvoice)
        * [.getInvoicePdf(Id)](#QuickBooks+getInvoicePdf)
        * [.sendInvoicePdf(Id, sendTo)](#QuickBooks+sendInvoicePdf)
        * [.getItem(Id)](#QuickBooks+getItem)
        * [.getJournalCode(Id)](#QuickBooks+getJournalCode)
        * [.getJournalEntry(Id)](#QuickBooks+getJournalEntry)
        * [.getPayment(Id)](#QuickBooks+getPayment)
        * [.getPaymentMethod(Id)](#QuickBooks+getPaymentMethod)
        * [.getPreferences()](#QuickBooks+getPreferences)
        * [.getPurchase(Id)](#QuickBooks+getPurchase)
        * [.getPurchaseOrder(Id)](#QuickBooks+getPurchaseOrder)
        * [.getRefundReceipt(Id)](#QuickBooks+getRefundReceipt)
        * [.getReports(Id)](#QuickBooks+getReports)
        * [.getSalesReceipt(Id)](#QuickBooks+getSalesReceipt)
        * [.getSalesReceiptPdf(Id)](#QuickBooks+getSalesReceiptPdf)
        * [.sendSalesReceiptPdf(Id, sendTo)](#QuickBooks+sendSalesReceiptPdf)
        * [.getTaxAgency(Id)](#QuickBooks+getTaxAgency)
        * [.getTaxCode(Id)](#QuickBooks+getTaxCode)
        * [.getTaxRate(Id)](#QuickBooks+getTaxRate)
        * [.getTerm(Id)](#QuickBooks+getTerm)
        * [.getTimeActivity(Id)](#QuickBooks+getTimeActivity)
        * [.getTransfer(Id)](#QuickBooks+getTransfer)
        * [.getVendor(Id)](#QuickBooks+getVendor)
        * [.getVendorCredit(Id)](#QuickBooks+getVendorCredit)
        * [.updateAccount(account)](#QuickBooks+updateAccount)
        * [.updateAttachable(attachable)](#QuickBooks+updateAttachable)
        * [.updateBill(bill)](#QuickBooks+updateBill)
        * [.updateBillPayment(billPayment)](#QuickBooks+updateBillPayment)
        * [.updateClass(class)](#QuickBooks+updateClass)
        * [.updateCompanyInfo(companyInfo)](#QuickBooks+updateCompanyInfo)
        * [.updateCreditMemo(creditMemo)](#QuickBooks+updateCreditMemo)
        * [.updateCustomer(customer)](#QuickBooks+updateCustomer)
        * [.updateDepartment(department)](#QuickBooks+updateDepartment)
        * [.updateDeposit(deposit)](#QuickBooks+updateDeposit)
        * [.updateEmployee(employee)](#QuickBooks+updateEmployee)
        * [.updateEstimate(estimate)](#QuickBooks+updateEstimate)
        * [.updateInvoice(invoice)](#QuickBooks+updateInvoice)
        * [.updateItem(item)](#QuickBooks+updateItem)
        * [.updateJournalCode(journalCode)](#QuickBooks+updateJournalCode)
        * [.updateJournalEntry(journalEntry)](#QuickBooks+updateJournalEntry)
        * [.updatePayment(payment)](#QuickBooks+updatePayment)
        * [.updatePaymentMethod(paymentMethod)](#QuickBooks+updatePaymentMethod)
        * [.updatePreferences(preferences)](#QuickBooks+updatePreferences)
        * [.updatePurchase(purchase)](#QuickBooks+updatePurchase)
        * [.updatePurchaseOrder(purchaseOrder)](#QuickBooks+updatePurchaseOrder)
        * [.updateRefundReceipt(refundReceipt)](#QuickBooks+updateRefundReceipt)
        * [.updateSalesReceipt(salesReceipt)](#QuickBooks+updateSalesReceipt)
        * [.updateTaxAgency(taxAgency)](#QuickBooks+updateTaxAgency)
        * [.updateTaxCode(taxCode)](#QuickBooks+updateTaxCode)
        * [.updateTaxRate(taxRate)](#QuickBooks+updateTaxRate)
        * [.updateTerm(term)](#QuickBooks+updateTerm)
        * [.updateTimeActivity(timeActivity)](#QuickBooks+updateTimeActivity)
        * [.updateTransfer(Transfer)](#QuickBooks+updateTransfer)
        * [.updateVendor(vendor)](#QuickBooks+updateVendor)
        * [.updateVendorCredit(vendorCredit)](#QuickBooks+updateVendorCredit)
        * [.updateExchangeRate(exchangeRate)](#QuickBooks+updateExchangeRate)
        * [.deleteAttachable(idOrEntity)](#QuickBooks+deleteAttachable)
        * [.deleteBill(idOrEntity)](#QuickBooks+deleteBill)
        * [.deleteBillPayment(idOrEntity)](#QuickBooks+deleteBillPayment)
        * [.deleteCreditMemo(idOrEntity)](#QuickBooks+deleteCreditMemo)
        * [.deleteDeposit(idOrEntity)](#QuickBooks+deleteDeposit)
        * [.deleteEstimate(idOrEntity)](#QuickBooks+deleteEstimate)
        * [.deleteInvoice(idOrEntity)](#QuickBooks+deleteInvoice)
        * [.deleteJournalCode(idOrEntity)](#QuickBooks+deleteJournalCode)
        * [.deleteJournalEntry(idOrEntity)](#QuickBooks+deleteJournalEntry)
        * [.deletePayment(idOrEntity)](#QuickBooks+deletePayment)
        * [.deletePurchase(idOrEntity)](#QuickBooks+deletePurchase)
        * [.deletePurchaseOrder(idOrEntity)](#QuickBooks+deletePurchaseOrder)
        * [.deleteRefundReceipt(idOrEntity)](#QuickBooks+deleteRefundReceipt)
        * [.deleteSalesReceipt(idOrEntity)](#QuickBooks+deleteSalesReceipt)
        * [.deleteTimeActivity(idOrEntity)](#QuickBooks+deleteTimeActivity)
        * [.deleteTransfer(idOrEntity)](#QuickBooks+deleteTransfer)
        * [.deleteVendorCredit(idOrEntity)](#QuickBooks+deleteVendorCredit)
        * [.voidInvoice(idOrEntity)](#QuickBooks+voidInvoice)
        * [.voidPayment(payment)](#QuickBooks+voidPayment)
        * [.findAccounts(criteria)](#QuickBooks+findAccounts)
        * [.findAttachables(criteria)](#QuickBooks+findAttachables)
        * [.findBills(criteria)](#QuickBooks+findBills)
        * [.findBillPayments(criteria)](#QuickBooks+findBillPayments)
        * [.findBudgets(criteria)](#QuickBooks+findBudgets)
        * [.findClasses(criteria)](#QuickBooks+findClasses)
        * [.findCompanyInfos(criteria)](#QuickBooks+findCompanyInfos)
        * [.findCreditMemos(criteria)](#QuickBooks+findCreditMemos)
        * [.findCustomers(criteria)](#QuickBooks+findCustomers)
        * [.findDepartments(criteria)](#QuickBooks+findDepartments)
        * [.findDeposits(criteria)](#QuickBooks+findDeposits)
        * [.findEmployees(criteria)](#QuickBooks+findEmployees)
        * [.findEstimates(criteria)](#QuickBooks+findEstimates)
        * [.findInvoices(criteria)](#QuickBooks+findInvoices)
        * [.findItems(criteria)](#QuickBooks+findItems)
        * [.findJournalCodes(criteria)](#QuickBooks+findJournalCodes)
        * [.findJournalEntries(criteria)](#QuickBooks+findJournalEntries)
        * [.findPayments(criteria)](#QuickBooks+findPayments)
        * [.findPaymentMethods(criteria)](#QuickBooks+findPaymentMethods)
        * [.findPreferenceses(criteria)](#QuickBooks+findPreferenceses)
        * [.findPurchases(criteria)](#QuickBooks+findPurchases)
        * [.findPurchaseOrders(criteria)](#QuickBooks+findPurchaseOrders)
        * [.findRefundReceipts(criteria)](#QuickBooks+findRefundReceipts)
        * [.findSalesReceipts(criteria)](#QuickBooks+findSalesReceipts)
        * [.findTaxAgencies(criteria)](#QuickBooks+findTaxAgencies)
        * [.findTaxCodes(criteria)](#QuickBooks+findTaxCodes)
        * [.findTaxRates(criteria)](#QuickBooks+findTaxRates)
        * [.findTerms(criteria)](#QuickBooks+findTerms)
        * [.findTimeActivities(criteria)](#QuickBooks+findTimeActivities)
        * [.findTransfers(criteria)](#QuickBooks+findTransfers)
        * [.findVendors(criteria)](#QuickBooks+findVendors)
        * [.findVendorCredits(criteria)](#QuickBooks+findVendorCredits)
        * [.findExchangeRates(criteria)](#QuickBooks+findExchangeRates)
        * [.reportBalanceSheet(options)](#QuickBooks+reportBalanceSheet)
        * [.reportProfitAndLoss(options)](#QuickBooks+reportProfitAndLoss)
        * [.reportProfitAndLossDetail(options)](#QuickBooks+reportProfitAndLossDetail)
        * [.reportTrialBalance(options)](#QuickBooks+reportTrialBalance)
        * [.reportCashFlow(options)](#QuickBooks+reportCashFlow)
        * [.reportInventoryValuationSummary(options)](#QuickBooks+reportInventoryValuationSummary)
        * [.reportCustomerSales(options)](#QuickBooks+reportCustomerSales)
        * [.reportItemSales(options)](#QuickBooks+reportItemSales)
        * [.reportCustomerIncome(options)](#QuickBooks+reportCustomerIncome)
        * [.reportCustomerBalance(options)](#QuickBooks+reportCustomerBalance)
        * [.reportCustomerBalanceDetail(options)](#QuickBooks+reportCustomerBalanceDetail)
        * [.reportAgedReceivables(options)](#QuickBooks+reportAgedReceivables)
        * [.reportAgedReceivableDetail(options)](#QuickBooks+reportAgedReceivableDetail)
        * [.reportVendorBalance(options)](#QuickBooks+reportVendorBalance)
        * [.reportVendorBalanceDetail(options)](#QuickBooks+reportVendorBalanceDetail)
        * [.reportAgedPayables(options)](#QuickBooks+reportAgedPayables)
        * [.reportAgedPayableDetail(options)](#QuickBooks+reportAgedPayableDetail)
        * [.reportVendorExpenses(options)](#QuickBooks+reportVendorExpenses)
        * [.reportTransactionList(options)](#QuickBooks+reportTransactionList)
        * [.reportGeneralLedgerDetail(options)](#QuickBooks+reportGeneralLedgerDetail)
        * [.reportTaxSummary(options)](#QuickBooks+reportTaxSummary)
        * [.reportDepartmentSales(options)](#QuickBooks+reportDepartmentSales)
        * [.reportClassSales(options)](#QuickBooks+reportClassSales)
        * [.reportAccountListDetail(options)](#QuickBooks+reportAccountListDetail)
    * _static_
        * [.authorizeUrl(appConfig)](#QuickBooks.authorizeUrl) ΓçÆ <code>string</code>
        * [.createToken(appConfig, authCode, realmID)](#QuickBooks.createToken) ΓçÆ <code>object</code>
        * [._dateNotExpired(expired_timestamp)](#QuickBooks._dateNotExpired) ΓçÆ <code>boolean</code>
        * [.isAccessTokenValid(token)](#QuickBooks.isAccessTokenValid) ΓçÆ <code>boolean</code>
        * [.isRefreshTokenValid(token)](#QuickBooks.isRefreshTokenValid) ΓçÆ <code>boolean</code>
        * [.saveToken(store, info)](#QuickBooks.saveToken)
        * [.getToken()](#QuickBooks.getToken)

<a name="new_QuickBooks_new"></a>

### new QuickBooks(appConfig, realmID)
Node.js client encapsulating access to the QuickBooks V3 Rest API. An instance
of this class should be instantiated on behalf of each user and company accessing the api.


| Param | Description |
| --- | --- |
| appConfig | application information |
| realmID | QuickBooks companyId, returned as a request parameter when the user is redirected to the provided callback URL following authentication |

<a name="QuickBooks+authorizeUrl"></a>

### quickBooks.authorizeUrl() ΓçÆ <code>string</code>
Redirect link to Authorization Page

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  
**Returns**: <code>string</code> - authorize Uri  
<a name="QuickBooks+createToken"></a>

### quickBooks.createToken(authCode, realmID) ΓçÆ <code>object</code>
Creates new token for the realmID from the returned authorization code received in the callback request

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  
**Returns**: <code>object</code> - new token with expiration dates from storeStrategy  

| Param | Type | Description |
| --- | --- | --- |
| authCode | <code>string</code> | The code returned in your callback as a param called "code" |
| realmID | <code>number</code> | The company identifier in your callback as a param called "realmId" |

<a name="QuickBooks+saveToken"></a>

### quickBooks.saveToken(token)
Save token

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>object</code> | the token to send to store area |

<a name="QuickBooks+getToken"></a>

### quickBooks.getToken()
Get token

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  
<a name="QuickBooks+refreshWithAccessToken"></a>

### quickBooks.refreshWithAccessToken(token) ΓçÆ <code>Token</code>
Use the refresh token to obtain a new access token.

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  
**Returns**: <code>Token</code> - returns fresh token with access_token and refresh_token  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>Token</code> | has the refresh_token |

<a name="QuickBooks+refreshAccessToken"></a>

### quickBooks.refreshAccessToken() ΓçÆ <code>Token</code>
Use the refresh token to obtain a new access token.

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  
**Returns**: <code>Token</code> - returns fresh token with access_token and refresh_token  
<a name="QuickBooks+revokeAccess"></a>

### quickBooks.revokeAccess(useRefresh)
Use either refresh token or access token to revoke access (OAuth2).

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Description |
| --- | --- |
| useRefresh | boolean - Indicates which token to use: true to use the refresh token, false to use the access token. |

<a name="QuickBooks+validateIdToken"></a>

### quickBooks.validateIdToken()
Validate id_token

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  
<a name="QuickBooks+getPublicKey"></a>

### quickBooks.getPublicKey(modulus, exponent)
get Public Key

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param |
| --- |
| modulus | 
| exponent | 

<a name="QuickBooks+getUserInfo"></a>

### quickBooks.getUserInfo()
Get user info (OAuth2).

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  
<a name="QuickBooks+batch"></a>

### quickBooks.batch(items)
Batch operation to enable an application to perform multiple operations in a single request.
The following batch items are supported:
     create
     update
     delete
     query
The maximum number of batch items in a single request is 25.

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| items | <code>object</code> | JavaScript array of batch items |

<a name="QuickBooks+changeDataCapture"></a>

### quickBooks.changeDataCapture(entities, since)
The change data capture (CDC) operation returns a list of entities that have changed since a specified time.

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| entities | <code>object</code> | Comma separated list or JavaScript array of entities to search for changes |
| since | <code>object</code> \| <code>number</code> \| <code>string</code> | JS Date object, JS Date milliseconds, or string in ISO 8601 - to look back for changes until |

<a name="QuickBooks+upload"></a>

### quickBooks.upload(filename, contentType, stream, entityType, entityId)
Uploads a file as an Attachable in QBO, optionally linking it to the specified
QBO Entity.

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | the name of the file |
| contentType | <code>string</code> | the mime type of the file |
| stream | <code>object</code> | ReadableStream of file contents |
| entityType | <code>object</code> | optional string name of the QBO entity the Attachable will be linked to (e.g. Invoice) |
| entityId | <code>object</code> | optional Id of the QBO entity the Attachable will be linked to |

<a name="QuickBooks+createAccount"></a>

### quickBooks.createAccount(account)
Creates the Account in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>object</code> | The unsaved account, to be persisted in QuickBooks |

<a name="QuickBooks+createAttachable"></a>

### quickBooks.createAttachable(attachable)
Creates the Attachable in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| attachable | <code>object</code> | The unsaved attachable, to be persisted in QuickBooks |

<a name="QuickBooks+createBill"></a>

### quickBooks.createBill(bill)
Creates the Bill in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| bill | <code>object</code> | The unsaved bill, to be persisted in QuickBooks |

<a name="QuickBooks+createBillPayment"></a>

### quickBooks.createBillPayment(billPayment)
Creates the BillPayment in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| billPayment | <code>object</code> | The unsaved billPayment, to be persisted in QuickBooks |

<a name="QuickBooks+createClass"></a>

### quickBooks.createClass(class)
Creates the Class in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| class | <code>object</code> | The unsaved class, to be persisted in QuickBooks |

<a name="QuickBooks+createCreditMemo"></a>

### quickBooks.createCreditMemo(creditMemo)
Creates the CreditMemo in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| creditMemo | <code>object</code> | The unsaved creditMemo, to be persisted in QuickBooks |

<a name="QuickBooks+createCustomer"></a>

### quickBooks.createCustomer(customer)
Creates the Customer in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| customer | <code>object</code> | The unsaved customer, to be persisted in QuickBooks |

<a name="QuickBooks+createDepartment"></a>

### quickBooks.createDepartment(department)
Creates the Department in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| department | <code>object</code> | The unsaved department, to be persisted in QuickBooks |

<a name="QuickBooks+createDeposit"></a>

### quickBooks.createDeposit(deposit)
Creates the Deposit in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| deposit | <code>object</code> | The unsaved Deposit, to be persisted in QuickBooks |

<a name="QuickBooks+createEmployee"></a>

### quickBooks.createEmployee(employee)
Creates the Employee in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| employee | <code>object</code> | The unsaved employee, to be persisted in QuickBooks |

<a name="QuickBooks+createEstimate"></a>

### quickBooks.createEstimate(estimate)
Creates the Estimate in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| estimate | <code>object</code> | The unsaved estimate, to be persisted in QuickBooks |

<a name="QuickBooks+createInvoice"></a>

### quickBooks.createInvoice(invoice)
Creates the Invoice in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| invoice | <code>object</code> | The unsaved invoice, to be persisted in QuickBooks |

<a name="QuickBooks+createItem"></a>

### quickBooks.createItem(item)
Creates the Item in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>object</code> | The unsaved item, to be persisted in QuickBooks |

<a name="QuickBooks+createJournalCode"></a>

### quickBooks.createJournalCode(journalCode)
Creates the JournalCode in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| journalCode | <code>object</code> | The unsaved journalCode, to be persisted in QuickBooks |

<a name="QuickBooks+createJournalEntry"></a>

### quickBooks.createJournalEntry(journalEntry)
Creates the JournalEntry in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| journalEntry | <code>object</code> | The unsaved journalEntry, to be persisted in QuickBooks |

<a name="QuickBooks+createPayment"></a>

### quickBooks.createPayment(payment)
Creates the Payment in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| payment | <code>object</code> | The unsaved payment, to be persisted in QuickBooks |

<a name="QuickBooks+createPaymentMethod"></a>

### quickBooks.createPaymentMethod(paymentMethod)
Creates the PaymentMethod in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| paymentMethod | <code>object</code> | The unsaved paymentMethod, to be persisted in QuickBooks |

<a name="QuickBooks+createPurchase"></a>

### quickBooks.createPurchase(purchase)
Creates the Purchase in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| purchase | <code>object</code> | The unsaved purchase, to be persisted in QuickBooks |

<a name="QuickBooks+createPurchaseOrder"></a>

### quickBooks.createPurchaseOrder(purchaseOrder)
Creates the PurchaseOrder in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| purchaseOrder | <code>object</code> | The unsaved purchaseOrder, to be persisted in QuickBooks |

<a name="QuickBooks+createRefundReceipt"></a>

### quickBooks.createRefundReceipt(refundReceipt)
Creates the RefundReceipt in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| refundReceipt | <code>object</code> | The unsaved refundReceipt, to be persisted in QuickBooks |

<a name="QuickBooks+createSalesReceipt"></a>

### quickBooks.createSalesReceipt(salesReceipt)
Creates the SalesReceipt in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| salesReceipt | <code>object</code> | The unsaved salesReceipt, to be persisted in QuickBooks |

<a name="QuickBooks+createTaxAgency"></a>

### quickBooks.createTaxAgency(taxAgency)
Creates the TaxAgency in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| taxAgency | <code>object</code> | The unsaved taxAgency, to be persisted in QuickBooks |

<a name="QuickBooks+createTaxService"></a>

### quickBooks.createTaxService(taxService)
Creates the TaxService in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| taxService | <code>object</code> | The unsaved taxService, to be persisted in QuickBooks |

<a name="QuickBooks+createTerm"></a>

### quickBooks.createTerm(term)
Creates the Term in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| term | <code>object</code> | The unsaved term, to be persisted in QuickBooks |

<a name="QuickBooks+createTimeActivity"></a>

### quickBooks.createTimeActivity(timeActivity)
Creates the TimeActivity in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| timeActivity | <code>object</code> | The unsaved timeActivity, to be persisted in QuickBooks |

<a name="QuickBooks+createTransfer"></a>

### quickBooks.createTransfer(transfer)
Creates the Transfer in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| transfer | <code>object</code> | The unsaved Transfer, to be persisted in QuickBooks |

<a name="QuickBooks+createVendor"></a>

### quickBooks.createVendor(vendor)
Creates the Vendor in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| vendor | <code>object</code> | The unsaved vendor, to be persisted in QuickBooks |

<a name="QuickBooks+createVendorCredit"></a>

### quickBooks.createVendorCredit(vendorCredit)
Creates the VendorCredit in QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| vendorCredit | <code>object</code> | The unsaved vendorCredit, to be persisted in QuickBooks |

<a name="QuickBooks+getAccount"></a>

### quickBooks.getAccount(Id)
Retrieves the Account from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent Account |

<a name="QuickBooks+getAttachable"></a>

### quickBooks.getAttachable(Id)
Retrieves the Attachable from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent Attachable |

<a name="QuickBooks+getBill"></a>

### quickBooks.getBill(Id)
Retrieves the Bill from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent Bill |

<a name="QuickBooks+getBillPayment"></a>

### quickBooks.getBillPayment(Id)
Retrieves the BillPayment from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent BillPayment |

<a name="QuickBooks+getClass"></a>

### quickBooks.getClass(Id)
Retrieves the Class from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent Class |

<a name="QuickBooks+getCompanyInfo"></a>

### quickBooks.getCompanyInfo(Id)
Retrieves the CompanyInfo from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent CompanyInfo |

<a name="QuickBooks+getCreditMemo"></a>

### quickBooks.getCreditMemo(Id)
Retrieves the CreditMemo from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent CreditMemo |

<a name="QuickBooks+getCustomer"></a>

### quickBooks.getCustomer(Id)
Retrieves the Customer from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent Customer |

<a name="QuickBooks+getDepartment"></a>

### quickBooks.getDepartment(Id)
Retrieves the Department from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent Department |

<a name="QuickBooks+getDeposit"></a>

### quickBooks.getDeposit(Id)
Retrieves the Deposit from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent Deposit |

<a name="QuickBooks+getEmployee"></a>

### quickBooks.getEmployee(Id)
Retrieves the Employee from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent Employee |

<a name="QuickBooks+getEstimate"></a>

### quickBooks.getEstimate(Id)
Retrieves the Estimate from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent Estimate |

<a name="QuickBooks+getExchangeRate"></a>

### quickBooks.getExchangeRate(options)
Retrieves an ExchangeRate from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | An object with options including the required `sourcecurrencycode` parameter and optional `asofdate` parameter. |

<a name="QuickBooks+getEstimatePdf"></a>

### quickBooks.getEstimatePdf(Id)
Retrieves the Estimate PDF from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent Estimate |

<a name="QuickBooks+sendEstimatePdf"></a>

### quickBooks.sendEstimatePdf(Id, sendTo)
Emails the Estimate PDF from QuickBooks to the address supplied in Estimate.BillEmail.EmailAddress
or the specified 'sendTo' address

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent Estimate |
| sendTo | <code>string</code> | optional email address to send the PDF to. If not provided, address supplied in Estimate.BillEmail.EmailAddress will be used |

<a name="QuickBooks+getInvoice"></a>

### quickBooks.getInvoice(Id)
Retrieves the Invoice from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent Invoice |

<a name="QuickBooks+getInvoicePdf"></a>

### quickBooks.getInvoicePdf(Id)
Retrieves the Invoice PDF from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent Invoice |

<a name="QuickBooks+sendInvoicePdf"></a>

### quickBooks.sendInvoicePdf(Id, sendTo)
Emails the Invoice PDF from QuickBooks to the address supplied in Invoice.BillEmail.EmailAddress
or the specified 'sendTo' address

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent Invoice |
| sendTo | <code>string</code> | optional email address to send the PDF to. If not provided, address supplied in Invoice.BillEmail.EmailAddress will be used |

<a name="QuickBooks+getItem"></a>

### quickBooks.getItem(Id)
Retrieves the Item from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent Item |

<a name="QuickBooks+getJournalCode"></a>

### quickBooks.getJournalCode(Id)
Retrieves the JournalCode from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent JournalCode |

<a name="QuickBooks+getJournalEntry"></a>

### quickBooks.getJournalEntry(Id)
Retrieves the JournalEntry from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent JournalEntry |

<a name="QuickBooks+getPayment"></a>

### quickBooks.getPayment(Id)
Retrieves the Payment from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent Payment |

<a name="QuickBooks+getPaymentMethod"></a>

### quickBooks.getPaymentMethod(Id)
Retrieves the PaymentMethod from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent PaymentMethod |

<a name="QuickBooks+getPreferences"></a>

### quickBooks.getPreferences()
Retrieves the Preferences from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  
<a name="QuickBooks+getPurchase"></a>

### quickBooks.getPurchase(Id)
Retrieves the Purchase from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent Purchase |

<a name="QuickBooks+getPurchaseOrder"></a>

### quickBooks.getPurchaseOrder(Id)
Retrieves the PurchaseOrder from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent PurchaseOrder |

<a name="QuickBooks+getRefundReceipt"></a>

### quickBooks.getRefundReceipt(Id)
Retrieves the RefundReceipt from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent RefundReceipt |

<a name="QuickBooks+getReports"></a>

### quickBooks.getReports(Id)
Retrieves the Reports from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent Reports |

<a name="QuickBooks+getSalesReceipt"></a>

### quickBooks.getSalesReceipt(Id)
Retrieves the SalesReceipt from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent SalesReceipt |

<a name="QuickBooks+getSalesReceiptPdf"></a>

### quickBooks.getSalesReceiptPdf(Id)
Retrieves the SalesReceipt PDF from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent SalesReceipt |

<a name="QuickBooks+sendSalesReceiptPdf"></a>

### quickBooks.sendSalesReceiptPdf(Id, sendTo)
Emails the SalesReceipt PDF from QuickBooks to the address supplied in SalesReceipt.BillEmail.EmailAddress
or the specified 'sendTo' address

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent SalesReceipt |
| sendTo | <code>string</code> | optional email address to send the PDF to. If not provided, address supplied in SalesReceipt.BillEmail.EmailAddress will be used |

<a name="QuickBooks+getTaxAgency"></a>

### quickBooks.getTaxAgency(Id)
Retrieves the TaxAgency from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent TaxAgency |

<a name="QuickBooks+getTaxCode"></a>

### quickBooks.getTaxCode(Id)
Retrieves the TaxCode from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent TaxCode |

<a name="QuickBooks+getTaxRate"></a>

### quickBooks.getTaxRate(Id)
Retrieves the TaxRate from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent TaxRate |

<a name="QuickBooks+getTerm"></a>

### quickBooks.getTerm(Id)
Retrieves the Term from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent Term |

<a name="QuickBooks+getTimeActivity"></a>

### quickBooks.getTimeActivity(Id)
Retrieves the TimeActivity from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent TimeActivity |

<a name="QuickBooks+getTransfer"></a>

### quickBooks.getTransfer(Id)
Retrieves the Transfer from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent Term |

<a name="QuickBooks+getVendor"></a>

### quickBooks.getVendor(Id)
Retrieves the Vendor from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent Vendor |

<a name="QuickBooks+getVendorCredit"></a>

### quickBooks.getVendorCredit(Id)
Retrieves the VendorCredit from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Id | <code>string</code> | The Id of persistent VendorCredit |

<a name="QuickBooks+updateAccount"></a>

### quickBooks.updateAccount(account)
Updates QuickBooks version of Account

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>object</code> | The persistent Account, including Id and SyncToken fields |

<a name="QuickBooks+updateAttachable"></a>

### quickBooks.updateAttachable(attachable)
Updates QuickBooks version of Attachable

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| attachable | <code>object</code> | The persistent Attachable, including Id and SyncToken fields |

<a name="QuickBooks+updateBill"></a>

### quickBooks.updateBill(bill)
Updates QuickBooks version of Bill

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| bill | <code>object</code> | The persistent Bill, including Id and SyncToken fields |

<a name="QuickBooks+updateBillPayment"></a>

### quickBooks.updateBillPayment(billPayment)
Updates QuickBooks version of BillPayment

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| billPayment | <code>object</code> | The persistent BillPayment, including Id and SyncToken fields |

<a name="QuickBooks+updateClass"></a>

### quickBooks.updateClass(class)
Updates QuickBooks version of Class

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| class | <code>object</code> | The persistent Class, including Id and SyncToken fields |

<a name="QuickBooks+updateCompanyInfo"></a>

### quickBooks.updateCompanyInfo(companyInfo)
Updates QuickBooks version of CompanyInfo

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| companyInfo | <code>object</code> | The persistent CompanyInfo, including Id and SyncToken fields |

<a name="QuickBooks+updateCreditMemo"></a>

### quickBooks.updateCreditMemo(creditMemo)
Updates QuickBooks version of CreditMemo

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| creditMemo | <code>object</code> | The persistent CreditMemo, including Id and SyncToken fields |

<a name="QuickBooks+updateCustomer"></a>

### quickBooks.updateCustomer(customer)
Updates QuickBooks version of Customer

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| customer | <code>object</code> | The persistent Customer, including Id and SyncToken fields |

<a name="QuickBooks+updateDepartment"></a>

### quickBooks.updateDepartment(department)
Updates QuickBooks version of Department

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| department | <code>object</code> | The persistent Department, including Id and SyncToken fields |

<a name="QuickBooks+updateDeposit"></a>

### quickBooks.updateDeposit(deposit)
Updates QuickBooks version of Deposit

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| deposit | <code>object</code> | The persistent Deposit, including Id and SyncToken fields |

<a name="QuickBooks+updateEmployee"></a>

### quickBooks.updateEmployee(employee)
Updates QuickBooks version of Employee

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| employee | <code>object</code> | The persistent Employee, including Id and SyncToken fields |

<a name="QuickBooks+updateEstimate"></a>

### quickBooks.updateEstimate(estimate)
Updates QuickBooks version of Estimate

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| estimate | <code>object</code> | The persistent Estimate, including Id and SyncToken fields |

<a name="QuickBooks+updateInvoice"></a>

### quickBooks.updateInvoice(invoice)
Updates QuickBooks version of Invoice

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| invoice | <code>object</code> | The persistent Invoice, including Id and SyncToken fields |

<a name="QuickBooks+updateItem"></a>

### quickBooks.updateItem(item)
Updates QuickBooks version of Item

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>object</code> | The persistent Item, including Id and SyncToken fields |

<a name="QuickBooks+updateJournalCode"></a>

### quickBooks.updateJournalCode(journalCode)
Updates QuickBooks version of JournalCode

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| journalCode | <code>object</code> | The persistent JournalCode, including Id and SyncToken fields |

<a name="QuickBooks+updateJournalEntry"></a>

### quickBooks.updateJournalEntry(journalEntry)
Updates QuickBooks version of JournalEntry

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| journalEntry | <code>object</code> | The persistent JournalEntry, including Id and SyncToken fields |

<a name="QuickBooks+updatePayment"></a>

### quickBooks.updatePayment(payment)
Updates QuickBooks version of Payment

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| payment | <code>object</code> | The persistent Payment, including Id and SyncToken fields |

<a name="QuickBooks+updatePaymentMethod"></a>

### quickBooks.updatePaymentMethod(paymentMethod)
Updates QuickBooks version of PaymentMethod

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| paymentMethod | <code>object</code> | The persistent PaymentMethod, including Id and SyncToken fields |

<a name="QuickBooks+updatePreferences"></a>

### quickBooks.updatePreferences(preferences)
Updates QuickBooks version of Preferences

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| preferences | <code>object</code> | The persistent Preferences, including Id and SyncToken fields |

<a name="QuickBooks+updatePurchase"></a>

### quickBooks.updatePurchase(purchase)
Updates QuickBooks version of Purchase

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| purchase | <code>object</code> | The persistent Purchase, including Id and SyncToken fields |

<a name="QuickBooks+updatePurchaseOrder"></a>

### quickBooks.updatePurchaseOrder(purchaseOrder)
Updates QuickBooks version of PurchaseOrder

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| purchaseOrder | <code>object</code> | The persistent PurchaseOrder, including Id and SyncToken fields |

<a name="QuickBooks+updateRefundReceipt"></a>

### quickBooks.updateRefundReceipt(refundReceipt)
Updates QuickBooks version of RefundReceipt

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| refundReceipt | <code>object</code> | The persistent RefundReceipt, including Id and SyncToken fields |

<a name="QuickBooks+updateSalesReceipt"></a>

### quickBooks.updateSalesReceipt(salesReceipt)
Updates QuickBooks version of SalesReceipt

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| salesReceipt | <code>object</code> | The persistent SalesReceipt, including Id and SyncToken fields |

<a name="QuickBooks+updateTaxAgency"></a>

### quickBooks.updateTaxAgency(taxAgency)
Updates QuickBooks version of TaxAgency

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| taxAgency | <code>object</code> | The persistent TaxAgency, including Id and SyncToken fields |

<a name="QuickBooks+updateTaxCode"></a>

### quickBooks.updateTaxCode(taxCode)
Updates QuickBooks version of TaxCode

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| taxCode | <code>object</code> | The persistent TaxCode, including Id and SyncToken fields |

<a name="QuickBooks+updateTaxRate"></a>

### quickBooks.updateTaxRate(taxRate)
Updates QuickBooks version of TaxRate

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| taxRate | <code>object</code> | The persistent TaxRate, including Id and SyncToken fields |

<a name="QuickBooks+updateTerm"></a>

### quickBooks.updateTerm(term)
Updates QuickBooks version of Term

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| term | <code>object</code> | The persistent Term, including Id and SyncToken fields |

<a name="QuickBooks+updateTimeActivity"></a>

### quickBooks.updateTimeActivity(timeActivity)
Updates QuickBooks version of TimeActivity

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| timeActivity | <code>object</code> | The persistent TimeActivity, including Id and SyncToken fields |

<a name="QuickBooks+updateTransfer"></a>

### quickBooks.updateTransfer(Transfer)
Updates QuickBooks version of Transfer

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| Transfer | <code>object</code> | The persistent Transfer, including Id and SyncToken fields |

<a name="QuickBooks+updateVendor"></a>

### quickBooks.updateVendor(vendor)
Updates QuickBooks version of Vendor

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| vendor | <code>object</code> | The persistent Vendor, including Id and SyncToken fields |

<a name="QuickBooks+updateVendorCredit"></a>

### quickBooks.updateVendorCredit(vendorCredit)
Updates QuickBooks version of VendorCredit

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| vendorCredit | <code>object</code> | The persistent VendorCredit, including Id and SyncToken fields |

<a name="QuickBooks+updateExchangeRate"></a>

### quickBooks.updateExchangeRate(exchangeRate)
Updates QuickBooks version of ExchangeRate

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| exchangeRate | <code>object</code> | The persistent ExchangeRate, including Id and SyncToken fields |

<a name="QuickBooks+deleteAttachable"></a>

### quickBooks.deleteAttachable(idOrEntity)
Deletes the Attachable from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| idOrEntity | <code>object</code> | The persistent Attachable to be deleted, or the Id of the Attachable, in which case an extra GET request will be issued to first retrieve the Attachable |

<a name="QuickBooks+deleteBill"></a>

### quickBooks.deleteBill(idOrEntity)
Deletes the Bill from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| idOrEntity | <code>object</code> | The persistent Bill to be deleted, or the Id of the Bill, in which case an extra GET request will be issued to first retrieve the Bill |

<a name="QuickBooks+deleteBillPayment"></a>

### quickBooks.deleteBillPayment(idOrEntity)
Deletes the BillPayment from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| idOrEntity | <code>object</code> | The persistent BillPayment to be deleted, or the Id of the BillPayment, in which case an extra GET request will be issued to first retrieve the BillPayment |

<a name="QuickBooks+deleteCreditMemo"></a>

### quickBooks.deleteCreditMemo(idOrEntity)
Deletes the CreditMemo from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| idOrEntity | <code>object</code> | The persistent CreditMemo to be deleted, or the Id of the CreditMemo, in which case an extra GET request will be issued to first retrieve the CreditMemo |

<a name="QuickBooks+deleteDeposit"></a>

### quickBooks.deleteDeposit(idOrEntity)
Deletes the Deposit from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| idOrEntity | <code>object</code> | The persistent Deposit to be deleted, or the Id of the Deposit, in which case an extra GET request will be issued to first retrieve the Deposit |

<a name="QuickBooks+deleteEstimate"></a>

### quickBooks.deleteEstimate(idOrEntity)
Deletes the Estimate from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| idOrEntity | <code>object</code> | The persistent Estimate to be deleted, or the Id of the Estimate, in which case an extra GET request will be issued to first retrieve the Estimate |

<a name="QuickBooks+deleteInvoice"></a>

### quickBooks.deleteInvoice(idOrEntity)
Deletes the Invoice from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| idOrEntity | <code>object</code> | The persistent Invoice to be deleted, or the Id of the Invoice, in which case an extra GET request will be issued to first retrieve the Invoice |

<a name="QuickBooks+deleteJournalCode"></a>

### quickBooks.deleteJournalCode(idOrEntity)
Deletes the JournalCode from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| idOrEntity | <code>object</code> | The persistent JournalCode to be deleted, or the Id of the JournalCode, in which case an extra GET request will be issued to first retrieve the JournalCode |

<a name="QuickBooks+deleteJournalEntry"></a>

### quickBooks.deleteJournalEntry(idOrEntity)
Deletes the JournalEntry from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| idOrEntity | <code>object</code> | The persistent JournalEntry to be deleted, or the Id of the JournalEntry, in which case an extra GET request will be issued to first retrieve the JournalEntry |

<a name="QuickBooks+deletePayment"></a>

### quickBooks.deletePayment(idOrEntity)
Deletes the Payment from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| idOrEntity | <code>object</code> | The persistent Payment to be deleted, or the Id of the Payment, in which case an extra GET request will be issued to first retrieve the Payment |

<a name="QuickBooks+deletePurchase"></a>

### quickBooks.deletePurchase(idOrEntity)
Deletes the Purchase from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| idOrEntity | <code>object</code> | The persistent Purchase to be deleted, or the Id of the Purchase, in which case an extra GET request will be issued to first retrieve the Purchase |

<a name="QuickBooks+deletePurchaseOrder"></a>

### quickBooks.deletePurchaseOrder(idOrEntity)
Deletes the PurchaseOrder from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| idOrEntity | <code>object</code> | The persistent PurchaseOrder to be deleted, or the Id of the PurchaseOrder, in which case an extra GET request will be issued to first retrieve the PurchaseOrder |

<a name="QuickBooks+deleteRefundReceipt"></a>

### quickBooks.deleteRefundReceipt(idOrEntity)
Deletes the RefundReceipt from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| idOrEntity | <code>object</code> | The persistent RefundReceipt to be deleted, or the Id of the RefundReceipt, in which case an extra GET request will be issued to first retrieve the RefundReceipt |

<a name="QuickBooks+deleteSalesReceipt"></a>

### quickBooks.deleteSalesReceipt(idOrEntity)
Deletes the SalesReceipt from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| idOrEntity | <code>object</code> | The persistent SalesReceipt to be deleted, or the Id of the SalesReceipt, in which case an extra GET request will be issued to first retrieve the SalesReceipt |

<a name="QuickBooks+deleteTimeActivity"></a>

### quickBooks.deleteTimeActivity(idOrEntity)
Deletes the TimeActivity from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| idOrEntity | <code>object</code> | The persistent TimeActivity to be deleted, or the Id of the TimeActivity, in which case an extra GET request will be issued to first retrieve the TimeActivity |

<a name="QuickBooks+deleteTransfer"></a>

### quickBooks.deleteTransfer(idOrEntity)
Deletes the Transfer from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| idOrEntity | <code>object</code> | The persistent Transfer to be deleted, or the Id of the Transfer, in which case an extra GET request will be issued to first retrieve the Transfer |

<a name="QuickBooks+deleteVendorCredit"></a>

### quickBooks.deleteVendorCredit(idOrEntity)
Deletes the VendorCredit from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| idOrEntity | <code>object</code> | The persistent VendorCredit to be deleted, or the Id of the VendorCredit, in which case an extra GET request will be issued to first retrieve the VendorCredit |

<a name="QuickBooks+voidInvoice"></a>

### quickBooks.voidInvoice(idOrEntity)
Voids the Invoice from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| idOrEntity | <code>object</code> | The persistent Invoice to be voided, or the Id of the Invoice, in which case an extra GET request will be issued to first retrieve the Invoice |

<a name="QuickBooks+voidPayment"></a>

### quickBooks.voidPayment(payment)
Voids QuickBooks version of Payment

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| payment | <code>object</code> | The persistent Payment, including Id and SyncToken fields |

<a name="QuickBooks+findAccounts"></a>

### quickBooks.findAccounts(criteria)
Finds all Accounts in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findAttachables"></a>

### quickBooks.findAttachables(criteria)
Finds all Attachables in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findBills"></a>

### quickBooks.findBills(criteria)
Finds all Bills in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findBillPayments"></a>

### quickBooks.findBillPayments(criteria)
Finds all BillPayments in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findBudgets"></a>

### quickBooks.findBudgets(criteria)
Finds all Budgets in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findClasses"></a>

### quickBooks.findClasses(criteria)
Finds all Classs in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findCompanyInfos"></a>

### quickBooks.findCompanyInfos(criteria)
Finds all CompanyInfos in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findCreditMemos"></a>

### quickBooks.findCreditMemos(criteria)
Finds all CreditMemos in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findCustomers"></a>

### quickBooks.findCustomers(criteria)
Finds all Customers in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findDepartments"></a>

### quickBooks.findDepartments(criteria)
Finds all Departments in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findDeposits"></a>

### quickBooks.findDeposits(criteria)
Finds all Deposits in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findEmployees"></a>

### quickBooks.findEmployees(criteria)
Finds all Employees in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findEstimates"></a>

### quickBooks.findEstimates(criteria)
Finds all Estimates in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findInvoices"></a>

### quickBooks.findInvoices(criteria)
Finds all Invoices in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findItems"></a>

### quickBooks.findItems(criteria)
Finds all Items in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findJournalCodes"></a>

### quickBooks.findJournalCodes(criteria)
Finds all JournalCodes in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findJournalEntries"></a>

### quickBooks.findJournalEntries(criteria)
Finds all JournalEntrys in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findPayments"></a>

### quickBooks.findPayments(criteria)
Finds all Payments in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findPaymentMethods"></a>

### quickBooks.findPaymentMethods(criteria)
Finds all PaymentMethods in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findPreferenceses"></a>

### quickBooks.findPreferenceses(criteria)
Finds all Preferencess in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findPurchases"></a>

### quickBooks.findPurchases(criteria)
Finds all Purchases in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findPurchaseOrders"></a>

### quickBooks.findPurchaseOrders(criteria)
Finds all PurchaseOrders in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findRefundReceipts"></a>

### quickBooks.findRefundReceipts(criteria)
Finds all RefundReceipts in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findSalesReceipts"></a>

### quickBooks.findSalesReceipts(criteria)
Finds all SalesReceipts in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findTaxAgencies"></a>

### quickBooks.findTaxAgencies(criteria)
Finds all TaxAgencys in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findTaxCodes"></a>

### quickBooks.findTaxCodes(criteria)
Finds all TaxCodes in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findTaxRates"></a>

### quickBooks.findTaxRates(criteria)
Finds all TaxRates in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findTerms"></a>

### quickBooks.findTerms(criteria)
Finds all Terms in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findTimeActivities"></a>

### quickBooks.findTimeActivities(criteria)
Finds all TimeActivitys in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findTransfers"></a>

### quickBooks.findTransfers(criteria)
Finds all Transfers in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findVendors"></a>

### quickBooks.findVendors(criteria)
Finds all Vendors in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findVendorCredits"></a>

### quickBooks.findVendorCredits(criteria)
Finds all VendorCredits in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+findExchangeRates"></a>

### quickBooks.findExchangeRates(criteria)
Finds all ExchangeRates in QuickBooks, optionally matching the specified criteria

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>object</code> | (Optional) String or single-valued map converted to a where clause of the form "where key = 'value'" |

<a name="QuickBooks+reportBalanceSheet"></a>

### quickBooks.reportBalanceSheet(options)
Retrieves the BalanceSheet Report from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | (Optional) Map of key-value pairs passed as options to the Report |

<a name="QuickBooks+reportProfitAndLoss"></a>

### quickBooks.reportProfitAndLoss(options)
Retrieves the ProfitAndLoss Report from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | (Optional) Map of key-value pairs passed as options to the Report |

<a name="QuickBooks+reportProfitAndLossDetail"></a>

### quickBooks.reportProfitAndLossDetail(options)
Retrieves the ProfitAndLossDetail Report from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | (Optional) Map of key-value pairs passed as options to the Report |

<a name="QuickBooks+reportTrialBalance"></a>

### quickBooks.reportTrialBalance(options)
Retrieves the TrialBalance Report from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | (Optional) Map of key-value pairs passed as options to the Report |

<a name="QuickBooks+reportCashFlow"></a>

### quickBooks.reportCashFlow(options)
Retrieves the CashFlow Report from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | (Optional) Map of key-value pairs passed as options to the Report |

<a name="QuickBooks+reportInventoryValuationSummary"></a>

### quickBooks.reportInventoryValuationSummary(options)
Retrieves the InventoryValuationSummary Report from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | (Optional) Map of key-value pairs passed as options to the Report |

<a name="QuickBooks+reportCustomerSales"></a>

### quickBooks.reportCustomerSales(options)
Retrieves the CustomerSales Report from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | (Optional) Map of key-value pairs passed as options to the Report |

<a name="QuickBooks+reportItemSales"></a>

### quickBooks.reportItemSales(options)
Retrieves the ItemSales Report from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | (Optional) Map of key-value pairs passed as options to the Report |

<a name="QuickBooks+reportCustomerIncome"></a>

### quickBooks.reportCustomerIncome(options)
Retrieves the CustomerIncome Report from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | (Optional) Map of key-value pairs passed as options to the Report |

<a name="QuickBooks+reportCustomerBalance"></a>

### quickBooks.reportCustomerBalance(options)
Retrieves the CustomerBalance Report from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | (Optional) Map of key-value pairs passed as options to the Report |

<a name="QuickBooks+reportCustomerBalanceDetail"></a>

### quickBooks.reportCustomerBalanceDetail(options)
Retrieves the CustomerBalanceDetail Report from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | (Optional) Map of key-value pairs passed as options to the Report |

<a name="QuickBooks+reportAgedReceivables"></a>

### quickBooks.reportAgedReceivables(options)
Retrieves the AgedReceivables Report from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | (Optional) Map of key-value pairs passed as options to the Report |

<a name="QuickBooks+reportAgedReceivableDetail"></a>

### quickBooks.reportAgedReceivableDetail(options)
Retrieves the AgedReceivableDetail Report from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | (Optional) Map of key-value pairs passed as options to the Report |

<a name="QuickBooks+reportVendorBalance"></a>

### quickBooks.reportVendorBalance(options)
Retrieves the VendorBalance Report from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | (Optional) Map of key-value pairs passed as options to the Report |

<a name="QuickBooks+reportVendorBalanceDetail"></a>

### quickBooks.reportVendorBalanceDetail(options)
Retrieves the VendorBalanceDetail Report from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | (Optional) Map of key-value pairs passed as options to the Report |

<a name="QuickBooks+reportAgedPayables"></a>

### quickBooks.reportAgedPayables(options)
Retrieves the AgedPayables Report from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | (Optional) Map of key-value pairs passed as options to the Report |

<a name="QuickBooks+reportAgedPayableDetail"></a>

### quickBooks.reportAgedPayableDetail(options)
Retrieves the AgedPayableDetail Report from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | (Optional) Map of key-value pairs passed as options to the Report |

<a name="QuickBooks+reportVendorExpenses"></a>

### quickBooks.reportVendorExpenses(options)
Retrieves the VendorExpenses Report from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | (Optional) Map of key-value pairs passed as options to the Report |

<a name="QuickBooks+reportTransactionList"></a>

### quickBooks.reportTransactionList(options)
Retrieves the TransactionList Report from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | (Optional) Map of key-value pairs passed as options to the Report |

<a name="QuickBooks+reportGeneralLedgerDetail"></a>

### quickBooks.reportGeneralLedgerDetail(options)
Retrieves the GeneralLedgerDetail Report from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | (Optional) Map of key-value pairs passed as options to the Report |

<a name="QuickBooks+reportTaxSummary"></a>

### quickBooks.reportTaxSummary(options)
Retrieves the TaxSummary Report from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | (Optional) Map of key-value pairs passed as options to the Report |

<a name="QuickBooks+reportDepartmentSales"></a>

### quickBooks.reportDepartmentSales(options)
Retrieves the DepartmentSales Report from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | (Optional) Map of key-value pairs passed as options to the Report |

<a name="QuickBooks+reportClassSales"></a>

### quickBooks.reportClassSales(options)
Retrieves the ClassSales Report from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | (Optional) Map of key-value pairs passed as options to the Report |

<a name="QuickBooks+reportAccountListDetail"></a>

### quickBooks.reportAccountListDetail(options)
Retrieves the AccountListDetail Report from QuickBooks

**Kind**: instance method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | (Optional) Map of key-value pairs passed as options to the Report |

<a name="QuickBooks.authorizeUrl"></a>

### QuickBooks.authorizeUrl(appConfig) ΓçÆ <code>string</code>
Redirect link to Authorization Page

**Kind**: static method of [<code>QuickBooks</code>](#QuickBooks)  
**Returns**: <code>string</code> - authorize Uri  

| Param | Type | Description |
| --- | --- | --- |
| appConfig | <code>object</code> | The config for your app |

<a name="QuickBooks.createToken"></a>

### QuickBooks.createToken(appConfig, authCode, realmID) ΓçÆ <code>object</code>
Creates new token for the realmID from the returned authorization code received in the callback request

**Kind**: static method of [<code>QuickBooks</code>](#QuickBooks)  
**Returns**: <code>object</code> - new token with expiration dates from storeStrategy  

| Param | Type | Description |
| --- | --- | --- |
| appConfig | <code>object</code> | The config for your app |
| authCode | <code>string</code> | The code returned in your callback as a param called "code" |
| realmID | <code>number</code> | The company identifier in your callback as a param called "realmId" |

<a name="QuickBooks._dateNotExpired"></a>

### QuickBooks.\_dateNotExpired(expired_timestamp) ΓçÆ <code>boolean</code>
Helper Method to check token expiry { set Token Object }

**Kind**: static method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| expired_timestamp | <code>object</code> \| <code>number</code> \| <code>string</code> | JS Date object, JS Date milliseconds, or string in ISO 8601 - when token expires |

<a name="QuickBooks.isAccessTokenValid"></a>

### QuickBooks.isAccessTokenValid(token) ΓçÆ <code>boolean</code>
Check if access_token is valid

**Kind**: static method of [<code>QuickBooks</code>](#QuickBooks)  
**Returns**: <code>boolean</code> - token has expired or not  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>object</code> | returned from storeStrategy |

<a name="QuickBooks.isRefreshTokenValid"></a>

### QuickBooks.isRefreshTokenValid(token) ΓçÆ <code>boolean</code>
Check if there is a valid (not expired) access token

**Kind**: static method of [<code>QuickBooks</code>](#QuickBooks)  
**Returns**: <code>boolean</code> - token has expired or not  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>object</code> | returned from storeStrategy |

<a name="QuickBooks.saveToken"></a>

### QuickBooks.saveToken(store, info)
Save token

**Kind**: static method of [<code>QuickBooks</code>](#QuickBooks)  

| Param | Type | Description |
| --- | --- | --- |
| store | <code>storeStrategy</code> | The store strategy class used for getting and setting the token |
| info | <code>object</code> | the realmID and token to send to store area |

<a name="QuickBooks.getToken"></a>

### QuickBooks.getToken()
Get token

**Kind**: static method of [<code>QuickBooks</code>](#QuickBooks)  



