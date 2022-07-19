<template>
    
  <div class="w-full h-full flex flex-col justify-end overflow-y-scroll">
    <div v-if='messageKey'>
        <div :key="messageKey">
            <Message v-for="message in displayableMessages" :message="message" />
        </div>
        <div class="flex mt-4 mb-2">
          <input
            class="shadow appearance-none border rounded-full w-[calc(100%-4rem)] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grow"
            id="Message"
            v-model="messageText"
            @keyup.enter="enterMessage(messageText)"
            type="text"
            placeholder="Message"
          />
       </div>
    </div>
 </div>
</template>
<script setup>
import { useAccountStore } from "../stores/account";
import { useRoute } from "vue-router";
import { ref } from 'vue'
const route = useRoute();
const accountStore = useAccountStore();
const displayableMessages = ref([]);
const messageKey = ref("");

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
    }
    else if(route.name === 'PrivateChat') {
        var users = [user, user2];
        users.sort();
        conversation = users.join('|');
    }

    if(conversation != null) {
        manager.setConversation(conversation);
        var data = await manager.getSelectedConversations();
        displayableMessages.value = data.messages;
        messageKey.value = conversation+"#"+data.messages.length;
        console.log("messageKey " + messageKey.value );

        console.log("Messages are ");
        console.log(data.messages);
    
        manager.onmessage = async function(message) {
            var data2 = await manager.getSelectedConversations();
            displayableMessages.value = data2.messages;
            messageKey.value = conversation+"#"+data.messages.length;

            console.log("messageKey " + messageKey.value );
            console.log("Messages are ");
            console.log(data2.messages);
        };
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
        textMsg = await textMsg.encodeWithKeychain(user, conversation, "Posting"); 
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
