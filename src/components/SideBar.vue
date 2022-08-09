<template>
  <div class="h-screen m-0 flex flex-col bg-primary text-secondary shadow-lg overflow-y-scroll border-r-1">
    <div class="pt-1 pr-1 pl-1 pb-1 border-b-1">
        <SideBarLoginIcon/>
    </div>
    
      <SideBarIcon v-for="community in messageStore.communities" :img="community[0]" />
    
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
