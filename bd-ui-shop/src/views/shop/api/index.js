import http from "@/base/api/public";
import querystring from "querystring";
import { systemConfig } from "@/../config/system";
let gatewayApiUrl = systemConfig.gatewayApiUrl;
export const listCategoryStruct = () => {
  return http.requestGet(gatewayApiUrl + "/api/shop/category/struct");
};

export const listGoods = (page, size, params) => {
  let query = querystring.stringify(params);
  return http.requestGet(
    gatewayApiUrl + "/api/es/good/list/" + page + "/" + size + "?" + query
  );
};

export const deleteFile = params => {
  let query = querystring.stringify(params);
  return http.requestDelete(gatewayApiUrl + "/api/filesystem?" + query);
};

export const insertGood = params => {
  return http.requestPost(gatewayApiUrl + "/api/shop/good", params);
};

export const deleteGood = id => {
  return http.requestDelete(gatewayApiUrl + "/api/shop/good/" + id);
};

export const deleteGoods = ids => {
  return http.requestDelete(gatewayApiUrl + "/api/shop/good/list/" + ids);
};
