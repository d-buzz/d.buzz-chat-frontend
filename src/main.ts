import { createApp } from "vue";
import App from "./App.vue";

import 'vue-simple-context-menu/dist/vue-simple-context-menu.css';
import './assets/styles/open-iconic.css';
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
document.addEventListener('visibilitychange', async function (event) {
    var manager = getManager();
    if (document.hidden) {
        manager.pauseAutoDecode = true;
    } else {
        manager.pauseAutoDecode = false;
        var prefs = await manager.getPreferences();
        if(prefs !== null) {
            var isAutoDecode = prefs.getValueBoolean("autoDecode", false);
            if(isAutoDecode) await manager.decodeSelectedConversations();
        }
    }
});

const app = createApp(App);
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
});
window.app = app;
// init/config libraries
Object.values(import.meta.globEager("./config/*.ts"))
  .sort((m, n) => (n.priority || 0) - (m.priority || 0))
  .map((i) => i.install?.({ app }));

app.mount("#app");
