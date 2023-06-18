import { createApp } from "vue";
import App from "./App.vue";
import { Theme, defaultTheme, applyTheme } from "./Theme.ts";
import { initTooltipMenu } from "./TooltipMenu.ts";
import { defaultEmotes } from "./Emotes.ts";
import { imageProxy } from "./ImageProxy.ts";

import 'vue-simple-context-menu/dist/vue-simple-context-menu.css';
import './assets/styles/open-iconic.css';
import './assets/styles/centuryschoolbookl.css';
import './assets/styles/lato.css';
import './assets/styles/roboto.css';
//import './assets/styles/vue3-emoji-picker.css'
import "./assets/styles/index.css";
//import * as dhive from "@hiveio/dhive";

const NETWORK_NAME = import.meta.env.VITE_APP_NETWORK_NAME?import.meta.env.VITE_APP_NETWORK_NAME:null;
const STING_NODES = import.meta.env.VITE_APP_STING_NODES ? import.meta.env.VITE_APP_STING_NODES.split(",") : ["http://localhost:3001"];
const UPLOADER_DOMAIN = import.meta.env.VITE_APP_UPLOADER_DOMAIN?import.meta.env.VITE_APP_UPLOADER_DOMAIN:"https://chat-api.peakd.com";

window.globalProperties = {
    "showSidebar": true,
    "sidebar": 0,
    "sidebar2enableSharedView": false,
    "sidebarAddButton": 1,
    "sidebarToggleByChannelNameOnDirectGroup": true,
    "streambarExpand": true,
    "streambarMode": 1,
    "communityChannelNameFormat": "<name>",
    "homeTabCommunities": true,
    "homeTabMentions": false,
    "homeTabPreferences": true,
    "homeTabThemes": true,
    "homeTabFonts": true,
    "requireLogin": true,
    "prependCommunities": [],
    "defaultTheme": "Light",
    "messageIconFlexClass": "block text-justify lg:text-left sm:flex",
    "messageIconClass": "iconFloat",
    "onlyPrependCommunities": false,
    "--appCommunityIconFontSize": "20px",
    "--appCommunityIconSize": "52px"
    /*"sidebar": 2,
    "prependCommunities": ["hive-163399"]*/
};
window.tmpProperties = {};
window.imageProxy = imageProxy;
stuploader.Uploader.uploaderDomain = UPLOADER_DOMAIN;
function applyCssOverrides(properties) {
    var root = root = document.querySelector(':root');
    for(var name in properties)
        if(name.startsWith("--")) 
            root.style.setProperty(name, properties[name]);
}
window.sendNotificationsUpdate = (obj)=>{};
const isEmbed = new URLSearchParams(location.search).has("embed");
var inited = false;
//window.dhive = dhive;
(()=>{
    if(isEmbed) defaultTheme.setCssOverridePropertyName(new URLSearchParams(location.search).get("embed"));
    /*if(window.hive_keychain === undefined && window.parent != null && 
        window.parent.hive_keychain !== undefined) {
        window.hive_keychain = window.parent.hive_keychain;
    }*/
    if((isEmbed || window.hive_keychain === undefined) && window.parent != null && window.parent.postMessage) {
        var proxy = { id: 0, callbacks: {}, methods: {
            setUser: function (username) {
                console.log("set user: ", username);
                //if(window.setLogin) { 
                    //window.setLogin(username);
                    //getManager().setUser(username);
                    //window.refreshApp();                    
                //    window.location.reload();
                //}
                //else {
                    if(getManager().user === username) return;
                    window.localStorage.setItem("_user", JSON.stringify({name:username,authenticated:true}));
                    if(window.localStorage.getItem("_user") == null) {
                        console.log("warning: localStorage not present");                    
                    }
                    /*if(inited) {
                        console.log("reload");
                        window.location.reload();     
                    }*/
                //}
            },
            reload: function() {
                console.log("reload: ");
                window.location.reload();     
            },
            initMain: function() {
                initMain();
            },
            navigate: function(url) {
                if(window.navigate) window.navigate(url); 
            },
            pause: function (paused) {
                console.log("widget pause ", paused);
                getManager().pause(paused);
            },
            setProperties: function(properties) {
                console.log("setting properties ", properties);
                for(var name in properties)
                    window.globalProperties[name] = properties[name];
                if(window.refreshApp) window.refreshApp();
                if(properties['defaultTheme'] != null && window.localStorage.getItem("theme") == null)
                    applyTheme(properties['defaultTheme']);
                applyCssOverrides(properties);
                applyCssOverrides(defaultTheme.loadCssOverrides());
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
        window.sendNotificationsUpdate = (obj)=>{
            window.parent.postMessage(["stlib", -1, "notifications", obj], "*");
        };
        window.parent.postMessage(["stlib", -1, "initialize"], "*");
    }
    try {
        const isIframe = isEmbed || window.top !== window.self;
        if(!isIframe) {
            //A/B UI testing
            var apptype = window.localStorage.getItem("apptype");
            console.log("apptype", apptype);
            if(apptype === 'b') {
                var B = {
                "sidebar": 2,
                "sidebar2enableSharedView": false,
                "sidebarToggleByChannelNameOnDirectGroup": false,
                "streambarExpand": true,
                "streambarMode": 1,
                "sidebarAddButton": 1,
                "communityChannelNameFormat": "C/<title>/<name>",
                "--appCommunityIconFontSize": "18px",
                "--appCommunityIconSize": "42px",
                "homeTabCommunities": false,
                "homeTabPreferences": true,
                "homeTabThemes": true,
                "homeTabFonts": true,
                "prependCommunities": [
                    "hive-163399"
                ],
                "defaultTheme": "Light"
                };
                for(var prop in B) window.globalProperties[prop] = B[prop];
            }
        }
     }
    catch(e) {console.log(e);}
    /*var idFn = stlib.Utils.nextId;
    stlib.Utils.nextId = ()=>{
        var id = idFn();
        console.log("id", id);
        //console.trace();
        return id;
    };*/
    window.defaultTheme = defaultTheme;
    defaultTheme.loadTheme(window.globalProperties.defaultTheme);
    console.log("Theme", Theme);
    applyCssOverrides(defaultTheme.loadCssOverrides());
    window.defaultEmotes = defaultEmotes;
    
    initTooltipMenu();
    var currentManager = null;
    window.getManager = function () {
      if (currentManager == null) {
        currentManager = new stlib.MessageManager();
        currentManager.setNodes(STING_NODES);
      }
      return currentManager;
    };
})();
async function initMain() {
    if(inited) return;
    inited = true;
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
if(!isEmbed) initMain();


