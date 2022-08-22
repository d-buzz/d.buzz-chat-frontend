<template>
  <div class="flex min-h-full h-screen">
    <div class="h-screen flex flex-col bg-primary text-secondary shadow-lg">
        <SideBar></SideBar>
    </div>
    <div class="h-screen flex flex-col bg-primary text-secondary shadow-lg mr-3">
        <StreamBar :key="route.path"></StreamBar>
    </div>
    <div class="grow">
        <router-view :key="route.path"></router-view>
    </div>
  </div>
</template>
<script setup>
const route = useRoute();
</script>
