<template>
<div class="flex">
    <div class="grow">
        <div class="flex gap-x-2">
            <div v-for="category in categories" class="cursor-pointer" 
                v-on:click.prevent="scrollIntoView($refs[category[0]])" :title="category[0]">
                {{category[1]}}
            </div>
        </div>
        <div style="overflow: auto; max-height:350px;">
            <div v-for="community in communityList" class="py-1" ref="items">
                <small class="text-gray-700"><b>{{community.title}}</b></small>
                <div class="flex flex-wrap gap-x-2">
                    <div v-for="link, name in community.data.emotes" class="cursor-pointer" @click="action(link)"
                        @mouseenter="tooltip($event.target, name)">
                        <img :src="`https://images.hive.blog/20x0/${link}`" width="20">
                    </div>
                </div>
            </div>
            <div v-for="category in categories">
                <small :ref="category[0]" class="text-gray-700"><b>{{category[0]}}</b></small>
                <div v-for="(subgroup, name2) in emotes[category[0]]">
                    <div class="flex flex-wrap gap-x-2">
                        <div v-for="emote in subgroup" class="cursor-pointer" @mouseenter="tooltip($event.target, emote[1])" @click="action(emote[0])">
                            {{emote[0]}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="scrollBox" style="margin-right: -15px;">
        <div class="flex flex-col scrollBoxContent" style="overflow: auto; max-height:375px;">
            <div v-for="community, i in communityList" class="p-1">
                <UserIcon class="cursor-pointer" :name="community.name" @mouseenter="tooltip($event.target, community.title)" @click="items[i].scrollIntoView()"></UserIcon>
            </div>
        </div>
    </div>
</div>
</template>
<script setup>
const items = ref();
const tooltip = ref(window.tooltip);
const emit = defineEmits(["oninput"]);
const communityList = ref([]);
async function init() {
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
function action(emote) {
    emit("oninput", emote);
}
function scrollIntoView(ref) {
    if(ref && ref.length > 0) ref[0].scrollIntoView();
}
const categories = ref(defaultEmotes.categories);
const emotes = ref(defaultEmotes.all);
</script> 
