import * as fs from "fs";
import { processTypesForText } from "./textToInteraces";
import { getQuickbookEntityTypes } from "./scraper";

const dumpFile = "quickbooks-type-scrape/qbTypesDump.json";
const typesFile = "src/qbTypes.ts";
export interface Attribute {
  name: string;
  type: string;
  description: string;
  metaData: string;
  isList?: boolean;
}

export interface TypeItem {
  order: number;
  attributes: Attribute[];
  isMain: boolean;
  typeRefName: string | null;
  nameDepthString: string;
}

export interface TypeItems {
  [key: string]: TypeItem;
}

export interface TypeInformation {
  createEntityies: string[];
  readEntityies: string[];
  deleteEntityies: string[];
  queryEntities: string[];
  fullUpdateEntityies: string[];
  sparseUpdateEntityies: string[];
  sendPdfEntityies: string[];
  getPdfEntityies: string[];
  Types: {
    [key: string]: TypeItem;
  };
}

const pullingTypesFile = async () => {
  console.log("pulling");
  try {
    const types = await getQuickbookEntityTypes();
    fs.writeFileSync(dumpFile, JSON.stringify(types, null, 2));
    console.log("finished writing file");
  } catch (error) {
    console.log("error writing file", error);
  }
};

const processTypesFile = () => {
  console.log("processing");
  try {
    const allTypes = JSON.parse(fs.readFileSync(dumpFile, "utf8"));
    const allTypeText = processTypesForText(allTypes);
    fs.writeFileSync(typesFile, allTypeText);
    console.log("finished writing file");
  } catch (error) {
    console.log("error writing file", error);
  }
};

const main = async () => {
  // get args
  // pull then run getQuickbookEntityTypes
  if (process.argv.length < 3) {
    console.log("No args given");
    return;
  }

  const arg = process.argv[2];

  if (arg === "pull") {
    pullingTypesFile();
    return;
  }

  if (arg === "process") {
    processTypesFile();
    return;
  }

  if (arg === "run") {
    await pullingTypesFile();
    processTypesFile();
    return;
  }
  console.log("Incorrect arg given");
};

main();
