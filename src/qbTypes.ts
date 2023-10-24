export interface Account_CurrencyRef {
  /**
   * META: * Required
   *
   * DESCRIPTION: A three letter string representing the ISO 4217 code for the currency. For example, <span class="literal">USD</span>, <span class="literal">AUD</span>, <span class="literal">EUR</span>, and so on.
   */
  value: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: The full name of the currency.
   */
  name?: string;
}

export interface ReferenceType {
  /**
   * META: * Required
   *
   * DESCRIPTION: The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.
   */
  value: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: An identifying name for the object being referenced by <span class="literal">value</span> and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use <span class="literal">Customer.DisplayName</span> to populate this field. Optionally returned in responses, implementation dependent.
   */
  name?: string;
}

export interface DateTime {
  /**
   * DESCRIPTION: Local time zone:
   * <em>
<span class="literal">YYYY-MM-DDTHH:MM:SS
</span>
</em>
UTC:
<em></em>
<em>YYYY-MM-DD</em>T
<em>HH</em>
<em>:MM:</em>
<em>SS</em>Z
Specific time zone:
<em></em>
<span class="literal">
<em>YYYY-MM-DD</em>T</span>
<em>
<span class="literal">HH</span>
</em>
<em>
<span class="literal">:MM:SS</span>
</em>
<span class="literal">+/-
<em>HH</em>
<em>:MM</em>
</span>
   */
  dateTime?: string;
}

export interface ModificationMetaData {
  /**
   * META: read only ,system defined
   *
   * ADDON: Local time zone: YYYY-MM-DDTHH:MM:SS UTC: YYYY-MM-DDT HH :MM: SSZ Specific time zone: YYYY-MM-DDT HH :MM:SS +/- HH :MM
   *
   * DESCRIPTION: Time the entity was created in the source domain.
   */
  readonly CreateTime?: string;
  /**
   * META: read only ,system defined
   *
   * ADDON: Local time zone: YYYY-MM-DDTHH:MM:SS UTC: YYYY-MM-DDT HH :MM: SSZ Specific time zone: YYYY-MM-DDT HH :MM:SS +/- HH :MM
   *
   * DESCRIPTION: Time the entity was last updated in the source domain.
   */
  readonly LastUpdatedTime?: string;
}

export interface Account {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object.
   * Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required ,max character: max 100 characters
   *
   * DESCRIPTION: User recognizable name for the Account.
   * <span class="literal">Account.Name</span> attribute must not contain double quotes (") or colon (:).
   */
  Name: string;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: User-defined account number to help the user in identifying the account within the chart-of-accounts and in deciding what should be posted to the account. The <span class="literal">Account.AcctNum</span> attribute must not contain colon (:).<ul><li>Name must be unique.</li></ul>For French Locales:<ul><this is="" a="" required="" field.<="" li=""><li>Length must be between 6 and 20 characters</li><li>Must start with the account number from the master category list.</li><li>Name limited to alpha-numeric characters.</li></this></ul>
   *  Max length for <span class="literal">Account.AcctNum</span>:<ul><li>AU &amp; CA: 20 characters.</li><li>US, UK &amp; IN: 7 characters</li></ul>
   */
  AcctNum?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: <br>Reference to the currency in which this account holds amounts.
   */
  CurrencyRef?: Account_CurrencyRef;
  /**
   * META: Optional
   *
   * DESCRIPTION: <br>Specifies the Parent AccountId if this represents a SubAccount.
   */
  ParentRef?: ReferenceType;
  /**
   * META: Optional ,max character: maximum of 100 chars
   *
   * DESCRIPTION: User entered description for the account, which may include user entered information to guide bookkeepers/accountants in deciding what journal entries to post to the account.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Whether or not active inactive accounts may be hidden from most display purposes and may not be posted to.
   */
  Active?: boolean;
  /**
   * META: Optional
   *
   * DESCRIPTION: <br>Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: read only ,system defined
   *
   * DESCRIPTION: Specifies whether this object represents a parent (false) or subaccount (true). Please note that accounts of these types - <span class="literal">OpeningBalanceEquity</span>, <span class="literal">UndepositedFunds</span>, <span class="literal">RetainedEarnings</span>, <span class="literal">CashReceiptIncome</span>, <span class="literal">CashExpenditureExpense</span>, <span class="literal">ExchangeGainOrLoss</span> cannot have a sub account and cannot be a sub account of another account.
   */
  readonly SubAccount?: boolean;
  /**
   * META: read only ,system defined
   *
   * DESCRIPTION: The classification of an account. Not supported for non-posting accounts.
   *  Valid values include: <span class="literal">Asset</span>, <span class="literal">Equity</span>, <span class="literal">Expense</span>, <span class="literal">Liability</span>, <span class="literal">Revenue</span>
   */
  readonly Classification?: string;
  /**
   * META: read only ,system defined
   *
   * DESCRIPTION: Fully qualified name of the object; derived from <span class="literal">Name</span> and <span class="literal">ParentRef</span>. The fully qualified name prepends the topmost parent, followed by each subaccount separated by colons and takes the form of
   * <span class="literal">Parent:Account1:SubAccount1:SubAccount2</span>. System generated. Limited to 5 levels.
   */
  readonly FullyQualifiedName?: string;
  /**
   * META: minorVersion: 5 ,
   *
   * DESCRIPTION: The account location. Valid values include:
   * <li><span class="literal">WithinFrance</span></li>
<li><span class="literal">FranceOverseas</span></li>
<li><span class="literal">OutsideFranceWithEU</span></li>
<li><span class="literal">OutsideEU</span></li>

For France locales, only.
   */
  TxnLocationType?: string;
  /**
   * ADDON: null
   *
   * No values given for enum
   *
   * DESCRIPTION: A detailed account classification that specifies the use of this account. The type is based on the Classification.
   * <br>
   */
  AccountType?: string;
  /**
   * META: read only
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the cumulative balance amount for the current Account and all its sub-accounts.
   */
  readonly CurrentBalanceWithSubAccounts?: number;
  /**
   * META: minorVersion: 5 ,
   *
   * DESCRIPTION: A user friendly name for the account. It must be unique across all account categories. For France locales, only.
   * For example, if an account is created under category 211 with <span class="literal">AccountAlias</span> of <span class="literal">Terrains</span>, then the system does not allow creation of an account with same <span class="literal">AccountAlias</span> of <span class="literal">Terrains</span> for any other category except 211. In other words, 211001 and 215001 accounts cannot have same AccountAlias because both belong to different account category.
For France locales, only.
   */
  AccountAlias?: string;
  /**
   * META: minorVersion: 3 ,
   *
   * DESCRIPTION: <br>Reference to the default tax code used by this account. Tax codes are referenced by the <span class="literal">TaxCode.Id</span> in the TaxCode object. Available when endpoint is invoked with the <span class="literal">minorversion=3</span> query parameter. For global locales, only.
   */
  TaxCodeRef?: ReferenceType;
  /**
   * DESCRIPTION: The account sub-type classification and is based on the AccountType value.
   * <br>
   */
  AccountSubType?: string;
  /**
   * META: read only
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the balance amount for the current Account. Valid for Balance Sheet accounts.
   */
  readonly CurrentBalance?: number;
}

export interface CustomField {
  /**
   * META: * Required ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier of the CustomFieldDefinition that corresponds to this CustomField.
   */
  readonly DefinitionId: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: The value for the
   * <span class="literal">StringType</span>custom field.
   */
  StringValue?: string;
  /**
   * META: Optional ,read only
   *
   * DESCRIPTION: Name of the custom field.
   */
  readonly Name?: string;
  /**
   * META: read only
   *
   * DESCRIPTION: Data type of custom field. Only one type is currently supported:
   * <span class="literal">StringType</span>.
   */
  readonly Type?: "StringType";
}

export interface Attachable_AttachableRef {
  /**
   * META: Optional
   *
   * DESCRIPTION: Used when <span class="literal">EntityRef.type</span> references a transaction object. This field indicates whether or not the attachment is sent with the transaction when <b>Save and Send</b> button is clicked in the QuickBooks UI or when the Send endpoint (send email) is invoked for the object.
   */
  IncludeOnSend?: boolean;
  /**
   * META: Optional
   *
   * DESCRIPTION: For transaction objects, used to reference a transaction detail line.
   */
  LineInfo?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Indicates whether or not to find attachable records that have no references to any entity. Combine with
   * <span class="literal">AttachableRef.Inactive</span>to return hidden references.
   */
  NoRefOnly?: boolean;
  /**
   * META: Optional
   *
   * DESCRIPTION: <br>If the user tries to fetch a record without permission, the permission denied message is conveyed through this field.
   */
  CustomField?: CustomField[];
  /**
   * META: Optional
   *
   * DESCRIPTION: Indicates whether or not to include references to hidden entities when filtering. When set to
   * <span class="literal">true</span> , hidden references are returned in the result set.
 For filtering results, it works with
<span class="literal">AttachableRef.EntityRef.Type</span> ,
<span class="literal">AttachableRef.EntityRef.Value</span> and
<span class="literal">AttachableRef.NoRefOnly</span> filters in combination.
   */
  Inactive?: boolean;
  /**
   * META: Optional
   *
   * DESCRIPTION: Object reference to which this attachment is linked.
   * <li>
Set <span class="literal">EntityRef.value</span> with the <span class="literal">Id</span> of the target object as returned in its response body when queried.
</li>
<li>Set <span class="literal">EntityRef.type</span> with the specific type of the target object. For example, <span class="literal">invoice</span>, <span class="literal">bill</span>, <span class="literal">item</span>, etc.
</li>
   */
  EntityRef?: ReferenceType;
}

export interface Attachable {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * ADDON: Id Type
   *
   * DESCRIPTION: Unique Identifier for an Intuit entity (object).
   * Required for the update operation.
   */
  readonly Id?: number;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: * Conditionally required ,  ,max character: maximum 1000 chars
   *
   * DESCRIPTION: FileName of the attachment. Required for file attachments.
   */
  FileName?: string;
  /**
   * META: * Conditionally required ,  ,max character: max 2000 chars
   *
   * DESCRIPTION: This note is either related to the attachment specified by <span class="literal">FileName</span> or is a standalone note. Required for standalone notes.
   */
  Note?: string;
  /**
   * META: Optional ,max character: max 100 chars
   *
   * DESCRIPTION: Category of the attachment. Valid values include (case sensitive): <span class="literal">Contact Photo</span>, <span class="literal">Document</span>, <span class="literal">Image</span>, <span class="literal">Receipt</span>, <span class="literal">Signature</span>, <span class="literal">Sound</span>, <span class="literal">Other</span>.
   */
  Category?: string;
  /**
   * META: Optional ,max character: max 100 chars
   *
   * DESCRIPTION: ContentType of the attachment. Returned for file attachments.
   */
  ContentType?: string;
  /**
   * META: Optional ,max character: max 2000 chars
   *
   * DESCRIPTION: PlaceName from where the attachment was requested.
   */
  PlaceName?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Specifies the transaction object to which this attachable file is to be linked.
   */
  AttachableRef?: Attachable_AttachableRef;
  /**
   * META: Optional ,max character: max 100 chars
   *
   * DESCRIPTION: Longitude from where the attachment was requested.
   */
  Long?: string;
  /**
   * META: Optional ,max character: max 2000 chars
   *
   * DESCRIPTION: Tag name for the requested attachment.
   */
  Tag?: string;
  /**
   * META: Optional ,max character: max 100 chars
   *
   * DESCRIPTION: Latitude from where the attachment was requested.
   */
  Lat?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: <br>Descriptive information about the entity. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: read only ,system defined
   *
   * DESCRIPTION: FullPath FileAccess URI of the attachment. Returned for file attachments.
   */
  readonly FileAccessUri?: string;
  /**
   * META: read only ,system defined
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Size of the attachment. Returned for file attachments.
   */
  readonly Size?: number;
  /**
   * META: read only ,system defined
   *
   * DESCRIPTION: FullPath FileAccess URI of the attachment thumbnail if the attachment file is of a content type with thumbnail support. Returned for file attachments.
   */
  readonly ThumbnailFileAccessUri?: string;
  /**
   * META: read only ,system defined
   *
   * DESCRIPTION: TempDownload URI which can be directly downloaded by clients. Returned for file attachments.
   */
  readonly TempDownloadUri?: string;
  /**
   * META: read only ,system defined
   *
   * DESCRIPTION: Thumbnail TempDownload URI which can be directly downloaded by clients. This is only available if the attachment file is of a content type with thumbnail support. Returned for file attachments.
   */
  readonly ThumbnailTempDownloadUri?: string;
}

export interface MarkupInfo {
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to a PriceLevel for the markup. Support for this element will be available in the coming months.
   */
  PriceLevelRef?: ReferenceType;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Markup amount expressed as a percent of charges already entered in the current transaction. To enter a rate of 10% use 10.0, not 0.01.
   */
  Percent?: number;
  /**
   * META: Optional ,read only ,system defined
   *
   * DESCRIPTION: The account associated with the markup. Available with invoice objects, only, and when linktxn specified a <span class="literal">ReimburseCharge</span>.
   */
  readonly MarkUpIncomeAccountRef?: ReferenceType;
}

export interface ItemBasedExpenseLineDetail {
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The total amount of the line item including tax.
   * Constraints: Available when endpoint is evoked with the
<span class="literal">minorversion=1</span>query parameter.
   */
  TaxInclusiveAmt?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the Item. Query the Item name list resource to determine the appropriate Item object for this reference. Use <span class="literal">Item.Id</span> and <span class="literal">Item.Name</span> from that object for <span class="literal">ItemRef.value</span> and <span class="literal">ItemRef.name</span>, respectively. When a line lacks an ItemRef it is treated as documentation and the
   * <span class="literal">Line.Amount</span> attribute is ignored.
For France locales: The account associated with the referenced Item object is looked up in the account category list.
<li>If this account has same location as specified in the transaction by the <span class="literal">TransactionLocationType</span> attribute and the same VAT as in the line item <span class="literal">TaxCodeRef</span> attribute, then the item account is used.</li>
<li>If there is a mismatch, then the account from the account category list that matches the transaction location and VAT is used.</li>
<li>If this account is not present in the account category list, then a new account is created with the new location, new VAT code, and all other attributes as in the default account.</li>
   */
  ItemRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use <span class="literal">Customer.Id</span> and <span class="literal">Customer.DisplayName</span> from that object for <span class="literal">CustomerRef.value</span> and <span class="literal">CustomerRef.name</span>, respectively.
   */
  CustomerRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the PriceLevel of the service or item for the line. Support for this element will be available in the coming months.
   */
  PriceLevelRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the Class associated with the expense. Available if <span class="literal">Preferences.AccountingInfoPrefs.ClassTrackingPerLine</span> is set to <span class="literal">true</span>. Query the Class name list resource to determine the appropriate Class object for this reference. Use <span class="literal">Class.Id</span> and <span class="literal">Class.Name</span> from that object for <span class="literal">ClassRef.value</span> and <span class="literal">ClassRef.name</span>, respectively.
   */
  ClassRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the <span class="literal">TaxCode</span>for this item. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use <span class="literal">TaxCode.Id</span> and <span class="literal">TaxCode.Name</span> from that object for <span class="literal">TaxCodeRef.value</span> and <span class="literal">TaxCodeRef.name</span>, respectively.
   */
  TaxCodeRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Markup information for the expense.
   */
  MarkupInfo?: MarkupInfo;
  /**
   * META: Optional
   *
   * DESCRIPTION: The billable status of the expense.
   * Valid values:
<span class="literal">Billable</span>,
<span class="literal">NotBillable</span>,
<span class="literal">HasBeenBilled</span>
   */
  BillableStatus?: "Billable" | "NotBillable" | "HasBeenBilled";
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Number of items for the line.
   */
  Qty?: number;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Unit price of the subject item as referenced by
   * <span class="literal">ItemRef</span>. Corresponds to the Rate column on the QuickBooks Online UI to specify either unit price, a discount, or a tax rate for item.
If used for unit price, the monetary value of the service or product, as expressed in the home currency.
If used for a discount or tax rate, express the percentage as a fraction. For example, specify <span class="literal">0.4</span> for 40% tax.
   */
  UnitPrice?: number;
}

export interface Bill_Line_ItemBasedExpenseLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   */
  ItemBasedExpenseLineDetail: ItemBasedExpenseLineDetail;
  /**
   * META: * Required ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   */
  Amount: number;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">ItemBasedExpenseLineDetail</span> for this type of line.
   */
  DetailType: "ItemBasedExpenseLineDetail";
  /**
   * META: Optional
   *
   * DESCRIPTION: Zero or more transactions linked to this object. The <span class="literal">LinkedTxn.TxnType</span> can be set to <span class="literal">PurchaseOrder</span> or if using Minor Version 55 and above it can also be set to <span class="literal">ReimburseCharge</span>. Use <span class="literal">LinkedTxn.TxnId</span> as the ID of the transaction.  When updating an existing Bill to link to a PurchaseOrder a new Line must be created. This behavior matches the QuickBooks UI as it does not allow the linking of an existing line, but rather a new line must be added to link the PurchaseOrder. Over the API this is achieved by simply updating the Bill <span class="literal">Line.Id</span> to something new. This will ensure old bill line is deleted and the new line is linked to the PurchaseOrder. Please be aware that for this PurchaseOrder-Bill linking to work all LinkedTxn child attributes are required.  See child attributes below.
   */
  LinkedTxn?: any[];
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer.
   */
  LineNum?: number;
}

export interface AccountBasedExpense {
  /**
   * META: * Required
   *
   * DESCRIPTION: Reference to the Expense account associated with this item. Query the Account name list resource to determine the appropriate Account object for this reference, where <span class="literal">Account.AccountType=Expense</span>. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">AccountRef.value</span> and <span class="literal">AccountRef.name</span>, respectively.
   * For France locales: The account associated with the referenced Account object is looked up in the account category list.
<li>If this account has same location as specified in the transaction by the <span class="literal">TransactionLocationType</span> attribute and the same VAT as in the line item <span class="literal">TaxCodeRef</span> attribute, then this account is used.</li>
<li>If there is a mismatch, then the account from the account category list that matches the transaction location and VAT is used.</li>
<li>If this account is not present in the account category list, then a new account is created with the new location, new VAT code, and all other attributes as in the default account.</li>
   */
  AccountRef: ReferenceType;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Sales tax paid as part of the expense.
   */
  TaxAmount?: number;
  /**
   * META: Optional ,minorVersion: 1
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The total amount of the line item including tax.
   * Constraints: Available when endpoint is evoked with the
<span class="literal">minorversion=1</span>query parameter.
   */
  TaxInclusiveAmt?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the Class associated with the expense. Available if <span class="literal">Preferences.AccountingInfoPrefs.ClassTrackingPerLine</span> is set to <span class="literal">true</span>. Query the Class name list resource to determine the appropriate Class object for this reference. Use <span class="literal">Class.Id</span> and <span class="literal">Class.Name</span> from that object for <span class="literal">ClassRef.value</span> and <span class="literal">ClassRef.name</span>, respectively.
   */
  ClassRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: The
   * <span class="literal">TaxCode</span>associated with the sales tax for the expense. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use <span class="literal">TaxCode.Id</span> and <span class="literal">TaxCode.Name</span> from that object for <span class="literal">TaxCodeRef.value</span> and <span class="literal">TaxCodeRef.name</span>, respectively.
   */
  TaxCodeRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Markup information for the expense.
   */
  MarkupInfo?: MarkupInfo;
  /**
   * META: Optional
   *
   * DESCRIPTION: The billable status of the expense.
   * Valid values:
<span class="literal">Billable</span>,
<span class="literal">NotBillable</span>,
<span class="literal">HasBeenBilled</span>
   */
  BillableStatus?: "Billable" | "NotBillable" | "HasBeenBilled";
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the Customer associated with the expense. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use <span class="literal">Customer.Id</span> and <span class="literal">Customer.DisplayName</span> from that object for <span class="literal">CustomerRef.value</span> and <span class="literal">CustomerRef.name</span>, respectively.
   */
  CustomerRef?: ReferenceType;
}

export interface Bill_Line_AccountBasedExpenseLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">AccountBasedExpenseLineDetail</span>for this type of line.
   */
  DetailType: "AccountBasedExpenseLineDetail";
  /**
   * META: * Required ,max character: max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   */
  Amount: number;
  /**
   * META: * Required
   *
   * DESCRIPTION: <strong>LineDetail</strong>
   */
  AccountBasedExpenseLineDetail: AccountBasedExpense;
  /**
   * META: Optional
   *
   * DESCRIPTION: Zero or more PurchaseOrder transactions linked to this Bill object. The <span class="literal">LinkedTxn.TxnType</span> should always be set to <span class="literal">PurchaseOrder</span>. Use <span class="literal">LinkedTxn.TxnId</span> as the ID of the PurchaseOrder.  When updating an existing Bill to link to a PurchaseOrder a new Line must be created. This behavior matches the QuickBooks UI as it does not allow the linking of an existing line, but rather a new line must be added to link the PurchaseOrder. Over the API this is achieved by simply updating the Bill <span class="literal">Line.Id</span> to something new. This will ensure old bill line is deleted and the new line is linked to the PurchaseOrder.
   */
  LinkedTxn?: any[];
  /**
   * META: Optional ,max character: max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive Integer.
   */
  LineNum?: number;
}

export interface CurrencyRefType {
  /**
   * META: * Required
   *
   * DESCRIPTION: A three letter string representing the ISO 4217 code for the currency. For example, <span class="literal">USD</span>, <span class="literal">AUD</span>, <span class="literal">EUR</span>, and so on.
   */
  value: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: The full name of the currency.
   */
  name?: string;
}

export interface Bill_LinkedTxn {
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction Id of the related transaction.
   */
  TxnId: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction type of the linked object.
   */
  TxnType: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Required for Deposit and Bill entities. The line number of a specific line of the linked transaction. If supplied, the
   * <span class="literal">TxnId</span> and
<span class="literal">TxnType</span> attributes of the linked transaction must also be populated.
   */
  TxnLineId?: string;
}

export interface Date {
  /**
   * DESCRIPTION: Local timezone: <em>
   * <span class="literal">YYYY-MM-DD 
<span style="display: none;"></span>
</span>
</em>UTC: <span class="literal">
<em>YYYY-MM-DD</em>Z <span style="display: none;"></span>
</span>
Specific time zone: <em>
<span class="literal">YYYY-MM-DD+/-HH:MM <span style="display: none;"></span>
</span>
</em><br> The date format follows the <a href="https://www.w3.org/TR/xmlschema-2/" target="_blank">XML Schema standard.</a>
   */
  date?: string;
}

export interface TaxLineDetail {
  /**
   * META: * Required
   *
   * DESCRIPTION: Reference to a TaxRate to apply to the entire transaction. Query the TaxRate name list resource to determine the appropriate TaxRage object for this reference. Use <span class="literal">TaxRate.Id</span> and <span class="literal">TaxRate.Name</span> from that object for <span class="literal">TaxRateRef.value</span> and <span class="literal">TaxRateRef.name</span>, respectively.
   * <br>For non-US versions of QuickBooks, the TaxRate referenced here must also be one of the rates in the referenced tax code's rate list—either the SalesTaxRateList or the PurchaseTaxRateList—as applies to the transaction type. Any given rate may only be listed once.
   */
  TaxRateRef: ReferenceType;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: This is the taxable amount on the total of the applicable tax rates. If TaxRate is applicable on two lines, this attribute represents the total of the two lines for which this rate is applied. This is different from the
   * <span class="literal">Line.Amount</span> , which represents the final tax amount after the tax has been applied.

<span style="color:#800080;">Default Value:</span>
<span class="literal">Null</span>
   */
  NetAmountTaxable?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: <li>
   * <span class="literal">True</span>—sales tax rate is expressed as a percentage.</li>
<li>
<span class="literal">False</span>—sales tax rate is expressed as a number amount.</li>
   */
  PercentBased?: boolean;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: This is the total amount, including tax.
   */
  TaxInclusiveAmount?: number;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The difference between the actual tax and the overridden amount supplied by the user.
   */
  OverrideDeltaAmount?: number;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Numerical expression of the sales tax percent. For example, use "8.5" not "0.085".
   */
  TaxPercent?: number;
}

export interface Bill_TxnTaxDetail_TaxLine_Line {
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">TaxLineDetail</span>for this type of line.
   */
  DetailType: "TaxLineDetail";
  /**
   * META: * Required
   *
   * DESCRIPTION: <strong>TaxLineDetail</strong>
   */
  TaxLineDetail: TaxLineDetail;
  /**
   * META: Optional ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of tax for this tax line.  This value is negative for JournalEntry objects with <span class="literal">PostingType</span> set to <span class="literal">Credit.</span>
   */
  Amount?: number;
}

export interface TxnTaxDetail {
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the transaction tax code. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use <span class="literal">TaxCode.Id</span> and <span class="literal">TaxCode.Name</span> from that object for <span class="literal">TaxCodeRef.value</span> and <span class="literal">TaxCodeRef.name</span>, respectively. If specified and sales tax is disabled (<span class="literal">Preferences.TaxPrefs.UsingSalesTax</span> is set to <span class="literal">false</span>), this element is ignored and not returned. For sales transactions, only: if automated sales tax is enabled (<span class="literal">Preferences.TaxPrefs.PartnerTaxEnabled</span> is set to <span class="literal">true</span>) the supplied transaction tax code is replaced by the automated sales tax engine recommendation.
   */
  TxnTaxCodeRef?: ReferenceType;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Total tax calculated for the transaction, excluding any tax lines manually inserted into the transaction line list.
   */
  TotalTax?: number;
  /**
   * META: Optional
   */
  TaxLine?: Bill_TxnTaxDetail_TaxLine_Line[];
}

export interface Bill {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object.
   * Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Reference to the vendor for this transaction. Query the Vendor name list resource to determine the appropriate Vendor object for this reference. Use <span class="literal">Vendor.Id</span> and <span class="literal">Vendor.Name</span> from that object for <span class="literal">VendorRef.value</span> and <span class="literal">VendorRef.name</span>, respectively.
   */
  VendorRef: ReferenceType;
  /**
   * META: * Required
   *
   * DESCRIPTION: Individual line items of a transaction. 
   * Valid <span class="literal">Line</span> types include:
<span class="literal">ItemBasedExpenseLine</span> and <span class="literal">AccountBasedExpenseLine</span>
   */
  Line: (Bill_Line_ItemBasedExpenseLine | Bill_Line_AccountBasedExpenseLine)[];
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Reference to the currency in which all amounts on the associated transaction are expressed. This must be defined if multicurrency is enabled for the company.
   * Multicurrency is enabled for the company if <span class="literal">Preferences.MultiCurrencyEnabled</span> is set to <span class="literal">true</span>. Read more about multicurrency support <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/manage-multiple-currencies" title="Currency">here</a>. Required if multicurrency is enabled for the company.
   */
  CurrencyRef?: CurrencyRefType;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: The date entered by the user when this transaction occurred.
   * For posting transactions, this is the posting date that affects the financial statements. If the date is not supplied, the current date on the server is used.
<br>Sort order is ASC by default.
   */
  TxnDate?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Specifies to which AP account the bill is credited. Query the Account name list resource to determine the appropriate Account object for this reference. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">APAccountRef.value</span> and <span class="literal">APAccountRef.name</span>, respectively. The specified account must have <span class="literal">Account.Classification</span> set to <span class="literal">Liability</span> and <span class="literal">Account.AccountSubType</span> set to <span class="literal">AccountsPayable</span>.
   * If the company has a single AP account, the account is implied. However, it is recommended that the AP Account be explicitly specified in all cases to prevent unexpected errors when relating transactions to each other.
   */
  APAccountRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the Term associated with the transaction. Query the Term name list resource to determine the appropriate Term object for this reference. Use <span class="literal">Term.Id</span> and <span class="literal">Term.Name</span> from that object for <span class="literal">SalesTermRef.value</span> and <span class="literal">SalesTermRef.name</span>, respectively.
   */
  SalesTermRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Zero or more transactions linked to this Bill object. The <span class="literal">LinkedTxn.TxnType</span> can be set to <span class="literal">PurchaseOrder</span>, <span class="literal">BillPaymentCheck</span> or if using Minor Version 55 and above <span class="literal">ReimburseCharge</span>. Use <span class="literal">LinkedTxn.TxnId</span> as the ID of the transaction.
   */
  LinkedTxn?: Bill_LinkedTxn[];
  /**
   * META: Optional ,
   *
   * DESCRIPTION: Method in which tax is applied. Allowed values are:
   * <span class="literal">TaxExcluded</span>,
<span class="literal">TaxInclusive</span>, and
<span class="literal">NotApplicable</span>.
   */
  GlobalTaxCalculation?: "TaxExcluded" | "TaxInclusive" | "NotApplicable";
  /**
   * META: Optional ,read only
   *
   * ADDON: Big Decimal
   *
   * DESCRIPTION: Indicates the total amount of the transaction. This includes the total of all the charges, allowances, and taxes. Calculated by QuickBooks business logic; any value you supply is over-written by QuickBooks.
   */
  readonly TotalAmt?: number;
  /**
   * META: Optional ,minorVersion: 4 ,
   *
   * DESCRIPTION: The account location. Valid values include:
   * <li><span class="literal">WithinFrance</span></li>
<li><span class="literal">FranceOverseas</span></li>
<li><span class="literal">OutsideFranceWithEU</span></li>
<li><span class="literal">OutsideEU</span></li>

For France locales, only.
   */
  TransactionLocationType?: string;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: Date when the payment of the transaction is due. If date is not provided, the number of days specified in
   * <span class="literal">SalesTermRef</span> added the transaction date will be used.
   */
  DueDate?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: Optional ,max character: maximum of 21 chars
   *
   * DESCRIPTION: Reference number for the transaction. If not explicitly provided at create time, a custom value can be provided. If no value is supplied, the resulting DocNumber is null.
   * Throws an error when duplicate DocNumber is sent in the request. 
Recommended best practice: check the setting of <span class="literal">Preferences:OtherPrefs </span> before setting DocNumber. If a duplicate DocNumber needs to be supplied, add the query parameter name/value pair, <span class="literal">include=allowduplicatedocnum</span> to the URI.
Sort order is ASC by default.
   */
  DocNumber?: string;
  /**
   * META: Optional ,max character: max of 4000 chars
   *
   * DESCRIPTION: User entered, organization-private note about the transaction. This note does not appear on the invoice to the customer. This field maps to the Memo field on the Invoice form.
   */
  PrivateNote?: string;
  /**
   * META: Optional ,
   *
   * DESCRIPTION: This data type provides information for taxes charged on the transaction as a whole. It captures the details of all taxes calculated for the transaction based on the tax codes referenced by the transaction. This can be calculated by QuickBooks business logic or you may supply it when adding a transaction.
   * If sales tax is disabled (<span class="literal">Preferences.TaxPrefs.UsingSalesTax</span> is set to <span class="literal">false</span>) then <span class="literal">TxnTaxDetail</span> is ignored and not stored.
   */
  TxnTaxDetail?: TxnTaxDetail;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The number of home currency units it takes to equal one unit of currency specified by <span class="literal">CurrencyRef</span>. Applicable if multicurrency is enabled for the company.
   */
  ExchangeRate?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: A reference to a Department object specifying the location of the transaction, as defined using location tracking in QuickBooks Online. Query the Department name list resource to determine the appropriate department object for this reference. Use <span class="literal">Department.Id</span> and <span class="literal">Department.Name</span> from that object for <span class="literal">DepartmentRef.value</span> and <span class="literal">DepartmentRef.name</span>, respectively.
   */
  DepartmentRef?: ReferenceType;
  /**
   * META: Optional ,minorVersion: 40 ,
   *
   * DESCRIPTION: Include the supplier in the annual TPAR. TPAR stands for Taxable Payments Annual Report. The TPAR is mandated by ATO to get the details payments that businesses make to contractors for providing services. Some government entities also need to report the grants they have paid in a TPAR.
   */
  IncludeInAnnualTPAR?: boolean;
  /**
   * META: read only ,minorVersion: 3
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Convenience field containing the amount in <span class="literal">Balance</span> expressed in terms of the home currency. Calculated by QuickBooks business logic. Value is valid only when <span class="literal">CurrencyRef</span> is specified and available when endpoint is evoked with the <span class="literal">minorversion=3</span> query parameter. Applicable if multicurrency is enabled for the company.
   */
  readonly HomeBalance?: number;
  /**
   * META: read only ,minorVersion: 52
   *
   * DESCRIPTION: A reference to the Recurring Transaction. It captures what recurring transaction template the <span class="literal">Bill</span> was created from.
   */
  readonly RecurDataRef?: ReferenceType;
  /**
   * META: read only
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The balance reflecting any payments made against the transaction. Initially set to the value of
   * <span class="literal">TotalAmt</span>. A Balance of 0 indicates the bill is fully paid. Calculated by QuickBooks business logic; any value you supply is over-written by QuickBooks.
   */
  readonly Balance?: number;
}

export interface BillPayment_Line_LinkedTxn {
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction Id of the related transaction.
   */
  TxnId: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction type of the linked object.
   */
  TxnType: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Required for Deposit and Bill entities. The line number of a specific line of the linked transaction. If supplied, the
   * <span class="literal">TxnId</span> and
<span class="literal">TxnType</span> attributes of the linked transaction must also be populated.
   */
  TxnLineId?: string;
}

export interface BillPayment_Line {
  /**
   * META: * Required ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   */
  Amount: number;
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction to which the current entity is related. For example, a billpayment line links to the originating bill object for which the billpayment is applied.
   */
  LinkedTxn: BillPayment_Line_LinkedTxn[];
}

export interface BillPayment_CheckPayment_BillPaymentCheck {
  /**
   * META: * Required
   *
   * DESCRIPTION: <br>Reference to the bank account. Query the Account name list resource to determine the appropriate Account object for this reference. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">APAccountRef.value</span> and <span class="literal">APAccountRef.name</span>, respectively. The specified account must have <span class="literal">Account.AccountType</span> set to <span class="literal">Bank</span> and <span class="literal">Account.AccountSubType</span> set to <span class="literal">Checking</span>.
   */
  BankAccountRef: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: <span class="literal">NeedToPrint</span>
   * Printing status of the invoice.
Valid values:
<span class="literal">NotSet</span>,
<span class="literal">NeedToPrint</span>,
<span class="literal">PrintComplete</span>.
   */
  PrintStatus?: "NeedToPrint" | "NotSet" | "PrintComplete";
}

export interface BillPayment_CreditCardPayment_BillPaymentCreditCard {
  /**
   * META: * Required
   *
   * DESCRIPTION: Reference to the credit card account. Query the Account name list resource to determine the appropriate Account object for this reference. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">CCAccountRef.value</span> and <span class="literal">CCAccountRef.name</span>, respectively. The specified account must have <span class="literal">Account.AccountType</span> set to <span class="literal">Credit Card</span> and <span class="literal">Account.AccountSubType</span> set to <span class="literal">CreditCard</span>.
   * Inject with data only if the payment was transacted through Intuit Payments API.
   */
  CCAccountRef: ReferenceType;
}

export interface BillPayment {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique Identifier for an Intuit entity (object).
   * Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: <br>Reference to the vendor for this transaction. Query the Vendor name list resource to determine the appropriate Vendor object for this reference. Use <span class="literal">Vendor.Id</span> and <span class="literal">Vendor.Name</span> from that object for <span class="literal">VendorRef.value</span> and <span class="literal">VendorRef.name</span>, respectively.
   */
  VendorRef: ReferenceType;
  /**
   * META: * Required
   *
   * DESCRIPTION: Individual line items representing zero or more <span class="literal">Bill</span>, <span class="literal">VendorCredit</span>, and <span class="literal">JournalEntry</span> objects linked to this BillPayment object.
   * Use <span class="literal">Line.LinkedTxn.TxnId</span> as the ID in a separate Bill, VendorCredit, or JournalEntry read request to retrieve details of the linked object.
<br> LinkedTxnLine:
   */
  Line: BillPayment_Line[];
  /**
   * META: * Required
   *
   * ADDON: Big Decimal
   *
   * DESCRIPTION: Indicates the total amount associated with this payment. This includes the total of all the payments from the payment line details. If <span class="literal">TotalAmt</span> is greater than the total on the lines being paid, the overpayment is treated as a credit and exposed as such on the QuickBooks UI. It cannot be negative.
   */
  TotalAmt: number;
  /**
   * META: * Required
   *
   * DESCRIPTION: The payment type. Valid values include: <span class="literal">Check</span>, <span class="literal">CreditCard</span>
   */
  PayType: "Check" | "CreditCard";
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Reference to the currency in which all amounts on the associated transaction are expressed. This must be defined if multicurrency is enabled for the company.
   * <br>Multicurrency is enabled for the company if <span class="literal">Preferences.MultiCurrencyEnabled</span> is set to <span class="literal">true</span>. Read more about multicurrency support <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/manage-multiple-currencies" title="Currency">here</a>.Required if multicurrency is enabled for the company
   */
  CurrencyRef?: CurrencyRefType;
  /**
   * META: Optional ,max character: maximum of 21 chars
   *
   * DESCRIPTION: Reference number for the transaction. If not explicitly provided at create time, a custom value can be provided. If no value is supplied, the resulting DocNumber is null.
   * Throws an error when duplicate DocNumber is sent in the request. 
Recommended best practice: check the setting of <span class="literal">Preferences:OtherPrefs </span> before setting DocNumber. If a duplicate DocNumber needs to be supplied, add the query parameter name/value pair, <span class="literal">include=allowduplicatedocnum</span> to the URI.
Sort order is ASC by default.
   */
  DocNumber?: string;
  /**
   * META: Optional ,max character: max of 4000 chars
   *
   * DESCRIPTION: User entered, organization-private note about the transaction. This note does not appear on the invoice to the customer. This field maps to the Memo field on the form.
   */
  PrivateNote?: string;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: The date entered by the user when this transaction occurred.
   * For posting transactions, this is the posting date that affects the financial statements. If the date is not supplied, the current date on the server is used.
<br>Sort order is ASC by default.
   */
  TxnDate?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The number of home currency units it takes to equal one unit of currency specified by <span class="literal">CurrencyRef</span>. Applicable if multicurrency is enabled for the company.
   */
  ExchangeRate?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: Specifies to which AP account the bill is credited. Query the Account name list resource to determine the appropriate Account object for this reference. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">APAccountRef.value</span> and <span class="literal">APAccountRef.name</span>, respectively. The specified account must have <span class="literal">Account.Classification</span> set to <span class="literal">Liability</span> and <span class="literal">Account.AccountSubType</span> set to <span class="literal">AccountsPayable</span>.
   * <br>If the company has a single AP account, the account is implied. However, it is recommended that the AP Account be explicitly specified in all cases to prevent unexpected errors when relating transactions to each other.
   */
  APAccountRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: <br>A reference to a Department object specifying the location of the transaction, as defined using location tracking in QuickBooks Online. Query the Department name list resource to determine the appropriate department object for this reference. Use <span class="literal">Department.Id</span> and <span class="literal">Department.Name</span> from that object for <span class="literal">DepartmentRef.value</span> and <span class="literal">DepartmentRef.name</span>, respectively.
   */
  DepartmentRef?: ReferenceType;
  /**
   * META: Optional ,minorVersion: 4 ,
   *
   * DESCRIPTION: The account location. Valid values include:
   * <li><span class="literal">WithinFrance</span></li>
<li><span class="literal">FranceOverseas</span></li>
<li><span class="literal">OutsideFranceWithEU</span></li>
<li><span class="literal">OutsideEU</span></li>

For France locales, only.
   */
  TransactionLocationType?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Indicates that the payment should be processed by merchant account service. Valid for QuickBooks companies with credit card processing.
   */
  ProcessBillPayment?: boolean;
  /**
   * META: Optional
   *
   * DESCRIPTION: <br>Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * DESCRIPTION: <br>Information about a check payment for the transaction. Not applicable to Estimate and SalesOrder. Used when PayType is <span class="literal">Check</span>.
   */
  CheckPayment?: BillPayment_CheckPayment_BillPaymentCheck;
  /**
   * DESCRIPTION: <br>Information about a credit card payment for the transaction. Not applicable to Estimate and SalesOrder. Used when PayType is <span class="literal">CreditCard</span>.
   */
  CreditCardPayment?: BillPayment_CreditCardPayment_BillPaymentCreditCard;
}

export interface Budget_BudgetDetail {
  /**
   * META: Optional ,read only
   *
   * DESCRIPTION: Reference to the Class associated with the transaction. Available if <span class="literal">Preferences.AccountingInfoPrefs.ClassTrackingPerLine</span> is set to <span class="literal">true</span>. Query the Class name list resource to determine the appropriate Class object for this reference. Use <span class="literal">Class.Id</span> and <span class="literal">Class.Name</span> from that object for <span class="literal">ClassRef.value</span> and <span class="literal">ClassRef.name</span>, respectively.
   */
  readonly ClassRef?: ReferenceType;
  /**
   * META: Optional ,read only
   *
   * DESCRIPTION: A reference to a Department object specifying the location of the transaction, as defined using location tracking in QuickBooks Online. Query the Department name list resource to determine the appropriate department object for this reference. Use <span class="literal">Department.Id</span> and <span class="literal">Department.Name</span> from that object for <span class="literal">DepartmentRef.value</span> and <span class="literal">DepartmentRef.name</span>, respectively.
   */
  readonly DepartmentRef?: ReferenceType;
  /**
   * META: Optional ,read only
   *
   * ADDON: Big Decimal
   *
   * DESCRIPTION: Amount assigned to a BudgetDetail.
   */
  readonly Amount?: number;
  /**
   * META: Optional ,read only
   *
   * ADDON: Local time zone: YYYY-MM-DDTHH:MM:SS UTC: YYYY-MM-DDT HH :MM: SSZ Specific time zone: YYYY-MM-DDT HH :MM:SS +/- HH :MM
   *
   * DESCRIPTION: Date of the individual BudgetDetail.
   */
  readonly BudgetDate?: string;
  /**
   * META: Optional ,read only
   *
   * DESCRIPTION: Reference to the Account associated with this BudgetDetail. Query the Account name list resource to determine the appropriate Account object for this reference, where <span class="literal">Account.AccountType=Expense</span>. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">AccountRef.value</span> and <span class="literal">AccountRef.name</span>, respectively.
   */
  readonly AccountRef?: ReferenceType;
  /**
   * META: Optional ,read only
   *
   * DESCRIPTION: Reference to the Customer associated with this BudgetDetail. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use <span class="literal">Customer.Id</span> and <span class="literal">Customer.DisplayName</span> from that object for <span class="literal">CustomerRef.value</span> and <span class="literal">CustomerRef.name</span>, respectively.
   */
  readonly CustomerRef?: ReferenceType;
}

export interface Budget {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object.
   * Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * ADDON: Local time zone: YYYY-MM-DDTHH:MM:SS UTC: YYYY-MM-DDT HH :MM: SSZ Specific time zone: YYYY-MM-DDT HH :MM:SS +/- HH :MM
   *
   * DESCRIPTION: Budget end date.
   */
  EndDate: string;
  /**
   * META: * Required
   *
   * ADDON: Local time zone: YYYY-MM-DDTHH:MM:SS UTC: YYYY-MM-DDT HH :MM: SSZ Specific time zone: YYYY-MM-DDT HH :MM:SS +/- HH :MM
   *
   * DESCRIPTION: Budget begin date.
   */
  StartDate: string;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: Optional ,read only
   *
   * DESCRIPTION: Period that this budget detail covers..
   *  Valid values include: <span class="literal">Monthly</span>, <span class="literal">Quarterly</span>, <span class="literal">Annually</span>.
   */
  readonly BudgetEntryType?: "Monthly" | "Quarterly" | "Annually";
  /**
   * META: Optional ,read only
   *
   * DESCRIPTION: User recognizable name for the Account.
   * <span class="literal">Account.Name</span> attribute must not contain double quotes (") or colon (:).
   */
  readonly Name?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Container for the budget items.
   */
  BudgetDetail?: Budget_BudgetDetail[];
  /**
   * META: Optional ,read only
   *
   * DESCRIPTION: Budget types.
   *  The only value currently supported is <span class="literal">ProfitAndLoss</span>.
   */
  readonly BudgetType?: "ProfitAndLoss";
  /**
   * META: Optional
   *
   * DESCRIPTION: Whether or not active inactive accounts may be hidden from most display purposes and may not be posted to.
   */
  Active?: boolean;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
}

export interface Class {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object.
   * Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required ,max character: maximum of 100 chars
   *
   * DESCRIPTION: User recognizable name for the Class.
   */
  Name: string;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: The immediate parent of the SubClass. Required if this object is a subclass.
   */
  ParentRef?: ReferenceType;
  /**
   * META: Optional ,system defined
   *
   * DESCRIPTION: Specifies whether this object is a subclass.
   * <span class="literal">true</span>--this object represents a subclass.
<span class="literal">false</span> or null--this object represents a top-level class.
   */
  SubClass?: boolean;
  /**
   * META: Optional
   *
   * DESCRIPTION: If true, this entity is currently enabled for use by QuickBooks.
   */
  Active?: boolean;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: read only ,system defined
   *
   * DESCRIPTION: Fully qualified name of the entity. The fully qualified name prepends the topmost parent, followed by each sub class separated by colons. Takes the form of
   * <span class="literal">Parent:Class1:SubClass1:SubClass2</span>. Limited to 5 levels.
   */
  readonly FullyQualifiedName?: string;
}

export interface SalesItemLineDetail {
  /**
   * META: Optional ,minorVersion: 1 ,
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The total amount of the line item including tax.
   * Constraints: Available when endpoint is evoked with the <span class="literal">minorversion=1</span>query parameter.
   */
  TaxInclusiveAmt?: number;
  /**
   * META: Optional ,minorVersion: 4 ,
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The discount amount applied to this line. If both <span class="literal">DiscountAmt </span> and <span class="literal">DiscountRate</span> are supplied, <span class="literal">DiscountRate</span> takes precedence and <span class="literal">DiscountAmt </span> is recalculated by QuickBooks services based on amount of <span class="literal">DiscountRate</span>.
   */
  DiscountAmt?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to an Item object.
   * <li>Query the Item name list resource to determine the appropriate Item object for this reference. Use <span class="literal">Item.Id</span> and <span class="literal">Item.Name</span> from that object for <span class="literal">ItemRef.value</span> and <span class="literal">ItemRef.name</span>, respectively.</li>
<li>Set ItemRef.value to <span class="literal">SHIPPING_ITEM_ID</span> when Line.amount represents transaction-wide shipping charges. Valid when <span class="literal">Preferences.SalesFormsPrefs.AllowShipping</span> is set to <span class="literal">true</span>. </li>
<li>Set ItemRef.value to <span class="literal">GRATUITY_ITEM_ID</span> when Line.amount represents transaction-wide gratuity amount. Valid when <span class="literal">Preferences.OtherPrefs.Name.SalesFormsPrefs.AllowGratuity</span> is set to <span class="literal">true</span>. </li>
<li>When a line lacks an ItemRef it is treated as documentation and the <span class="literal">Line.Amount</span>attribute is ignored.</li>
<li>Applicable to invoice objects, only, and when <span class="literal">linktxn</span> specifies a <span class="literal">ReimburseCharge</span>. When <span class="literal">Item.Id</span> is set to 1, <span class="literal">ItemAccountRef</span> refers to reimburse expense account Id.</li>

For France locales: The account associated with the referenced Item object is looked up in the account category list.
<li>If this account has same location as specified in the transaction by the <span class="literal">TransactionLocationType</span> attribute and the same VAT as in the line item <span class="literal">TaxCodeRef</span> attribute, then the item account is used.</li>
<li>If there is a mismatch, then the account from the account category list that matches the transaction location and VAT is used.</li>
<li>If this account is not present in the account category list, then a new account is created with the new location, new VAT code, and all other attributes as in the default account.</li>
   */
  ItemRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the Class for the line item. Available if <span class="literal">Preferences.AccountingInfoPrefs.ClassTrackingPerLine</span> is set to <span class="literal">true</span>. Query the Class name list resource to determine the appropriate Class object for this reference. Use <span class="literal">Class.Id</span> and <span class="literal">Class.Name</span> from that object for <span class="literal">ClassRef.value</span> and <span class="literal">ClassRef.name</span>, respectively.
   */
  ClassRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the <span class="literal">TaxCode</span>for this item. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use <span class="literal">TaxCode.Id</span> and <span class="literal">TaxCode.Name</span> from that object for <span class="literal">TaxCodeRef.value</span> and <span class="literal">TaxCodeRef.name</span>, respectively.
   */
  TaxCodeRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Used to define markup when this line represents a billable expense on the invoice. Markup information for the billable expense line.
   */
  MarkupInfo?: MarkupInfo;
  /**
   * META: Optional
   *
   * DESCRIPTION: Available with invoice objects, only, and when there is a <span class="literal">linkedtxn</span> of type <span class="literal">ReimburseCharge</span> for this object. When <span class="literal">ItemRef.Id</span> is set to 1, <span class="literal">ItemAccountRef</span> maps to the reimbursable charge account.
   */
  ItemAccountRef?: ReferenceType;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: Date when the service is performed.
   */
  ServiceDate?: string;
  /**
   * META: Optional ,minorVersion: 4 ,
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The discount rate applied to this line. If both <span class="literal">DiscountAmt </span> and <span class="literal">DiscountRate</span> are supplied, <span class="literal">DiscountRate</span> takes precedence and <span class="literal">DiscountAmt </span> is recalculated by QuickBooks services based on amount of <span class="literal">DiscountRate</span>.
   */
  DiscountRate?: number;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Number of items for the line.
   */
  Qty?: number;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Unit price of the subject item as referenced by
   * <span class="literal">ItemRef</span>. Corresponds to the Rate column on the QuickBooks Online UI to specify either unit price, a discount, or a tax rate for item.
If used for unit price, the monetary value of the service or product, as expressed in the home currency. You can override the unit price of the subject item by supplying a new value with create or update operations.
If used for a discount or tax rate, express the percentage as a fraction. For example, specify <span class="literal">0.4</span> for 40% tax.
   */
  UnitPrice?: number;
  /**
   * META: Optional ,read only ,minorVersion: 21 ,system defined
   *
   * DESCRIPTION: Reference to the <span class="literal">TaxClassification</span>for this item. Available for companies that have <a href="https://developer.intuit.com/hub/blog/2017/12/11/using-quickbooks-online-api-automated-sales-tax" title="Automatic Sales Tax">automated sales tax</a> enabled.
   * <li><span class="literal">TaxClassificationRef.Name</span>: Currently not populated.</li>
<li><span class="literal">TaxClassificationRef.value</span>: The system-defined Tax Classification code that is applied to this line item.</li>

 For internal use only.
   */
  readonly TaxClassificationRef?: ReferenceType;
}

export interface CreditMemo_Line_SalesItemLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to <span class="literal">SalesItemLineDetail</span>for this type of line.
   */
  DetailType: "SalesItemLineDetail";
  /**
   * META: * Required
   */
  SalesItemLineDetail: SalesItemLineDetail;
  /**
   * META: * Required ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   *  For Invoice objects in global locales: when updating <span class="literal">Amount</span>, remove the <span class="literal">TxnTaxDetail</span> element in the object before submitting it in the update request payload.
   */
  Amount: number;
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer
   */
  LineNum?: number;
}

export interface CreditMemo_Line_GroupLineDetail_Line {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to <span class="literal">SalesItemLineDetail</span>for this type of line.
   */
  DetailType: "SalesItemLineDetail";
  /**
   * META: * Required
   */
  SalesItemLineDetail: SalesItemLineDetail;
  /**
   * META: * Required ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   *  For Invoice objects in global locales: when updating <span class="literal">Amount</span>, remove the <span class="literal">TxnTaxDetail</span> element in the object before submitting it in the update request payload.
   */
  Amount: number;
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer
   */
  LineNum?: number;
}

export interface GroupLineDetail {
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Quantity of the group item.
   */
  Quantity?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: Individual ItemLine elements that comprise a bundle. Returned in responses.
   */
  Line?: CreditMemo_Line_GroupLineDetail_Line[];
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to a group item for all the lines that belong to the bundle. Query the Item name list resource to determine the appropriate Item group object (<span class="literal">Item.Type=Group</span>) for this reference. Use <span class="literal">Item.Id</span> and <span class="literal">Item.Name</span> from that object for <span class="literal">GroupItemRef.value</span> and <span class="literal">GroupItemRef.name</span>, respectively.
   */
  GroupItemRef?: ReferenceType;
}

export interface CreditMemo_Line_GroupLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   */
  GroupLineDetail: GroupLineDetail;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">GroupLineDetail</span>for this type of line.
   */
  DetailType: "GroupLineDetail";
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer
   */
  LineNum?: number;
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
}

export interface DescriptionLineDetail {
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the <span class="literal">TaxCode</span>for this item. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use <span class="literal">TaxCode.Id</span> and <span class="literal">TaxCode.Name</span> from that object for <span class="literal">TaxCodeRef.value</span> and <span class="literal">TaxCodeRef.name</span>, respectively.
   */
  TaxCodeRef?: ReferenceType;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: Date when the service is performed.
   */
  ServiceDate?: string;
}

export interface CreditMemo_Line_DescriptionOnlyLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the transaction, the request is considered an update operation for the description line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the transaction then the request is considered a create operation for the description line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">DescriptionOnly</span>for this type of line.
   */
  DetailType: "DescriptionOnly";
  /**
   * META: * Required
   */
  DescriptionLineDetail: DescriptionLineDetail;
  /**
   * META: Optional ,max character: max 4000 chars
   *
   * DESCRIPTION: A string representing one of the following:
   * <li>
Free form text description of the line item that appears in the printed record.
</li>
<li>
A subtotal line inline with other lines on the sales form and holds the sum of amounts on all lines above it. This is distinct from the overall transaction subtotal represented with a SubTotal detail line.
</li><li>
In create requests, set to <span class="literal">Subtotal:</span> (case sensitive) to create the subtotal line; the amount is generated by QuickBooks Online business logic.
</li>
<li>
In read requests, lines with <span class="literal">Subtotal: nn.nn</span> returned in this field denote subtotal lines in the object.
</li>
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer.
   */
  LineNum?: number;
  /**
   * META: read only ,minorVersion: 23
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item. Available when <span class="literal">Amount</span> is set via the QuickBooks UI. Returned only for Description Only line items that have a non-empty amount associated with them.
   */
  readonly Amount?: number;
}

export interface DiscountLineDetail {
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the Class associated with this discount. Query the Class name list resource to determine the appropriate Class object for this reference. Use <span class="literal">Class.Id</span> and <span class="literal">Class.Name</span> from that object for <span class="literal">ClassRef.value</span> and <span class="literal">ClassRef.name</span>, respectively.
   */
  ClassRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: The <span class="literal">TaxCode</span>associated with the sales tax for the expense. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use <span class="literal">TaxCode.Id</span> and <span class="literal">TaxCode.Name</span> from that object for <span class="literal">TaxCodeRef.value</span> and <span class="literal">TaxCodeRef.name</span>, respectively.
   */
  TaxCodeRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Income account used to track discounts. Query the Account name list resource to determine the appropriate Account object for this reference, where <span class="literal">Account.AccountType=Income</span> and <span class="literal">Account.AccountSubType=DiscountsRefundsGiven</span>. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">DiscountAccountRef.value</span> and <span class="literal">DiscountAccountRef.name</span>, respectively.
   */
  DiscountAccountRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: True if the discount is a percentage; null or false if discount based on amount.
   */
  PercentBased?: boolean;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Percentage by which the amount due is reduced, from 0% to 100%. To enter a discount of 8.5% use 8.5, not 0.085.
   */
  DiscountPercent?: number;
}

export interface CreditMemo_Line_DiscountLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>
If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.
</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation. Not supported for BillPayment, Estimate, Invoice, or Payment objects.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Discount detail type for the entire transaction. This is in contrast to a discount applied to a specific line. The company preference
   * <strong>Sales Form Entry | Discounts</strong> must be enabled for this type of line to be available. Must be enabled for this type of line to be available.
   */
  DiscountLineDetail: DiscountLineDetail;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">DiscountLineDetail</span>for this type of line.
   */
  DetailType: "DiscountLineDetail";
  /**
   * META: * Required ,max character: max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   */
  Amount: number;
  /**
   * META: Optional ,max character: max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer.
   */
  LineNum?: number;
}

export interface LineDetail {
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the Item. Query the Item name list resource to determine the appropriate Item object for this reference. Use <span class="literal">Item.Id</span> and <span class="literal">Item.Name</span> from that object for <span class="literal">ItemRef.value</span> and <span class="literal">ItemRef.name</span>, respectively. When a line lacks an ItemRef it is treated as documentation and the
   * <span class="literal">Line.Amount</span> attribute is ignored.
For France locales: The account associated with the referenced Item object is looked up in the account category list.
<li>If this account has same location as specified in the transaction by the <span class="literal">TransactionLocationType</span> attribute and the same VAT as in the line item <span class="literal">TaxCodeRef</span> attribute, then the item account is used.</li>
<li>If there is a mismatch, then the account from the account category list that matches the transaction location and VAT is used.</li>
<li>If this account is not present in the account category list, then a new account is created with the new location, new VAT code, and all other attributes as in the default account.</li>
   */
  ItemRef?: ReferenceType;
}

export interface CreditMemo_Line_SubTotalLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>
If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.
</li>
<li>
If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.
</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Subtotal <strong>LineDetail</strong>
   */
  SubtotalLineDetail: LineDetail;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to <span class="literal">SubtotalLineDetail</span>for this type of line.
   */
  DetailType: "SubTotalLineDetail";
  /**
   * META: * Required ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   */
  Amount: number;
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer
   */
  LineNum?: number;
}

export interface EmailAddress {
  /**
   * META: Optional ,max character: maximum of 100 chars
   *
   * DESCRIPTION: An email address. The address format must follow the RFC 822 standard.
   */
  Address?: string;
}

export interface MemoRef {
  /**
   * META: * Required ,max character: Maximum 1000 chars
   *
   * DESCRIPTION: User-entered message to the customer; this message is visible to the end user on their transactions.
   */
  value: string;
}

export interface CreditMemo_TxnTaxDetail_TaxLine_Line {
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">TaxLineDetail</span>for this type of line.
   */
  DetailType: "TaxLineDetail";
  /**
   * META: * Required
   *
   * DESCRIPTION: <strong>TaxLineDetail</strong>
   */
  TaxLineDetail: TaxLineDetail;
  /**
   * META: Optional ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of tax for this tax line.  This value is negative for JournalEntry objects with <span class="literal">PostingType</span> set to <span class="literal">Credit.</span>
   */
  Amount?: number;
}

export interface PhysicalAddress {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier of the QuickBooks object for the address, used for modifying the address.
   */
  readonly Id?: string;
  /**
   * META: Optional ,max character: Maximum of 30 chars
   *
   * DESCRIPTION: Postal code. For example, zip code for USA and Canada
   */
  PostalCode?: string;
  /**
   * META: Optional ,max character: Maximum of 255 chars
   *
   * DESCRIPTION: City name.
   */
  City?: string;
  /**
   * META: Optional ,max character: Maximum of 255 chars
   *
   * DESCRIPTION: Country name. For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country.
   */
  Country?: string;
  /**
   * META: Optional ,max character: Individual maximum of 500 chars, up to combined max of 2000 chars
   *
   * DESCRIPTION: Fifth line of the address.
   */
  Line5?: string;
  /**
   * META: Optional ,max character: Individual maximum of 500 chars, up to combined max of 2000 chars
   *
   * DESCRIPTION: Fourth line of the address.
   */
  Line4?: string;
  /**
   * META: Optional ,max character: Individual maximum of 500 chars, up to combined max of 2000 chars
   *
   * DESCRIPTION: Third line of the address.
   */
  Line3?: string;
  /**
   * META: Optional ,max character: Individual maximum of 500 chars, up to combined max of 2000 chars
   *
   * DESCRIPTION: Second line of the address.
   */
  Line2?: string;
  /**
   * META: Optional ,max character: Individual maximum of 500 chars, up to combined max of 2000 chars
   *
   * DESCRIPTION: First line of the address.
   */
  Line1?: string;
  /**
   * META: Optional ,read only ,system defined
   *
   * DESCRIPTION: Latitude coordinate of Geocode (Geospacial Entity Object Code).
   * <span class="literal">INVALID</span>is returned for invalid addresses.
   */
  readonly Lat?: string;
  /**
   * META: Optional ,read only ,system defined
   *
   * DESCRIPTION: Longitude coordinate of Geocode (Geospacial Entity Object Code).
   * <span class="literal">INVALID</span>is returned for invalid addresses.
   */
  readonly Long?: string;
  /**
   * META: Optional ,max character: Maximum of 255 chars
   *
   * DESCRIPTION: Region within a country. For example, state name for USA, province name for Canada.
   */
  CountrySubDivisionCode?: string;
}

export interface CreditMemo {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object.
   * Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Individual line items of a transaction. Valid <span class="literal">Line</span> types include:<span class="literal">SalesItemLine</span>, <span class="literal">GroupLine</span>, <span class="literal">DescriptionOnlyLine</span>, <span class="literal">DiscountLine</span> and <span class="literal">SubTotalLine</span>
   */
  Line: (CreditMemo_Line_SalesItemLine | CreditMemo_Line_GroupLine | CreditMemo_Line_DescriptionOnlyLine | CreditMemo_Line_DiscountLine | CreditMemo_Line_SubTotalLine)[];
  /**
   * META: * Required
   *
   * DESCRIPTION: Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use <span class="literal">Customer.Id</span> and <span class="literal">Customer.DisplayName</span> from that object for <span class="literal">CustomerRef.value</span> and <span class="literal">CustomerRef.name</span>, respectively.
   */
  CustomerRef: ReferenceType;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Reference to the currency in which all amounts on the associated transaction are expressed. This must be defined if multicurrency is enabled for the company.
   * Multicurrency is enabled for the company if <span class="literal">Preferences.MultiCurrencyEnabled</span> is set to <span class="literal">true</span>. Read more about multicurrency support <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/manage-multiple-currencies" title="Currency">here</a>. Required if multicurrency is enabled for the company.
   */
  CurrencyRef?: CurrencyRefType;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Identifies the e-mail address where the credit-memo is sent. If
   * <span class="literal">EmailStatus=NeedToSend</span>,
<span class="literal">BillEmail</span>is a required input.
   */
  BillEmail?: EmailAddress;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: The date entered by the user when this transaction occurred.
   * For posting transactions, this is the posting date that affects the financial statements. If the date is not supplied, the current date on the server is used.
<br>Sort order is ASC by default.
   */
  TxnDate?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: One of, up to three custom fields for the transaction. Available for custom fields so configured for the company. Check <span class="literal">Preferences.SalesFormsPrefs.CustomField</span> and <span class="literal">Preferences.VendorAndPurchasesPrefs.POCustomField</span> for custom fields currenly configured. <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/create-custom-fields" title="Custom Fields">Click here</a> to learn about managing custom fields.
   */
  CustomField?: CustomField[];
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the Class associated with the transaction. Available if <span class="literal">Preferences.AccountingInfoPrefs.ClassTrackingPerLine</span> is set to <span class="literal">true</span>. Query the Class name list resource to determine the appropriate Class object for this reference. Use <span class="literal">Class.Id</span> and <span class="literal">Class.Name</span> from that object for <span class="literal">ClassRef.value</span> and <span class="literal">ClassRef.name</span>, respectively.
   */
  ClassRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Printing status of the credit-memo.
   * Valid values:
<span class="literal">NotSet</span>,
<span class="literal">NeedToPrint</span>,
<span class="literal">PrintComplete
</span>.
   */
  PrintStatus?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the sales term associated with the transaction. Query the Term name list resource to determine the appropriate Term object for this reference. Use <span class="literal">Term.Id</span> and <span class="literal">Term.Name</span> from that object for <span class="literal">SalesTermRef.value</span> and <span class="literal">SalesTermRef.name</span>, respectively.
   */
  SalesTermRef?: ReferenceType;
  /**
   * META: Optional ,
   *
   * DESCRIPTION: Method in which tax is applied. Allowed values are:
   * <span class="literal">TaxExcluded</span>,
<span class="literal">TaxInclusive</span>, and
<span class="literal">NotApplicable</span>.
   */
  GlobalTaxCalculation?: "TaxExcluded" | "TaxInclusive" | "NotApplicable";
  /**
   * META: Optional
   *
   * ADDON: Big Decimal
   *
   * DESCRIPTION: Indicates the total amount of the transaction. This includes the total of all the charges, allowances, and taxes. Calculated by QuickBooks business logic; any value you supply is over-written by QuickBooks.
   */
  TotalAmt?: number;
  /**
   * META: Optional ,minorVersion: 37 ,
   *
   * DESCRIPTION: Reference to the Invoice for which Credit memo is issued. Needed for GST compliance. Use <span class="literal">Invoice.Id</span> and <span class="literal">Invoice.Name</span> from that object for <span class="literal">InvoiceRef.value</span> and <span class="literal">InvoiceRef.name</span>, respectively.
   */
  InvoiceRef?: ReferenceType;
  /**
   * META: Optional ,minorVersion: 4 ,
   *
   * DESCRIPTION: The account location. Valid values include:
   * <li><span class="literal">WithinFrance</span></li>
<li><span class="literal">FranceOverseas</span></li>
<li><span class="literal">OutsideFranceWithEU</span></li>
<li><span class="literal">OutsideEU</span></li>

For France locales, only.
   */
  TransactionLocationType?: string;
  /**
   * META: Optional ,
   *
   * DESCRIPTION: If false or null, calculate the sales tax first, and then apply the discount. If true, subtract the discount first and then calculate the sales tax. US versions of QuickBooks only.
   */
  ApplyTaxAfterDiscount?: boolean;
  /**
   * META: Optional ,max character: maximum of 21 chars
   *
   * DESCRIPTION: Reference number for the transaction. If not explicitly provided at create time, this field is populated based on the setting of <span class="literal">Preferences:CustomTxnNumber</span> as follows:
   * <li>If <span class="literal">Preferences:CustomTxnNumber</span> is true a custom value can be provided. If no value is supplied, the resulting DocNumber is null.</li>
<li>If <span class="literal">Preferences:CustomTxnNumber</span> is false, resulting DocNumber is system generated by incrementing the last number by 1.</li>

If <span class="literal">Preferences:CustomTxnNumber</span> is false then do not send a value as it can lead to unwanted duplicates. If a DocNumber value is sent for an Update operation, then it just updates that particular invoice and does not alter the internal system DocNumber. <br><em>Note:</em> DocNumber is an optional field for all locales except France. For France locale if <span class="literal">Preferences:CustomTxnNumber</span> is enabled it will <b>not</b> be automatically generated and is a required field.
   */
  DocNumber?: string;
  /**
   * META: Optional ,max character: max of 4000 chars
   *
   * DESCRIPTION: User entered, organization-private note about the transaction. This note does not appear on the deposit form.
   */
  PrivateNote?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: User-entered message to the customer; this message is visible to end user on their transactions.
   */
  CustomerMemo?: MemoRef;
  /**
   * META: Optional ,minorVersion: 69
   *
   * DESCRIPTION: Reference to the <span class="literal">Project</span> ID associated with this transaction. Available with Minor Version 69 and above
   */
  ProjectRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: This data type provides information for taxes charged on the transaction as a whole. It captures the details sales taxes calculated for the transaction based on the tax codes referenced by the transaction. This can be calculated by QuickBooks business logic or you may supply it when adding a transaction. See <a href="https://developer.intuit.com/app/developer/qbo/docs/workflows/manage-sales-tax-for-non-us-locales" title="Global Tax Model">Global tax model</a> for more information about this element.
   * If sales tax is disabled (<span class="literal">Preferences.TaxPrefs.UsingSalesTax</span> is set to <span class="literal">false</span>) then <span class="literal">TxnTaxDetail</span> is ignored and not stored.
   */
  TxnTaxDetail?: TxnTaxDetail;
  /**
   * META: Optional ,read only
   *
   * DESCRIPTION: Reference to a PaymentMethod associated with this transaction. Query the PaymentMethod name list resource to determine the appropriate PaymentMethod object for this reference. Use <span class="literal">PaymentMethod.Id</span> and <span class="literal">PaymentMethod.Name</span> from that object for <span class="literal">PaymentMethodRef.value</span> and <span class="literal">PaymentMethodRef.name</span>, respectively.
   */
  readonly PaymentMethodRef?: ReferenceType;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The number of home currency units it takes to equal one unit of currency specified by <span class="literal">CurrencyRef</span>. Applicable if multicurrency is enabled for the company.
   */
  ExchangeRate?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: Identifies the address where the goods must be shipped. If
   * <span class="literal">ShipAddr</span>is not specified, and a default
<span class="literal">Customer:ShippingAddr</span> is specified in QuickBooks for this customer, the default ship-to address will be used by QuickBooks. <br>For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country. <br>If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:<p></p><ul><li><span class="literal">Line1</span> and <span class="literal">Line2</span> elements are populated with the customer name and company name.</li><li>Original <span class="literal">Line1</span> through <span class="literal">Line 5</span> contents, <span class="literal">City</span>, <span class="literal">SubDivisionCode</span>, and <span class="literal">PostalCode</span> flow into <span class="literal">Line3</span> through <span class="literal">Line5</span>as a free format strings.</li></ul>
   */
  ShipAddr?: PhysicalAddress;
  /**
   * META: Optional
   *
   * DESCRIPTION: A reference to a Department object specifying the location of the transaction. Available if <span class="literal">Preferences.AccountingInfoPrefs.TrackDepartments</span> is set to <span class="literal">true</span>.
   * Query the Department name list resource to determine the appropriate department object for this reference. Use <span class="literal">Department.Id</span> and <span class="literal">Department.Name</span> from that object for <span class="literal">DepartmentRef.value</span> and <span class="literal">DepartmentRef.name</span>, respectively.
   */
  DepartmentRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Email status of the credit-memo.
   * Valid values:
<span class="literal">NotSet</span>,
<span class="literal">NeedToSend</span>,
<span class="literal">EmailSent
</span>
   */
  EmailStatus?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Bill-to address of the credit memo. If
   * <span class="literal">BillAddr</span>is not specified, and a default
<span class="literal">Customer:BillingAddr</span> is specified in QuickBooks for this customer, the default bill-to address is used by QuickBooks. <br>For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country. <br>If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:<p></p><ul><li><span class="literal">Line1</span> and <span class="literal">Line2</span> elements are populated with the customer name and company name.</li><li>Original <span class="literal">Line1</span> through <span class="literal">Line 5</span> contents, <span class="literal">City</span>, <span class="literal">SubDivisionCode</span>, and <span class="literal">PostalCode</span> flow into <span class="literal">Line3</span> through <span class="literal">Line5</span>as a free format strings.</li></ul>
   */
  BillAddr?: PhysicalAddress;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: read only ,minorVersion: 3
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Convenience field containing the amount in <span class="literal">Balance</span> expressed in terms of the home currency. Calculated by QuickBooks business logic. Value is valid only when <span class="literal">CurrencyRef</span> is specified and available when endpoint is evoked with the <span class="literal">minorversion=3</span> query parameter. Applicable if multicurrency is enabled for the company.
   */
  readonly HomeBalance?: number;
  /**
   * META: read only
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Indicates the total credit amount still available to apply towards the payment.
   */
  readonly RemainingCredit?: number;
  /**
   * META: read only ,minorVersion: 52
   *
   * DESCRIPTION: A reference to the Recurring Transaction. It captures what recurring transaction template the <span class="literal">CreditMemo</span> was created from.
   */
  readonly RecurDataRef?: ReferenceType;
  /**
   * META: read only ,minorVersion: 21 ,system defined
   *
   * DESCRIPTION: Reference to the <span class="literal">TaxExepmtion</span> ID associated with this object. Available for companies that have <a href="https://developer.intuit.com/hub/blog/2017/12/11/using-quickbooks-online-api-automated-sales-tax" title="Automatic Sales Tax">automated sales tax</a> enabled.
   * <li><span class="literal">TaxExemptionRef.Name</span>: The Tax Exemption Id for the customer to which this object is associated. This Id is typically issued by the state.</li>
<li><span class="literal">TaxExemptionRef.value</span>: The system-generated Id of the exemption type.</li>

 For internal use only.
   */
  readonly TaxExemptionRef?: ReferenceType;
  /**
   * META: read only
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The balance reflecting any payments made against the transaction. Initially set to the value of
   * <span class="literal">TotalAmt</span>. A Balance of 0 indicates the invoice is fully paid. Calculated by QuickBooks business logic; any value you supply is over-written by QuickBooks.
   */
  readonly Balance?: number;
  /**
   * META: read only ,system defined
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Total amount of the transaction in the home currency. Includes the total of all the charges, allowances and taxes. Calculated by QuickBooks business logic.
   * Value is valid only when <span class="literal">CurrencyRef</span> is specified. Applicable if multicurrency is enabled for the company.
   */
  readonly HomeTotalAmt?: number;
}

export interface WebSiteAddress {
  /**
   * META: Optional ,max character: Maximum of 1000 chars
   *
   * DESCRIPTION: Uniform Resource Identifier for the web site.
   */
  URI?: string;
}

export interface CompanyInfo_PrimaryPhone_TelephoneNumber {
  /**
   * META: Optional ,max character: Maximum of 20 chars
   *
   * DESCRIPTION: Specifies the telephone number in free form.
   */
  FreeFormNumber?: string;
}

export interface CompanyInfo {
  /**
   * META: read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object.
   * Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: * Required for update ,max character: Maximum of 1024 chars
   *
   * DESCRIPTION: The name of the company.
   */
  CompanyName?: string;
  /**
   * META: * Required for update
   *
   * DESCRIPTION: Company Address as described in preference. <br> If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:<p></p><ul><li><span class="literal">Line1</span> and <span class="literal">Line2</span> elements are populated with the customer name and company name.</li><li>Original <span class="literal">Line1</span> through <span class="literal">Line 5</span> contents, <span class="literal">City</span>, <span class="literal">SubDivisionCode</span>, and <span class="literal">PostalCode</span> flow into <span class="literal">Line3</span> through <span class="literal">Line5</span>as a free format strings.</li></ul>
   */
  CompanyAddr?: PhysicalAddress;
  /**
   * META: Optional
   *
   * DESCRIPTION: Legal Address given to the government for any government communication. <br> If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:<p></p><ul><li><span class="literal">Line1</span> and <span class="literal">Line2</span> elements are populated with the customer name and company name.</li><li>Original <span class="literal">Line1</span> through <span class="literal">Line 5</span> contents, <span class="literal">City</span>, <span class="literal">SubDivisionCode</span>, and <span class="literal">PostalCode</span> flow into <span class="literal">Line3</span> through <span class="literal">Line5</span>as a free format strings.</li></ul>
   */
  LegalAddr?: PhysicalAddress;
  /**
   * META: Optional
   *
   * DESCRIPTION: Comma separated list of languages.
   */
  SupportedLanguages?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Country name to which the company belongs for financial calculations.
   */
  Country?: string;
  /**
   * META: Optional ,max character: max 100 chars
   *
   * DESCRIPTION: Default email address.
   */
  Email?: EmailAddress;
  /**
   * META: Optional ,max character: max 1000 chars
   *
   * DESCRIPTION: Website address.
   */
  WebAddr?: WebSiteAddress;
  /**
     * META: Optional
     *
     * DESCRIPTION: Any other preference not covered with the standard set of attributes. See Data Services Extensions, below, for special reserved name/value pairs.
     * NameValue.Name--Name of the element.
     * NameValue.Value--Value of the element.
     */
    NameValue?: { Name: string, Value: string}[];
  /**
   * META: Optional
   *
   * ADDON: null
   *
   * No values given for enum
   *
   * DESCRIPTION: The start month of fiscal year.
   */
  FiscalYearStartMonth?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Address of the company as given to their customer, sometimes the address given to the customer mail address is different from Company address. If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:<p></p><ul><li><span class="literal">Line1</span> and <span class="literal">Line2</span> elements are populated with the customer name and company name.</li><li>Original <span class="literal">Line1</span> through <span class="literal">Line 5</span> contents, <span class="literal">City</span>, <span class="literal">SubDivisionCode</span>, and <span class="literal">PostalCode</span> flow into <span class="literal">Line3</span> through <span class="literal">Line5</span>as a free format strings.</li></ul>
   */
  CustomerCommunicationAddr?: PhysicalAddress;
  /**
   * META: Optional
   *
   * DESCRIPTION: Primary phone number.
   */
  PrimaryPhone?: CompanyInfo_PrimaryPhone_TelephoneNumber;
  /**
   * META: Optional ,max character: Maximum of 1024 chars
   *
   * DESCRIPTION: The legal name of the company.
   */
  LegalName?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: read only ,system defined
   *
   * ADDON: Local time zone: YYYY-MM-DDTHH:MM:SS UTC: YYYY-MM-DDT HH :MM: SSZ Specific time zone: YYYY-MM-DDT HH :MM:SS +/- HH :MM
   *
   * DESCRIPTION: DateTime when company file was created. This field and
   * <span class="literal">Metadata.CreateTime</span>contain the same value.
   */
  readonly CompanyStartDate?: string;
  /**
   * DESCRIPTION: If true, only fields specified will be updated
   */
  sparse?: boolean;
}

export interface Customer_CustomerTypeRef_String {
  /**
   * META: * Required
   *
   * DESCRIPTION: The unique numeric Id of the customer type.  This maps to the CustomerType entity: <span class="literal">CustomerType.Id</span>.
   */
  value: string;
}

export interface Customer_Fax_TelephoneNumber {
  /**
   * META: Optional ,max character: Maximum of 30 chars
   *
   * DESCRIPTION: Specifies the telephone number in free form.
   */
  FreeFormNumber?: string;
}

export interface Customer_CurrencyRef {
  /**
   * META: * Required
   *
   * DESCRIPTION: The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.
   */
  value: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: An identifying name for the object being referenced by <span class="literal">value</span> and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use <span class="literal">Customer.DisplayName</span> to populate this field. Optionally returned in responses, implementation dependent.
   */
  name?: string;
}

export interface Customer_Mobile_TelephoneNumber {
  /**
   * META: Optional ,max character: Maximum of 30 chars
   *
   * DESCRIPTION: Specifies the telephone number in free form.
   */
  FreeFormNumber?: string;
}

export interface Customer_PrimaryPhone_TelephoneNumber {
  /**
   * META: Optional ,max character: Maximum of 30 chars
   *
   * DESCRIPTION: Specifies the telephone number in free form.
   */
  FreeFormNumber?: string;
}

export interface Customer_AlternatePhone_TelephoneNumber {
  /**
   * META: Optional ,max character: Maximum of 30 chars
   *
   * DESCRIPTION: Specifies the telephone number in free form.
   */
  FreeFormNumber?: string;
}

export interface Customer {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object.
   * Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: * Conditionally required ,  ,max character: maximum of 500 chars
   *
   * DESCRIPTION: The name of the person or organization as displayed. Must be unique across all Customer, Vendor, and Employee objects. Cannot be removed with sparse update.
   * If not supplied, the system generates <span class="literal">DisplayName</span> by concatenating customer name components supplied in the request from the following list: <span class="literal">Title</span>, <span class="literal">GivenName</span>, <span class="literal">MiddleName</span>, <span class="literal">FamilyName</span>, and <span class="literal">Suffix</span>.
   */
  DisplayName?: string;
  /**
   * META: * Conditionally required ,  ,max character: maximum of 16 chars
   *
   * DESCRIPTION: Title of the person. This tag supports i18n, all locales. The <span class="literal">DisplayName</span> attribute or at least one of <span class="literal">Title</span>, <span class="literal">GivenName</span>, <span class="literal">MiddleName</span>, <span class="literal">FamilyName</span>, or <span class="literal">Suffix</span> attributes is required.
   */
  Title?: string;
  /**
   * META: * Conditionally required ,  ,max character: maximum of 100 chars
   *
   * DESCRIPTION: Given name or first name of a person. The <span class="literal">DisplayName</span> attribute or at least one of <span class="literal">Title</span>, <span class="literal">GivenName</span>, <span class="literal">MiddleName</span>, <span class="literal">FamilyName</span>, or <span class="literal">Suffix</span> attributes is required.
   */
  GivenName?: string;
  /**
   * META: * Conditionally required ,  ,max character: maximum of 100 chars
   *
   * DESCRIPTION: Middle name of the person. The person can have zero or more middle names. The <span class="literal">DisplayName</span> attribute or at least one of <span class="literal">Title</span>, <span class="literal">GivenName</span>, <span class="literal">MiddleName</span>, <span class="literal">FamilyName</span>, or <span class="literal">Suffix</span> attributes is required.
   */
  MiddleName?: string;
  /**
   * META: * Conditionally required ,  ,max character: maximum of 16 chars
   *
   * DESCRIPTION: Suffix of the name. For example, <span class="literal">Jr</span>. The <span class="literal">DisplayName</span> attribute or at least one of <span class="literal">Title</span>, <span class="literal">GivenName</span>, <span class="literal">MiddleName</span>, <span class="literal">FamilyName</span>, or <span class="literal">Suffix</span> attributes is required.
   */
  Suffix?: string;
  /**
   * META: * Conditionally required ,  ,max character: maximum of 100 chars
   *
   * DESCRIPTION: Family name or the last name of the person. The <span class="literal">DisplayName</span> attribute or at least one of <span class="literal">Title</span>, <span class="literal">GivenName</span>, <span class="literal">MiddleName</span>, <span class="literal">FamilyName</span>, or <span class="literal">Suffix</span> attributes is required.
   */
  FamilyName?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Primary email address.
   */
  PrimaryEmailAddr?: EmailAddress;
  /**
   * META: Optional ,max character: 16 chars
   *
   * DESCRIPTION: Resale number or some additional info about the customer.
   */
  ResaleNum?: string;
  /**
   * META: Optional ,minorVersion: 3 ,
   *
   * DESCRIPTION: Also called UTR No. in ( UK ) , CST Reg No. ( IN ) also represents the tax registration number of the Person or Organization. This value is masked in responses, exposing only last five characters. For example, the ID of <span class="literal">123-45-6789</span> is returned as <span class="literal">XXXXXX56789</span>.
   */
  SecondaryTaxIdentifier?: string;
  /**
   * META: Optional ,minorVersion: 3 ,
   *
   * DESCRIPTION: Identifies the accounts receivable account to be used for this customer. Each customer must have his own AR account. Applicable for France companies, only. Available when endpoint is evoked with the <span class="literal">minorversion=3</span> query parameter.
   * Query the Account name list resource to determine the appropriate Account object for this reference, where <span class="literal">Account.AccountType=Accounts Receivable</span>. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">ARAccountRef.value</span> and <span class="literal">ARAccountRef.name</span>, respectively.
   */
  ARAccountRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to a default tax code associated with this Customer object. Reference is valid if <span class="literal">Customer.Taxable</span> is set to true; otherwise, it is ignored.
   * If automated sales tax is enabled (<span class="literal">Preferences.TaxPrefs.PartnerTaxEnabled</span> is set to <span class="literal">true</span>) the default tax code is set by the system and can not be overridden.
Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use <span class="literal">TaxCode.Id</span> and <span class="literal">TaxCode.Name</span> from that object for <span class="literal">DefaultTaxCodeRef.value</span> and <span class="literal">DefaultTaxCodeRef.name</span>, respectively.
   */
  DefaultTaxCodeRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Preferred delivery method. Values are Print, Email, or None.
   */
  PreferredDeliveryMethod?: string;
  /**
   * META: Optional ,max character: maximum of 15 chars ,minorVersion: 33 ,
   *
   * DESCRIPTION: GSTIN is an identification number assigned to every GST registered business.
   */
  GSTIN?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to a SalesTerm associated with this Customer object. Query the Term name list resource to determine the appropriate Term object for this reference. Use <span class="literal">Term.Id</span> and <span class="literal">Term.Name</span> from that object for <span class="literal">SalesTermRef.value</span> and <span class="literal">SalesTermRef.name</span>, respectively.
   */
  SalesTermRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the customer type assigned to a customer. This field is only returned if the customer is assigned a customer type.
   */
  CustomerTypeRef?: Customer_CustomerTypeRef_String;
  /**
   * META: Optional ,max character: maximum of 30 chars
   *
   * DESCRIPTION: Fax number.
   */
  Fax?: Customer_Fax_TelephoneNumber;
  /**
   * META: Optional ,max character: maximum of 10 chars ,minorVersion: 33 ,
   *
   * DESCRIPTION: Also called, PAN (in India) is a code that acts as an identification for individuals, families and corporates, especially for those who pay taxes on their income.
   */
  BusinessNumber?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: If true, this Customer object is billed with its parent. If false, or null the customer is not to be billed with its parent. This attribute is valid only if this entity is a Job or sub Customer.
   */
  BillWithParent?: boolean;
  /**
   * META: Optional ,max character: 16 chars ,read only
   *
   * DESCRIPTION: Reference to the currency in which all amounts associated with this customer are expressed. Once set, it cannot be changed.
   * If specified currency is not currently in the company's currency list, it is added.
If not specified, currency for this customer is the home currency of the company, as defined by <span class="literal">Preferences.CurrencyPrefs.HomeCurrency</span>. [[
<strong>String</strong>
Preferred delivery method. Values are Print, Email, or None.
<strong>String</strong>, 16 chars
Resale number or some additional info about the customer.
<strong>ReferenceType</strong>
Identifies the accounts receivable account to be used for this customer. Each customer must have his own AR account. Applicable for France companies, only. Available when endpoint is evoked with the <span class="literal">minorversion=3</span> query parameter.
Query the Account name list resource to determine the appropriate Account object for this reference, where <span class="literal">Account.AccountType=Accounts Receivable</span>. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">ARAccountRef.value</span> and <span class="literal">ARAccountRef.name</span>, respectively. Read-only after object is created
   */
  readonly CurrencyRef?: Customer_CurrencyRef;
  /**
   * META: Optional ,max character: maximum of 30 chars
   *
   * DESCRIPTION: Mobile phone number.
   */
  Mobile?: Customer_Mobile_TelephoneNumber;
  /**
   * META: Optional
   *
   * DESCRIPTION: If true, this is a Job or sub-customer. If false or null, this is a top level customer, not a Job or sub-customer.
   */
  Job?: boolean;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Cumulative open balance amount for the Customer (or Job) and all its sub-jobs. Cannot be written to QuickBooks.
   */
  BalanceWithJobs?: number;
  /**
   * META: Optional ,max character: maximum of 30 chars
   *
   * DESCRIPTION: Primary phone number.
   */
  PrimaryPhone?: Customer_PrimaryPhone_TelephoneNumber;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: Date of the Open Balance for the create operation. Write-on-create.
   */
  OpenBalanceDate?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: If true, transactions for this customer are taxable.
   * Default behavior with minor version 10 and above: true, if <span class="literal">DefaultTaxCodeRef</span> is defined or false if <span class="literal">TaxExemptionReasonId</span> is set.
   */
  Taxable?: boolean;
  /**
   * META: Optional ,max character: maximum of 30 chars
   *
   * DESCRIPTION: Alternate phone number.
   */
  AlternatePhone?: Customer_AlternatePhone_TelephoneNumber;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the entity. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: Optional
   *
   * DESCRIPTION: A reference to a Customer object that is the immediate parent of the Sub-Customer/Job in the hierarchical Customer:Job list.
   * Required for the create operation if this object is a sub-customer or Job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use <span class="literal">Customer.Id</span> and <span class="literal">Customer.DisplayName</span> from that object for <span class="literal">ParentRef.value</span> and <span class="literal">ParentRef.name</span>, respectively.
   */
  ParentRef?: ReferenceType;
  /**
   * META: Optional ,max character: maximum of 2000 chars
   *
   * DESCRIPTION: Free form text describing the Customer.
   */
  Notes?: string;
  /**
   * META: Optional ,max character: maximum of 1000 chars
   *
   * DESCRIPTION: Website address.
   */
  WebAddr?: WebSiteAddress;
  /**
   * META: Optional
   *
   * DESCRIPTION: If true, this entity is currently enabled for use by QuickBooks. 
   * If there is an amount in <span class="literal">Customer.Balance</span> when setting this Customer object to inactive through the QuickBooks UI, a CreditMemo balancing transaction is created for the amount.
   */
  Active?: boolean;
  /**
   * META: Optional ,max character: maximum of 100 chars
   *
   * DESCRIPTION: The name of the company associated with the person or organization.
   */
  CompanyName?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the open balance amount or the amount unpaid by the customer. For the create operation, this represents the opening balance for the customer. When returned in response to the query request it represents the current open balance (unpaid amount) for that customer. Write-on-create.
   */
  Balance?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: Default shipping address. If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:<p></p><ul><li><span class="literal">Line1</span> and <span class="literal">Line2</span> elements are populated with the customer name and company name.</li><li>Original <span class="literal">Line1</span> through <span class="literal">Line 5</span> contents, <span class="literal">City</span>, <span class="literal">SubDivisionCode</span>, and <span class="literal">PostalCode</span> flow into <span class="literal">Line3</span> through <span class="literal">Line5</span>as a free format strings.</li></ul>
   */
  ShipAddr?: PhysicalAddress;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to a PaymentMethod associated with this Customer object. Query the PaymentMethod name list resource to determine the appropriate PaymentMethod object for this reference. Use <span class="literal">PaymentMethod.Id</span> and <span class="literal">PaymentMethod.Name</span> from that object for <span class="literal">PaymentMethodRef.value</span> and <span class="literal">PaymentMethodRef.name</span>, respectively.
   */
  PaymentMethodRef?: ReferenceType;
  /**
   * META: Optional ,read only ,minorVersion: 25
   *
   * DESCRIPTION: If true, indicates this is a Project.
   */
  readonly IsProject?: boolean;
  /**
   * META: Optional ,minorVersion: 59
   *
   * DESCRIPTION: The Source type of the transactions created by QuickBooks Commerce. Valid values include: <span class="literal">QBCommerce</span>
   */
  Source?: string;
  /**
   * META: Optional ,minorVersion: 4 ,
   *
   * DESCRIPTION: Also called Tax Reg. No in ( UK ) , ( CA ) , ( IN ) , ( AU ) represents the tax ID of the Person or Organization. This value is masked in responses, exposing only last five characters. For example, the ID of <span class="literal">123-45-6789</span> is returned as <span class="literal">XXXXXX56789</span>.
   */
  PrimaryTaxIdentifier?: string;
  /**
   * META: Optional ,max character: maximum of 15 chars ,minorVersion: 33 ,
   *
   * DESCRIPTION: For the filing of GSTR, transactions need to be classified depending on the type of customer to whom the sale is done. To facilitate this, we have introduced a new field as 'GST registration type'. Possible values are listed below:
   * <li><span class="literal">GST_REG_REG</span> GST registered- Regular. Customer who has a business which is registered under GST and has a GSTIN (doesn’t include customers registered under composition scheme, as an SEZ or as EOU's, STP's EHTP's etc.).</li>
<li><span class="literal">GST_REG_COMP</span> GST registered-Composition. Customer who has a business which is registered under the composition scheme of GST and has a GSTIN.</li>
<li><span class="literal">GST_UNREG</span> GST unregistered. Customer who has a business which is not registered under GST and does not have a GSTIN.</li>
<li><span class="literal">CONSUMER</span> Consumer. Customer who is not registered under GST and is the final consumer of the service or product sold.</li>
<li><span class="literal">OVERSEAS</span> Overseas. Customer who has a business which is located out of India.</li>
<li><span class="literal">SEZ</span> SEZ. Customer who has a business which is registered under GST, has a GSTIN and is located in a SEZ or is a SEZ Developer.</li>
<li><span class="literal">DEEMED</span> Deemed exports- EOU's, STP's EHTP's etc. Customer who has a business which is registered under GST and falls in the category of companies (EOU's, STP's EHTP's etc.), to which supplies are made they are termed as deemed exports.</li>
   */
  GSTRegistrationType?: string;
  /**
   * META: Optional ,max character: maximum of 110 chars
   *
   * DESCRIPTION: Name of the person or organization as printed on a check. If not provided, this is populated from DisplayName.
   * 
<span style="color:#800080;">Constraints:</span> Cannot be removed with sparse update.
   */
  PrintOnCheckName?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Default billing address. If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:<p></p><ul><li><span class="literal">Line1</span> and <span class="literal">Line2</span> elements are populated with the customer name and company name.</li><li>Original <span class="literal">Line1</span> through <span class="literal">Line 5</span> contents, <span class="literal">City</span>, <span class="literal">SubDivisionCode</span>, and <span class="literal">PostalCode</span> flow into <span class="literal">Line3</span> through <span class="literal">Line5</span>as a free format strings.</li></ul>
   */
  BillAddr?: PhysicalAddress;
  /**
   * META: read only ,system defined
   *
   * DESCRIPTION: Fully qualified name of the object. The fully qualified name prepends the topmost parent, followed by each sub element separated by colons. Takes the form of
   * <span class="literal">Customer:Job:Sub-job</span>. System generated. Limited to 5 levels.
   */
  readonly FullyQualifiedName?: string;
  /**
   * META: read only ,system defined
   *
   * ADDON: Integer
   *
   * DESCRIPTION: Specifies the level of the hierarchy in which the entity is located. Zero specifies the top level of the hierarchy; anything above will be level with respect to the parent.
   * 
<span style="color:#800080;">Constraints:</span>up to 5 levels
   */
  readonly Level?: number;
  /**
   * META: minorVersion: 10
   *
   * ADDON: Numeric Id
   *
   * DESCRIPTION: The tax exemption reason associated with this customer object. Applicable if automated sales tax is enabled (<span class="literal">Preferences.TaxPrefs.PartnerTaxEnabled</span> is set to <span class="literal">true</span>) for the company. Set  <span class="literal">TaxExemptionReasonId:</span> to one of the following:
   * <table>
<thead>
<tr>
<th>Id</th>
<th>Reason</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>Federal government</td>
</tr>
<tr>
<td>2</td>
<td>State government</td>
</tr>
<tr>
<td>3</td>
<td>Local government</td>
</tr>
<tr>
<td>4</td>
<td>Tribal government</td>
</tr>
<tr>
<td>5</td>
<td>Charitable organization</td>
</tr>
<tr>
<td>6</td>
<td>Religious organization</td>
</tr>
<tr>
<td>7</td>
<td>Educational organization</td>
</tr>
<tr>
<td>8</td>
<td>Hospital</td>
</tr>
<tr>
<td>9</td>
<td>Resale</td>
</tr>
<tr>
<td>10</td>
<td>Direct pay permit</td>
</tr>
<tr>
<td>11</td>
<td>Multiple points of use</td>
</tr>
<tr>
<td>12</td>
<td>Direct mail</td>
</tr>
<tr>
<td>13</td>
<td>Agricultural production</td>
</tr>
<tr>
<td>14</td>
<td>Industrial production / manufacturing</td>
</tr>
<tr>
<td>15</td>
<td>Foreign diplomat</td>
</tr>
</tbody>
</table>
   */
  TaxExemptionReasonId?: number;
  /**
   * DESCRIPTION: If true, only fields specified will be updated
   */
  sparse?: boolean;
}

export interface Department {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object.
   * Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required ,max character: maximum of 100 chars
   *
   * DESCRIPTION: User recognizable name for the Department.
   */
  Name: string;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: The immediate parent of the SubDepartment.
   * Required for the create operation if this object is a SubDepartment. Required if this object is a subdepartment.
   */
  ParentRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: If true, this entity is currently enabled for use by QuickBooks. If set to false, this entity is not available.
   */
  Active?: boolean;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: read only ,system defined
   *
   * DESCRIPTION: Fully qualified name of the entity. The fully qualified name prepends the topmost parent, followed by each sub element separated by colons. Takes the form of <span class="literal">Parent:Department1:SubDepartment1:SubDepartment2</span>. Limited to 5 levels.
   */
  readonly FullyQualifiedName?: string;
  /**
   * META: read only ,system defined
   *
   * DESCRIPTION: Specifies whether this Department object is a SubDepartment.
   * <span class="literal">true</span>--SubDepartment.
<span class="literal">false</span> or null--top-level Department.
   */
  readonly SubDepartment?: boolean;
}

export interface Deposit_Line_LinkedTxn {
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction Id of the related transaction.
   */
  TxnId: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction type of the linked object.
   */
  TxnType: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Required for Deposit and Bill entities. The line number of a specific line of the linked transaction. If supplied, the
   * <span class="literal">TxnId</span> and
<span class="literal">TxnType</span> attributes of the linked transaction must also be populated.
   */
  TxnLineId?: string;
}

export interface Deposit_Line_LineLinkedTxn {
  /**
   * META: * Required ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   */
  Amount: number;
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction to which the current entity is related. For example, a billpayment line links to the originating bill object for which the billpayment is applied.
   */
  LinkedTxn: Deposit_Line_LinkedTxn[];
}

export interface Deposit_Line_DepositLineDetail {
  /**
   * META: * Required
   *
   * DESCRIPTION: Account where the funds are deposited. Query the Account name list resource to determine the appropriate Account object for this reference, where <span class="literal">Account.AccountType</span> equals one of the following: <span class="literal">Income</span>, <span class="literal">Other Income</span>, <span class="literal">Expense</span>, <span class="literal">Other Expense</span>, <span class="literal">Other Current Assets</span>, <span class="literal">Equity</span> or <span class="literal">COGS</span>. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">AccountRef.value</span> and <span class="literal">AccountRef.name</span>, respectively.
   * For France locales: The account associated with the referenced Account object is looked up in the account category list.
<li>If this account has same location as specified in the transaction by the <span class="literal">TransactionLocationType</span> attribute and the same VAT as in the line item <span class="literal">TaxCodeRef</span> attribute, then this account is used.</li>
<li>If there is a mismatch, then the account from the account category list that matches the transaction location and VAT is used.</li>
<li>If this account is not present in the account category list, then a new account is created with the new location, new VAT code, and all other attributes as in the default account.</li>
   */
  AccountRef: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to a PaymentMethod associated with this transaction. Query the PaymentMethod name list resource to determine the appropriate PaymentMethod object for this reference. Use <span class="literal">PaymentMethod.Id</span> and <span class="literal">PaymentMethod.Name</span> from that object for <span class="literal">PaymentMethodRef.value</span> and <span class="literal">PaymentMethodRef.name</span>, respectively.
   */
  PaymentMethodRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the Class associated with the transaction. Available if <span class="literal">Preferences.AccountingInfoPrefs.ClassTrackingPerLine</span> is set to <span class="literal">true</span>. Query the Class name list resource to determine the appropriate Class object for this reference. Use <span class="literal">Class.Id</span> and <span class="literal">Class.Name</span> from that object for <span class="literal">ClassRef.value</span> and <span class="literal">ClassRef.name</span>, respectively.
   */
  ClassRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Check number for the desposit.
   */
  CheckNum?: string;
  /**
   * META: Optional ,minorVersion: 4 ,
   *
   * DESCRIPTION: Sales/Purchase tax code associated with the Line. For Non US Companies. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use <span class="literal">TaxCode.Id</span> and <span class="literal">TaxCode.Name</span> from that object for <span class="literal">TaxCodeRef.value</span> and <span class="literal">TaxCodeRef.name</span>, respectively.
   */
  TaxCodeRef?: ReferenceType;
  /**
   * META: Optional ,minorVersion: 4 ,
   *
   * DESCRIPTION: Indicates whether the tax applicable on the line is sales or purchase. For Non US Companies.
   * Valid value:
<span class="literal">Sales</span>,
<span class="literal">Purchase</span> Required if TaxCodeRef is specified.
   */
  TaxApplicableOn?: "Sales" | "Purchase";
  /**
   * META: Optional
   *
   * ADDON: null
   *
   * No values given for enum
   *
   * DESCRIPTION: Type of the payment transaction. For information purposes only.
   */
  TxnType?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to a customer from which deposit was received. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use <span class="literal">Customer.Id</span> and <span class="literal">Customer.DisplayName</span> from that object for <span class="literal">Entity.value</span> and <span class="literal">Entity.name</span>, respectively.
   */
  Entity?: ReferenceType;
}

export interface Deposit_Line_DepositLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If <span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.</li>
<li>If no <span class="literal">Id</span>is provided, the <span class="literal">Id</span>provided is less than or equal to zero, or the <span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.
</li>
 Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to <span class="literal">DepositLineDetail</span>for this type of line.
   */
  DetailType: "DepositLineDetail";
  /**
   * META: * Required ,max character: max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   */
  Amount: number;
  /**
   * META: * Required
   */
  DepositLineDetail: Deposit_Line_DepositLineDetail;
  /**
   * META: Optional ,max character: max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional ,minorVersion: 69
   *
   * DESCRIPTION: Reference to the <span class="literal">Project</span> ID associated with this transaction. Available with Minor Version 69 and above
   */
  ProjectRef?: ReferenceType;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer
   */
  LineNum?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: One of, up to three custom fields for the transaction. Available for custom fields so configured for the company. Check <span class="literal">Preferences.SalesFormsPrefs.CustomField</span> and <span class="literal">Preferences.VendorAndPurchasesPrefs.POCustomField</span> for custom fields currenly configured. <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/create-custom-fields" title="Custom Fields">Click here</a> to learn about managing custom fields.
   */
  CustomField?: CustomField[];
}

export interface Deposit_CashBack_CashBackInfo {
  /**
   * META: * Required
   *
   * DESCRIPTION: The bank acount into which the cashback amount is transferred. Query the Account name list resource to determine the appropriate Account object for this reference. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">AccountRef.value</span> and <span class="literal">\AccountRef.name</span>, respectively. The specified account must have <span class="literal">Account.Classification</span> set to <span class="literal">Asset</span>.
   */
  AccountRef: ReferenceType;
  /**
   * META: * Required
   *
   * DESCRIPTION: Amount of the cash back transaction.
   */
  Amount: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Memo associated with this cash back transaction.
   */
  Memo?: string;
}

export interface Deposit_TxnTaxDetail_TaxLine_Line {
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">TaxLineDetail</span>for this type of line.
   */
  DetailType: "TaxLineDetail";
  /**
   * META: * Required
   *
   * DESCRIPTION: <strong>TaxLineDetail</strong>
   */
  TaxLineDetail: TaxLineDetail;
  /**
   * META: Optional ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of tax for this tax line.  This value is negative for JournalEntry objects with <span class="literal">PostingType</span> set to <span class="literal">Credit.</span>
   */
  Amount?: number;
}

export interface Deposit {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object.
   * Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Identifies the account to be used for this deposit. Query the Account name list resource to determine the appropriate Account object for this reference, where <span class="literal">Account.AccountType</span> is <span class="literal">Other Current Asset</span> or <span class="literal">Bank</span>. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">DepositToAccountRef.value</span> and <span class="literal">DepostiToAccountRef.name</span>, respectively.
   */
  DepositToAccountRef: ReferenceType;
  /**
   * META: * Required
   *
   * DESCRIPTION: Individual line items comprising the deposit. Specify a <span class="literal">Line.LinkedTxn</span> element along with DepositLine detail type if this line is to record a deposit for an existing transaction. Select <span class="literal">UndepositedFunds</span> account on the existing transaction to make it available for the Deposit.
   * <li>
Possible types of transactions that can be linked to a Deposit include:
<span class="literal">Transfer</span>,
<span class="literal">Payment</span> (for Cash, CreditCard, and Check payment method types),
<span class="literal">SalesReceipt</span>,
<span class="literal">RefundReceipt</span>,
<span class="literal">JournalEntry</span>.
</li>
<li>
In addition, any expense object whose line item has <span class="literal">AccountReceivable</span> can be linked to a Payment and then that Payment can be linked to a Deposit object.
</li>

Use <span class="literal">Line.LinkedTxn.TxnId</span> as the ID in a separate read request for the specific resource to retrieve details of the linked object. Valid <span class="literal">Line</span> types include: <span class="literal">LinkedTxn</span> and <span class="literal">DepositLine</span>
   */
  Line: (Deposit_Line_LineLinkedTxn | Deposit_Line_DepositLine)[];
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Reference to the currency in which all amounts on the associated transaction are expressed. This must be defined if multicurrency is enabled for the company.
   * <br>Multicurrency is enabled for the company if <span class="literal">Preferences.MultiCurrencyEnabled</span> is set to <span class="literal">true</span>. Read more about multicurrency support <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/manage-multiple-currencies" title="Currency">here</a>.  The CurrencyRef can be overwritten by the <span class="literal">Line.DepositLineDetail</span> Entity. If the customer that you are referring to has a default currency of USD then the currency for this Deposit will always be set as USD.
   */
  CurrencyRef?: CurrencyRefType;
  /**
   * META: Optional ,max character: max of 4000 chars
   *
   * DESCRIPTION: User entered, organization-private note about the transaction. This note does not appear on the invoice to the customer. This field maps to the Memo field on the Invoice form.
   */
  PrivateNote?: string;
  /**
   * META: Optional ,minorVersion: 3 ,
   *
   * DESCRIPTION: Method in which tax is applied. Allowed values are:
   * <span class="literal">TaxExcluded</span>,
<span class="literal">TaxInclusive</span>, and
<span class="literal">NotApplicable</span>.
   */
  GlobalTaxCalculation?: "TaxExcluded" | "TaxInclusive" | "NotApplicable";
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The number of home currency units it takes to equal one unit of currency specified by <span class="literal">CurrencyRef</span>. Applicable if multicurrency is enabled for the company.
   */
  ExchangeRate?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: A reference to a Department object specifying the location of the transaction, as defined using location tracking in QuickBooks Online. Available if <span class="literal">Preferences.AccountingInfoPrefs.TrackDepartments</span> is set to <span class="literal">true</span>.
   * Query the Department name list resource to determine the appropriate Department object for this reference. Use <span class="literal">Department.Id</span> and <span class="literal">Department.Name</span> from that object for <span class="literal">DepartmentRef.value</span> and <span class="literal">DepartmentRef.name</span>, respectively.
   */
  DepartmentRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Used internally to specify originating source of a credit card transaction.
   */
  TxnSource?: string;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: The date entered by the user when this transaction occurred.
   * For posting transactions, this is the posting date that affects the financial statements. If the date is not supplied, the current date on the server is used.
<br>Sort order is ASC by default.
   */
  TxnDate?: string;
  /**
   * META: Optional
   */
  CashBack?: Deposit_CashBack_CashBackInfo;
  /**
   * META: Optional ,minorVersion: 4 ,
   *
   * DESCRIPTION: The account location. Valid values include:
   * <li><span class="literal">WithinFrance</span></li>
<li><span class="literal">FranceOverseas</span></li>
<li><span class="literal">OutsideFranceWithEU</span></li>
<li><span class="literal">OutsideEU</span></li>

For France locales, only.
   */
  TransactionLocationType?: string;
  /**
   * META: Optional ,minorVersion: 4 ,
   *
   * DESCRIPTION: This data type provides information for taxes charged on the transaction as a whole. It captures the details sales taxes calculated for the transaction based on the tax codes referenced by the transaction. This can be calculated by QuickBooks business logic or you may supply it when adding a transaction. For non-US companies.
   * See <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/manage-sales-tax-for-non-us-locales/non-us_sales_tax_integrations" title="Global Tax Model">Global tax model</a> for more information about this element.
If sales tax is disabled (<span class="literal">Preferences.TaxPrefs.UsingSalesTax</span> is set to <span class="literal">false</span>) then <span class="literal">TxnTaxDetail</span> is ignored and not stored.
   */
  TxnTaxDetail?: TxnTaxDetail;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: read only ,minorVersion: 52
   *
   * DESCRIPTION: A reference to the Recurring Transaction. It captures what recurring transaction template the <span class="literal">Deposit</span> was created from.
   */
  readonly RecurDataRef?: ReferenceType;
  /**
   * META: read only ,system defined
   *
   * ADDON: Big Decimal
   *
   * DESCRIPTION: Indicates the total amount of the transaction. This includes the total of all the charges, allowances, and taxes. Calculated by QuickBooks business logic; any value you supply is over-written by QuickBooks.
   */
  readonly TotalAmt?: number;
  /**
   * META: read only ,system defined
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Total amount of the transaction in the home currency. Includes the total of all the charges, allowances and taxes. Calculated by QuickBooks business logic.
   * Value is valid only when <span class="literal">CurrencyRef</span> is specified. Applicable if multicurrency is enabled for the company.
   */
  readonly HomeTotalAmt?: number;
  /**
   * DESCRIPTION: If true, only fields specified will be updated
   */
  sparse?: boolean;
}

export interface Employee_PrimaryPhone_TelephoneNumber {
  /**
   * META: Optional ,max character: Maximum of 20 chars
   *
   * DESCRIPTION: Specifies the telephone number in free form.
   */
  FreeFormNumber?: string;
}

export interface Employee_Mobile_TelephoneNumber {
  /**
   * META: Optional ,max character: Maximum of 20 chars
   *
   * DESCRIPTION: Specifies the telephone number in free form.
   */
  FreeFormNumber?: string;
}

export interface Employee {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object.
   * Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: * Conditionally required ,  ,max character: maximum 30 characters
   *
   * DESCRIPTION: Represents the physical street address for this employee. If QuickBooks Payroll is enabled for the company, the following PhysicalAddress fields are required:
   * <li><span class="literal">City</span>, maximum of 255 chars</li>
<li><span class="literal">CountrySubDivisionCode</span>, maximum of 255 chars</li>
<li><span class="literal">PostalCode</span></li>
 Required when QuickBooks Payroll is enabled.<br> If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:<p></p><ul><li><span class="literal">Line1</span> and <span class="literal">Line2</span> elements are populated with the customer name and company name.</li><li>Original <span class="literal">Line1</span> through <span class="literal">Line 5</span> contents, <span class="literal">City</span>, <span class="literal">SubDivisionCode</span>, and <span class="literal">PostalCode</span> flow into <span class="literal">Line3</span> through <span class="literal">Line5</span>as a free format strings.</li></ul>
   */
  PrimaryAddr?: PhysicalAddress;
  /**
   * META: Optional
   *
   * DESCRIPTION: <span class="literal">Primary email address.</span>
   */
  PrimaryEmailAddr?: EmailAddress;
  /**
   * META: Optional ,max character: maximum of 500 chars
   *
   * DESCRIPTION: The name of the person or organization as displayed. Default Value: If not supplied, the system generates <span class="literal">DisplayName</span> by concatenating employee name components supplied in the request from the following list: <span class="literal">Title</span>, <span class="literal">GivenName</span>, <span class="literal">MiddleName</span>, <span class="literal">FamilyName</span>, and <span class="literal">Suffix</span>.
   * When QuickBooks Payroll is enabled, this attribute is read-only and a concatenation of <span class="literal">GivenName</span>, <span class="literal">MiddleName</span>, and <span class="literal">FamilyName</span>.
   */
  DisplayName?: string;
  /**
   * META: Optional ,max character: maximum 16 chars
   *
   * DESCRIPTION: Title of the person.
   * This tag supports i18n, all locale.
Not supported when QuickBooks Payroll is enabled.
   */
  Title?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: If true, this entity is currently enabled for use by QuickBooks.
   */
  BillableTime?: boolean;
  /**
   * META: Optional ,max character: maximum of 100 chars
   *
   * DESCRIPTION: Given name or family name of a person. At least one of
   * <span class="literal">GivenName</span> or <span class="literal">FamilyName</span> attributes is required.
   */
  GivenName?: string;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: Birth date of the employee.
   */
  BirthDate?: string;
  /**
   * META: Optional ,max character: maximum of 100 chars
   *
   * DESCRIPTION: Middle name of the person. The person can have zero or more middle names.
   */
  MiddleName?: string;
  /**
   * META: Optional ,max character: max 100 chars
   *
   * DESCRIPTION: Social security number (SSN) of the employee. If SSN is set, it is masked in the response with XXX-XX-XXXX. If  XXX-XX-XXXX is sent in the create or update request, XXX-XX-XXXX is ignored and the old value is preserved.
   * This attribute cannot be passed in a request when QuickBooks Payroll is enabled. Code for this field must be removed before submitting.
   */
  SSN?: string;
  /**
   * META: Optional ,max character: maximum of 20 chars
   *
   * DESCRIPTION: <span class="literal">Primary phone number.</span>
   */
  PrimaryPhone?: Employee_PrimaryPhone_TelephoneNumber;
  /**
   * META: Optional
   *
   * DESCRIPTION: If true, this entity is currently enabled for use by QuickBooks.
   */
  Active?: boolean;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: Release date of the employee.
   */
  ReleasedDate?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: Optional
   *
   * ADDON: Big Decimal
   *
   * DESCRIPTION: Pay rate of the employee
   */
  CostRate?: number;
  /**
   * META: Optional ,max character: maximum of 20 chars
   *
   * DESCRIPTION: Mobile phone number.
   */
  Mobile?: Employee_Mobile_TelephoneNumber;
  /**
   * META: Optional
   *
   * DESCRIPTION: Gender of the employee. To clear the gender value, set to Null in a full update request. Supported values include: <span class="literal">Male</span> or <span class="literal">Female</span>.
   */
  Gender?: string;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: Hire date of the employee.
   */
  HiredDate?: string;
  /**
   * META: Optional
   *
   * ADDON: Big Decimal
   *
   * DESCRIPTION: This attribute can only be set if <span class="literal">BillableTime</span> is true.
   * Not supported when QuickBooks Payroll is enabled.
   */
  BillRate?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: <span class="literal">true</span>--the object represents an organization.
   * <span class="literal">false</span>--the object represents a person.
   */
  Organization?: boolean;
  /**
   * META: Optional ,max character: maximum of 16 chars
   *
   * DESCRIPTION: Suffix of the name. For example, <span class="literal">Jr</span>.
   * Not supported when QuickBooks Payroll is enabled.
   */
  Suffix?: string;
  /**
   * META: Optional ,max character: maximum of 100 chars
   *
   * DESCRIPTION: Family name or the last name of the person. At least one of
   * <span class="literal">GivenName</span> or <span class="literal">FamilyName</span> attributes is required.
   */
  FamilyName?: string;
  /**
   * META: Optional ,max character: maximum of 100 chars
   *
   * DESCRIPTION: <span>Name of the person or organization as printed on a check. If not provided, this is populated from <span class="literal">DisplayName</span>.</span>
   * Cannot be removed with sparse update.
Not supported when QuickBooks Payroll is enabled.
   */
  PrintOnCheckName?: string;
  /**
   * META: Optional ,max character: max 100 chars
   *
   * DESCRIPTION: Specifies the ID number of the employee in the employer's directory.
   */
  EmployeeNumber?: string;
  /**
   * META: read only ,minorVersion: 26
   *
   * DESCRIPTION: Employee reference number. For internal use only.
   */
  readonly V4IDPseudonym?: string;
}

export interface Estimate_LinkedTxn {
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction Id of the related transaction.
   */
  TxnId: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction type of the linked object.
   */
  TxnType: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Required for Deposit and Bill entities. The line number of a specific line of the linked transaction. If supplied, the
   * <span class="literal">TxnId</span> and
<span class="literal">TxnType</span> attributes of the linked transaction must also be populated.
   */
  TxnLineId?: string;
}

export interface Estimate_Line_SalesItemLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to <span class="literal">SalesItemLineDetail</span>for this type of line.
   */
  DetailType: "SalesItemLineDetail";
  /**
   * META: * Required
   */
  SalesItemLineDetail: SalesItemLineDetail;
  /**
   * META: * Required ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   *  For Invoice objects in global locales: when updating <span class="literal">Amount</span>, remove the <span class="literal">TxnTaxDetail</span> element in the object before submitting it in the update request payload.
   */
  Amount: number;
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer
   */
  LineNum?: number;
}

export interface Estimate_Line_GroupLineDetail_Line {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to <span class="literal">SalesItemLineDetail</span>for this type of line.
   */
  DetailType: "SalesItemLineDetail";
  /**
   * META: * Required
   */
  SalesItemLineDetail: SalesItemLineDetail;
  /**
   * META: * Required ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   *  For Invoice objects in global locales: when updating <span class="literal">Amount</span>, remove the <span class="literal">TxnTaxDetail</span> element in the object before submitting it in the update request payload.
   */
  Amount: number;
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer
   */
  LineNum?: number;
}

export interface Estimate_Line_GroupLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   */
  GroupLineDetail: GroupLineDetail;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">GroupLineDetail</span>for this type of line.
   */
  DetailType: "GroupLineDetail";
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer
   */
  LineNum?: number;
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
}

export interface Estimate_Line_DescriptionOnlyLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the transaction, the request is considered an update operation for the description line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the transaction then the request is considered a create operation for the description line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">DescriptionOnly</span>for this type of line.
   */
  DetailType: "DescriptionOnly";
  /**
   * META: * Required
   */
  DescriptionLineDetail: DescriptionLineDetail;
  /**
   * META: Optional ,max character: max 4000 chars
   *
   * DESCRIPTION: A string representing one of the following:
   * <li>
Free form text description of the line item that appears in the printed record.
</li>
<li>
A subtotal line inline with other lines on the sales form and holds the sum of amounts on all lines above it. This is distinct from the overall transaction subtotal represented with a SubTotal detail line.
</li><li>
In create requests, set to <span class="literal">Subtotal:</span> (case sensitive) to create the subtotal line; the amount is generated by QuickBooks Online business logic.
</li>
<li>
In read requests, lines with <span class="literal">Subtotal: nn.nn</span> returned in this field denote subtotal lines in the object.
</li>
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer.
   */
  LineNum?: number;
  /**
   * META: read only ,minorVersion: 23
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item. Available when <span class="literal">Amount</span> is set via the QuickBooks UI. Returned only for Description Only line items that have a non-empty amount associated with them.
   */
  readonly Amount?: number;
}

export interface Estimate_Line_DiscountLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>
If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.
</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation. Not supported for BillPayment, Estimate, Invoice, or Payment objects.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Discount detail type for the entire transaction. This is in contrast to a discount applied to a specific line. The company preference
   * <strong>Sales Form Entry | Discounts</strong> must be enabled for this type of line to be available. Must be enabled for this type of line to be available.
   */
  DiscountLineDetail: DiscountLineDetail;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">DiscountLineDetail</span>for this type of line.
   */
  DetailType: "DiscountLineDetail";
  /**
   * META: * Required ,max character: max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   */
  Amount: number;
  /**
   * META: Optional ,max character: max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer.
   */
  LineNum?: number;
}

export interface Estimate_Line_SubTotalLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>
If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.
</li>
<li>
If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.
</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Subtotal <strong>LineDetail</strong>
   */
  SubtotalLineDetail: LineDetail;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to <span class="literal">SubtotalLineDetail</span>for this type of line.
   */
  DetailType: "SubTotalLineDetail";
  /**
   * META: * Required ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   */
  Amount: number;
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer
   */
  LineNum?: number;
}

export interface Estimate_TxnTaxDetail_TaxLine_Line {
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">TaxLineDetail</span>for this type of line.
   */
  DetailType: "TaxLineDetail";
  /**
   * META: * Required
   *
   * DESCRIPTION: <strong>TaxLineDetail</strong>
   */
  TaxLineDetail: TaxLineDetail;
  /**
   * META: Optional ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of tax for this tax line.  This value is negative for JournalEntry objects with <span class="literal">PostingType</span> set to <span class="literal">Credit.</span>
   */
  Amount?: number;
}

export interface Estimate {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object.
   * Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use <span class="literal">Customer.Id</span> and <span class="literal">Customer.DisplayName</span> from that object for <span class="literal">CustomerRef.value</span> and <span class="literal">CustomerRef.name</span>, respectively.
   */
  CustomerRef: ReferenceType;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Reference to the currency in which all amounts on the associated transaction are expressed. This must be defined if multicurrency is enabled for the company.
   * Multicurrency is enabled for the company if <span class="literal">Preferences.MultiCurrencyEnabled</span> is set to <span class="literal">true</span>. Read more about multicurrency support <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/manage-multiple-currencies" title="Currency">here</a>. Required if multicurrency is enabled for the company.
   */
  CurrencyRef?: CurrencyRefType;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Identifies the e-mail address where the estimate is sent. If
   * <span class="literal">EmailStatus=NeedToSend</span>,
<span class="literal">BillEmail</span>is a required input.
   */
  BillEmail?: EmailAddress;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: The date entered by the user when this transaction occurred.
   * For posting transactions, this is the posting date that affects the financial statements. If the date is not supplied, the current date on the server is used.
<br>Sort order is ASC by default.
   */
  TxnDate?: string;
  /**
   * META: Optional ,minorVersion: 35
   *
   * DESCRIPTION: Identifies the address where the goods are shipped from. For transactions without shipping, it represents the address where the sale took place.<br>For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country. <br>If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:<p></p><ul><li><span class="literal">Line1</span> and <span class="literal">Line2</span> elements are populated with the customer name and company name.</li><li>Original <span class="literal">Line1</span> through <span class="literal">Line 5</span> contents, <span class="literal">City</span>, <span class="literal">SubDivisionCode</span>, and <span class="literal">PostalCode</span> flow into <span class="literal">Line3</span> through <span class="literal">Line5</span>as a free format strings.</li></ul>
   */
  ShipFromAddr?: PhysicalAddress;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: Date for delivery of goods or services.
   */
  ShipDate?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the Class associated with the transaction. Available if <span class="literal">Preferences.AccountingInfoPrefs.ClassTrackingPerTxn</span> is set to <span class="literal">true</span>. Query the Class name list resource to determine the appropriate Class object for this reference. Use <span class="literal">Class.Id</span> and <span class="literal">Class.Name</span> from that object for <span class="literal">ClassRef.value</span> and <span class="literal">ClassRef.name</span>, respectively.
   */
  ClassRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Printing status of the invoice.
   * Valid values:
<span class="literal">NotSet</span>,
<span class="literal">NeedToPrint</span>,
<span class="literal">PrintComplete
</span>.
   */
  PrintStatus?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: One of, up to three custom fields for the transaction. Available for custom fields so configured for the company. Check <span class="literal">Preferences.SalesFormsPrefs.CustomField</span> and <span class="literal">Preferences.VendorAndPurchasesPrefs.POCustomField</span> for custom fields currenly configured. <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/create-custom-fields" title="Custom Fields">Click here</a> to learn about managing custom fields.
   */
  CustomField?: CustomField[];
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the sales term associated with the transaction. Query the Term name list resource to determine the appropriate Term object for this reference. Use <span class="literal">Term.Id</span> and <span class="literal">Term.Name</span> from that object for <span class="literal">SalesTermRef.value</span> and <span class="literal">SalesTermRef.name</span>, respectively.
   */
  SalesTermRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: One of the following status settings: <span class="literal">Accepted, Closed, Pending, Rejected, Converted</span>
   */
  TxnStatus?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Zero or more <span class="literal">Invoice</span> objects related to this transaction.
   * Use <span class="literal">LinkedTxn.TxnId</span> as the ID in a separate Invoice read request to retrieve details of the linked object.
   */
  LinkedTxn?: Estimate_LinkedTxn[];
  /**
   * META: Optional ,
   *
   * DESCRIPTION: <span class="literal">TaxExcluded</span>
   * Method in which tax is applied. Allowed values are:
<span class="literal">TaxExcluded</span>,
<span class="literal">TaxInclusive</span>, and
<span class="literal">NotApplicable</span>.
   */
  GlobalTaxCalculation?: "TaxExcluded" | "TaxInclusive" | "NotApplicable";
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: Date estimate was accepted.
   */
  AcceptedDate?: string;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: Date by which estimate must be accepted before invalidation.
   */
  ExpirationDate?: string;
  /**
   * META: Optional ,minorVersion: 4 ,
   *
   * DESCRIPTION: The account location. Valid values include:
   * <li><span class="literal">WithinFrance</span></li>
<li><span class="literal">FranceOverseas</span></li>
<li><span class="literal">OutsideFranceWithEU</span></li>
<li><span class="literal">OutsideEU</span></li>

For France locales, only.
   */
  TransactionLocationType?: string;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: Date when the payment of the transaction is due. If date is not provided, the number of days specified in
   * <span class="literal">SalesTermRef</span> added the transaction date will be used.
   */
  DueDate?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: Optional ,max character: maximum of 21 chars
   *
   * DESCRIPTION: Reference number for the transaction. If not explicitly provided at create time, this field is populated based on the setting of <span class="literal">Preferences:CustomTxnNumber</span> as follows:
   * <li>If <span class="literal">Preferences:CustomTxnNumber</span> is true a custom value can be provided. If no value is supplied, the resulting DocNumber is null.</li>
<li>If <span class="literal">Preferences:CustomTxnNumber</span> is false, resulting DocNumber is system generated by incrementing the last number by 1.</li>

If <span class="literal">Preferences:CustomTxnNumber</span> is false then do not send a value as it can lead to unwanted duplicates. If a DocNumber value is sent for an Update operation, then it just updates that particular invoice and does not alter the internal system DocNumber. <br><em>Note:</em> DocNumber is an optional field for all locales except France. For France locale if <span class="literal">Preferences:CustomTxnNumber</span> is enabled it will <b>not</b> be automatically generated and is a required field.
   */
  DocNumber?: string;
  /**
   * META: Optional ,max character: Max of 4000 chars
   *
   * DESCRIPTION: User entered, organization-private note about the transaction. This note does not appear on the invoice to the customer. This field maps to the Memo field on the Invoice form.
   */
  PrivateNote?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Individual line items of a transaction. Valid <span class="literal">Line</span> types include:
   * <span class="literal">SalesItemLine</span>, <span class="literal">GroupLine</span>, <span class="literal">DescriptionOnlyLine</span> (also used for inline Subtotal lines), <span class="literal">DiscountLine</span> and <span class="literal">SubTotalLine</span> (used for the overall transaction)
   */
  Line?: (Estimate_Line_SalesItemLine | Estimate_Line_GroupLine | Estimate_Line_DescriptionOnlyLine | Estimate_Line_DiscountLine | Estimate_Line_SubTotalLine)[];
  /**
   * META: Optional
   *
   * DESCRIPTION: User-entered message to the customer; this message is visible to end user on their transactions.
   */
  CustomerMemo?: MemoRef;
  /**
   * META: Optional
   *
   * DESCRIPTION: Email status of the invoice.
   * Valid values:
<span class="literal">NotSet</span>,
<span class="literal">NeedToSend</span>,
<span class="literal">EmailSent
</span>
   */
  EmailStatus?: string;
  /**
   * META: Optional ,minorVersion: 69
   *
   * DESCRIPTION: Reference to the <span class="literal">Project</span> ID associated with this transaction. Available with Minor Version 69 and above
   */
  ProjectRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: This data type provides information for taxes charged on the transaction as a whole. It captures the details sales taxes calculated for the transaction based on the tax codes referenced by the transaction. This can be calculated by QuickBooks business logic or you may supply it when adding a transaction. See <a href="https://developer.intuit.com/app/developer/qbo/docs/workflows/manage-sales-tax-for-non-us-locales" title="Global Tax Model">Global tax model</a> for more information about this element.
   * If sales tax is disabled (<span class="literal">Preferences.TaxPrefs.UsingSalesTax</span> is set to <span class="literal">false</span>) then <span class="literal">TxnTaxDetail</span> is ignored and not stored.
   */
  TxnTaxDetail?: TxnTaxDetail;
  /**
   * META: Optional
   *
   * DESCRIPTION: Name of customer who accepted the estimate.
   */
  AcceptedBy?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The number of home currency units it takes to equal one unit of currency specified by <span class="literal">CurrencyRef</span>. Applicable if multicurrency is enabled for the company.
   */
  ExchangeRate?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: Identifies the address where the goods must be shipped. If
   * <span class="literal">ShipAddr</span>is not specified, and a default
<span class="literal">Customer:ShippingAddr</span> is specified in QuickBooks for this customer, the default ship-to address will be used by QuickBooks. <br>For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country. <br>If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:<p></p><ul><li><span class="literal">Line1</span> and <span class="literal">Line2</span> elements are populated with the customer name and company name.</li><li>Original <span class="literal">Line1</span> through <span class="literal">Line 5</span> contents, <span class="literal">City</span>, <span class="literal">SubDivisionCode</span>, and <span class="literal">PostalCode</span> flow into <span class="literal">Line3</span> through <span class="literal">Line5</span>as a free format strings.</li></ul>
   */
  ShipAddr?: PhysicalAddress;
  /**
   * META: Optional
   *
   * DESCRIPTION: A reference to a Department object specifying the location of the transaction. Available if <span class="literal">Preferences.AccountingInfoPrefs.TrackDepartments</span> is set to <span class="literal">true</span>.
   * Query the Department name list resource to determine the appropriate department object for this reference. Use <span class="literal">Department.Id</span> and <span class="literal">Department.Name</span> from that object for <span class="literal">DepartmentRef.value</span> and <span class="literal">DepartmentRef.name</span>, respectively.
   */
  DepartmentRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the ShipMethod associated with the transaction. There is no shipping method list. Reference resolves to a string. Reference to the ShipMethod associated with the transaction. There is no shipping method list. Reference resolves to a string.
   */
  ShipMethodRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Bill-to address of the Invoice. If
   * <span class="literal">BillAddr</span>is not specified, and a default
<span class="literal">Customer:BillingAddr</span> is specified in QuickBooks for this customer, the default bill-to address is used by QuickBooks. <br>For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country. <br>If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:<p></p><ul><li><span class="literal">Line1</span> and <span class="literal">Line2</span> elements are populated with the customer name and company name.</li><li>Original <span class="literal">Line1</span> through <span class="literal">Line 5</span> contents, <span class="literal">City</span>, <span class="literal">SubDivisionCode</span>, and <span class="literal">PostalCode</span> flow into <span class="literal">Line3</span> through <span class="literal">Line5</span>as a free format strings.</li></ul>
   */
  BillAddr?: PhysicalAddress;
  /**
   * META: Optional ,
   *
   * DESCRIPTION: If false or null, calculate the sales tax first, and then apply the discount. If true, subtract the discount first and then calculate the sales tax.
   */
  ApplyTaxAfterDiscount?: boolean;
  /**
   * META: read only ,system defined
   *
   * ADDON: Big Decimal
   *
   * DESCRIPTION: Indicates the total amount of the transaction. This includes the total of all the charges, allowances, and taxes. Calculated by QuickBooks business logic; any value you supply is over-written by QuickBooks.
   */
  readonly TotalAmt?: number;
  /**
   * META: read only ,minorVersion: 52
   *
   * DESCRIPTION: A reference to the Recurring Transaction. It captures what recurring transaction template the <span class="literal">Estimate</span> was created from.
   */
  readonly RecurDataRef?: ReferenceType;
  /**
   * META: read only ,minorVersion: 21 ,system defined
   *
   * DESCRIPTION: Reference to the <span class="literal">TaxExepmtion</span> ID associated with this object. Available for companies that have <a href="https://developer.intuit.com/hub/blog/2017/12/11/using-quickbooks-online-api-automated-sales-tax" title="Automatic Sales Tax">automated sales tax</a> enabled.
   * <li><span class="literal">TaxExemptionRef.Name</span>: The Tax Exemption Id for the customer to which this object is associated. This Id is typically issued by the state.</li>
<li><span class="literal">TaxExemptionRef.value</span>: The system-generated Id of the exemption type.</li>

 For internal use only.
   */
  readonly TaxExemptionRef?: ReferenceType;
  /**
   * META: read only ,system defined
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Total amount of the transaction in the home currency. Includes the total of all the charges, allowances and taxes. Calculated by QuickBooks business logic.
   * Value is valid only when <span class="literal">CurrencyRef</span> is specified. Applicable if multicurrency is enabled for the company.
   */
  readonly HomeTotalAmt?: number;
  /**
   * META: system defined
   *
   * DESCRIPTION: Denotes how <span class="literal">ShipAddr</span> is stored:&nbsp;formatted or unformatted. The value of this flag is system defined based on format of shipping address at object create time.<ul><li>If set to <span class="literal">false</span>, shipping address is returned in a formatted style using City, Country,&nbsp;CountrySubDivisionCode, Postal code.</li><li>If set to <span class="literal">true</span>, shipping address is returned in an unformatted style using Line1 through Line5 attributes.</li></ul>
   */
  FreeFormAddress?: boolean;
  /**
   * DESCRIPTION: If true, only fields specified will be updated
   */
  sparse?: boolean;
}

export interface Exchangerate {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: * Required for update
   *
   * DESCRIPTION: Date on which this exchange rate was set.
   */
  AsOfDate?: boolean;
  /**
   * META: * Required for update ,max character: Exactly 3 chars
   *
   * DESCRIPTION: The source currency from which the exchange rate is specified, and usually. Specify as a three letter string representing the ISO 4217 code for the currency. For example, <span class="literal">USD</span>, <span class="literal">AUD</span>, <span class="literal">EUR</span>, and so on.
   * For example, in the equation <span class="literal">65 INR = 1 USD</span>, <span class="literal">INR</span> is the source currency.
   */
  SourceCurrencyCode?: string;
  /**
   * META: * Required for update
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The exchange rate between <span class="literal">SourceCurrencyCode</span> and <span class="literal">TargetCurrencyCode</span> on the <span class="literal">AsOfDate</span> date.
   */
  Rate?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: One of, up to three custom fields for the transaction. Available for custom fields so configured for the company. Check <span class="literal">Preferences.SalesFormsPrefs.CustomField</span> and <span class="literal">Preferences.VendorAndPurchasesPrefs.POCustomField</span> for custom fields currenly configured. <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/create-custom-fields" title="Custom Fields">Click here</a> to learn about managing custom fields.
   */
  CustomField?: CustomField[];
  /**
   * META: Optional ,max character: Exactly 3 chars
   *
   * DESCRIPTION: The target currency against which the exchange rate is specified. Specify as a three letter string representing the ISO 4217 code for the currency. For example, <span class="literal">USD</span>, <span class="literal">AUD</span>, <span class="literal">EUR</span>, and so on.
   * For example, in the equation <span class="literal">65 INR = 1 USD</span>, <span class="literal">USA</span> is the target currency.
   */
  TargetCurrencyCode?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
}

export interface Invoice_Line_SalesItemLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to <span class="literal">SalesItemLineDetail</span>for this type of line.
   */
  DetailType: "SalesItemLineDetail";
  /**
   * META: * Required
   */
  SalesItemLineDetail: SalesItemLineDetail;
  /**
   * META: * Required ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   *  For Invoice objects in global locales: when updating <span class="literal">Amount</span>, remove the <span class="literal">TxnTaxDetail</span> element in the object before submitting it in the update request payload.
   */
  Amount: number;
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer
   */
  LineNum?: number;
}

export interface Invoice_Line_GroupLineDetail_Line {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to <span class="literal">SalesItemLineDetail</span>for this type of line.
   */
  DetailType: "SalesItemLineDetail";
  /**
   * META: * Required
   */
  SalesItemLineDetail: SalesItemLineDetail;
  /**
   * META: * Required ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   *  For Invoice objects in global locales: when updating <span class="literal">Amount</span>, remove the <span class="literal">TxnTaxDetail</span> element in the object before submitting it in the update request payload.
   */
  Amount: number;
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer
   */
  LineNum?: number;
}

export interface Invoice_Line_GroupLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   */
  GroupLineDetail: GroupLineDetail;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">GroupLineDetail</span>for this type of line.
   */
  DetailType: "GroupLineDetail";
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer
   */
  LineNum?: number;
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
}

export interface Invoice_Line_DescriptionOnlyLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the transaction, the request is considered an update operation for the description line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the transaction then the request is considered a create operation for the description line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">DescriptionOnly</span>for this type of line.
   */
  DetailType: "DescriptionOnly";
  /**
   * META: * Required
   */
  DescriptionLineDetail: DescriptionLineDetail;
  /**
   * META: Optional ,max character: max 4000 chars
   *
   * DESCRIPTION: A string representing one of the following:
   * <li>
Free form text description of the line item that appears in the printed record.
</li>
<li>
A subtotal line inline with other lines on the sales form and holds the sum of amounts on all lines above it. This is distinct from the overall transaction subtotal represented with a SubTotal detail line.
</li><li>
In create requests, set to <span class="literal">Subtotal:</span> (case sensitive) to create the subtotal line; the amount is generated by QuickBooks Online business logic.
</li>
<li>
In read requests, lines with <span class="literal">Subtotal: nn.nn</span> returned in this field denote subtotal lines in the object.
</li>
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer.
   */
  LineNum?: number;
  /**
   * META: read only ,minorVersion: 23
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item. Available when <span class="literal">Amount</span> is set via the QuickBooks UI. Returned only for Description Only line items that have a non-empty amount associated with them.
   */
  readonly Amount?: number;
}

export interface Invoice_Line_DiscountLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>
If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.
</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation. Not supported for BillPayment, Estimate, Invoice, or Payment objects.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Discount detail type for the entire transaction. This is in contrast to a discount applied to a specific line. The company preference
   * <strong>Sales Form Entry | Discounts</strong> must be enabled for this type of line to be available. Must be enabled for this type of line to be available.
   */
  DiscountLineDetail: DiscountLineDetail;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">DiscountLineDetail</span>for this type of line.
   */
  DetailType: "DiscountLineDetail";
  /**
   * META: * Required ,max character: max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   */
  Amount: number;
  /**
   * META: Optional ,max character: max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer.
   */
  LineNum?: number;
}

export interface Invoice_Line_SubTotalLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>
If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.
</li>
<li>
If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.
</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Subtotal <strong>LineDetail</strong>
   */
  SubtotalLineDetail: LineDetail;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to <span class="literal">SubtotalLineDetail</span>for this type of line.
   */
  DetailType: "SubTotalLineDetail";
  /**
   * META: * Required ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   */
  Amount: number;
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer
   */
  LineNum?: number;
}

export interface Invoice_LinkedTxn {
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction Id of the related transaction.
   */
  TxnId: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction type of the linked object.
   */
  TxnType: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Required for Deposit and Bill entities. The line number of a specific line of the linked transaction. If supplied, the
   * <span class="literal">TxnId</span> and
<span class="literal">TxnType</span> attributes of the linked transaction must also be populated.
   */
  TxnLineId?: string;
}

export interface Invoice_TxnTaxDetail_TaxLine_Line {
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">TaxLineDetail</span>for this type of line.
   */
  DetailType: "TaxLineDetail";
  /**
   * META: * Required
   *
   * DESCRIPTION: <strong>TaxLineDetail</strong>
   */
  TaxLineDetail: TaxLineDetail;
  /**
   * META: Optional ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of tax for this tax line.  This value is negative for JournalEntry objects with <span class="literal">PostingType</span> set to <span class="literal">Credit.</span>
   */
  Amount?: number;
}

export interface DeliveryInfo {
  /**
   * META: read only
   *
   * DESCRIPTION: Type of the delivery. Used to confirm that email has been sent via the send operation.
   *  Valid values currently include: <span class="literal">Email</span>.
   */
  readonly DeliveryType?: "Email";
  /**
   * META: read only
   *
   * ADDON: Local time zone: YYYY-MM-DDTHH:MM:SS UTC: YYYY-MM-DDT HH :MM: SSZ Specific time zone: YYYY-MM-DDT HH :MM:SS +/- HH :MM
   *
   * DESCRIPTION: Delivery date and time.
   */
  readonly DeliveryTime?: string;
}

export interface Invoice {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object.
   * Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Individual line items of a transaction. Valid <span class="literal">Line</span> types include 
   * <span class="literal">SalesItemLine</span>,
<span class="literal">GroupLine</span>,
<span class="literal">DescriptionOnlyLine</span> (also used for inline Subtotal lines),
<span class="literal">DiscountLine</span> and 
<span class="literal">SubTotalLine</span> (used for the overall transaction)
   */
  Line: (Invoice_Line_SalesItemLine | Invoice_Line_GroupLine | Invoice_Line_DescriptionOnlyLine | Invoice_Line_DiscountLine | Invoice_Line_SubTotalLine)[];
  /**
   * META: * Required
   *
   * DESCRIPTION: Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use <span class="literal">Customer.Id</span> and <span class="literal">Customer.DisplayName</span> from that object for <span class="literal">CustomerRef.value</span> and <span class="literal">CustomerRef.name</span>, respectively.
   */
  CustomerRef: ReferenceType;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Reference to the currency in which all amounts on the associated transaction are expressed. This must be defined if multicurrency is enabled for the company.
   * Multicurrency is enabled for the company if <span class="literal">Preferences.MultiCurrencyEnabled</span> is set to <span class="literal">true</span>. Read more about multicurrency support <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/manage-multiple-currencies" title="Currency">here</a>. Applicable if multicurrency is enabled for the company.
   */
  CurrencyRef?: CurrencyRefType;
  /**
   * META: * Conditionally required ,  ,max character: maximum of 21 chars
   *
   * DESCRIPTION: Reference number for the transaction. If not explicitly provided at create time, this field is populated based on the setting of <span class="literal">Preferences:CustomTxnNumber</span> as follows:
   * <li>If <span class="literal">Preferences:CustomTxnNumber</span> is true a custom value can be provided. If no value is supplied, the resulting DocNumber is null.</li>
<li>If <span class="literal">Preferences:CustomTxnNumber</span> is false, resulting DocNumber is system generated by incrementing the last number by 1.</li>

If <span class="literal">Preferences:CustomTxnNumber</span> is false then do not send a value as it can lead to unwanted duplicates. If a DocNumber value is sent for an Update operation, then it just updates that particular invoice and does not alter the internal system DocNumber. <br><em>Note:</em> DocNumber is an optional field for all locales except France. For France locale if <span class="literal">Preferences:CustomTxnNumber</span> is enabled it will <b>not</b> be automatically generated and is a required field. If a duplicate DocNumber needs to be supplied, add the query parameter name/value pair, <span class="literal">include=allowduplicatedocnum</span> to the URI.
   */
  DocNumber?: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Identifies the e-mail address where the invoice is sent. If
   * <span class="literal">EmailStatus=NeedToSend</span>,
<span class="literal">BillEmail</span>is a required input.
   */
  BillEmail?: EmailAddress;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: The date entered by the user when this transaction occurred. <ul><li><em>yyyy/MM/dd</em> is the valid date format.</li><li>For posting transactions, this is the posting date that affects the financial statements. If the date is not supplied, the current date on the server is used.</li><li>Sort order is ASC by default.</li></ul>
   */
  TxnDate?: string;
  /**
   * META: Optional ,minorVersion: 35
   *
   * DESCRIPTION: Identifies the address where the goods are shipped from. For transactions without shipping, it represents the address where the sale took place.<br> For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country. <br> If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:<p></p><ul><li><span class="literal">Line1</span> and <span class="literal">Line2</span> elements are populated with the customer name and company name.</li><li>Original <span class="literal">Line1</span> through <span class="literal">Line 5</span> contents, <span class="literal">City</span>, <span class="literal">SubDivisionCode</span>, and <span class="literal">PostalCode</span> flow into <span class="literal">Line3</span> through <span class="literal">Line5</span>as a free format strings.</li></ul>
   */
  ShipFromAddr?: PhysicalAddress;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: Date for delivery of goods or services.
   */
  ShipDate?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Shipping provider's tracking number for the delivery of the goods associated with the transaction.
   */
  TrackingNum?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the Class associated with the transaction. Available if <span class="literal">Preferences.AccountingInfoPrefs.ClassTrackingPerTxn</span> is set to <span class="literal">true</span>. Query the Class name list resource to determine the appropriate Class object for this reference. Use <span class="literal">Class.Id</span> and <span class="literal">Class.Name</span> from that object for <span class="literal">ClassRef.value</span> and <span class="literal">ClassRef.name</span>, respectively.
   */
  ClassRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Printing status of the invoice.
   * Valid values:
<span class="literal">NotSet</span>,
<span class="literal">NeedToPrint</span>,
<span class="literal">PrintComplete
</span>.
   */
  PrintStatus?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the sales term associated with the transaction. Query the Term name list resource to determine the appropriate Term object for this reference. Use <span class="literal">Term.Id</span> and <span class="literal">Term.Name</span> from that object for <span class="literal">SalesTermRef.value</span> and <span class="literal">SalesTermRef.name</span>, respectively.
   */
  SalesTermRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Used internally to specify originating source of a credit card transaction.
   */
  TxnSource?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Zero or more related transactions to this Invoice object. The following linked relationships are supported:<ul><li>
   * Links to <span class="literal">Estimate</span> and <span class="literal">TimeActivity</span> objects can be established directly to this Invoice object with UI or with the API. Create, Read, Update, and Query operations are avaialble at the API level for these types of links.
</li>
<li>Only one link can be made to an <span class="literal">Estimate</span>. Progress Invoicing is not supported via the API. </li><li>
Links to expenses incurred on behalf of the customer are returned in the response with <span class="literal">LinkedTxn.TxnType</span> set to <span class="literal">ReimburseCharge</span>, <span class="literal">ChargeCredit</span> or <span class="literal">StatementCharge</span> corresponding to billable customer expenses of type <span class="literal">Cash</span>, <span class="literal">Delayed Credit</span>, and <span class="literal">Delayed Charge</span>, respectively. Links to these types of transactions are established within the QuickBooks UI, only, and are available as read-only at the API level.
</li>
<li>
Links to payments applied to an Invoice object are returned in the response with <span class="literal">LinkedTxn.TxnType</span> set to <span class="literal">Payment</span>. Links to Payment transactions are established within the QuickBooks UI, only, and are available as read-only at the API level.
</li>
</ul>
Use <span class="literal">LinkedTxn.TxnId</span> as the ID in a separate read request for the specific resource to retrieve details of the linked object.
   */
  LinkedTxn?: Invoice_LinkedTxn[];
  /**
   * META: Optional
   *
   * DESCRIPTION: Account to which money is deposited. Query the Account name list resource to determine the appropriate Account object for this reference, where <span class="literal">Account.AccountType</span> is <span class="literal">Other Current Asset</span> or <span class="literal">Bank</span>. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">DepositToAccountRef.value</span> and <span class="literal">DepositToAccountRef.name</span>, respectively.
   * <br>Before you can use this field ensure that the company allows deposits in their invoices first. This can be found by querying the <a href="https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/preferences">Preferences endpoint</a>.  <span class="literal">SalesFormsPrefs.AllowDeposit</span> must be equal to true. If you do not specify this account the payment is applied to the Undeposited Funds account.
   */
  DepositToAccountRef?: ReferenceType;
  /**
   * META: Optional ,
   *
   * DESCRIPTION: Method in which tax is applied. Allowed values are:
   * <span class="literal">TaxExcluded</span>,
<span class="literal">TaxInclusive</span>, and
<span class="literal">NotApplicable</span>.
   */
  GlobalTaxCalculation?: "TaxExcluded" | "TaxInclusive" | "NotApplicable";
  /**
   * META: Optional ,
   *
   * DESCRIPTION: Specifies if this invoice can be paid with online bank transfers and corresponds to the <b>Free bank transfer</b> online payment check box on the QuickBooks UI. Active when <span class="literal">Preferences.SalesFormsPrefs.ETransactionPaymentEnabled</span> is set to <span class="literal">true</span>.
   * <li>If set to <span class="literal">true</span>, allow invoice to be paid with online bank transfers. The <b>Free bank transfer</b> online payment check box is checked on the QuickBooks UI for this invoice.</li>
<li>If set to <span class="literal">false</span>, online bank transfers are not allowed. The <b>Free bank transfer</b> online payment check box is not checked on the QuickBooks UI for this invoice.</li>
   */
  AllowOnlineACHPayment?: boolean;
  /**
   * META: Optional ,minorVersion: 4 ,
   *
   * DESCRIPTION: The account location. For France locale valid values include:
   * <ul><li><span class="literal">WithinFrance</span></li>
<li><span class="literal">FranceOverseas</span></li>
<li><span class="literal">OutsideFranceWithEU</span></li>
<li><span class="literal">OutsideEU</span></li></ul>
For UAE, valid values include <ul><li><span class="literal">ABUDHABI</span></li>
<li><span class="literal">AJMAN</span></li>
<li><span class="literal">SHARJAH</span></li>
<li><span class="literal">DUBAI</span></li>
<li><span class="literal">FUJAIRAH</span></li>
<li><span class="literal">RAS_AL_KHAIMAH</span></li>
<li><span class="literal">UMM_AL_QUWAIN</span></li>
<li><span class="literal">OTHER_GCC</span></li>
</ul>
For India locale, use state code values from the list below:
   */
  TransactionLocationType?: string;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: Date when the payment of the transaction is due. If date is not provided, the number of days specified in
   * <span class="literal">SalesTermRef</span> added the transaction date will be used.
   */
  DueDate?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: Optional ,max character: max of 4000 chars
   *
   * DESCRIPTION: User entered, organization-private note about the transaction. This note does not appear on the invoice to the customer. This field maps to the Statement Memo field on the Invoice form in the QuickBooks Online UI.
   */
  PrivateNote?: string;
  /**
   * META: Optional ,minorVersion: 8
   *
   * DESCRIPTION: Identifies the carbon copy e-mail address where the invoice is sent. If not specified, this field is populated from that defined in <span class="literal">Preferences.SalesFormsPrefs.SalesEmailCc</span>. If this email address is invalid, carbon copy email is not sent.
   */
  BillEmailCc?: EmailAddress;
  /**
   * META: Optional
   *
   * DESCRIPTION: User-entered message to the customer; this message is visible to end user on their transactions.
   */
  CustomerMemo?: MemoRef;
  /**
   * META: Optional
   *
   * DESCRIPTION: Email status of the invoice.
   * Valid values:
<span class="literal">NotSet</span>,
<span class="literal">NeedToSend</span>,
<span class="literal">EmailSent
</span>
   */
  EmailStatus?: string;
  /**
   * META: Optional ,minorVersion: 69
   *
   * DESCRIPTION: Reference to the <span class="literal">Project</span> ID associated with this transaction. Available with Minor Version 69 and above
   */
  ProjectRef?: ReferenceType;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The number of home currency units it takes to equal one unit of currency specified by <span class="literal">CurrencyRef</span>. Applicable if multicurrency is enabled for the company.
   */
  ExchangeRate?: number;
  /**
   * META: Optional ,
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The deposit made towards this invoice.
   */
  Deposit?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: This data type provides information for taxes charged on the transaction as a whole. It captures the details sales taxes calculated for the transaction based on the tax codes referenced by the transaction. This can be calculated by QuickBooks business logic or you may supply it when adding a transaction. See <a href="https://developer.intuit.com/app/developer/qbo/docs/workflows/manage-sales-tax-for-non-us-locales" title="Global Tax Model">Global tax model</a> for more information about this element.
   * <br>If sales tax is disabled (<span class="literal">Preferences.TaxPrefs.UsingSalesTax</span> is set to <span class="literal">false</span>) then <span class="literal">TxnTaxDetail</span> is ignored and not stored.
   */
  TxnTaxDetail?: TxnTaxDetail;
  /**
   * META: Optional ,
   *
   * DESCRIPTION: Specifies if online credit card payments are allowed for this invoice and corresponds to the <b>Cards</b> online payment check box on the QuickBooks UI. Active when <span class="literal">Preferences.SalesFormsPrefs.ETransactionPaymentEnabled</span> is set to <span class="literal">true</span>.
   * <li>If set to <span class="literal">true</span>, allow invoice to be paid with online credit card payments. The <b>Cards</b> online payment check box is checked on the QuickBooks UI.</li>
<li>If set to <span class="literal">false</span>, online credit card payments are not allowed. The <b>Cards</b> online payment check box is not checked on the QuickBooks UI.</li>
   */
  AllowOnlineCreditCardPayment?: boolean;
  /**
   * META: Optional
   *
   * DESCRIPTION: One of, up to three custom fields for the transaction. Available for custom fields so configured for the company. Check <span class="literal">Preferences.SalesFormsPrefs.CustomField</span> and <span class="literal">Preferences.VendorAndPurchasesPrefs.POCustomField</span> for custom fields currenly configured. <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/create-custom-fields" title="Custom Fields">Click here</a> to learn about managing custom fields.
   */
  CustomField?: CustomField[];
  /**
   * META: Optional
   *
   * DESCRIPTION: Identifies the address where the goods must be shipped. If
   * <span class="literal">ShipAddr</span>is not specified, and a default
<span class="literal">Customer:ShippingAddr</span> is specified in QuickBooks for this customer, the default ship-to address will be used by QuickBooks. <br> For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country. <br> If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:<p></p><ul><li><span class="literal">Line1</span> and <span class="literal">Line2</span> elements are populated with the customer name and company name.</li><li>Original <span class="literal">Line1</span> through <span class="literal">Line 5</span> contents, <span class="literal">City</span>, <span class="literal">SubDivisionCode</span>, and <span class="literal">PostalCode</span> flow into <span class="literal">Line3</span> through <span class="literal">Line5</span>as a free format strings.</li></ul>
   */
  ShipAddr?: PhysicalAddress;
  /**
   * META: Optional
   *
   * DESCRIPTION: A reference to a Department object specifying the location of the transaction. Available if <span class="literal">Preferences.AccountingInfoPrefs.TrackDepartments</span> is set to <span class="literal">true</span>.
   * <br>Query the Department name list resource to determine the appropriate department object for this reference. Use <span class="literal">Department.Id</span> and <span class="literal">Department.Name</span> from that object for <span class="literal">DepartmentRef.value</span> and <span class="literal">DepartmentRef.name</span>, respectively.
   */
  DepartmentRef?: ReferenceType;
  /**
   * META: Optional ,minorVersion: 8
   *
   * DESCRIPTION: Identifies the blind carbon copy e-mail address where the invoice is sent. If not specified, this field is populated from that defined in <span class="literal">Preferences.SalesFormsPrefs.SalesEmailBcc</span>. If this email address is invalid, blind carbon copy email is not sent.
   */
  BillEmailBcc?: EmailAddress;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the ShipMethod associated with the transaction. There is no shipping method list. Reference resolves to a string. Reference to the ShipMethod associated with the transaction. There is no shipping method list. Reference resolves to a string.
   */
  ShipMethodRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Bill-to address of the Invoice. If
   * <span class="literal">BillAddr</span>is not specified, and a default
<span class="literal">Customer:BillingAddr</span> is specified in QuickBooks for this customer, the default bill-to address is used by QuickBooks. <br> For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country. <br> If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:<p></p><ul><li><span class="literal">Line1</span> and <span class="literal">Line2</span> elements are populated with the customer name and company name.</li><li>Original <span class="literal">Line1</span> through <span class="literal">Line 5</span> contents, <span class="literal">City</span>, <span class="literal">SubDivisionCode</span>, and <span class="literal">PostalCode</span> flow into <span class="literal">Line3</span> through <span class="literal">Line5</span>as a free format strings.</li></ul>

Starting <span class="literal">minorversion=54</span> if you update the <span class="literal">CustomerRef</span>, the address passed using <span class="literal">BillAddr</span> will be honored.
   */
  BillAddr?: PhysicalAddress;
  /**
   * META: Optional ,
   *
   * DESCRIPTION: If false or null, calculate the sales tax first, and then apply the discount. If true, subtract the discount first and then calculate the sales tax.
   */
  ApplyTaxAfterDiscount?: boolean;
  /**
   * META: read only ,minorVersion: 3
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Convenience field containing the amount in <span class="literal">Balance</span> expressed in terms of the home currency. Calculated by QuickBooks business logic.
   * Value is valid only when <span class="literal">CurrencyRef</span> is specified and available when endpoint is evoked with the <span class="literal">minorversion=3</span> query parameter. Applicable if multicurrency is enabled for the company
   */
  readonly HomeBalance?: number;
  /**
   * META: read only
   *
   * DESCRIPTION: Email delivery information. Returned when a request has been made to deliver email with the send operation.
   */
  readonly DeliveryInfo?: DeliveryInfo;
  /**
   * META: read only ,system defined
   *
   * ADDON: Big Decimal
   *
   * DESCRIPTION: Indicates the total amount of the transaction. This includes the total of all the charges, allowances, and taxes. Calculated by QuickBooks business logic; any value you supply is over-written by QuickBooks.
   */
  readonly TotalAmt?: number;
  /**
   * META: read only ,minorVersion: 36 ,system defined
   *
   * DESCRIPTION: Sharable link for the invoice sent to external customers. The link is generated only for invoices with online payment enabled and having a valid customer email address. Include query param `include=invoiceLink` to get the link back on query response.
   */
  readonly InvoiceLink?: string;
  /**
   * META: read only ,minorVersion: 52
   *
   * DESCRIPTION: A reference to the Recurring Transaction. It captures what recurring transaction template the <span class="literal">Invoice</span> was created from.
   */
  readonly RecurDataRef?: ReferenceType;
  /**
   * META: read only ,minorVersion: 21 ,system defined
   *
   * DESCRIPTION: Reference to the <span class="literal">TaxExepmtion</span> ID associated with this object. Available for companies that have <a href="https://developer.intuit.com/hub/blog/2017/12/11/using-quickbooks-online-api-automated-sales-tax" title="Automatic Sales Tax">automated sales tax</a> enabled.
   * <li><span class="literal">TaxExemptionRef.Name</span>: The Tax Exemption Id for the customer to which this object is associated. This Id is typically issued by the state.</li>
<li><span class="literal">TaxExemptionRef.value</span>: The system-generated Id of the exemption type.</li>

 For internal use only
   */
  readonly TaxExemptionRef?: ReferenceType;
  /**
   * META: read only
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The balance reflecting any payments made against the transaction. Initially set to the value of
   * <span class="literal">TotalAmt</span>. A Balance of 0 indicates the invoice is fully paid. Calculated by QuickBooks business logic; any value you supply is over-written by QuickBooks. If you process a linked transaction against a specific transaction, the 
<span class="literal">balance</span> value won't change. It will remain the same.
   */
  readonly Balance?: number;
  /**
   * META: read only ,system defined
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Total amount of the transaction in the home currency. Includes the total of all the charges, allowances and taxes. Calculated by QuickBooks business logic.
   * Value is valid only when <span class="literal">CurrencyRef</span> is specified. Applicable if multicurrency is enabled for the company.
   */
  readonly HomeTotalAmt?: number;
  /**
   * META: system defined
   *
   * DESCRIPTION: Denotes how <span class="literal">ShipAddr</span> is stored:&nbsp;formatted or unformatted. The value of this flag is system defined based on format of shipping address at object create time.<ul><li>If set to <span class="literal">false</span>, shipping address is returned in a formatted style using City, Country,&nbsp;CountrySubDivisionCode, Postal code.</li><li>If set to <span class="literal">true</span>, shipping address is returned in an unformatted style using Line1 through Line5 attributes.</li></ul>
   */
  FreeFormAddress?: boolean;
  /**
   * META: deprecated
   *
   * DESCRIPTION: Deprecated flag to allow online payments. In use before <span class="literal">AllowOnlineCreditCardPayment</span> and <span class="literal">AllowOnlineACHPayment</span> flags existed and provided to maintain backward compatibility.
   * <li>If set to <span class="literal">true</span>, this invoice was created before <span class="literal">AllowOnlinePayment</span> was deprecated and denotes both CC and ACH payments are allowed. In addition, the <span class="literal">AllowOnlineCreditCardPayment</span> and <span class="literal">AllowOnlineACHPayment</span> flags must be set to <span class="literal">true</span>.</li>
<li>If set to <span class="literal">false</span>, this invoice was created after the <span class="literal">AllowOnlinePayment</span> flag was deprecated and is not used.</li>
 Do not modify.
   */
  AllowOnlinePayment?: boolean;
  /**
   * META: deprecated
   *
   * DESCRIPTION: Flag to allow payments from legacy Intuit Payment Network (IPN). Provided to maintain backward compatibility and must always be set to <span class="literal">false</span>. Do not modify
   */
  AllowIPNPayment?: boolean;
  /**
   * DESCRIPTION: If true, only fields specified will be updated
   */
  sparse?: boolean;
}

export interface Item {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * ADDON: Id Type
   *
   * DESCRIPTION: Unique Identifier for an Intuit entity (object).
   * Required for the update operation.
   */
  readonly Id?: number;
  /**
   * META: * Required ,minorVersion: 3 ,
   *
   * DESCRIPTION: Classification that specifies the use of this item. Applicable for France companies, only. Available when endpoint is evoked with the <span class="literal">minorversion=3</span> query parameter.
   * Read-only after object is created.
Valid values include:
<span class="literal">Product</span> and <span class="literal">Service</span>.
   */
  ItemCategoryType: string;
  /**
   * META: * Required ,max character: maximum of 100 chars
   *
   * DESCRIPTION: Name of the item. This value is unique.
   */
  Name: string;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the entity.
   * Required for the update operation.
   */
  readonly SyncToken?: string;
  /**
   * META: * Conditionally required ,
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: Date of opening balance for the inventory transaction.
   * For read operations, the date returned in this field is always the originally provided inventory start date.
For update operations, the date supplied is interpreted as the inventory adjust date, is stored as such in the underlying data model, and is reflected in the QuickBooks Online UI for the object. The inventory adjust date is not exposed for read operations through the API. Required for <span class="literal">Inventory</span> type items.
   */
  InvStartDate?: string;
  /**
   * META: * Conditionally required ,  ,minorVersion: specified.
   *
   * DESCRIPTION: Classification that specifies the use of this item. See the description at the top of the Item entity page for details about supported item types.
   * For requests with minor versions earlier than 4 specified, this field is read-only and system-defined as follows:
<li><span class="literal">Inventory</span>--Default setting when <span class="literal">TrackQtyOnHand</span>, <span class="literal">InvStartDate</span>, and <span class="literal">AssetAccountRef</span> are specified. Used for goods the company sells and buys that are tracked as inventory. </li>
<li><span class="literal">Service</span>--Default setting when <span class="literal">TrackQtyOnHand</span>, <span class="literal">InvStartDate</span>, and <span class="literal">AssetAccountRef</span> are not specified. Used for non-tangible goods the company sells and buys that are not tracked as inventory. For example, specialized labor, consulting hours, and professional fees.</li>

For requests with minor version=4 query parameter, this field is required to be explicitly set with one of the following:
<li><span class="literal">Inventory</span>--Used for goods the company sells and buys that are tracked as inventory. </li>
<li><span class="literal">Service</span>--Used for non-tangible goods the company sells and buys that are not tracked as inventory. For example, specialized labor, consulting hours, and professional fees.</li>
<li><span class="literal">NonInventory</span>--Use for goods the company sells and buys that are not tracked as inventory. For example, office supplies or goods bought on behalf of the customer.</li>

When querying Item objects with minor versions earlier than 4 specified, <span class="literal">NonInventory</span> types are returned as type <span class="literal">Service</span>.
For French locales, <span class="literal">Type</span> is tied with <span class="literal">ItemCategoryType</span>: if <span class="literal">ItemCategoryType</span> is set to <span class="literal">Service</span>, then <span class="literal">Type</span> is set to <span class="literal">Service</span>, if <span class="literal">ItemCategoryType</span> is <span class="literal">Product</span>, then <span class="literal">Type</span> is set to <span class="literal">NonInventory</span>. &gt;Required when minor version 4 is specified.
   */
  Type?: string;
  /**
   * META: * Conditionally required ,
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Current quantity of the <span class="literal">Inventory</span> items available for sale. Not used for <span class="literal">Service</span> or <span class="literal">NonInventory</span> type items.Required for <span class="literal">Inventory</span> type items.
   */
  QtyOnHand?: number;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Reference to the Inventory Asset account that tracks the current value of the inventory. If the same account is used for all inventory items, the current balance of this account will represent the current total value of the inventory. Query the Account name list resource to determine the appropriate Account object for this reference. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">AssetAccountRef.value</span> and <span class="literal">AssetAccountRef.name</span>, respectively. Required for <span class="literal">Inventory</span> item types.
   */
  AssetAccountRef?: ReferenceType;
  /**
   * META: Optional ,max character: maximum of 100 chars ,minorVersion: 4
   *
   * DESCRIPTION: The stock keeping unit (SKU) for this Item. This is a company-defined identifier for an item or product used in tracking inventory.
   */
  Sku?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: True if the sales tax is included in the item amount, and therefore is not calculated for the transaction.
   */
  SalesTaxIncluded?: boolean;
  /**
   * META: Optional
   *
   * DESCRIPTION: True if there is quantity on hand to be tracked. Once this value is true, it cannot be updated to false. Applicable for items of type <span class="literal">Inventory</span>.
   *  Not applicable for <span class="literal">Service</span> or <span class="literal">NonInventory</span> item types.
   */
  TrackQtyOnHand?: boolean;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the sales tax code for the Sales item. Applicable to Service and Sales item types only. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use <span class="literal">TaxCode.Id</span> and <span class="literal">TaxCode.Name</span> from that object for <span class="literal">SalesTaxCodeRef.value</span> and <span class="literal">SalesTaxCodeRef.name</span>, respectively.
   */
  SalesTaxCodeRef?: ReferenceType;
  /**
   * META: Optional ,minorVersion: 41
   *
   * DESCRIPTION: Reference to the Class for the item. Query the Class name list resource to determine the appropriate object for this reference. Use <span class="literal">Class.Id</span> and <span class="literal">Class.Name</span> from that object for <span class="literal">ClassRef.value</span> and <span class="literal">ClassRef.name</span>, respectively.
   */
  ClassRef?: ReferenceType;
  /**
   * META: Optional ,minorVersion: 59
   *
   * DESCRIPTION: The Source type of the transactions created by QuickBooks Commerce. Valid values include: <span class="literal">QBCommerce</span>
   */
  Source?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: True if the purchase tax is included in the item amount, and therefore is not calculated for the transaction.
   */
  PurchaseTaxIncluded?: boolean;
  /**
   * META: Optional ,max character: maximum of 4000 chars
   *
   * DESCRIPTION: Description of the item.
   */
  Description?: string;
  /**
   * META: Optional ,minorVersion: 3 ,
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Sales tax abatement rate for India locales.
   */
  AbatementRate?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: If true, this is a sub item. If false or null, this is a top-level item.
   * Creating inventory hierarchies with traditional inventory items is being phased out in lieu of using categories and sub categories.
   */
  SubItem?: boolean;
  /**
   * META: Optional ,
   *
   * DESCRIPTION: If true, transactions for this item are taxable. Applicable to US companies, only.
   */
  Taxable?: boolean;
  /**
   * META: Optional ,max character: maximum of 25 chars ,minorVersion: 33 ,
   *
   * DESCRIPTION: Text to be displayed on customer's invoice to denote the Unit of Measure (instead of the standard code).
   */
  UQCDisplayText?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The minimum quantity of a particular inventory item that you need to restock at any given time. The ReorderPoint value cannot be set to null for sparse updates(sparse=true). It can be set to null only for full updates.
   */
  ReorderPoint?: number;
  /**
   * META: Optional ,max character: Max 1000 chars
   *
   * DESCRIPTION: Purchase description for the item.
   */
  PurchaseDesc?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the entity. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: Optional ,minorVersion: 31
   *
   * DESCRIPTION: Reference to the preferred vendor of this item. Query the Vendor name list resource to determine the appropriate object for this reference. Use <span class="literal">Vendor.Id</span> and <span class="literal">Vendor.Name</span> from that object for <span class="literal">ParentRef.value</span> and <span class="literal">ParentRef.name</span>, respectively.
   */
  PrefVendorRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: If true, the object is currently enabled for use by QuickBooks.
   */
  Active?: boolean;
  /**
   * META: Optional ,minorVersion: 33 ,
   *
   * DESCRIPTION: Id of Standard Unit of Measure (UQC:Unique Quantity Code) of the item according to GST rule.  UQCId should be one of the following ids:
   */
  UQCId?: string;
  /**
   * META: Optional ,minorVersion: 3 ,
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Sales tax reverse charge rate for India locales.
   */
  ReverseChargeRate?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the purchase tax code for the item. Applicable to Service, Other Charge, and Product (Non-Inventory) item types. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use <span class="literal">TaxCode.Id</span> and <span class="literal">TaxCode.Name</span> from that object for <span class="literal">PurchaseTaxCodeRef.value</span> and <span class="literal">PurchaseTaxCodeRef.name</span>, respectively.
   */
  PurchaseTaxCodeRef?: ReferenceType;
  /**
   * META: Optional ,minorVersion: 3 ,
   *
   * DESCRIPTION: Sales tax service type for India locales.
   */
  ServiceType?: string;
  /**
   * META: Optional ,max character: Maximum of 99999999999
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Amount paid when buying or ordering the item, as expressed in the home currency.
   */
  PurchaseCost?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: The immediate parent of the sub item in the hierarchical Item:SubItem list. If SubItem is true, then ParenRef is required. If SubItem is true, then ParenRef is required. Query the Item name list resource to determine the appropriate object for this reference. Use <span class="literal">Item.Id</span> and <span class="literal">Item.Name</span> from that object for <span class="literal">ParentRef.value</span> and <span class="literal">ParentRef.name</span>, respectively.
   */
  ParentRef?: ReferenceType;
  /**
   * META: Optional ,max character: maximum of 99999999999
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Corresponds to the Price/Rate column on the QuickBooks Online UI to specify either unit price, a discount, or a tax rate for item.
   * If used for unit price, the monetary value of the service or product, as expressed in the home currency.
If used for a discount or tax rate, express the percentage as a fraction. For example, specify <span class="literal">0.4</span> for 40% tax.
   */
  UnitPrice?: number;
  /**
   * META: read only ,system defined
   *
   * DESCRIPTION: Fully qualified name of the entity. The fully qualified name prepends the topmost parent, followed by each sub element separated by colons. Takes the form of
   * <span class="literal">Item:SubItem</span>. Returned from an existing object and not input on a new object.Limited to 5 levels.
   */
  readonly FullyQualifiedName?: string;
  /**
   * DESCRIPTION: Reference to the expense account used to pay the vendor for this item. Must be an account with account type of <span class="literal">Cost of Goods Sold</span>. Query the Account name list resource to determine the appropriate Account object for this reference. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">ExpenseAccountRef.value</span> and <span class="literal">ExpenseAccountRef.name</span>, respectively.
   * For France locales:
<li>This is an optional field.</li>
<li>This is the purchase account id, If not provided it defaults to the default purchase account: 605100 and 601100 are the default expense accounts used for <span class="literal">Service</span> and <span class="literal">Product</span> type of item, respectively.</li>

 Required for <span class="literal">Inventory</span>, <span class="literal">NonInventory</span>, and <span class="literal">Service</span> item types
   */
  ExpenseAccountRef?: ReferenceType;
  /**
   * META: read only ,system defined
   *
   * ADDON: Integer
   *
   * DESCRIPTION: Specifies the level of the hierarchy in which the entity is located. Zero specifies the top level of the hierarchy; anything above will be the next level with respect to the parent. Limited to 5 levels.
   */
  readonly Level?: number;
  /**
   * META: * Conditionally Required
   *
   * DESCRIPTION: Reference to the posting account, that is, the account that records the proceeds from the sale of this item. Must be an account with account type of <span class="literal">Sales of Product Income</span>. Query the Account name list resource to determine the appropriate Account object for this reference. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">IncomeAccountRef.value</span> and <span class="literal">IncomeAccountRef.name</span>, respectively.For France locales: <li>This is an optional field.</li>
   * <li>This is the sales account id, If not provided it defaults to the default sales account: 706100 and 707100 are the default expense accounts used for <span class="literal">Service</span> and <span class="literal">Product</span> type of item, respectively.</li>

 required for <span class="literal">Inventory</span> and <span class="literal">Service</span> item types
   */
  IncomeAccountRef?: ReferenceType;
  /**
   * META: minorVersion: 34
   *
   * DESCRIPTION: Tax classification segregates different items into different classifications and the tax classification is one of the key parameters to determine appropriate tax on transactions involving items. Tax classifications are sourced by either tax governing authorities as in India/Malaysia or externally like Exactor. 'Fuel', 'Garments' and 'Soft drinks' are a few examples of tax classification in layman terms. User can choose a specific tax classification for an item while creating it. A level 1 tax classification cannot be associated to an Item.
   */
  TaxClassificationRef?: ReferenceType;
}

export interface JournalCode {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * ADDON: Id Type
   *
   * DESCRIPTION: Unique Identifier for an Intuit entity (object).
   * Required for the update operation.
   */
  readonly Id?: number;
  /**
   * META: * Required ,max character: 2 to 20 characters in length
   *
   * DESCRIPTION: A name representing the journal code.
   */
  Name: string;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the entity.
   * Required for the update operation.
   */
  readonly SyncToken?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: A free-form description of the journal code.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: One of, up to three custom fields for the transaction. Available for custom fields so configured for the company. Check <span class="literal">Preferences.SalesFormsPrefs.CustomField</span> and <span class="literal">Preferences.VendorAndPurchasesPrefs.POCustomField</span> for custom fields currenly configured. <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/create-custom-fields" title="Custom Fields">Click here</a> to learn about managing custom fields.
   */
  CustomField?: CustomField[];
  /**
   * META: Optional
   *
   * DESCRIPTION: The type of this journal code. The value cannot be changed once the object is created. Valid types include:
   * <span class="literal">Expenses</span>
<span class="literal">Sales</span>
<span class="literal">Bank</span>
<span class="literal">Nouveaux</span>
<span class="literal">Wages</span>
<span class="literal">Cash</span>
<span class="literal">Others</span>
   */
  Type?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the entity. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
}

export interface JournalEntry_Line_JournalEntryLineDetail_Entity {
  /**
   * META: * Required
   *
   * DESCRIPTION: Query the corresponding name list resource as specified by <span class="literal">Entity</span> to determine the appropriate object for this reference. Use the <span class="literal">Id</span> and <span class="literal">DisplayName
   * </span> values from that object for <span class="literal">EntityRef.value</span> and <span class="literal">EntityRef.name</span>, respectively.
   */
  EntityRef: ReferenceType;
  /**
   * DESCRIPTION: Object type. Output only. Valid values are <span class="literal">Vendor</span>, <span class="literal">Employee</span>, or <span class="literal">Customer</span>.
   */
  Type?: "Vendor" | "Employee" | "Customer";
}

export interface JournalEntry_Line_JournalEntryLineDetail {
  /**
   * META: * Required ,minorVersion: 5 ,
   *
   * DESCRIPTION: For France locales, only. Reference to a JournalCode object. This must be present for both <span class="literal">Credit</span> and <span class="literal">Debit</span> posting sides of the JournalEntry object. Query the JournalCode name list resource to determine the appropriate JournalCode object for this reference. Use <span class="literal">JournalCode.Id</span> and <span class="literal">JournalCode.Name</span> from that object for <span class="literal">JournalCodeRef.value</span> and <span class="literal">JournalCodeRef.name</span>, respectively.
   */
  JournalCodeRef: ReferenceType;
  /**
   * META: * Required
   *
   * DESCRIPTION: Indicates whether this JournalEntry line is a debit or credit. Valid values: <span class="literal">Credit</span>, <span class="literal">Debit</span>
   */
  PostingType: "Credit" | "Debit";
  /**
   * META: * Required
   *
   * DESCRIPTION: Reference to the account associated with this line. Query the Account name list resource to determine the appropriate Account object for this reference, based on the side of the journal entry represented by this line. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">AccountRef.value</span> and <span class="literal">AccountRef.name</span>, respectively.
   * For France locales: The account associated with the referenced Account object is looked up in the account category list.
<li>If this account has same location as specified in the transaction by the <span class="literal">TransactionLocationType</span> attribute and the same VAT as in the line item <span class="literal">TaxCodeRef</span> attribute, then this account is used.</li>
<li>If there is a mismatch, then the account from the account category list that matches the transaction location and VAT is used.</li>
<li>If this account is not present in the account category list, then a new account is created with the new location, new VAT code, and all other attributes as in the default account.</li>
   */
  AccountRef: ReferenceType;
  /**
   * META: * Conditionally required ,  ,
   *
   * DESCRIPTION: Indicates whether the tax applicable on the line is sales or purchase.
   * Valid value:
<span class="literal">Sales</span>,
<span class="literal">Purchase</span>. Required if <span class="literal">TaxCodeRef</span> is specified
   */
  TaxApplicableOn?: "Sales" | "Purchase" | "TaxCodeRef";
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: When you use <span class="literal">Accounts Receivable</span>, you must choose a <span class="literal">customer</span> in the Name field.
   * When you use <span class="literal">Accounts Payable</span>, you must choose a <span class="literal">supplier/vendor</span> in the Name field.
   */
  Entity?: JournalEntry_Line_JournalEntryLineDetail_Entity;
  /**
   * META: Optional ,minorVersion: 53 ,
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The total amount of the line items including tax.
   * Constraints: Available when endpoint is evoked with the <span class="literal">minorversion=1</span>query parameter.
   */
  TaxInclusiveAmt?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the Class associated with the transaction. Available if <span class="literal">Preferences.AccountingInfoPrefs.ClassTrackingPerTxn</span> is set to <span class="literal">true</span>. Query the Class name list resource to determine the appropriate Class object for this reference. Use <span class="literal">Class.Id</span> and <span class="literal">Class.Name</span> from that object for <span class="literal">ClassRef.value</span> and <span class="literal">ClassRef.name</span>, respectively.
   */
  ClassRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: A reference to a Department object specifying the location of the transaction. Available if <span class="literal">Preferences.AccountingInfoPrefs.TrackDepartments</span> is set to <span class="literal">true</span>.
   * <br>Query the Department name list resource to determine the appropriate department object for this reference. Use <span class="literal">Department.Id</span> and <span class="literal">Department.Name</span> from that object for <span class="literal">DepartmentRef.value</span> and <span class="literal">DepartmentRef.name</span>, respectively.
   */
  DepartmentRef?: ReferenceType;
  /**
   * META: Optional ,
   *
   * DESCRIPTION: Reference to the <span class="literal">TaxCode</span>for this item. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use <span class="literal">TaxCode.Id</span> and <span class="literal">TaxCode.Name</span> from that object for <span class="literal">TaxCodeRef.value</span> and <span class="literal">TaxCodeRef.name</span>, respectively.
   */
  TaxCodeRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: The billable status of the journal entry line. The line is to be billed to a customer if the account is an expense account and <span class="literal">EntityRef</span> specifies a Customer object.
   * Valid values:
<span class="literal">Billable</span>,
<span class="literal">NotBillable</span>,
<span class="literal">HasBeenBilled</span>
   */
  BillableStatus?: "EntityRef" | "Billable" | "NotBillable" | "HasBeenBilled";
  /**
   * META: max character: Min: 0, Max:999999999 ,
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Tax amount of the line.
   */
  TaxAmount?: number;
}

export interface JournalEntry_Line_JournalEntryLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item.
   * In requests, if <span class="literal">Id</span> matches that for an existing line in the transaction the line is updated. Otherwise, a new line is created. Integer as string.
   */
  readonly Id?: string;
  /**
   * META: * Required
   */
  JournalEntryLineDetail: JournalEntry_Line_JournalEntryLineDetail;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">JournalEntryLineDetail</span>for this type of line.
   */
  DetailType: "JournalEntryLineDetail";
  /**
   * META: * Required ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   */
  Amount: number;
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional ,minorVersion: 69
   *
   * DESCRIPTION: Reference to the <span class="literal">Project</span> ID associated with this transaction. Available with Minor Version 69 and above
   */
  ProjectRef?: ReferenceType;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer
   */
  LineNum?: number;
}

export interface JournalEntry_Line_DescriptionOnlyLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the transaction, the request is considered an update operation for the description line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the transaction then the request is considered a create operation for the description line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">DescriptionOnly</span>for this type of line.
   */
  DetailType: "DescriptionOnly";
  /**
   * META: * Required
   */
  DescriptionLineDetail: DescriptionLineDetail;
  /**
   * META: Optional ,max character: max 4000 chars
   *
   * DESCRIPTION: A string representing one of the following:
   * <li>
Free form text description of the line item that appears in the printed record.
</li>
<li>
A subtotal line inline with other lines on the sales form and holds the sum of amounts on all lines above it. This is distinct from the overall transaction subtotal represented with a SubTotal detail line.
</li><li>
In create requests, set to <span class="literal">Subtotal:</span> (case sensitive) to create the subtotal line; the amount is generated by QuickBooks Online business logic.
</li>
<li>
In read requests, lines with <span class="literal">Subtotal: nn.nn</span> returned in this field denote subtotal lines in the object.
</li>
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer.
   */
  LineNum?: number;
  /**
   * META: read only ,minorVersion: 23
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item. Available when <span class="literal">Amount</span> is set via the QuickBooks UI. Returned only for Description Only line items that have a non-empty amount associated with them.
   */
  readonly Amount?: number;
}

export interface JournalEntry_TxnTaxDetail_TaxLine_Line {
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">TaxLineDetail</span>for this type of line.
   */
  DetailType: "TaxLineDetail";
  /**
   * META: * Required
   *
   * DESCRIPTION: <strong>TaxLineDetail</strong>
   */
  TaxLineDetail: TaxLineDetail;
  /**
   * META: Optional ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of tax for this tax line.  This value is negative for JournalEntry objects with <span class="literal">PostingType</span> set to <span class="literal">Credit.</span>
   */
  Amount?: number;
}

export interface JournalEntry {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object.
   * Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Individual line items of a transaction. There must be at least one pair of Journal Entry Line elements, representing a debit and a credit, called distribution lines. Valid <span class="literal">Line</span> types include:
   * <span class="literal">JournalEntryLine</span> and 
<span class="literal">DescriptionOnlyLine</span>
   */
  Line: (JournalEntry_Line_JournalEntryLine | JournalEntry_Line_DescriptionOnlyLine)[];
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Reference to the currency in which all amounts on the associated transaction are expressed. This must be defined if multicurrency is enabled for the company.
   * <br>Multicurrency is enabled for the company if <span class="literal">Preferences.MultiCurrencyEnabled</span> is set to <span class="literal">true</span>. Read more about multicurrency support <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/manage-multiple-currencies" title="Currency">here</a>. Required if multicurrency is enabled for the company
   */
  CurrencyRef?: CurrencyRefType;
  /**
   * META: Optional ,max character: Maximum of 21 chars
   *
   * DESCRIPTION: Reference number for the transaction.
   * Throws an error when duplicate DocNumber is sent in the request and if <span class="literal">Preferences:OtherPrefs:NameValue.Name = WarnDuplicateJournalNumber</span> is true. Recommended best practice: check the setting of <span class="literal">Preferences:OtherPrefs:NameValue.Name = WarnDuplicateJournalNumber</span> before setting DocNumber. If a duplicate DocNumber needs to be supplied, add the query parameter name/value pair, <span class="literal">include=allowduplicatedocnum</span> to the URI.
Sort order is ASC by default.
With this change V3 JournalEntry API will be supporting autoassign docNumber when null in the request only till <span class="literal">minorversion=53</span>.
Starting <span class="literal">minorversion=54</span> if null value is sent in the request null will be saved.
With <span class="literal">minorversion=54</span> if there is a need to support assigning a <span class="literal">docNumber</span> when null, it can be achieved through include param, <span class="literal">include=allowautodocnum</span>
   */
  DocNumber?: string;
  /**
   * META: Optional ,max character: Max of 4000 chars
   *
   * DESCRIPTION: User entered, organization-private note about the transaction.
   */
  PrivateNote?: string;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: The date entered by the user when this transaction occurred.
   * For posting transactions, this is the posting date that affects the financial statements. If the date is not supplied, the current date on the server is used.
Sort order is ASC by default.
   */
  TxnDate?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The number of home currency units it takes to equal one unit of currency specified by <span class="literal">CurrencyRef</span>. Applicable if multicurrency is enabled for the company.
   */
  ExchangeRate?: number;
  /**
   * META: Optional ,minorVersion: 49
   *
   * DESCRIPTION: Reference to the Tax Adjustment Rate Ids for this item. Query the TaxRate list resource to determine the appropriate TaxRate object for this reference. Use <span class="literal">TaxRate.Id</span> and <span class="literal">TaxRate.Name</span> from that object for TaxRateRef.value and TaxRateRef.name, respectively.
   */
  TaxRateRef?: ReferenceType;
  /**
   * META: Optional ,minorVersion: 4 ,
   *
   * DESCRIPTION: The account location. Valid values include:
   * <li><span class="literal">WithinFrance</span></li>
<li><span class="literal">FranceOverseas</span></li>
<li><span class="literal">OutsideFranceWithEU</span></li>
<li><span class="literal">OutsideEU</span></li>

For France locales, only.
   */
  TransactionLocationType?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: This data type provides information for taxes charged on the transaction as a whole. It captures the details sales taxes calculated for the transaction based on the tax codes referenced by the transaction. This can be calculated by QuickBooks business logic or you may supply it when adding a transaction. See <a href="https://developer.intuit.com/app/developer/qbo/docs/workflows/manage-sales-tax-for-non-us-locales" title="Global Tax Model">Global tax model</a> for more information about this element.
   * If sales tax is disabled (<span class="literal">Preferences.TaxPrefs.UsingSalesTax</span> is set to <span class="literal">false</span>) then <span class="literal">TxnTaxDetail</span> is ignored and not stored.
   */
  TxnTaxDetail?: TxnTaxDetail;
  /**
   * META: Optional ,minorVersion: 53 ,
   *
   * DESCRIPTION: Method in which tax is applied. Allowed values are:
   * <span class="literal">TaxExcluded</span>,
<span class="literal">TaxInclusive</span>
   */
  GlobalTaxCalculation?: "TaxExcluded" | "TaxInclusive";
  /**
   * META: Optional ,
   *
   * DESCRIPTION: Indicates the total amount of the transaction. This includes the total of all the charges, allowances, and taxes. By default, this is recalculated by the system based on sub-items total and overridden.
   */
  Adjustment?: boolean;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: read only ,minorVersion: 52
   *
   * DESCRIPTION: A reference to the Recurring Transaction. It captures what recurring transaction template the <span class="literal">JournalEntry</span> was created from.
   */
  readonly RecurDataRef?: ReferenceType;
  /**
   * META: read only ,system defined
   *
   * ADDON: Big Decimal
   *
   * DESCRIPTION: The value of this field will always be set to zero. Calculated by QuickBooks business logic; any value you supply is over-written by QuickBooks.
   */
  readonly TotalAmt?: number;
  /**
   * META: read only ,system defined
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The value of this field will always be set to zero. Applicable if multicurrency is enabled for the company.
   */
  readonly HomeTotalAmt?: number;
  /**
   * DESCRIPTION: If true, only fields specified will be updated
   */
  sparse?: boolean;
}

export interface Payment_Line_LinkedTxn {
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction Id of the related transaction.
   */
  TxnId: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction type of the linked object.
   */
  TxnType: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Required for Deposit and Bill entities. The line number of a specific line of the linked transaction. If supplied, the
   * <span class="literal">TxnId</span> and
<span class="literal">TxnType</span> attributes of the linked transaction must also be populated.
   */
  TxnLineId?: string;
}

export interface Payment_Line {
  /**
   * META: * Required ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   */
  Amount: number;
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction to which the current entity is related. For example, a billpayment line links to the originating bill object for which the billpayment is applied.
   */
  LinkedTxn: Payment_Line_LinkedTxn[];
}

export interface CreditChargeResponse {
  /**
   * META: Optional
   *
   * DESCRIPTION: Indicates the status of the payment transaction. Possible values include <span class="literal">Completed</span>, <span class="literal">Unknown</span>.
   */
  Status?: "Completed" | "Unknown";
  /**
   * META: Optional ,max character: maximum 100 characters
   *
   * DESCRIPTION: Code returned from the credit card processor to indicate that the charge will be paid by the card issuer.
   */
  AuthCode?: string;
  /**
   * META: Optional
   *
   * ADDON: Local time zone: YYYY-MM-DDTHH:MM:SS UTC: YYYY-MM-DDT HH :MM: SSZ Specific time zone: YYYY-MM-DDT HH :MM:SS +/- HH :MM
   *
   * DESCRIPTION: Timestamp indicating the time in which the card processor authorized the transaction.
   */
  TxnAuthorizationTime?: string;
  /**
   * META: Optional ,max character: maximum 100 characters
   *
   * DESCRIPTION: Unique identifier of the payment transaction. It can be used to track the status of transactions, or to search transactions.
   */
  CCTransId?: string;
}

export interface CreditChargeInfo {
  /**
   * META: Optional
   *
   * ADDON: Integer
   *
   * DESCRIPTION: Expiration Month on card, expressed as a number:
   * <span class="literal">1</span>=January,
<span class="literal">2</span>=February, etc.
   */
  CcExpiryMonth?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: -<span class="literal">false</span> or no value-Store credit card information only. Do not store QuickBooks Payment transaction information in CreditChargeResponse.
   * -<span class="literal">true</span>-Store credit card payment transaction information in CreditChargeResponse below. Use this setting when QuickBooks Payments is configured to process credit card charges.
   */
  ProcessPayment?: boolean;
  /**
   * META: Optional ,max character: maximum 30 characters
   *
   * DESCRIPTION: Credit card holder billing postal code. Five digits in the USA.
   */
  PostalCode?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount processed using the credit card.
   */
  Amount?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: Account holder name, as printed on the card.
   */
  NameOnAcct?: string;
  /**
   * META: Optional
   *
   * ADDON: Integer
   *
   * DESCRIPTION: Expiration Year on card, expressed as a 4 digit number
   * <span class="literal">1999</span>, <span class="literal">2003</span>, etc.
   */
  CcExpiryYear?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: Type of credit card. For example, MasterCard, Visa, Discover, American Express, and so on.
   */
  Type?: string;
  /**
   * META: Optional ,max character: maximum 255 characters
   *
   * DESCRIPTION: Credit card holder billing address of record: the street address to which credit card statements are sent.
   */
  BillAddrStreet?: string;
}

export interface CreditCardPayment {
  /**
   * META: Optional
   *
   * DESCRIPTION: Holds credit-card transaction response information from a merchant account service.
   */
  CreditChargeResponse?: CreditChargeResponse;
  /**
   * META: Optional
   *
   * DESCRIPTION: Holds creditcard information to request a credit card payment from a merchant account service.
   */
  CreditChargeInfo?: CreditChargeInfo;
}

export interface Payment {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object.
   * Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Indicates the total amount of the transaction. This includes the total of all the charges, allowances, and taxes. If you process a linked refund transaction against a specific transaction, the 
   * <span class="literal">totalAmt</span> value won't change. It will remain the same. However, voiding the linked refund will change the 
<span class="literal">totalAmt</span> value to O.
   */
  TotalAmt: number;
  /**
   * META: * Required
   *
   * DESCRIPTION: Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use <span class="literal">Customer.Id</span> and <span class="literal">Customer.DisplayName</span> from that object for <span class="literal">CustomerRef.value</span> and <span class="literal">CustomerRef.name</span>, respectively.
   */
  CustomerRef: ReferenceType;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Reference to the currency in which all amounts on the associated transaction are expressed. This must be defined if multicurrency is enabled for the company.
   * <br>Multicurrency is enabled for the company if <span class="literal">Preferences.MultiCurrencyEnabled</span> is set to <span class="literal">true</span>. Read more about multicurrency support <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/manage-multiple-currencies" title="Currency">here</a>. Required if multicurrency is enabled for the company.
   */
  CurrencyRef?: CurrencyRefType;
  /**
   * META: Optional ,max character: Max of 4000 chars
   *
   * DESCRIPTION: User entered, organization-private note about the transaction.
   */
  PrivateNote?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to a PaymentMethod associated with this transaction. Query the PaymentMethod name list resource to determine the appropriate PaymentMethod object for this reference. Use <span class="literal">PaymentMethod.Id</span> and <span class="literal">PaymentMethod.Name</span> from that object for <span class="literal">PaymentMethodRef.value</span> and <span class="literal">PaymentMethodRef.name</span>, respectively.
   */
  PaymentMethodRef?: ReferenceType;
  /**
   * META: Optional ,read only
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Indicates the amount that has not been applied to pay amounts owed for sales transactions.
   */
  readonly UnappliedAmt?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: Identifies the account to be used for this payment. Query the Account name list resource to determine the appropriate Account object for this reference, where <span class="literal">Account.AccountType</span> is <span class="literal">Other Current Asset</span> or <span class="literal">Bank</span>. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">DepositToAccountRef.value</span> and <span class="literal">DepostiToAccountRef.name</span>, respectively.
   * <br>If you do not specify this account, payment is applied to the Undeposited Funds account.
   */
  DepositToAccountRef?: ReferenceType;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The number of home currency units it takes to equal one unit of currency specified by <span class="literal">CurrencyRef</span>. Applicable if multicurrency is enabled for the company
   */
  ExchangeRate?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: Zero or more transactions accounting for this payment. Values for
   * <span class="literal">Line.LinkedTxn.TxnType</span>can be one of the following:
<li>
<span class="literal">Expense</span>--Payment is reimbursement for expense paid by cash made on behalf of the customer
</li>
<li>
<span class="literal">Check</span>--Payment is reimbursement for expense paid by check made on behalf of the customer
</li>
<li>
<span class="literal">CreditCardCredit</span>--Payment is reimbursement for a credit card credit made on behalf of the customer
</li>
<li>
<span class="literal">JournalEntry</span>--Payment is linked to the representative journal entry
</li>
<li>
<span class="literal">CreditMemo</span>--Payment is linked to the credit memo the customer has with the business
</li>
<li>
<span class="literal">Invoice</span>--The invoice to which payment is applied
</li>

Use <span class="literal">Line.LinkedTxn.TxnId</span> as the ID in a separate read request for the specific resource to retrieve details of the linked object.
   */
  Line?: Payment_Line[];
  /**
   * META: Optional ,minorVersion: 69
   *
   * DESCRIPTION: Reference to the <span class="literal">Project</span> ID associated with this transaction. Available with Minor Version 69 and above
   */
  ProjectRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Used internally to specify originating source of a credit card transaction.
   */
  TxnSource?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Specifies the accounts receivable account associated with this payment. Query the Account name list resource to determine the appropriate Account object for this reference. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">ARAccountRef.value</span> and <span class="literal">ARAccountRef.name</span>, respectively. The specified account must have <span class="literal">Account.AccountType</span> set to <span class="literal">Accounts Receivable</span>.
   */
  ARAccountRef?: ReferenceType;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: The date entered by the user when this transaction occurred.
   * For posting transactions, this is the posting date that affects the financial statements. If the date is not supplied, the current date on the server is used.
<br>Sort order is ASC by default.
   */
  TxnDate?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Information about a payment received by credit card. Inject with data only if the payment was transacted through Intuit Payments API.
   */
  CreditCardPayment?: CreditCardPayment;
  /**
   * META: Optional ,minorVersion: 4 ,
   *
   * DESCRIPTION: The account location. Valid values include:
   * <li><span class="literal">WithinFrance</span></li>
<li><span class="literal">FranceOverseas</span></li>
<li><span class="literal">OutsideFranceWithEU</span></li>
<li><span class="literal">OutsideEU</span></li>

For France locales, only.
   */
  TransactionLocationType?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the entity. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: * Conditionally Required ,
   *
   * DESCRIPTION: The reference number for the payment received. For example, Â&nbsp;Check # for a check, envelope # for a cash donation. Required for France locales.
   */
  PaymentRefNum?: string;
  /**
   * META: read only ,minorVersion: 21 ,system defined
   *
   * DESCRIPTION: Reference to the <span class="literal">TaxExepmtion</span> ID associated with this object. Available for companies that have <a href="https://developer.intuit.com/hub/blog/2017/12/11/using-quickbooks-online-api-automated-sales-tax" title="Automatic Sales Tax">automated sales tax</a> enabled.
   * <li><span class="literal">TaxExemptionRef.Name</span>: The Tax Exemption Id for the customer to which this object is associated. This Id is typically issued by the state.</li>
<li><span class="literal">TaxExemptionRef.value</span>: The system-generated Id of the exemption type.</li>

For internal use only
   */
  readonly TaxExemptionRef?: ReferenceType;
  /**
   * DESCRIPTION: sparse for voided transactions
   */
  sparse?: boolean;
}

export interface PaymentMethod {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object.
   * Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required ,max character: Maximum of 31 chars
   *
   * DESCRIPTION: User recognizable name for the payment method.
   */
  Name: string;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: If true, this entity is currently enabled for use by QuickBooks.
   */
  Active?: boolean;
  /**
   * META: Optional
   *
   * DESCRIPTION: Defines the type of payment. Valid values include <span class="literal">CREDIT_CARD</span> or <span class="literal">NON_CREDIT_CARD</span>.
   */
  Type?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
}

export interface EmailMessageType {
  /**
   * DESCRIPTION: The body of the email message.
   */
  Message?: string;
  /**
   * DESCRIPTION: The subject of the email.
   */
  Subject?: string;
}

export interface Preferences_EmailMessagesPrefs {
  /**
   * DESCRIPTION: Email message details for Invoice.
   */
  InvoiceMessage?: EmailMessageType;
  /**
   * DESCRIPTION: Email message details for Estimate.
   */
  EstimateMessage?: EmailMessageType;
  /**
   * DESCRIPTION: Email message details for SalesReceipt.
   */
  SalesReceiptMessage?: EmailMessageType;
  /**
   * DESCRIPTION: Email message details for Statement.
   */
  StatementMessage?: EmailMessageType;
}

export interface Preferences_ProductAndServicesPrefs {
  /**
   * META: minorVersion: 65
   *
   * DESCRIPTION: Revenue recognition enabled.(QBO Advanced only)
   */
  RevenueRecognitionEnabled?: boolean;
  /**
   * META: minorVersion: 65
   *
   * DESCRIPTION: Indicates how frequently revenue is recognised.Possible values are Daily, Weekly, Monthly.(QBO Advanced only)
   */
  RecognitionFrequencyType?: string;
  /**
   * DESCRIPTION: Product and Services for Sales enabled.
   */
  ForSales?: boolean;
  /**
   * DESCRIPTION: Quantity on hand enabled.
   */
  QuantityOnHand?: boolean;
  /**
   * DESCRIPTION: Quantity with price and rate enabled.
   */
  QuantityWithPriceAndRate?: boolean;
  /**
   * DESCRIPTION: Product and Services for Purchase enabled.
   */
  ForPurchase?: boolean;
}

export interface Preferences_ReportPrefs {
  /**
   * DESCRIPTION: Accounting method for summary. Possible values include <span class="literal">Cash</span> and <span class="literal">Accrual</span>.
   */
  ReportBasis?: "Cash" | "Accrual";
  /**
   * META: read only
   *
   * DESCRIPTION: Calculation aging from transaction date
   */
  readonly CalcAgingReportFromTxnDate?: boolean;
}

export interface Preferences_AccountingInfoPrefs {
  /**
   * META: read only ,minorVersion: 21
   *
   * DESCRIPTION: This setting corresponds to the <strong>First month of fiscal year</strong> preference in the QuickBooks Online Company Settings to specify the beginning of the company's fiscal year. Specify months as fulling spelled out: <span class="literal">January</span>, <span class="literal">February</span>, and so on.
   */
  readonly FirstMonthOfFiscalYear?: "January" | "February" | "March" | "April" | "May" | "June" | "July" | "August" | "September" | "October" | "November" | "December";
  /**
   * META: read only ,minorVersion: 21
   *
   * DESCRIPTION: This setting corresponds to <strong>Enable account numbers</strong> in QuickBooks Online Company Settings.<ul><li>If set to <span class="literal">On</span>, account names are displayed with their corresponding account numbers in chart of accounts.</li><li>If set to <span class="literal">off</span>, account numbers are not displayed with account names in chart of accounts.</li></ul>
   */
  readonly UseAccountNumbers?: boolean;
  /**
   * META: read only ,minorVersion: 21
   *
   * DESCRIPTION: This setting corresponds to the <strong>First month of income tax year</strong> preference in the QuickBooks Online Company Settings to specify the beginning of the company's fiscal year. Specify months as fulling spelled out: <span class="literal">January</span>, <span class="literal">February</span>, and so on.
   */
  readonly TaxYearMonth?: string;
  /**
   * DESCRIPTION: This setting correspond to how classes are assigned when <strong>Track classes</strong> in QuickBooks Online Company Settings under Categories is set to <strong>On</strong>. If set to <span class="literal">true</span>, assign classes at the transaction level. Only one of <span class="literal">ClassTrackingPerTxnLine</span> or <span class="literal">ClassTrackingPerTxn</span> can be set to <span class="literal">true</span> at a given time. If <strong>Track classes</strong> is set to <strong>Off</strong> in company settings, both are set to <span class="literal">false</span>.
   */
  ClassTrackingPerTxn?: boolean;
  /**
   * DESCRIPTION: This setting corresponds to the <strong>Track locations</strong> preference in QuickBooks Online Company Settings under Categories. If <strong>Track locations</strong> is set to <strong>On</strong>, this attribute is returned as <span class="literal">true</span> in the response. Otherwise, <span class="literal">false</span> is returned.
   */
  TrackDepartments?: boolean;
  /**
   * META: read only ,minorVersion: 21
   *
   * DESCRIPTION: This setting corresponds to the <strong>Tax form</strong> preference in the QuickBooks Online Company Settings to specify the tax form your company files.
   */
  readonly TaxForm?: string;
  /**
   * DESCRIPTION: This setting corresponds to the <strong>Customer label</strong> preference in QuickBooks Online Company Settings and specifies the term used by the company for customers. This string is used in many places throughout the QuickBooks UI having to do with sales-side activities. Possible values include: <span class="literal">Clients</span>, <span class="literal">Customers</span>, <span class="literal">Donors</span>, <span class="literal">Guests</span>, <span class="literal">Members</span>, <span class="literal">Patients</span>, <span class="literal">Tenants</span>.
   */
  CustomerTerminology?: string;
  /**
   * META: read only ,minorVersion: 21
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: This setting corresponds to the <strong>Closing date</strong> preference in the QuickBooks Online Company Settings and specifies the date the books are closed: income and expense accounts are closed and net profit or loss is rolled up into the retained earnings account. Transactions before this date are protected from changes.
   */
  readonly BookCloseDate?: string;
  /**
   * DESCRIPTION: Specifies the term used by the company for department. This string is used as a label on transaction forms. Possible values include: <span class="literal">Business</span>, <span class="literal">Department</span>, <span class="literal">Division</span>, <span class="literal">Location</span>, <span class="literal">Property</span>, <span class="literal">Store</span>, <span class="literal">Territory</span>. This is returned only if the company's <strong>Track location</strong> preference is enabled. See TrackDepartments for more details.
   */
  DepartmentTerminology?: string;
  /**
   * DESCRIPTION: This setting correspond to how classes are assigned when <strong>Track classes</strong> in QuickBooks Online Company Settings under Categories is set to <strong>On</strong>. If set to <span class="literal">true</span>, assign classes at the line level. Only one of <span class="literal">ClassTrackingPerTxnLine</span> or <span class="literal">ClassTrackingPerTxn</span> can be set to <span class="literal">true</span> at a given time. If <strong>Track classes</strong> is set to <strong>Off</strong> in company settings, both are set to <span class="literal">false</span>.
   */
  ClassTrackingPerTxnLine?: boolean;
}

export interface Preferences_SalesFormsPrefs_CustomField_CustomFieldDefinition_CustomField {
  /**
   * DESCRIPTION: Used to enable the custom field. Set to <span class="literal">True</span> to enable the field. Once enabled, it is available on sales forms in the QuickBOoks UI and available for QuickBooks services.
   */
  BooleanValue?: boolean;
  /**
   * META: system defined
   *
   * DESCRIPTION: Value is <span class="literal">BooleanType</span>. Denotes this is a custom field enabling object.
   */
  Type?: "BooleanType";
  /**
   * META: read only
   *
   * DESCRIPTION: The internal name of an enabled custom field. <span class="literal">Name</span> takes the form <span class="literal">SalesFormsPrefs.SalesCustomNameN</span>, where N is <span class="literal">1</span>, <span class="literal">2</span>, or <span class="literal">3</span> for up to three available custom fields.
   */
  readonly Name?: string;
}

export interface Preferences_SalesFormsPrefs_CustomField_CustomFieldDefinition_CustomField1 {
  /**
   * DESCRIPTION: The name of the custom field as it appears on the sales form.
   */
  StringValue?: string;
  /**
   * META: system defined
   *
   * DESCRIPTION: Denotes that this is a custom field definition. Value is <span class="literal">StringType</span>. This type of custom field is available once the field has been enabled with a corresponding <span class="literal">CustomField</span> object of type <span class="literal">BooleanType</span>.
   */
  Type?: "StringType" | "CustomField" | "BooleanType";
  /**
   * META: read only
   *
   * DESCRIPTION: The internal name of an enabled custom field, <span class="literal">Name</span> takes the form <span class="literal">SalesFormsPrefs.SalesCustomNameN</span>, where N is <span class="literal">1</span>, <span class="literal">2</span>, or <span class="literal">3</span> for up to three available custom fields that have been enabled. Use the numeric part, represented by N here, as the <span class="literal">CustomField.DefinitionId</span> when configuring custom fields in transactions.
   */
  readonly Name?: string;
}

export interface Preferences_SalesFormsPrefs {
  /**
   * META: Optional ,minorVersion: 8
   *
   * DESCRIPTION: Default blind carbon copy email address where invoices are sent. Override this setting with the  <span class="literal"> Invoice.BillEmailBcc </span>  attribute. Max 200 characters. Ignored if address is invalid. Available with minor version 8.
   */
  SalesEmailBcc?: EmailAddress;
  /**
   * META: Optional ,minorVersion: 8
   *
   * DESCRIPTION: Default carbon copy email address where invoices are sent. Override this setting with the <span class="literal"> Invoice.BillEmailCc </span> attribute. Max 200 characters. Ignored if address is invalid. Available with minor version 8.
   */
  SalesEmailCc?: EmailAddress;
  /**
   * META: Optional ,read only ,minorVersion: 32
   *
   * DESCRIPTION: Enables Progress Invoicing
   */
  readonly UsingProgressInvoicing?: boolean;
  /**
   * META: Optional ,read only
   *
   * DESCRIPTION: Toggles whether Sales Forms Custom Fields are enabled on the sales form. Sales forms can have up to three custom fields.
   */
  readonly CustomField?: Preferences_SalesFormsPrefs_CustomField_CustomFieldDefinition_CustomField | Preferences_SalesFormsPrefs_CustomField_CustomFieldDefinition_CustomField1;
  /**
   * DESCRIPTION: Enables specifying service date.
   */
  AllowServiceDate?: boolean;
  /**
   * META: read only
   *
   * DESCRIPTION: Message to the customers on estimates.
   */
  readonly EstimateMessage?: string;
  /**
   * DESCRIPTION: If set to true, the QuickBooks company is cc'ed on all email sent to customers for sales transactions. Email used is that defined with <span class="literal"> CompanyInfo.Email.Address </span>. Available with minor verion 8.
   */
  EmailCopyToCompany?: boolean;
  /**
   * DESCRIPTION: Default customer message.
   */
  DefaultCustomerMessage?: string;
  /**
   * DESCRIPTION: Enables specifying shipping info.
   */
  AllowShipping?: boolean;
  /**
   * DESCRIPTION: Default discount account.
   */
  DefaultDiscountAccount?: boolean;
  /**
   * META: read only
   *
   * DESCRIPTION: IPN support enabled. No longer used and is being deprecated.
   */
  readonly IPNSupportEnabled?: boolean;
  /**
   * DESCRIPTION: Enables ETransaction payment.
   */
  ETransactionPaymentEnabled?: boolean;
  /**
   * DESCRIPTION: Default sales terms.
   */
  DefaultTerms?: ReferenceType;
  /**
   * DESCRIPTION: Enables specifying Deposit.
   */
  AllowDeposit?: boolean;
  /**
   * META: read only
   *
   * DESCRIPTION: If set to true, price levels are enabled for sales transactions. Full price level support available via QuickBooks UI, only, in April 2017.
   */
  readonly UsingPriceLevels?: boolean;
  /**
   * DESCRIPTION: Default shipping account.
   */
  DefaultShippingAccount?: boolean;
  /**
   * DESCRIPTION: Specifies whether sales form PDF should be attached with ETransaction mails.
   */
  ETransactionAttachPDF?: boolean;
  /**
   * DESCRIPTION: Enables the ability to specify custom transaction numbers for sales transactions.
   */
  CustomTxnNumbers?: boolean;
  /**
   * META: read only
   *
   * ADDON: null
   *
   * No values given for enum
   *
   * DESCRIPTION: Enables ETransaction status.
   */
  readonly ETransactionEnabledStatus?: string;
  /**
   * DESCRIPTION: Enables specifying Estimates.
   */
  AllowEstimates?: boolean;
  /**
   * DESCRIPTION: Enables specifying Discount.
   */
  AllowDiscount?: boolean;
  /**
   * META: read only ,minorVersion: 21
   *
   * DESCRIPTION: Automatically applies credits to the next invoice you create for the same customer. Most companies turn on this setting.
   */
  readonly AutoApplyCredit?: boolean;
}

export interface Preferences_VendorAndPurchasesPrefs_POCustomField_CustomFieldDefinition_CustomField {
  /**
   * DESCRIPTION: Used to enable the custom field. Set to <span class="literal">True</span> to enable the field. Once enabled, it is available on purchase order forms in the QuickBOoks UI and available for QuickBooks services.
   */
  BooleanValue?: boolean;
  /**
   * META: system defined
   *
   * DESCRIPTION: Value is <span class="literal">BooleanType</span>. Denotes this is a custom field enabling object.
   */
  Type?: "BooleanType";
  /**
   * META: read only
   *
   * DESCRIPTION: The internal name of the custom field. <span class="literal">Name</span> takes the form <span class="literal">PurchasePrefs.UsePurchaseNameN</span>, where N is <span class="literal">1</span>, <span class="literal">2</span>, or <span class="literal">3</span> for up to three available custom fields.
   */
  readonly Name?: string;
}

export interface Preferences_VendorAndPurchasesPrefs_POCustomField_CustomFieldDefinition_CustomField1 {
  /**
   * DESCRIPTION: The name of the custom field as it appears on the Purchase Order form.
   */
  StringValue?: string;
  /**
   * META: system defined
   *
   * DESCRIPTION: Denotes that this is a custom field definition. Value is <span class="literal">StringType</span>. This type of custom field is available once the field has been enabled with a corresponding <span class="literal">CustomField</span> object of type <span class="literal">BooleanType</span>.
   */
  Type?: "StringType" | "CustomField" | "BooleanType";
  /**
   * META: read only
   *
   * DESCRIPTION: The internal name of an enabled custom field, <span class="literal">Name</span> takes the form <span class="literal">PurchasePrefs.PurchaseCustomNameN</span>, where N is <span class="literal">1</span>, <span class="literal">2</span>, or <span class="literal">3</span> for up to three available custom fields that have been enabled.
   */
  readonly Name?: string;
}

export interface Preferences_VendorAndPurchasesPrefs {
  /**
   * META: Optional ,read only
   *
   * DESCRIPTION: Toggles whether Purchase Order Custom Fields are enabled on the sales form. Purchase Order forms can have up to three custom fields
   */
  readonly POCustomField?: Preferences_VendorAndPurchasesPrefs_POCustomField_CustomFieldDefinition_CustomField | Preferences_VendorAndPurchasesPrefs_POCustomField_CustomFieldDefinition_CustomField1;
  /**
   * DESCRIPTION: Default markup account.
   */
  DefaultMarkupAccount?: ReferenceType;
  /**
   * DESCRIPTION: Enables tracking by customer.
   */
  TrackingByCustomer?: boolean;
  /**
   * DESCRIPTION: Default terms
   */
  DefaultTerms?: ReferenceType;
  /**
   * DESCRIPTION: Billable Expense tracking enabled.
   */
  BillableExpenseTracking?: boolean;
  /**
   * ADDON: Decimal
   *
   * DESCRIPTION: Default markup rate used to calculate the markup amount on the transactions. To enter a markup rate of 8.5%, enter 8.5, not 0.085.
   */
  DefaultMarkup?: number;
  /**
   * META: read only ,minorVersion: 40 ,
   *
   * DESCRIPTION: Indicates if TPAR enabled by customer.
   */
  readonly TPAREnabled?: boolean;
}

export interface Preferences_TaxPrefs {
  /**
   * META: read only
   *
   * DESCRIPTION: Partner tax refers to the automated sales tax engine that provides sales tax compliance. All QuickBooks Online companies created after November 10, 2017 are enabled by default.<ul><li>If <span class="literal">true</span>, automated sales tax is enabled for the company and sales tax is set up (<span class="literal">UsingSalesTax</span> is set to <span class="literal">true</span>).</li><li>If <span class="literal">false</span>, automated sales tax is enabled for the company but the company doesn't have sales tax set up (<span class="literal">UsingSalesTax</span> is set to <span class="literal">false</span>).</li><li>If not present in response payload, the company is not enabled for automated sales tax.</li></ul>
   */
  readonly PartnerTaxEnabled?: boolean;
  /**
   * META: read only
   *
   * DESCRIPTION: Reference to the TaxCode.Id for tax code group to use.
   */
  readonly TaxGroupCodeRef?: string;
  /**
   * META: read only
   *
   * DESCRIPTION: Sales tax enabled
   */
  readonly UsingSalesTax?: boolean;
}

export interface Preferences_TimeTrackingPrefs {
  /**
   * META: read only
   *
   * ADDON: Week Enum
   *
   * DESCRIPTION: Work week starting day.
   */
  readonly WorkWeekStartDate?: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  /**
   * META: read only
   *
   * DESCRIPTION: Mark time entries as billable.
   */
  readonly MarkTimeEntriesBillable?: boolean;
  /**
   * DESCRIPTION: Billing rate to all employees enabled.
   */
  ShowBillRateToAll?: boolean;
  /**
   * DESCRIPTION: Services for time tracking enabled.
   */
  UsingSalesTax?: boolean;
  /**
   * DESCRIPTION: Enables billing customers for time.
   */
  BillCustomers?: boolean;
}

export interface Preferences_CurrencyPrefs {
  /**
   * META: read only
   *
   * DESCRIPTION: Currency code of the country where the business is physically located.
   */
  readonly HomeCurrency?: ReferenceType;
  /**
   * META: read only
   *
   * DESCRIPTION: Multicurrency enabled for this company. Not available with QuickBooks Simple Start.
   */
  readonly MultiCurrencyEnabled?: boolean;
}

export interface Preferences {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object.
   * Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  EmailMessagesPrefs?: Preferences_EmailMessagesPrefs;
  ProductAndServicesPrefs?: Preferences_ProductAndServicesPrefs;
  ReportPrefs?: Preferences_ReportPrefs;
  /**
   * DESCRIPTION: The following settings are available for QuickBooks Online Plus editions, only. To determine this edition type, query the value of the <span class="literal">OfferingSku</span> CustomerInfo.Name name/value pair for <span class="literal">QuickBooks Online Plus</span>.
   */
  AccountingInfoPrefs?: Preferences_AccountingInfoPrefs;
  SalesFormsPrefs?: Preferences_SalesFormsPrefs;
  VendorAndPurchasesPrefs?: Preferences_VendorAndPurchasesPrefs;
  TaxPrefs?: Preferences_TaxPrefs;
  /**
     * Other Preferences
     *
     * Other preferences that are not listed in the Preferences list
     * This is a list of pre determined names and values for those names
     *
     * DESCRIPTION: Specifies extension of Preference resource to allow extension of Name-Value pair based extension at the top level.
     */
    OtherPrefs?: { Name: string, Value: string}[];
  TimeTrackingPrefs?: Preferences_TimeTrackingPrefs;
  CurrencyPrefs?: Preferences_CurrencyPrefs;
}

export interface Purchase_Line_LinkedTxn {
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction Id of the related transaction.
   */
  TxnId: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction type of the linked object.
   */
  TxnType: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Required for Deposit and Bill entities. The line number of a specific line of the linked transaction. If supplied, the
   * <span class="literal">TxnId</span> and
<span class="literal">TxnType</span> attributes of the linked transaction must also be populated.
   */
  TxnLineId?: string;
}

export interface Purchase_Line_ItemBasedExpenseLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   */
  ItemBasedExpenseLineDetail: ItemBasedExpenseLineDetail;
  /**
   * META: * Required ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   */
  Amount: number;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">ItemBasedExpenseLineDetail</span> for this type of line.
   */
  DetailType: "ItemBasedExpenseLineDetail";
  /**
   * META: Optional ,minorVersion: 55
   *
   * DESCRIPTION: Zero or more transactions linked to this object. The <span class="literal">LinkedTxn.TxnType</span> can be set to <span class="literal">ReimburseCharge</span>. The <span class="literal">LinkedTxn.TxnId</span> can be set as the ID of the transaction.
   */
  LinkedTxn?: Purchase_Line_LinkedTxn[];
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer.
   */
  LineNum?: number;
}

export interface Purchase_Line_AccountBasedExpenseLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">AccountBasedExpenseLineDetail</span>for this type of line.
   */
  DetailType: "AccountBasedExpenseLineDetail";
  /**
   * META: * Required ,max character: max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   */
  Amount: number;
  /**
   * META: * Required
   *
   * DESCRIPTION: <strong>LineDetail</strong>
   */
  AccountBasedExpenseLineDetail: AccountBasedExpense;
  /**
   * META: Optional ,max character: max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive Integer.
   */
  LineNum?: number;
}

export interface Purchase_LinkedTxn {
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction Id of the related transaction.
   */
  TxnId: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction type of the linked object.
   */
  TxnType: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Required for Deposit and Bill entities. The line number of a specific line of the linked transaction. If supplied, the
   * <span class="literal">TxnId</span> and
<span class="literal">TxnType</span> attributes of the linked transaction must also be populated.
   */
  TxnLineId?: string;
}

export interface Purchase_TxnTaxDetail_TaxLine_Line {
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">TaxLineDetail</span>for this type of line.
   */
  DetailType: "TaxLineDetail";
  /**
   * META: * Required
   *
   * DESCRIPTION: <strong>TaxLineDetail</strong>
   */
  TaxLineDetail: TaxLineDetail;
  /**
   * META: Optional ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of tax for this tax line.  This value is negative for JournalEntry objects with <span class="literal">PostingType</span> set to <span class="literal">Credit.</span>
   */
  Amount?: number;
}

export interface Purchase {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object.
   * Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Individual line items of a transaction. Valid 
   * <span class="literal">Line</span> types include <span class="literal">ItemBasedExpenseLine</span> (Available if
<span class="literal">Preferences.ProductAndServicesPrefs.ForPurchase</span> is set to 
<span class="literal">true</span>) and <span class="literal">AccountBasedExpenseLine</span>
   */
  Line: (Purchase_Line_ItemBasedExpenseLine | Purchase_Line_AccountBasedExpenseLine)[];
  /**
   * META: * Required
   *
   * DESCRIPTION: Type can be
   * <span class="literal">Cash</span>,
<span class="literal">Check</span>, or
<span class="literal">CreditCard</span>.
   */
  PaymentType: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Specifies the account reference to which this purchase is applied based on the <span class="literal">PaymentType</span>. A type of <span class="literal">Check</span> should have bank account, <span class="literal">CreditCard</span> should specify credit card account, etc. Query the Account name list resource to determine the appropriate Account object for this reference. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">AccountRef.value</span> and <span class="literal">AccountRef.name</span>, respectively.
   */
  AccountRef: ReferenceType;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Reference to the currency in which all amounts on the associated transaction are expressed. This must be defined if multicurrency is enabled for the company.
   * <br>Multicurrency is enabled for the company if <span class="literal">Preferences.MultiCurrencyEnabled</span> is set to <span class="literal">true</span>. Read more about multicurrency support <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/manage-multiple-currencies" title="Currency">here</a>. Required if multicurrency is enabled for the company.
   */
  CurrencyRef?: CurrencyRefType;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: The date entered by the user when this transaction occurred.
   * For posting transactions, this is the posting date that affects the financial statements. If the date is not supplied, the current date on the server is used.
<br>Sort order is ASC by default.
   */
  TxnDate?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: PrintStatus is applicable only for
   * <span class="literal">Check</span>.&nbsp; Ignored for
<span class="literal">CreditCard</span>charge or refund.
Valid values:
<span class="literal">NotSet</span>,
<span class="literal">NeedToPrint</span>,
<span class="literal">PrintComplete.</span>
   */
  PrintStatus?: string;
  /**
   * META: Optional ,read only
   *
   * DESCRIPTION: Address to which the payment should be sent. This attribute is applicable only for
   * <span class="literal">Check</span>. Ignored for
<span class="literal">CreditCard</span>&nbsp;charge or refund. <br> If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:<p></p><ul><li><span class="literal">Line1</span> and <span class="literal">Line2</span> elements are populated with the customer name and company name.</li><li>Original <span class="literal">Line1</span> through <span class="literal">Line 5</span> contents, <span class="literal">City</span>, <span class="literal">SubDivisionCode</span>, and <span class="literal">PostalCode</span> flow into <span class="literal">Line3</span> through <span class="literal">Line5</span>as a free format strings.</li></ul>
   */
  readonly RemitToAddr?: PhysicalAddress;
  /**
   * META: Optional
   *
   * DESCRIPTION: Used internally to specify originating source of a credit card transaction.
   */
  TxnSource?: string;
  /**
   * META: Optional ,minorVersion: 55
   *
   * DESCRIPTION: Zero or more transactions linked to this object. The <span class="literal">LinkedTxn.TxnType</span> can be set to <span class="literal">ReimburseCharge</span>. The <span class="literal">LinkedTxn.TxnId</span> can be set as the ID of the transaction.
   */
  LinkedTxn?: Purchase_LinkedTxn[];
  /**
   * META: Optional ,
   *
   * DESCRIPTION: Method in which tax is applied. Allowed values are:
   * <span class="literal">TaxExcluded</span>,
<span class="literal">TaxInclusive</span>, and
<span class="literal">NotApplicable</span>.
   */
  GlobalTaxCalculation?: "TaxExcluded" | "TaxInclusive" | "NotApplicable";
  /**
   * META: Optional ,minorVersion: 4 ,
   *
   * DESCRIPTION: The account location. Valid values include:
   * <li><span class="literal">WithinFrance</span></li>
<li><span class="literal">FranceOverseas</span></li>
<li><span class="literal">OutsideFranceWithEU</span></li>
<li><span class="literal">OutsideEU</span></li>

For France locales, only.
   */
  TransactionLocationType?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: Optional ,max character: Maximum of 21 chars
   *
   * DESCRIPTION: Reference number for the transaction. If not explicitly provided at create time, this field is populated based on the setting of <span class="literal">Preferences:OtherPrefs:NameValue.Name = VendorAndPurchasesPrefs.UseCustomTxnNumbers</span> as follows:
   * <li>If <span class="literal">Preferences:OtherPrefs:NameValue.Name = VendorAndPurchasesPrefs.UseCustomTxnNumbers</span> is true a custom value can be provided; duplicate values are not accepted. If no value is supplied, the resulting DocNumber is null.</li>
<li>If <span class="literal">Preferences:OtherPrefs:NameValue.Name = VendorAndPurchasesPrefs.UseCustomTxnNumbers</span> is false, resulting DocNumber is system generated by incrementing the last number by 1.</li>

For Cash/CreditCard transactions, throws an error when duplicate DocNumber is sent in the request. For Check transactions, error is thrown when duplicate DocNumber is sent in the request and <span class="literal">Preferences:OtherPrefs:NameValue.Name = WarnDuplicateCheckNumber</span> is true. Recommended best practice: check the setting of <span class="literal">Preferences:OtherPrefs:NameValue.Name = VendorAndPurchasesPrefs.UseCustomTxnNumbers</span> before setting DocNumber. If a duplicate DocNumber needs to be supplied, add the query parameter name/value pair, <span class="literal">include=allowduplicatedocnum</span> to the URI. 
Sort order is ASC by default.
   */
  DocNumber?: string;
  /**
   * META: Optional ,max character: Max of 4000 chars
   *
   * DESCRIPTION: User-entered, organization-private note about the transaction. This field maps to the Memo field on the Expense form in the QuickBooks UI.
   */
  PrivateNote?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: <span class="literal">False</span>—it represents a charge.
   * 
<span class="literal">True</span>—it represents a refund.
Valid only for
<span class="literal">CreditCard</span>payment type.

Validation Rules: Valid only for
<span class="literal">CreditCard</span>transactions.
   */
  Credit?: boolean;
  /**
   * META: Optional
   *
   * DESCRIPTION: This data type provides information for taxes charged on the transaction as a whole. It captures the details sales taxes calculated for the transaction based on the tax codes referenced by the transaction. This can be calculated by QuickBooks business logic or you may supply it when adding a transaction. See <a href="https://developer.intuit.com/app/developer/qbo/docs/workflows/manage-sales-tax-for-non-us-locales" title="Global Tax Model">Global tax model</a> for more information about this element.
   * If sales tax is disabled (<span class="literal">Preferences.TaxPrefs.UsingSalesTax</span> is set to <span class="literal">false</span>) then <span class="literal">TxnTaxDetail</span> is ignored and not stored.
   */
  TxnTaxDetail?: TxnTaxDetail;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to a PaymentMethod associated with this transaction. Query the PaymentMethod name list resource to determine the appropriate PaymentMethod object for this reference. Use <span class="literal">PaymentMethod.Id</span> and <span class="literal">PaymentMethod.Name</span> from that object for <span class="literal">PaymentMethodRef.value</span> and <span class="literal">PaymentMethodRef.name</span>, respectively.
   */
  PaymentMethodRef?: ReferenceType;
  /**
   * META: Optional
   *
   * ADDON: Internal use
   *
   * DESCRIPTION: For internal use.
   */
  PurchaseEx?: any;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The number of home currency units it takes to equal one unit of currency specified by <span class="literal">CurrencyRef</span>. Applicable if multicurrency is enabled for the company
   */
  ExchangeRate?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: A reference to a Department object specifying the location of the transaction. Available if <span class="literal">Preferences.AccountingInfoPrefs.TrackDepartments</span> is set to <span class="literal">true</span>.
   * <br>Query the Department name list resource to determine the appropriate department object for this reference. Use <span class="literal">Department.Id</span> and <span class="literal">Department.Name</span> from that object for <span class="literal">DepartmentRef.value</span> and <span class="literal">DepartmentRef.name</span>, respectively.
   */
  DepartmentRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Specifies the party with whom an expense is associated. Can be
   * <span class="literal">Customer</span>,
<span class="literal">Vendor, or Employee.</span>
<br>Query the corresponding name list resource of the associated type to determine the appropriate object for this reference. Use the <span class="literal">Id</span> and <span class="literal">DisplayName</span> values from that object for <span class="literal">EntityRef.value</span> and <span class="literal">EntityRef.name</span>, respectively. Set <span class="literal">EntityRef.type</span> to the type of object associated with this expense. For example, if this object represents a purchase from a vendor, then set <span class="literal">EntityRef.type</span> to <span class="literal">Vendor</span> and query the Vendor resource for the appropriate object to reference.
   */
  EntityRef?: ReferenceType;
  /**
   * META: Optional ,minorVersion: 40 ,
   *
   * DESCRIPTION: Include the supplier in the annual TPAR. TPAR stands for Taxable Payments Annual Report. The TPAR is mandated by ATO to get the details payments that businesses make to contractors for providing services. Some government entities also need to report the grants they have paid in a TPAR.
   */
  IncludeInAnnualTPAR?: boolean;
  /**
   * META: read only ,system defined
   *
   * ADDON: Big Decimal
   *
   * DESCRIPTION: Indicates the total amount of the transaction. This includes the total of all the charges, allowances, and taxes.
   * Calculated by QuickBooks business logic; any value you supply is over-written by QuickBooks.
   */
  readonly TotalAmt?: number;
  /**
   * META: read only ,minorVersion: 52
   *
   * DESCRIPTION: A reference to the Recurring Transaction. It captures what recurring transaction template the <span class="literal">Purchase</span> was created from.
   */
  readonly RecurDataRef?: ReferenceType;
}

export interface PurchaseOrder_Line_LinkedTxn {
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction Id of the related transaction.
   */
  TxnId: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction type of the linked object.
   */
  TxnType: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Required for Deposit and Bill entities. The line number of a specific line of the linked transaction. If supplied, the
   * <span class="literal">TxnId</span> and
<span class="literal">TxnType</span> attributes of the linked transaction must also be populated.
   */
  TxnLineId?: string;
}

export interface PurchaseOrder_Line_ItemBasedExpenseLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   */
  ItemBasedExpenseLineDetail: ItemBasedExpenseLineDetail;
  /**
   * META: * Required ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   */
  Amount: number;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">ItemBasedExpenseLineDetail</span> for this type of line.
   */
  DetailType: "ItemBasedExpenseLineDetail";
  /**
   * META: Optional ,minorVersion: 55
   *
   * DESCRIPTION: Zero or more transactions linked to this object. The <span class="literal">LinkedTxn.TxnType</span> can be set to <span class="literal">ReimburseCharge</span>. The <span class="literal">LinkedTxn.TxnId</span> can be set as the ID of the transaction.
   */
  LinkedTxn?: PurchaseOrder_Line_LinkedTxn[];
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer.
   */
  LineNum?: number;
}

export interface PurchaseOrder_Line_AccountBasedExpenseLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">AccountBasedExpenseLineDetail</span>for this type of line.
   */
  DetailType: "AccountBasedExpenseLineDetail";
  /**
   * META: * Required ,max character: max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   */
  Amount: number;
  /**
   * META: * Required
   *
   * DESCRIPTION: <strong>LineDetail</strong>
   */
  AccountBasedExpenseLineDetail: AccountBasedExpense;
  /**
   * META: Optional ,max character: max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive Integer.
   */
  LineNum?: number;
}

export interface PurchaseOrder_LinkedTxn {
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction Id of the related transaction.
   */
  TxnId: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction type of the linked object.
   */
  TxnType: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Required for Deposit and Bill entities. The line number of a specific line of the linked transaction. If supplied, the
   * <span class="literal">TxnId</span> and
<span class="literal">TxnType</span> attributes of the linked transaction must also be populated.
   */
  TxnLineId?: string;
}

export interface PurchaseOrder_TxnTaxDetail_TaxLine_Line {
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">TaxLineDetail</span>for this type of line.
   */
  DetailType: "TaxLineDetail";
  /**
   * META: * Required
   *
   * DESCRIPTION: <strong>TaxLineDetail</strong>
   */
  TaxLineDetail: TaxLineDetail;
  /**
   * META: Optional ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of tax for this tax line.  This value is negative for JournalEntry objects with <span class="literal">PostingType</span> set to <span class="literal">Credit.</span>
   */
  Amount?: number;
}

export interface PurchaseOrder {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object.
   * Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Specifies to which AP account the bill is credited. Query the Account name list resource to determine the appropriate Account object for this reference. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">APAccountRef.value</span> and <span class="literal">APAccountRef.name</span>, respectively. The specified account must have <span class="literal">Account.Classification</span> set to <span class="literal">Liability</span> and <span class="literal">Account.AccountSubType</span> set to <span class="literal">AccountsPayable</span>.
   * <br>If the company has a single AP account, the account is implied. However, it is recommended that the AP Account be explicitly specified in all cases to prevent unexpected errors when relating transactions to each other.
   */
  APAccountRef: ReferenceType;
  /**
   * META: * Required
   *
   * DESCRIPTION: Reference to the vendor for this transaction. Query the Vendor name list resource to determine the appropriate Vendor object for this reference. Use <span class="literal">Vendor.Id</span> and <span class="literal">Vendor.Name</span> from that object for <span class="literal">VendorRef.value</span> and <span class="literal">VendorRef.name</span>, respectively.
   */
  VendorRef: ReferenceType;
  /**
   * META: * Required
   *
   * DESCRIPTION: Individual line items of a transaction. Valid <span class="literal">Line</span> types include:
   * <span class="literal">ItemBasedExpenseLine</span> and 
<span class="literal">AccountBasedExpenseLine</span>
   */
  Line: (PurchaseOrder_Line_ItemBasedExpenseLine | PurchaseOrder_Line_AccountBasedExpenseLine)[];
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Reference to the currency in which all amounts on the associated transaction are expressed. This must be defined if multicurrency is enabled for the company.
   * <br>Multicurrency is enabled for the company if <span class="literal">Preferences.MultiCurrencyEnabled</span> is set to <span class="literal">true</span>. Read more about multicurrency support <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/manage-multiple-currencies" title="Currency">here</a>. Required if multicurrency is enabled for the company
   */
  CurrencyRef?: CurrencyRefType;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: The date entered by the user when this transaction occurred.
   * For posting transactions, this is the posting date that affects the financial statements. If the date is not supplied, the current date on the server is used.
<br>Sort order is ASC by default.
   */
  TxnDate?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: One of, up to three custom fields for the transaction. Available for custom fields so configured for the company. Check <span class="literal">Preferences.SalesFormsPrefs.CustomField</span> and <span class="literal">Preferences.VendorAndPurchasesPrefs.POCustomField</span> for custom fields currenly configured. <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/create-custom-fields" title="Custom Fields">Click here</a> to learn about managing custom fields.
   */
  CustomField?: CustomField[];
  /**
   * META: Optional ,minorVersion: 17
   *
   * DESCRIPTION: Used to specify the vendor e-mail address where the purchase req is sent.
   */
  POEmail?: EmailAddress;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the Class associated with the transaction. Available if <span class="literal">Preferences.AccountingInfoPrefs.ClassTrackingPerTxn</span> is set to <span class="literal">true</span>. Query the Class name list resource to determine the appropriate Class object for this reference. Use <span class="literal">Class.Id</span> and <span class="literal">Class.Name</span> from that object for <span class="literal">ClassRef.value</span> and <span class="literal">ClassRef.name</span>, respectively.
   */
  ClassRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the sales term associated with the transaction. Query the Term name list resource to determine the appropriate Term object for this reference. Use <span class="literal">Term.Id</span> and <span class="literal">Term.Name</span> from that object for <span class="literal">SalesTermRef.value</span> and <span class="literal">SalesTermRef.name</span>, respectively.
   */
  SalesTermRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Zero or more Bill objects linked to this purchase order; <span class="literal">LinkedTxn.TxnType</span> is set to <span class="literal">Bill</span>. To retrieve details of a linked Bill transaction, issue a separate request to read the Bill whose ID is <span class="literal">linkedTxn.TxnId</span>.
   */
  LinkedTxn?: PurchaseOrder_LinkedTxn[];
  /**
   * META: Optional ,
   *
   * DESCRIPTION: Method in which tax is applied. Allowed values are:
   * <span class="literal">TaxExcluded</span>,
<span class="literal">TaxInclusive</span>, and
<span class="literal">NotApplicable</span>.
   */
  GlobalTaxCalculation?: "TaxExcluded" | "TaxInclusive" | "NotApplicable";
  /**
   * META: Optional ,max character: Max of 4000 chars
   *
   * DESCRIPTION: A message for the vendor. This text appears on the Purchase Order object sent to the vendor.
   */
  Memo?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Purchase order status. Valid values are: <span class="literal">Open</span> and <span class="literal">Closed</span>.
   */
  POStatus?: string;
  /**
   * META: Optional ,minorVersion: 4 ,
   *
   * DESCRIPTION: The account location. Valid values include:
   * <li><span class="literal">WithinFrance</span></li>
<li><span class="literal">FranceOverseas</span></li>
<li><span class="literal">OutsideFranceWithEU</span></li>
<li><span class="literal">OutsideEU</span></li>

For France locales, only.
   */
  TransactionLocationType?: string;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: Date when the payment of the transaction is due. If date is not provided, the number of days specified in
   * <span class="literal">SalesTermRef</span> added the transaction date will be used.
   */
  DueDate?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: Optional ,max character: Maximum of 21 chars
   *
   * DESCRIPTION: Reference number for the transaction. If not explicitly provided at create time, this field is populated based on the setting of <span class="literal">Preferences:OtherPrefs:NameValue.Name = VendorAndPurchasesPrefs.UseCustomTxnNumbers</span> as follows:
   * <li>If <span class="literal">Preferences:OtherPrefs:NameValue.Name = VendorAndPurchasesPrefs.UseCustomTxnNumbers</span> is true a custom value can be provided. If no value is supplied, the resulting DocNumber is null.</li>
<li>If <span class="literal">Preferences:OtherPrefs:NameValue.Name = VendorAndPurchasesPrefs.UseCustomTxnNumbers</span> is false, resulting DocNumber is system generated by incrementing the last number by 1.</li>

Throws an error when duplicate DocNumber is sent in the request. Recommended best practice: check the setting of <span class="literal">Preferences:OtherPrefs:NameValue.Name = VendorAndPurchasesPrefs.UseCustomTxnNumbers</span> before setting DocNumber. If a duplicate DocNumber needs to be supplied, add the query parameter name/value pair, <span class="literal">include=allowduplicatedocnum</span> to the URI.
Sort order is ASC by default.
   */
  DocNumber?: string;
  /**
   * META: Optional ,max character: Max of 4000 chars
   *
   * DESCRIPTION: User entered, organization-private note about the transaction. This note does not appear on the purchase order to the vendor. This field maps to the Memo field on the Purchase Order form.
   */
  PrivateNote?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the user-defined ShipMethod associated with the transaction. Store shipping method string in both <span class="literal">ShipMethodRef.value</span> and <span class="literal">ShipMethodRef.name</span>.
   */
  ShipMethodRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: This data type provides information for taxes charged on the transaction as a whole. It captures the details sales taxes calculated for the transaction based on the tax codes referenced by the transaction. This can be calculated by QuickBooks business logic or you may supply it when adding a transaction. See <a href="https://developer.intuit.com/app/developer/qbo/docs/workflows/manage-sales-tax-for-non-us-locales" title="Global Tax Model">Global tax model</a> for more information about this element.
   * If sales tax is disabled (<span class="literal">Preferences.TaxPrefs.UsingSalesTax</span> is set to <span class="literal">false</span>) then <span class="literal">TxnTaxDetail</span> is ignored and not stored.
   */
  TxnTaxDetail?: TxnTaxDetail;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the customer to whose shipping address the order will be shipped to.
   */
  ShipTo?: ReferenceType;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The number of home currency units it takes to equal one unit of currency specified by <span class="literal">CurrencyRef</span>. Applicable if multicurrency is enabled for the company.
   */
  ExchangeRate?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: Address to which the vendor shipped or will ship any goods associated with the purchase. <br> If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:<p></p><ul><li><span class="literal">Line1</span> and <span class="literal">Line2</span> elements are populated with the customer name and company name.</li><li>Original <span class="literal">Line1</span> through <span class="literal">Line 5</span> contents, <span class="literal">City</span>, <span class="literal">SubDivisionCode</span>, and <span class="literal">PostalCode</span> flow into <span class="literal">Line3</span> through <span class="literal">Line5</span>as a free format strings.</li></ul>
   */
  ShipAddr?: PhysicalAddress;
  /**
   * META: Optional
   *
   * DESCRIPTION: Address to which the payment should be sent. <br> If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:<p></p><ul><li><span class="literal">Line1</span> and <span class="literal">Line2</span> elements are populated with the customer name and company name.</li><li>Original <span class="literal">Line1</span> through <span class="literal">Line 5</span> contents, <span class="literal">City</span>, <span class="literal">SubDivisionCode</span>, and <span class="literal">PostalCode</span> flow into <span class="literal">Line3</span> through <span class="literal">Line5</span>as a free format strings.</li></ul>
   */
  VendorAddr?: PhysicalAddress;
  /**
   * META: Optional ,minorVersion: 45
   *
   * DESCRIPTION: Email status of the purchase order.
   * Valid values:
<span class="literal">NotSet</span>,
<span class="literal">NeedToSend</span>,
<span class="literal">EmailSent
</span>
   */
  EmailStatus?: string;
  /**
   * META: read only ,system defined
   *
   * ADDON: Big Decimal
   *
   * DESCRIPTION: Indicates the total amount of the transaction. This includes the total of all the charges, allowances, and taxes. Calculated by QuickBooks business logic; any value you supply is over-written by QuickBooks.
   */
  readonly TotalAmt?: number;
  /**
   * META: read only ,minorVersion: 52
   *
   * DESCRIPTION: A reference to the Recurring Transaction. It captures what recurring transaction template the <span class="literal">PurchaseOrder</span> was created from.
   */
  readonly RecurDataRef?: ReferenceType;
}

export interface RefundReceipt_Line_SalesItemLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to <span class="literal">SalesItemLineDetail</span>for this type of line.
   */
  DetailType: "SalesItemLineDetail";
  /**
   * META: * Required
   */
  SalesItemLineDetail: SalesItemLineDetail;
  /**
   * META: * Required ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   *  For Invoice objects in global locales: when updating <span class="literal">Amount</span>, remove the <span class="literal">TxnTaxDetail</span> element in the object before submitting it in the update request payload.
   */
  Amount: number;
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer
   */
  LineNum?: number;
}

export interface RefundReceipt_Line_GroupLineDetail_Line {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to <span class="literal">SalesItemLineDetail</span>for this type of line.
   */
  DetailType: "SalesItemLineDetail";
  /**
   * META: * Required
   */
  SalesItemLineDetail: SalesItemLineDetail;
  /**
   * META: * Required ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   *  For Invoice objects in global locales: when updating <span class="literal">Amount</span>, remove the <span class="literal">TxnTaxDetail</span> element in the object before submitting it in the update request payload.
   */
  Amount: number;
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer
   */
  LineNum?: number;
}

export interface RefundReceipt_Line_GroupLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   */
  GroupLineDetail: GroupLineDetail;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">GroupLineDetail</span>for this type of line.
   */
  DetailType: "GroupLineDetail";
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer
   */
  LineNum?: number;
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
}

export interface RefundReceipt_Line_DescriptionOnlyLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the transaction, the request is considered an update operation for the description line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the transaction then the request is considered a create operation for the description line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">DescriptionOnly</span>for this type of line.
   */
  DetailType: "DescriptionOnly";
  /**
   * META: * Required
   */
  DescriptionLineDetail: DescriptionLineDetail;
  /**
   * META: Optional ,max character: max 4000 chars
   *
   * DESCRIPTION: A string representing one of the following:
   * <li>
Free form text description of the line item that appears in the printed record.
</li>
<li>
A subtotal line inline with other lines on the sales form and holds the sum of amounts on all lines above it. This is distinct from the overall transaction subtotal represented with a SubTotal detail line.
</li><li>
In create requests, set to <span class="literal">Subtotal:</span> (case sensitive) to create the subtotal line; the amount is generated by QuickBooks Online business logic.
</li>
<li>
In read requests, lines with <span class="literal">Subtotal: nn.nn</span> returned in this field denote subtotal lines in the object.
</li>
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer.
   */
  LineNum?: number;
  /**
   * META: read only ,minorVersion: 23
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item. Available when <span class="literal">Amount</span> is set via the QuickBooks UI. Returned only for Description Only line items that have a non-empty amount associated with them.
   */
  readonly Amount?: number;
}

export interface RefundReceipt_Line_DiscountLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>
If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.
</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation. Not supported for BillPayment, Estimate, Invoice, or Payment objects.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Discount detail type for the entire transaction. This is in contrast to a discount applied to a specific line. The company preference
   * <strong>Sales Form Entry | Discounts</strong> must be enabled for this type of line to be available. Must be enabled for this type of line to be available.
   */
  DiscountLineDetail: DiscountLineDetail;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">DiscountLineDetail</span>for this type of line.
   */
  DetailType: "DiscountLineDetail";
  /**
   * META: * Required ,max character: max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   */
  Amount: number;
  /**
   * META: Optional ,max character: max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer.
   */
  LineNum?: number;
}

export interface RefundReceipt_Line_SubTotalLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>
If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.
</li>
<li>
If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.
</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Subtotal <strong>LineDetail</strong>
   */
  SubtotalLineDetail: LineDetail;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to <span class="literal">SubtotalLineDetail</span>for this type of line.
   */
  DetailType: "SubTotalLineDetail";
  /**
   * META: * Required ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   */
  Amount: number;
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer
   */
  LineNum?: number;
}

export interface RefundReceipt_CheckPayment {
  /**
   * META: Optional
   *
   * DESCRIPTION: The check number printed on the check.
   */
  CheckNum?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Status of the check. Values provided by service/business logic.
   */
  Status?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Name of persons or entities holding the account, as printed on the check.
   */
  NameOnAcct?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Checking account number, as printed on the check.
   */
  AcctNum?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: The name of the bank on which the check was drawn.
   */
  BankName?: string;
}

export interface RefundReceipt_TxnTaxDetail_TaxLine_Line {
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">TaxLineDetail</span>for this type of line.
   */
  DetailType: "TaxLineDetail";
  /**
   * META: * Required
   *
   * DESCRIPTION: <strong>TaxLineDetail</strong>
   */
  TaxLineDetail: TaxLineDetail;
  /**
   * META: Optional ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of tax for this tax line.  This value is negative for JournalEntry objects with <span class="literal">PostingType</span> set to <span class="literal">Credit.</span>
   */
  Amount?: number;
}

export interface RefundReceipt {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object.
   * Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Account from which payment money is refunded. Query the Account name list resource to determine the appropriate Account object for this reference, where <span class="literal">Account.AccountType</span> is <span class="literal">Other Current Asset</span> or <span class="literal">Bank</span>. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">DepositToAccountRef.value</span> and <span class="literal">DepositToAccountRef.name</span>, respectively.
   */
  DepositToAccountRef: ReferenceType;
  /**
   * META: * Required
   *
   * DESCRIPTION: Individual line items of a transaction. 
   * Valid <span class="literal">Line</span> types include:
<span class="literal">SalesItemLine</span>,
<span class="literal">GroupLine</span>,
<span class="literal">DescriptionOnlyLine</span>,
<span class="literal">DiscountLine</span> and 
<span class="literal">SubTotalLine</span>(read-only)
   */
  Line: (RefundReceipt_Line_SalesItemLine | RefundReceipt_Line_GroupLine | RefundReceipt_Line_DescriptionOnlyLine | RefundReceipt_Line_DiscountLine | RefundReceipt_Line_SubTotalLine)[];
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Reference to the currency in which all amounts on the associated transaction are expressed. This must be defined if multicurrency is enabled for the company.
   * Multicurrency is enabled for the company if <span class="literal">Preferences.MultiCurrencyEnabled</span> is set to <span class="literal">true</span>. Read more about multicurrency support <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/manage-multiple-currencies" title="Currency">here</a>. Required if multicurrency is enabled for the company.
   */
  CurrencyRef?: CurrencyRefType;
  /**
   * META: * Conditionally required ,  ,max character: Maximum 100 chars
   *
   * DESCRIPTION: The reference number for the payment received. For example, check # for a check, envelope # for a cash donation.
   * <li>Provide when <span class="literal">DepositToAccountRef</span> references an Account object where <span class="literal">Account.AccountType=Bank</span>.</li>
<li>Required when <span class="literal">PrintStatus</span> is set to <span class="literal">PrintComplete</span>. </li>
<li>If <span class="literal">PrintStatus</span> is set to <span class="literal">NeedToPrint</span>, the system sets <span class="literal">PaymentRefNum</span> to <span class="literal">To Print</span>.</li>
   */
  PaymentRefNum?: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Identifies the e-mail address where the invoice is sent. If
   * <span class="literal">EmailStatus=NeedToSend</span>,
<span class="literal">BillEmail</span>is a required input.
   */
  BillEmail?: EmailAddress;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: The date entered by the user when this transaction occurred.
   * For posting transactions, this is the posting date that affects the financial statements. If the date is not supplied, the current date on the server is used.
<br>Sort order is ASC by default.
   */
  TxnDate?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: One of, up to three custom fields for the transaction. Available for custom fields so configured for the company. Check <span class="literal">Preferences.SalesFormsPrefs.CustomField</span> and <span class="literal">Preferences.VendorAndPurchasesPrefs.POCustomField</span> for custom fields currenly configured. <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/create-custom-fields" title="Custom Fields">Click here</a> to learn about managing custom fields.
   */
  CustomField?: CustomField[];
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the Class associated with the transaction. Available if <span class="literal">Preferences.AccountingInfoPrefs.ClassTrackingPerTxn</span> is set to <span class="literal">true</span>. Query the Class name list resource to determine the appropriate Class object for this reference. Use <span class="literal">Class.Id</span> and <span class="literal">Class.Name</span> from that object for <span class="literal">ClassRef.value</span> and <span class="literal">ClassRef.name</span>, respectively.
   */
  ClassRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Printing status of the invoice.
   * Valid values:
<span class="literal">NotSet</span>,
<span class="literal">NeedToPrint</span>,
<span class="literal">PrintComplete
</span>.
   */
  PrintStatus?: string;
  /**
   * META: Optional ,max character: max 21 characters
   *
   * DESCRIPTION: Information about a check payment for the transaction. Used when PaymentType is <span class="literal">Check</span>.
   */
  CheckPayment?: RefundReceipt_CheckPayment;
  /**
   * META: Optional
   *
   * DESCRIPTION: The originating source of the credit card transaction. Used in eCommerce apps where credit card transactions are processed by a merchant account. When set to <span class="literal">IntuitPayment</span>, this transaction is inserted into a list of pending deposits to be automatically matched and reconciled with the merchant's account when the transactions made via QuickBooks Payments settle. Currently, the only supported value is <span class="literal">IntuitPayment</span>.
   */
  TxnSource?: string;
  /**
   * META: Optional ,
   *
   * DESCRIPTION: Method in which tax is applied. Allowed values are:
   * <span class="literal">TaxExcluded</span>,
<span class="literal">TaxInclusive</span>, and
<span class="literal">NotApplicable</span>.
   */
  GlobalTaxCalculation?: "TaxExcluded" | "TaxInclusive" | "NotApplicable";
  /**
   * META: Optional ,minorVersion: 4 ,
   *
   * DESCRIPTION: The account location. Valid values include:
   * <li><span class="literal">WithinFrance</span></li>
<li><span class="literal">FranceOverseas</span></li>
<li><span class="literal">OutsideFranceWithEU</span></li>
<li><span class="literal">OutsideEU</span></li>

For France locales, only.
   */
  TransactionLocationType?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the entity. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: Optional ,max character: Maximum of 21 chars
   *
   * DESCRIPTION: Reference number for the transaction. If not explicitly provided at create time, this field is populated based on the setting of <span class="literal">Preferences:CustomTxnNumber</span> as follows:
   * <li>If <span class="literal">Preferences:CustomTxnNumber</span> is true a custom value can be provided. If no value is supplied, the resulting DocNumber is null.</li>
<li>If <span class="literal">Preferences:CustomTxnNumber</span> is false, resulting DocNumber is system generated by incrementing the last number by 1.</li>

Recommended best practice: check the setting of <span class="literal">Preferences:CustomTxnNumber</span> before setting DocNumber. If a duplicate DocNumber needs to be supplied, add the query parameter name/value pair, <span class="literal">include=allowduplicatedocnum</span> to the URI. <br><em>Note:</em> DocNumber is an optional field for all locales except France. For France locale if <span class="literal">Preferences:CustomTxnNumber</span> is enabled it will <b>not</b> be automatically generated and is a required field. <br>Sort order is ASC by default.
   */
  DocNumber?: string;
  /**
   * META: Optional ,max character: Max of 4000 chars
   *
   * DESCRIPTION: User entered, organization-private note about the transaction. This note does not appear on the refund receipt to the customer. This field maps to the Memo field on the refund receipt form.
   */
  PrivateNote?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: User-entered message to the customer; this message is visible to end user on their transaction.
   */
  CustomerMemo?: MemoRef;
  /**
   * META: Optional ,minorVersion: 69
   *
   * DESCRIPTION: Reference to the <span class="literal">Project</span> ID associated with this transaction. Available with Minor Version 69 and above
   */
  ProjectRef?: ReferenceType;
  /**
   * META: Optional ,max character: Max 21 characters
   *
   * DESCRIPTION: Information about a credit card payment for the transaction. Used when PaymentType is <span class="literal">CreditCard</span>. Inject with data only if the payment was transacted through Intuit Payments API.
   */
  CreditCardPayment?: CreditCardPayment;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use <span class="literal">Customer.Id</span> and <span class="literal">Customer.DisplayName</span> from that object for <span class="literal">CustomerRef.value</span> and <span class="literal">CustomerRef.name</span>, respectively.
   */
  CustomerRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: This data type provides information for taxes charged on the transaction as a whole. It captures the details sales taxes calculated for the transaction based on the tax codes referenced by the transaction. This can be calculated by QuickBooks business logic or you may supply it when adding a transaction. See <a href="https://developer.intuit.com/app/developer/qbo/docs/workflows/manage-sales-tax-for-non-us-locales" title="Global Tax Model">Global tax model</a> for more information about this element.
   * If sales tax is disabled (<span class="literal">Preferences.TaxPrefs.UsingSalesTax</span> is set to <span class="literal">false</span>) then <span class="literal">TxnTaxDetail</span> is ignored and not stored.
   */
  TxnTaxDetail?: TxnTaxDetail;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to a PaymentMethod associated with this transaction. Query the PaymentMethod name list resource to determine the appropriate PaymentMethod object for this reference. Use <span class="literal">PaymentMethod.Id</span> and <span class="literal">PaymentMethod.Name</span> from that object for <span class="literal">PaymentMethodRef.value</span> and <span class="literal">PaymentMethodRef.name</span>, respectively.
   */
  PaymentMethodRef?: ReferenceType;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The number of home currency units it takes to equal one unit of currency specified by <span class="literal">CurrencyRef</span>. Applicable if multicurrency is enabled for the company.
   */
  ExchangeRate?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: Identifies the address where the goods must be shipped. If
   * <span class="literal">ShipAddr</span>is not specified, and a default
<span class="literal">Customer:ShippingAddr</span> is specified in QuickBooks for this customer, the default ship-to address will be used by QuickBooks. <br> For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country. <br>If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:<p></p><ul><li><span class="literal">Line1</span> and <span class="literal">Line2</span> elements are populated with the customer name and company name.</li><li>Original <span class="literal">Line1</span> through <span class="literal">Line 5</span> contents, <span class="literal">City</span>, <span class="literal">SubDivisionCode</span>, and <span class="literal">PostalCode</span> flow into <span class="literal">Line3</span> through <span class="literal">Line5</span>as a free format strings.</li></ul>
   */
  ShipAddr?: PhysicalAddress;
  /**
   * META: Optional
   *
   * DESCRIPTION: A reference to a Department object specifying the location of the transaction. Available if <span class="literal">Preferences.AccountingInfoPrefs.TrackDepartments</span> is set to <span class="literal">true</span>.
   * <br>Query the Department name list resource to determine the appropriate department object for this reference. Use <span class="literal">Department.Id</span> and <span class="literal">Department.Name</span> from that object for <span class="literal">DepartmentRef.value</span> and <span class="literal">DepartmentRef.name</span>, respectively.
   */
  DepartmentRef?: ReferenceType;
  /**
   * META: Optional ,max character: Max 21 characters
   *
   * DESCRIPTION: Valid values are <span class="literal">Cash</span>, <span class="literal">Check</span>, <span class="literal">CreditCard</span>, or <span class="literal">Other</span>.
   */
  PaymentType?: "Cash" | "Check" | "CreditCard" | "Other";
  /**
   * META: Optional
   *
   * DESCRIPTION: Bill-to address of the Invoice. If
   * <span class="literal">BillAddr</span>is not specified, and a default
<span class="literal">Customer:BillingAddr</span> is specified in QuickBooks for this customer, the default bill-to address is used by QuickBooks. <br>For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country. <br>If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:<p></p><ul><li><span class="literal">Line1</span> and <span class="literal">Line2</span> elements are populated with the customer name and company name.</li><li>Original <span class="literal">Line1</span> through <span class="literal">Line 5</span> contents, <span class="literal">City</span>, <span class="literal">SubDivisionCode</span>, and <span class="literal">PostalCode</span> flow into <span class="literal">Line3</span> through <span class="literal">Line5</span>as a free format strings.</li></ul>
   */
  BillAddr?: PhysicalAddress;
  /**
   * META: Optional ,
   *
   * DESCRIPTION: If false or null, calculate the sales tax first, and then apply the discount. If true, subtract the discount first and then calculate the sales tax. <span style="color:#800080;">Default Value:</span> false 
   *  <span style="color:#800080;">Constraints:</span> US versions of QuickBooks only.
   */
  ApplyTaxAfterDiscount?: boolean;
  /**
   * META: read only ,minorVersion: 3
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Convenience field containing the amount in <span class="literal">Balance</span> expressed in terms of the home currency. Calculated by QuickBooks business logic. Available when endpoint is evoked with the <span class="literal">minorversion=3</span> query parameter. Applicable if multicurrency is enabled for the company
   */
  readonly HomeBalance?: number;
  /**
   * META: read only ,minorVersion: 52
   *
   * DESCRIPTION: A reference to the Recurring Transaction. It captures what recurring transaction template the <span class="literal">RefundReceipt</span> was created from.
   */
  readonly RecurDataRef?: ReferenceType;
  /**
   * META: read only ,system defined
   *
   * ADDON: Big Decimal
   *
   * DESCRIPTION: Indicates the total amount of the transaction. This includes the total of all the charges, allowances, and taxes. Calculated by QuickBooks business logic; any value you supply is over-written by QuickBooks.
   */
  readonly TotalAmt?: number;
  /**
   * META: read only ,minorVersion: 21 ,system defined
   *
   * DESCRIPTION: Reference to the <span class="literal">TaxExepmtion</span> ID associated with this object. Available for companies that have <a href="https://developer.intuit.com/hub/blog/2017/12/11/using-quickbooks-online-api-automated-sales-tax" title="Automatic Sales Tax">automated sales tax</a> enabled.
   * <li><span class="literal">TaxExemptionRef.Name</span>: The Tax Exemption Id for the customer to which this object is associated. This Id is typically issued by the state.</li>
<li><span class="literal">TaxExemptionRef.value</span>: The system-generated Id of the exemption type.</li>

 For internal use only.
   */
  readonly TaxExemptionRef?: ReferenceType;
  /**
   * META: read only
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The balance reflecting any payments made against the transaction. Initially set to the value of
   * <span class="literal">TotalAmt</span>. Calculated by QuickBooks business logic; any value you supply is over-written by QuickBooks.
   */
  readonly Balance?: number;
  /**
   * META: read only ,system defined
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Total amount of the transaction in the home currency. Includes the total of all the charges, allowances and taxes. Calculated by QuickBooks business logic.
   * Value is valid only when <span class="literal">CurrencyRef</span> is specified. Applicable if multicurrency is enabled for the company.
   */
  readonly HomeTotalAmt?: number;
  /**
   * DESCRIPTION: If true, only fields specified will be updated
   */
  sparse?: boolean;
}

export interface SalesReceipt_Line_SalesItemLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to <span class="literal">SalesItemLineDetail</span>for this type of line.
   */
  DetailType: "SalesItemLineDetail";
  /**
   * META: * Required
   */
  SalesItemLineDetail: SalesItemLineDetail;
  /**
   * META: * Required ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   *  For Invoice objects in global locales: when updating <span class="literal">Amount</span>, remove the <span class="literal">TxnTaxDetail</span> element in the object before submitting it in the update request payload.
   */
  Amount: number;
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer
   */
  LineNum?: number;
}

export interface SalesReceipt_Line_GroupLineDetail_Line {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to <span class="literal">SalesItemLineDetail</span>for this type of line.
   */
  DetailType: "SalesItemLineDetail";
  /**
   * META: * Required
   */
  SalesItemLineDetail: SalesItemLineDetail;
  /**
   * META: * Required ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   *  For Invoice objects in global locales: when updating <span class="literal">Amount</span>, remove the <span class="literal">TxnTaxDetail</span> element in the object before submitting it in the update request payload.
   */
  Amount: number;
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer
   */
  LineNum?: number;
}

export interface SalesReceipt_Line_GroupLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   */
  GroupLineDetail: GroupLineDetail;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">GroupLineDetail</span>for this type of line.
   */
  DetailType: "GroupLineDetail";
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer
   */
  LineNum?: number;
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
}

export interface SalesReceipt_Line_DescriptionOnlyLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the transaction, the request is considered an update operation for the description line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the transaction then the request is considered a create operation for the description line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">DescriptionOnly</span>for this type of line.
   */
  DetailType: "DescriptionOnly";
  /**
   * META: * Required
   */
  DescriptionLineDetail: DescriptionLineDetail;
  /**
   * META: Optional ,max character: max 4000 chars
   *
   * DESCRIPTION: A string representing one of the following:
   * <li>
Free form text description of the line item that appears in the printed record.
</li>
<li>
A subtotal line inline with other lines on the sales form and holds the sum of amounts on all lines above it. This is distinct from the overall transaction subtotal represented with a SubTotal detail line.
</li><li>
In create requests, set to <span class="literal">Subtotal:</span> (case sensitive) to create the subtotal line; the amount is generated by QuickBooks Online business logic.
</li>
<li>
In read requests, lines with <span class="literal">Subtotal: nn.nn</span> returned in this field denote subtotal lines in the object.
</li>
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer.
   */
  LineNum?: number;
  /**
   * META: read only ,minorVersion: 23
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item. Available when <span class="literal">Amount</span> is set via the QuickBooks UI. Returned only for Description Only line items that have a non-empty amount associated with them.
   */
  readonly Amount?: number;
}

export interface SalesReceipt_Line_DiscountLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>
If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.
</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation. Not supported for BillPayment, Estimate, Invoice, or Payment objects.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Discount detail type for the entire transaction. This is in contrast to a discount applied to a specific line. The company preference
   * <strong>Sales Form Entry | Discounts</strong> must be enabled for this type of line to be available. Must be enabled for this type of line to be available.
   */
  DiscountLineDetail: DiscountLineDetail;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">DiscountLineDetail</span>for this type of line.
   */
  DetailType: "DiscountLineDetail";
  /**
   * META: * Required ,max character: max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   */
  Amount: number;
  /**
   * META: Optional ,max character: max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer.
   */
  LineNum?: number;
}

export interface SalesReceipt_Line_SubTotalLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>
If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.
</li>
<li>
If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.
</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Subtotal <strong>LineDetail</strong>
   */
  SubtotalLineDetail: LineDetail;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to <span class="literal">SubtotalLineDetail</span>for this type of line.
   */
  DetailType: "SubTotalLineDetail";
  /**
   * META: * Required ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   */
  Amount: number;
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer
   */
  LineNum?: number;
}

export interface SalesReceipt_LinkedTxn {
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction Id of the related transaction.
   */
  TxnId: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction type of the linked object.
   */
  TxnType: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Required for Deposit and Bill entities. The line number of a specific line of the linked transaction. If supplied, the
   * <span class="literal">TxnId</span> and
<span class="literal">TxnType</span> attributes of the linked transaction must also be populated.
   */
  TxnLineId?: string;
}

export interface SalesReceipt_TxnTaxDetail_TaxLine_Line {
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">TaxLineDetail</span>for this type of line.
   */
  DetailType: "TaxLineDetail";
  /**
   * META: * Required
   *
   * DESCRIPTION: <strong>TaxLineDetail</strong>
   */
  TaxLineDetail: TaxLineDetail;
  /**
   * META: Optional ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of tax for this tax line.  This value is negative for JournalEntry objects with <span class="literal">PostingType</span> set to <span class="literal">Credit.</span>
   */
  Amount?: number;
}

export interface SalesReceipt {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object.
   * Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Individual line items of a transaction. 
   * Valid <span class="literal">Line</span> types include:
<span class="literal">SalesItemLine</span>,
<span class="literal">GroupLine</span>,
<span class="literal">DescriptionOnlyLine</span>,
<span class="literal">DiscountLine</span> and 
<span class="literal">SubTotalLine</span> (read-only)
   */
  Line: (SalesReceipt_Line_SalesItemLine | SalesReceipt_Line_GroupLine | SalesReceipt_Line_DescriptionOnlyLine | SalesReceipt_Line_DiscountLine | SalesReceipt_Line_SubTotalLine)[];
  /**
   * META: * Required
   *
   * DESCRIPTION: Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use <span class="literal">Customer.Id</span> and <span class="literal">Customer.DisplayName</span> from that object for <span class="literal">CustomerRef.value</span> and <span class="literal">CustomerRef.name</span>, respectively.
   */
  CustomerRef: ReferenceType;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Reference to the currency in which all amounts on the associated transaction are expressed. This must be defined if multicurrency is enabled for the company.
   * <br>Multicurrency is enabled for the company if <span class="literal">Preferences.MultiCurrencyEnabled</span> is set to <span class="literal">true</span>. Read more about multicurrency support <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/manage-multiple-currencies" title="Currency">here</a>. Required if multicurrency is enabled for the company
   */
  CurrencyRef?: CurrencyRefType;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Identifies the e-mail address where the invoice is sent. Required if <span class="literal">EmailStatus=NeedToSend</span>
   */
  BillEmail?: EmailAddress;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: The date entered by the user when this transaction occurred.
   * For posting transactions, this is the posting date that affects the financial statements. If the date is not supplied, the current date on the server is used.
<br>Sort order is ASC by default.
   */
  TxnDate?: string;
  /**
   * META: Optional ,minorVersion: 35
   *
   * DESCRIPTION: Identifies the address where the goods are shipped from. For transactions without shipping, it represents the address where the sale took place.<br> For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country. <br> If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:<p></p><ul><li><span class="literal">Line1</span> and <span class="literal">Line2</span> elements are populated with the customer name and company name.</li><li>Original <span class="literal">Line1</span> through <span class="literal">Line 5</span> contents, <span class="literal">City</span>, <span class="literal">SubDivisionCode</span>, and <span class="literal">PostalCode</span> flow into <span class="literal">Line3</span> through <span class="literal">Line5</span>as a free format strings.</li></ul>
   */
  ShipFromAddr?: PhysicalAddress;
  /**
   * META: Optional
   *
   * DESCRIPTION: One of, up to three custom fields for the transaction. Available for custom fields so configured for the company. Check <span class="literal">Preferences.SalesFormsPrefs.CustomField</span> and <span class="literal">Preferences.VendorAndPurchasesPrefs.POCustomField</span> for custom fields currenly configured. <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/create-custom-fields" title="Custom Fields">Click here</a> to learn about managing custom fields.
   */
  CustomField?: CustomField[];
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: Location of the transaction, as defined using location tracking in QuickBooks Online.
   */
  ShipDate?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Shipping provider's tracking number for the delivery of the goods associated with the transaction.
   */
  TrackingNum?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the Class associated with the transaction. Available if <span class="literal">Preferences.AccountingInfoPrefs.ClassTrackingPerTxn</span> is set to <span class="literal">true</span>. Query the Class name list resource to determine the appropriate Class object for this reference. Use <span class="literal">Class.Id</span> and <span class="literal">Class.Name</span> from that object for <span class="literal">ClassRef.value</span> and <span class="literal">ClassRef.name</span>, respectively.
   */
  ClassRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Printing status of the invoice.
   * Valid values:
<span class="literal">NotSet</span>,
<span class="literal">NeedToPrint</span>,
<span class="literal">PrintComplete
</span>.
   */
  PrintStatus?: string;
  /**
   * META: Optional ,max character: Max 21 characters
   *
   * DESCRIPTION: The reference number for the payment received. For example, Â&nbsp;Check # for a check, envelope # for a cash donation.
   */
  PaymentRefNum?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Used internally to specify originating source of a credit card transaction.
   */
  TxnSource?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Zero or more related transactions to this sales receipt object. The following linked relationships are supported:<ul><li>
   * Links to <span class="literal">Estimate</span> and <span class="literal">TimeActivity</span> objects can be established directly to this sales receipt object with UI or with the API. Create, Read, Update, and Query operations are avaialble at the API level for these types of links.
</li>
<li>Only one link can be made to an <span class="literal">Estimate</span>. </li><li>
Links to expenses incurred on behalf of the customer are returned in the response with <span class="literal">LinkedTxn.TxnType</span> set to <span class="literal">ReimburseCharge</span>, <span class="literal">ChargeCredit</span> or <span class="literal">StatementCharge</span> corresponding to billable customer expenses of type <span class="literal">Cash</span>, <span class="literal">Delayed Credit</span>, and <span class="literal">Delayed Charge</span>, respectively. Links to these types of transactions are established within the QuickBooks UI, only, and are available as read-only at the API level.
</li>
<li>
Links to payments applied to an sales receipt object are returned in the response with <span class="literal">LinkedTxn.TxnType</span> set to <span class="literal">Payment</span>. Links to Payment transactions are established within the QuickBooks UI, only, and are available as read-only at the API level.
</li>
<li>Links the sales receipt to refundReceipt objects that are applied to the sales receipt. Returned in the response if 
<span class="literal">linkedTxnTxnType</span> is a refundReceipt. Note that linking sales receipts to refund receipts can only be done via the customer-facing QuickBooks UI. This is only available as read-only via our API
</li>
</ul>
Use <span class="literal">LinkedTxn.TxnId</span> as the ID in a separate read request for the specific resource to retrieve details of the linked object.
   */
  LinkedTxn?: SalesReceipt_LinkedTxn[];
  /**
   * META: Optional ,
   *
   * DESCRIPTION: Method in which tax is applied. Allowed values are:
   * <span class="literal">TaxExcluded</span>,
<span class="literal">TaxInclusive</span>, and
<span class="literal">NotApplicable</span>.
   */
  GlobalTaxCalculation?: "TaxExcluded" | "TaxInclusive" | "NotApplicable";
  /**
   * META: Optional ,minorVersion: 4 ,
   *
   * DESCRIPTION: The account location. Valid values include:
   * <li><span class="literal">WithinFrance</span></li>
<li><span class="literal">FranceOverseas</span></li>
<li><span class="literal">OutsideFranceWithEU</span></li>
<li><span class="literal">OutsideEU</span></li>

For France locales, only.
   */
  TransactionLocationType?: string;
  /**
   * META: Optional ,
   *
   * DESCRIPTION: If false or null, calculate the sales tax first, and then apply the discount. If true, subtract the discount first and then calculate the sales tax.
   * <span style="color:#800080;">Default Value:</span> false
<span style="color:#800080;">Constraints:</span> US versions of QuickBooks only.
   */
  ApplyTaxAfterDiscount?: boolean;
  /**
   * META: Optional ,max character: Maximum of 21 chars
   *
   * DESCRIPTION: Reference number for the transaction. If not explicitly provided at create time, this field is populated based on the setting of <span class="literal">Preferences:CustomTxnNumber</span> as follows:
   * <li>If <span class="literal">Preferences:CustomTxnNumber</span> is true a custom value can be provided. If no value is supplied, the resulting DocNumber is null.</li>
<li>If <span class="literal">Preferences:CustomTxnNumber</span> is false, resulting DocNumber is system generated by incrementing the last number by 1.</li>

If <span class="literal">Preferences:CustomTxnNumber</span> is false then do not send a value as it can lead to unwanted duplicates. If a DocNumber value is sent for an Update operation, then it just updates that particular invoice and does not alter the internal system DocNumber.  <br><em>Note:</em> DocNumber is an optional field for all locales except France. For France locale if <span class="literal">Preferences:CustomTxnNumber</span> is enabled it will <b>not</b> be automatically generated and is a required field.
   */
  DocNumber?: string;
  /**
   * META: Optional ,max character: Max of 4000 chars
   *
   * DESCRIPTION: User entered, organization-private note about the transaction. This note does not appear on the transaction form to the customer. This field maps to the Memo field on the Sales Receipt form.
   */
  PrivateNote?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Account to which payment money is deposited. Query the Account name list resource to determine the appropriate Account object for this reference, where <span class="literal">Account.AccountType</span> is <span class="literal">Other Current Asset</span> or <span class="literal">Bank</span>. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">DepositToAccountRef.value</span> and <span class="literal">DepositToAccountRef.name</span>, respectively.
   * <br>If you do not specify this account, payment is applied to the Undeposited Funds account.
   */
  DepositToAccountRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: User-entered message to the customer; this message is visible to end user on their transactions.
   */
  CustomerMemo?: MemoRef;
  /**
   * META: Optional
   *
   * DESCRIPTION: Email status of the receipt.
   * Valid values:
<span class="literal">NotSet</span>,
<span class="literal">NeedToSend</span>,
<span class="literal">EmailSent
</span>.
   */
  EmailStatus?: string;
  /**
   * META: Optional ,minorVersion: 69
   *
   * DESCRIPTION: Reference to the <span class="literal">Project</span> ID associated with this transaction. Available with Minor Version 69 and above
   */
  ProjectRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Information about a credit card payment for the transaction. Used when PaymentType is <span class="literal">CreditCard</span>. Inject with data only if the payment was transacted through Intuit Payments API.
   */
  CreditCardPayment?: CreditCardPayment;
  /**
   * META: Optional
   *
   * DESCRIPTION: This element provides information for taxes charged on the transaction as a whole. It captures the details sales taxes calculated for the transaction based on the tax codes referenced by the transaction. This can be calculated by QuickBooks business logic or you may supply it when adding a transaction. See <a href="https://developer.intuit.com/app/developer/qbo/docs/workflows/manage-sales-tax-for-non-us-locales" title="Global Tax Model">Global tax model</a> for more information about this element.
   * If sales tax is disabled (<span class="literal">Preferences.TaxPrefs.UsingSalesTax</span> is set to <span class="literal">false</span>) then <span class="literal">TxnTaxDetail</span> is ignored and not stored.
   */
  TxnTaxDetail?: TxnTaxDetail;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to a PaymentMethod associated with this transaction. Query the PaymentMethod name list resource to determine the appropriate PaymentMethod object for this reference. Use <span class="literal">PaymentMethod.Id</span> and <span class="literal">PaymentMethod.Name</span> from that object for <span class="literal">PaymentMethodRef.value</span> and <span class="literal">PaymentMethodRef.name</span>, respectively.
   */
  PaymentMethodRef?: ReferenceType;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The number of home currency units it takes to equal one unit of currency specified by <span class="literal">CurrencyRef</span>. Applicable if multicurrency is enabled for the company.
   */
  ExchangeRate?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: Identifies the address where the goods must be shipped. If
   * <span class="literal">ShipAddr</span>is not specified, and a default
<span class="literal">Customer:ShippingAddr</span> is specified in QuickBooks for this customer, the default ship-to address will be used by QuickBooks. <br> For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country. <br> If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:<p></p><ul><li><span class="literal">Line1</span> and <span class="literal">Line2</span> elements are populated with the customer name and company name.</li><li>Original <span class="literal">Line1</span> through <span class="literal">Line 5</span> contents, <span class="literal">City</span>, <span class="literal">SubDivisionCode</span>, and <span class="literal">PostalCode</span> flow into <span class="literal">Line3</span> through <span class="literal">Line5</span>as a free format strings.</li></ul>
   */
  ShipAddr?: PhysicalAddress;
  /**
   * META: Optional
   *
   * DESCRIPTION: A reference to a Department object specifying the location of the transaction. Available if <span class="literal">Preferences.AccountingInfoPrefs.TrackDepartments</span> is set to <span class="literal">true</span>.
   * <br>Query the Department name list resource to determine the appropriate department object for this reference. Use <span class="literal">Department.Id</span> and <span class="literal">Department.Name</span> from that object for <span class="literal">DepartmentRef.value</span> and <span class="literal">DepartmentRef.name</span>, respectively.
   */
  DepartmentRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the ShipMethod associated with the transaction. There is no shipping method list. Reference resolves to a string.
   */
  ShipMethodRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Bill-to address of the Invoice. If
   * <span class="literal">BillAddr</span>is not specified, and a default
<span class="literal">Customer:BillingAddr</span> is specified in QuickBooks for this customer, the default bill-to address is used by QuickBooks. <br> For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country. <br> If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:<p></p><ul><li><span class="literal">Line1</span> and <span class="literal">Line2</span> elements are populated with the customer name and company name.</li><li>Original <span class="literal">Line1</span> through <span class="literal">Line 5</span> contents, <span class="literal">City</span>, <span class="literal">SubDivisionCode</span>, and <span class="literal">PostalCode</span> flow into <span class="literal">Line3</span> through <span class="literal">Line5</span>as a free format strings.</li></ul>
   */
  BillAddr?: PhysicalAddress;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: read only ,minorVersion: 3
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Convenience field containing the amount in <span class="literal">Balance</span> expressed in terms of the home currency. Calculated by QuickBooks business logic. Value is valid only when <span class="literal">CurrencyRef</span> is specified and available when endpoint is evoked with the <span class="literal">minorversion=3</span> query parameter. Applicable if multicurrency is enabled for the company
   */
  readonly HomeBalance?: number;
  /**
   * META: read only
   *
   * DESCRIPTION: Email delivery information. Returned when a request has been made to deliver email with the send operation.
   */
  readonly DeliveryInfo?: DeliveryInfo;
  /**
   * META: read only ,minorVersion: 52
   *
   * DESCRIPTION: A reference to the Recurring Transaction. It captures what recurring transaction template the <span class="literal">SalesReceipt</span> was created from.
   */
  readonly RecurDataRef?: ReferenceType;
  /**
   * META: read only ,system defined
   *
   * ADDON: Big Decimal
   *
   * DESCRIPTION: Indicates the total amount of the transaction. This includes the total of all the charges, allowances, and taxes. Calculated by QuickBooks business logic; any value you supply is over-written by QuickBooks. If you process a linked refund transaction against a specific transaction, the 
   * <span class="literal">totalAmt</span> value won't change. It will remain the same. However, voiding the linked refund will change the 
<span class="literal">totalAmt</span> value to O.
   */
  readonly TotalAmt?: number;
  /**
   * META: read only
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The balance reflecting any payments made against the transaction. Initially set to the value of
   * <span class="literal">TotalAmt</span>. A Balance of 0 indicates the invoice is fully paid. Calculated by QuickBooks business logic; any value you supply is over-written by QuickBooks.
   */
  readonly Balance?: number;
  /**
   * META: read only ,system defined
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Total amount of the transaction in the home currency. Includes the total of all the charges, allowances and taxes. Calculated by QuickBooks business logic.
   * Value is valid only when <span class="literal">CurrencyRef</span> is specified. Applicable if multicurrency is enabled for the company
   */
  readonly HomeTotalAmt?: number;
  /**
   * META: system defined
   *
   * DESCRIPTION: Denotes how <span class="literal">ShipAddr</span> is stored:&nbsp;formatted or unformatted. The value of this flag is system defined based on format of shipping address at object create time.<ul><li>If set to <span class="literal">false</span>, shipping address is returned in a formatted style using City, Country,&nbsp;CountrySubDivisionCode, Postal code.</li><li>If set to <span class="literal">true</span>, shipping address is returned in an unformatted style using Line1 through Line5 attributes.</li></ul>
   */
  FreeFormAddress?: boolean;
  /**
   * DESCRIPTION: If true, only fields specified will be updated
   */
  sparse?: boolean;
}

export interface TaxAgency {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object. Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required ,max character: Maximum of 100 chars
   *
   * DESCRIPTION: Name of the agency.
   */
  DisplayName: string;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: Optional ,read only
   *
   * DESCRIPTION: Denotes whether this tax agency is used to track tax on sales.
   */
  readonly TaxTrackedOnSales?: boolean;
  /**
   * META: Optional ,read only
   *
   * DESCRIPTION: Denotes whether this tax agency is used to track tax on purchases.
   */
  readonly TaxTrackedOnPurchases?: boolean;
  /**
   * META: Optional ,read only ,minorVersion: 6 ,
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: The last tax filing date for this tax agency. This field is automatically populated by QuickBooks business logic at tax filing time.
   */
  readonly LastFileDate?: string;
  /**
   * META: Optional ,read only
   *
   * DESCRIPTION: Registration number for the agency.
   */
  readonly TaxRegistrationNumber?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the entity. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: read only ,minorVersion: 46
   *
   * DESCRIPTION: Flag to identify whether the TaxAgency is system defined by Automated Sales Tax engine or user generated. Valid values include 
   * <span class="literal">USER_DEFINED</span>, 
<span class="literal">SYSTEM_GENERATED</span>SYSTEM_GENERATED.
   */
  readonly TaxAgencyConfig?: string;
}

export interface TaxService_TaxRateDetails {
  /**
   * META: * Required
   *
   * ADDON: Percentage as String
   *
   * DESCRIPTION: Required if: <span class="literal">TaxRateId</span>not present.
   * The rate value. Must be between 0 and 100 (%). For create requests: do not include if
<span class="literal">TaxRateId</span>has been specified.
   */
  RateValue: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Required if: 
   * <span class="literal">TaxRateName</span>,
<span class="literal">RateValue</span>, and
<span class="literal">TaxAgencyId</span>not present.
The Id of an existing TaxRate. Query the TaxRate endpoint to determine the ID used for
<span class="literal">TaxRateId</span>.
   */
  TaxRateId: string;
  /**
   * META: * Conditionally required ,
   *
   * ADDON: Integer as String
   *
   * DESCRIPTION: The Id of the agency to whom tax is paid. Query the TaxAgency resource to determine the ID for the desired agency. For create requests: do not include if
   * <span class="literal">TaxRateId</span>has been specified. Required if <span class="literal">TaxRateId</span>not present.
   */
  TaxAgencyId?: string;
  /**
   * META: * Conditionally required ,  ,max character: Max 10 chars
   *
   * DESCRIPTION: Required if <span class="literal">TaxRateId</span>not present. Name of a new tax rate. In Create requests: ignored if
   * <span class="literal">TaxRateId</span>is present.
   */
  TaxRateName?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Specifies where this tax rate can be applied. Possible values are
   * <span class="literal">Sales</span> or
<span class="literal">Purchase</span>.
   */
  TaxApplicableOn?: "Sales" | "Purchase";
}

export interface TaxService {
  /**
   * META: * Required ,max character: maximum of 100 chars
   *
   * DESCRIPTION: Name of new tax code. For current TaxCodes, query the TaxCode resource.
   */
  TaxCode: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Container to hold one or more tax rate specifications.
   */
  TaxRateDetails: TaxService_TaxRateDetails[];
  /**
   * META: Optional ,read only ,system defined
   *
   * DESCRIPTION: The id of the newly created tax code. This is generated by Data Services and returned in the response code.
   */
  readonly TaxCodeId?: string;
}

export interface TaxCode_PurchaseTaxRateList_TaxRateDetail_TaxRateRef {
  /**
   * META: * Required
   *
   * DESCRIPTION: The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.
   */
  value: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: An identifying name for the object being referenced by <span class="literal">value</span> and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use <span class="literal">Customer.DisplayName</span> to populate this field. Optionally returned in responses, implementation dependent.
   */
  name?: string;
}

export interface TaxCode_PurchaseTaxRateList_TaxRateDetail {
  /**
   * META: * Required
   *
   * DESCRIPTION: Reference to the tax rate.
   */
  TaxRateRef: TaxCode_PurchaseTaxRateList_TaxRateDetail_TaxRateRef;
  /**
   * META: Optional
   *
   * DESCRIPTION: Applicable TaxType enum. Valid values: TaxOnAmount, TaxOnAmountPlusTax, TaxOnTax
   */
  TaxTypeApplicable?: string;
  /**
   * META: Optional
   *
   * ADDON: Integer
   *
   * DESCRIPTION: Applicable Tax Order.
   */
  TaxOrder?: number;
}

export interface TaxRateList {
  /**
   * META: Optional
   *
   * DESCRIPTION: TaxRateDetail that specifies qualified detail of TaxRate.
   */
  TaxRateDetail?: TaxCode_PurchaseTaxRateList_TaxRateDetail[];
}

export interface TaxCode_SalesTaxRateList_TaxRateDetail_TaxRateRef {
  /**
   * META: * Required
   *
   * DESCRIPTION: The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.
   */
  value: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: An identifying name for the object being referenced by <span class="literal">value</span> and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use <span class="literal">Customer.DisplayName</span> to populate this field. Optionally returned in responses, implementation dependent.
   */
  name?: string;
}

export interface TaxCode_SalesTaxRateList_TaxRateDetail {
  /**
   * META: * Required
   *
   * DESCRIPTION: Reference to the tax rate.
   */
  TaxRateRef: TaxCode_SalesTaxRateList_TaxRateDetail_TaxRateRef;
  /**
   * META: Optional
   *
   * DESCRIPTION: Applicable TaxType enum. Valid values: TaxOnAmount, TaxOnAmountPlusTax, TaxOnTax
   */
  TaxTypeApplicable?: string;
  /**
   * META: Optional
   *
   * ADDON: Integer
   *
   * DESCRIPTION: Applicable Tax Order.
   */
  TaxOrder?: number;
}

export interface TaxCode {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object. Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required ,max character: Maximum of 100 chars
   *
   * DESCRIPTION: User recognizable name for the tax sales code.
   */
  Name: string;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: List of references to tax rates that apply for purchase transactions when this tax code represents a group of tax rates. Required when <span class="literal">TaxGroup</span> is set to <span class="literal">true</span>
   */
  PurchaseTaxRateList?: TaxRateList;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: List of references to tax rates that apply for sales transactions when this tax code represents a group of tax rates. Required when <span class="literal">TaxGroup</span> is set to <span class="literal">true</span>
   */
  SalesTaxRateList?: TaxRateList;
  /**
   * META: Optional ,read only
   *
   * DESCRIPTION: <span class="literal">true</span>—-this object represents a group of one or more tax rates.
   * <span class="literal">false</span>—-this object represents pseudo-tax codes TAX and NON.
   */
  readonly TaxGroup?: boolean;
  /**
   * META: Optional ,read only
   *
   * DESCRIPTION: False or null means meaning non-taxable. True means taxable. Always true, except for the pseudo taxcode NON.
   */
  readonly Taxable?: boolean;
  /**
   * META: Optional
   *
   * DESCRIPTION: False if inactive. Inactive sales tax codes may be hidden from display and may not be used on financial transactions.
   */
  Active?: boolean;
  /**
   * META: Optional ,max character: maximum of 100 chars
   *
   * DESCRIPTION: User entered description for the sales tax code.
   */
  Description?: string;
  /**
   * META: Optional ,read only ,minorVersion: 21
   *
   * DESCRIPTION: Read-only. Denotes whether active tax codes are displayed on transactions.
   * <span class="literal">true</span>—-This tax code is hidden on transactions.
<span class="literal">false</span>—-This tax code is displayed on transactions.
   */
  readonly Hidden?: boolean;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: read only ,minorVersion: 51
   *
   * DESCRIPTION: Flag to identify whether the TaxCode is system defined by Automated Sales Tax engine or user generated. Valid values include 
   * <span class="literal">USER_DEFINED</span>, 
<span class="literal">SYSTEM_GENERATED</span>SYSTEM_GENERATED.
   */
  readonly TaxCodeConfigType?: string;
}

export interface TaxRate_EffectiveTaxRate_EffectiveTaxRateData {
  /**
   * ADDON: Decimal
   *
   * DESCRIPTION: Represents rate value.
   */
  RateValue?: number;
  /**
   * DESCRIPTION: End date of this taxrate applicability:
   * <em>
<span class="literal">YYYY-MM-DDTHH:MM:SS
</span>
</em>
UTC:
<em></em>
<em>YYYY-MM-DD</em>T
<em>HH</em>
<em>:MM:</em>
<em>SS</em>Z
Specific time zone:
<em></em>
<span class="literal">
<em>YYYY-MM-DD</em>T</span>
<em>
<span class="literal">HH</span>
</em>
<em>
<span class="literal">:MM:SS</span>
</em>
<span class="literal">+/-
<em>HH</em>
<em>:MM</em>
</span>
   */
  EndDate?: string;
  /**
   * DESCRIPTION: Effective starting date for which this taxrate is applicable:
   * <em>
<span class="literal">YYYY-MM-DDTHH:MM:SS
</span>
</em>
UTC:
<em></em>
<em>YYYY-MM-DD</em>T
<em>HH</em>
<em>:MM:</em>
<em>SS</em>Z
Specific time zone:
<em></em>
<span class="literal">
<em>YYYY-MM-DD</em>T</span>
<em>
<span class="literal">HH</span>
</em>
<em>
<span class="literal">:MM:SS</span>
</em>
<span class="literal">+/-
<em>HH</em>
<em>:MM</em>
</span>
   */
  EffectiveDate?: string;
}

export interface TaxRate {
  /**
   * META: Optional ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object.
   * Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: Optional ,read only
   *
   * DESCRIPTION: Value of the tax rate.
   */
  readonly RateValue?: string;
  /**
   * META: Optional ,max character: Maximum of 100 chars ,read only
   *
   * DESCRIPTION: User recognizable name for the tax rate.
   */
  readonly Name?: string;
  /**
   * META: Optional ,read only
   *
   * DESCRIPTION: Reference to the tax agency associated with this object.
   */
  readonly AgencyRef?: ReferenceType;
  /**
   * META: Optional ,read only
   *
   * ADDON: Miss spelled String
   *
   * DESCRIPTION: Special tax type to handle zero rate taxes. Used with VAT registered Businesses who receive goods/services (acquisitions) from other EU countries, will need to calculate the VAT due, but not paid, on these acquisitions. The rate of VAT payable is the same that would have been paid if the goods had been supplied by a UK supplier.
   */
  readonly SpecialTaxType?: string;
  /**
   * META: Optional ,read only
   *
   * DESCRIPTION: List of EffectiveTaxRate. An EffectiveTaxRate is used to know which taxrate is applicable on any date.
   */
  readonly EffectiveTaxRate?: TaxRate_EffectiveTaxRate_EffectiveTaxRateData;
  /**
   * META: Optional ,read only
   *
   * ADDON: Miss spelled String
   *
   * DESCRIPTION: TaxRate DisplayType enum which acts as display config.
   */
  readonly DisplayType?: string;
  /**
   * META: Optional ,read only
   *
   * DESCRIPTION: Reference to the tax return line associated with this object.
   */
  readonly TaxReturnLineRef?: ReferenceType;
  /**
   * META: Optional ,read only
   *
   * DESCRIPTION: If true, this object is currently enabled for use by QuickBooks.
   */
  readonly Active?: boolean;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: Optional ,read only ,minorVersion: 62 ,
   *
   * DESCRIPTION: ID of the original tax rate from which the new tax rate is derived. Helps to understand the relationship between corresponding tax rate entities.
   */
  readonly OriginalTaxRate?: string;
  /**
   * META: Optional ,max character: Maximum of 100 chars ,read only
   *
   * DESCRIPTION: User entered description for the tax rate.
   */
  readonly Description?: string;
}

export interface Term {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object. Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required ,max character: max 31 characters
   *
   * DESCRIPTION: User recognizable name for the term. For example, <span class="literal">Net 30</span>.
   */
  Name: string;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: Optional ,max character: Range is 0 through 100
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Discount percentage available against an amount if paid within the days specified by <span class="literal">DiscountDays</span>.
   */
  DiscountPercent?: number;
  /**
   * META: Optional ,max character: Range is 0 through 999
   *
   * ADDON: Integer
   *
   * DESCRIPTION: Discount applies if paid within this number of days. Used only when <span class="literal">DueDays</span> is specified.
   */
  DiscountDays?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: If true, this entity is currently enabled for use by QuickBooks.
   */
  Active?: boolean;
  /**
   * META: Optional ,system defined
   *
   * DESCRIPTION: Type of the Sales Term. Valid values:
   * <span class="literal">STANDARD</span>--Used if <span class="literal">DueDays</span> is not null.
<span class="literal">DATE_DRIVEN</span>--Used if <span class="literal">DueDays</span> is null.
   */
  Type?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: max character: Range is 1 through 31
   *
   * ADDON: Integer
   *
   * DESCRIPTION: Payment must be received by this day of the month. Used only if <span class="literal">DueDays</span> is not specified. Required if <span class="literal">DueDays</span> not present
   */
  DayOfMonthDue?: number;
  /**
   * META: max character: Range is 0 through 31
   *
   * ADDON: Positive Integer
   *
   * DESCRIPTION: Discount applies if paid before this day of month. Required if <span class="literal">DueDays</span> not present
   */
  DiscountDayOfMonth?: number;
  /**
   * META: max character: Range is 0 through 999
   *
   * ADDON: Positive Integer
   *
   * DESCRIPTION: Payment due next month if issued that many days before the <span class="literal">DayOfMonthDue</span>. Required if <span class="literal">DueDays</span> not present.
   */
  DueNextMonthDays?: number;
  /**
   * META: max character: Range is 0 through 999
   *
   * ADDON: Integer
   *
   * DESCRIPTION: Number of days from delivery of goods or services until the payment is due. Required if <span class="literal">DayOfMonthDue</span> not present
   */
  DueDays?: number;
}

export interface TimeActivity {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object. Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Enumeration of time activity types. Required in conjunction with either
   * <span class="literal">EmployeeRef</span>or
<span class="literal">VendorRef</span>attributes for create operations. Valid values:
<span class="literal">Vendor</span>or
<span class="literal">Employee</span>.
   */
  NameOf: string;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: * Conditionally required ,
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: The date for the time activity. This is the posting date that affects financial statements. If the date is not supplied, the current date on the server is used.
   * Sort order is ASC by default. If you provide the StartTime and EndTime without including the timeZone offset, then you would need to pass the TxnDate for any historical or future dates. 
 Lets say if you want to create a historical time activity then pass the TxnDate as the date and pass StartTime and EndTime as Hours without including the timeZone offset.
   */
  TxnDate?: string;
  /**
   * META: * Conditionally required ,  ,max character: Maximum of 8760 hours
59 minutes; if hours is 8760
minutes must be 0
   *
   * ADDON: Integer
   *
   * DESCRIPTION: Hours and minutes of break taken between <span class="literal">StartTime</span> and <span class="literal">EndTime</span>. use when <span class="litera">StartTime</span> and <span class="literal">EndTime</span> are specified
   */
  BreakHours?: number;
  BreakMinutes?: number;
  /**
   * META: * Conditionally required ,
   *
   * ADDON: Local time zone: YYYY-MM-DDTHH:MM:SS UTC: YYYY-MM-DDT HH :MM: SSZ Specific time zone: YYYY-MM-DDT HH :MM:SS +/- HH :MM
   *
   * DESCRIPTION: Time that work starts and ends, respectively. Required if <span class="literal">Hours</span> and <span class="literal">Minutes</span> not specified. 
   *  Note: Kindly consider only the Hours without including the timeZone offset as it does not impact time activity hours calculation.
   */
  EndTime?: string;
  /**
   * META: * Conditionally required ,  ,max character: Maximum of 8760 hours
59 minutes; If hours is 8760
minutes must be 0
   *
   * ADDON: Integer
   *
   * DESCRIPTION: Hours and minutes worked. Required if <span class="literal">StartTime</span> and <span class="literal">EndTime</span> not specified
   */
  Hours?: number;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Specifies the vendor whose time is being recorded. Query the Vendor name list resource to determine the appropriate Vendor object for this reference. Use <span class="literal">Vendor.Id</span> and <span class="literal">Vendor.Name</span> from that object for <span class="literal">VendorRef.value</span> and <span class="literal">VendorRef.name</span>, respectively. Required if <span class="literal">NameOf</span> is set to <span class="literal">Vendor</span>
   */
  VendorRef?: ReferenceType;
  /**
   * META: * Conditionally required ,  ,max character: 0 to 99999999999 hours
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Hourly bill rate of the employee or vendor for this time activity. Required if <span class="literal">BillableStatus</span> is set to <span class="literal">Billable</span>
   */
  HourlyRate?: number;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use <span class="literal">Customer.Id</span> and <span class="literal">Customer.DisplayName</span> from that object for <span class="literal">CustomerRef.value</span> and <span class="literal">CustomerRef.name</span>, respectively. Required if <span class="literal">BillableStatus</span> is set to <span class="literal">Billable</span>
   */
  CustomerRef?: ReferenceType;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Specifies the employee whose time is being recorded. Query the Employee name list resource to determine the appropriate Employee object for this reference. Use <span class="literal">Employee.Id</span> and <span class="literal">Employee.DisplayName</span> from that object for <span class="literal">EmployeerRef.value</span> and <span class="literal">EmployeeRef.Name</span>, respectively. Required if <span class="literal">NameOf</span> is set to <span class="literal">Employee</span>
   */
  EmployeeRef?: ReferenceType;
  /**
   * META: * Conditionally required ,
   *
   * ADDON: Local time zone: YYYY-MM-DDTHH:MM:SS UTC: YYYY-MM-DDT HH :MM: SSZ Specific time zone: YYYY-MM-DDT HH :MM:SS +/- HH :MM
   *
   * DESCRIPTION: Time that work starts and ends, respectively. Required if <span class="literal">Hours</span> and <span class="literal">Minutes</span> not specified. 
   *  Note: Kindly consider only the Hours without including the timeZone offset as it does not impact time activity hours calculation.
   */
  StartTime?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the Class associated with this object. Available if <span class="literal">Preferences.AccountingInfoPrefs.ClassTrackingPerTxn</span> is set to <span class="literal">true</span>. Query the Class name list resource to determine the appropriate Class object for this reference. Use <span class="literal">Class.Id</span> and <span class="literal">Class.Name</span> from that object for <span class="literal">ClassRef.value</span> and <span class="literal">ClassRef.name</span>, respectively.
   */
  ClassRef?: ReferenceType;
  /**
   * META: Optional ,max character: maximum 4000 characters
   *
   * DESCRIPTION: Description of work completed during time activity.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: True if the time recorded is both billable and taxable.
   */
  Taxable?: boolean;
  /**
   * META: Optional ,minorVersion: 4 ,
   *
   * DESCRIPTION: The account location. Valid values include:
   * <li><span class="literal">WithinFrance</span></li>
<li><span class="literal">FranceOverseas</span></li>
<li><span class="literal">OutsideFranceWithEU</span></li>
<li><span class="literal">OutsideEU</span></li>

For France locales, only.
   */
  TransactionLocationType?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: Optional
   *
   * ADDON: Big Decimal
   *
   * DESCRIPTION: Pay rate of the employee or vendor for this time activity.
   */
  CostRate?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to the service item associated with this object. Query the Item name list resource, where <span class="literal">Item.Type</span> is set to <span class="literal">Service</span>, to determine the appropriate Item object for this reference. Use <span class="literal">Item.Id</span> and <span class="literal">Item.Name</span> from that object for <span class="literal">ItemRef.value</span> and <span class="literal">ItemRef.name</span>, respectively. 
   * For France locales: The account associated with the referenced Item object is looked up in the account category list.
<li>If this account has same location as specified in the transaction by the <span class="literal">TransactionLocationType</span> attribute and the same VAT as in the line item <span class="literal">TaxCodeRef</span> attribute, then the item account is used.</li>
<li>If there is a mismatch, then the account from the account category list that matches the transaction location and VAT is used.</li>
<li>If this account is not present in the account category list, then a new account is created with the new location, new VAT code, and all other attributes as in the default account.</li>
   */
  ItemRef?: ReferenceType;
  /**
   * META: Optional ,minorVersion: 69
   *
   * DESCRIPTION: Reference to the <span class="literal">Project</span> ID associated with this transaction. Available with Minor Version 69 and above
   */
  ProjectRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Specifies how much the employee should be paid for doing the work specified by the Compensation Id. Query the EmployeeCompensation resource to determine the appropriate PayrollCompensation object for an employee. Use <span class="literal">EmployeeCompensation.Id</span> and <span class="literal">EmployerCompensation.Name</span> from that object for <span class="literal">PayrollItemRef.value</span> and <span class="literal">PayrollItemRef.name</span>, respectively.
   */
  PayrollItemRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Billable status of the time recorded. Valid values:
   * <span class="literal">Billable</span>,
<span class="literal">NotBillable</span>,
<span class="literal">HasBeenBilled</span>.
You cannot directly update the status to <span class="literal">HasBeenBilled</span>. To set the status to <span class="literal">HasBeenBilled</span>, create an Invoice object and attach this TimeActivity object as a linked transaction to that Invoice.
   */
  BillableStatus?: "Billable" | "NotBillable" | "HasBeenBilled";
  /**
   * META: Optional
   *
   * DESCRIPTION: A reference to a Department object specifying the location of this object. Available if <span class="literal">Preferences.AccountingInfoPrefs.TrackDepartments</span> is set to <span class="literal">true</span>.
   * <br>Query the Department name list resource to determine the appropriate department object for this reference. Use <span class="literal">Department.Id</span> and <span class="literal">Department.Name</span> from that object for <span class="literal">DepartmentRef.value</span> and <span class="literal">DepartmentRef.name</span>, respectively.
   */
  DepartmentRef?: ReferenceType;
}

export interface Transfer {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object.
   * Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Identifies the asset account to which funds are transfered. Query the Account name list resource to determine the appropriate Account object for this reference. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">ToAccountRef.value</span> and <span class="literal">ToAccountRef.name</span>, respectively. The specified account must have <span class="literal">Account.Classification</span> set to <span class="literal">Asset</span>.
   */
  ToAccountRef: ReferenceType;
  /**
   * META: * Required
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Indicates the total amount of the transaction.
   */
  Amount: number;
  /**
   * META: * Required
   *
   * DESCRIPTION: Identifies the asset account from which funds are transfered. Query the Account name list resource to determine the appropriate Account object for this reference. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">FromAccountRef.value</span> and <span class="literal">FromAccountRef.name</span>, respectively. The specified account must have <span class="literal">Account.Classification</span> set to <span class="literal">Asset</span>.
   */
  FromAccountRef: ReferenceType;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: Optional ,max character: Max of 4000 chars
   *
   * DESCRIPTION: User entered, organization-private note about the transaction. This note does not appear on the invoice to the customer. This field maps to the Memo field on the Invoice form.
   */
  PrivateNote?: string;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: The date entered by the user when this transaction occurred.
   * For posting transactions, this is the posting date that affects the financial statements. If the date is not supplied, the current date on the server is used.
Sort order is ASC by default.
   */
  TxnDate?: string;
  /**
   * META: Optional ,minorVersion: 4 ,
   *
   * DESCRIPTION: The account location. Valid values include:
   * <li><span class="literal">WithinFrance</span></li>
<li><span class="literal">FranceOverseas</span></li>
<li><span class="literal">OutsideFranceWithEU</span></li>
<li><span class="literal">OutsideEU</span></li>

For France locales, only.
   */
  TransactionLocationType?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: read only ,minorVersion: 52
   *
   * DESCRIPTION: A reference to the Recurring Transaction. It captures what recurring transaction template the <span class="literal">Transfer</span> was created from.
   */
  readonly RecurDataRef?: ReferenceType;
  /**
   * DESCRIPTION: If true, only fields specified will be updated
   */
  sparse?: boolean;
}

export interface Vendor_OtherContactInfo_ContactInfo {
  /**
   * META: Optional
   *
   * DESCRIPTION: <span>The type of contact information.</span>
   * 
<span>Valid values:</span>
<span class="literal">TelephoneNumber</span>
   */
  Type?: string;
  /**
   * META: Optional
   *
   * ADDON: Telephone Number
   */
  Telephone?: string;
}

export interface Vendor_Fax_TelephoneNumber {
  /**
   * META: Optional ,max character: Maximum of 30 chars
   *
   * DESCRIPTION: Specifies the telephone number in free form.
   */
  FreeFormNumber?: string;
}

export interface Vendor_CurrencyRef {
  /**
   * META: * Required
   *
   * DESCRIPTION: A three letter string representing the ISO 4217 code for the currency. For example, <span class="literal">USD</span>, <span class="literal">AUD</span>, <span class="literal">EUR</span>, and so on.
   */
  value: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: The full name of the currency.
   */
  name?: string;
}

export interface Vendor_Mobile_TelephoneNumber {
  /**
   * META: Optional ,max character: Maximum of 30 chars
   *
   * DESCRIPTION: Specifies the telephone number in free form.
   */
  FreeFormNumber?: string;
}

export interface Vendor_PrimaryPhone_TelephoneNumber {
  /**
   * META: Optional ,max character: Maximum of 30 chars
   *
   * DESCRIPTION: Specifies the telephone number in free form.
   */
  FreeFormNumber?: string;
}

export interface Vendor_AlternatePhone_TelephoneNumber {
  /**
   * META: Optional ,max character: Maximum of 30 chars
   *
   * DESCRIPTION: Specifies the telephone number in free form.
   */
  FreeFormNumber?: string;
}

export interface Vendor_VendorPaymentBankDetail {
  /**
   * META: * Required if VendorPaymentBankDetail is present in the request.
   *
   * DESCRIPTION: Name on the Bank Account
   */
  BankAccountName: string;
  /**
   * META: * Required if VendorPaymentBankDetail is present in the request
   *
   * DESCRIPTION: bank identification number used to identify the Bank Branch. 
   * 6 digit value in format xxx-xxx.
   */
  BankBranchIdentifier: string;
  /**
   * META: * Required if VendorPaymentBankDetail is present in the request. In reponse the value is masked and last four digit is only returned
   *
   * DESCRIPTION: Vendor's Bank Account number.
   */
  BankAccountNumber: string;
  /**
   * META: max character: The maximum length of this field is 18 characters.
   *
   * DESCRIPTION: Text/note/comment for Remmittance
   */
  StatementText?: string;
}

export interface Vendor {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object. Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: * Conditionally required ,  ,max character: Maximum of 16 chars
   *
   * DESCRIPTION: Title of the person. This tag supports i18n, all locales. The <span class="literal">DisplayName</span> attribute or at least one of <span class="literal">Title</span>, <span class="literal">GivenName</span>, <span class="literal">MiddleName</span>, <span class="literal">FamilyName</span>, or <span class="literal">Suffix</span> attributes are required during create.
   */
  Title?: string;
  /**
   * META: * Conditionally required ,  ,max character: Maximum of 100 chars
   *
   * DESCRIPTION: Given name or first name of a person. The <span class="literal">DisplayName</span> attribute or at least one of <span class="literal">Title</span>, <span class="literal">GivenName</span>, <span class="literal">MiddleName</span>, <span class="literal">FamilyName</span>, or <span class="literal">Suffix</span> attributes is required for object create.
   */
  GivenName?: string;
  /**
   * META: * Conditionally required ,  ,max character: Maximum of 100 chars
   *
   * DESCRIPTION: Middle name of the person. The person can have zero or more middle names. The <span class="literal">DisplayName</span> attribute or at least one of <span class="literal">Title</span>, <span class="literal">GivenName</span>, <span class="literal">MiddleName</span>, <span class="literal">FamilyName</span>, or <span class="literal">Suffix</span> attributes is required for object create.
   */
  MiddleName?: string;
  /**
   * META: * Conditionally required ,  ,max character: Maximum of 16 chars
   *
   * DESCRIPTION: Suffix of the name. For example, <span class="literal">Jr</span>. The <span class="literal">DisplayName</span> attribute or at least one of <span class="literal">Title</span>, <span class="literal">GivenName</span>, <span class="literal">MiddleName</span>, <span class="literal">FamilyName</span>, or <span class="literal">Suffix</span> attributes is required for object create.
   */
  Suffix?: string;
  /**
   * META: * Conditionally required ,  ,max character: Maximum of 100 chars
   *
   * DESCRIPTION: Family name or the last name of the person. The <span class="literal">DisplayName</span> attribute or at least one of <span class="literal">Title</span>, <span class="literal">GivenName</span>, <span class="literal">MiddleName</span>, <span class="literal">FamilyName</span>, or <span class="literal">Suffix</span> attributes is required for object create.
   */
  FamilyName?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: <span class="literal">Primary email address.</span>
   */
  PrimaryEmailAddr?: EmailAddress;
  /**
   * META: Optional ,max character: Maximum of 500 chars
   *
   * DESCRIPTION: The name of the vendor as displayed. Must be unique across all Vendor, Customer, and Employee objects. Cannot be removed with sparse update.
   * If not supplied, the system generates <span class="literal">DisplayName</span> by concatenating vendor name components supplied in the request from the following list: <span class="literal">Title</span>, <span class="literal">GivenName</span>, <span class="literal">MiddleName</span>, <span class="literal">FamilyName</span>, and <span class="literal">Suffix</span>.
   */
  DisplayName?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: List of ContactInfo entities of any contact info type.
   */
  OtherContactInfo?: Vendor_OtherContactInfo_ContactInfo;
  /**
   * META: Optional ,minorVersion: 3 ,
   *
   * DESCRIPTION: Identifies the accounts payable account to be used for this supplier. Each supplier must have his own AP account. Applicable for France companies, only. Available when endpoint is evoked with the <span class="literal">minorversion=3</span> query parameter.
   *  Query the Account name list resource to determine the appropriate Account object for this reference. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">APAccountRef.value</span> and <span class="literal">APAccountRef.name</span>, respectively.
   */
  APAccountRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: Reference to a default Term associated with this Vendor object. Query the Term name list resource to determine the appropriate Term object for this reference. Use <span class="literal">Term.Id</span> and <span class="literal">Term.Name</span> from that object for <span class="literal">TermRef.value</span> and <span class="literal">TermRef.name</span>, respectively.
   */
  TermRef?: ReferenceType;
  /**
   * META: Optional ,minorVersion: 59
   *
   * DESCRIPTION: The Source type of the transactions created by QuickBooks Commerce. Valid values include: <span class="literal">QBCommerce</span>
   */
  Source?: string;
  /**
   * META: Optional ,max character: maximum of 15 chars ,minorVersion: 33 ,
   *
   * DESCRIPTION: GSTIN is an identification number assigned to every GST registered business.
   */
  GSTIN?: string;
  /**
   * META: Optional ,minorVersion: 56 ,
   *
   * DESCRIPTION: True if vendor is T4A eligible. Valid for CA locale
   */
  T4AEligible?: boolean;
  /**
   * META: Optional
   *
   * DESCRIPTION: Fax number.
   */
  Fax?: Vendor_Fax_TelephoneNumber;
  /**
   * META: Optional ,max character: maximum of 10 chars ,minorVersion: 33 ,
   *
   * DESCRIPTION: Also called, PAN (in India) is a code that acts as an identification for individuals, families and corporates, especially for those who pay taxes on their income.
   */
  BusinessNumber?: string;
  /**
   * META: Optional ,read only
   *
   * DESCRIPTION: Reference to the currency in which all amounts associated with this vendor are expressed. Once set, it cannot be changed. If specified currency is not currently in the company's currency list, it is added. If not specified, currency for this vendor is the home currency of the company, as defined by <span class="literal">Preferences.CurrencyPrefs.HomeCurrency</span>. Read-only after object is created.
   */
  readonly CurrencyRef?: Vendor_CurrencyRef;
  /**
   * META: Optional ,minorVersion: 40 ,
   *
   * DESCRIPTION: Indicate if the vendor has TPAR enabled. TPAR stands for Taxable Payments Annual Report. The TPAR is mandated by ATO to get the details payments that businesses make to contractors for providing services. Some government entities also need to report the grants they have paid in a TPAR.
   */
  HasTPAR?: boolean;
  /**
   * META: Optional ,minorVersion: 3 ,
   *
   * DESCRIPTION: The method in which the supplier tracks their income. Applicable for France companies, only. Available when endpoint is evoked with the <span class="literal">minorversion=3</span> query parameter.
   * Valid values include:
<span class="literal">Cash</span> and <span class="literal">Accrual</span>.
   */
  TaxReportingBasis?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: Mobile phone number.
   */
  Mobile?: Vendor_Mobile_TelephoneNumber;
  /**
   * META: Optional
   *
   * DESCRIPTION: Primary phone number.
   */
  PrimaryPhone?: Vendor_PrimaryPhone_TelephoneNumber;
  /**
   * META: Optional
   *
   * DESCRIPTION: If true, this object is currently enabled for use by QuickBooks.
   */
  Active?: boolean;
  /**
   * META: Optional
   *
   * DESCRIPTION: Alternate phone number.
   */
  AlternatePhone?: Vendor_AlternatePhone_TelephoneNumber;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: Optional
   *
   * DESCRIPTION: This vendor is an independent contractor; someone who is given a 1099-MISC form at the end of the year. A 1099 vendor is paid with regular checks, and taxes are not withheld on their behalf.
   */
  Vendor1099?: boolean;
  /**
   * META: Optional
   *
   * ADDON: Big Decimal
   *
   * DESCRIPTION: Pay rate of the vendor
   */
  CostRate?: number;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: BillRate can be set to specify this vendor's hourly billing rate.
   */
  BillRate?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: <span class="literal">Website address.</span>
   */
  WebAddr?: WebSiteAddress;
  /**
   * META: Optional ,minorVersion: 56 ,
   *
   * DESCRIPTION: True if vendor is T5018 eligible. Valid for CA locale
   */
  T5018Eligible?: boolean;
  /**
   * META: Optional ,max character: Maximum of 100 chars
   *
   * DESCRIPTION: The name of the company associated with the person or organization.
   */
  CompanyName?: string;
  /**
   * META: Optional ,minorVersion: 40 ,
   *
   * DESCRIPTION: <span class="literal">Vendor Payment Bank Detail.</span>
   */
  VendorPaymentBankDetail?: Vendor_VendorPaymentBankDetail;
  /**
   * META: Optional ,max character: Max 20 characters
   *
   * DESCRIPTION: The tax ID of the Person or Organization. The value is masked in responses, exposing only last four characters. For example, the ID of <span class="literal">123-45-6789</span> is returned as <span class="literal">XXXXXXX6789</span>.
   */
  TaxIdentifier?: string;
  /**
   * META: Optional ,max character: Maximum of 100 chars
   *
   * DESCRIPTION: Name or number of the account associated with this vendor.
   */
  AcctNum?: string;
  /**
   * META: Optional ,max character: maximum of 15 chars ,minorVersion: 33 ,
   *
   * DESCRIPTION: For the filing of GSTR, transactions need to be classified depending on the type of vendor from whom the purchase is made. To facilitate this, we have introduced a new field as 'GST registration type'. Possible values are listed below:
   * <li><span class="literal">GST_REG_REG</span> GST registered- Regular. Customer who has a business which is registered under GST and has a GSTIN (doesn’t include customers registered under composition scheme, as an SEZ or as EOU's, STP's EHTP's etc.).</li>
<li><span class="literal">GST_REG_COMP</span> GST registered-Composition. Customer who has a business which is registered under the composition scheme of GST and has a GSTIN.</li>
<li><span class="literal">GST_UNREG</span> GST unregistered. Customer who has a business which is not registered under GST and does not have a GSTIN.</li>
<li><span class="literal">CONSUMER</span> Consumer. Customer who is not registered under GST and is the final consumer of the service or product sold.</li>
<li><span class="literal">OVERSEAS</span> Overseas. Customer who has a business which is located out of India.</li>
<li><span class="literal">SEZ</span> SEZ. Customer who has a business which is registered under GST, has a GSTIN and is located in a SEZ or is a SEZ Developer.</li>
<li><span class="literal">DEEMED</span> Deemed exports- EOU's, STP's EHTP's etc. Customer who has a business which is registered under GST and falls in the category of companies (EOU's, STP's EHTP's etc.), to which supplies are made they are termed as deemed exports.</li>
   */
  GSTRegistrationType?: string;
  /**
   * META: Optional ,max character: Maximum of 100 chars
   *
   * DESCRIPTION: Name of the person or organization as printed on a check. If not provided, this is populated from <span class="literal">DisplayName</span>. Cannot be removed with sparse update.
   */
  PrintOnCheckName?: string;
  /**
   * META: Optional
   *
   * DESCRIPTION: <span class="literal">Default billing address.</span> <br> If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:<p></p><ul><li><span class="literal">Line1</span> and <span class="literal">Line2</span> elements are populated with the customer name and company name.</li><li>Original <span class="literal">Line1</span> through <span class="literal">Line 5</span> contents, <span class="literal">City</span>, <span class="literal">SubDivisionCode</span>, and <span class="literal">PostalCode</span> flow into <span class="literal">Line3</span> through <span class="literal">Line5</span>as a free format strings.</li></ul>
   */
  BillAddr?: PhysicalAddress;
  /**
   * META: read only
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the open balance amount or the amount unpaid by the customer. For the create operation, this represents the opening balance for the customer. When returned in response to the query request it represents the current open balance (unpaid amount) for that customer. Write-on-create, read-only otherwise.
   */
  readonly Balance?: number;
}

export interface VendorCredit_Line_LinkedTxn {
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction Id of the related transaction.
   */
  TxnId: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction type of the linked object.
   */
  TxnType: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Required for Deposit and Bill entities. The line number of a specific line of the linked transaction. If supplied, the
   * <span class="literal">TxnId</span> and
<span class="literal">TxnType</span> attributes of the linked transaction must also be populated.
   */
  TxnLineId?: string;
}

export interface VendorCredit_Line_ItemBasedExpenseLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   */
  ItemBasedExpenseLineDetail: ItemBasedExpenseLineDetail;
  /**
   * META: * Required ,max character: Max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   */
  Amount: number;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">ItemBasedExpenseLineDetail</span> for this type of line.
   */
  DetailType: "ItemBasedExpenseLineDetail";
  /**
   * META: Optional ,minorVersion: 55
   *
   * DESCRIPTION: Zero or more transactions linked to this object. The <span class="literal">LinkedTxn.TxnType</span> can be set to <span class="literal">ReimburseCharge</span>. The <span class="literal">LinkedTxn.TxnId</span> can be set as the ID of the transaction.
   */
  LinkedTxn?: VendorCredit_Line_LinkedTxn[];
  /**
   * META: Optional ,max character: Max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive integer.
   */
  LineNum?: number;
}

export interface VendorCredit_Line_AccountBasedExpenseLine {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: The Id of the line item. Its use in requests is as folllows:
   * <li>If
<span class="literal">Id</span>is greater than zero and exists for the company, the request is considered an update operation for a line item.</li>
<li>If no
<span class="literal">Id</span>is provided, the
<span class="literal">Id</span>provided is less than or equal to zero, or the
<span class="literal">Id</span>provided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.</li>

Available in all objects that use lines and support the update operation.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Set to
   * <span class="literal">AccountBasedExpenseLineDetail</span>for this type of line.
   */
  DetailType: "AccountBasedExpenseLineDetail";
  /**
   * META: * Required ,max character: max 15 digits in 10.5 format
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The amount of the line item.
   */
  Amount: number;
  /**
   * META: * Required
   *
   * DESCRIPTION: <strong>LineDetail</strong>
   */
  AccountBasedExpenseLineDetail: AccountBasedExpense;
  /**
   * META: Optional ,max character: max 4000 chars
   *
   * DESCRIPTION: Free form text description of the line item that appears in the printed record.
   */
  Description?: string;
  /**
   * META: Optional
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: Specifies the position of the line in the collection of transaction lines. Positive Integer.
   */
  LineNum?: number;
}

export interface VendorCredit_LinkedTxn {
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction Id of the related transaction.
   */
  TxnId: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Transaction type of the linked object.
   */
  TxnType: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Required for Deposit and Bill entities. The line number of a specific line of the linked transaction. If supplied, the
   * <span class="literal">TxnId</span> and
<span class="literal">TxnType</span> attributes of the linked transaction must also be populated.
   */
  TxnLineId?: string;
}

export interface VendorCredit {
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Unique identifier for this object. Sort order is ASC by default.
   */
  readonly Id?: string;
  /**
   * META: * Required
   *
   * DESCRIPTION: Reference to the vendor for this transaction. Query the Vendor name list resource to determine the appropriate Vendor object for this reference. Use <span class="literal">Vendor.Id</span> and <span class="literal">Vendor.Name</span> from that object for <span class="literal">VendorRef.value</span> and <span class="literal">VendorRef.name</span>, respectively.
   */
  VendorRef: ReferenceType;
  /**
   * META: * Required
   *
   * DESCRIPTION: Individual line items of a transaction. Valid <span class="literal">Line</span> types include:
   * <span class="literal">ItemBasedExpenseLine</span> and 
<span class="literal">AccountBasedExpenseLine</span>
   */
  Line: (VendorCredit_Line_ItemBasedExpenseLine | VendorCredit_Line_AccountBasedExpenseLine)[];
  /**
   * META: * Required for update ,read only ,system defined
   *
   * DESCRIPTION: Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its <span class="literal">SyncToken</span> is incremented. Attempts to modify an object specifying an older <span class="literal">SyncToken</span> fails. Only the latest version of the object is maintained by QuickBooks Online.
   */
  readonly SyncToken?: string;
  /**
   * META: * Conditionally required ,
   *
   * DESCRIPTION: Reference to the currency in which all amounts on the associated transaction are expressed. This must be defined if multicurrency is enabled for the company.
   * Multicurrency is enabled for the company if <span class="literal">Preferences.MultiCurrencyEnabled</span> is set to <span class="literal">true</span>. Read more about multicurrency support <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/manage-multiple-currencies" title="Currency">here</a>. Required if multicurrency is enabled for the company
   */
  CurrencyRef?: CurrencyRefType;
  /**
   * META: Optional ,max character: Maximum of 21 chars
   *
   * DESCRIPTION: Reference number for the transaction. If not explicitly provided at create time, this field is populated based on the setting of <span class="literal">Preferences:OtherPrefs:NameValue.Name = VendorAndPurchasesPrefs.UseCustomTxnNumbers</span> as follows:
   * <li>If <span class="literal">Preferences:OtherPrefs:NameValue.Name = VendorAndPurchasesPrefs.UseCustomTxnNumbers</span> is true a custom value can be provided. If no value is supplied, the resulting DocNumber is null.</li>
<li>If <span class="literal">Preferences:OtherPrefs:NameValue.Name = VendorAndPurchasesPrefs.UseCustomTxnNumbers</span> is false, resulting DocNumber is system generated by incrementing the last number by 1.</li>

Throws an error when duplicate DocNumber is sent in the request. Recommended best practice: check the setting of <span class="literal">Preferences:OtherPrefs:NameValue.Name = VendorAndPurchasesPrefs.UseCustomTxnNumbers</span> before setting DocNumber. If a duplicate DocNumber needs to be supplied, add the query parameter name/value pair, <span class="literal">include=allowduplicatedocnum</span> to the URI.
Sort order is ASC by default.
   */
  DocNumber?: string;
  /**
   * META: Optional ,max character: Max of 4000 chars
   *
   * DESCRIPTION: User entered, organization-private note about the transaction. This note does not appear on the transaction to the vendor. This field maps to the Memo field on the transaction form.
   */
  PrivateNote?: string;
  /**
   * META: Optional ,minorVersion: 55
   *
   * DESCRIPTION: Zero or more transactions linked to this object. The <span class="literal">LinkedTxn.TxnType</span> can be set to <span class="literal">ReimburseCharge</span>. The <span class="literal">LinkedTxn.TxnId</span> can be set as the ID of the transaction.
   */
  LinkedTxn?: VendorCredit_LinkedTxn[];
  /**
   * META: Optional ,
   *
   * DESCRIPTION: Method in which tax is applied. Allowed values are:
   * <span class="literal">TaxExcluded</span>,
<span class="literal">TaxInclusive</span>, and
<span class="literal">NotApplicable</span>.
   */
  GlobalTaxCalculation?: "TaxExcluded" | "TaxInclusive" | "NotApplicable";
  /**
   * META: Optional ,default: 1
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The number of home currency units it takes to equal one unit of currency specified by <span class="literal">CurrencyRef</span>. Applicable if multicurrency is enabled for the company.
   */
  ExchangeRate?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: Specifies to which AP account the bill is credited. Query the Account name list resource to determine the appropriate Account object for this reference. Use <span class="literal">Account.Id</span> and <span class="literal">Account.Name</span> from that object for <span class="literal">APAccountRef.value</span> and <span class="literal">APAccountRef.name</span>, respectively. The specified account must have <span class="literal">Account.Classification</span> set to <span class="literal">Liability</span> and <span class="literal">Account.AccountSubType</span> set to <span class="literal">AccountsPayable</span>.
   * If the company has a single AP account, the account is implied. However, it is recommended that the AP Account be explicitly specified in all cases to prevent unexpected errors when relating transactions to each other.
   */
  APAccountRef?: ReferenceType;
  /**
   * META: Optional
   *
   * DESCRIPTION: A reference to a Department object specifying the location of the transaction. Available if <span class="literal">Preferences.AccountingInfoPrefs.TrackDepartments</span> is set to <span class="literal">true</span>.
   * Query the Department name list resource to determine the appropriate department object for this reference. Use <span class="literal">Department.Id</span> and <span class="literal">Department.Name</span> from that object for <span class="literal">DepartmentRef.value</span> and <span class="literal">DepartmentRef.name</span>, respectively.
   */
  DepartmentRef?: ReferenceType;
  /**
   * META: Optional
   *
   * ADDON: Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM
   *
   * DESCRIPTION: The date entered by the user when this transaction occurred.
   * For posting transactions, this is the posting date that affects the financial statements. If the date is not supplied, the current date on the server is used.
<br>Sort order is ASC by default.
   */
  TxnDate?: string;
  /**
   * META: Optional ,minorVersion: 40 ,
   *
   * DESCRIPTION: Include the supplier in the annual TPAR. TPAR stands for Taxable Payments Annual Report. The TPAR is mandated by ATO to get the details payments that businesses make to contractors for providing services. Some government entities also need to report the grants they have paid in a TPAR.
   */
  IncludeInAnnualTPAR?: boolean;
  /**
   * META: Optional ,minorVersion: 4 ,
   *
   * DESCRIPTION: The account location. Valid values include:
   * <li><span class="literal">WithinFrance</span></li>
<li><span class="literal">FranceOverseas</span></li>
<li><span class="literal">OutsideFranceWithEU</span></li>
<li><span class="literal">OutsideEU</span></li>

For France locales, only.
   */
  TransactionLocationType?: string;
  /**
   * META: Optional ,read only ,minorVersion: 12
   *
   * ADDON: Decimal
   *
   * DESCRIPTION: The current amount of the vendor credit reflecting any adjustments to the original credit amount.  Initially set to the value of
   * <span class="literal">TotalAmt</span>. Calculated by QuickBooks business logic; any value you supply is over-written by QuickBooks.
   */
  readonly Balance?: number;
  /**
   * META: Optional
   *
   * DESCRIPTION: Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.
   */
  MetaData?: ModificationMetaData;
  /**
   * META: read only ,minorVersion: 52
   *
   * DESCRIPTION: A reference to the Recurring Transaction. It captures what recurring transaction template the <span class="literal">VendorCredit</span> was created from.
   */
  readonly RecurDataRef?: ReferenceType;
  /**
   * META: read only ,system defined
   *
   * ADDON: Big Decimal
   *
   * DESCRIPTION: Indicates the total credit amount, determined by taking the total of all all lines of the transaction. This includes all charges, allowances, discounts, and taxes. Calculated by QuickBooks business logic; any value you supply is over-written by QuickBooks.
   */
  readonly TotalAmt?: number;
}

export interface QuickbooksTypes {
  Account: Account;
  Attachable: Attachable;
  Bill: Bill;
  BillPayment: BillPayment;
  Budget: Budget;
  Class: Class;
  CreditMemo: CreditMemo;
  CompanyInfo: CompanyInfo;
  Customer: Customer;
  Department: Department;
  Deposit: Deposit;
  Employee: Employee;
  Estimate: Estimate;
  Exchangerate: Exchangerate;
  Invoice: Invoice;
  Item: Item;
  JournalCode: JournalCode;
  JournalEntry: JournalEntry;
  Payment: Payment;
  PaymentMethod: PaymentMethod;
  Preferences: Preferences;
  Purchase: Purchase;
  PurchaseOrder: PurchaseOrder;
  RefundReceipt: RefundReceipt;
  SalesReceipt: SalesReceipt;
  TaxAgency: TaxAgency;
  TaxService: TaxService;
  TaxCode: TaxCode;
  TaxRate: TaxRate;
  Term: Term;
  TimeActivity: TimeActivity;
  Transfer: Transfer;
  Vendor: Vendor;
  VendorCredit: VendorCredit;
}

export type QuickbooksCreateEntities =
  | Account
  | Attachable
  | Bill
  | BillPayment
  | Budget
  | Class
  | CreditMemo
  | Customer
  | Department
  | Deposit
  | Employee
  | Estimate
  | Invoice
  | Item
  | Item
  | JournalCode
  | JournalEntry
  | Payment
  | PaymentMethod
  | Purchase
  | PurchaseOrder
  | RefundReceipt
  | SalesReceipt
  | TaxAgency
  | TaxService
  | Term
  | TimeActivity
  | Transfer
  | Vendor
  | VendorCredit
;

export type QuickbooksReadEntities =
  | Account
  | Attachable
  | Bill
  | BillPayment
  | Budget
  | Class
  | CreditMemo
  | CompanyInfo
  | Customer
  | Department
  | Deposit
  | Employee
  | Estimate
  | Invoice
  | Item
  | Item
  | Item
  | JournalCode
  | JournalEntry
  | Payment
  | PaymentMethod
  | Preferences
  | Purchase
  | PurchaseOrder
  | RefundReceipt
  | SalesReceipt
  | TaxAgency
  | TaxCode
  | TaxRate
  | Term
  | TimeActivity
  | Transfer
  | Vendor
  | VendorCredit
;

export type QuickbooksDeleteEntities =
  | Attachable
  | Bill
  | BillPayment
  | Budget
  | CreditMemo
  | Deposit
  | Estimate
  | Invoice
  | JournalEntry
  | Payment
  | Purchase
  | PurchaseOrder
  | RefundReceipt
  | SalesReceipt
  | TimeActivity
  | Transfer
  | VendorCredit
;

export type QuickbooksQueryEntities =
  | Account
  | Attachable
  | Bill
  | BillPayment
  | Budget
  | Class
  | CreditMemo
  | CompanyInfo
  | Customer
  | Department
  | Deposit
  | Employee
  | Estimate
  | Exchangerate
  | Invoice
  | Item
  | Item
  | Item
  | JournalCode
  | JournalEntry
  | Payment
  | PaymentMethod
  | Preferences
  | Purchase
  | PurchaseOrder
  | RefundReceipt
  | SalesReceipt
  | TaxAgency
  | TaxCode
  | TaxRate
  | Term
  | TimeActivity
  | Transfer
  | Vendor
  | VendorCredit
;

export type QuickbooksFullUpdateEntities =
  | Account
  | Attachable
  | Bill
  | BillPayment
  | Budget
  | Class
  | CreditMemo
  | CompanyInfo
  | Customer
  | Department
  | Deposit
  | Employee
  | Estimate
  | Invoice
  | Item
  | JournalEntry
  | Payment
  | PaymentMethod
  | Preferences
  | Purchase
  | PurchaseOrder
  | RefundReceipt
  | SalesReceipt
  | Term
  | TimeActivity
  | Transfer
  | Vendor
  | VendorCredit
;

export type QuickbooksSparseUpdateEntities =
  | CompanyInfo
  | Customer
  | Deposit
  | Estimate
  | Invoice
  | JournalEntry
  | RefundReceipt
  | SalesReceipt
  | Transfer
;

export type QuickbooksSendPdfEntities =
  | CreditMemo
  | Estimate
  | Invoice
  | Payment
  | PurchaseOrder
  | RefundReceipt
  | SalesReceipt
;

export type QuickbooksGetPdfEntities =
  | CreditMemo
  | Estimate
  | Exchangerate
  | Invoice
  | Payment
  | PurchaseOrder
  | RefundReceipt
  | SalesReceipt
;
