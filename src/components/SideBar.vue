<template>
  <div class="h-screen m-0 flex flex-col bg-primary text-secondary shadow-lg overflow-y-scroll border-r-1"
        style="overflow-x: clip;">
    <div class="pt-1 pr-1 pl-1 pb-1 border-b-1">
        <SideBarLoginIcon :number="number" />
    </div>
    
      <SideBarIcon v-for="community in communities" :img="community[0]" :name="community[1]" :community="community" :key="updateKey" />
    
  </div>
</template>
<script setup>
import { useAccountStore } from "../stores/account";
const accountStore = useAccountStore();
const communities = ref([]);
const updateKey = ref("");
const number = ref(0);
async function initCommunities() {
    var user = accountStore.account.name;
    if(user == null) return;
    var manager = getManager();
    manager.setUser(user);
    communities.value = await manager.getCommunities();
    updateKey.value = ''+stlib.Utils.nextId();
    var update = async() => {
        number.value = ''+await manager.getLastReadTotal();
    };
    await update();
    manager.setCallback("SideBar.vue", update);
}
initCommunities();
</script>
