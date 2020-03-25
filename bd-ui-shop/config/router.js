import VueRouter from "vue-router";
import Vue from "vue";
import routes from "@/base/router";
import utilApi from "@/base/api/utils";
let Base64 = require("js-base64").Base64;
Vue.use(VueRouter);
const router = new VueRouter({
  routes: routes
  // mode: "history"
});

router.beforeEach((to, from, next) => {
  // console.log(to)
  // console.log(from)
  //!***********身份校验***************
  // let token = sessionStorage.getItem("token");
  //   if (token != null) {
  //     next();
  //   } else {
  utilApi
    .getCurrentUser()
    .then(result => {
      if (result) {
        console.log(result);
        sessionStorage.setItem("token", result.access_token);
        next();
      } else {
        //跳转到统一登陆
        // next({path: "/login"})
        window.location =
          "http://oauth.budingcc.cn:40000/oauth/authorize?" +
          "client_id=webBuding&" +
          "redirect_uri=http://admin.budingcc.cn:40010/oauth/callback&" +
          "response_type=code&" +
          "state=" +
          window.location.href;
      }
    })
    .catch(err => {
      window.location =
        "http://oauth.budingcc.cn:40000/oauth/authorize?" +
        "client_id=webBuding&" +
        "redirect_uri=http://admin.budingcc.cn:40010/oauth/callback&" +
        "response_type=code&" +
        "state=" +
        window.location.href;
    });
  //   }
});
// 授权
// router.afterEach((to, from, next) => {
//   if (openAuthorize) {
//     let activeUser;
//     try {
//       activeUser = utilApi.getActiveUser();
//     } catch (e) {
//       //alert(e)
//     }
//     if (activeUser) {
//       //权限校验
//       let requiresAuth = to.meta.requiresAuth;
//       let permission = to.meta.permission;
//       if (requiresAuth && permission) {
//         utilApi.checkAuthorities(router, permission);
//       }
//     }
//   }
// });

import axios from "axios";
import * as loginApi from "@/base/api/login";
// 添加请求拦截器
// axios.interceptors.request.use(
//   config => {
//     // 在发送请求向header添加jwt
//     let token = sessionStorage.getItem("token");
//     if (token) {
//       config.headers["Authorization"] = "bearer " + token;
//     }
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );
// 响应拦截
axios.interceptors.response.use(data => {
  console.log("data=");
  console.log(data);
  if (data && data.data) {
    if (data.data.code && data.data.code == "40001") {
      loginApi
        .logout()
        .then(result => {
          if (result.success) {
            window.location.href =
              "http://oauth.budingcc.cn:40000/logout?redirect_uri=" +
              window.location.href;
          } else {
            this.$snackbar.error("注销失败");
          }
        })
        .catch(err => {
          this.$snackbar.error("注销失败");
        });
    } else if (data.data.code && data.data.code == "10002") {
      Message.error("您没有此操作的权限，请与客服联系！");
    } else if (data.data.code && data.data.code == "10003") {
      Message.error("认证被拒绝，请重新登录重试！");
    }
  }
  return data;
});

export default router;
