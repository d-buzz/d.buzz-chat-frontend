<template>
    <div class="inline-flex">
        <div class="flex-shrink-0">
            <img
            class="rounded-full"
            :src="`https://images.hive.blog/u/${message.getUser()}/avatar/small`"
            alt="@"
            />
        </div>
        <div> 
            <div>{{message.getUser()}} | {{message.getTimestamp()}}</div>
            <div>{{message.getContent().getText()}}</div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
  message: Object,
});
</script>
