<template>
    <TransitionRoot :show="newUserMessageModalOpen">
        <NewUserMessageModal :selectedTab="2" :data="joinData" @close="toggleNewUserMessageModalOpen(false)"></NewUserMessageModal>
    </TransitionRoot>
    <TransitionRoot :show="showUserModal">
        <UserModal @close="toggleUserModal(null)" :user="userRef" :community="message.getCommunity()"></UserModal>
    </TransitionRoot>
    <TransitionRoot :show="newViewEditHistoryModalOpen">
        <ViewEditHistoryModal :msg="message" @close="toggleViewEditHistoryModal"></ViewEditHistoryModal>
    </TransitionRoot>
    <TransitionRoot :show="showImageViewModal">
        <ImageViewModal :src="imageViewSrc" @close="toggleImageViewModal"></ImageViewModal>
    </TransitionRoot>
    <TransitionRoot :show="showHideMessagesModal">
        <HideMessagesModal :user="message.getUser()" @close="toggleHideMessagesModal"></HideMessagesModal>
    </TransitionRoot>
    <div v-if="!displayEdits && message && (message.flagsNum >= 3 || hideMessage())" class="message mesageFont" 
            style="margin-top:-5px;margin-bottom:-25px;" @click.right.prevent.stop="clickOnMsg($event)"
         :data-verified="isVerified !== false" :data-reference="messageReference()">
        <small style="margin-left:46px;opacity:0.5;" :class="roleColor?roleColor:''"><b class="messageFontFamily">{{message.getUser()}}</b></small>
        <span class="pr-2 float-right fg70">
            <small class="cursor-pointer fg70" @click="toggleViewEditHistoryModal()" @mouseenter="tooltip($event.target, 'Reason:\n'+getFlagReasons(message))">(hidden) </small>
            <small v-if="message.edits && message.edits.length > 0" class="cursor-pointer" @mouseenter="tooltip($event.target, toAbsoluteTimeString(message.edits[0].getTimestamp()))" @click="toggleViewEditHistoryModal()">(edited {{toRelativeTimeString(message.edits[0].getTimestamp())}}) </small>
            <small @mouseenter="tooltip($event.target, toRelativeTimeString(message.getTimestamp(),3)+'\n'+toAbsoluteTimeString(message.getTimestamp()))">{{toRelativeTimeString(message.getTimestamp())}}</small>
            <span v-if="isVerified === false" class="pl-1">&#10008;</span>
            <span v-if="isVerified === null" class="pl-1">&#10008;</span>
        </span>
    </div>
    <div v-else class="mesageFont">
        <div v-if="hasQuotedText(message)" class="flex mb-1" style="margin-left:23px;">
            <div class="quoteIcon"></div>
            <small class="break-word quoteText text-justify lg:text-left"><div class="float-left inline-block" style="padding-right:3px;"><UserCommunityIcon :name="message.reference.getUser()" :community="message.getCommunity()" 
                      :imgCss="`avMini`"/></div><span class="cursor-pointer" @click="jump()"><b :class="roleReferenceColor?roleReferenceColor:''" style="opacity:0.5;"><span class="messageFontFamily">{{message.reference.getUser()}}</span></b> <span>{{getQuotedText(message)}}</span></span></small>
        </div>
        <div v-if="isVerified === false" class="verifyColor pl-11 w-full text-sm font-bold pt-1 pb-2" style="line-height:1.25;"><span class="oi oi-warning"></span> <span class="">{{$t("Message.Warning")}}</span></div>
        <div class="message" :class="iconFlexClass" :data-verified="isVerified !== false" :data-reference="messageReference()">
            <div class="flex-shrink-0 mr-5px" :class="iconClass">
                <UserCommunityIcon :name="message.getUser()" :community="message.getCommunity()"/>
            </div>
            <div class="grow relative" style="margin-top:-7px;" @click.right.prevent.stop="clickOnMsg($event)"> 
                <div>
                    <small class="cursor-pointer" :class="roleColor?roleColor:''" @click="toggleUserModal(message.getUser())" ><b class="messageFontFamily">{{message.getUser()}}</b></small>
                    <span class="pr-2 float-right fg70" ref="buttons">
                        <small v-if="!displayOnly" class="messageButtons pr-3">
                            <span v-if="account!==message.getUser()" class="oi oi-arrow-thick-top col1" @click.prevent.stop="upvoteAction()" @mouseenter="tooltip($event.target, $t('Message.Upvote.Info'))"></span>                        
                            <span class="oi oi-heart col0" @click="toggleAddEmoteModal" @mouseenter="tooltip($event.target, $t('Message.AddEmote.Info'))"></span>
                            <span class="oi oi-share col1" @click="quoteAction" @mouseenter="tooltip($event.target, $t('Message.Quote.Info'))"></span>
                            <span v-if="account!==message.getUser()" class="oi oi-flag col3" @click="flagAction" @mouseenter="tooltip($event.target, $t('Message.Flag.Info'))"></span>                        
                            <span v-if="account===message.getUser()" class="oi oi-pencil col2" @click="editAction" @mouseenter="tooltip($event.target, $t('Message.Edit.Info'))"></span>
                            <span v-if="account===message.getUser()" class="oi oi-trash col3" @click="deleteAction" @mouseenter="tooltip($event.target, $t('Message.Remove.Info'))"></span>
                        </small>
                        <small v-if="!displayEdits && message.edits && message.edits.length > 0" class="cursor-pointer" @mouseenter="tooltip($event.target, toAbsoluteTimeString(message.edits[0].getTimestamp()))" @click="toggleViewEditHistoryModal()">(edited {{toRelativeTimeString(message.edits[0].getTimestamp())}}) </small>
                        <small @mouseenter="tooltip($event.target, toRelativeTimeString(message.getTimestamp(),3)+'\n'+toAbsoluteTimeString(message.getTimestamp()))">{{toRelativeTimeString(message.getTimestamp())}}</small>
                    </span>
                </div>
                <div v-if="content">
                    <div v-if="content.getType() == 'x'">
                        <button class="bg-primary text-white font-bold py-1 px-2 rounded-full" v-on:click="decrypt(message)">Click to decrypt</button>
                    </div>
                    <div v-if="content.getType() == 'i'" class="flex gap-x-1">
                        <span v-for="i in content.length()">
                            <img :src="`${imageProxy(content.getImage(i-1))}`" class="imgBorder imgLimit cursor-pointer" @click="toggleImageViewModal(content.getImage(i-1))"> 
                        </span>
                    </div>
                    <div v-else-if="content.getType() == 'g'" class="border border-solid border-green-700 rounded p-1">
                        <small>{{content.getGroup()}}</small>
                        <div ref="messageText" :data-id="formatText(messageText,content.getText())" class="md break-word"></div>
                        <small v-if="hasJoinedGroup"><b>{{$t("Message.Joined")}}</b></small>
                        <button v-else class="btn" v-on:click="join(message)">{{$t("Message.Join")}}</button>
                    </div>
                    <div v-else-if="content.getText" class="break-word">
                        <div ref="messageText" :data-id="formatText(messageText,content.getText())" class="md"></div>
                    </div>
                    <div v-else>
                        Unsupported message type.
                    </div>
                    <div>
                        <span v-if="message.emotes">
                            <span v-for="emote in message.emotes">
                                <EmoteResponse :emote="emote.emote" :users="emote.users" @action="emoteAction"/>
                            </span>
                        </span>
                        <span v-if="message.flagsNum > 0" class="float-right">
                            <FlagResponse :flagsNum="message.flagsNum" :reason="'Reason:\n'+getFlagReasons(message)" :message="message"/>
                        </span>
                    </div>
                    <div v-if="message.flagsNum >= 3">
                        <hr/>
                        <div class="fg70"><small>Reason:</small></div>
                        <small>{{getFlagReasons(message)}}</small>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</template>
