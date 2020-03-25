import http from "@/base/api/public";
import querystring from "querystring";
import { systemConfig } from "@/../config/system";
let apiUrl = systemConfig.bdApiUrl;
export const listCategoryStruct = () => {
  return http.requestGet(apiUrl + "/api/shop/category/struct");
};

export const listGoods = (page, size, params) => {
  let query = querystring.stringify(params);
  return http.requestGet(
    apiUrl + "/api/es/good/list/" + page + "/" + size + "?" + query
  );
};

export const deleteFile = params => {
  let query = querystring.stringify(params);
  return http.requestDelete(apiUrl + "/api/filesystem?" + query);
};

export const insertGood = params => {
  return http.requestPost(apiUrl + "/api/shop/good", params);
};

export const deleteGood = id => {
  return http.requestDelete(apiUrl + "/api/shop/good/" + id);
};

export const deleteGoods = ids => {
  return http.requestDelete(apiUrl + "/api/shop/good/list/" + ids);
};
