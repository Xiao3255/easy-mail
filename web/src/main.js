import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
import http from "./http";

Vue.config.productionTip = false;
Vue.prototype.$http = http;

Vue.mixin({
  computed: {
    uploadUrl() {
      return this.$http.defaults.baseURL + "uploadImg";
    },
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
