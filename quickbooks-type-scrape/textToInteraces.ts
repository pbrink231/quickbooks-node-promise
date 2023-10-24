import { TypeInformation } from ".";
import { EntityName } from "../src";

const indent = "  ";

const typeConversion: {
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
  TelephoneNumber: { newType: "string", addOnDescription: "Telephone Number" },
  CustomField: { isList: true },
};

export const processTypesForText = (entityData: TypeInformation) => {
  // Join types that have the same typeRefName and attributes
  // check attributes are the same for name, metaData, and description
  const allTypes = entityData.Types;
  const combineCheckedTypes: string[] = [];
  const toCombineTypes: string[] = [];
  for (const typeName in allTypes) {
    const type = allTypes[typeName];
    if (!type.typeRefName) {
      console.log("skipping type for combining", typeName);
      continue;
    }
    const combineTypeName = type.typeRefName;
    if (combineCheckedTypes.includes(combineTypeName)) {
      console.log("already checked type for combining", typeName);
      continue;
    }
    combineCheckedTypes.push(combineTypeName);
    let shouldCombine = true;
    let count = 0;
    for (const checkTypeName in allTypes) {
      if (checkTypeName === typeName) {
        // ignore own type
        continue;
      }
      const checkType = allTypes[checkTypeName];
      if (!checkType.typeRefName) {
        continue;
      }
      if (checkType.typeRefName !== combineTypeName) {
        continue;
      }

      const curAttrJson = JSON.stringify(
        type.attributes.map((attr) => {
          return {
            name: attr.name,
            metaData: attr.metaData,
            description: attr.description,
          };
        })
      );
      const checkAttrJson = JSON.stringify(
        checkType.attributes.map((attr) => {
          return {
            name: attr.name,
            metaData: attr.metaData,
            description: attr.description,
          };
        })
      );
      count++;
      if (curAttrJson !== checkAttrJson) {
        shouldCombine = false;
      }
    }
    if (shouldCombine && count > 0) {
      console.log("found type to combine", typeName, combineTypeName);
      toCombineTypes.push(combineTypeName);
    }
  }

  console.log("should combine types", toCombineTypes);

  // special fix case, if type has attributes length of 1 and attribute has no properties
  // then remove type and update any reference types with any
  const removeTypes: string[] = [];
  for (const typeName in allTypes) {
    const type = allTypes[typeName];
    if (type.attributes.length === 1 && type.attributes[0].name === "") {
      // bad type
      console.log("found bad type", typeName);
      removeTypes.push(typeName);
      for (const checkTypeName in allTypes) {
        const checkType = allTypes[checkTypeName];
        for (const attr of checkType.attributes) {
          if (attr.type === typeName) {
            attr.type = "any";
          }
        }
      }
    }
  }
  for (const removeType of removeTypes) {
    delete allTypes[removeType];
  }

  let allTypeText = "";

  const combinedTypesFinished: string[] = [];
  for (const typeName in allTypes) {
    const type = allTypes[typeName];
    let mainTypeName = typeName;

    // check if a combined type and only run once

    if (type.typeRefName && toCombineTypes.includes(type.typeRefName)) {
      if (combinedTypesFinished.includes(type.typeRefName)) {
        // already processed type
        console.log(
          "skipping already processed type",
          typeName,
          type.typeRefName
        );
        continue;
      }
      combinedTypesFinished.push(type.typeRefName);
      mainTypeName = type.typeRefName;
    }
    console.log("Running type", typeName, type.typeRefName);

    // add sparse to Payment if not already included
    if (
      typeName === "Payment" &&
      !type.attributes.find((attr) => attr.name === "sparse")
    ) {
      type.attributes.push({
        name: "sparse",
        type: "boolean",
        description: "sparse for voided transactions",
        metaData: "",
      });
    }

    if (allTypeText !== "") {
      allTypeText += "\n";
    }

    let typeText = `export interface ${mainTypeName} {\n`;

    for (const attribute of type.attributes) {
      let useType = attribute.type;
      let addOn: string | null = null;

      if (attribute.name === "") {
        throw new Error("pulledAttrName not set");
      }

      if (typeName === "Preferences" && attribute.name === "OtherPrefs") {
        typeText += `${indent}/**
  ${indent} * Other Preferences
  ${indent} *
  ${indent} * Other preferences that are not listed in the Preferences list
  ${indent} * This is a list of pre determined names and values for those names
  ${indent} *
  ${indent} * DESCRIPTION: Specifies extension of Preference resource to allow extension of Name-Value pair based extension at the top level.
  ${indent} */
  ${indent}OtherPrefs?: { Name: string, Value: string}[];\n`;
        continue;
      }

      if (typeName === "CompanyInfo" && attribute.name === "NameValue") {
        typeText += `${indent}/**
  ${indent} * META: Optional
  ${indent} *
  ${indent} * DESCRIPTION: Any other preference not covered with the standard set of attributes. See Data Services Extensions, below, for special reserved name/value pairs.
  ${indent} * NameValue.Name--Name of the element.
  ${indent} * NameValue.Value--Value of the element.
  ${indent} */
  ${indent}NameValue?: { Name: string, Value: string}[];\n`;
        continue;
      }

      if (
        typeName === "Preferences_AccountingInfoPrefs" &&
        attribute.name === "FirstMonthOfFiscalYear"
      ) {
        useType =
          '"January" | "February" | "March" | "April" | "May" | "June" | "July" | "August" | "September" | "October" | "November" | "December"';
      }

      // check if parent is a combined type
      const childType = allTypes[attribute.type || ""];
      if (
        childType &&
        childType.typeRefName &&
        childType.typeRefName !== "" &&
        toCombineTypes.includes(childType.typeRefName)
      ) {
        useType = childType.typeRefName;
      }

      // check if metadata starts with "* Required" to know if required
      let isReq =
        attribute.metaData?.startsWith("* Required") &&
        !attribute.metaData?.startsWith("* Required for update")
          ? ""
          : "?";
      let isReadOnly = attribute.metaData?.includes("read only")
        ? "readonly "
        : "";
      let isList = attribute.isList ? "[]" : "";
      let attrNames = attribute.name.split(" ");

      // convert type
      if (useType && typeConversion[useType]) {
        const typeCheck = typeConversion[useType];
        if (typeCheck.newType) {
          useType = typeCheck.newType;
        }
        if (typeCheck.addOnDescription) {
          addOn = typeCheck.addOnDescription;
        }
        if (typeCheck.isList !== undefined) {
          isList = typeCheck.isList ? "[]" : "";
        }
      }

      // if useType ends with "enum", ignoring capitalization
      if (useType?.toLowerCase().endsWith("enum")) {
        // get all values in description that are between <span class="literal">{value}</span>
        // clear distinct values, add quotes around each value, and join with " | "
        // if no values, add "string" to type
        if (!attribute.description) {
          throw new Error("description not set for enum value");
        }
        const enumValues: string[] = [];
        const enumValuesRegex = /<span class="literal">([^<]+)<\/span>/g;
        let enumValuesMatch;
        while (
          (enumValuesMatch = enumValuesRegex.exec(attribute.description))
        ) {
          enumValues.push(`"${enumValuesMatch[1]}"`);
        }
        console.log("enum values", attribute.name, enumValues);
        if (enumValues.length === 0) {
          enumValues.push("string");
          addOn += "\n   *\n   * No values given for enum";
        }

        // use only distinct values
        useType = [...new Set(enumValues)].join(" | ");
      }

      if (attribute.metaData || attribute.description || addOn) {
        // add comment
        typeText += `  /**\n`;
        let addSpacer = false;
        if (attribute.metaData) {
          if (addSpacer) {
            typeText += `   *\n`;
          }
          typeText += `   * META: ${attribute.metaData}\n`;
          addSpacer = true;
        }
        if (addOn) {
          if (addSpacer) {
            typeText += `   *\n`;
          }
          typeText += `   * ADDON: ${addOn}\n`;
          addSpacer = true;
        }
        if (attribute.description) {
          if (addSpacer) {
            typeText += `   *\n`;
          }
          typeText += `   * DESCRIPTION: ${attribute.description.replace(
            "\n",
            `\n${indent} * `
          )}\n`;
          addSpacer = true;
        }
        typeText += `   */\n`;
      }

      for (const attrName of attrNames) {
        if (isList && attribute.type?.includes("|")) {
          typeText += `  ${isReadOnly}${attrName}${isReq}: (${useType})[];\n`;
          continue;
        }
        typeText += `  ${isReadOnly}${attrName}${isReq}: ${useType}${isList};\n`;
      }
    }
    typeText += "}\n";
    allTypeText += typeText;
  }
  console.log("combined types finished", combinedTypesFinished);

  // export main types
  allTypeText += "\n";
  allTypeText += "export interface QuickbooksTypes {\n";
  for (const typeName of Object.values(EntityName)) {
    const type = allTypes[typeName];

    if (!type) {
      allTypeText += `  ${typeName}: any;\n`;
      continue;
    }
    allTypeText += `  ${typeName}: ${typeName};\n`;
  }
  allTypeText += "}\n";

  // unions for different types of entities
  allTypeText += "\n";
  allTypeText += "export type QuickbooksCreateEntities =\n";
  for (const typeName of entityData.createEntityies) {
    allTypeText += `  | ${typeName}\n`;
  }
  allTypeText += ";\n";

  allTypeText += "\n";
  allTypeText += "export type QuickbooksReadEntities =\n";
  for (const typeName of entityData.readEntityies) {
    allTypeText += `  | ${typeName}\n`;
  }
  allTypeText += ";\n";

  allTypeText += "\n";
  allTypeText += "export type QuickbooksDeleteEntities =\n";
  for (const typeName of entityData.deleteEntityies) {
    allTypeText += `  | ${typeName}\n`;
  }
  allTypeText += ";\n";

  allTypeText += "\n";
  allTypeText += "export type QuickbooksQueryEntities =\n";
  for (const typeName of entityData.queryEntities) {
    allTypeText += `  | ${typeName}\n`;
  }
  allTypeText += ";\n";

  allTypeText += "\n";
  allTypeText += "export type QuickbooksFullUpdateEntities =\n";
  for (const typeName of entityData.fullUpdateEntityies) {
    allTypeText += `  | ${typeName}\n`;
  }
  allTypeText += ";\n";

  allTypeText += "\n";
  allTypeText += "export type QuickbooksSparseUpdateEntities =\n";
  for (const typeName of entityData.sparseUpdateEntityies) {
    allTypeText += `  | ${typeName}\n`;
  }
  allTypeText += ";\n";

  allTypeText += "\n";
  allTypeText += "export type QuickbooksSendPdfEntities =\n";
  for (const typeName of entityData.sendPdfEntityies) {
    allTypeText += `  | ${typeName}\n`;
  }
  allTypeText += ";\n";

  allTypeText += "\n";
  allTypeText += "export type QuickbooksGetPdfEntities =\n";
  for (const typeName of entityData.getPdfEntityies) {
    allTypeText += `  | ${typeName}\n`;
  }
  allTypeText += ";\n";

  return allTypeText;
};
