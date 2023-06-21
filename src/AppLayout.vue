<template>
  <AddEmoteModal ref="AddEmoteDiv" @oninput="addEmoteOnInput" @close="showModal('AddEmote', false)"></AddEmoteModal>
  <div class="flex min-h-full h-screen appbg2 appfg2" :key="updateKey">
    <div class="h-screen flex flex-col appbg0 appfg0 border-r-1 sidebar" 
      ref="sidebar" :data-show="globalProperties.showSidebar">
      <SideBar2 v-if="globalProperties.sidebar === 2" @toggleStreambar="toggleStreambar()"></SideBar2>
      <SideBar v-else @toggleStreambar="toggleStreambar()"></SideBar>
    </div>
    <div class="flex flex-col appbg1 appfg1 border-r-1" 
        :class="globalProperties.streambarExpand?'streambar':'streambar2'" ref="streamBar">
      <StreamBar :showDirectMessages="streambarDirectMessages" :key="getKey(route.path)"></StreamBar>
    </div>
    <div class="grow" @click="hideStreambar()">
      <router-view :key="getKey(route.path)"></router-view>
    </div>
  </div>
</template>
<script setup>
const AddEmoteDiv = ref();
const modals = {
  "AddEmote": false
};
const modalDiv = {
  "AddEmoteDiv": AddEmoteDiv
}
function addEmoteOnInput(emote) { modals['AddEmote'].oninput(emote); }
function showModal(name, values) {
  var modal = modalDiv[name+'Div'];
  if(modal === undefined || modal.value == null) {
    console.log("warning, unknown modal: ", name, modal);
    return;
  }
  if(values === false) { 
    modals[name] = false;
    modal.value.close();
  }
  else {
    modals[name] = values;
    modal.value.open();
  }
}
const router = useRouter();
const updateKey = ref('#'+stlib.Utils.nextId());
const globalProperties = ref(window.globalProperties);
const sidebar = ref();
;const streamBar = ref(null);
const streambarDirectMessages = ref(false);
const route = useRoute();
function getKey(path) {
  return path + stlib.Utils.nextId();
}
function toggleStreambar() {
  var value = streamBar.value.dataset.show;
  streamBar.value.dataset.show = !("true" === value);
}
function showStreambar(visible=true) {
  streamBar.value.dataset.show = visible;
}
function hideStreambar() {
  streamBar.value.dataset.show = false;
}
function showStreambarDirectMessages(direct=true) {
  streambarDirectMessages.value = direct;
}
function navigate(url) {
  router.push(url);
}
nextTick(()=>{
  var pos = {x: 0};
  window.onswipe.set("AppLayout.ts", (s)=>{ 
    var element = sidebar.value;
    if(s === true) {
        pos.x = pos.x > -element.clientWidth*0.5?0:-element.clientWidth;
    }
    else pos.x = Math.max(-element.clientWidth, Math.min(0, pos.x+s));
    element.style.marginLeft = pos.x+'px';
  });
});
window.navigate = navigate;
window.showModal = showModal;
window.showStreambar = showStreambar;
window.showStreambarDirectMessages = showStreambarDirectMessages;
window.toggleStreambar = toggleStreambar;
window.refreshApp = ()=>{ updateKey.value = '#'+stlib.Utils.nextId(); }; //debug purpose
</script>
<style scoped>
.sidebar[data-show="false"] {
  display: none;
}
@media (max-width: 767px) {
  .streambar {
    display: none;
    position: fixed;
    z-index: 7;
    left: 63px;
    top: 23px;
    border-top: 1px solid #0000002e;
    border-bottom: 1px solid #0000002e;
    padding-bottom: 20px;
  }
  .streambar[data-show="true"] {
    display: block;
  }
}
.streambar2 {
  display: none;
  position: fixed;
  z-index: 7;
  left: 63px;
  top: 23px;
  border-top: 1px solid #0000002e;
  border-bottom: 1px solid #0000002e;
  padding-bottom: 20px;
}
.streambar2[data-show="true"] {
  display: block;
}
</style>
