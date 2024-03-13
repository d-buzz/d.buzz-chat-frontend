<template>
   <DefaultModal dialogPanelCss='max-width:820px;width:auto;' showCloseButton='false'> 
        <div class="w-full text-gray-400 text-sm" style="margin-top:-18px;">
            <div class="float-right flex gap-x-1" style="margin-right:-15px;">
                <button class="btn1" @click="copyToClipboard(src)" title="copy url to clipboard"><span class="oi oi-clipboard"></span></button>
                <button class="btn1" @click="$emit('close')" title="close"><span class="oi oi-x"></span></button>
            </div>
        </div>
        <img class="" style="max-width: fit-content;" :src="imageProxy(src)" :title="src"> 

     <div class="text-right" style="margin-bottom:-16px;margin-top:3px;">
        <a class="btn" :href="src" target="_blank" rel="nofollow noopener" :title="`open ${src}`"><span class="oi oi-external-link"></span> open original</a>
        <button class="btn" @click="$emit('close')" title="close">close</button>
     </div>
   </DefaultModal>          
</template>

<script setup lang="ts">
const emit = defineEmits([]);
const props = defineProps<{
    src: String
}>();
function imageProxy(url) { return window.imageProxy(url); }
function copyToClipboard(text: string) {
    if(navigator.clipboard) {
        navigator.clipboard.writeText(text) 
    }
}
</script>
