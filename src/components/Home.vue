<template>
    <div class="appbg2 appfg2 w-full h-full break-all overflow-scroll" v-if="accountStore.account.name">
<!--HomeHeaderA-->
        <div v-if="!showDetailedProfile()" class="flex pt-3 pl-3 pr-3">
            <div class="grow" style="margin-top:-7px;">
                <div class="flex gap-x-1"><b class="text-lg sm:text-2xl">@{{accountStore.account.name}}</b>
                <span class="oi oi-info infocircle" 
                    @mouseenter="tooltip($event.target, `${$t('Home.Reputation')}: ${reputation}\n${$t('Home.CreatedDate')}: ${created}`)"></span>
                </div>
            </div>
            <div style="margin-top:-7px;">
                <button class="btn" @click="logout()" @mouseenter="tooltip($event.target, $t('Home.Logout'))">
                    <span class="block sm:hidden"><span class="oi oi-flip-horizontal oi-account-logout"></span></span>
                    <span class="hidden sm:block">{{$t("Home.Logout")}}</span>
                </button>
            </div>
        </div>
<!--HomeHeaderB-->
        <div v-else class="flex p-3 coverImage" :style="[coverImage?`background-image:url(${coverImage});`:'', '']">
            <div class="flex-shrink-0 mr-5px">
                <UserIcon :name="accountStore.account.name" imgCss="av128" size="medium"/>
            </div>
            <div class="grow" style="margin-top:-7px;">
                <div><b class="text-lg text-gray-700 textBg">@{{accountStore.account.name}}</b></div>
                <span>
                    <small class="text-gray-700 mr-1 textBg" 
                        style="align-self: center; padding: 1px 2px; " @mouseenter="tooltip($event.target, $t('Home.Reputation'))">{{reputation}}
                        <span class="oi oi-badge" style="opacity:0.5;"></span></small> 
                    <small class="text-gray-700 textBg" style="align-self: center;" @mouseenter="tooltip($event.target, $t('Home.CreatedDate'))">
                        {{created}}<span class="oi oi-calendar" style="margin-left:1px; opacity:0.5;"></span></small> 
                </span>
            </div>
            <div style="margin-top:-7px;">
                <button class="btn px-3 sm:px-4" @click="logout()" @mouseenter="tooltip($event.target, $t('Home.Logout'))">
                    <span class="block sm:hidden"><span class="oi oi-flip-horizontal oi-account-logout"></span></span>
                    <span class="hidden sm:block">{{$t("Home.Logout")}}</span>
                </button>
            </div>
        </div>
