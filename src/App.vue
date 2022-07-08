<template>
  <div class="flex min-h-full h-screen">
    <div class="h-screen flex flex-col bg-primary text-secondary shadow-lg mr-3">
      <SideBar></SideBar>
    </div>
    <div class="grow">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup></script>
