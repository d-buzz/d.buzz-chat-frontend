<template>
  <div class="flex min-h-full h-screen">   
    <div class="grow">
        <router-view></router-view>
        <!--<router-view :key="getKey(route.path)"></router-view>-->
    </div>
  </div>
</template>
<script setup>
const route = useRoute();
function getKey(path) {
    return path + stlib.Utils.nextId();
}
</script>
