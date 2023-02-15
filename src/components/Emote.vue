<template>
    <img v-if="emote.startsWith('https://')" class="inline-block"
        :src="`https://images.hive.blog/20x0/${emote}`" width="20">
    <span v-else>{{emote}}</span>
</template>
<script setup>
const props = defineProps({
    emote: String
});
</script>
