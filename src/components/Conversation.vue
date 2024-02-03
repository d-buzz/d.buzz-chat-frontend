<template>
    <TransitionRoot :show="showRenameGroupModal">
        <RenameGroupModal :conversation="conversation" @close="toggleRenameGroup"></RenameGroupModal>
    </TransitionRoot>
    <TransitionRoot :show="showGroupUserModal">
        <AddGroupUserModal :conversation="conversation" @close="toggleShareGroup"></AddGroupUserModal>
    </TransitionRoot>
    <TransitionRoot :show="showCloseGroupModal">
        <CloseGroupModal :conversation="conversation" @close="toggleCloseGroup"></CloseGroupModal>
    </TransitionRoot>
    <router-link :to="`${link}`">
        <div v-if="compact" @click.right.prevent.stop="clickOnMsg($event.target)" class="nameParent style relative" :class="{selected0: $route.path == link}">
             <!--<small class="name"><b>{{users}}</b></small>-->
            <small v-if="number && number != '0'" class="number2"><b>{{number}}</b></small>
            <div class="relative" style="padding: 4px;" @mouseenter="tooltip($event.target, `${users}\n${conversation}`)">
                <!--<small v-if="isGroup" class="groupIcon"><span class="oi oi-people"></span></small>-->
                <div v-if="usersArray" class="groupIcon3" style="max-width: 42px;padding-left:1px">
                    <div>
                        <UserIcon :name="usersArray[0]" imgCss="avMini"/>   
                        <UserIcon :name="usersArray[1]" imgCss="avMini"/>       
                    </div>                
                    <div>
                        <UserIcon :name="usersArray[2]" imgCss="avMini"/>   
                        <UserIcon v-if="usersArray.length > 3" :name="usersArray[3]" imgCss="avMini"/>       
                    </div> 
                </div>
                <UserIcon v-else-if="iconUsername || letterIcon" :name="iconUsername" :group="isGroup"
                    :letterIcon="letterIcon" :imgCss="'avCommunity'+(isGroup?' avGroup':'')"/>           
            </div>
        </div>
        <div v-else class="flex style p3" @click.right.prevent.stop="clickOnMsg($event.target)" :class="{selected: $route.path == link}"
            @mouseenter="tooltip($event.target, `${users}\n${conversation}`)">
            <div v-if="usersArray" class="groupIcon3 mr-5px" style="max-width: 42px;padding-left:1px">
                <div>
                    <UserIcon :name="usersArray[0]" imgCss="avMini"/>   
                    <UserIcon :name="usersArray[1]" imgCss="avMini"/>       
                </div>                
                <div>
                    <UserIcon :name="usersArray[2]" imgCss="avMini"/>   
                    <UserIcon v-if="usersArray.length > 3" :name="usersArray[3]" imgCss="avMini"/>       
                </div> 
            </div>
            <div v-else class="flex-shrink-0 mr-5px relative">
                <UserIcon v-if="iconUsername || letterIcon" :name="iconUsername" :group="isGroup"
                    :letterIcon="letterIcon" :imgCss="'avConversation'+(isGroup?' avGroup':'')"/>
            </div>
            <div class="grow flex items-center"> 
                <div :class="(usersArray || isGroup)?'text-sm':''">{{users}}</div>
            </div>
            <div v-if="number && number != '0'"> 
                <small class="number"><b>{{number}}</b></small>
            </div>    
        </div>
    </router-link>
</template>
<script setup type="ts">
import { useAccountStore } from "../stores/account";
const tooltip = ref(window.tooltip);
const accountStore = useAccountStore();
const props = defineProps({
    id: Number,
    username: String,
    conversation: String,
    number: String,
    compact: { type: Boolean, value: false}
});
const showRenameGroupModal = ref(false);
const showGroupUserModal = ref(false);
const showCloseGroupModal = ref(false);

