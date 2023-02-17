<template>
    <span class="apphg2 inline-block border rounded-md border-default2 pl-1 pr-1 mr-1"
        :class="canRespond()?'cursor-pointer':''" @click="action()"
        @mouseenter="tooltip($event.target, users.join(', '))"> 
        <small class="font-bold align-text-bottom" >{{users.length}}</small> <Emote :emote="emote"/>
    </span>                       
</template>
<script setup>
import { useAccountStore } from "../stores/account";
const tooltip = ref(window.tooltip);
const accountStore = useAccountStore();
const account = accountStore.account.name;
const emit = defineEmits(["action"]);
const props = defineProps({
    emote: String,
    users: Array
});
function canRespond() {
    return props.users.indexOf(account) === -1;
}
function action() {
    if(canRespond()) emit('action', props.emote);
}
</script>
<style scoped>

</style>
