<template>
    <TransitionRoot :show="newUserMessageModalOpen">
        <NewUserMessageModal @close="toggleNewUserMessageModalOpen(false)"></NewUserMessageModal>
    </TransitionRoot>
    <TransitionRoot :show="addCommunityModal">
        <AddCommunityModal @close="toggleAddCommunityModal(false)"></AddCommunityModal>
    </TransitionRoot>
    <div class="border-r-1 border-b-1">
        <SideBarLoginIcon :number="number" @toggleStreambar=""/>
    </div>
    <!--<div class="border-b-1">
        <button class="w-full avCommunity md:hidden border-r-1" style="padding-left: 1px;"
             @click="$emit('toggleStreambar')"><span class="oi oi-menu" style="font-size:30px;"></span></button>
    </div>-->

    <div class="flex justify-between border-b-1 p-1 border-r-1 cursor-pointer appsg0" @click="toggleDirect">
        <b class="text-xs">{{$t("SideBar.Direct")}}</b>
        <button v-if="addButton === 0" class="text-xs" @click.stop="toggleNewUserMessageModalOpen">
            <span class="oi oi-plus"></span>
        </button>
        <span v-else class="oi oi-elevator iconSize"></span>
    </div>

    <div v-if="showDirect" class="h-screen m-0 shadow-lg overflow-y-scroll scrollBox border-b-1"
        style="overflow-x: clip;" @dragover.prevent @drop.stop.prevent="onDrop">
        <div class="scrollBoxContent flex flex-col border-r-1">
            <div :key="updateKey2">
                <TextIcon v-if="addButton === 1" class="p-1 cursor-pointer" :text="'+'" @click.stop="toggleNewUserMessageModalOpen"/>
                <div v-for="conversation in conversations">
                    <Conversation v-if="conversation.id !== undefined" :conversation="conversation.conversation" 
                        :id="conversation.id" :username="conversation.username"
                        :number="conversation.lastReadNumber+conversation.plus" :compact="true"/>
                    <Conversation v-else :conversation="conversation.conversation"
                     :username="username" :number="''+conversation.lastReadNumber" :compact="true"/>
                </div>
                <TextIcon v-if="addButton === 2" class="p-1 cursor-pointer" :text="'+'" @click.stop="toggleNewUserMessageModalOpen"/>
            </div>
        </div>
    </div>

   <div class="flex justify-between gap-x-1 border-b-1 border-r-1 p-1 font-bold cursor-pointer appsg0"
        @click="toggleCommunities">
        <b class="text-xs">C/</b>
        <button v-if="addButton === 0" class="text-xs" @click.stop="toggleAddCommunityModal">
            <span class="oi oi-plus"></span>
        </button>
        <span v-else class="oi oi-elevator iconSize"></span>
    </div>
  <div v-if="showCommunities" class="h-screen m-0 shadow-lg overflow-y-scroll scrollBox"
        style="overflow-x: clip;" @dragover.prevent @drop.stop.prevent="onDrop">
    <div class="scrollBoxContent flex flex-col border-r-1">
        <TextIcon v-if="addButton === 1" class="p-1 cursor-pointer" :text="'+'" @click.stop="toggleAddCommunityModal"/>
        <Draggable v-model="communities" :key="updateKey">
            <template v-slot:item="{item}">
              <SideBarIcon :img="item[0]" :name="item[1]"
                 :community="item" :number="item.lastReadNumber" @toggleStreambar="$emit('toggleStreambar')" />
            </template>
        </Draggable>
        <TextIcon v-if="addButton === 2" class="p-1 cursor-pointer" :text="'+'" @click.stop="toggleAddCommunityModal"/>
    </div>
  </div>
</template>
<script setup>
import Draggable from "vue3-draggable";
import { nextTick } from 'vue';
import { useAccountStore } from "../stores/account";
import { useRoute } from "vue-router";
const emit = defineEmits(["toggleStreambar"]);
const accountStore = useAccountStore();
const communities = ref([]);
const updateKey = ref("");
const number = ref('0');
function canOpenBoth() { return window.globalProperties["sidebar2enableSharedView"] === true; }
const showDirect = ref(true);
const showCommunities = ref(canOpenBoth());
const addButton = ref(window.globalProperties["sidebarAddButton"]);

function toggleDirect() {
    showDirect.value = !showDirect.value;
    if(!showDirect.value && !showCommunities.value) showCommunities.value = true;
    else if(!canOpenBoth() && showDirect.value && showCommunities.value) showCommunities.value = false;
}
function toggleCommunities() { 
    showCommunities.value = !showCommunities.value;
    if(!showDirect.value && !showCommunities.value) showDirect.value = true;
    else if(!canOpenBoth() && showDirect.value && showCommunities.value) showDirect.value = false;
}

