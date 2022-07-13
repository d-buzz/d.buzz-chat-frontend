<template>
  <div class="h-screen m-0 flex flex-col bg-primary text-secondary shadow-lg overflow-y-scroll border-r-1 pr-1 pl-1">
    
    Direct Messages
    <hr class="mt-1 mb-1" />
  </div>
</template>
<script setup>
import { useAccountStore } from "../stores/account";
import { useMessageStore } from "../stores/messages";
const accountStore = useAccountStore();
const messageStore = useMessageStore();
function initCommunities() {
    var user = accountStore.account.name;
    if(user == null) return;
    
}

</script>
