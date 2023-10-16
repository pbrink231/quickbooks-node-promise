import puppeteer from "puppeteer";
import * as fs from "fs";

const baseUrl =
  "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/";
const baseElementsWait =
  "#api-reference > div.viewport-height > div.entity-div.v2.large > div > div:nth-child(5)";

const baseElementsSelector =
  "#api-reference > div.viewport-height > div.entity-div.v2.large > div > div.operations";

interface Attribute {
  name?: string;
  type?: string;
  description?: string;
  metaData?: string;
  isList?: boolean;
}

interface TypeItems {
  [key: string]: {
    order: number;
    attributes: Attribute[];
  };
}

const getQuickbookEntityTypes = async () => {
  try {
    const pageList = ["item", "customer", "invoice"];
    const allTypes: TypeItems = {};

    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });

    // Open a new page
    const page = await browser.newPage();

    for (const [pageIndex, pageItem] of pageList.entries()) {
      console.log("going to page");
      await page.goto(baseUrl + pageItem);

      console.log("waiting for selector");
      await page.waitForSelector(baseElementsSelector);

      console.log("page delay for check");
      await new Promise((r) => setTimeout(r, 2000));

      await page.screenshot({ path: "screenshot.png" });

      console.log("evaluating page");
      // let interestHtml = await page.content();
      const returndTypes: TypeItems = await page.evaluate(() => {
        const processAttributesElement = (
          attr_content: Element,
          types: TypeItems,
          curTypeName: string
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

          if (types[curTypeName]) {
            // already processed type
            console.log("skipping type");
            return;
          }

          types[curTypeName] = {
            order: Object.keys(types).length,
            attributes: [],
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
                const newAttribute: Attribute = {};
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
                                  attr_item_info_first.innerHTML.trim();
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
                    if (!curAttributeType) {
                      throw new Error("itemType not set");
                    }
                    console.log("Cur Attribute", newAttribute);
                    let refName = curAttributeType;
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

                    // loop children and process
                    for (const ref_child of attr_item_data.children) {
                      if (ref_child.tagName === "SPAN") {
                        // console.log("ref_child_name", ref_child);
                        refName = ref_child.innerHTML.trim();
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
                              refName
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
                attributes.push(newAttribute);
              }
              console.log("typeItems", attributes);
              types[curTypeName].attributes = attributes;
            }
          }
          return;
        };
        const types: TypeItems = {};
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
          for (const sectionChild of section.children) {
            if (!sectionChild.classList.contains("method-attributes")) {
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
                processAttributesElement(attr_content, types, curTypeName);
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

            continue;
          }
        }

        return types;
      });
      console.log("final json", JSON.stringify(returndTypes, null, 2));
      console.log("final types", returndTypes);
      // loop through types and update all types object
      for (const typeName of Object.keys(returndTypes)) {
        const type = returndTypes[typeName];
        // get current max order number from allTypes
        const maxOrderNumber =
          Object.keys(allTypes).reduce((acc, cur) => {
            if (allTypes[cur].order > acc) {
              return allTypes[cur].order;
            }
            return acc;
          }, 0) + 1;
        // increase number by max order number
        type.order += maxOrderNumber;
        if (allTypes[typeName]) {
          // increase order number and skip
          allTypes[typeName].order = type.order;
          console.log("skipping type", typeName);
          continue;
        }
        allTypes[typeName] = type;
      }
    }
    console.log("alltypes", allTypes);

    const sortedTypes = Object.keys(allTypes)
      .map((key) => {
        return {
          name: key,
          order: allTypes[key].order,
        };
      })
      .sort((a, b) => {
        return b.order - a.order;
      })
      .map((item) => {
        return item.name;
      });

    console.log("sortedTypes", sortedTypes);

    let allTypeText = "";
    const typeConversion: {
      [key: string]: {
        newType: string | null;
        addOnDescription: string | null;
      };
    } = {
      String: { newType: "string", addOnDescription: null },
      Boolean: { newType: "boolean", addOnDescription: null },
      Number: { newType: "number", addOnDescription: null },
      Decimal: { newType: "number", addOnDescription: null },
      "Numeric Id": { newType: "number", addOnDescription: null },
      IdType: { newType: "number", addOnDescription: null },
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
    };

    const ignoreTypes = ["DateTime", "Date"];

    for (const typeName of sortedTypes) {
      if (ignoreTypes.includes(typeName)) {
        console.log("skipping type", typeName)
        continue;
      }
      if (allTypeText !== "") {
        allTypeText += "\n";
      }

      let typeText = `interface ${typeName} {\n`;
      const type = allTypes[typeName];
      const attributes = type.attributes;

      for (const attribute of attributes) {
        let useType = attribute.type;
        let addOn = null;

        // convert type
        if (typeConversion[attribute.type]) {
          const typeCheck = typeConversion[attribute.type];
          if (typeCheck.newType) {
            useType = typeCheck.newType;
          }
          if (typeCheck.addOnDescription) {
            addOn = typeCheck.addOnDescription;
          }
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
            typeText += `   * DESCRIPTION: ${attribute.description}\n`;
            addSpacer = true;
          }
          typeText += `   */\n`;
        }
        // check if metadata starts with "* Required" to know if required
        const isReq = attribute.metaData?.startsWith("* Required") ? "" : "?";
        // if is list and type has | in it, need to wrap in ()

        const attrName = attribute.name;
        const isList = attribute.isList ? "[]" : "";

        if (isList && attribute.type.includes("|")) {
          typeText += `  ${attrName}${isReq}: (${useType})[];\n`;
          continue;
        }
        typeText += `  ${attrName}${isReq}: ${useType}${isList};\n`;
      }
      typeText += "}\n";
      allTypeText += typeText;
    }

    // save to file qbTypes.d.ts
    try {
      fs.writeFileSync("qbTypes.d.ts", allTypeText);
      console.log("finished writing file");
    } catch (error) {
      console.log("error writing file", error);
    }
  } catch (error) {
    console.log(error);
    // browser.close();
  }
};

getQuickbookEntityTypes();
