<template>
    
  <div class="w-full h-full flex flex-col justify-end overflow-y-scroll">
    <Message v-for="message in displayableMessages" :message="message"/>
    <div class="flex mt-4">
      <input
        class="shadow appearance-none border rounded-full w-[calc(100%-4rem)] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grow"
        id="Message"
        v-model="messageText"
        @keyup.enter="enterMessage(messageText)"
        type="text"
        placeholder="Message"
      />
      <!--<button class="right-0 x-16 bg-primary text-white font-bold py-2 px-4 rounded-full">Send</button>-->
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
const displayableMessages = ref([]);
var communityData = null;
async function initChat() {
    var user = accountStore.account.name;
    if(user == null) return; //TODO ask to login
    var user2 = route.params.user;
    if(user2 == null || user2 == "") return;
    communityData = await stlib.Utils.getCommunityData(user2);

    if(route.name === 'CommunityPath') {
        var conversation = user2+'/'+route.params.path;
        const manager = getManager();
        manager.setUser(user);
        manager.setConversation(conversation);
        var data = await manager.getSelectedConversations();
        displayableMessages.value = data.messages;

        console.log("Messages are ");
        console.log(data.messages);
    }
    else {
        displayableMessages.value = messageStore.messages;
    }

    //messageStore.loadUserMessages(user);
}
initChat();

const enterMessage = async (message) => {
    var user = accountStore.account.name;
    var user2 = route.params.user;

    if(user == null) return; //TODO ask to login
    if(user2 == null || user2 == "") return;

    const manager = getManager();
    var client = manager.client;
    var textMsg = stlib.Content.text(message);

    var conversation = null;
    if(route.name === 'CommunityPath') {
        conversation = user2+'/'+route.params.path;
    }
    else {
        conversation = [user, user2];
        textMsg = await text.encodeWithKeychain(user, conversation, "Posting"); 
    }

    var signableMessage = textMsg.forUser(user, conversation);
    await signableMessage.signWithKeychain('Posting');
    
    var result = await client.write(signableMessage);
    console.log(result);
};

/*app.router.beforeEach(async (to, from, next) => {
    await initChat();
    next();
});*/
</script>
