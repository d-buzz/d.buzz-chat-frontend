<template>
    <TransitionRoot :show="showRenameGroupModal">
        <RenameGroupModal :conversation="groupId" @close="toggleRenameGroup"></RenameGroupModal>
    </TransitionRoot>
    <TransitionRoot :show="showGroupUserModal">
        <AddGroupUserModal :conversation="groupId" @close="toggleShareGroup"></AddGroupUserModal>
    </TransitionRoot>
    <TransitionRoot :show="showCloseGroupModal">
        <CloseGroupModal :conversation="groupId" @close="toggleCloseGroup"></CloseGroupModal>
    </TransitionRoot>
    <TransitionRoot :show="showFlagMessageModal">
        <FlagMessageModal @close="toggleFlagMessage" :msg="flagMessageRef"></FlagMessageModal>
    </TransitionRoot>
    <TransitionRoot :show="showDeleteMessageModal">
        <DeleteMessageModal @close="toggleDeleteMessage" :msg="deleteMessageRef"></DeleteMessageModal>
    </TransitionRoot>
    <TransitionRoot :show="showThreadsModal">
        <ThreadModal @oninput="setThread" @close="toggleThreads"></ThreadModal>
    </TransitionRoot>
    <TransitionRoot :show="showErrorModal != null">
        <ErrorModal title="Error sending message." :text="showErrorModal" @close="toggleErrorModal"></ErrorModal>
    </TransitionRoot>
  <div class="appbg3 appfg3 h-full break-all ml-3" v-if='messageKey'>
     <div class="border-l-1 h-full float-right sidebar" v-if="$route.name === 'CommunityPath' && community" ref="sidebar" :key="communityUsersKey">
         <div class="appbg3 appfg3 h-full w-200 overflow-y-scroll scrollBox">
            <div class="scrollBoxContent">
                <div class="pr-1 pl-1 appbg3">
                    <div class="text-right" @mouseenter="tooltip($event.target, $t('Community.OnlineJoined', [onlineCount]))"><small class="fg70">
                        {{onlineCount}}</small>
                    </div>        
                    <div v-for="roleUsers in communityUsers">
                        <div v-if="roleUsers[0] != 'muted'">
                            <small :class="roleCss(roleUsers[0])"><b class="messageFontFamily">{{roleUsers[0]}}</b></small>
                            <div class="p-1 flex" v-for="team in roleUsers[1]" :class="(team[3] == true)?'':'offline'">
                                <div class="flex-shrink-0 mr-5px">
                                    <UserCommunityIcon :name="team[0]" :community="community.getName()" 
                                    :imgCss="`avConversation`" :displayOnlineStatus="team[3] == true"/>
                                </div>
                                <div class="grow relative" style="margin-top:-7px;">
                                    <small :class="roleCss(team[1])"><b class="messageFontFamily">{{team[0]}}</b></small>
                                    <div class="flex" v-if="team[2]"><small v-for="title in team[2]" 
                                        class="titlebg">{{title}}</small></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="padding-bottom:150px;"></div>
                </div>
            </div>
        </div>
    </div>
    <div class="border-l-1 h-full float-right" v-else-if="$route.name === 'Group'" ref="sidebar" :key="communityUsersKey">
        <div class="appbg3 appfg3 h-full w-200 overflow-y-scroll scrollBox sidebar">
            <div class="scrollBoxContent">
                <div class="pr-1 pl-1 appbg3">
                    <div class="text-right" @mouseenter="tooltip($event.target, $t('Community.OnlineJoined', [onlineCount]))"><small class="fg70">
                        {{onlineCount}}</small>
                    </div>   
                    <div class="p-1 flex" v-for="(online, user) in messageUsers" :class="online?'':'offline'">
                        <div class="flex-shrink-0 mr-5px">
                            <UserIcon :name="user" 
                            :imgCss="`avConversation`" :online="online"/>
                        </div>
                        <div class="grow relative" style="margin-top:-7px;">
                            <small :class="roleCss('')"><b>{{user}}</b></small>
                        </div>
                    </div>
                    <div style="padding-bottom:150px;"></div>
                </div>
            </div>
        </div>
    </div>
    <div class="appbg2 appfg2 h-full flex flex-col justify-between">
        <div class="font-bold border-b-1 mr-3" style="order:1;padding-top: 12px; padding-bottom: 12px; vertical-align: middle;">
            <span v-if="$route.name === 'Group' || $route.name === 'CommunityGroup' || route.name.startsWith('PrivateChat')" class="oi oi-lock-locked mr-1 lockColor" @mouseenter="tooltip($event.target, $t('Community.MessagesLock'))"></span>
            <span class="cursor-pointer" @click.stop="setThread(null, $event.target)"><span class="oi oi-menu font-sm lineIcon md:hidden"></span>{{streamName}} <small class="streamName2">{{streamName2}}</small></span> <span v-if="threadName !== null" class="font-normal"><span class="oi oi-chevron-right cursor-pointer" style="font-size:10px;vertical-align:top;margin-top:6px;" @click="setThread(null)"></span> {{threadName}}</span>
            <span class="inline-block" v-if="sharedCommunities">
                <span class="flex">
                    <SideBarIcon v-for="community in sharedCommunities" :img="community[0]" :name="community[1]" :community="community" :imgCss="`avMini`" />
                </span>
            </span>
            <span class="float-right">
                <button class="text-sm mr-3" @click="toggleThreads" @mouseenter="tooltip($event.target, $t('Community.Threads'))">
                    <span class="oi oi-fork"></span>
                </button>
                <button v-if="($route.name === 'CommunityPath' && community) || $route.name === 'Group'" 
                    class="text-sm mr-3" @click="toggleSideBar" @mouseenter="tooltip($event.target, $t('Community.ToggleSidebar'))">
                    <span class="oi oi-people"></span>
                </button>
                <span v-if="route.name === 'Group' || route.name === 'CommunityGroup'">
                    <button class="text-sm mr-3" @click="toggleShareGroup" @mouseenter="tooltip($event.target, $t('Community.ShareGroup'))">
                        <span class="oi oi-share-boxed"></span>
                    </button>
                    <button class="text-sm" @click="toggleCloseGroup" @mouseenter="tooltip($event.target, $t('Community.CloseGroup'))">
                        <span class="oi oi-x align-top"></span>
                    </button>
                </span>
            </span>
            <div v-if="$route.name === 'Group' || $route.name === 'CommunityGroup' || route.name.startsWith('PrivateChat')"
                class="line-height-1" style="line-height:1;margin-top:-5px;">
                <small class="font-normal fg40">messages protected by private {{route.name.startsWith('PrivateChat')?'posting':'group'}} key</small>            
            </div>
        </div>
        
        <div ref="messages" :key="messageKey" class="grow overflow-y-scroll scrollBox" style="order:5;">
            <div class="scrollBoxContent flex flex-col pr-3">
                <div v-if="threadName !== null" :class="[valueFlipMessageBox?'flex flex-col-reverse':'flex flex-col']">
                    <button v-if="canLoadPreviousMessages" class="btn" @click="loadPrevious()">{{loadingPreviousMessages?'loading':'load previous messages'}}</button>
                    <div v-for="messageArray in displayableMessages" >
                        <div v-if="messageArray.type === 'h'" :class="[valueFlipMessageBox?'flex flex-col-reverse':'flex flex-col']">
                            <div v-for="message in messageArray">
                                <div v-if="message.getThreadName() === threadName">
                                    <hr style="margin:1px 0px;">
                                    <div :class="{'apphg2': highlight(message)}" style="padding-top: 0.5rem;padding-bottom: 0.25rem;">
                                        <Message :message="message" @action="setContentMessage" @jump="scrollIntoView"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else :class="[valueFlipMessageBox?'flex flex-col-reverse':'flex flex-col']">
                    <button v-if="canLoadPreviousMessages" class="btn" @click="loadPrevious()">{{loadingPreviousMessages?'loading':'load previous messages'}}</button>
                    <div v-for="messageArray in displayableMessages" >
                        <div v-if="messageArray.type === 'h'">
                            <small class="flex text-gray-700 cursor-pointer" style="margin-top: 0.5rem;" @click="toggleFold(messageArray)">
                                <div class="threadLine grow"></div>
                                <div @click="setThread(messageArray[0].getThreadName())">{{messageArray[0].getThreadName()}}</div>
                                <div class="flex grow">
                                    <div class="threadLine grow"></div>
                                    <div>{{messageArray.length}} thread message</div>
                                </div>
                            </small>
                            <div v-if="showFold(messageArray)" :class="[valueFlipMessageBox?'flex flex-col-reverse':'flex flex-col', 'fold']">
                                <div v-for="(message, i) in messageArray">
                                    <div v-if="(!valueFlipMessageBox && i !== 0) || (valueFlipMessageBox && i !== messageArray.length-1)" class="flex text-gray-700" style="margin:1px 0px;">
                                        <span class="hr grow"></span>
                                        <small class="cursor-pointer" @click="setThread(message.getThreadName())">{{message.getThreadName()}}</small>
                                        <span class="hr grow"></span>
                                    </div>
                                    <div :class="{'apphg2': highlight(message)}" style="padding-top: 0.5rem;padding-bottom: 0.25rem;">
                                        <Message :message="message" @action="setContentMessage" @jump="scrollIntoView"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else :class="[valueFlipMessageBox?'flex flex-col-reverse':'flex flex-col']">
                            <div v-for="(message, i) in messageArray" >
                                <hr v-if="(!valueFlipMessageBox && i !== 0) || (valueFlipMessageBox && i !== messageArray.length-1)" style="margin:1px 0px;">
                                <div :class="{'apphg2': highlight(message)}" style="padding-top: 0.5rem;padding-bottom: 0.25rem;">
                                    <Message :message="message" @action="setContentMessage" @jump="scrollIntoView"/>
                                </div>
                            </div>
                        </div>
                   </div>
                </div>
            </div>
        </div>
        
        <div :class="[valueFlipMessageBox?'flex flex-col-reverse pr-3':'flex flex-col pr-3']" 
             :style="[valueFlipMessageBox?'order:3;':'order:7;']">
            <div v-if="decodeNMessages>0">
                <hr>
                <div><small>{{$t('Community.ClickToDecodeN', decodeNMessages)}}</small></div>            
                <button class="btn" @click="decode()">{{$t('Community.Decode')}}</button>
                <button class="btn" @click="autoDecode()">{{valueAutoDecode?$t('Community.ManualDecode'):$t('Community.AutoDecode')}}</button>
            </div>
            <div v-if="contentMsg" class="border-t-1"></div>
            <div v-if="contentMsg" class="text-sm pr-3">
                <button class="float-right" @click="setContentMessage(null)"><span class="oi oi-circle-x align-top"></span></button>
                <div class="overflow-x-hidden" style="text-overflow: ellipsis;"><span class="font-bold">{{contentMsg.msg.getUser()}}:</span> {{contentMsg.text}}</div>
            </div>
            <div class="mt-1"></div>
            <div class="flex">
              <MessageBox
                ref="messageBox"
                class="grow"
                :canWrite="canWrite"
                :isLoggedIn="isLoggedIn"
                @fullorblank="updateStatus"
                @entermessage="enterMessage"
                v-focus
              ></MessageBox>
            </div>
            <div>
                <span v-if="writingUsers && writingUsers.length > 0">
                    <small class="align-top"><span v-for="user in writingUsers" class="oiMini oi" :class="user[1]"><b class="messageFontFamily">{{user[0]}}&nbsp;</b></span>
                    <span class="oiMini oi text-gray-700"><span class="messageFontFamily">{{writingUsers.length==1?'is writing':' are writing'}}</span></span>
                    </small>
                </span>
                &nbsp;
            </div>
        </div>

   </div>
 </div>
 <div v-else-if="errorMessage" class="flex h-full justify-center items-center"> 
    <div class="font-bold text-xl pl-2 py-1"><span class="oi oi-link-broken"></span> {{errorMessage}}</div> 
 </div>
 <div v-else class="flex h-full justify-center items-center">
    <div class="fg40"><i>loading</i></div>
 </div>
