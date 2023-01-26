<template>
<div>
  <section>
    <nav class="navbar navbar-expand-lg shadow-md py-2 bg-white relative flex items-center w-full justify-between">
      <div class="px-6 w-full flex flex-wrap items-center justify-between">
        <div class="flex items-center">
          <a class="navbar-brand text-green-700" href="#!">
            <span class="oi oi-chat"></span>
          </a>
        </div>
        <div class="grow items-center" id="navbarSupportedContentY">
          <ul class="navbar-nav mr-auto flex flex-row">
            <li class="nav-item">
              <a class="nav-link block pr-2 px-2 py-2 text-gray-600 hover:text-gray-700 focus:text-gray-700 transition duration-150 ease-in-out" href="#" data-mdb-ripple="true" data-mdb-ripple-color="light">Home</a>
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

    <div class="px-5 pt-5 pb-2 md:px-12 bg-gray-50 text-gray-800 text-left">
      <h1 class="font-bold text-3xl pb-1">Widget test page.</h1>
        <div>
            <div class="flex flex-row" v-for="item in preferences" :key="updateKey+'#3'">
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
                        <textarea class="inputText" type="text" v-model="item.newvalue" @change="onChange"></textarea>
                    </div>
                </div>
                <div v-else>
                    <div>
                        <div><b>{{item.display}}</b></div>
                        <div><small>{{item.desc}}</small></div>
                    </div>
                    <div>
                        <input type="checkbox" v-model="item.newvalue" @change="onChange">
                    </div>
                </div>
            </div>
        </div>
    </div>

     
  </section>
</div>
    
    


    <div ref="widget" hidden></div>
</template>
<script setup>
import { nextTick } from 'vue';
const widget = ref();
const preferences = ref([]);
const updateKey = ref('#'+stlib.Utils.nextId());

const defaultPreferences = [
    {name: "sidebar", display: "Left sidebar style", desc: "",
     value: 2, newvalue:2, options:[
        [0, 'Communities only (0)'],[2, 'Dual: Direct Messages & Communities (2)']]}, 
    {name: "sidebar2enableSharedView", display: "Sidebar (2):", desc: "Enable to open Direct Messages, communities be open at same time", value: true, newvalue:true},
    {name: "sidebarAddButton", display: "Sidebar: add button type", desc: "",
     value: 1, newvalue:1, options:[
        [0, "'+' icon next to 'Direct', 'C/' [Sidebar (2)] (0)"],[1, "'+' bubble as first scrollable item (1)"], [2, "'+' bubble as last scrollable item (2)"]]}, 
    {name: "communityChannelNameFormat", display: "Community channel name format.", desc: "Eg.: 'C/<title>/<name> (<account>)'.", value: '<name>', newvalue:'C/<title>/<name>'},
    {name: "homeTabCommunities", display: "HomeTab: Communities", desc: "", value: false, newvalue:false},
    {name: "homeTabPreferences", display: "HomeTab: Preferences", desc: "", value: true, newvalue:true},
    {name: "homeTabThemes", display: "HomeTab: Themes", desc: "", value: true, newvalue:true}, 
    {name: "prependCommunities", display: "Prepend Communities", desc: "", value: ["hive-163399"], newvalue:"hive-163399"}
    /*{name: "autoDecode:b", display: "Auto Decode", desc: "Automatically decode private messages.", value: false, newvalue:false},
    {name: "flipMessageBox:b", display: "Flip Message Box", desc: "Flip message box on y-axis.", value: false, newvalue:false},
    {name: "showDetailedProfile:b", display: "Show Detailed Profile", desc: "Show user profile image and data.", value: false, newvalue:false}
    */
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
function onChange() {
    var obj = {};
    var items = preferences.value;
    for(var item of items) {
        var v = item.newvalue;
        if(Array.isArray(item.value)) v = v.trim().split(/[ ,]+/);
        obj[item.name] = v;
    }
    console.log(obj);
    currentProperties = obj;
    if(stwidget) stwidget.setProperties(obj);
}

function initPropertyEditor() {
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
    stwidget = new StWidget('/t/hive-163399/0');
    stwidget.properties = currentProperties;
    /*stwidget.properties = {
        "sidebar": 2,
        "homeTabCommunities": false,
        "prependCommunities": ["hive-163399"]
    };*/
    var element = stwidget.createElement()
    stwidget.setStyle({ top: '51px', right: '32px' });

    var e = widget.value;
    e.appendChild(element);
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
</script>
<style scoped>

</style>

