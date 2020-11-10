import VueRouter from "vue-router";
import Vue from "vue";
import routes from "@/base/router";
import utilApi from "@/base/api/utils";
let Base64 = require("js-base64").Base64;
// 引入socketio
import VueSocketIO from "vue-socket.io";
Vue.use(VueRouter);
const router = new VueRouter({
    routes: routes,
    mode: "history",
});

router.beforeEach((to, from, next) => {
    // ***********身份校验***************
    var accessToken = window.localStorage.getItem("access_token");

    if (accessToken != null && accessToken != "") {
        if (
            Vue.prototype.$socket == null ||
            Vue.prototype.$socket.disconnected == true
        ) {
            let vueSocketIO = new VueSocketIO({
                debug: true,
                connection:
                    "http://budingcc.cn:32001?access_token=" + accessToken,
                options: {
                    autoConnect: true,
                    transports: ["websocket"],
                },
                vuex: {
                    actionPrefix: "SOCKET_",
                    mutationPrefix: "SOCKET_",
                },
            });
            Vue.use(vueSocketIO);
        }

        next();
    } else {
        if (
            accessToken == undefined ||
            accessToken == null ||
            accessToken == ""
        ) {
            loginApi
                .getAccessToken()
                .then((result) => {
                    if (result.success) {
                        window.localStorage.setItem(
                            "access_token",
                            result.token
                        );
                        next();
                    } else {
                        console.log("获取accessToken失败");
                        // 获取accessToken失败
                        window.location =
                            "http://oauth.budingcc.cn:40000/oauth/authorize?" +
                            "client_id=webBuding&" +
                            "redirect_uri=http://admin.budingcc.cn:40010/oauth/callback&" +
                            "response_type=code&" +
                            "state=" +
                            window.location.href;
                    }
                })
                .catch((error) => {
                    console.log("获取accessToken失败");
                    console.log(error);
                    // 获取accessToken失败
                    window.location =
                        "http://oauth.budingcc.cn:40000/oauth/authorize?" +
                        "client_id=webBuding&" +
                        "redirect_uri=http://admin.budingcc.cn:40010/oauth/callback&" +
                        "response_type=code&" +
                        "state=" +
                        window.location.href;
                });
        }
    }
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
axios.interceptors.request.use(
    (config) => {
        // 在发送请求向header添加jwt
        let token = localStorage.getItem("access_token");
        if (token) {
            config.headers["Authorization"] = "bearer " + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// 响应拦截
axios.interceptors.response.use((data) => {
    console.log(data);
    if (data && data.data) {
        if (
            data.data.code &&
            (data.data.code == "40001" || data.data.code == "30002")
        ) {
            loginApi
                .logout()
                .then((result) => {
                    if (result.success) {
                        window.location.href =
                            "http://oauth.budingcc.cn:40000/logout?redirect_uri=" +
                            window.location.href;
                    } else {
                        this.$message.error("注销失败");
                    }
                })
                .catch((err) => {
                    this.$message.error("注销失败");
                });
        } else if (data.data.code && data.data.code == "401") {
            window.location =
                "http://oauth.budingcc.cn:40000/oauth/authorize?" +
                "client_id=webBuding&" +
                "redirect_uri=http://admin.budingcc.cn:40010/oauth/callback&" +
                "response_type=code&" +
                "state=" +
                window.location.href;
        }
    }
    return data;
});

export default router;
