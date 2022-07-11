<template>
  <div class="flex items-center justify-start">
    <div class="flex-shrink-0">
        <router-link :to="`/p/@${img}`">
            <img
            class="rounded-full"
            :src="`https://images.hive.blog/u/${img}/avatar/small`"
            alt="@"
            />
        </router-link>
    </div>
  </div>
</template>
<script setup>
import Login from "../assets/images/icons/login.svg";

const props = defineProps({
  img: String,
});
</script>