</template>
<script setup lang="ts">
import { useAccountStore } from "../stores/account";
import { useRoute } from "vue-router";
import { ref, nextTick } from 'vue';
const tooltip = ref(window.tooltip);
const route = useRoute();
const accountStore = useAccountStore();
const displayableMessagesFold = ref({});
const displayableMessages = ref([]);
const decodeNMessages = ref(0);
const messageKey = ref("");
const communityUsersKey = ref("#"+stlib.Utils.nextId());
const sidebar = ref(null);
const streamName = ref("");
const streamName2 = ref("");
const threadName = ref(null);
const community = ref(null);
const onlineCount = ref(null);
const communityUsers = ref({});
const messageUsers = ref({});
const sharedCommunities = ref(null);
const writingUsers = ref(null);
const messageBox = ref();
const messages = ref();
const valueFlipMessageBox = ref(false);
const valueAutoDecode = ref(false);
const canLoadPreviousMessages = ref(true);
const loadingPreviousMessages = ref(false);
const canWrite = ref(true);
const isLoggedIn = ref(true);
const showRenameGroupModal = ref(false);
const showGroupUserModal = ref(false);
const showCloseGroupModal = ref(false);
const showFlagMessageModal = ref(false);
const showDeleteMessageModal = ref(false);
const showThreadsModal = ref(false);
const showErrorModal = ref(null);
const showSidebar = ref(false);
const flagMessageRef = ref();
const deleteMessageRef = ref();
const errorMessage = ref(null);

