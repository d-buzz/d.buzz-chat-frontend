<template>
    <div class="flex pt-2">
        <div class="flex-shrink-0 mr-5px">
            <img
            class="rounded-full avMessage"
            :src="`https://images.hive.blog/u/${message.getUser()}/avatar/small`"
            alt="@"
            />
        </div>
        <div style="margin-top:-7px;"> 
            <div><small><b>{{message.getUser()}}</b></small></div>
            <div v-if="message.getContent()">{{message.getContent().getText()}}</div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
  message: Object,
});
</script>
