<template>
  <div class="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-primary text-secondary shadow-lg overflow-x-scroll">
    <SideBar></SideBar>
  </div>
  <div class="ml-16">
    <router-view></router-view>
  </div>
</template>
<script setup></script>
