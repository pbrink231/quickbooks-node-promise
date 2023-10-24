import { AppConfig, CriteriaItem, QueryBase, QueryData, QueryInput } from ".";

export const checkConfig = (appConfig: AppConfig) => {
  if (!appConfig.appKey) throw new Error("appKey is missing");
  if (!appConfig.appSecret) throw new Error("appScret is missing");
  if (!appConfig.redirectUrl) throw new Error("RedirectUrl is missing");
  if (!appConfig.scope) throw new Error("scope is missing");
  if (!appConfig.storeStrategy) throw new Error("storeStrategy is missing");
};

export const getDateCheck = (dateItem: Date | string | number) => {
  let dateToCheck: number | null = null;
  if (
    typeof dateItem == "object" &&
    Object.prototype.toString.call(dateItem) === "[object Date]"
  ) {
    dateToCheck = (dateItem as Date).getTime();
  }
  if (typeof dateItem == "number") {
    dateToCheck = new Date(dateItem).getTime();
  }
  if (typeof dateItem == "string") {
    dateToCheck = Date.parse(dateItem);
  }
  return dateToCheck;
};

/**
 * Helper Method to check token expiry { set Token Object }
 */
export const dateNotExpired = (
  expired_timestamp: Date | number | string,
  bufferTimeSeconds: number
) => {
  const dateToCheck = getDateCheck(expired_timestamp);
  if (!dateToCheck) return false;

  // use buffer on time
  const dif = dateToCheck - (bufferTimeSeconds * 1000);
  return dif > Date.now();
};

export const getQueryItems = (
  queryData: QueryData | CriteriaItem | CriteriaItem[]
): [CriteriaItem[], QueryBase] => {
  if (Array.isArray(queryData)) {
    return [queryData, {}];
  }
  if (
    typeof queryData === "object" &&
    !Array.isArray(queryData) &&
    queryData.hasOwnProperty("items")
  ) {
    const { items, ...queryBase } = queryData as QueryData;
    return [items, queryBase];
  }
  if (
    typeof queryData === "object" &&
    !Array.isArray(queryData) &&
    queryData.hasOwnProperty("field")
  ) {
    return [[queryData as CriteriaItem], {}];
  }
  throw new Error("Invalid Query Data");
};

export const getBaseQueryItems = (
  criteriaItems: CriteriaItem[]
): [CriteriaItem[], QueryBase] => {
  const baseQuery: QueryBase = {};
  const cleanedCriteria: CriteriaItem[] = [];
  for (const item of criteriaItems) {
    if (item.field === "limit") {
      const limit = Number(item.value);
      if (isNaN(limit)) throw new Error("Invalid limit value");
      baseQuery.limit = limit;
      continue;
    }
    if (item.field === "offset") {
      const offset = Number(item.value);
      if (isNaN(offset)) throw new Error("Invalid offset value");
      baseQuery.offset = offset;
      continue;
    }
    if (item.field === "sort") {
      if (!Array.isArray(item.value)) throw new Error("Invalid sort value");
      baseQuery.sort = item.value;
      continue;
    }
    if (item.field === "fetchAll") {
      baseQuery.fetchAll = item.value ? true : false;
      continue;
    }
    if (item.field === "count") {
      baseQuery.count = item.value ? true : false;
      continue;
    }
    cleanedCriteria.push(item);
  }
  return [cleanedCriteria, baseQuery];
};

const cleanValue = (x: any) => {
  return typeof x === "string" ? "'" + x.replace(/'/g, "\\'") + "'" : x;
};

const getSqlValue = (x: any, operator: string) => {
  if (operator === "IN") {
    if (!Array.isArray(x)) throw new Error("Invalid IN value");
    return "(" + x.map(cleanValue).join(",") + ")";
  }
  return cleanValue(x);
};

const criteriaToSql = (criteriaItems: CriteriaItem[], queryBase: QueryBase) => {
  let sql = "";
  for (const criterion of criteriaItems) {
    if (sql != "") {
      sql += " and ";
    }
    const operator =
      criterion.operator ?? Array.isArray(criterion.value) ? "IN" : "=";
    let value = operator === "IN" ? criterion.value : [criterion.value];
    sql += `${criterion.field} ${operator} ${getSqlValue(value, operator)}`;
  }
  if (sql != "") {
    sql = " where " + sql;
  }
  if (queryBase.asc) sql += ` orderby ${queryBase.asc} asc`;
  if (queryBase.desc) sql += ` orderby ${queryBase.desc} desc`;
  if (queryBase.sort)
    sql += ` orderby ${queryBase.sort
      .map((x) => `${x[0]}${x[1] ? ` ${x[1]}` : ""}`)
      .join(",")}`;
  if (queryBase.offset) sql += ` startposition ${queryBase.offset}`;
  if (queryBase.limit) sql += ` maxresults ${queryBase.limit}`;
  return sql;
};

export const getQueryString = (
  entityName: string,
  queryData?: QueryInput | null
): [string, QueryData | null] => {
  let query = "select * from " + entityName;

  if (!queryData) {
    return [query, null];
  }

  if (typeof queryData === "string") {
    return [queryData, null];
  }

  let [criteriaItems, queryBaseInitial] = getQueryItems(queryData);
  const [criteriaItemsClean, criteriaBase] = getBaseQueryItems(criteriaItems);

  if (queryBaseInitial.limit && criteriaBase.limit) {
    throw new Error("Cannot specify limit in both query and criteria");
  }
  if (queryBaseInitial.offset && criteriaBase.offset) {
    throw new Error("Cannot specify offset in both query and criteria");
  }
  if (queryBaseInitial.fetchAll && criteriaBase.fetchAll) {
    throw new Error("Cannot specify fetchAll in both query and criteria");
  }
  if (queryBaseInitial.count && criteriaBase.count) {
    throw new Error("Cannot specify count in both query and criteria");
  }
  if (queryBaseInitial.sort && criteriaBase.sort) {
    throw new Error("Cannot specify sort in both query and criteria");
  }
  if (queryBaseInitial.asc && criteriaBase.asc) {
    throw new Error("Cannot specify asc in both query and criteria");
  }
  if (queryBaseInitial.desc && criteriaBase.desc) {
    throw new Error("Cannot specify desc in both query and criteria");
  }
  if (
    [queryBaseInitial.asc, queryBaseInitial.desc, queryBaseInitial.sort].filter(
      (x) => x
    ).length > 1
  ) {
    throw new Error("Cannot specify more than one sort in query");
  }

  const queryBase: QueryBase = {
    ...queryBaseInitial,
    ...criteriaBase,
  };

  if (queryBase.count) {
    query = query.replace("select * from", "select count(*) from");
  }
  if (!queryBase.limit || queryBase.limit > 1000 || queryBase.limit < 1) {
    queryBase.limit = 1000;
  }
  query += criteriaToSql(criteriaItemsClean, queryBase);
  const queryDataClean: QueryData = {
    ...queryBase,
    items: criteriaItemsClean,
  };
  return [query, queryDataClean];
};