function toggleRenameGroup() {
    showRenameGroupModal.value = !showRenameGroupModal.value;
}
function toggleShareGroup() {
    showGroupUserModal.value = !showGroupUserModal.value;
}
function toggleCloseGroup() {
    showCloseGroupModal.value = !showCloseGroupModal.value;
}
function toggleFlagMessage() {
    showFlagMessageModal.value = !showFlagMessageModal.value;
}
function toggleDeleteMessage() {
    showDeleteMessageModal.value = !showDeleteMessageModal.value;
}
function toggleThreads() {
    showThreadsModal.value = !showThreadsModal.value;
}
function toggleFold(messages, value=null) {
    if(value === null) value = !showFold(messages);
    var key = messages[0].message.getReference();
    if(value) displayableMessagesFold.value[key] = true;
    else delete displayableMessagesFold.value[key];
}
function toggleErrorModal(error=null) {
    showErrorModal.value = error;
}
function showFold(messages) {
    var key = messages[0].message.getReference();
    return displayableMessagesFold.value[key] === true;
}
function toggleSideBar() {
    var bar = sidebar.value;
    if(bar == null) return;
    var value = bar.dataset.show;
    bar.dataset.show = !("true" === value);
}
function setMessages(messages) {
    var result = [];
    var array = null;
    for(var msg of messages) {
        if(!msg || msg.isEdit || msg.isEmote() || msg.isFlag() || msg.getContent() == null) continue;
        var type = msg.isThread()?'h':'t';
        if(array === null || array.type !== type) {
            array = [];
            array.type = type;
            result.push(array);
        }
        array.push(msg);
    }
    displayableMessages.value = result;
}
async function setMessageUsers(messages) {
    const manager = getManager();
    var users = {};
    for(var msg of messages) {
        if(!msg || msg.isEdit || msg.isEmote() || msg.isFlag() || msg.getContent() == null) continue;
        if(msg.isVerified()) { users[msg.getUser()] = true; }
    }
    users = await manager.readOnlineUsers(Object.keys(users));
    messageUsers.value = users;
    var online = 0, sum = 0;
    for(var user in users) { if(users[user]) online++; sum++; }
    onlineCount.value = online + ' / ' + sum;
} 
function addCommunityName(community, streamName) {
    var prepend = window.globalProperties["communityChannelNameFormat"];
    if(prepend == null || prepend === '') return '';
    prepend = prepend.replaceAll("<name>", streamName);
    prepend = prepend.replaceAll("<account>", community.getName());
    prepend = prepend.replaceAll("<title>", community.getTitle());
    return prepend;
}
function scrollIntoView(ref=null) {
    if(!ref) return;
    var ref2 = '|'+ref;
    var container = messages.value;
    if(container) { 
        var list = container.getElementsByClassName("message");
        for(var i in list) {
            var item = list[i];
            if(item && item.dataset) {
                var reference = item.dataset.reference;
                if(reference) {
                    if(ref === reference || reference.endsWith(ref2)) {
                        item.scrollIntoView();
                        return true;
                    }
                }
            }
        }
    }
    return false;
}
var scrollReference = "mirafun|1682964273503";
var isGroupOwner = false;
var lastRead0 = 0;
var groupId = ref(null);
function highlight(message) {
    var user = accountStore.account.name;
    if(user == null || message.getTimestamp() <= lastRead0) return false;
    var mentions = message.message.getMentions();
    return mentions && mentions.indexOf(user) !== -1;
} 
async function initChat() {
    var user = accountStore.account.name;
    var user2 = route.params.user;
    if(user2 == null || user2 == "") return;
    var query = route.query;
    if(query && query.j) scrollReference = query.j;

    const manager = getManager();
    manager.setUser(user);
    if(user == null) isLoggedIn.value = false;

    var community0 = null;
    var conversation = getConversation(); 
    var updateOnlineUsers = null;
    var usersFromMessages = false;
    if(conversation != null) {
        manager.setConversation(conversation);
        try {
            stlib.Utils.verifyPermissions(user, null, conversation).then((value)=>{
                canWrite.value = value;
            });
        }
        catch(e) { console.log(e); }
        var _lastRead = manager.getLastRead(conversation);
        if(_lastRead) lastRead0 = _lastRead.timestamp;
        if(route.name === 'CommunityPath') {
            manager.setSelectedCommunityPage(user2, route.path);

            community0 = await stlib.Community.load(user2);
            console.log("CommunityPath ", user2, community0);
            var stream = (community0)?community0.findTextStreamById(''+route.params.path):null;
            streamName.value = addCommunityName(community0, (stream?stream.getName():conversation));
            community.value = community0;

            updateOnlineUsers = async ()=> {
                var users = await manager.readOnlineUsersCommunity(community0);
                if(manager.selectedConversation != conversation) return;
                var roles = ['owner', 'admin', 'mod', 'member'];
                var usersCategories = [];
                for(var role of roles) 
                    if(users.role[role] != null && users.role[role].length > 0) usersCategories.push([role, users.role[role]]);
                for(var title in users.title)
                    if(users.title[title].length > 0)
                        usersCategories.push([title, users.title[title]]);
                if(users.online.length > 0)
                    usersCategories.push(['online', users.online]);
                var onlineCountMap = {};
                var _onlineCount = 0;
                for(var categories of usersCategories)
                    for(var categoryUser of categories[1])
                        if(categoryUser[3] && !onlineCountMap[categoryUser[0]]) {
                            onlineCountMap[categoryUser[0]] = true; 
                            _onlineCount++;
                        }
                onlineCount.value = _onlineCount + ' / ' + community0.communityData.subscribers;
                for(var role in users.role)
                    if(roles.indexOf(role) === -1 && users.role[role].length > 0)
                        usersCategories.push([role, users.role[role]]);
                communityUsers.value = usersCategories;
            };
            updateOnlineUsers();
        }
        else if(route.name === 'CommunityGroup') {
            var communityPath = route.params.community;
            manager.setSelectedCommunityPage(communityPath, route.path);
            community0 = await stlib.Community.load(communityPath);

            var pref = await stlib.Utils.getAccountPreferences(user2);
            var groups = pref.getGroups();
            var group = groups[route.params.path];
            if(group == null) {
                errorMessage.value = "Group not found.";
                return;
            }
            if(group.name != null) {
                streamName.value = addCommunityName(community0, group.name);
                //streamName2.value = conversation;
            }
            else {
                streamName.value = addCommunityName(community0, conversation);
            }
        }
        else if(route.name === 'Group') {
            var pref = await stlib.Utils.getAccountPreferences(user2);
            var groups = pref.getGroups();
            var group = groups[route.params.path];
            if(group == null) {
                errorMessage.value = "Group not found.";
                return;
            }
            if(group.name != null) {
                streamName.value = group.name;
                //streamName2.value = conversation;
            }
            else {
                streamName.value = conversation;
            }
            isGroupOwner = user === user2;
            groupId.value = conversation;
            usersFromMessages = true;
            updateOnlineUsers = async ()=> {
                messageUsers.value = await manager.readOnlineUsers(Object.keys(messageUsers.value));
            };
        }
        else if(route.name.startsWith('PrivateChat')) {
            streamName.value = conversation.replaceAll("|"," | ");
            sharedCommunities.value = await findSharedCommunities(conversation);
        }

        var updateMessages = async () => {
            var container = messages.value;
            var scrollToBottom = !valueFlipMessageBox.value;
            var scrollTop = 0;
            if(container) { 
                scrollToBottom = isAtScrollBottom(container); 
                scrollTop = container.scrollTop;
            }
            var data = await manager.getSelectedConversations();
            if(data == null || manager.selectedConversation != conversation) return null;
            data.messages.sort((a,b)=>a.getTimestamp()-b.getTimestamp());
            setMessages(data.messages);
            if(usersFromMessages) setMessageUsers(data.messages);
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
                if(container) { 
                    container.scrollTop = scrollToBottom?container.scrollHeight:scrollTop;
                    if(scrollReference) {
                        if(scrollIntoView(scrollReference)) scrollReference = null;
                    }
                }
            });
            return data;
        };
        var prefs = await manager.getPreferences() || stlib.Content.preferences();
        valueFlipMessageBox.value = prefs.getValueBoolean("flipMessageBox", false);
        var isAutoDecode = prefs.getValueBoolean("autoDecode", false);
        valueAutoDecode.value = isAutoDecode;
        var data = await updateMessages();
        if(data) canLoadPreviousMessages.value = data.maxTime > 0;

        manager.setCallback("Community.vue", updateMessages);

        var updateStatus = async (e)=>{
            if(e[1] === '$online') {
                if(updateOnlineUsers) {
                    await updateOnlineUsers();
                    communityUsersKey.value = "#"+stlib.Utils.nextId();
                }
            }
            else {
                var array = manager.getSelectedWritingUsers();
                if(array == null || array.length === 0) writingUsers.value = null;
                else {
                    var users = [];
                    for(var user of array) {
                        var roleCss = '';
                        if(community0 !== null) {
                            var role = community0.getRole(user);
                            var icon = {"owner":"oi-globe", "admin":"oi-cog", "mod":"oi-flag"};
                            if(role === "owner" || role === "admin" || role === "mod") 
                                roleCss = `${icon[role]} color${role}`;
                        }
                        users.push([user, roleCss]);
                    }
                    writingUsers.value = users;
                }
            }
        };
        manager.onstatusmessage.set("Community.vue", updateStatus);

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
    return shared;
}
function focusMessageBox() {
    if(messageBox.value != null) 
        messageBox.value.focus();
}
initChat();
function setThread(name, element) {
    if(name === null && threadName.value == null) {
        if(window.showStreambar != null &&
            (route.name !== 'Group' && !route.name.startsWith('PrivateChat') ||
            window.globalProperties["sidebarToggleByChannelNameOnDirectGroup"])) {
            if(window.showStreambarDirectMessages) window.showStreambarDirectMessages(false);
            window.toggleStreambar();
        }
        else if(route.name === 'Group' && element && groupId.value != null) {
            var options = [
                ["Add Group Member", toggleShareGroup],
                [isGroupOwner?"Close Group":"Leave Group", toggleCloseGroup],
            ];
            if(isGroupOwner) options.unshift(["Edit Group Name", toggleRenameGroup]);
            window.menu(element, options, groupId.value, true);
        }
    }
    else {
        threadName.value = name;
        nextTick(async () => {
            var container = messages.value;
            if(container) container.scrollTop = container.scrollHeight;
        });
    }
}
const contentMsg = ref(null);
async function setContentMessage(obj) {
    if(obj == null) {
        var val = contentMsg.value; //clear message field if closing edit action
        if(val && val.type === stlib.Content.Edit.TYPE) messageBox.value.setText("");
        contentMsg.value = null;
        focusMessageBox();
        return;
    }
    if(obj.type === stlib.Content.Emote.TYPE) {
        await enterMessage(obj.text, obj, false, false);
        return;
    }
    if(obj.type === 'flag') {
        flagMessageRef.value = obj.msg;
        toggleFlagMessage();
        focusMessageBox();
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
window.setContentMessage = setContentMessage;
function getConversation() {
    var user = accountStore.account.name;
    var user2 = route.params.user;

    //if(user == null) return null; //TODO ask to login
    if(user2 == null || user2 == "") return null;
    var conversation = null;
    if(route.name === 'CommunityPath') {
        conversation = user2+'/'+route.params.path;
    }
    else if(route.name === 'Group') {
        conversation = '#'+user2+'/'+route.params.path;
    }
    else if(route.name === 'CommunityGroup') {
        conversation = '#'+user2+'/'+route.params.path;
    }
    else if(route.name.startsWith('PrivateChat')) {
        if(user == null) return null; //TODO ask to login
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
async function addMentions(mentions, text, community) {
    if(community == null) return;
    if(text == null || typeof text !== 'string') return;    
    var words = text.trim().split(/[ ]+/);
    for(var word of words) {
        if(word === '@*' || word === '@everyone') {
            var role = await stlib.Utils.getRole(community, getManager().user);
            if(stlib.PermissionSet.roleToIndex(role) >= 5) 
                mentions[community+'/*'] = true;
        }
        else if(word.startsWith('@')) {
            var username = word.substring(1);
            if(stlib.Utils.isValidGuestName(username)) mentions[username] = true;
        }
    }
}
const decode = async ()=>{ await getManager().decodeSelectedConversations(); };
var sendingMessage = null;
const enterMessage = async (message, contentMessage=null, block=true, clearBox=true, onsuccess=null) => {
    var msgObj = message!=null?message:contentMessage;  
    if(block && sendingMessage == msgObj) return;
    var result = null;
    try {
        if(block) sendingMessage = msgObj;
        var conversation = getConversation();
        if(conversation == null) return;
        var thread = threadName.value;

        var mentions = {};
        var communityUsername = stlib.Utils.isCommunityConversation(conversation)?
            stlib.Utils.getConversationUsername(conversation):null;
        
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
                    mentions[contentMessage.msg.message.getUser()] = true;             
                    await addMentions(mentions, message, communityUsername);                
                break;
                case stlib.Content.Edit.TYPE:
                    var editContent = contentMessage.msg.getContent().copy();
                    editContent.setText(message);
                    textMsg = stlib.Content.edit(editContent, contentMessage.msg.message);
                    await addMentions(mentions, message, communityUsername);
                break;
                case stlib.Content.Images.TYPE:
                    textMsg = stlib.Content.images(...contentMessage.images);
                break;
            }
        }
        //var mentions = null;
       // message.isCommunityConversation()

        if(textMsg === null) { 
            textMsg = stlib.Content.text(message);
            await addMentions(mentions, message, communityUsername);
        }
        if(thread !== null) textMsg = stlib.Content.thread(thread, textMsg);

        var mentionsArray = Object.keys(mentions);
        if(mentionsArray.length === 0) mentionsArray = null;
        
        result = await manager.sendMessage(textMsg, conversation, mentionsArray);
        if(result.isSuccess()) {
            if(clearBox) messageBox.value.setText("");
            if(contentMsg.value !== null) contentMsg.value = null;
        }
        else { 
            toggleErrorModal(result.getError());
        }
    }
    catch(e) {
        console.log("error sending message: ", e);
        var errMsg = e + "\n";
        if(e.stack != null) {
            var stackMsg = e.stack+"";
            if(stackMsg.length > 500) stackMsg = stackMsg.substring(0, 500);
            errMsg += stackMsg;
        }
        toggleErrorModal(errMsg);
    }
    finally { 
        if(block) sendingMessage = null;
        if(onsuccess !== null && result !== null && result.isSuccess()) onsuccess();
    }
};
async function updateStatus(writing) {
    var manager = getManager();
    var conversation = manager.selectedConversation;
    if(conversation != null && conversation.length > 0 && conversation[0] === '#') return;
    await manager.setSelectedOnlineStatus(writing);
}
function isAtScrollBottom(e) {
    return e.scrollTop + e.clientHeight + 150 >= e.scrollHeight;
}
function roleCss(role) {
    var icon = {"owner":"oi-home", "admin":"oi-cog", "mod":"oi-flag"};
    if(role === "owner" || role === "admin" || role === "mod")
        return `oiMini oi ${icon[role]} color${role}`;
    return '';
}
async function loadPrevious() {
    if(loadingPreviousMessages.value === true) return;
    try {
        loadingPreviousMessages.value = true;
        const manager = getManager();
        var data = await manager.getPreviousConversations();
        if(data) canLoadPreviousMessages.value = data.maxTime > 0;
    }
    finally {
        loadingPreviousMessages.value = false;
    }
}
/*app.router.beforeEach(async (to, from, next) => {
    await initChat();
    next();
});*/
</script>
<style scoped>
.sidebar {
    display: block;
}
.sidebar[data-show="true"] {
    display: none;
}
@media (max-width: 767px) {
    .sidebar {
        display: none;
        position: fixed;
        z-index: 7;
        top: 20px;
        right: 0px;
    }
    .sidebar[data-show="true"] {
        display: block;
    }
}
.fold {
  padding-left: 10px;
  padding-bottom: 10px;
  border-left: 3px dotted #bababa;    
  border-bottom: 3px dotted #bababa;    
  margin-bottom: 0.5rem; 
}
.hr {
  height: 1px;
  align-self: center;
  border-top: 1px solid #bababa;
  margin-top: 1px;
}
.threadLine {
  height: 1px;
  align-self: center;
  border-top: 3px dotted #bababa;
  margin-top: 1px;
}
.streamName2 { opacity: 0.3;}
.streamName2:hover { opacity: 0.7; }
.offline {
    opacity: 0.5;
}
.lockColor {
    color: var(--appbgbtn1);
    vertical-align: top;
    margin-top: 1px;
}
.lineIcon {
  @apply pr-1;
  vertical-align: top;
  margin-top: 2px;
  font-size:13px;
}
</style>
