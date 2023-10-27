import { TypeInformation } from ".";
import { EntityName } from "../src";
import {
  enumValueFixes,
  indent,
  typeAttributeFixes,
  typeConversion,
} from "./processFixes";

const cleanseDescription = (description: string, dontRepeat?: boolean) => {
  let newDescription = description;

  // replace <a> tag that could include other properties other than href with jsdoc @link
  newDescription = newDescription.replace(/<a.*?href="(.*?)".*?>(.*?)<\/a>/g, function (match, group1, group2) {
    const modifiedValue = group2.trim();

    // Return the modified value wrapped in ** and add jsdoc @link
    return `{@link ${group1} | ${modifiedValue}}`;
  });

  // replace <span style ... >{value}</span> with {value}
  newDescription = newDescription.replace(/<span style=".*?">(.*?)<\/span>/g, function (match, group) {
    return group.trim();
  });

  // replace <b></b> with ** at the start and ** at the end
  newDescription = newDescription.replace(/<b>(.*?)<\/b>/g, function (match, group) {
    const modifiedValue = group.trim();
    return '**' + modifiedValue + '**';
  });

  // if .<br> or . <br> then replace with .\n
  newDescription = newDescription.replace(/\. ?<br>/g, '.\n');

  // if <br> then replace with ''
  newDescription = newDescription.replace(/<br>/g, '');

  // replace &amp; with &
  newDescription = newDescription.replace(/&amp;/g, '&');

  // remove <em> and </em>, remove new line characters before or after either one
  newDescription = newDescription.replace(/<em>[\n\s]*(.*?)[\s\n]*<\/em>/g, function (match, group) {
    return group.trim();
  });

  // replace all <em> and if have \n after it, then remove it
  newDescription = newDescription.replace(/<em>\n/g, '');
  // replace all </em> and if have \n before it, then remove it
  newDescription = newDescription.replace(/\n<\/em>/g, '');

  // replace <li></li> with , at the end
  newDescription = newDescription.replace(/<li>([.\s\S]*?)<\/li>/g, function (match, group) {
    return group.trim() + ',';
  });

  // replace <ul></ul> with space in front
  newDescription = newDescription.replace(/<ul>([\s\S.]*?)<\/ul>/g, function (match, group) {
    return ' ' + group.trim();
  });


  // replace <span class="literal">{value}</span> with **{value}** and remove spaces and newlines around {value}
  // if span has \n before it, then remove it
  const replaceRegex = /(?:\n)?<span class="(?:literal|litera)">([a-zA-Z0-9\.\=\s\S:\+\/-\_]*?)<\/span>/g;
  const matches = newDescription.matchAll(replaceRegex);
  const replacements: [number, string, string][] = [];
  for (const match of matches) {
    if (match.index === undefined) {
      throw new Error("match index not set");
    }
    let modifiedValue = match[1].trim();

    let startsWithNewLine = false;
    let replaceNewLine = false;
    if (match[0].startsWith('\n')) {
      startsWithNewLine = true;
    }
    if (startsWithNewLine && !newDescription.substring(0, match.index).trim().endsWith('.')) {
      // remove newline and add space
      replaceNewLine = true;
    }

    let startString = '';
    if (startsWithNewLine && !replaceNewLine) {
      startString += '\n';
    }
    if (replaceNewLine) {
      startString += ' ';
    }

    // if character after span is a alphanumeric, then add a space at the end
    let endString = '';
    if (newDescription.substring(match.index + match[0].length, match.index + match[0].length + 1).match(/[a-zA-Z0-9]/)) {
      endString = ' ';
    }

    // Return the modified value wrapped in **
    replacements.push([match.index, match[0], `${startString}**${modifiedValue}**${endString}`]);
  }
  // loop replacements in reverse order to not mess up index
  replacements.reverse();
  for (const replacement of replacements) {
    // replace using index
    const index = replacement[0]
    const stringToReplace = replacement[1];
    const newString = replacement[2];
    newDescription = newDescription.substring(0, index) + newString + newDescription.substring(index + stringToReplace.length);
  }

  // replace <strong>{value}</strong> with **{value}** and remove spaces and newlines around {value}
  newDescription = newDescription.replace(/<strong>([a-zA-Z0-9\.\=\s\S:\+\/-\_]*?)<\/strong>/g, function (match, group) {
    const modifiedValue = group.trim();

    // Return the modified value wrapped in **
    return `**${modifiedValue}**`;
  });

  // replace <span>{value}</span> with {value}
  newDescription = newDescription.replace(/<span>([a-zA-Z0-9\.\=\s\S:\+\/-\_]*?)<\/span>/g, function (match, group) {
    return group.trim();
  });

  // replace <p></p> with ''
  newDescription = newDescription.replace('<p></p>', '');
  newDescription = newDescription.replace('<this is="" a="" required="" field.<="" li="">', '');
  newDescription = newDescription.replace('</this>', '');

  // remove <table></table>
  newDescription = newDescription.replace(/<table>([\s\S.]*?)<\/table>/g, function (match, group) {
    return '';
  });

  // remove trailing newlines and spaces
  newDescription = newDescription.trimEnd();
  
  // replace \n with {indent} *
  newDescription = newDescription.replace(/\n/g, `\n${indent} * `);

  return newDescription;
}


export const processTypesForText = (entityData: TypeInformation) => {
  // Join types that have the same typeRefName and attributes
  // check attributes are the same for name, metaData, and description
  const allTypes = entityData.Types;
  const combineCheckedTypes: string[] = [];
  const toCombineTypes: string[] = [];
  for (const typeName in allTypes) {
    const type = allTypes[typeName];
    if (!type.typeRefName) {
      //   console.log("skipping type for combining", typeName);
      continue;
    }
    const combineTypeName = type.typeRefName;
    if (combineCheckedTypes.includes(combineTypeName)) {
      //   console.log("already checked type for combining", typeName);
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
      let useName = attribute.name;
      let useType = attribute.type;
      let addOn: string | null = null;

      if (attribute.name === "") {
        throw new Error("pulledAttrName not set");
      }

      // check typeAttribute fixes
      const typeAttributeFix = typeAttributeFixes[typeName]?.[attribute.name];
      if (typeAttributeFix) {
        if (typeAttributeFix.interfaceValue) {
          typeText += typeAttributeFix.interfaceValue;
          continue;
        }
        if (typeAttributeFix.fixedName) {
          useName = typeAttributeFix.fixedName;
        }
        if (typeAttributeFix.fixedType) {
          useType = typeAttributeFix.fixedType;
        }
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
      let attrNames = useName.split(" ");

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
          let enumTest = enumValuesMatch[1];
          if (enumValueFixes[enumTest]) {
            enumTest = enumValueFixes[enumTest];
          }

          enumValues.push(`"${enumTest}"`);
        }
        console.log("enum values", useName, enumValues);
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
          typeText += `   * DESCRIPTION: ${cleanseDescription(attribute.description)}\n`;
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
