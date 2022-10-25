<template>
  <div class="flex min-h-full h-screen appbg2 appfg2">
    <div class="h-screen flex flex-col appbg0 appfg0 shadow-lg">
        <button class="w-full avCommunity md:hidden border-r-1" style="padding-left: 1px;"
             @click="toggleStreambar()"><span class="oi oi-menu" style="font-size:30px;"></span></button>
        <SideBar></SideBar>
    </div>
    <div class="streambar h-screen flex flex-col appbg1 appfg1 shadow-lg" ref="streamBar">
        <StreamBar :key="getKey(route.path)"></StreamBar>
    </div>
    <div class="ml-3 grow" @click="hideStreambar()">
        <router-view :key="getKey(route.path)"></router-view>
    </div>
  </div>
</template>
<script setup>
const streamBar = ref(null);
const route = useRoute();
function getKey(path) {
    return path + stlib.Utils.nextId();
}
function toggleStreambar() {
    var value = streamBar.value.dataset.show;
    streamBar.value.dataset.show = !("true" === value);
}
function hideStreambar() {
    streamBar.value.dataset.show = false;
}
</script>
<style scoped>
@media (max-width: 767px) {
    .streambar {
        display: none;
        position: fixed;
        z-index: 7;
        left: 63px;
    }
    .streambar[data-show="true"] {
        display: block;
    }
}
</style>
