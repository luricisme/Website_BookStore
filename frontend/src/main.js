import { createApp } from 'vue'
import App from './App.vue'
import router from "./router/router"; // Import router

createApp(App)
  .use(router) // Kích hoạt Vue Router
  .mount("#app");