<template>
  <div class="w-full h-full flex flex-col overflow-y-scroll pr-3" v-if='community'>
    <div class="flex font-bold">About</div>
    <div>{{community.getAbout()}}</div>
    <hr>
    <div class="flex font-bold">Description</div>
    <div>{{community.getDescription()}}</div>
    <hr>
    <div class="flex font-bold">Rules</div>
    <div>{{community.getRules()}}</div>
    <hr>
    <div class="flex font-bold">Team and Moderators</div>
    <div class="flex flex-wrap justify-between">
        <div v-for="team in community.communityData.team" class="p-1 flex">
            <div class="flex-shrink-0 mr-5px">
                <UserCommunityIcon :name="team[0]" :community="community.getName()" :imgCss="`avConversation`"/>
            </div>
            <div class="grow relative" style="margin-top:-7px;">
                <small :class="roleCss(role)"><b>{{team[0]}}</b></small>
                <div class="flex" v-if="team[2]"><small v-for="title in team[2].split(',')" class="titlebg">{{title}}</small></div>
            </div>
        </div>
    </div>
 </div>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, nextTick } from 'vue';

const route = useRoute();
const community = ref(null);

async function initInfo() {
    var user2 = route.params.user;
    if(user2 == null || user2 == "") return;

    community.value = await stlib.Community.load(user2);

    const manager = getManager();
    manager.setConversation(null);
    manager.setSelectedCommunityPage(user2, route.path);
}
initInfo();
function roleCss(role) {
    var icon = {"owner":"oi-home", "admin":"oi-cog", "mod":"oi-flag"};
    if(role === "owner" || role === "admin" || role === "mod")
        return `oiMini oi ${icon[role]} color${role}`;
    return '';
}
</script>
