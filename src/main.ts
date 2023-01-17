import { createApp } from "vue";
import App from "./App.vue";
import { Theme, defaultTheme } from "./Theme.ts";
import { defaultEmotes } from "./Emotes.ts";

import 'vue-simple-context-menu/dist/vue-simple-context-menu.css';
import './assets/styles/vue3-emoji-picker.css'
import './assets/styles/open-iconic.css';
import "./assets/styles/index.css";

const NETWORK_NAME = import.meta.env.NETWORK_NAME?import.meta.env.NETWORK_NAME:null;
const STING_NODES = import.meta.env.VITE_APP_STING_NODES ? import.meta.env.VITE_APP_STING_NODES.split(",") : ["http://localhost:3001"];

(()=>{
    /*if(window.hive_keychain === undefined && window.parent != null && 
        window.parent.hive_keychain !== undefined) {
        window.hive_keychain = window.parent.hive_keychain;
    }*/
    if(window.hive_keychain === undefined && window.parent != null && window.parent.postMessage) {
        var proxy = { id: 0, callbacks: {}, methods: {
            setUser: function (username) {
                
            },
            setProperties: function(properties) {
                console.log("setting properties ", properties);
            }
        } };
        window.addEventListener("message", (event) => {
            try {
                if(event.data != null && Array.isArray(event.data)) {
                    var data = event.data;
                    if(data.length === 3 && data[0] === 'stlib') {
                        if(typeof data[1] === 'string') {
                            var method = proxy.methods[data[1]];
                            if(method != null) method(JSON.parse(data[2]));
                        }
                        else {
                            var callback = proxy.callbacks[data[1]];
                            if(callback != null) {
                                delete proxy.callbacks[data[1]];
                                callback(JSON.parse(data[2]));
                            }
                        }
                    }
                }
            }
            catch(e) { console.log(e, event); }
        });
        window.hive_keychain = new Proxy({}, {
            get(target, prop, receiver) {
                return function () {
                    var msgId = proxy.id++; 
                    var data = ["stlib", msgId, prop];
                    var args = [];
                    for(var i = 0; i < arguments.length-1; i++)
                        args.push(arguments[i]);
                    data.push(args);
                    proxy.callbacks[msgId] = arguments[arguments.length-1];
                    return window.parent.postMessage(data, "*");
                };
            }
        });
        window.parent.postMessage(["stlib", -1, "initialize"], "*");
    }
     
    var currentManager = null;
    window.getManager = function () {
      if (currentManager == null) {
        currentManager = new stlib.MessageManager();
        currentManager.setNodes(STING_NODES);
      }
      return currentManager;
    };
    var idFn = stlib.Utils.nextId;
    stlib.Utils.nextId = ()=>{
        var id = idFn();
        console.log("id", id);
        //console.trace();
        return id;
    };
    window.defaultTheme = defaultTheme;
    defaultTheme.loadTheme();
    console.log("Theme", Theme);
    window.defaultEmotes = defaultEmotes;
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
})();
async function initMain() {
    if(NETWORK_NAME == null) {
        try {
            const manager = getManager();
            var result = await manager.getClient().readInfo();
            if(result.isSuccess()) 
                stlib.Utils.setNetworkname(result.getResult().name);
        }
        catch(e) {
            console.log(e);
        }
    }
    else stlib.Utils.setNetworkname(NETWORK_NAME);

    const app = createApp(App);
    //app.config.globalProperties.$testvar = 'testvar';
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
}
initMain();


