<template>
    <TransitionRoot :show="showGroupUserModal">
        <AddGroupUserModal @close="toggleShareGroup"></AddGroupUserModal>
    </TransitionRoot>
    <TransitionRoot :show="showCloseGroupModal">
        <CloseGroupModal @close="toggleCloseGroup"></CloseGroupModal>
    </TransitionRoot>
    <TransitionRoot :show="showDeleteMessageModal">
        <DeleteMessageModal @close="toggleDeleteMessage" :msg="deleteMessageRef"></DeleteMessageModal>
    </TransitionRoot>
  <div class="w-full h-full break-all" v-if='messageKey'>
     <div class="h-full border-l-1 float-right pr-1 pl-1 w-200 overflow-y-scroll hidden md:block" v-if="$route.name === 'CommunityPath'">

        <div v-for="(users,role) in communityUsers">
            <small><b>{{role}}</b></small>
            <Conversation v-for="team in users" :username="team[0]"/> 
        </div>
      </div>
    <div class="h-full flex flex-col justify-end">
        <div class="font-bold">
            {{streamName}}
            <span class="inline-block" v-if="sharedCommunities">
                <span class="flex">
                    <SideBarIcon v-for="community in sharedCommunities" :img="community[0]" :name="community[1]" :community="community" :imgCss="`avMini`" />
                </span>
            </span>
            <span v-if="messageKey.startsWith('#')" class="float-right mr-2">
                <button class="text-sm mr-2" @click="toggleShareGroup" title="share group">
                    <span class="oi oi-people"></span>
                </button>
                <button class="text-sm" @click="toggleCloseGroup" title="close group">
                    <span class="oi oi-x align-top"></span>
                </button>
            </span>
        </div>
        <div ref="messages" :key="messageKey" class="flex flex-col overflow-y-scroll pr-3">
            <div v-for="message in displayableMessages" >
                <div v-if="!message.isEdit && !message.isEmote() && message.getContent() != null">
                    <hr style="margin-top: 0.5rem;margin-bottom: 0.25rem;">
                    <Message :message="message" @action="setContentMessage" />
                </div>
           </div>
        </div>
        <div v-if="decodeNMessages>0">
            <hr>
            <div><small>Click to decode {{decodeNMessages}} message/s.</small></div>            
            <button class="btn" @click="decode()">Decode</button>
            <button class="btn" @click="autoDecode()">{{valueAutoDecode?'Manual decode':'Auto decode'}}</button>
        </div>
        <div v-if="contentMsg" class="text-sm border-t-1 pr-3">
            <button class="float-right" @click="setContentMessage(null)"><span class="oi oi-circle-x align-top"></span></button>
            <div class="overflow-x-hidden" style="text-overflow: ellipsis;"><span class="font-bold">{{contentMsg.msg.getUser()}}:</span> {{contentMsg.text}}</div>
        </div>
        <div class="flex mt-4 mb-2 mr-3">
          <MessageBox
            ref="messageBox"
            class="grow"
            @entermessage="enterMessage"
            v-focus
          ></MessageBox>
    </div>
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
const decodeNMessages = ref(0);
const messageKey = ref("");
const streamName = ref("");
const community = ref(null);
const communityUsers = ref({});
const sharedCommunities = ref(null);
const messageBox = ref();
const messages = ref();
const valueAutoDecode = ref(false);

const showGroupUserModal = ref(false);
const showCloseGroupModal = ref(false);
const showDeleteMessageModal = ref(false);
const deleteMessageRef = ref();

