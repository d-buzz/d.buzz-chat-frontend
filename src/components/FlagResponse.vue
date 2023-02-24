<template>
    <span class="apphg2 inline-block border rounded-md border-default2 pl-1 pr-1 mr-1"
        @mouseenter="tooltip($event.target, reason)"> 
        <small class="font-bold align-text-bottom" >{{flagsNum}} <span class="oi oi-flag"></span></small> 
    </span>                       
</template>
<script setup>
import { useAccountStore } from "../stores/account";
const tooltip = ref(window.tooltip);
const accountStore = useAccountStore();
const account = accountStore.account.name;
const emit = defineEmits(["action"]);
const props = defineProps({
    flagsNum: Number,
    reason: String,
    message: Object
});
function canRespond() {
    var message = props.message;
    if(!message) return true;
    var flags = message.flags;
    if(flags) 
        for(var flag of flags) 
            if(flag.user === account) 
                return false; 
    return true;
}
</script>
<style scoped>
.flagCol { 
    color: var(--appfgbtn2);
    background: var(--appbgbtn2);
}
</style>
