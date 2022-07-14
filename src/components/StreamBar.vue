<template>
  <div class="h-screen m-0 flex flex-col bg-primary text-secondary shadow-lg overflow-y-scroll border-r-1 pr-1 pl-1 w-200">
    
    <b class="border-b-1">Direct Messages</b>

    <Conversation v-for="conversation in messageStore.conversations" :conversation="conversation" :username="username"/>
  
  </div>
</template>
<script setup>
import { useAccountStore } from "../stores/account";
import { useMessageStore } from "../stores/messages";
const accountStore = useAccountStore();
const messageStore = useMessageStore();
const username = accountStore.account.name;
function initConversations() {
    if(username == null) return;
    messageStore.loadConversations(username);
}
initConversations();
</script>
