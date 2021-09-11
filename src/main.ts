import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import Vue3TouchEvents from "vue3-touch-events"
import * as Hammer from 'hammerjs'

createApp(App)
  .use(store)
  .use(router)
  .use(Vue3TouchEvents)
//   .directive("pan", {
//     bind: function(el, binding) {
//       if (typeof binding.value === "function") {
//         const mc = new Hammer(el);
//         mc.get("pan").set({ direction: Hammer.DIRECTION_ALL });
//         mc.on("pan", binding.value);
//       }
//     }
//   })
  .mount("#app")

