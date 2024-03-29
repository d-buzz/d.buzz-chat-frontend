<template>
  <TransitionRoot :show="addCommunityModal">
    <AddCommunityModal @close="toggleAddCommunityModal(false)"></AddCommunityModal>
  </TransitionRoot>
  <div>
    <SideBarLoginIcon :number="number" @toggleStreambar="$emit('toggleStreambar')" />
  </div>
  <!--<div>
    <button class="w-full avCommunity md:hidden" style="padding-left: 1px" @click="$emit('toggleStreambar')">
      <span class="oi oi-menu" style="font-size: 30px"></span>
    </button>
  </div>-->
  <div class="h-screen m-0 shadow-lg overflow-y-scroll scrollBox hideScrollbar" style="overflow-x: clip; width: 72px; align-items: center;" @dragover.prevent @drop.stop.prevent="onDrop">
    <div class="scrollBoxContent flex flex-col" style="width: 72px; align-items: center;">
      <TextIcon v-if="addButton === 1" class="p-1 cursor-pointer" :text="'+'" @click.stop="toggleAddCommunityModal" />
      <Draggable v-model="communities" :key="updateKey">
        <template v-slot:item="{ item }">
          <SideBarIcon :img="item[0]" :name="item[1]" :community="item" :number="item.lastReadNumber" @toggleStreambar="$emit('toggleStreambar')" />
        </template>
      </Draggable>
      <TextIcon v-if="addButton === 2" class="p-1 cursor-pointer" :text="'+'" @click.stop="toggleAddCommunityModal" />
      <div style="height: 60px"></div>
    </div>
  </div>

  <div class="mt-4 text-center">
    <p class="text-md mb-4 font-bold text-gray-200">v{{ appVersion }}</p>
  </div>
</template>

<script setup>
import Draggable from "vue3-draggable";
import { nextTick } from "vue";
import { useAccountStore } from "../stores/account";
const $t = app.config.globalProperties.$t;
const emit = defineEmits(["toggleStreambar"]);
const accountStore = useAccountStore();
const communities = ref([]);
const updateKey = ref("");
const number = ref("0");
const addButton = ref(globalProperties.onlyPrependCommunities ? -1 : window.globalProperties["sidebarAddButton"]);

const addCommunityModal = ref(false);
const toggleAddCommunityModal = () => {
  addCommunityModal.value = !addCommunityModal.value;
};

function onDrop() {
  setTimeout(() => {
    var list = [];
    for (var a of communities.value) list.push(a[0]);
    getManager().storeCommunitySortOrderLocally(list);
  }, 1000);
}
function setTitle(communityMessages, directGroupMessages) {
  var str = "";
  if (communityMessages !== 0 || directGroupMessages !== 0) {
    str += "(";
    if (communityMessages !== 0) str += communityMessages;
    if (directGroupMessages !== 0) str += ":" + directGroupMessages;
    str += ") ";
  }
  str += $t("App.Title");
  document.title = str;
  window.sendNotificationsUpdate({community: communityMessages, group: directGroupMessages});
}
async function initCommunities() {
  var user = accountStore.account.name;
  var manager = getManager();
  if(user != null) {
    manager.setUser(user);
    manager.joinGroups();
  }
  var _communities = globalProperties.onlyPrependCommunities ? [] : await manager.getCommunitiesSorted();
  {
    var tmp = {};
    for (var community of _communities) tmp[community[0]] = true;
    var prepend = globalProperties.prependCommunities;
    if (prepend && prepend.length > 0) {
      for (var name of prepend) {
        if (tmp[name] === true) continue;
        var data = await stlib.Community.load(name);
        if (data) _communities.unshift([name, data.getTitle()]);
      }
    }
  }
  communities.value = _communities;
  updateKey.value = "" + stlib.Utils.nextId();
  if (user == null) return;
  nextTick(async() => { 
    await manager.joinCommunities(_communities);
    var update = async () => {
    var totalCommunities = 0;
    for (var community of communities.value) {
      var lastReadNumber = await manager.getLastReadCommunity(community[0]);
      if (lastReadNumber != null && lastReadNumber != "0") {
        totalCommunities += Number(lastReadNumber.endsWith("+") ? lastReadNumber.substring(0, lastReadNumber.length - 1) : lastReadNumber);
      }
      community.lastReadNumber = lastReadNumber;
    }
    updateKey.value = "" + stlib.Utils.nextId();
    nextTick(async () => {
      var directGroupTotal = await manager.getLastReadTotal();
      setTitle(totalCommunities, directGroupTotal);
      number.value = "" + directGroupTotal;
      updateKey.value = "" + stlib.Utils.nextId();
    });
    };
    await update();
    manager.setCallback("SideBar.vue", update);
    manager.onlastread.set("SideBar.vue", update);
  });
}
async function init() {
  await initCommunities();
  getManager().oncommunityhide.set("SideBar.vue", initCommunities);
}
init();

const appVersion = import.meta.env.VITE_APP_VERSION;
</script>
