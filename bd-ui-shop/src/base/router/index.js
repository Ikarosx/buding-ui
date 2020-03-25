import Vue from "vue";
import Router from "vue-router";
import Layout from "@/layout";
Vue.use(Router);

// 定义路由配置
let routes = [];
let concat = router => {
  routes = routes.concat(router);
};
let mainRouter = {
  path: "/",
  name: "root",
  redirect: "/good/list"
};
let loginRouter = {
  path: "/login",
  name: "login",
  component: () => import("@/base/components/LoginForm")
};
concat(mainRouter);
concat(loginRouter);
import ShopRouter from "@/views/shop/router";
concat(ShopRouter);
import UserRouter from "@/views/user/router";
concat(UserRouter);
export default routes;
