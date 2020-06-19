import http from "./public";
import { systemConfig } from "@/../config/system";
let adminApiUrl = systemConfig.adminApiUrl;
let gatewayApiUrl = systemConfig.gatewayApiUrl;

/*退出*/
export const logout = params => {
  return http.requestPost(adminApiUrl + "/oauth/logout");
};

export const listSchools = () => {
  return http.requestGet(gatewayApiUrl + "/api/ucenter/school/list");
};

export const getAccessToken = () => {
  return http.requestGet(adminApiUrl + "/oauth/jwt");
};
