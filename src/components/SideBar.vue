<template>
  <div class="h-screen m-0 flex flex-col bg-primary text-secondary shadow-lg overflow-y-scroll border-r-1">
    <div class="pr-1 pl-1">
        <SideBarLoginIcon/>
    </div>

    <hr class="mt-1 mb-1" />
    
      <SideBarIcon v-for="community in messageStore.communities" class="mt-1 mb-1 pr-2 pl-2" :img="community[0]" />
    
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
    messageStore.loadCommunities(user);
}
initCommunities();
</script>
