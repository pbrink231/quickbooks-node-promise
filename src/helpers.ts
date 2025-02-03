import Quickbooks, {
  AppConfig,
  AppConfigClean,
  AppConfigCleanBase,
  CriteriaItem,
  QueryBase,
  QueryData,
  QueryDataWithProperties,
  QueryInput,
  QuerySort,
  QuerySortInput,
} from ".";

export const getAuthBase64 = (appConfig: AppConfigClean) => {
  const { appKey, appSecret } = appConfig;
  return Buffer.from(`${appKey}:${appSecret}`).toString("base64");
}

export const getConfigWithStoreMethod = (appConfig: AppConfig): AppConfigClean => {
  const hasStoreTokenProperties = 'accessToken' in appConfig;
  const hasStoreClassProperties = 'storeStrategy' in appConfig;
  const hasStoreFunctionsProperties =
    ('saveToken' in appConfig && appConfig.saveToken !== undefined) ||
    ('getToken' in appConfig && appConfig.getToken !== undefined);

  const typeCount = [hasStoreTokenProperties, hasStoreClassProperties, hasStoreFunctionsProperties].filter(Boolean).length;

  if (typeCount > 1) {
    throw new Error('Invalid AppConfig. Please check the properties and only use one store method.');
  }

  const useProduction = appConfig.useProduction === "true" || appConfig.useProduction === true ? true : false;
  const base: AppConfigCleanBase = 
    {
      ...appConfig,
      debug: appConfig.debug === "true" || appConfig.debug === true ? true : false,
      autoRefresh: appConfig.autoRefresh === false ? false : true,
      autoRefreshBufferSeconds: appConfig.autoRefreshBufferSeconds ? appConfig.autoRefreshBufferSeconds : Quickbooks.EXPIRATION_BUFFER_SECONDS,
      useProduction: useProduction
    }



  if (hasStoreTokenProperties) {
    return {
      ...appConfig,
      ...base,
      storeMethod: 'Internal'
    }
  }
  if (hasStoreClassProperties) {
    return {
      ...appConfig,
      ...base,
      storeMethod: 'Class'
    }
  }
  if (hasStoreFunctionsProperties) {
    return {
      ...appConfig,
      ...base,
      storeMethod: 'Function'
    }
  }
  if (!appConfig.appKey || !appConfig.appSecret) {
    throw new Error('appKey and appSecret are required if not token given on internal storage');
  }
  return {
    ...appConfig,
    ...base,
    storeMethod: 'Internal'
  }
  throw new Error('Invalid AppConfigStore. Please check the properties.');
}


export const getDateCheck = (dateItem: Date | number) => {
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
  return dateToCheck;
};

export const getDateString = (dateItem: Date | number | string | null) => {
  if (dateItem === null) return new Date().toISOString();
  if (typeof dateItem == "string") return dateItem;
  const dateToCheck = getDateCheck(dateItem);
  if (!dateToCheck) return new Date().toISOString();
  return new Date(dateToCheck).toISOString();
}

/**
 * Helper Method to check token expiry { set Token Object }
 */
export const dateNotExpired = (
  expired_timestamp: Date | number,
  bufferTimeSeconds: number
) => {
  const dateToCheck = getDateCheck(expired_timestamp);
  if (!dateToCheck) return false;

  // use buffer on time
  const dif = dateToCheck - bufferTimeSeconds * 1000;
  return dif > Date.now();
};

const convertKeysToCriteria = (obj: QueryDataWithProperties): QueryData => {
  const criterias: CriteriaItem[] = [];
  const baseQuery: QueryBase = {};
  for (const key in obj) {
    // ignore base query items
    if (
      key === "limit"
    ) {
      baseQuery[key] = obj[key];
      continue;
    }
    if (key === "offset") {
      baseQuery[key] = obj[key];
      continue;
    }
    if (key === "fetchAll") {
      baseQuery[key] = obj[key];
      continue;
    }
    if (key === "count") {
      baseQuery[key] = obj[key];
      continue;
    }
    if (key === "asc") {
      baseQuery[key] = obj[key];
      continue;
    }
    if (key === "desc") {
      baseQuery[key] = obj[key];
      continue;
    }
    if (key === "sort") {
      baseQuery.sort = cleanSortData(obj[key])
      continue;
    }
    if (key === "items") {
      for (const item of obj[key]) {
        criterias.push(item);
      }
      continue;
    }
    if (obj.hasOwnProperty(key)) {
      criterias.push({
        field: key,
        value: obj[key],
      });
      continue;
    }
  }
  return {
    ...baseQuery,
    items: criterias,
  };
};

