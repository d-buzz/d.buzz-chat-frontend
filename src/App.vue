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
console.log(import.meta.env.VITE_APP_VERSION); // https://example.com/api

function getKey(path) {
    return path + stlib.Utils.nextId();
}

</script>
