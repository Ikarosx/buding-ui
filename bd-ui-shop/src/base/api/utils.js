import http from "./public";
import { systemConfig } from "@/../config/system";
let apiUrl = systemConfig.bdApiUrl;
var getCookieF = function getCookie(name) {
  var arr,
    reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if ((arr = document.cookie.match(reg))) return arr[2];
  else return null;
};
export default {
  getCookie: getCookieF,

  setCookie: function(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie =
      c_name +
      "=" +
      escape(value) +
      (expiredays == null ? "" : ";expires=" + exdate.toGMTString());
  },
  delCookie: function(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookieF(name);
    if (cval != null) {
      // .budingcc.cn
      document.cookie = name + "=" + cval + ";domain=.budingcc.cn;expires=" + exp.toGMTString();
    }
  },
};