export const getQueryItems = (
  queryDataInput: QueryDataWithProperties | CriteriaItem | CriteriaItem[]
): [CriteriaItem[], QueryBase] => {
  if (Array.isArray(queryDataInput)) {
    return [queryDataInput, {}];
  }
  if (
    typeof queryDataInput === "object" &&
    !Array.isArray(queryDataInput) &&
    queryDataInput.hasOwnProperty("items")
  ) {
    const { items, ...queryBase } = convertKeysToCriteria(
      queryDataInput as QueryDataWithProperties
    );
    return [items, queryBase];
  }
  if (
    typeof queryDataInput === "object" &&
    !Array.isArray(queryDataInput) &&
    queryDataInput.hasOwnProperty("field") &&
    queryDataInput.hasOwnProperty("value")
  ) {
    return [[queryDataInput as CriteriaItem], {}];
  }
  if (typeof queryDataInput === "object" && !Array.isArray(queryDataInput)) {
    const { items, ...queryBase } = convertKeysToCriteria(
      queryDataInput as QueryDataWithProperties
    );
    return [items, queryBase];
  }
  throw new Error(
    "Invalid Query Data, must be CriteriaItem, CriteriaItem[] or QueryDataWithProperties"
  );
};

const cleanSortData = (sortData: QuerySortInput): QuerySort => {
  if (!sortData) throw new Error("Invalid sort value");

  if (!Array.isArray(sortData) && typeof sortData === "string") {
    return [[sortData, "ASC"]];
  }
  if (Array.isArray(sortData) && sortData.length === 0) {
    return [];
  }
  if (Array.isArray(sortData) && sortData.length > 0) {
    if (sortData.length == 2 && typeof sortData[0] === "string" && typeof sortData[1] === "string" && sortData[0] != "") {
      const sortField: string = sortData[0];
      const sortDirection: string = sortData[1].toUpperCase();
      if (sortDirection === "ASC" || sortDirection === "DESC") {
        return [[sortField, sortDirection]];
      }
    }
    const newSort: [string, "ASC" | "DESC"][] = [];
    for (const sortItem of sortData) {
      if (typeof sortItem === "string") {
        newSort.push([sortItem, "ASC"]);
        continue;
      }
      if (
        Array.isArray(sortItem) &&
        sortItem.length === 2 &&
        typeof sortItem[0] === "string" &&
        typeof sortItem[1] === "string"
      ) {
        const newSortField = sortItem[0];
        const newSortDirection = sortItem[1].toUpperCase();
        if (
          newSortField != "" &&
          (newSortDirection === "ASC" || newSortDirection === "DESC")
        ) {
          const newSortItem: [string, "ASC" | "DESC"] = [
            newSortField,
            newSortDirection,
          ];
          newSort.push(newSortItem);
          continue;
        }
      }
      throw new Error("Invalid sort value");
    }
    return newSort;
  }
  throw new Error("Invalid sort value");
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
      baseQuery.sort = cleanSortData(item.value);
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
  if (x === undefined || x === null) return `' '`;
  if (typeof x === "string") return `'${x.replace(/'/g, "\\'")}'`;
  if (typeof x === "boolean" && x === true) return `true`;
  if (typeof x === "boolean" && x === false) return `false`;
  return `'${x.toString()}'`;
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
    let operator = criterion.operator;
    if (Array.isArray(criterion.value) && !operator) {
      operator = "IN";
    }
    if (!operator) {
      operator = "=";
    }
    if (Array.isArray(criterion.value) && operator !== "IN") {
      throw new Error("Invalid operator for array value");
    }
    sql += `${criterion.field} ${operator} ${getSqlValue(
      criterion.value,
      operator
    )}`;
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
  if (queryBase.offset) sql += ` startposition ${queryBase.offset + 1}`;
  if (queryBase.limit) sql += ` maxresults ${queryBase.limit}`;
  return sql;
};

export const getQueryString = (
  entityName: string,
  queryDataInput: QueryInput | null,
  useCount?: boolean
): [string, QueryData | null] => {
  let query = "select * from " + entityName;

  if (useCount) {
    query = query.replace("select * from", "select count(*) from");
  }

  if (queryDataInput === null) {
    return [query, null];
  }

  if (typeof queryDataInput === "string") {
    return [queryDataInput, null];
  }

  let [criteriaItems, queryBaseInitial] = getQueryItems(queryDataInput);
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

  if (queryBase.hasOwnProperty("fetchAll")) {
    queryBase.fetchAll = queryBase.fetchAll ? true : false;
  }
  if (queryBase.hasOwnProperty("count")) {
    queryBase.count = queryBase.count ? true : false;
    if (queryBase.count && !useCount) {
      throw new Error(
        "count is depricated and cannot be used in query,  use count[entityName] instead"
      );
    }
    if (queryBase.count) {
      query = query.replace("select * from", "select count(*) from");
    }
  }

  if (!queryBase.limit || queryBase.limit > 1000 || queryBase.limit < 1) {
    if (queryBase.fetchAll && (!queryBase.limit || queryBase.limit > 1000)) {
      queryBase.limit = 1000;
    } else {
      queryBase.limit = 100;
    }
  }
  if (queryBase.limit) {
    const limit = Number(queryBase.limit);
    if (isNaN(limit)) throw new Error("Invalid limit value");
  }
  if (queryBase.offset) {
    const offset = Number(queryBase.offset);
    if (isNaN(offset)) throw new Error("Invalid offset value");
  }
  if (queryBase.sort) {
    if (!Array.isArray(queryBase.sort)) throw new Error("Invalid sort value");
  }

  query += criteriaToSql(criteriaItemsClean, queryBase);
  const queryDataClean: QueryData = {
    ...queryBase,
    items: criteriaItemsClean,
  };
  return [query, queryDataClean];
};