function toggleRenameGroup() {
    showRenameGroupModal.value = !showRenameGroupModal.value;
}
function toggleShareGroup() {
    showGroupUserModal.value = !showGroupUserModal.value;
}
function toggleCloseGroup() {
    showCloseGroupModal.value = !showCloseGroupModal.value;
}
function clickOnMsg(event) {
    if(!stlib.Utils.isJoinableGroupConversation(props.conversation)) return;
    var user = accountStore.account.name;
    var isGroupOwner = user === props.username;
    var options = [
        ["Add Group Member", toggleShareGroup, "oi-people"],
        [isGroupOwner?"Close Group":"Leave Group", toggleCloseGroup, "oi-x"],
    ];
    if(isGroupOwner) options.unshift(["Edit Group Name", toggleRenameGroup, "oi-pencil"]);
    window.menu(event, options);
}
const isGroup = ref(false);
const link = ref("");
const iconUsername = ref("");
const letterIcon = ref(null);
const users = ref("");
const usersArray = ref(null);
async function initConversation() {
    var username = props.username;
    var conversation = props.conversation;
    if(conversation === undefined) {
        iconUsername.value = props.username;
        users.value = props.username;
        link.value = '/p/'+props.username;
    }
    else if(conversation.startsWith('#')) {
        var id = props.id;

        var pref = await stlib.Utils.getAccountPreferences(props.username);
        var groups = pref.getGroups();
        var group = groups[id];

        var groupName = (group !== null && group.name != null)?`${group.name}`:conversation;

        isGroup.value = true;
        iconUsername.value = null;
        letterIcon.value = groupName.substring(0,Math.min(groupName.length, 7));
        users.value = groupName;
        link.value = '/g/'+conversation.substring(1);
    }
    else {
        var list = conversation.split('|');
        var i = list.indexOf(props.username);
        var iconIndex = i!=0?0:1;
        if(iconIndex < list.length) iconUsername.value = list[iconIndex];
        for(var j = 0; j < list.length; j++) {
            if(j == i) continue;
            link.value += (link.value.length>0?'/':'')+list[j];
        }
        users.value = link.value.replaceAll('/', ', ');
        if(list.length > 2) usersArray.value = list; 
        link.value = '/p/'+link.value;
    }
}
initConversation();
</script>
<style scoped>
.style {
    border: 1px solid transparent;
    padding: 3px;
}
.p3 { padding:3px; }
.selected, .selected0 { 
    @apply rounded;
    /*background: linear-gradient(rgba(255,255,255,0.25), rgba(0,0,0,0.1));*/
    /*background: rgba(255,255,255,0.37);*/
    background: #404249;
    color: white;
    border: 1px solid rgba(0,0,0,0.05);
    border-top-color: rgba(255,255,255,0.1);
}
.selected0 {
    background: var(--appsg0);
}
.number {
    display: block;
    pointer-events: none;
    color: white;
    background: var(--appbgunote);
    border-radius: 10px;
    margin-top: 5px;
    padding: 2px 4px;
    line-height: 1;
}
.number2 {
    display: block;
    position: absolute;
    pointer-events: none;
    color: white;
    z-index: 5;
    background: var(--appbgunote);
    top: 0;
    right: 0;
    margin-right: 3px;
    border-radius: 10px;
    padding: 2px 4px;
    line-height: 1;
}
.name {
    display: none;
    pointer-events: none;
    min-width: 54px;
    color: white;
}
.nameParent:hover .name{
    display: block;
    position: absolute;
    z-index: 7;
    /*background: rgba(0,0,0,0.25);*/
    /*background: rgba(227, 19, 55, 0.65);*/
    background: rgba(0, 0, 0, 0.42);
    padding: 1px;
    margin: 0;
    align-self: flex-start;
    border-radius: 3px;
}
.groupIcon, .groupIcon2 {
    @apply pr-1;
    display: block;
    position: absolute;
    bottom: 0;
    right: -3px;
    z-index: 1;
}
.groupIcon2 {
    bottom: -7px;
    right: -10px;
}
.groupIcon3 {

}
.groupIcon3 > div {
    display: flex;
    gap:3px;padding-bottom:3px;
}
</style>
