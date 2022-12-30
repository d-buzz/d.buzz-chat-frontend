<template>
    <div>
        <SideBarLoginIcon :number="number" @toggleStreambar="$emit('toggleStreambar')"/>
    </div>
    <div class="border-b-1">
        <button class="w-full avCommunity md:hidden border-r-1" style="padding-left: 1px;"
             @click="$emit('toggleStreambar')"><span class="oi oi-menu" style="font-size:30px;"></span></button>
    </div>    
  <div class="h-screen m-0 flex flex-col shadow-lg overflow-y-scroll border-r-1"
        style="overflow-x: clip;" @dragover.prevent @drop.stop.prevent="onDrop">
    <Draggable v-model="communities" :key="updateKey">
        <template v-slot:item="{item}">
          <SideBarIcon :img="item[0]" :name="item[1]"
             :community="item" :number="item.lastReadNumber" @toggleStreambar="$emit('toggleStreambar')" />
        </template>
    </Draggable>
  </div>
</template>
<script setup>
import Draggable from "vue3-draggable";
import { nextTick } from 'vue';
import { useAccountStore } from "../stores/account";
const emit = defineEmits(["toggleStreambar"]);
const accountStore = useAccountStore();
const communities = ref([]);
const updateKey = ref("");
const number = ref('0');

function onDrop() {
    setTimeout(() => {
        var list = [];
        for(var a of communities.value)
            list.push(a[0]);
        getManager().storeCommunitySortOrderLocally(list);
    }, 1000);
}
async function initCommunities() {
    var user = accountStore.account.name;
    if(user == null) return;
    var manager = getManager();
    manager.setUser(user);
    manager.joinGroups();
    communities.value = await manager.getCommunitiesSorted();
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
