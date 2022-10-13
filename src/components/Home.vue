<template>
    <div class="appbg2 w-full h-full break-all overflow-scroll" v-if="accountStore.account.name">
        <div class="flex mt-3 mr-3">
            <div class="flex-shrink-0 mr-5px">
                <img
                class="rounded-full"
                :src="`https://images.hive.blog/u/${accountStore.account.name}/avatar/medium`"
                alt="@"
                />
            </div>
            <div class="grow" style="margin-top:-7px;">
                <div><b class="text-lg">{{accountStore.account.name}}</b></div>
            </div>
            <div style="margin-top:-7px;">
                <button class="btn" @click="logout()">logout</button>
            </div>
        </div>
        <div class="mt-2 mr-3">
            <TabGroup>
                <TabList class="tab">
                  <Tab>Communities</Tab>
                  <Tab>Preferences</Tab>
                  <Tab>Themes</Tab>
                </TabList>
            <TabPanels class="mt-1">
                <TabPanel>
                    <div class="text-sm font-bold text-center text-gray-400 mt-1">joined</div>
                    <div class="flex flex-row flex-wrap" :key="updateKey">
                       <CommunityIcon v-for="community in communities" :img="community[0]" :name="community[1]" :number="''" />
                    </div>

                    <div class="display-block flex mt-3 mr-auto ml-auto" style="max-width:350px;">
                        <input class="inputText1 mr-1" type="text" v-model="searchBar"
                            placeholder="find communties"
                            @keyup.enter="findCommunities(searchBar)"/>
                        <button title="find communities" class="btn1 mr-1" @click="findCommunities(searchBar)">
                            <span class="oi oi-magnifying-glass"></span>
                        </button>
                        <button v-if="searchBar" title="reset" class="btn1 mr-1" @click="findReset()">
                            <span class="oi oi-x"></span>
                        </button>
                    </div>
                    <div v-if="communitiesFound.length > 0">
                        <div class="w-100 text-sm font-bold text-center text-gray-400 mt-1">found</div>
                        <div v-if="communitiesFound.length > 0" class="flex flex-row flex-wrap" :key="updateKey+'#2'">
                         <CommunityIcon v-for="community in communitiesFound" :img="community.name" :name="community.title" :number="''+community.subscribers"  />
                            <div v-if="hasNextPage" class="btn" @click="findCommunities(searchBar, true)">
                               next<br>page
                            </div>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div class="mt-2"></div>
                    <div class="flex flex-row" v-for="item in preferences" :key="updateKey+'#3'">
                        <div>
                            <div><b>{{item.display}}</b></div>
                            <div><small>{{item.desc}}</small></div>
                        </div>
                        <div>
                            <input type="checkbox" v-model="item.newvalue">
                        </div>
                    </div>
                    <div><small>{{updateMessage}}</small></div>
                    <button class="btn" @click="updatePreferences">Update</button>
                    <button class="btn2" @click="resetChanges">Reset changes</button>
                     <!--<div class="mt-1">
                      <label for="username" class="block text-sm font-medium text-gray-700"> Account name/s (add 1-3 users): </label>
                      <div class="mt-1">
                        <input
                          id="username"
                          name="username"
                          v-model="accountName"
                          @keyup.enter="authenticate(accountName)"
                          type="username"
                          autocomplete="username"
                          class="inputText1"
                          placeholder="Account name"
                          :read-only="isLoading"
                          :disabled="isLoading"
                        />
                      </div>
                    </div>-->
                </TabPanel>
                <TabPanel>
                    <div class="mt-2"></div>
                    <div v-for="(style, name) in themeObjet.defaultThemes">
                        <ThemeView :name="name" :style="style"></ThemeView>
                    </div>
                    
                    <table class="mt-1">
                        <tr v-for="item in defaultColors" :key="updateKey+'#4'">
                            <td>
                                <div><b>{{item[1]}}</b></div>
                                <div><small>{{item[2]}}</small></div>
                            </td>
                            <td>
                                <div><input class="inputText" type="text" v-model="colors[item[0]]" size="7"></div>
                                <div><input class="w-full" type="color" v-model="colors[item[0]]"></div>
                            </td>
                        </tr>
                    </table>
                    <button class="btn" @click="setColors()">Update</button>
                    <button class="btn2" @click="loadColors()">Reset</button>
                </TabPanel>
            </TabPanels>
            </TabGroup>
        </div>  
    </div>
</template>
<script setup>
import { useAccountStore } from "../stores/account";
const accountStore = useAccountStore();
const router = useRouter();
const communities = ref([]);
const communitiesFound = ref([]);
const hasNextPage = ref(false);
const preferences = ref([]);
const searchBar = ref("");
const updateKey = ref("");
const updateMessage = ref("");
const themeObjet = ref(defaultTheme);

