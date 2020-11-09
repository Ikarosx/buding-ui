import http from "@/base/api/public";
import querystring from "querystring";
let { systemConfig } = require("@/../config/system");
let gatewayApiUrl = systemConfig.gatewayApiUrl;
let bdApiUrlPre = systemConfig.bdApiUrlPre;
export const getUserProfile = (studentId) => {
  return http.requestGet(
    gatewayApiUrl + bdApiUrlPre + "/ucenter/user/simple/" + studentId
  );
};

export const updateUser = params => {
  return http.requestPut(gatewayApiUrl + "/ucenter/user/", params);
}
