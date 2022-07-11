<template>
    <div class="inline-flex">
        <div class="flex-shrink-0">
            <img
            class="rounded-full"
            :src="`https://images.hive.blog/u/${message.user}/avatar/small`"
            alt="@"
            />
        </div>
        <div> 
            <div>{{message.user}}</div>
            <div> Message {{message.text}}</div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
  message: Object,
});
</script>
