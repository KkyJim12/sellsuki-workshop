import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import Product from "./components/Product.vue";
import Calculate from "./components/Calculate.vue";
import lsWatcher from "vue-storage-watcher"

Vue.config.productionTip = false;
Vue.component("products", Product);
Vue.component("calculate", Calculate);
Vue.use(lsWatcher, { prefix: "" })

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

