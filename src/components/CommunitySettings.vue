<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex border-b-1 font-bold">{{pageTitle}}</div>

    <div>
        <button class="btn" @click="addText()"><span class="oi oi-plus"></span> text</button>
        <button class="btn" @click="addCategory()"><span class="oi oi-plus"></span> category</button>
        <button class="btn" @click="addInfo()"><span class="oi oi-plus"></span> info</button>
        <button class="btn" @click="moveUp()"><span class="oi oi-chevron-top"></span></button>
        <button class="btn" @click="moveDown()"><span class="oi oi-chevron-bottom"></span></button>
        <button class="btn" @click="remove()"><span class="oi oi-x"></span></button>
    </div>

    <Draggable v-model="streams" :key="messageKey">
        <template v-slot:item="{item}">
            <div class="item border rounded-md border-gray-700 my-1 p-1"
                @click="select(item)"
                :data-selected="item.selected"
            >{{item.getName()}}</div>
        </template>
    </Draggable>


    <div v-for="stream in streams" :stream="stream">
        
    </div>

    <div>
        <button class="btn">Update</button>
        <button class="btn2"><span class="oi oi-reload"></span> Reset</button>
    </div>
    <!--<div id="messages" :key="messageKey" class="flex flex-col overflow-y-scroll">
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
   </div>-->
 </div>
</template>
<script setup>
import Draggable from "vue3-draggable";
import { useAccountStore } from "../stores/account";
import { useRoute } from "vue-router";
import { ref, nextTick } from 'vue';

const route = useRoute();
const accountStore = useAccountStore();
const displayableMessages = ref([]);
const messageKey = ref("");

var community = null;
const pageTitle = ref("");
const streams = ref([]);

function update() {
    messageKey.value = community.getName()+'#'+stlib.Utils.utcTime();
}

function select(item) {
    for(var stream of streams.value) stream.selected = false;
    item.selected = true;
}
function addText() {
    community.setStreams(streams.value);
    community.newTextStream("Text");
    update();
}
function addCategory() {
    community.setStreams(streams.value);
    community.newCategory("Category");
    update();
}
function addInfo() {
    community.setStreams(streams.value);
    community.newCategory("About", '/about');
    update();
}
function moveUp() {
    //community.newCategory("About", '/about');
}
function moveDown() {
    //community.newCategory("About", '/about');
}
function remove() {
    
}
async function initChat() {
    var user = accountStore.account.name;
    if(user == null) return; //TODO ask to login
    var user2 = route.params.user;
    if(user2 == null || user2 == "") return;

    community = await stlib.Community.load(user2);
    if(community) {
        community = community.copy();

        pageTitle.value = community.getTitle();
        streams.value = community.getStreams();
        update();
    }
    
    /*const manager = getManager();
    manager.setUser(user);

    var conversation = null;
    if(route.name === 'CommunityPath') {
        conversation = user2+'/'+route.params.path;
        //var community = await stlib.Community.load(user2);
        streamName.value = conversation;
        
    }
    else if(route.name === 'PrivateChat') {
        var users = [user, user2];
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
    }*/
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
<style>
.item[data-selected="true"] {
    color: white;
    background-color: teal;
}

</style>