<!--HomeHeader End-->
        <div class="ml-3 mt-2 mr-3">
            <TabGroup>
                <TabList class="tab">
                  <Tab v-if="tabCommunities">Home</Tab>
                  <Tab v-if="tabMentions">{{$t("Home.Mentions")}}</Tab>
                  <Tab v-if="tabPreferences">{{$t("Home.Preferences")}}</Tab>
                  <!-- <Tab v-if="tabThemes">{{$t("Home.Themes")}}</Tab>
                  <Tab v-if="tabFonts">{{$t("Home.Fonts")}}</Tab> -->
                </TabList>
            <TabPanels class="mt-1">
                <TabPanel v-if="tabCommunities">
                    <div class="flex border-t-1 border-b-1 rounded px-3" style="height:233px;">
                        <Mentions/>
                    </div>
                    <!--<div class="text-sm font-bold text-right md:text-center text-gray-400 mt-1">joined</div>-->
                    <div class="flex flex-row flex-wrap mt-3" :key="updateKey">
                       <CommunityIcon v-for="community in communities" :img="community[0]" :name="community[1]" :number="''" />
                    </div>
                    
                    <div class="display-block flex mt-3 mr-auto ml-auto" style="max-width:350px;">
                        <input class="inputText1 mr-1" type="text" v-model="searchBar"
                            placeholder="find communities"
                            @keyup.enter="findCommunities(searchBar)"/>
                        <button @mouseenter="tooltip($event.target, $t('Home.FindCommunities'))" class="btn1 mr-1" @click="findCommunities(searchBar)">
                            <span class="oi oi-magnifying-glass"></span>
                        </button>
                        <button v-if="searchBar" @mouseenter="tooltip($event.target, $t('Home.Reset'))"  class="btn1 mr-1" @click="findReset()">
                            <span class="oi oi-x"></span>
                        </button>
                    </div>
                    <TabGroup>
                        <TabList class="tab">
                            <Tab>{{$t("Home.Active")}}</Tab>
                            <Tab>{{$t("Home.All")}}</Tab>
                        </TabList>
                        <TabPanels class="mt-1">
                            <TabPanel>
                                <div v-if="communitiesActive.length > 0">
                                    <div class="w-100 text-sm font-bold text-right md:text-center text-gray-400 mt-1">activity measured by messages in last 7 days</div>
                                    <div class="flex flex-row flex-wrap" :key="updateKey+'#2'">
                                     <CommunityIcon v-for="community in communitiesActive" :img="community.name" :name="community.title" :number="''+community.number"  />
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div v-if="communitiesFound.length > 0">
                                    <div class="w-100 text-sm font-bold text-right md:text-center text-gray-400 mt-1">found</div>
                                    <div class="flex flex-row flex-wrap" :key="updateKey+'#3'">
                                     <CommunityIcon v-for="community in communitiesFound" :fade="!isActive(community.name, communitiesActive)" :img="community.name" :name="community.title" :number2="''+community.subscribers"  />
                                        <div v-if="hasNextPage" class="btn cursor-pointer mt-3" @click="findCommunities(searchBar, true)">
                                           next<br>page
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                </TabPanel>
                <TabPanel v-if="tabMentions">
                    <Mentions/>
                </TabPanel>
                <TabPanel v-if="tabPreferences">
                    <Preferences/>
                </TabPanel>
                <TabPanel v-if="tabThemes" :key="updateThemesKey">
                    <Themes/>
                </TabPanel>
                <TabPanel v-if="tabFonts" :key="updateThemesKey">
                    <Fonts/>
                </TabPanel>
            </TabPanels>
            </TabGroup>
        </div> 
        <div style="height:72px;"></div> 
    </div>
</template>
<script setup>
import { useAccountStore } from "../stores/account";
const tooltip = ref(window.tooltip);
const tabCommunities = ref(globalProperties.homeTabCommunities);
const tabMentions = ref(globalProperties.homeTabMentions);
const tabPreferences = ref(globalProperties.homeTabPreferences);
const tabThemes = ref(globalProperties.homeTabThemes);
const tabFonts = ref(globalProperties.homeTabFonts);
const accountStore = useAccountStore();
const router = useRouter();
const homeheader = ref(0);
const created = ref(null);
const reputation = ref(null);
const communities = ref([]);
const communitiesFound = ref([]);
const communitiesActive = ref([]);
const hasNextPage = ref(false);
const preferences = ref([]);
const searchBar = ref("");
const updateKey = ref('#'+stlib.Utils.nextId());
const updateThemesKey = ref('#'+stlib.Utils.nextId());
const updateMessage = ref("");
const themeObject = ref(defaultTheme);
const coverImage = ref(null);
var defaultActiveCommunities = [];

