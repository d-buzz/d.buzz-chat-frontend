<template>
    <NewUserMessageModal :show="newUserMessageModalOpen" @close="toggleNewUserMessageModalOpen(false)"></NewUserMessageModal>

  <div class="h-screen m-0 flex flex-col bg-primary text-secondary shadow-lg overflow-y-scroll border-r-1 pr-1 pl-1 w-200">
    
    <div v-if="isCommunity">
        <b class="border-b-1">{{title}}</b>
        <Stream v-for="stream in streams" :stream="stream"/>
    </div>
    <div v-else>
        <div>
            <b class="border-b-1">{{title}}</b>
            <button class="float-right px-1" @click="toggleNewUserMessageModalOpen">+</button>
        </div>
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
const isCommunity = ref(false);

let newUserMessageModalOpen = ref(false);
const toggleNewUserMessageModalOpen = () => {
  newUserMessageModalOpen.value = !newUserMessageModalOpen.value;
};

async function initConversations(route) {
    console.log(route);
    console.log("load community " + route.name);
    if(username == null || route.name == null) return;
    isCommunity.value = route.name.startsWith('Community');
    if(isCommunity.value) {
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
initConversations(route);
/*app.router.beforeEach(async (to, from, next) => {
    await initConversations(to);
    next();
});*/
</script>
