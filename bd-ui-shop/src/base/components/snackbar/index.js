import Snackbar from "./Snackbar.vue";

import Vue from "vue";

// const v = new Vue({
//   render(createElement) {
//     return createElement(Snackbar);
//   }
// });

// v.$mount();
const snackBar =  Vue.extend(Snackbar);
const v = new snackBar();
v.$mount();

document.body.appendChild(v.$el);
console.log(v);
console.log(v.$el);
const snackbar = v.$children[0];
console.log(snackbar);
function info(mes) {
  snackbar.info(mes);
}

function error(mes) {
  snackbar.error(mes);
}

function warning(mes) {
  snackbar.warning(mes);
}

function success(mes) {
  snackbar.success(mes);
}
export default {
  info,
  success,
  warning,
  error
};
