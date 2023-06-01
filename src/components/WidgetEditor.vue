<template>
<div class="appbg2 appfg2" style="height:100%;">
  <section>
    <nav class="navbar navbar-expand-lg shadow-md py-2 appbg0 relative flex items-center w-full justify-between">
      <div class="px-6 w-full flex flex-wrap items-center justify-between">
        <div class="flex items-center">
          <a class="navbar-brand" href="/">
            <span class="oi oi-menu"></span>
          </a>
        </div>
        <div class="grow items-center" id="navbarSupportedContentY">
          <ul class="navbar-nav mr-auto flex flex-row">
            <li class="nav-item">
              <a class="nav-link block pr-2 px-2 py-2 text-gray-600 hover:text-gray-700 focus:text-gray-700 transition duration-150 ease-in-out" href="/" data-mdb-ripple="true" data-mdb-ripple-color="light"><span class="appfg1">Home</span></a>
            </li>
          </ul>
        </div>
        <div class="flex items-center lg:ml-auto">
          <span class="inline-block px-6 py-2 mr-2 bg-green-600 text-white font-medium text-xs leading-snug uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out" data-mdb-ripple="true" data-mdb-ripple-color="light"
             role="button" @click="toggleWidget()">
                <span class="oi oi-envelope-open"></span> Open Widget
          </span>
        </div>
      </div>
    </nav>

    <div class="appbg2 appfg2 px-5 pt-5 pb-2 md:px-12 text-left">
      <h1 class="font-bold text-3xl pb-1">Widget Editor.</h1>
        <p>Customize the options and scroll down to see how to embed the widget into a website.</p>
        
        <div class="flex flex-row gap-x-5">
            <div>
                <div class="mt-3 mb-3">
                    Width: <input type="text" class="inputText inline" v-model="width" @change="onResize">
                    Height: <input type="text" class="inputText inline" v-model="height" @change="onResize">
                    <br>
                    Resizable: <input type="checkbox" v-model="resizable" class="mr-1" @change="onModeChange">
                    Resize Corner: <select v-model="resizeCorner" class="inputSelect1" @change="onModeChange">
                        <option value="lb">Left-bottom</option>
                        <option value="rb">Right-bottom</option>
                    </select>
                </div>
                <div>
                    <div><b>Embed Mode</b></div>

                    <select v-model="mode" class="inputSelect1" @change="onModeChange">
                        <option value="embed">Embed</option>
                        <option value="overlay">Overlay</option>
                    </select>

                    <div class="flex flex-row gap-x-5 mt-3">
                        <div class="cursor-pointer border-default p-3 flex flex-row gap-x-1" :class="{'highlight':mode==='embed'}" style="width:150px;height:150px;" @click="setMode('embed')">
                            <div style="width:50px;font-size:7px;">
                                <div v-for="i in 7">
                                    <hr> page text
                                </div>
                            </div>                                                         
                            <div class="border-default appbg2 text-center" style="width:70px;height:90px;opacity:0.7;"> widget</div>
                        </div>
                        <div class="cursor-pointer border-default p-3 relative" :class="{'highlight':mode==='overlay'}" style="width:150px;height:150px;" @click="setMode('overlay')">
                            <div style="font-size:7px;">
                                <div v-for="i in 7">
                                    <hr> page text
                                </div>
                            </div>                                                         
                            <div class="absolute border-default appbg2 text-center" 
                                style="top:10px;right:20px;width:70px;height:90px;opacity:0.7;"> widget</div>
                        </div>
                    </div>
                </div>
                <div>
                    <div><b>Start Page</b></div>
                    <div><small>The page to show on load.</small></div>
                    <div><input type="text" class="inputText" v-model="startPage" @change="onChange"></div>
                </div>
                <div class="flex flex-row mt-1" v-for="item in preferences" :key="updateKey+'#3'">
                    <div v-if="item.options">
                        <div>
                            <div><b>{{item.display}}</b></div>
                            <div><small>{{item.desc}}</small></div>
                        </div>
                        <div>
                            <select v-model="item.newvalue" class="inputSelect1" @change="onChange">
                                <option v-for="option in item.options" :value="option[0]">{{option[1]}}</option>
                            </select>
                        </div>
                    </div>
                    <div v-else-if="Array.isArray(item.value) || typeof item.value === 'string'">
                        <div>
                            <div><b>{{item.display}}</b></div>
                            <div><small>{{item.desc}}</small></div>
                        </div>
                        <div>
                            <textarea class="inputText" type="text" rows="1" v-model="item.newvalue" @change="onChange"></textarea>
                        </div>
                    </div>
                    <div v-else>
                        <div>
                            <div><b>{{item.display}}</b></div>
                            <div><input type="checkbox" v-model="item.newvalue" @change="onChange"> <small>{{item.desc}}</small></div>
                        </div>
                    </div>
                </div>
                <div class="mt-3" style="max-width: 753px;">
                    <small class="inner-block float-right text-right text-gray-700">{{$t("Home.Theme.Font.Info")}}</small>
                    <div class="text-xl font-bold">Fonts</div>
                    <hr/>
                    <FontView name="Default Font" ref="appFont" @update="onChange"/>
                    <hr/>
                    <FontView name="Message Font" ref="appMessageFont" @update="onChange"/>
                </div>
            </div>
            <div> 
               <div ref="widget" hidden></div>
            </div>
        </div>

        <hr class="my-3" />
        <h2 class="font-bold text-2xl pb-1">Add widget to website:</h2>
        <b>Step 1. stwidget.js lib</b>
        <p>Download and host (preferred) or add script: https://chat.peakd.com/stwidget.js</p>
        <b>Step 2. code: </b>
        <p>Customize the widget options and copy the setup script. Add the element to your dom.</p>
        <div style="margin-bottom:250px;">
            <textarea style="font-family: monospace;" class="inputText" rows="15" cols="80" type="text" v-model="widgetcode"></textarea>
            <button class="btn" @click="copyToClipboard($event.target, widgetcode)"><span class="oi oi-clipboard"></span> Copy</button>        
        </div>
    </div>
    
     
  </section>
