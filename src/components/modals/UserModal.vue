<template>
  <DefaultModal>
    <div class="flex">
        <div class="flex-shrink-0 mr-5px">
            <img
            class="rounded-full"
            :src="`https://images.hive.blog/u/${user}/avatar/medium`"
            alt="@"
            />
        </div>
        <div class="grow" style="margin-top:-7px;">
            <b class="text-lg">{{user}}</b>
        </div>
    </div>
    <div class="mt-2">
        <a class="btn" :href="`/p/${user}`"><span class="oi oi-chat text-sm"></span> Message</a> 
        <a class="btn" :href="`https://peakd.com/@${user}`" target="_blank" rel="noreferrer noopener"><span class="oi oi-external-link text-sm"></span> Blog</a>
    </div>
  </DefaultModal>
</template>

<script setup lang="ts">
const props = defineProps<{
    user: String
}>();
</script>
