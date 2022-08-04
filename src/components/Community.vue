<template>
    <AddGroupUserModal :show="showGroupUserModal" @close="toggleShareGroup"></AddGroupUserModal>
    <CloseGroupModal :show="showCloseGroupModal" @close="toggleCloseGroup"></CloseGroupModal>
  <div class="w-full h-full flex flex-col justify-end" v-if='messageKey'>
    <div class="border-b-1 font-bold">
        {{streamName}}
        <span v-if="messageKey.startsWith('#')" class="float-right mr-2">
            <button class="text-sm mr-2" @click="toggleShareGroup" title="share group">
                <span class="oi oi-people"></span>
            </button>
            <button class="text-sm" @click="toggleCloseGroup" title="close group">
                <span class="oi oi-x align-top"></span>
            </button>
        </span>
    </div>
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

const showGroupUserModal = ref(false);
const showCloseGroupModal = ref(false);

function toggleShareGroup() {
    showGroupUserModal.value = !showGroupUserModal.value;
}
function toggleCloseGroup() {
    showCloseGroupModal.value = !showCloseGroupModal.value;
}
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
    else if(route.name === 'Group') {
        var pref = await stlib.Utils.getAccountPreferences(user2);
        var groups = pref.getGroups();
        var group = groups[route.params.path];
        conversation = '#'+user2+'/'+route.params.path;
        streamName.value = (group !== null && group.name != null)?`${group.name} ${conversation}`:conversation;
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
var sendingMessage = false;
const enterMessage = async (message) => {
    if(sendingMessage) return;
    try {
        sendingMessage = true;
        var user = accountStore.account.name;
        var user2 = route.params.user;

        if(user == null) return; //TODO ask to login
        if(user2 == null || user2 == "") return;

        const manager = getManager();
        var client = manager.client;
        var textMsg = stlib.Content.text(message);

        var encodeKey = null;
        var conversation = null;
        if(route.name === 'CommunityPath') {
            conversation = user2+'/'+route.params.path;
        }
        if(route.name === 'Group') {
            conversation = '#'+user2+'/'+route.params.path;
            encodeKey = await manager.getKeyFor(conversation);
            if(encodeKey === null) {
                console.log("unknown key"); //TODO ask to enter key
                return;
            }
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
        if(encodeKey !== null) signableMessage.encodeWithKey(encodeKey);

        console.log("write ", signableMessage);
        
        var result = await client.write(signableMessage);
        if(result.isSuccess()) {
            document.getElementById("Message").value = "";
        }
        else { 
            console.log(result);
        }
    }
    finally { sendingMessage = false; }
};
function isAtScrollBottom(e) {
    return e.scrollTop + e.clientHeight >= e.scrollHeight;
}
/*app.router.beforeEach(async (to, from, next) => {
    await initChat();
    next();
});*/
</script>
