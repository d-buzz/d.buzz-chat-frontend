<template>
    <router-link :to="`/p/@${iconUsername}`">
        <div class="flex pt-1">
            <div class="flex-shrink-0 mr-5px">
                <img
                class="rounded-full avConversation"
                :src="`https://images.hive.blog/u/${iconUsername}/avatar/small`"
                alt="@"
                />
            </div>
            <div> 
                <div>{{users}}</div>
            </div>    
        </div>
    </router-link>
</template>
<script setup>
const props = defineProps({
    username: String,
    conversation: String,
});
var iconUsername = "";
var users = "";
function initConversation() {
    var list = props.conversation.split('|');
    var i = list.indexOf(props.username);
    var iconIndex = i!=0?0:1;
    if(iconIndex < list.length) iconUsername = list[iconIndex];
    for(var j = 0; j < list.length; j++) {
        if(j == i) continue;
        users += (users.length>0?',':'')+list[j];
    }
}
initConversation();
</script>
