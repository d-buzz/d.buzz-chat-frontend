import { createApp } from "vue";
import App from "./App.vue";
import { Theme, defaultTheme, applyTheme } from "./Theme.ts";
import { defaultEmotes } from "./Emotes.ts";

import 'vue-simple-context-menu/dist/vue-simple-context-menu.css';
import './assets/styles/centuryschoolbookl.css';
//import './assets/styles/vue3-emoji-picker.css'
import './assets/styles/open-iconic.css';
import "./assets/styles/index.css";
//import * as dhive from "@hiveio/dhive";

const NETWORK_NAME = import.meta.env.VITE_APP_NETWORK_NAME?import.meta.env.VITE_APP_NETWORK_NAME:null;
const STING_NODES = import.meta.env.VITE_APP_STING_NODES ? import.meta.env.VITE_APP_STING_NODES.split(",") : ["http://localhost:3001"];

window.globalProperties = {
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
    "prependCommunities": [],
    "defaultTheme": "Light",
    "--appCommunityIconFontSize": "20px",
    "--appCommunityIconSize": "52px"

    /*"sidebar": 2,
    "prependCommunities": ["hive-163399"]*/
};
window.tmpProperties = {};
//window.dhive = dhive;
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
                for(var name in properties)
                    window.globalProperties[name] = properties[name];
                if(window.refreshApp) window.refreshApp();
                if(properties['defaultTheme'] != null && window.localStorage.getItem("theme") == null)
                    applyTheme(properties['defaultTheme']);
                var root = root = document.querySelector(':root');
                for(var name in properties)
                    if(name.startsWith("--")) 
                        root.style.setProperty(name, properties[name]);
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
    try {
        const isIframe = window.top !== window.self;
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
    window.defaultEmotes = defaultEmotes;
    
    //TODO refactor tooltip, menu
    window.onclickoutside = new stlib.EventQueue();
    document.getElementById("app").addEventListener("click", ()=>{ window.onclickoutside.post(); }); 
    window.tooltip = function(element, text, ms=5000) {
        var el = document.getElementById("tooltip");  
        if(el == null) return;
        el.innerText = text; 
        var pos = element.getBoundingClientRect();
        
        el.hidden = false;
        el.currentElement = element;
        var x = Math.min(0.5*(pos.left+pos.right), window.innerWidth-el.offsetWidth-10); 
        var y = Math.max(0, Math.min(pos.bottom, window.innerHeight-el.offsetHeight)); 

        el.setAttribute('style','left:'+x+'px;'+'top:'+y+'px;');

        var listener = null;
        listener = ()=>{
            element.removeEventListener("mouseleave", listener);
            el.hidden = true;
        };
        element.addEventListener("mouseleave", listener);
        setTimeout(()=>{
            if(el.currentElement == element) {
                listener();
            }
        }, ms);
    };
    window.menu = function(element, items, name=null, dropdown=false) {
        var el = document.getElementById("menu");  
        if(el == null) return;
        if(!el.hidden && el.currentElement === element) {
            el.hidden = true;
            return;
        }
        el.innerHTML = ""; 
        if(name) {
            var div = document.createElement("div");
            div.setAttribute("class", "font-bold border-b-1");
            div.innerText = name;
            el.appendChild(div);
        }
        for(let item of items) {
            var div = document.createElement("div");
            if(item.length > 2 && item[2]) {
                var icon = document.createElement("span");
                icon.setAttribute("class", "oi "+item[2]);
                div.appendChild(icon);
                
            } 
            var text = document.createElement("span");
            text.innerText = item[0];
            div.appendChild(text);
            div.addEventListener("click", ()=>{
                try {
                    item[1]();
                }
                catch(e) { console.log(e); }
                el.hidden = true;
            });
            el.appendChild(div);
        }
        var pos = element.getBoundingClientRect();
        el.currentElement = element;
        el.hidden = false;
        var x = Math.min(dropdown?pos.left:(pos.left+20), window.innerWidth-el.offsetWidth-10); 
        var y = dropdown?pos.bottom:0.5*(pos.top+pos.bottom); 
        y = Math.max(0, Math.min(y, window.innerHeight-el.offsetHeight)); 
        el.setAttribute('style','left:'+x+'px;'+'top:'+y+'px;');
    };
    window.onclickoutside.set("main.ts", ()=>{ 
        var el = document.getElementById("menu");  
        if(el == null || el.hidden) return;
        el.hidden = true;
    });
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


