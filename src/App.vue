<template>
  <div class="flex min-h-full h-screen">   
    <div class="grow">
        <router-view :key="route.path"></router-view>
    </div>
  </div>
</template>
<script setup>
const route = useRoute();
</script>
