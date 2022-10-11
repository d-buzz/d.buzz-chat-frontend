<template>
  <div class="flex min-h-full h-screen appbg2">
    <div class="h-screen flex flex-col appbg0 text-secondary shadow-lg">
        <SideBar></SideBar>
    </div>
    <div class="h-screen flex flex-col appbg1 text-secondary shadow-lg mr-3">
        <StreamBar :key="getKey(route.path)"></StreamBar>
    </div>
    <div class="grow">
        <router-view :key="getKey(route.path)"></router-view>
    </div>
  </div>
</template>
<script setup>
const route = useRoute();
function getKey(path) {
    return path + stlib.Utils.nextId();
}
</script>
