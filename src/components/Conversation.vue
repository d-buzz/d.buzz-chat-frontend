<template>
    <router-link :to="`${link}`">
        <div v-if="compact" class="nameParent relative" :class="{selected0: $route.path == link}">
             <!--<small class="name"><b>{{users}}</b></small>-->
            <small v-if="number && number != '0'" class="number2"><b>{{number}}</b></small>
            <div class="p-1" @mouseenter="tooltip(this.$el, `${users}\n${conversation}`)">
                <UserIcon v-if="iconUsername" :name="iconUsername" imgCss="avCommunity"/>
            </div>
        </div>
        <div v-else class="flex style" :class="{selected: $route.path == link}">
            <div class="flex-shrink-0 mr-5px">
                <!--<img
                class="rounded-full avConversation"
                :src="`https://images.hive.blog/u/${iconUsername}/avatar/small`"
                alt="@"
                />-->
                <UserIcon v-if="iconUsername" :name="iconUsername" imgCss="avConversation"/>
            </div>
            <div class="grow"> 
                <div>{{users}}</div>
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
const link = ref("");
const iconUsername = ref("");
const users = ref("");
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

        iconUsername.value = props.username;
        users.value = (group !== null && group.name != null)?`${group.name} (${id})`:conversation;
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
        link.value = '/p/'+link.value;
    }
}
initConversation();
</script>
<style scoped>
.style {
    border: 1px solid transparent;
    padding:3px;
}
.selected, .selected0 { 
    @apply rounded;
    /*background: linear-gradient(rgba(255,255,255,0.25), rgba(0,0,0,0.1));*/
    /*background: rgba(255,255,255,0.37);*/
    background: var(--appsg1);
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
    background: rgb(0, 113, 12);
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
    background: rgb(0, 113, 12);
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
</style>
