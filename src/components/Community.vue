<template>
  <div class="w-full h-full flex flex-col justify-end" v-if='messageKey'>
    <div class="flex border-b-1 font-bold">{{streamName}}</div>
    <div id="messages" :key="messageKey" class="flex flex-col overflow-y-scroll">
        <Message v-for="message in displayableMessages" :message="message" />
    </div>
    <div class="flex mt-4 mb-2">
      <input
        class="shadow appearance-none border border-gray-700 rounded-full w-[calc(100%-4rem)] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grow"
        id="Message"
        v-model="messageText"
        @keyup.enter="enterMessage(messageText)"
        type="text"
        placeholder="Message"
      />
   </div>
 </div>
</template>
<script setup lang="ts">
import { useAccountStore } from "../stores/account";
import { useRoute } from "vue-router";
import { ref, nextTick } from 'vue';

const route = useRoute();
const accountStore = useAccountStore();
const displayableMessages = ref([]);
const messageKey = ref("");
const streamName = ref("");

async function initChat() {
    var user = accountStore.account.name;
    if(user == null) return; //TODO ask to login
    var user2 = route.params.user;
    if(user2 == null || user2 == "") return;

    const manager = getManager();
    manager.setUser(user);

    var conversation = null;
    if(route.name === 'CommunityPath') {
        conversation = user2+'/'+route.params.path;
        var community = await stlib.Community.load(user2);
        var stream = (community)?community.findTextStreamById(''+route.params.path):null;
        streamName.value = stream?stream.getName():conversation;
    }
    else if(route.name.startsWith('PrivateChat')) {
        var users = [user, user2];
        if(route.params.user2) {
            users.push(route.params.user2);
            if(route.params.user3) users.push(route.params.user3);
        }
        users.sort();
        conversation = users.join('|');
        streamName.value = conversation;
    }
    
    if(conversation != null) {
        manager.setConversation(conversation);
       
        var updateMessages = async () => {
            var container = document.getElementById("messages");
            var scrollToBottom = true;
            var scrollTop = 0;
            if(container) { 
                scrollToBottom = isAtScrollBottom(container); 
                scrollTop = container.scrollTop;
            }
            var data = await manager.getSelectedConversations();
            data.messages.sort((a,b)=>a.getTimestamp()-b.getTimestamp());
            displayableMessages.value = data.messages;
            messageKey.value = conversation+"#"+data.messages.length;
            nextTick(() => {
                var container = document.getElementById("messages");
                if(container) container.scrollTop = scrollToBottom?
                              container.scrollHeight:scrollTop;
            });
        };
        await updateMessages();
       
        manager.onmessage = updateMessages;
    }
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
        if(route.params.user2) {
            conversation.push(route.params.user2);
            if(route.params.user3) conversation.push(route.params.user3);
        }
        textMsg = await textMsg.encodeWithKeychain(user, conversation, "Posting"); 
    }

    var signableMessage = textMsg.forUser(user, conversation);
    await signableMessage.signWithKeychain('Posting');
    
    var result = await client.write(signableMessage);
    if(result.isSuccess()) {
        document.getElementById("Message").value = "";
    }
    else { 
        console.log(result);
    }
};
function isAtScrollBottom(e) {
    return e.scrollTop + e.clientHeight >= e.scrollHeight;
}
/*app.router.beforeEach(async (to, from, next) => {
    await initChat();
    next();
});*/
</script>