<script setup type="ts">
import Upvote from './Upvote.vue'
import { useAccountStore } from "../stores/account";
import { ref, nextTick,  createVNode, render } from 'vue'
const tooltip = ref(window.tooltip);
const accountStore = useAccountStore();
const account = accountStore.account.name;
const emit = defineEmits(["quote", "action", "jump"]);
const msgMenuId = 'msgMenuId'+stlib.Utils.nextId();
const props = defineProps({
  message: Object,
  displayOnly: { type: Boolean, default: false },
  displayEdits: Boolean
});
const globalProperties = ref(window.globalProperties);
const iconFlexClass = ref(globalProperties.value['messageIconFlexClass']);  
const iconClass = ref(globalProperties.value['messageIconClass']);
const roleColor = ref(null);
const roleReferenceColor = ref(null);
const hasJoinedGroup = ref(false);
const isVerified = ref(null);
const buttons = ref();
async function hasJoinedGroupX(group) {
    const manager = getManager();
    var groups = await manager.getJoinedAndCreatedGroups();
    return groups[group] !== undefined;
}
function checkVerifyAsync(limit=5) {
    if(props.message) {
        var verified = props.message.verified;
        if(verified === null) {
            if(limit === 0) {
                isVerified.value = false;
            }
            else {
                setTimeout(()=>{
                    checkVerifyAsync(limit-1);
                }, 1000);
            }
        }
        else isVerified.value = verified;
    }
}
function initContent() {
    var content = null; 
    if(props.message) {
        checkVerifyAsync();
        if(props.displayEdits && props.message.editContent)
            content = props.message.editContent;
        else {
            if(props.displayEdits) 
                content = props.message.content;
            else content = props.message.getContent();
        }
        if(content instanceof stlib.Content.Thread)
            content = content.getContent();
        if(content instanceof stlib.Content.GroupInvite)
            hasJoinedGroupX(content.getGroup()).then((x)=>{
                hasJoinedGroup.value = x;
            });
    }
    return content;
}
function jump() {
    emit('jump', props.message.reference.message.getReference());
}
function hideMessage() {
    return props.message && getManager().readHiddenUsers()[props.message.getUser()] === true;
}
function messageReference() {
    return (props.message && props.message.message)?props.message.message.getReference():"";
}
const content = ref(initContent());
const joinData = ref(null);
const newUserMessageModalOpen = ref(false);
const newViewEditHistoryModalOpen = ref(false);
const showImageViewModal = ref(false);
const showHideMessagesModal = ref(false);
const imageViewSrc = ref("");
const showUserModal = ref(false);
const userRef = ref();
const toggleNewUserMessageModalOpen = () => {
  newUserMessageModalOpen.value = !newUserMessageModalOpen.value;
};    
const toggleViewEditHistoryModal = () => {
  newViewEditHistoryModalOpen.value = !newViewEditHistoryModalOpen.value;
};
const toggleHideMessagesModal = () => {
  showHideMessagesModal.value = !showHideMessagesModal.value;
};
const toggleImageViewModal = (src) => {
    showImageViewModal.value = !showImageViewModal.value;
    if(src) imageViewSrc.value = src;
};    
function toggleUserModal(user) {
    if(user == null) showUserModal.value = false;
    else {
        userRef.value = user;
        showUserModal.value = true;
    }
}
function toggleAddEmoteModal() {
    window.showModal('AddEmote', {oninput: (emote)=>{
        window.setContentMessage({
            msg: props.message,
            type: stlib.Content.Emote.TYPE,
            text: emote});
    }});
}
function hasQuotedText(message) {
    return message && message.getContent() && message.getContent().getType() == 'q' && message.reference && message.reference.getContent() && message.reference.getContent().getText();
}
function getQuotedText(message) {
    try {
        var text = message.reference.getContent().getText();
        var quote = message.getContent();
        var from = quote.getFrom();
        var to = quote.getTo();
        if(to === -1) {
            if(from >= 0 && from < text.length)
                return text.substring(from);
        }
        else {
            if(from >= 0 && from < text.length && from < to && to <= text.length)
                return text.substring(from, to);
        }
        return text;
    }
    catch(e) {
        console.log(e);
    }
    return null;
}
function getFlagReasons(message) {
    var flags = message.flags;
    if(!flags) return "";
    var text = "";
    for(var flag of flags)
        text += `${flag.user}: ${flag.reason}\n`;
    return text;
}
function imageProxy(url) { return window.imageProxy(url); }
function formatText(element, text) {
    if(element == null) return;
    if(text == null || typeof text !== 'string') text = "";
    element.innerHTML = "";
    stlib.Markdown.imageProxy = imageProxy;
    stlib.Markdown.simpleMarkdown(text.trim(),element);
    var imgs = element.getElementsByTagName("img");
    for(var i = 0; i < imgs.length; i++) {
        let img = imgs[i];
        img.setAttribute("class", "imgBorder imgLimit cursor-pointer");
        img.onclick = ()=>{ toggleImageViewModal(img.src); };
    }
}
/*message menu*/
const msgMenuOptions = ref([/*{name:"emote"},*/{name:"quote"},{name:"edit"},{name:"delete"}]);
const msgMenuOptions2 = ref([/*{name:"emote"},*/{name:"quote"}]);
const msgMenu = ref(null);
function clickOnMsg(event) {
    if(props.displayOnly.value) return;
    var options = [
        ["emote", toggleAddEmoteModal, "oi-heart"],
        ["quote", quoteAction, "oi-share"],
        ["copy link", copyLinkAction, "oi-clipboard"]
    ];
    if(props.message && props.message.getUser() === getManager().user) {
        options.push(["edit", editAction, "oi-heart"]);
        options.push(["delete", deleteAction, "oi-heart"]);
    }
    else {
        options.unshift(["upvote", upvoteAction, "oi-arrow-thick-top"]);
        options.push(["hide messages from user", toggleHideMessagesModal, "oi-shield"]);
        options.push(["flag message", flagAction, "oi-flag"]);
    }
    window.menu(event, options);
}
function emoteAction(emote) {
    emit("action", {
        msg: props.message,
        type: stlib.Content.Emote.TYPE,
        text: emote});
}
function upvoteAction(event=buttons.value) {
    if(props.displayOnly.value) return;
    window.upvotemenu(event, (w)=>{
        var msg = props.message;
        var parts = stlib.Utils.encodeUpvotePermlink(msg.getUser(), msg.getConversation(), msg.getTimestamp()); 
        console.log("vote", w, parts);
        //load comments X days
        //apply upvotes to displayable message
        //

        //generate permlink
        //find post if exists
        //find votes if exists  
        //create if not, set benficiary, upvote
    });
}
function flagAction() {
    emit("action", {
        msg: props.message,
        type: 'flag',
        text: 'flag message'
    });
}
const messageText = ref();
function quoteAction() {
    var msg = messageText.value;
    if(msg != null) {
        var text = msg.innerText; 
        var selected = getSelectionText();
        var i;
        if(selected == null || selected.length === 0 || (i=text.indexOf(selected))===-1) 
            emit("action", {
                msg: props.message,
                type: stlib.Content.Quote.TYPE,
                text: text, from: 0, to: -1});
        else emit("action", {
                msg: props.message,
                type: stlib.Content.Quote.TYPE,
                text: selected, from: i, to: (i+selected.length)});
    }
}
function copyLinkAction() {
    if(navigator.clipboard) {
        var conversation = props.message.getConversation();
        var link = null;
        if(stlib.Utils.isCommunityConversation(conversation)) {
            var data = stlib.Utils.parseConversation(conversation);
            var communityName = data[0];
            var commuityPath = data[1];
            if(stlib.Utils.isValidGuestName(communityName) && /[a-zA-Z0-9-_]+/.test(commuityPath)) {
                link = `/t/${communityName}/${commuityPath}?j=${props.message.message.getReference()}`;
            }
        }
        else if(stlib.Utils.isGroupConversation(conversation)) {
            var user = getManager().user;
            var users = stlib.Utils.getGroupUsernames(conversation);
            link = '/p';
            for(var user0 of users) {
                if(user0 === user) continue;
                link += '/'+user0;
            }
            link += `?j=${props.message.message.getReference()}`;
        }
        else if(stlib.Utils.isJoinableGroupConversation(conversation)) {
            link = '/g/'+conversation.substring(1);
        }
        if(link !== null) navigator.clipboard.writeText(window.location.origin+link); 
    }
}
function editAction() {
    emit("action", {
        msg: props.message,
        type: stlib.Content.Edit.TYPE,
        text: 'editing message'
    });  
}
function deleteAction() {
    emit("action", {
        msg: props.message,
        type: 'delete',
        text: 'delete message'
    }); 
}
function getSelectionText() {
    var s = null;
    if (window.getSelection) s = window.getSelection();
    else if (document.getSelection) s = document.getSelection();
    if(s == null) return null;
    return s.toString();
}
/**/
const decrypt = async function(message) {
    console.log("decrypt");
    console.log(message);
};
function join(message) {
    joinData.value = message;
    newUserMessageModalOpen.value = true;
}
function toAbsoluteTimeString(ti) {
    var date = new Date(ti);
    return date.toString()+'\n'+date.toUTCString();
}
function toRelativeTimeString(ti,maxLen=1,maxUnit='m') {
    ti = stlib.Utils.utcTime()-ti;
	var d = Math.floor(ti/86400000); ti -= d*86400000;  
	var h = Math.floor(ti/3600000); ti -= h*3600000;
	var m = Math.floor(ti/60000); ti -= m*60000;
    var s = Math.floor(ti/1000);
	var str = '';
    var format = 'dhms';
    var time = [d,h,m,s];
    for(var i = 0; i < time.length; i++) {
        if((str === '' && time[i] > 0) || str !== '' || format[i] === 'maxUnit')
            str += (str===''?'':' ')+time[i]+format[i]; 
        if(format[i] === 'maxUnit' || (str !== '' && --maxLen === 0)) break;
    }
	return str;
}
async function init() {
    var message = props.message;
    if(!message) return;
    var community = message.getCommunity();
    if(!community) return;
    var data = await stlib.Community.load(community);
    var role = data.getRole(message.getUser());
    var icon = {"owner":"oi-globe", "admin":"oi-cog", "mod":"oi-flag"};
    if(role === "owner" || role === "admin" || role === "mod") 
        roleColor.value = `oiMini oi ${icon[role]} color${role}`;
    if(hasQuotedText(message)) {
        role = data.getRole(message.reference.getUser()); 
        if(role === "owner" || role === "admin" || role === "mod")
            roleReferenceColor.value = `oiMini oi ${icon[role]} color${role}`;
    }
}
init();
</script>
<style scoped>
.messageButtons {
    opacity: 0.5;
}
.messageButtons > span {
    cursor: pointer;
    padding: 0px 10px;
    opacity: 0.55;
}
.message:hover .messageButtons {
    opacity: 1;
}
.messageButtons > span:hover {
    opacity: 1;
}
.messageButtons > .col0:hover { color: #9d212c; }
.messageButtons > .col1:hover { color: #2e8336; }
.messageButtons > .col2:hover { color: #b95914; }
.messageButtons > .col3:hover { color: #860e18; }
.quoteIcon {
    display: inline-block;
    position: relative;
    width: 25px;
    min-width: 25px;
    border-top: 2px solid var(--appfg2);
    border-left: 2px solid var(--appfg2);
    border-top-left-radius: 5px;
    opacity: 0.37;
    top: 8px;
    right: 3px;
    margin-bottom: 8px;
}
.quoteIcon::after {
    position: absolute;
    content: " ";
    background: linear-gradient(#00000000, var(--appbg2));
    width: 7px;
    height: 100%;
    margin-left:-5px;
    margin-top: 5px;
}
.quoteText {
    max-height: 4.5em;
    overflow: hidden;
}
.message, .verifyColor { background-color: lightsalmon; }
.verifyColor { color: #5b220b; }
.message[data-verified="true"] {
    background-color: unset;
}
.visibleOnHover > div {
    visibility: hidden;
}
.visibleOnHover:hover > div {
    visibility: visible;
}
.btn0 {
    border: 1px solid rgba(0,0,0,0.25);
    border-radius: 20px;
    padding: 5px;
    line-height: 0;
    display: inline-block;
    margin-left: 3px;
    color: #fffa;
    cursor: pointer;
}
.btn0:hover { 
    color: #fff;
    border-color: rgba(0,0,0,0.5);
}
.btn0 .oi { top: -1px; } 
.bg1 { background-color: #ffab83;}
.bg2 { background-color: #6aaeae;}
.bg3 { background-color: #f2dd00;}
.bg4 { background-color: #dd5169;}
.btn0 .oi-share { top: -2px; } 
.btn0 .oi-heart { top: 0px; }
.btn0 .oi-pencil { top: 0px; }
.btn0 .oi-trash { left: 1px; }
</style>

