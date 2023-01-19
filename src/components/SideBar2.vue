<template>
    <div class="border-r-1">
        <SideBarLoginIcon :number="number" @toggleStreambar="$emit('toggleStreambar')"/>
    </div>
    <div class="border-b-1">
        <button class="w-full avCommunity md:hidden border-r-1" style="padding-left: 1px;"
             @click="$emit('toggleStreambar')"><span class="oi oi-menu" style="font-size:30px;"></span></button>
    </div>
  <div class="h-screen m-0 shadow-lg overflow-y-scroll scrollBox"
        style="overflow-x: clip;" @dragover.prevent @drop.stop.prevent="onDrop">
    <div class="scrollBoxContent flex flex-col border-r-1">
        <div>Direct</div>

        <div :key="updateKey2">
            <div class="flex justify-between">
                <b class="border-b-1">{{$t("StreamBar.DirectMessages")}}</b>
                <button class="text-sm" @click="toggleNewUserMessageModalOpen">
                    <span class="oi oi-plus"></span>
                </button>
            </div>
            <div v-for="conversation in conversations">
                <Conversation v-if="conversation.id !== undefined" :conversation="conversation.conversation" :id="conversation.id" :username="conversation.username" :number="conversation.lastReadNumber+conversation.plus"/>
                <Conversation v-else :conversation="conversation.conversation"
                 :username="username" :number="''+conversation.lastReadNumber" />
            </div>
        </div>

        <div>+</div>
        <div>C/</div>
        <Draggable v-model="communities" :key="updateKey">
            <template v-slot:item="{item}">
              <SideBarIcon :img="item[0]" :name="item[1]"
                 :community="item" :number="item.lastReadNumber" @toggleStreambar="$emit('toggleStreambar')" />
            </template>
        </Draggable>
        <div>+</div>
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
const title = ref("Direct Messages");
const isAdmin = ref(false);
const communityName = ref("");
const isCommunity = ref(false);
const updateKey2 = ref("");

const newUserMessageModalOpen = ref(false);
const toggleNewUserMessageModalOpen = () => {
  newUserMessageModalOpen.value = !newUserMessageModalOpen.value;
};
const showJoinModal = ref(false);
function toggleJoinModal() {
    showJoinModal.value = !showJoinModal.value;
}

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
            console.log("Callback message update StreamBar.vue");

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

            console.log("Callback message end StreamBar.vue");
        };
        await update();
        manager.setCallback("StreamBar.vue", update);
        manager.onpreferences.set("StreamBar.vue", update);
        manager.onlastread.set("StreamBar.vue", update);
    //}
}
initConversations(route);
</script>
