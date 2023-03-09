<template>
    <TransitionRoot :show="showJoinModal">
        <JoinModal :community="route.params.user" :hideVisitButton="true" @close="toggleJoinModal"></JoinModal>
    </TransitionRoot>
    <TransitionRoot :show="newUserMessageModalOpen">
        <NewUserMessageModal @close="toggleNewUserMessageModalOpen(false)"></NewUserMessageModal>
    </TransitionRoot>
    <TransitionRoot :show="showConfirmModal!=null">
        <ConfirmModal :title="showConfirmModal.title" @close="showConfirmModal=null"></ConfirmModal>
    </TransitionRoot>
  <div class="m-0 overflow-y-scroll scrollBox pl-1 w-200" :key="updateKey">
    <div class="scrollBoxContent flex flex-col pr-1">
        <div v-if="isCommunity">
            <div class="flex justify-between">
                <b class="border-b-1 cursor-pointer" @click.stop.prevent="showMenu($event.target)">C/{{title}}</b>
                <router-link v-if="isAdmin" :to="`/s/${route.params.user}`">
                   <span class="oi oi-cog"></span>
                </router-link>
            </div>
            <div v-for="stream in streams" >
                <Stream v-if="stream.visible" :community="communityName"
                     :stream="stream" :number="''+stream.lastReadNumber"/>
            </div>
        </div>
        <div v-else>
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
    </div>
  </div>
</template>
<script setup>
import { useAccountStore } from "../stores/account";
import { useRoute } from "vue-router";
import { ref } from 'vue'
const route = useRoute();
const router = useRouter();
const accountStore = useAccountStore();
const username = accountStore.account.name;
const streams = ref([]);
const conversations = ref([]);
const title = ref("Direct Messages");
const isAdmin = ref(false);
const communityName = ref("");
const isCommunity = ref(false);
const updateKey = ref("");

const newUserMessageModalOpen = ref(false);
const toggleNewUserMessageModalOpen = () => {
  newUserMessageModalOpen.value = !newUserMessageModalOpen.value;
};
const showJoinModal = ref(false);
function toggleJoinModal() {
    showJoinModal.value = !showJoinModal.value;
}
const showConfirmModal = ref(null);
function toggleConfirmModal(title) {
    showConfirmModal.value = {title};
}
function filterStreams(streams) {
    var streambarMode = window.globalProperties["streambarMode"];
    var result = [];    
    if(streambarMode === 1 || streambarMode === 2) {
        var other = [];
        for(var stream of streams) {
            var type = stream.getPathType();
            if(type == null || type === 't' || type === 'g')
                result.push(stream);
            else other.push(stream);
        }
        if(streambarMode === 1 && other.length > 0) {
            result.push(stlib.DataStream.fromJSON(communityName.value, ["Links"]));
            for(var stream of other)
                result.push(stream);
        }
    }
    else for(var stream of streams)
        result.push(stream);
    return result;
}
function showMenu(element) {
    var community = communityName.value;
    console.log("menu", element);
    var options = [
        ["About", ()=>{ router.push(`/i/${community}/about`); }, "oi-info"],
        ["Posts", ()=>{ window.open('https://peakd.com/c/'+community+'/created', '_blank', 'noopener=true'); }, "oi-external-link"]
    ];
    if(isAdmin.value) options.push(["Settings", ()=>{ router.push(`/s/${community}`); }, "oi-cog"]);
    /*options.push(["", ()=>{ 
        toggleConfirmModal("");
    }, ""]);*/

    window.menu(element, options, null, true);
}
async function initConversations(route) {
    console.log(route);
    console.log("load community " + route.name);
    if(username == null || route.name == null) return;
    isCommunity.value = route.name.startsWith('Community');
    const manager = getManager();

    if(isCommunity.value) {
        title.value = "";

        var user2 = route.params.community || route.params.user;
        if(user2 == null || user2 == "") return;
        communityName.value = user2;
        var community = await stlib.Community.load(user2);

        var role = community.getRole(username);
        var titles = community.getTitles(username);

        title.value = community.getTitle();
        streams.value = filterStreams(community.getStreams());
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
    else {
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
            updateKey.value = '#'+stlib.Utils.nextId();

            console.log("Callback message end StreamBar.vue");
        };
        await update();
        manager.setCallback("StreamBar.vue", update);
        manager.onpreferences.set("StreamBar.vue", update);
        manager.onlastread.set("StreamBar.vue", update);
    }
}
initConversations(route);
/*app.router.beforeEach(async (to, from, next) => {
    await initConversations(to);
    next();
});*/
</script>
