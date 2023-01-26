<template>
    <small class="float-right text-gray-700">{{$t("Home.Theme.Msg.Info")}}</small>
    <div class="mt-2"></div>
    <div v-for="(style, name) in themeObject.defaultThemes">
        <ThemeView :name="name" :style="style" :edit="false" @update="updateThemes"></ThemeView>
    </div>
    <div v-for="(style, name) in themeObject.userThemes">
        <ThemeView :name="name" :style="style" :edit="true" @update="updateThemes"></ThemeView>
    </div>         
</template>
<script setup>
import { useAccountStore } from "../../stores/account";
const accountStore = useAccountStore();
const router = useRouter();
const searchBar = ref("");
const updateThemesKey = ref('#'+stlib.Utils.nextId());
const updateMessage = ref("");
const themeObject = ref(defaultTheme);

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

/*var defaultCommunities = [];
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
initCommunities();*/
</script>