const defaultPreferences = [
    {name: "directMessage:s", display: "Direct Message", desc: "Permission to message directly is granted to:",
     value: '', newvalue:'', options:[
        ['everyone', 'Everyone'],['accounts', 'Hive users'],
        ['communities','Communities in common'], ['friends', 'Friends']]},
    {name: "showOnline:b", display: "Online Status", desc: "Show online status.", value: true, newvalue:true},
    {name: "autoDecode:b", display: "Auto Decode", desc: "Automatically decode private messages.", value: false, newvalue:false},
    {name: "flipMessageBox:b", display: "Flip Message Box", desc: "Flip message box on y-axis.", value: false, newvalue:false},
    {name: "showDetailedProfile:b", display: "Show Detailed Profile", desc: "Show user profile image and data.", value: false, newvalue:false}
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

function updateThemes() { updateThemesKey.value = '#'+stlib.Utils.nextId(); } 

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
function isActive(name, communities) {
    if(!communities) return true;
    for(var community of communities) { if(community.name == name) return true; }
    return false;
}
function showDetailedProfile() {
    var prefs = preferences.value;
    if(prefs)
        for(var pref of prefs) {
            if(pref.name === "showDetailedProfile:b") return pref.newvalue;
        }
    return false;
}
var defaultCommunities = [];
async function initCommunities() {
    var user = accountStore.account.name;
    if(user == null) return;
    var manager = getManager();
    communities.value = await manager.getCommunitiesSorted(user);
    var prefs = await manager.getPreferences();
    var values = prefs.getValues();
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
    //var showDetailedProfile = prefs.getValueBoolean("showDetailedProfile", false);
    //homeheader.value = showDetailedProfile?1:0;
    preferences.value = array;
    await findCommunities();
    defaultCommunities = communitiesFound.value;
    updateKey.value = '#'+stlib.Utils.nextId(); 
}
initCommunities();
async function initActiveCommunities() {
    var result = await getManager().getClient().readStats();
    if(result.isSuccess()) {
        var obj = {};
        var dailyStatsArrays = result.getResult()[0];
        for(var day of dailyStatsArrays) {
            for(var community in day) {
                var messageCount = day[community];
                if(obj[community] === undefined) obj[community] = messageCount;
                else obj[community] += messageCount;
            }
        }
        var sorted = [];
        for(var community in obj) {
            sorted.push({name:community,title:"",number:obj[community]});
        }
        sorted.sort((a,b)=>b.number-a.number);
        defaultActiveCommunities = sorted;
        communitiesActive.value = defaultActiveCommunities;
        updateKey.value = '#'+stlib.Utils.nextId(); 
        nextTick(async ()=>{
            for(var item of sorted) {
                try { 
                    var community0 = await stlib.Community.load(item.name);
                    item.title = community0.getTitle();
                }
                catch(e) { console.log(e); }
            }
            updateKey.value = '#'+stlib.Utils.nextId();
        });
    }
}
initActiveCommunities();
function formatDate(date) {
    var t = date.indexOf('T');
    if(t !== -1) date = date.substring(0, t);
    return date;
}
async function initUserData() {
    var user = accountStore.account.name;
    if(!user) return; 
    var data = await stlib.Utils.getAccountData(user);
    if(data) { 
        created.value = formatDate(data.created);
        reputation.value = stlib.Utils.reputation(data.reputation); 
        var postingJsonStr = data.posting_json_metadata;
        try { 
            if(postingJsonStr != null && postingJsonStr != "") {
                var postingJson = JSON.parse(postingJsonStr);
                if(postingJson.profile) {
                    var profile = postingJson.profile;
                    if(profile.cover_image) {
                        var cover = profile.cover_image;
                        if(!cover.startsWith("https://images.hive.blog")) cover = "https://images.hive.blog/768x0/"+cover;
                        coverImage.value = cover;
                    }
                }
            }        
        } catch(e) { console.log(e); }
    }
}
initUserData();
async function updatePreferences() {
    var user = accountStore.account.name;
    if(user == null) return;
    var manager = getManager();
    var prefs = await manager.getPreferences();
    for(var item of preferences.value) {
        item.value = item.newvalue;
        prefs.setValue(item.name, item.value);
    }
    var result;
    if(prefs.getValue("showOnline:b", false) === true) result = await manager.setupOnlineStatus(true);
    else result = await manager.updatePreferences(prefs);
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
    var map = {};
    for(var community of communitiesFound.value) 
        map[community.name] = true;
    if(text) {
        var active = [];
        for(var community of defaultActiveCommunities) {
            if(map[community.name]) active.push(community);
        }
        communitiesActive.value = active;
    }
    else communitiesActive.value = defaultActiveCommunities;
    updateKey.value = '#'+stlib.Utils.nextId(); 
}
function findReset() {
    communitiesActive.value = defaultActiveCommunities;
    communitiesFound.value = defaultCommunities;
    searchBar.value = "";
    hasNextPage.value = true;
    updateKey.value = '#'+stlib.Utils.nextId(); 
}
function logout() {
  accountStore.signOut();
  router.push("/");
}
//will be used when click on user's own profile to logout, change settings, etc
</script>
<style scoped>
.infocircle {
    border-radius: 50px;
    background-color: var(--appbgbtn1);
    width: 20px;
    height: 20px;
    display: inline-block;
    font-size: 16px;
    vertical-align: text-top;
    padding-left: 5px;
    color: var(--appfgbtn1);
    padding-top: 2px;
    position: relative;
    top: 0;
}
.coverImage {
    background-size: cover;
}
.textBg {
    @apply px-1 rounded-full;
    background-color: var(--appbg2);
}
</style>

