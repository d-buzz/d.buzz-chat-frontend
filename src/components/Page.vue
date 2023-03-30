<template>
    <div class="appbg2 w-full h-full break-all overflow-scroll pt-3 pl-3 pr-3">
        <div class="text-xl font-bold">{{route.name}}</div>
        <hr>
        <Mentions v-if="route.name === 'Mentions'"/>
        <Preferences v-else-if="route.name === 'Preferences'"/>
        <Themes v-else-if="route.name === 'Themes'"/>
    </div>
</template>
<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
</script>


