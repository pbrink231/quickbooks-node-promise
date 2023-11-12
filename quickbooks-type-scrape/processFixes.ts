export const indent = "  ";

export const forceCombineTypes: string[] = ['TelephoneNumber']

export const typeAttributeFixes: {
  [typeName: string]: {
    attributeReplacements?: {
      [attributeName: string]: {
        replacedInterface?: string;
        fixedName?: string;
        fixedType?: string;
        fixedMetaData?: string;
        fixedDescription?: string;
      };
    };
  }
} = {
  TelephoneNumber: {
    attributeReplacements: {
      FreeFormNumber: {
        fixedMetaData: "Optional ,max character: Maximum of 20/30 chars"
      },
    },
  },
  Invoice_Line_SubTotalLine: {
    attributeReplacements: {
      SubtotalLineDetail: {
        fixedName: "SubTotalLineDetail",
      }
    },
  },
  Preferences_AccountingInfoPrefs: {
    attributeReplacements: {
      FirstMonthOfFiscalYear: {
        fixedType:
          '"January" | "February" | "March" | "April" | "May" | "June" | "July" | "August" | "September" | "October" | "November" | "December"',
      },
    }
  },
  Preferences: {
    attributeReplacements: {
      OtherPrefs: {
        replacedInterface: `${indent}/**
  ${indent} * Other Preferences
  ${indent} *
  ${indent} * Other preferences that are not listed in the Preferences list
  ${indent} * This is a list of pre determined names and values for those names
  ${indent} *
  ${indent} * DESCRIPTION: Specifies extension of Preference resource to allow extension of Name-Value pair based extension at the top level.
  ${indent} */
  ${indent}OtherPrefs?: { Name: string, Value: string }[];\n`,
      },
    }
  },
  CompanyInfo: {
    attributeReplacements: {
      NameValue: {
        replacedInterface: `${indent}/**
  ${indent} * META: Optional
  ${indent} *
  ${indent} * DESCRIPTION: Any other preference not covered with the standard set of attributes. See Data Services Extensions, below, for special reserved name/value pairs.
  ${indent} * NameValue.Name--Name of the element.
  ${indent} * NameValue.Value--Value of the element.
  ${indent} */
  ${indent}NameValue?: { Name: string, Value: string }[];\n`,
      },
    }
  },
  Customer: {
    attributeReplacements: {
      PreferredDeliveryMethod: {
        fixedType: '"Print" | "Email" | "None"',
      },
    },
  },
  Vendor_OtherContactInfo_ContactInfo: {
    attributeReplacements: {
      Telephone: {
        fixedType: 'string',
      },
    },
  },
};

export const typeConversion: {
  [key: string]: {
    newType?: string;
    addOnDescription?: string;
    hasParent?: boolean;
    isList?: boolean;
  };
} = {
  String: { newType: "string" },
  Boolean: { newType: "boolean" },
  Number: { newType: "number" },
  Decimal: { newType: "number", addOnDescription: "Decimal" },
  BigDecimal: { newType: "number", addOnDescription: "Big Decimal" },
  "Numeric Id": { newType: "number", addOnDescription: "Numeric Id" },
  IdType: { newType: "number", addOnDescription: "Id Type" },
  Integer: { newType: "number", addOnDescription: "Integer" },
  DateTime: {
    newType: "string",
    addOnDescription:
      "Local time zone: YYYY-MM-DDTHH:MM:SS UTC: YYYY-MM-DDT HH :MM: SSZ Specific time zone: YYYY-MM-DDT HH :MM:SS +/- HH :MM",
  },
  Date: {
    newType: "string",
    addOnDescription:
      "Local timezone: YYYY-MM-DD UTC: YYYY-MM-DDZ Specific time zone: YYYY-MM-DD+/-HH:MM",
  },
  WeekEnum: {
    newType:
      '"Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"',
    addOnDescription: "Week Enum",
  },
  "Positive Integer": {
    newType: "number",
    addOnDescription: "Positive Integer",
  },
  Sting: { newType: "string", addOnDescription: "Miss spelled String" },
  "Percentage as String": {
    newType: "string",
    addOnDescription: "Percentage as String",
  },
  "Integer as String": {
    newType: "string",
    addOnDescription: "Integer as String",
  },
  "Internal use": { newType: "any", addOnDescription: "Internal use" },
  CustomField: { isList: true },
};

export const enumValueFixes: { [key: string]: string } = {
  SubtotalLineDetail: "SubTotalLineDetail",
};
