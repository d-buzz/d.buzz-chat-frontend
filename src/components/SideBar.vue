<template>
  <div class="h-screen m-0 flex flex-col shadow-lg overflow-y-scroll border-r-1"
        style="overflow-x: clip;">
    <div class="border-b-1">
        <SideBarLoginIcon :number="number" />
    </div>
    <div>
        <button class="w-full avCommunity md:hidden border-r-1" style="padding-left: 1px;"
             @click="$emit('toggleStreambar')"><span class="oi oi-menu" style="font-size:30px;"></span></button>
    </div>    
    <div :key="updateKey">
      <SideBarIcon v-for="community in communities" :img="community[0]" :name="community[1]" :community="community" :number="community.lastReadNumber"  />
    </div>
  </div>
</template>
<script setup>
import { useAccountStore } from "../stores/account";
const emit = defineEmits(["toggleStreambar"]);
const accountStore = useAccountStore();
const communities = ref([]);
const updateKey = ref("");
const number = ref('0');
async function initCommunities() {
    var user = accountStore.account.name;
    if(user == null) return;
    var manager = getManager();
    manager.setUser(user);
    manager.joinGroups();
    communities.value = await manager.getCommunities();
    updateKey.value = ''+stlib.Utils.nextId();
    var update = async () => {
        number.value = ''+await manager.getLastReadTotal();
        for(var community of communities.value) 
            community.lastReadNumber = ''+ await manager.getLastReadCommunity(community[0]);
        updateKey.value = ''+stlib.Utils.nextId();
    };
    await update();
    manager.setCallback("SideBar.vue", update);
}
initCommunities();
</script>
