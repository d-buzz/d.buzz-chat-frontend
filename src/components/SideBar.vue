<template>
  <div
    class="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-primary text-secondary shadow-lg overflow-x-scroll"
  >
    <SideBarLoginIcon />
    <hr class="mt-1 mb-1" />
    <SideBarIcon v-for="account in accounts" class="mt-1 mb-1" :img="account" />
  </div>
</template>
<script setup>
let accounts = [
  "mirafun",
  "igormuba",
  "jarvie",
  "asgarth",
  "yozen",
  "mozzie5",
  "blocktrades",
  "gtg",
  "ausbitbank",
  "steempeak",
  "good-karma",
  "arcange",
  "yabapmatt",
  "therealwolf",
];
</script>
