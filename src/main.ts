import { createApp } from "vue";
import App from "./App.vue";

import "./assets/styles/index.css";

const STING_NODES = import.meta.env.VITE_APP_STING_NODES ? import.meta.env.VITE_APP_STING_NODES.split(",") : ["http://localhost:3001"];

var currentManager = null;
window.getManager = function () {
  if (currentManager == null) {
    currentManager = new stlib.MessageManager();
    currentManager.onmessage = function (json) {
      console.log(json);
    };
    currentManager.setNodes(STING_NODES);
  }
  return currentManager;
};

const app = createApp(App);
window.app = app;
// init/config libraries
Object.values(import.meta.globEager("./config/*.ts"))
  .sort((m, n) => (n.priority || 0) - (m.priority || 0))
  .map((i) => i.install?.({ app }));

app.mount("#app");
