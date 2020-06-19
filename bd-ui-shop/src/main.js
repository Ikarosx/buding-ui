import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import vuetify from "./plugins/vuetify";
import router from "@/../config/router";
Vue.config.productionTip = false;

// 引入snackbar
import snackbar from "@/base/components/snackbar";
Vue.prototype.$snackbar = snackbar;
// 引入socketio
import VueSocketIO from "vue-socket.io";
let access_token = localStorage.getItem("access_token");
Vue.use(
  new VueSocketIO({
    debug: true,
    connection: "http://127.0.0.1:32001?access_token=" + access_token,
    options: {
      autoConnect: false,
    },
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_",
    },
  })
);

new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App),
}).$mount("#app");