const defaultPreferences = [
    {name: "autoDecode:b", display: "Auto Decode", desc: "Automatically decode private messages.", value: false, newvalue:false}
];

const defaultColors = [
    ["bg0", "Background 0", "Sidebar Background"],
    ["bg1", "Background 1", "Left Bar Background"],
    ["bg2", "Background 2", "Main Background"],
    ["bg3", "Background 3", "Right Bar Background"],
    ["bgbtn1", "Button 1", "Default button"],
    ["bgbtn2", "Button 2", "Secondary button"],
];

const colors = ref({
    "bg0":"#555555",
    "bg1":"#555555",
    "bg2":"#ffffff",
    "bg3":"#555555",
    "bgbtn1":"#555555",
    "bgbtn2":"#aaaaaa"
});

function setColors() {
    var hasSelectionColor = {"bg0":true, "bg1":true};
    var root = document.querySelector(':root');
    var colorsValue = colors.value;
    for(var prop in colorsValue) {
        var color = colorsValue[prop];
        var rgb = parseRGB(color);
        var fg = rgb?calcFg(rgb):'black';
        root.style.setProperty('--app'+prop, color);
        root.style.setProperty('--appf'+prop.substring(1), fg);
        if(hasSelectionColor[prop]) 
            root.style.setProperty('--apps'+prop.substring(1), 
                fg==='white'?"rgba(255, 255, 255, 0.37)":"rgba(0, 0, 0, 0.37)");
    }
}
function loadColors() {
    var root = document.querySelector(':root');
    var style = getComputedStyle(root);
    var colorsValue = colors.value;
    for(var prop in colorsValue) {
        colorsValue[prop] = style.getPropertyValue('--app'+prop);
    }
}
function parseRGB(color) {
    if(color == null) return null;
    if(color.startsWith("#")) {
        var len = Math.floor((color.length-1)/3);
        if(len === 0) return null;
        return [parseInt(color.substr(1,len),16), 
                parseInt(color.substr(1+len,len),16),
                parseInt(color.substr(1+len+len,len),16)];
    }
    if(color.startsWith("rgb")) {
        var start = color.indexOf('(');      if(start === -1) return null;
        var end = color.indexOf(')', start); if(end === -1) return null;
        color.substring(start+1, end).split(/[ ,]+/);
    }
    return null;    
}
function calcFg(rgb) {
    var sum = ((rgb[0]*299) + (rgb[1] * 587) + (rgb[2] * 114)) * 0.001;
    return (sum > 128) ? 'black' : 'white';

}

var defaultCommunities = [];
async function initCommunities() {
    var user = accountStore.account.name;
    if(user == null) return;
    var manager = getManager();
    communities.value = await manager.getCommunities(user);
    var prefs = await manager.getPreferences();
    var values = prefs.getValues();
    var array = [];
    for(var pref of defaultPreferences) {
        try {
            var name = pref.name;
            var value = values[name];
            if(value != null) array.push({name, display:pref.display, desc:pref.desc, value, newvalue:value});
            else array.push(pref);
        }
        catch(e) {
            console.log(e);
        }
    }
    preferences.value = array;
    await findCommunities();
    defaultCommunities = communitiesFound.value;
    updateKey.value = '#'+stlib.Utils.nextId(); 
}
initCommunities();
async function updatePreferences() {
    var user = accountStore.account.name;
    if(user == null) return;
    var manager = getManager();
    var prefs = await manager.getPreferences();
    for(var item of preferences.value) {
        item.value = item.newvalue;
        prefs.setValue(item.name, item.value);
    }
    var result = await manager.updatePreferences(prefs);
    if(result.isSuccess()) updateMessage.value = "Succesfully updated settings.";
    else updateMessage.value = "Failed to update preferences. " + result.getError();
}
function resetChanges() {
    var user = accountStore.account.name;
    if(user == null) return;
    for(var item of preferences.value)
        item.newvalue = item.value;
    updateKey.value = '#'+stlib.Utils.nextId(); 
}
async function findCommunities(text, nextPage=false) {
    var query = {"limit":100,"sort":"subs"};
    if(text) query["query"] = text;
    if(nextPage && communitiesFound.value.length > 0)
        query.last = communitiesFound.value[communitiesFound.value.length-1].name;
    var result = await stlib.Utils.getDhiveClient()
        .call("bridge", "list_communities", query);
    hasNextPage.value = result.length >= query.limit;
    if(nextPage) communitiesFound.value.push.apply(communitiesFound.value, result);
    else communitiesFound.value = result;
}
function findReset() {
    communitiesFound.value = defaultCommunities;
    searchBar.value = "";
    hasNextPage.value = true;
}
function logout() {
  accountStore.signOut();
  router.push("/");
}
//will be used when click on user's own profile to logout, change settings, etc
</script>
