<template>
    <TransitionRoot :show="newUserMessageModalOpen">
        <NewUserMessageModal @close="toggleNewUserMessageModalOpen(false)"></NewUserMessageModal>
    </TransitionRoot>

  <div class="h-screen m-0 flex flex-col bg-primary text-secondary shadow-lg overflow-y-scroll border-r-1 pr-1 pl-1 w-200">
    
    <div v-if="isCommunity">
        <div class="flex justify-between">
            <b class="border-b-1">C/{{title}}</b>
            <router-link :to="`/s/${route.params.user}`">
               <span class="oi oi-cog"></span>
            </router-link>
        </div>
        <Stream v-for="stream in streams" :stream="stream"/>
    </div>
    <div v-else>
        <div class="flex justify-between">
            <b class="border-b-1">{{title}}</b>
            <button class="text-sm" @click="toggleNewUserMessageModalOpen">
                <span class="oi oi-plus"></span>
            </button>
        </div>
        <Conversation v-for="group in groups" :conversation="group.conversation" :id="group.id" :username="group.username" :number="group.number"/>
        <Conversation v-for="conversation in  conversations" :conversation="conversation.conversation"
             :username="username" :number="conversation.number" />
    </div>
  </div>
</template>
<script setup>
import { useAccountStore } from "../stores/account";
import { useRoute } from "vue-router";
import { ref } from 'vue'
const route = useRoute();
const accountStore = useAccountStore();
const username = accountStore.account.name;
const streams = ref([]);
const conversations = ref([]);
const groups = ref({});
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
    else {
        const manager = getManager();
        var update = async() => {
            console.log("Callback message update StreamBar.vue");
            var conversationArray = await manager.readUserConversations();
            var conversationObjects = [];
            for(var conversation of conversationArray) 
                conversationObjects.push({conversation,number:manager.getLastReadNumber(conversation)});
            conversations.value = conversationObjects;
            //updateKey.value = username+'#'+stlib.Utils.utcTime();
        };
        await update();
        manager.setCallback("StreamBar.vue", update);

        var pref = await manager.getPreferences();
        var groupSetDuplicateCheck = {};
        var groupsArray = [];
        var privatePref = await manager.getPrivatePreferences();
        var joinedGroup = privatePref.keys();
        for(var conversation in joinedGroup) {
            if(groupSetDuplicateCheck[conversation]) continue;
            var slash = conversation.indexOf('/');
            if(!conversation.startsWith('#') || slash === -1) continue;
            var uname = conversation.substring(1, slash);
            var id = conversation.substring(slash+1);
            groupSetDuplicateCheck[conversation] = true;
            groupsArray.push({"conversation":conversation, "id":id,"username":uname});
        }
        for(var groupId in pref.getGroups()) {
            var conversation = '#'+username+'/'+groupId;
            if(groupSetDuplicateCheck[conversation]) continue;
            groupSetDuplicateCheck[conversation] = true;
            groupsArray.push({"conversation":conversation,"id":groupId,"username":username});
        }
        for(var conversation of groupsArray) {
            var lastRead = manager.getLastRead(conversation);
            conversation.number = lastRead == null?'0':'1';
        }
        groups.value = groupsArray;
    }
}
initConversations(route);
/*app.router.beforeEach(async (to, from, next) => {
    await initConversations(to);
    next();
});*/
</script>
