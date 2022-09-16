<template>
  <TransitionRoot :show="showAddChatModal">
    <AddChatModal @oninput="addText" @close="toggleAddChatModal"></AddChatModal>
  </TransitionRoot>
  <TransitionRoot :show="showCategoryModal">
    <AddCategoryModal @oninput="addCategory" @close="toggleAddCategoryModal"></AddCategoryModal>
  </TransitionRoot>
  <TransitionRoot :show="showInfoModal">
    <AddInfoModal @oninput="addInfo" @close="toggleAddInfoModal"></AddInfoModal>
  </TransitionRoot>
  <div class="w-full h-full flex flex-col">
    <div class="flex border-b-1 font-bold">{{pageTitle}}</div>

    <div>
        <button class="btn" @click="toggleAddChatModal()"><span class="oi oi-chat"></span> chat</button>
        <button class="btn" @click="toggleAddCategoryModal()"><span class="oi oi-plus"></span> category</button>
        <button class="btn" @click="toggleAddInfoModal()"><span class="oi oi-plus"></span> info</button>
        <button class="btn" @click="moveUp()"><span class="oi oi-chevron-top"></span></button>
        <button class="btn" @click="moveDown()"><span class="oi oi-chevron-bottom"></span></button>
        <button class="btn" @click="remove()"><span class="oi oi-x"></span></button>
    </div>

    <div class="grid grid-cols-2 gap-2">

        <div>
            <!--<label class="block text-sm font-medium text-gray-700">Streams: </label>-->
    <Draggable v-model="streams" :key="messageKey">
        <template v-slot:item="{item}">
            <div class="item border rounded-md border-gray-700 my-1 p-1"
                @mousedown="select(item)"
                :data-selected="item.selected"
            >
            <span v-if="item.getPathType() == null" 
                class="font-bold">{{item.getName()}} 
                <span class="float-right font-normal text-sm">(category)</span>
            </span>
            <span v-else-if="item.getPathType() == 't'" 
                class="pl-2"><span class="oi oi-chat"></span> {{item.getName()}} 
                <span class="float-right text-sm">(text)</span>
            </span>
            <span v-else-if="item.getPathType() == 'g'" 
                class="pl-2"><span class="oi oi-lock-locked"></span> {{item.getName()}} 
                <span class="float-right text-sm">(private text)</span>
            </span>
            <span v-else-if="item.getPathType() == 'i'"><span class="oi oi-info text-center" style="width:14px;"></span> {{item.getName()}} 
                <span class="float-right text-sm">(info)</span>
            </span>              
            <span v-else>{{item.getName()}}</span>
            </div>
        </template>
    </Draggable>

        </div>

        <div> 
            <div>
                <label for="streamname" class="block text-sm font-medium text gray-700">            Displayable name: 
                </label>
                <input id="streamname" name="streamname" type="text" class="inputText1" placeholder="Stream Name" @input="setStreamName">    
            </div>

            <div>
                <label for="datapath" class="block text-sm font-medium text gray-700">            Data path: 
                </label>
                <input id="datapath" name="datapath" type="text" class="inputText1" placeholder="Data Path" @input="setDataPath"> 
                   
            </div>

            

            <div v-if="selected">
                <label class="block text-sm font-medium text gray-700">Shown for:</label>
                <PermissionSet :set="selected.readSet" :key="selectKey"/>
            </div>
        
            <div v-if="selected && selected.dataPath != null && selected.dataPath.getType() != 'i'">
                <label class="block text-sm font-medium text gray-700">Write Permissions:</label>
                <PermissionSet :set="selected.writeSet" :key="selectKey"/>
            </div>
        </div>
    </div>

    <div><small>{{updateMessage}}</small></div>
    <div>
        <button class="btn" @click="updateSettings">Update</button>
        <button class="btn2" @click="resetSettings"><span class="oi oi-reload"></span> Reset</button>
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
const router = useRouter();
const route = useRoute();
const accountStore = useAccountStore();
const displayableMessages = ref([]);
const messageKey = ref("");
const selectKey = ref("");

const showAddChatModal = ref(false);
const showCategoryModal = ref(false);
const showInfoModal = ref(false);
function toggleAddChatModal() { showAddChatModal.value = !showAddChatModal.value; }
function toggleAddCategoryModal() { showCategoryModal.value = !showCategoryModal.value; }
function toggleAddInfoModal() { showInfoModal.value = !showInfoModal.value; }

var community = null;
const pageTitle = ref("");
const streams = ref([]);
const selected = ref(null);

const updateMessage = ref("");
function updateSettings() {
    var user = accountStore.account.name;
    if(user == null) return;
    community.setStreams(streams.value);
    var json = community.updateStreamsCustomJSON();
    updateMessage.value = "";
    window.hive_keychain.requestCustomJson(user, "community", "Posting",
         JSON.stringify(json), "Update Community Data", (result)=>{
        if(result.success) updateMessage.value="Succesfully updated settings."
        else updateMessage.value="Error: " + result.error;
    });
}
function resetSettings() {
    initChat();
}
function update() {
    messageKey.value = community.getName()+'#'+stlib.Utils.utcTime();
}
function setStreamName(event) {
    var item = getSelected();
    if(item == null) return;
    var value = event.target.value;
    item.name = value;
} 
function setDataPath(event) {
    var item = getSelected();
    if(item == null) return;
    var value = event.target.value;
    item.dataPath = stlib.DataPath.fromString(value, item.community);
}
function select(item) {
    for(var stream of streams.value) stream.selected = false;
    if(item == null) return;    
    item.selected = true;
    var streamname = document.getElementById("streamname");
    var datapath = document.getElementById("datapath");
    //var readpermissions = document.getElementById("readpermissions");
    //var writepermissions = document.getElementById("writepermissions");
    streamname.value = item.getName();
    datapath.value = item.getCompactPath();
    //readpermissions.value = item.getReadPermissions().toJSON();
    //writepermissions.value = item.getWritePermissions().toJSON();
    selected.value = item;
    selectKey.value = community.getName()+'#'+stlib.Utils.utcTime();
}
function getSelected() {
    for(var stream of streams.value) if(stream.selected) return stream;
    return null;
}
function addText(displayName="Text", path=null) {
    community.setStreams(streams.value);
    select(community.newTextStream(displayName, path));
    update();
}
function addCategory(displayName="Category") {
    community.setStreams(streams.value);
    select(community.newCategory(displayName));
    update();
}
function addInfo(displayName="About", dataPath='/about') {
    community.setStreams(streams.value);
    select(community.newInfo(displayName, dataPath));
    update();
}
function moveUp() {
    for(var i = 1; i < streams.value.length; i++) {
        if(streams.value[i].selected) {
            swap(streams.value, i-1, i);
            update();
            return;
        }
    }
}
function moveDown() {
    for(var i = 0; i < streams.value.length-1; i++) {
        if(streams.value[i].selected) {
            swap(streams.value, i, i+1);
            update();
            return;
        }
    }
}
function remove() {
    for(var i = 0; i < streams.value.length; i++) {
        if(streams.value[i].selected) {
            streams.value.splice(i, 1);
            update();
            return;
        }
    }
}
function swap(array,x,y) {
    var tmp = array[x];
    array[x] = array[y];
    array[y] = tmp;
    return array;
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
        if(streams.value.length > 0) select(streams.value[0]);
        update();
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
