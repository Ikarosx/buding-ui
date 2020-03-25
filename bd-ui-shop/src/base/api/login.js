import http from "./public";
import { systemConfig } from "@/../config/system";
let apiUrl = systemConfig.bdApiUrl;

/*退出*/
export const logout = params => {
  return http.requestPost("http://admin.budingcc.cn:40010/oauth/logout");
};

export const listSchools = () => {
  return http.requestGet(apiUrl + "/api/ucenter/school/list");
};
