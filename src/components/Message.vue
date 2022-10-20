<template>
    <TransitionRoot :show="newUserMessageModalOpen">
        <NewUserMessageModal :selectedTab="2" :data="joinData" @close="toggleNewUserMessageModalOpen(false)"></NewUserMessageModal>
    </TransitionRoot>
    <TransitionRoot :show="newViewEditHistoryModalOpen">
        <ViewEditHistoryModal :msg="message" @close="toggleViewEditHistoryModal"></ViewEditHistoryModal>
    </TransitionRoot>
    <TransitionRoot :show="showImageViewModal">
        <ImageViewModal :src="imageViewSrc" @close="toggleImageViewModal"></ImageViewModal>
    </TransitionRoot>
    <TransitionRoot :show="showAddEmoteModal">
        <AddEmoteModal @oninput="emoteAction" @close="toggleAddEmoteModal"></AddEmoteModal>
    </TransitionRoot>
    <div v-if="hasQuotedText(message)" class="flex mb-1">
        <!--<img
            @click.right.prevent.stop="clickOnIcon($event)"
            class="rounded-full avMini"
            :src="`https://images.hive.blog/u/${message.reference.getUser()}/avatar/small`"
            alt="@"
            />-->

        <UserCommunityIcon :name="message.reference.getUser()" :community="message.getCommunity()" 
                  :imgCss="`avMini`"/>
        <small class="pl-1"><b :class="roleReferenceColor?roleReferenceColor:''">{{message.reference.getUser()}}</b> {{getQuotedText(message)}}</small>
    </div>
    <div class="message flex" :data-verified="message.isVerified()">
        <div class="flex-shrink-0 mr-5px">

            <UserCommunityIcon :name="message.getUser()" :community="message.getCommunity()"/>

            <vue-simple-context-menu
              :element-id="msgMenuId"
              v-if="!displayOnly"
              :options="msgMenuOptions"
              ref="msgMenu"
              @option-clicked="clickOnMsgOption"
            />
        </div>
        <div class="grow relative" style="margin-top:-7px;" @click.right.prevent.stop="clickOnMsg($event)"> 
            <div>
                <small :class="roleColor?roleColor:''"><b>{{message.getUser()}}</b></small>
                <span class="pr-2 float-right fg70">
                    <small v-if="!displayEdits && message.edits && message.edits.length > 0" class="cursor-pointer" :title="toAbsoluteTimeString(message.edits[0].getTimestamp())" @click="toggleViewEditHistoryModal()">(edited {{toRelativeTimeString(message.edits[0].getTimestamp())}}) </small>
                    <small :title="toAbsoluteTimeString(message.getTimestamp())">{{toRelativeTimeString(message.getTimestamp())}}</small>
                    <span v-if="!message.isVerified()" class="pl-1">&#10008;</span>
                </span>
            </div>
            <div v-if="!displayOnly" class="visibleOnHover absolute float-right" style="right: 8px;">
                <div class="flex">
                    <span class="btn0 bg1" @click="toggleAddEmoteModal" ><span class="oi oi-heart"></span></span>
                    <span class="btn0 bg2" @click="quoteAction" title="Quote, select text to quote part of message."><span class="oi oi-share"></span></span>
                    <span v-if="account===message.getUser()" class="btn0 bg3" @click="editAction" title="Edit message."><span class="oi oi-pencil"></span></span>
                    <span v-if="account===message.getUser()" class="btn0 bg4" @click="deleteAction" title="Delete message."><span class="oi oi-trash"></span></span>
                </div>
            </div>
            <div v-if="content">
                <div v-if="content.getType() == 'x'">
                    <button class="bg-primary text-white font-bold py-1 px-2 rounded-full" v-on:click="decrypt(message)">Click to decrypt</button>
                </div>
                <div v-if="content.getType() == 'i'" class="flex gap-x-1">
                    <span v-for="i in content.length()">
                        <img :src="`https://images.hive.blog/768x0/${content.getImage(i-1)}`" class="imgBorder cursor-pointer" @click="toggleImageViewModal(content.getImage(i-1))"> 
                    </span>
                </div>
                <div v-else-if="content.getType() == 'g'" class="border border-solid border-green-700 rounded p-1">
                    <small>{{content.getGroup()}}</small>
                    <div ref="messageText" class="whitespace-pre-wrap">{{content.getText()}}</div>
                    <button class="btn" v-on:click="join(message)">Join</button>
                </div>
                <div v-else-if="content.getText" class="whitespace-pre-wrap">
                    <div ref="messageText">{{content.getText()}}</div>
                </div>
                <div v-else>
                    Unsupported message type.
                </div>
                <div v-if="message.emotes">
                    <span v-for="emote in message.emotes" class="border rounded-md border-gray-400 pl-1 pr-1 mr-1">
                        <span v-if="emote.users.indexOf(account) === -1">                        
                            <small class="font-bold align-text-bottom cursor-pointer" @click="emoteAction(emote.emote)">{{emote.users.length}}</small> {{emote.emote}}
                        </span>         
                        <span v-else>
                            <small class="font-bold align-text-bottom">{{emote.users.length}}</small> {{emote.emote}}
                        </span>           
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup type="ts">
import { useAccountStore } from "../stores/account";
import { ref, nextTick } from 'vue'
import VueSimpleContextMenu from 'vue-simple-context-menu';
const accountStore = useAccountStore();
const account = accountStore.account.name;
const emit = defineEmits(["quote", "action"]);
const msgMenuId = 'msgMenuId'+stlib.Utils.nextId();
const props = defineProps({
  message: Object,
  displayOnly: Boolean,
  displayEdits: Boolean
});
const roleColor = ref(null);
const roleReferenceColor = ref(null);
function initContent() {
    var content = null; 
    if(props.message) {
        if(props.displayEdits && props.message.editContent)
            content = props.message.editContent;
        else {
            if(props.displayEdits) 
                content = props.message.content;
            else content = props.message.getContent();
        }
        if(content instanceof stlib.Content.Thread)
            content = content.getContent();
    }
    return content;
}
const content = ref(initContent());
const joinData = ref(null);
const newUserMessageModalOpen = ref(false);
const newViewEditHistoryModalOpen = ref(false);
const showImageViewModal = ref(false);
const showAddEmoteModal = ref(false);
const imageViewSrc = ref("");
const showUserModal = ref(false);
const userRef = ref();
const toggleNewUserMessageModalOpen = () => {
  newUserMessageModalOpen.value = !newUserMessageModalOpen.value;
};    
const toggleViewEditHistoryModal = () => {
  newViewEditHistoryModalOpen.value = !newViewEditHistoryModalOpen.value;
};
const toggleAddEmoteModal = () => {
  showAddEmoteModal.value = !showAddEmoteModal.value;
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
/*message menu*/
const msgMenuOptions = ref([/*{name:"emote"},*/{name:"quote"},{name:"edit"},{name:"delete"}]);
const msgMenuOptions2 = ref([/*{name:"emote"},*/{name:"quote"}]);
const msgMenu = ref(null);
function clickOnMsg(event) { msgMenu.value.showMenu(event, "item"); }
function clickOnMsgOption(item) {
    switch(item.option.name) {
        case "quote":
            quoteAction();
            break;
        case "edit":
            editAction();
            break;
        case "delete":
            deleteAction();
            break;
    }
}
function emoteAction(emote) {
    emit("action", {
        msg: props.message,
        type: stlib.Content.Emote.TYPE,
        text: emote});
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
function toRelativeTimeString(ti) {
    ti = stlib.Utils.utcTime()-ti;
	var d = Math.floor(ti/86400000); ti -= d*86400000;  
	var h = Math.floor(ti/3600000); ti -= h*3600000;
	var m = Math.floor(ti/60000);
	var str = null;
	if(d > 0) str = `${d}d ${h}h ${m}m`;
	else if(h > 0) str = `${h}h ${m}m`;
	else str = `${m}m`;
	return str;
}
async function init() {
    var message = props.message;
    console.log("message ", message);
    if(!message) return;
    var community = message.getCommunity();
    console.log("community ", community);
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
.message { background-color: lightsalmon; }
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

