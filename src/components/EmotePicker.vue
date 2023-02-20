<template>
<div class="flex">
    <div class="grow">
        <div class="flex gap-x-2">
            <div class="cursor-pointer" 
                v-on:click.prevent="scrollBox.scrollTop = 0" title="Common">
                &#x1F44D;
            </div>
            <div v-for="category in categories" class="cursor-pointer" 
                v-on:click.prevent="scrollIntoView($refs[category[0]])" :title="category[0]">
                {{category[1]}}
            </div>
        </div>
        <hr/>
        <div ref="scrollBox" style="overflow: auto; max-height:350px;">
            <div :ref="category0">
                <small class="text-gray-700"><b>Common</b></small>
                <div>
                    <div class="flex flex-wrap gap-x-2">
                        <div v-for="emote in common" class="cursor-pointer" @mouseenter="tooltip($event.target, emote[1])" @click="action(emote[0], emote[1])">
                            <Emote :emote="emote[0]"/>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <small class="text-gray-700"><b>Recently Used</b></small>
                <div>
                    <div class="flex flex-wrap gap-x-2">
                        <div v-for="emote in recentlyUsed" class="cursor-pointer" @mouseenter="tooltip($event.target, emote[1])" @click="action(emote[0], emote[1])">
                            <Emote :emote="emote[0]"/>
                        </div>
                    </div>
                </div>
            </div>
            <div v-for="community in communityList" class="py-1" ref="items">
                <small class="text-gray-700"><b>{{community.title}}</b></small>
                <div class="flex flex-wrap gap-x-2">
                    <div v-for="link, name in community.data.emotes" class="cursor-pointer" @click="action(link, name)"
                        @mouseenter="tooltip($event.target, name)">
                        <Emote :emote="link"/>
                    </div>
                </div>
            </div>
            <div v-for="category in categories" :ref="category[0]">
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
    <div class="scrollBox" style="margin-right: -15px;">
        <div class="flex flex-col scrollBoxContent" style="overflow: auto; max-height:375px;">
            <div v-for="community, i in communityList" class="p-1">
                <UserIcon class="cursor-pointer" :name="community.name" @mouseenter="tooltip($event.target, community.title)" @click="scrollIntoView0(items[i])"></UserIcon>
            </div>
        </div>
    </div>
</div>
</template>
<script setup>
const scrollBox = ref();
const category0 = ref();
const items = ref();
const tooltip = ref(window.tooltip);
const emit = defineEmits(["oninput"]);
const communityList = ref([]);
const recentlyUsed = ref([]);

function addRecentlyUsed(emote) {
    console.log("add emote", emote);
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
            result.push({name, title, data});
    }
    communityList.value = result;
}
init();
function action(emote, name) {
    addRecentlyUsed([emote, name]);
    storeRecentlyUsed(emote);
    emit("oninput", emote);
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
