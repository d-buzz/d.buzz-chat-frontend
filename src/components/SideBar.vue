<template>
    <TransitionRoot :show="addCommunityModal">
        <AddCommunityModal @close="toggleAddCommunityModal(false)"></AddCommunityModal>
    </TransitionRoot>
    <div>
        <SideBarLoginIcon :number="number" @toggleStreambar="$emit('toggleStreambar')"/>
    </div>
    <div>
        <button class="w-full avCommunity md:hidden" style="padding-left: 1px;"
             @click="$emit('toggleStreambar')"><span class="oi oi-menu" style="font-size:30px;"></span></button>
    </div>
  <div class="h-screen m-0 shadow-lg overflow-y-scroll scrollBox"
        style="overflow-x: clip;" @dragover.prevent @drop.stop.prevent="onDrop">
    <div class="scrollBoxContent flex flex-col">
        <TextIcon v-if="addButton === 1" class="p-1 cursor-pointer" :text="'+'" @click.stop="toggleAddCommunityModal"/>
        <Draggable v-model="communities" :key="updateKey">
            <template v-slot:item="{item}">
              <SideBarIcon :img="item[0]" :name="item[1]"
                 :community="item" :number="item.lastReadNumber" @toggleStreambar="$emit('toggleStreambar')" />
            </template>
        </Draggable>
        <TextIcon v-if="addButton === 2" class="p-1 cursor-pointer" :text="'+'" @click.stop="toggleAddCommunityModal"/>
        <div style="height:60px;"></div>    
    </div>
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
const addButton = ref(window.globalProperties["sidebarAddButton"]);

const addCommunityModal = ref(false);
const toggleAddCommunityModal = () => {
    addCommunityModal.value = !addCommunityModal.value;
};

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
    var _communities = await manager.getCommunitiesSorted();
    {
        var tmp = {};
        for(var community of _communities) tmp[community[0]] = true;
        var prepend = globalProperties.prependCommunities;
        if(prepend && prepend.length > 0) {
            for(var name of prepend) {
                if(tmp[name] === true) continue;
                var data = await stlib.Community.load(name);
                if(data) _communities.unshift([name, data.getTitle()]);
            }
        }
    }
    communities.value = _communities;
    updateKey.value = ''+stlib.Utils.nextId();
    var update = async () => { console.log("total");
        for(var community of communities.value) {
            var lastReadNumber = await manager.getLastReadCommunity(community[0]);
            community.lastReadNumber = lastReadNumber;
        }
        updateKey.value = ''+stlib.Utils.nextId();
        nextTick(async ()=>{            
            number.value = ''+await manager.getLastReadTotal();
            updateKey.value = ''+stlib.Utils.nextId();
        });
    };
    await update();
    manager.setCallback("SideBar.vue", update);
    manager.onlastread.set("SideBar.vue", update);
}
async function init() {
    await initCommunities();
    getManager().oncommunityhide.set("SideBar.vue", initCommunities);
}
init();
</script>
