<template>
  <div class="flex items-center justify-start">
    <div class="flex-shrink-0 p-1" :class="{selected: $route.params.user == img}">
        <router-link :to="`/i/${img}/about`">
            <img
            class="rounded-full avCommunity"
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
<style scoped>
.selected { 
    @apply rounded;
    background: rgba(255,255,255,0.37);
}
</style>
