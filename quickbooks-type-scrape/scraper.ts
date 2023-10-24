import puppeteer from "puppeteer";
import { EntityName } from "../src";
import { Attribute, TypeItem, TypeInformation, TypeItems } from ".";
import * as fs from "fs";

const pageList = Object.values(EntityName); // ["item", "customer", "invoice"];

const baseUrl =
  "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/";
const baseElementsWait =
  "#api-reference > div.viewport-height > div.entity-div.v2.large > div > div:nth-child(5)";

const baseElementsSelector =
  "#api-reference > div.viewport-height > div.entity-div.v2.large > div > div.operations";

export const getQuickbookEntityTypes = async () => {
  const allTypes: TypeInformation = {
    createEntityies: [],
    readEntityies: [],
    deleteEntityies: [],
    queryEntities: [],
    fullUpdateEntityies: [],
    sparseUpdateEntityies: [],
    sendPdfEntityies: [],
    getPdfEntityies: [],
    Types: {},
  };

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  try {
    // Open a new page
    const page = await browser.newPage();

    for (const [pageIndex, pageItem] of pageList.entries()) {
      console.log("going to page");
      await page.goto(baseUrl + pageItem);

      console.log("waiting for selector");
      await page.waitForSelector(baseElementsSelector);

      console.log("page delay for check");
      await new Promise((r) => setTimeout(r, 100));

      await page.screenshot({ path: "screenshot.png" });

      console.log("evaluating page");
      // let interestHtml = await page.content();
      const returndTypes = await page.evaluate(() => {
        const nameDepthSplitter = "_";
        const processAttributesElement = (
          attr_content: Element,
          types: TypeItems,
          curTypeName: string,
          typeRefName: string | null,
          nameDepth: string[]
        ) => {
          console.log(
            "processAttributesElement",
            attr_content,
            types,
            curTypeName
          );
          if (!curTypeName) {
            throw new Error("curTypeName not set");
          }

          const newType: TypeItem = {
            order: Object.keys(types).length,
            attributes: [],
            isMain: nameDepth.length === 1 ? true : false,
            typeRefName: typeRefName,
            nameDepthString: nameDepth.join(nameDepthSplitter),
          };

          for (const attr_header of attr_content.children) {
            // check if ul tag
            if (
              attr_header.tagName === "SPAN" &&
              attr_header.classList.contains("attributes-list-title")
            ) {
              // ignoring this
              continue;
            }
            if (attr_header.tagName === "UL") {
              console.log("attr_header", attr_header);
              const attributes: Attribute[] = [];
              for (const attribute_list_item of attr_header.children) {
                console.log("attr_list", attribute_list_item);
                const newAttribute: Partial<Attribute> = {
                  name: "",
                };
                let curAttributeType: string | null = null;
                let curAttributeName: string | null = null;
                const childRefs: string[] = [];
                for (const attr_item_data of attribute_list_item.children) {
                  // if class has attribute-content
                  if (attr_item_data.classList.contains("attribute-content")) {
                    // console.log("attr_item_info", attr_item_data);
                    for (const attr_content of attr_item_data.children) {
                      if (attr_content.classList.contains("attribute-rules")) {
                        for (const attr_rules of attr_content.children) {
                          // console.log("attr_rules_item", attr_rules);
                          if (attr_rules.classList.contains("attribute-name")) {
                            console.log("attr_item_name", attr_rules.innerHTML);
                            let attrName = attr_rules.innerHTML.trim();
                            // if name ends with [0..n], remove it
                            if (attrName.endsWith("[0..n]")) {
                              attrName = attrName.replace("[0..n]", "").trim();
                              newAttribute.isList = true;
                            }
                            newAttribute.name = attrName;
                            curAttributeName = attrName;
                            continue;
                          }
                          if (
                            attr_rules.classList.contains("attribute-metadata")
                          ) {
                            let attr_rules_text = "";
                            for (const attr_rules_item_metadata of attr_rules.children) {
                              console.log(
                                "attr_rules_item_metadata",
                                attr_rules_item_metadata
                              );
                              // if has children, skip
                              let attr_rules_text_base = "";
                              for (const attr_rules_item_metadata_child of attr_rules_item_metadata.children) {
                                console.log(
                                  "attr_rules_item_metadata_child",
                                  attr_rules_item_metadata_child
                                );
                                if (
                                  attr_rules_item_metadata_child.tagName ===
                                  "SPAN"
                                ) {
                                  console.log(
                                    "span tag",
                                    attr_rules_item_metadata_child.innerHTML
                                  );
                                  const spanText =
                                    attr_rules_item_metadata_child.innerHTML;
                                  attr_rules_text_base += spanText;
                                  continue;
                                }
                              }
                              if (attr_rules_text !== "") {
                                console.log("adding comma");
                                attr_rules_text += ",";
                              }
                              attr_rules_text += attr_rules_text_base;
                            }
                            newAttribute.metaData = attr_rules_text.trim();
                            console.log("attr_rules_text", attr_rules_text);
                            continue;
                          }
                        }
                        continue;
                      }
                      if (attr_content.classList.contains("attribute-info")) {
                        for (const attr_item_info of attr_content.children) {
                          if (
                            attr_item_info.classList.contains(
                              "attribute-info-first"
                            )
                          ) {
                            for (const attr_item_info_first of attr_item_info.children) {
                              if (
                                attr_item_info_first.classList.contains(
                                  "attribute-type"
                                )
                              ) {
                                console.log(
                                  "attr_item_type",
                                  attr_item_info_first.innerHTML
                                );
                                newAttribute.type =
                                  attr_item_info_first.innerHTML.trim();
                                curAttributeType =
                                  attr_item_info_first.innerHTML
                                    .trim()
                                    .replace(",", "");
                              }
                            }
                          }
                          if (
                            attr_item_info.classList.contains(
                              "attribute-description"
                            )
                          ) {
                            newAttribute.description =
                              attr_item_info.innerHTML.trim();
                          }
                        }
                        continue;
                      }
                    }
                    console.log("skipping attr_item_info", attr_item_data);
                    continue;
                  }
                  if (attr_item_data.classList.contains("attribute-child")) {
                    // console.log("Cur Attribute", newAttribute);
                    // console.log(
                    //   "attribute sub element",
                    //   attr_item_data
                    // );
                    // console.log(
                    //   "current atribute data",
                    //   newAttribute
                    // );
                    // console.log("attribute element", attr_content);
                    // console.log(
                    //   "depth",
                    //   nameDepth,
                    //   newType.nameDepthString
                    // );
                    // console.log(
                    //   "depth check",
                    //   [
                    //     newType.nameDepthString,
                    //     curAttributeName,
                    //   ].join(nameDepthSplitter)
                    // );

                    // get child with class attribute-child-attributes-toggle
                    for (const ref_child of attr_item_data.children) {
                      if (
                        ref_child.classList.contains(
                          "attribute-child-attributes-toggle"
                        )
                      ) {
                        // console.log("ref_child", ref_child);
                        // toggling the child span element
                        for (const ref_child_child of ref_child.children) {
                          if (ref_child_child.tagName === "SPAN") {
                            // console.log("ref_child_child", ref_child_child);
                            (ref_child_child as HTMLElement).click();
                          }
                        }
                      }
                    }

                    let refName = curAttributeName
                      ? `${[...nameDepth, curAttributeName].join(
                          nameDepthSplitter
                        )}`
                      : undefined;
                    let counter = 0;
                    console.log("checking child", refName);

                    if (
                      curAttributeType &&
                      curAttributeType !== curAttributeName
                    ) {
                      refName = [refName, curAttributeType].join(
                        nameDepthSplitter
                      );
                    }

                    newAttribute.type = refName;

                    // loop children and process
                    for (const ref_child of attr_item_data.children) {
                      counter++;
                      if (ref_child.tagName === "SPAN") {
                        // console.log("ref_child_name", ref_child);
                        const grabbedChildName = ref_child.innerHTML.trim();
                        if (!refName) {
                          throw new Error("refName not set");
                        }
                        refName = [refName, grabbedChildName].join(
                          nameDepthSplitter
                        );
                        if (types[refName]) {
                          // refname exists, add counter
                          refName = `${refName}${counter}`;
                          if (types[refName]) {
                            throw new Error(
                              "refName already exists after counter"
                            );
                          }
                        }
                        continue;
                      }
                      // should be div with no class
                      if (
                        ref_child.tagName === "DIV" &&
                        !ref_child.classList.length
                      ) {
                        for (const ref_child_child of ref_child.children) {
                          if (
                            ref_child_child.classList.contains(
                              "attribute-child-attributes-toggle"
                            )
                          ) {
                            // skip because its already open
                            // console.log("skipping toggle switch that is open");
                            continue;
                          }
                          if (
                            !ref_child_child.classList.length &&
                            ref_child_child.tagName === "DIV"
                          ) {
                            if (!curAttributeName) {
                              throw new Error("curAttributeName not set");
                            }
                            if (!refName) {
                              throw new Error("refName not set");
                            }

                            // Process new attribute list
                            console.log(
                              "processing new attribute list",
                              curAttributeName,
                              refName
                            );
                            childRefs.push(refName);
                            processAttributesElement(
                              ref_child_child,
                              types,
                              refName,
                              curAttributeType,
                              [...nameDepth, curAttributeName]
                            );
                            continue;
                          }
                          console.log(
                            "attribute child",
                            ref_child,
                            ref_child_child
                          );
                          throw new Error("Child attribute not correct");
                        }
                        // save refItem
                      }
                    }
                  }
                }
                if (childRefs.length > 1) {
                  console.log("childRefs", childRefs);
                  newAttribute.type = childRefs.join(" | ");
                }
                const finishedAttribute: Attribute = {
                  name: "",
                  type: "",
                  description: "",
                  metaData: "",
                  ...newAttribute,
                };
                attributes.push(finishedAttribute);
              }
              console.log("typeItems", attributes);
              newType.attributes = attributes;
            }
          }
          // if type already exists, should compare and throw error if different
          if (types[curTypeName]) {
            if (
              JSON.stringify(newType.attributes) !==
              JSON.stringify(types[curTypeName].attributes)
            ) {
              console.log("curTypeName", curTypeName);
              console.log("types", types);
              console.log("exist type", types[curTypeName]);
              console.log("newType", newType);
              for (const attr of newType.attributes) {
                if (
                  JSON.stringify(attr) !==
                  JSON.stringify(
                    types[curTypeName].attributes.find(
                      (x) => x.name === attr.name
                    )
                  )
                ) {
                  console.log("attr", attr);
                }
              }
              throw new Error("Type already exists and is different");
            }
            return;
          }
          types[curTypeName] = newType;
          return;
        };
        const types: TypeItems = {};
        const operations: string[] = [];
        //   return document.documentElement.innerHTML;
        const baseDivs =
          "#api-reference > div.viewport-height > div.entity-div.v2.large > div > div";
        const baseSectons =
          "#api-reference > div.viewport-height > div.entity-div.v2.large > div > section";

        const divs = document.querySelectorAll(baseDivs);
        console.log("divs test", divs);
        const sections = document.querySelectorAll(baseSectons);
        console.log("sections test", sections);
        let curTypeName: string | null = null;
        let hasSparseUpdate = false;
        for (const section of sections) {
          if (section.classList.contains("title-section")) {
            for (const methodSection of section.children) {
              if (methodSection.classList.contains("method-attributes")) {
                for (const methodAttr of methodSection.children) {
                  if (methodAttr.tagName === "H1") {
                    console.log("methodAttr", methodAttr);
                    const type = methodAttr.innerHTML;
                    console.log("type", type);
                    curTypeName = type;
                  }
                }
              }
            }
            continue;
          }
          console.log("section", section);
          if (!curTypeName) {
            throw new Error("mainType not set");
          }
          // section follow, needs main name
          let sectionName: string | null = null;
          let sectionOperation: string | null = null;
          for (const sectionChild of section.children) {
            if (!sectionChild.classList.contains("method-attributes")) {
              // grab name of section
              if (sectionChild.tagName === "H2") {
                console.log("sectionChild", sectionChild);
                const sectionString = sectionChild.innerHTML;
                // if section string starts with the, operation equals entity
                if (sectionString.toLowerCase().startsWith("the")) {
                  sectionOperation = "entity";
                }
                if (sectionString.toLowerCase().startsWith("create")) {
                  sectionOperation = "create";
                }
                if (sectionString.toLowerCase().startsWith("delete")) {
                  sectionOperation = "delete";
                }
                if (sectionString.toLowerCase().startsWith("query")) {
                  sectionOperation = "query";
                }
                if (sectionString.toLowerCase().startsWith("read")) {
                  sectionOperation = "read";
                }
                if (sectionString.toLowerCase().startsWith("sparse update")) {
                  sectionOperation = "sparseUpdate";
                }
                if (sectionString.toLowerCase().startsWith("full update")) {
                  sectionOperation = "fullUpdate";
                }
                if (sectionString.toLowerCase().startsWith("send")) {
                  sectionOperation = "sendPdf";
                }
                if (sectionString.toLowerCase().startsWith("get")) {
                  sectionOperation = "getPdf";
                }
              }
              console.log("skipping section child");
              continue;
            }
            for (const sectionChildChild of sectionChild.children) {
              if (
                !sectionChildChild.classList.contains(
                  "method-attributes-content"
                )
              ) {
                console.log("skipping section child child");
                continue;
              }
              console.log("section child child", sectionChildChild);
              for (const attr_content of sectionChildChild.children) {
                // check if element is a div tag
                if (attr_content.tagName !== "DIV") {
                  console.log("skipping attr_content", attr_content);
                  continue;
                }
                console.log("attr_content", attr_content);
                console.log("Processing Sub Type", curTypeName);
                processAttributesElement(
                  attr_content,
                  types,
                  curTypeName,
                  curTypeName,
                  [curTypeName]
                );
              }
            }
          }
        }

        for (const div of divs) {
          // if div has class of toc-puller-v2, skip
          if (div.classList.contains("toc-puller-v2")) {
            console.log("skipping div");
            continue;
          }
          if (div.classList.contains("api-sub-header")) {
            console.log("skipping div");
            continue;
          }
          if (div.classList.contains("operations")) {
            // process operation
            // just checking for sparse update available
            let sectionOperation: string | null = null;
            for (const sectionChild of div.children) {
              if (sectionChild.classList.contains("method-section")) {
                for (const methodChild of sectionChild.children) {
                  if (methodChild.classList.contains("method-attributes")) {
                    for (const methodAttr of methodChild.children) {
                      // grab name of section
                      if (methodAttr.tagName === "H2") {
                        const sectionString = methodAttr.innerHTML;
                        const sectionStringLower = sectionString.toLowerCase();
                        // if section string starts with the, operation equals entity
                        if (sectionStringLower.startsWith("the")) {
                          sectionOperation = "entity";
                        }
                        if (sectionStringLower.startsWith("create")) {
                          sectionOperation = "create";
                        }
                        if (sectionStringLower.startsWith("delete")) {
                          sectionOperation = "delete";
                        }
                        if (sectionStringLower.startsWith("query")) {
                          sectionOperation = "query";
                        }
                        if (sectionStringLower.startsWith("read")) {
                          sectionOperation = "read";
                        }
                        if (sectionStringLower.startsWith("sparse update")) {
                          sectionOperation = "sparseUpdate";
                          hasSparseUpdate = true;
                        }
                        if (sectionStringLower.startsWith("full update")) {
                          sectionOperation = "fullUpdate";
                        }
                        if (sectionStringLower.startsWith("send")) {
                          sectionOperation = "sendPdf";
                        }
                        if (sectionStringLower.startsWith("get")) {
                          sectionOperation = "getPdf";
                        }
                        if (sectionOperation) {
                          operations.push(sectionOperation);
                        }
                      }
                    }
                    continue;
                  }
                }
              }
            }

            continue;
          }
        }
        if (hasSparseUpdate && curTypeName) {
          const type = types[curTypeName];
          if (!type) {
            throw new Error("type not found");
          }
          type.attributes.push({
            name: "sparse",
            type: "boolean",
            description: "If true, only fields specified will be updated",
            metaData: "",
          });
        }

        return [types, operations] as [TypeItems, string[]]
      });
      // loop through types and update all types object
      const grabbedTypes = returndTypes[0];
      const operations = returndTypes[1];
      for (const typeName of Object.keys(grabbedTypes)) {
        const type = grabbedTypes[typeName];
        allTypes.Types[typeName] = type;
      }

      // loop through operations and update all types object
      for (const operation of operations) {
        if (operation === "entity") {
          allTypes.createEntityies.push(pageItem);
        }
        if (operation === "create") {
          allTypes.createEntityies.push(pageItem);
        }
        if (operation === "delete") {
          allTypes.deleteEntityies.push(pageItem);
        }
        if (operation === "query") {
          allTypes.queryEntities.push(pageItem);
        }
        if (operation === "read") {
          allTypes.readEntityies.push(pageItem);
        }
        if (operation === "sparseUpdate") {
          allTypes.sparseUpdateEntityies.push(pageItem);
        }
        if (operation === "fullUpdate") {
          allTypes.fullUpdateEntityies.push(pageItem);
        }
        if (operation === "sendPdf") {
          allTypes.sendPdfEntityies.push(pageItem);
        }
        if (operation === "getPdf") {
          allTypes.getPdfEntityies.push(pageItem);
        }
      }
    }

    browser.close();
    return allTypes;
  } catch (error) {
    browser.close();
    console.log(error);
  }
};
