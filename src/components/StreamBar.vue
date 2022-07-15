<template>
  <div class="h-screen m-0 flex flex-col bg-primary text-secondary shadow-lg overflow-y-scroll border-r-1 pr-1 pl-1 w-200">
    
    <b class="border-b-1">{{title}}</b>

    <div v-if="$route.name == 'Community'">
        <Stream v-for="stream in streams" 
            :conversation="stream.getPath()==null?'':stream.getPath().toString()"
            :name="stream.getName()"/>
    </div>
    <div v-if="$route.name != 'Community'">
        <Conversation v-for="conversation in messageStore.conversations" :conversation="conversation" :username="username"/>
    </div>
  </div>
</template>
<script setup>
import { useAccountStore } from "../stores/account";
import { useMessageStore } from "../stores/messages";
import { useRoute } from "vue-router";
import { ref } from 'vue'
const route = useRoute();
const accountStore = useAccountStore();
const messageStore = useMessageStore();
const username = accountStore.account.name;
const streams = ref([]);
const title = ref("Direct Messages");
async function initConversations() {
    console.log("load community " + route.name);
    if(username == null) return;
    if(route.name === 'Community') {
        var user2 = route.params.user;
        if(user2 == null || user2 == "") return;
        var community = await stlib.Community.load(user2);

        console.log("community data ");
        console.log(community.getStreams());

        title.value = community.getTitle();
        streams.value = community.getStreams();
        
        //var streams = temp0.getStreams;
    }
    else messageStore.loadConversations(username);
}
initConversations();
</script>
