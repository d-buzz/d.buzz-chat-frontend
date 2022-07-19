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
            <div v-if="message.getContent()">
                <div v-if="message.getContent().getType() == 'x'">
                    <button class="bg-primary text-white font-bold py-1 px-2 rounded-full" v-on:click="decrypt(message)">Click to decrypt</button>
                </div>
                <div v-else-if="message.getContent().getText">
                    {{message.getContent().getText()}}
                </div>
                <div v-else>
                    Unsupported message type.
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
  message: Object,
});
const decrypt = async function(message) {
    console.log("decrypt");
    console.log(message);
};
</script>
