import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import vuetify from "./plugins/vuetify";
import router from "@/../config/router";
import { Button, Message } from "element-ui";


Message.install = function (Vue, options) {
    Vue.prototype.$message = Message;
};

Vue.use(Button);
Vue.use(Message);

Vue.config.productionTip = false;
// var timerOne = window.setInterval(() => {
//     var accessToken = window.localStorage.getItem("access_token");
//     console.log(333);
//     if (accessToken != null && accessToken != "") {
        
//         window.clearInterval(timerOne);
//         return;
//     }
// }, 1000);

new Vue({
    router,
    vuetify,
    store,
    render: (h) => h(App),
   
}).$mount("#app");