function toggleShareGroup() {
    showGroupUserModal.value = !showGroupUserModal.value;
}
function toggleCloseGroup() {
    showCloseGroupModal.value = !showCloseGroupModal.value;
}
function toggleDeleteMessage() {
    showDeleteMessageModal.value = !showDeleteMessageModal.value;
}
async function initChat() {
    var user = accountStore.account.name;
    if(user == null) return; //TODO ask to login
    var user2 = route.params.user;
    if(user2 == null || user2 == "") return;

    const manager = getManager();
    manager.setUser(user);
    manager.setSelectedCommunityPage(user2, route.path);

    var conversation = getConversation(); 
    if(conversation != null) {
        if(route.name === 'CommunityPath') {
            var community0 = await stlib.Community.load(user2);
            var stream = (community0)?community0.findTextStreamById(''+route.params.path):null;
            streamName.value = stream?stream.getName():conversation;
            community.value = community0;
            var usersCategories = {};
            for(var team of community0.communityData.team) {
                if(usersCategories[team[1]] === undefined) usersCategories[team[1]] = [];
                usersCategories[team[1]].push(team);
            }
            communityUsers.value = usersCategories;
        }
        else if(route.name === 'Group') {
            var pref = await stlib.Utils.getAccountPreferences(user2);
            var groups = pref.getGroups();
            var group = groups[route.params.path];
            streamName.value = (group !== null && group.name != null)?`${group.name} ${conversation}`:conversation;
        }
        else if(route.name.startsWith('PrivateChat')) {
            streamName.value = conversation;
            sharedCommunities.value = await findSharedCommunities(conversation);
        }

        manager.setConversation(conversation);
       
        var updateMessages = async () => {
            var container = messages.value;
            var scrollToBottom = true;
            var scrollTop = 0;
            if(container) { 
                scrollToBottom = isAtScrollBottom(container); 
                scrollTop = container.scrollTop;
            }
            var data = await manager.getSelectedConversations();
            if(data == null || manager.selectedConversation != conversation) return;
            data.messages.sort((a,b)=>a.getTimestamp()-b.getTimestamp());
            displayableMessages.value = data.messages;
            if(data.encoded && data.encoded.length > 0)
                decodeNMessages.value = data.encoded.length;
            else decodeNMessages.value = 0;
            messageKey.value = ""+stlib.Utils.nextId();
            if(data.messages.length > 0) {
                manager.setLastRead(conversation,
                     data.messages[data.messages.length-1].getTimestamp());
            }
            nextTick(async () => {
                var container = messages.value;
                if(container) container.scrollTop = scrollToBottom?
                              container.scrollHeight:scrollTop;
            });
        };
        var prefs = await manager.getPreferences();
        var isAutoDecode = prefs.getValueBoolean("autoDecode", false);
        valueAutoDecode.value = isAutoDecode;
        await updateMessages();

        manager.setCallback("Community.vue", updateMessages);

        if(isAutoDecode === true)
            await decode();        
    }
}
async function findSharedCommunities(conversation) {
    const manager = getManager();
    var user = accountStore.account.name;
    var users = conversation.split("|");
    var userCommunities = null
    var list = [];
    for(var name of users) {
        var communities = await manager.getCommunities(name);
        if(name === user) userCommunities = communities;
        else list.push(communities);
    }
    console.log("user ", userCommunities);
    console.log("list ", list);
    var shared = [];
    if(userCommunities != null) {
        skip:
        for(var community of userCommunities) {
            loop:
            for(var userCommunities2 of list) {
                for(var community2 of userCommunities2) 
                    if(community[0] == community2[0]) 
                        continue loop;
                continue skip;
            }
            shared.push(community);
        }            
    }
    console.log("shared ", shared);
    return shared;
}
function focusMessageBox() {
    if(messageBox.value != null) 
        messageBox.value.focus();
}
initChat();
const contentMsg = ref(null);
async function setContentMessage(obj) {
    console.log("contentMessage", obj);
    if(obj == null) {
        var val = contentMsg.value; //clear message field if closing edit action
        if(val && val.type === stlib.Content.Edit.TYPE) messageBox.value.setText("");
        contentMsg.value = null;
        focusMessageBox();
        return;
    }
    if(obj.type === stlib.Content.Emote.TYPE) {
        await enterMessage(obj.text, obj, false);
        return;
    }
    if(obj.type === 'delete') {
        deleteMessageRef.value = obj.msg;
        toggleDeleteMessage();
        focusMessageBox();
        return;
    }
    contentMsg.value = obj;
    if(obj.type === stlib.Content.Edit.TYPE) {
        messageBox.value.setText(obj.msg.getContent().getText());
    }
    focusMessageBox();
}
function getConversation() {
    var user = accountStore.account.name;
    var user2 = route.params.user;

    if(user == null) return null; //TODO ask to login
    if(user2 == null || user2 == "") return null;
    var conversation = null;
    if(route.name === 'CommunityPath') {
        conversation = user2+'/'+route.params.path;
    }
    else if(route.name === 'Group') {
        conversation = '#'+user2+'/'+route.params.path;
    }
    else if(route.name.startsWith('PrivateChat')) {
        conversation = [user, user2];
        if(route.params.user2) {
            conversation.push(route.params.user2);
            if(route.params.user3) conversation.push(route.params.user3);
        }
        conversation.sort();
        conversation = conversation.join('|');
    }
    return conversation;
}
const autoDecode = async ()=>{
    var manager = getManager();
    var prefs = await manager.getPreferences();
    var value = !prefs.getValueBoolean("autoDecode", false);
    prefs.setValue("autoDecode:b", value);
    var result = await manager.updatePreferences(prefs);
    if(result.isSuccess()) 
        valueAutoDecode.value = value;
    if(value) await decode();
};
const decode = async ()=>{ await getManager().decodeSelectedConversations(); };
var sendingMessage = false;
const enterMessage = async (message, contentMessage=null, block=true) => {
    console.log("message ", message);
    if(block && sendingMessage) return;
    try {
        if(block) sendingMessage = true;
        var conversation = getConversation();
        if(conversation == null) return;

        const manager = getManager();
        var textMsg = null;
        if(contentMessage === null) contentMessage = contentMsg.value;
        if(contentMessage !== null) {
            switch(contentMessage.type) {
                case stlib.Content.Emote.TYPE:
                     textMsg = stlib.Content.emote(message, contentMessage.msg.message);
                break;
                case stlib.Content.Quote.TYPE:
                    textMsg = stlib.Content.quote(message, contentMessage.msg.message, contentMessage.from, contentMessage.to);
                break;
                case stlib.Content.Edit.TYPE:
                    var editContent = contentMessage.msg.getContent().copy();
                    editContent.setText(message);
                    textMsg = stlib.Content.edit(editContent, contentMessage.msg.message);
                break;
            }
        }
        if(textMsg === null) textMsg = stlib.Content.text(message);

        console.log(textMsg);
        
        var result = await manager.sendMessage(textMsg, conversation);
        if(result.isSuccess()) {
            messageBox.value.setText("");
            if(contentMsg.value !== null) contentMsg.value = null;
        }
        else { 
            console.log(result);
        }
    }
    finally { if(block) sendingMessage = false; }
};
function isAtScrollBottom(e) {
    return e.scrollTop + e.clientHeight >= e.scrollHeight;
}
/*app.router.beforeEach(async (to, from, next) => {
    await initChat();
    next();
});*/
</script>