</div>
</template>
<script setup>
import { nextTick } from 'vue';
import { useRoute } from "vue-router";
const route = useRoute();
const widget = ref();
const widgetcode = ref("");
const appFont = ref();
const appMessageFont = ref();
const preferences = ref([]);
const updateKey = ref('#'+stlib.Utils.nextId());
const width = ref("450");
const height = ref("556");
const mode = ref("overlay");
const overlay = ref(true);
const resizable = ref(true);
const resizeCorner = ref("lb");
const startPage = ref('/t/hive-163399/0');

const defaultPreferences = [
    {name: "requireLogin", display: "Require Login:", desc: "If true, start on login page, otherwise show specified chat.", value: false, newvalue: false},
    {name: "showSidebar", display: "Show sidebar:", desc: "If true, shows left sidebar.", value: true, newvalue: true},
    {name: "sidebar", display: "Left sidebar style", desc: "",
     value: 2, newvalue:2, options:[
        [0, 'Communities only (0)'],[2, 'Dual: Direct Messages & Communities (2)']]}, 
    {name: "sidebar2enableSharedView", display: "Sidebar (2):", desc: "Enable to open Direct Messages, communities be open at same time", value: false, newvalue:false},
    {name: "sidebarToggleByChannelNameOnDirectGroup", display: "Sidebar Toggle By:", desc: "Open sidebar by clicking on channel name of direct message/group message.", value: false, newvalue:false},    
    {name: "streambarExpand", display: "Streambar show on expanding.", desc: "Show the second sidebar if there is space.", value: true, newvalue:true},    
    {name: "streambarMode", display: "Streambar mode", desc: "",
     value: 1, newvalue:1, options:[
        [0, 'Allow non-chats anywhere (0)'],[1, 'Chat on top, other items on bottom (1)'], [2, 'Only chats, folders visible. (2)']]}, 
    {name: "sidebarAddButton", display: "Sidebar: add button type", desc: "",
     value: 1, newvalue:1, options:[
        [0, "'+' icon next to 'Direct', 'C/' [Sidebar (2)] (0)"],[1, "'+' bubble as first scrollable item (1)"], [2, "'+' bubble as last scrollable item (2)"]]}, 
    {name: "communityChannelNameFormat", display: "Community channel name format.", desc: "Eg.: 'C/<title>/<name> (<account>)'.", value: '<name>', newvalue:'C/<title>/<name>'},
    {name: "--appCommunityIconFontSize", display: "Community Icon Font Size.", desc: "eg.: 20px", value: '18px', newvalue:'18px'},
    {name: "--appCommunityIconSize", display: "Community Icon Size.", desc: "eg.: 52px", value: '42px', newvalue:'42px'},    
    {name: "homeTabCommunities", display: "HomeTab: Communities", desc: "", value: false, newvalue:false},
    {name: "homeTabPreferences", display: "HomeTab: Preferences", desc: "", value: true, newvalue:true},
    {name: "homeTabThemes", display: "HomeTab: Themes", desc: "", value: true, newvalue:true}, 
    {name: "onlyPrependCommunities", display: "Only prepended communities", desc: "Show only communities specified in prependCommunties field.", value: false, newvalue:false},       
    {name: "prependCommunities", display: "Prepend Communities", desc: "", value: ["hive-163399"], newvalue:"hive-163399"},
    {name: "defaultTheme", display: "Default Theme.", desc: "Eg.: Light, Ignite, Dark, or exported JSON string.", value: 'Light', newvalue:'Light'},
];

var currentProperties = {};
var stwidget = null;

