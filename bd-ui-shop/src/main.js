import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "@/../config/router"
Vue.config.productionTip = false;

// 引入snackbar
import snackbar from "@/base/components/snackbar";
Vue.prototype.$snackbar = snackbar;
// 引入socketio
import VueSocketIO from "vue-socket.io";
// Vue.use(
//   new VueSocketIO({
//     debug: true,
//     connection: "http://budingcc.cn:32001" //
//   })
// );



new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
