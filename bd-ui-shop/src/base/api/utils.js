import http from "./public"
import { systemConfig } from "@/../config/system";
let apiUrl = systemConfig.bdApiUrl;
export default {
    getCurrentUser(){
        return http.requestQuickGet("http://admin.budingcc.cn:40010/oauth/me");
    }
}