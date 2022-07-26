<template>
  <div class="w-full h-full flex flex-col overflow-y-scroll" v-if='community'>
    <div class="flex border-b-1 font-bold">About</div>
    <div>{{community.getAbout()}}</div>
    <div class="flex border-b-1 font-bold">Description</div>
    <div>{{community.getDescription()}}</div>
    <div class="flex border-b-1 font-bold">Rules</div>
    <div>{{community.getRules()}}</div>
    <div class="flex border-b-1 font-bold">Team</div>
    <div v-for="team in community.communityData.team">
        <small class="ml-10"><b>{{team[1]}} {{team[2]}}</b></small>
        <Conversation :username="team[0]"/> 
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
}
initInfo();
</script>
