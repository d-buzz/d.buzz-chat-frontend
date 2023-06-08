<template>
  <div class="flex min-h-full h-screen appbg2 appfg2" :key="updateKey">
    <div class="h-screen flex flex-col appbg0 appfg0 border-r-1 sidebar" :data-show="globalProperties.showSidebar">
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
const router = useRouter();
const updateKey = ref('#'+stlib.Utils.nextId());
const globalProperties = ref(window.globalProperties);
const streamBar = ref(null);
const streambarDirectMessages = ref(true);
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
window.navigate = navigate;
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
