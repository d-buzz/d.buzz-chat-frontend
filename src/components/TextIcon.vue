<template>
    <div class="relative">
        <div class="textIcon iconborder" :class="`${css}`">
            <span>{{text}}</span>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    text: String,
    css: {type: String, default: 'avCommunity'},
});
</script>
<style scoped>
.textIcon {
    @apply flex justify-center content-center rounded-full text-center;
    font-style: italic;
}
.iconborder {
    @apply border border-solid rounded-full;
    border-color: #0003;
}
.textIcon span { align-self: center; margin-top: -2px; }
</style>
