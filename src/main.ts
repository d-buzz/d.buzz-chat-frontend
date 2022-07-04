import { createApp } from "vue";
import App from "./App.vue";

import "./assets/styles/index.css";

const app = createApp(App);

// init/config libraries
Object.values(import.meta.globEager("./config/*.ts"))
  .sort((m, n) => (n.priority || 0) - (m.priority || 0))
  .map((i) => i.install?.({ app }));

app.mount("#app");
