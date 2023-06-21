<template>
<div class="flex mb-1">
    <input type="text" v-model="filter" @input="applyFilter" class="inputText" placeholder="search">
    <button v-if="filter" @mouseenter="tooltip($event.target, $t('EmotePicker.Reset'))"  class="btn1 ml-1 fg70" @click="resetFilter">
        <small class="oi oi-x"></small>
    </button>
</div>
<div class="flex">
    <div class="grow">
        <div class="flex flex-wrap gap-1">
            <div class="cursor-pointer apphg2 px-1 rounded" 
                v-on:click.prevent="scrollBox.scrollTop = 0" @mouseenter="tooltip($event.target, 'Common & Recently Used')">
                &#x1F44D;
            </div>
            <div v-for="category in categories" class="cursor-pointer apphg2 px-1 rounded" 
                v-on:click.prevent="scrollIntoView($refs[category[0]])" @mouseenter="tooltip($event.target, category[0])">
                {{category[1]}}
            </div>
        </div>
        <hr/>
        <div ref="scrollBox" style="overflow: auto; max-height:350px;">
            <div :ref="category0">
                <div v-if="filter === ''">
                    <small class="text-gray-700"><b>Common</b></small>
                    <div>
                        <div class="flex flex-wrap gap-x-2">
                            <div v-for="emote in common" class="cursor-pointer" @mouseenter="tooltip($event.target, emote[1])" @click="action(emote[0], emote[1])">
                                <Emote :emote="emote[0]"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div v-if="filter === ''">
                    <small class="text-gray-700"><b>Recently Used</b></small>
                    <div>
                        <div class="flex flex-wrap gap-x-2">
                            <div v-for="emote in recentlyUsed" class="cursor-pointer" @mouseenter="tooltip($event.target, emote[1])" @click="action(emote[0], emote[1])">
                                <Emote :emote="emote[0]"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-for="community in communityList" class="py-1" ref="items">
                <small class="text-gray-700"><b>{{community.title}}</b></small>
                <div class="flex flex-wrap gap-x-2">
                    <div v-for="link, name in community.emotes" class="cursor-pointer" @click="action(link, name)"
                        @mouseenter="tooltip($event.target, name)">
                        <Emote :emote="link"/>
                    </div>
                </div>
            </div>
            <div v-for="category in categories" :ref="category[0]">
                <div v-if="emotes[category[0]]">
                    <small class="text-gray-700"><b>{{category[0]}}</b></small>
                    <div v-for="(subgroup, name2) in emotes[category[0]]">
                        <div class="flex flex-wrap gap-x-2">
                            <div v-for="emote in subgroup" class="cursor-pointer" @mouseenter="tooltip($event.target, emote[1])" @click="action(emote[0], emote[1])">
                                <Emote :emote="emote[0]"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="scrollBox" style="margin-right: -15px;">
        <div class="flex flex-col scrollBoxContent" style="overflow: auto; max-height:375px;">
            <div v-for="community, i in communityList0" class="p-1">
                <UserIcon class="cursor-pointer" :name="community.name" @mouseenter="tooltip($event.target, community.title)" @click="scrollIntoView0(items[i])"></UserIcon>
            </div>
        </div>
    </div>
</div>
</template>
<script setup>
const filter = ref("");
const scrollBox = ref();
const category0 = ref();
const items = ref();
const tooltip = ref(window.tooltip);
const emit = defineEmits(["oninput"]);
const communityList = ref([]);
const communityList0 = ref([]);
const recentlyUsed = ref([]);
var defaultCommunityList = [];

function addRecentlyUsed(emote) {
    var emotes = recentlyUsed.value;
    var i = 0;
    for(var item of emotes) {
        if(item[0] === emote[0]) {
            emotes.splice(i, 1);
            emotes.unshift(emote);
            return;
        }
        i++;
    }
    emotes.unshift(emote);
    if(emotes.length > 25) emotes.pop();
} 
function loadRecentlyUsedEmotes() {
    try {
        var recentlyUsed = window.localStorage.getItem("EmotePicker#recentlyUsed");
        if(recentlyUsed != null && Array.isArray(recentlyUsed=JSON.parse(recentlyUsed)))
            return recentlyUsed;
    }
    catch(e) { console.log(e); }
    return [];
}
function storeRecentlyUsed() {
    try {
        window.localStorage.setItem("EmotePicker#recentlyUsed", JSON.stringify(recentlyUsed.value));
    }
    catch(e) { console.log(e); }
}
async function init() {
    recentlyUsed.value = loadRecentlyUsedEmotes();
    const manager = getManager();
    var communities = await manager.getCommunitiesSorted();
    var result = [];
    for(var community of communities) {
        var name = community[0];
        var title = community[1];
        var data = await stlib.Community.load(name);
        if(Object.keys(data.emotes).length > 0)
            result.push({name, title, emotes:data.emotes});
    }
    defaultCommunityList = result;
    communityList.value = result;
    communityList0.value = result;
}
init();
function action(emote, name) {
    addRecentlyUsed([emote, name]);
    storeRecentlyUsed(emote);
    emit("oninput", emote);
}
function filterFn(array, text) {
    for(var i = 1; i < array.length; i++) {
        var item = array[i];
        if(item.indexOf(text) !== -1) return true;
    }
    return false;
}
function applyFilter() {
    var text = filter.value.trim();
    if(text.length === 0) { 
        emotes.value = defaultEmotes.all;
        communityList.value = defaultCommunityList;
        return;
    }
    var data = defaultEmotes.all;    
    var obj = {};
    for(var name in data) {
        var data2 = data[name];
        for(var name2 in data2) {
            var data3 = data2[name2];
            var obj3 = [];
            for(var emote of data3)
                if(filterFn(emote, text)) 
                    obj3.push(emote);
            if(obj3.length > 0) {
                if(obj[name] === undefined) obj[name] = {};
                obj[name][name2] = obj3;
            }
        }
    }
    emotes.value = obj;
    var list = [];
    for(var item of defaultCommunityList) {
        var emoteObj = {};
        for(var emote in item.emotes)
            if(emote.indexOf(text) !== -1) 
                emoteObj[emote] = item.emotes[emote];
        if(Object.keys(emoteObj).length > 0) list.push({name: item.name, title: item.title, emotes:emoteObj});
    }
    communityList.value = list;
}
function resetFilter() {
    filter.value = '';
    applyFilter();
}
function scrollIntoView0(ref) {
    var box = scrollBox.value;
    if(box && ref) box.scrollTop = ref.offsetTop-ref.parentNode.offsetTop;
}
function scrollIntoView(ref) {
    if(ref && ref.length > 0) scrollIntoView0(ref[0])
}
const categories = ref(defaultEmotes.categories);
const emotes = ref(defaultEmotes.all);
const common = ref(defaultEmotes.common);
</script> 
