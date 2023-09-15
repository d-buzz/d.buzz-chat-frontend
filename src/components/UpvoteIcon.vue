<template>
    <span class="apphg2 inline-block border rounded-md border-default2 pl-1 pr-1 mr-1"
        :class="canRespond()?'cursor-pointer':''" @click.prevent.stop="action($event)"
        @mouseenter="tooltip($event.target, users.join(', '))"> 
        <small class="font-bold align-text-bottom" >
            <div class="icon">
                <span class="oi oi-arrow-thick-top"></span>
            </div> {{users.length}}
        </small>
    </span>
</template>
<script setup>
import { useAccountStore } from "../stores/account";
const tooltip = ref(window.tooltip);
const accountStore = useAccountStore();
const account = accountStore.account.name;
const emit = defineEmits(["action"]);
const props = defineProps({
    users: Array
});
function canRespond() {
    return props.users.indexOf(account) === -1;
}
function action(event) {
    if(canRespond()) emit('action', event);
}
</script>
<style scoped>
.icon {
    @apply inline-block;
    font-size:85%; 
    position: relative;
    top: -1px;
}
</style>