/*
window.globalProperties = {
    "sidebar": 0,
    "homeTabCommunities": true,
    "homeTabPreferences": true,
    "homeTabSettings": true,
    "prependCommunities": []

    "sidebar": 2,
    "prependCommunities": ["hive-163399"]
};
*/
function updateCode() {
    var obj = {};
    var items = preferences.value;
    for(var item of items) {
        var v = item.newvalue;
        if(Array.isArray(item.value)) v = v.trim().split(/[ ,]+/);
        obj[item.name] = v;
    }
    try {
        if(obj['defaultTheme'].trim().startsWith("{")) 
            obj['defaultTheme'] = JSON.parse(obj['defaultTheme'].trim());
    }
    catch(e) { console.log(e); }
    if(appFont.value) { 
        obj["--appFontFamily"] = `'${appFont.value.fontFamily}'`;
        obj["--appFontSize"] = appFont.value.fontSize+'px';
    }
    if(appMessageFont.value) {
        obj["--appMessageFontFamily"] = `'${appMessageFont.value.fontFamily}'`;
        obj["--appMessageFontSize"] = appMessageFont.value.fontSize+'px';
    }
    var code = 
`
var stwidget = new StWidget('https://chat.peakd.com${startPage.value.trim()}'); 
stwidget.properties = ${JSON.stringify(obj, null, 4)};
var element = stwidget.createElement('${width.value.trim()+'px'}', '${height.value.trim()+'px'}', ${overlay.value}, ${resizable.value});
`;
    if(resizable.value) {
        if(resizeCorner.value === 'lb') {
           code += 
`stwidget.setStyle({ direction: 'rtl' });
`;
        }
    }
code += `
//optionally add style/positioning
//stwidget.setStyle({ direction: 'rtl', top: '51px', right: '32px' });
//Add the element to webpage
//e.appendChild(element);
`
    widgetcode.value = code;
}
function onModeChange() {
    overlay.value = mode.value === "overlay";
    updateCode();
    initWidget();
}
function setMode(value) {
    mode.value = value;
    onModeChange();
}
function onChange() {
    console.log("onChange");
    var obj = {};
    var items = preferences.value;
    for(var item of items) {
        var v = item.newvalue;
        if(Array.isArray(item.value)) v = v.trim().split(/[ ,]+/);
        obj[item.name] = v;
    }
    try {
        if(obj['defaultTheme'].trim().startsWith("{")) 
            obj['defaultTheme'] = JSON.parse(obj['defaultTheme'].trim());
    }
    catch(e) { console.log(e); }
    if(appFont.value) { 
        obj["--appFontFamily"] = `'${appFont.value.fontFamily}'`;
        obj["--appFontSize"] = appFont.value.fontSize+'px';
    }
    if(appMessageFont.value) {
        obj["--appMessageFontFamily"] = `'${appMessageFont.value.fontFamily}'`;
        obj["--appMessageFontSize"] = appMessageFont.value.fontSize+'px';
    }
    console.log(obj);
    currentProperties = obj;
    if(stwidget) stwidget.setProperties(obj);
    updateCode();
}
function onResize() {
    if(stwidget) stwidget.resize(width.value.trim()+'px', height.value.trim()+'px');
    updateCode();
}
function initPropertyEditor() {
    var query = route.query;
    for(var pref of defaultPreferences) {
        var value = query[pref.name];
        if(value != null) {
            if(typeof pref.value === 'string') {
                pref.value = pref.newvalue = value;
            }
            else if(typeof pref.value === 'boolean') {
                pref.value = pref.newvalue = value === 'true';
            }
        }
    }

    var values = {};
    var array = [];
    for(var pref of defaultPreferences) {
        try {
            var name = pref.name;
            var value = values[name];
            if(value != null) array.push({name, display:pref.display, desc:pref.desc, value, newvalue:value, options:pref.options});
            else array.push(pref);
        }
        catch(e) {
            console.log(e);
        }
    }
    preferences.value = array;
    onChange();
    updateKey.value = '#'+stlib.Utils.nextId(); 
}
initPropertyEditor();

var script = document.createElement("script");
script.setAttribute("src", "/stwidget.js");
script.setAttribute("type", 'text/javascript');
document.head.appendChild(script); 

function initWidget() {
    stwidget = new StWidget(startPage.value);
    stwidget.properties = currentProperties;
    /*stwidget.properties = {
        "sidebar": 2,
        "homeTabCommunities": false,
        "prependCommunities": ["hive-163399"]
    };*/
    //stwidget.setUser("username");
    var element = stwidget.createElement(width.value.trim()+'px', height.value.trim()+'px', overlay.value, resizable.value);
    var obj = { };
    if(resizable.value) {
        if(resizeCorner.value === 'lb') {
            obj.direction = 'rtl';
        }
    }
    if(overlay.value) {
        obj.top = '51px';
        obj.right = '32px';
    }
    stwidget.setStyle(obj);

    var e = widget.value;
    e.innerHTML = "";
    e.appendChild(element);

    window.stwidget = stwidget; //for debugging
}
var init = true;
function toggleWidget() {
    if(init) {
        init = false;
        initWidget();
    }
    var e = widget.value;
    if(e) {
        e.hidden = !e.hidden;
    }
}
function copyToClipboard(target, text) {
    if(navigator.clipboard) {
        navigator.clipboard.writeText(text);
        window.tooltip(target, "Copied to clipboard!");
    }
}
</script>
<style scoped>
.highlight { border-color: var(--appbgbtn1); border-width: 5px; }
</style>

