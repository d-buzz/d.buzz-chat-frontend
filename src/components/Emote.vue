<template>
    <div v-if="emote.startsWith('https://')" class="emote"><img class="inline-block"
        :src="`https://images.hive.blog/30x30/${emote}`">
    </div>
    <span v-else>{{emote}}</span>
</template>
<script setup>
const props = defineProps({
    emote: String
});
</script>
<style scoped>
.emote {
  display: inline-block;  
  padding-top: 2px;
  padding-bottom: 2px;
}
.emote img {
  max-width: 100%; height: auto;
}
</style>