function onDrop() {
    setTimeout(() => {
        var list = [];
        for(var a of communities.value)
            list.push(a[0]);
        getManager().storeCommunitySortOrderLocally(list);
    }, 1000);
}
async function initCommunities() {
    var user = accountStore.account.name;
    if(user == null) return;
    var manager = getManager();
    manager.setUser(user);
    manager.joinGroups();
    var _communities = await manager.getCommunitiesSorted();
    {
        var tmp = {};
        for(var community of _communities) tmp[community[0]] = true;
        var prepend = globalProperties.prependCommunities;
        if(prepend && prepend.length > 0) {
            for(var name of prepend) {
                if(tmp[name] === true) continue;
                var data = await stlib.Community.load(name);
                if(data) _communities.unshift([name, data.getTitle()]);
            }
        }
    }
    communities.value = _communities;
    updateKey.value = ''+stlib.Utils.nextId();
    var update = async () => { console.log("total");
        for(var community of communities.value) {
            var lastReadNumber = await manager.getLastReadCommunity(community[0]);
            community.lastReadNumber = lastReadNumber;
        }
        updateKey.value = ''+stlib.Utils.nextId();
        nextTick(async ()=>{            
            number.value = ''+await manager.getLastReadTotal();
            updateKey.value = ''+stlib.Utils.nextId();
        });
    };
    await update();
    manager.setCallback("SideBar.vue", update);
}
initCommunities();


const route = useRoute();
const username = accountStore.account.name;
const streams = ref([]);
const conversations = ref([]);
const isAdmin = ref(false);
const communityName = ref("");
const isCommunity = ref(false);
const updateKey2 = ref("");

const newUserMessageModalOpen = ref(false);
const toggleNewUserMessageModalOpen = () => {
    newUserMessageModalOpen.value = !newUserMessageModalOpen.value;
};
const addCommunityModal = ref(false);
const toggleAddCommunityModal = () => {
    addCommunityModal.value = !addCommunityModal.value;
};
/*const showJoinModal = ref(false);
function toggleJoinModal() {
    showJoinModal.value = !showJoinModal.value;
}*/

async function initConversations(route) {
    console.log(route);
    console.log("load community " + route.name);
    if(username == null || route.name == null) return;
    //isCommunity.value = route.name.startsWith('Community');
    const manager = getManager();

    /*if(isCommunity.value) {
        title.value = "";

        var user2 = route.params.community || route.params.user;
        if(user2 == null || user2 == "") return;
        communityName.value = user2;
        var community = await stlib.Community.load(user2);

        var role = community.getRole(username);
        var titles = community.getTitles(username);

        title.value = community.getTitle();
        streams.value = community.getStreams();
        isAdmin.value = community.canUpdateSettings(username);

        for(var stream of streams.value) 
            stream.visible = stream.readSet.validate(role, titles);

        var update = async() => {
            console.log("Callback message update StreamBar.vue Community");
            for(var stream of streams.value) {
                var path = stream.getPath();
                stream.lastReadNumber = (path != null && path.getType() === 't')?
                    (await manager.getLastReadCommunityStream(path.getUser()+'/'+path.getPath())):'0';
            }
            console.log("Callback message end StreamBar.vue Community");
        };
        await update();
        manager.setCallback("StreamBar.vue", update);
        manager.onlastread.set("StreamBar.vue", update);
        //var streams = temp0.getStreams;
    }
    else {*/
        var update = async() => {
            console.log("Callback message update SideBar2.vue");

            var groupObjs = await manager.getJoinedAndCreatedGroups();
            var conversationArray = await manager.readUserConversations();
            var conversationObjects = [];
            for(var conversation in groupObjs) {
                var groupObj = groupObjs[conversation]; console.log("group obj", groupObj);
                groupObj.tmp = groupObj.timestamp;
                conversationObjects.push(groupObj);
            }
            for(var conversation of conversationArray) {
                var obj = {conversation,lastReadNumber:0,timestamp:0,plus:'',tmp:0};
                var lastRead = manager.getLastRead(conversation);
                if(lastRead != null) {
                    obj.lastReadNumber = lastRead.number;
                    obj.timestamp = obj.tmp = lastRead.timestamp;
                }   
                conversationObjects.push(obj);
            }         
            var conversationMap = {};
            for(var conversation of conversationObjects)
                conversationMap[conversation.conversation] = conversation;
            var messages = await manager.readCachedUserMessages();           
            for(var message of messages) {
                var conversation = conversationMap[message.getConversation()];
                if(conversation && message.isVerified() && message.getTimestamp() > conversation.tmp) {
                    conversation.lastReadNumber++;
                    conversation.timestamp = Math.max(conversation.timestamp, message.getTimestamp());
                }
            }
            conversationObjects.sort((a,b)=>b.timestamp-a.timestamp);
            conversations.value = conversationObjects;
            updateKey2.value = '#'+stlib.Utils.nextId();

            console.log("Callback message end SideBar2.vue");
        };
        await update();
        manager.setCallback("SideBar.vue", update);
        manager.onpreferences.set("SideBar.vue", update);
        manager.onlastread.set("SideBar.vue", update);
        manager.oncommunityhide.set("SideBar.vue", initCommunities);
    //}
}
initConversations(route);
</script>
<style scoped>
.iconSize { font-size: 10px; }
</style>

