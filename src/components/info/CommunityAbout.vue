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
        <div v-for="team in community.communityData.team">
            <small class="ml-10"><b>{{team[1]}} {{team[2]}}</b></small>
            <Conversation :username="team[0]"/> 
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
</script>
