<template>
  <div class="h-screen m-0 flex flex-col bg-primary text-secondary shadow-lg overflow-y-scroll">
    <SideBarLoginIcon />

    <hr class="mt-1 mb-1" />
    <router-link to="/privatechat">
      <SideBarIcon v-for="account in accounts" class="mt-1 mb-1" :img="account" />
    </router-link>
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
