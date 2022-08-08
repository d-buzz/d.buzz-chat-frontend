<template>
    <TransitionRoot :show="newUserMessageModalOpen">
        <NewUserMessageModal :selectedTab="2" :data="joinData" @close="toggleNewUserMessageModalOpen(false)"></NewUserMessageModal>
    </TransitionRoot>
    <div class="message flex" style="margin-top: 0.5rem;" :data-verified="message.isVerified()">
        <div class="flex-shrink-0 mr-5px">
            <img
            class="rounded-full avMessage"
            :src="`https://images.hive.blog/u/${message.getUser()}/avatar/small`"
            alt="@"
            />
        </div>
        <div class="grow" style="margin-top:-7px;"> 
            <div>
                <small><b>{{message.getUser()}}</b></small>
                <span class="pr-2 float-right">
                    <small class="text-gray-700" :title="toAbsoluteTimeString(message.getTimestamp())">{{toRelativeTimeString(message.getTimestamp())}}</small>
                    <span v-if="!message.isVerified()" class="pl-1">&#10008;</span>
                </span>
            </div>
            <div v-if="message.getContent()">
                <div v-if="message.getContent().getType() == 'x'">
                    <button class="bg-primary text-white font-bold py-1 px-2 rounded-full" v-on:click="decrypt(message)">Click to decrypt</button>
                </div>
                <div v-if="message.getContent().getType() == 'g'" class="border border-solid border-green-700 rounded p-1">
                    <small>{{message.getContent().getGroup()}}</small>
                    <div>{{message.getContent().getText()}}</div>
                    <button class="btn" v-on:click="join(message)">Join</button>
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
<script setup type="ts">
import { ref } from 'vue'
const props = defineProps({
  message: Object,
});
const joinData = ref(null);
const newUserMessageModalOpen = ref(false);
const toggleNewUserMessageModalOpen = () => {
  newUserMessageModalOpen.value = !newUserMessageModalOpen.value;
};
const decrypt = async function(message) {
    console.log("decrypt");
    console.log(message);
};
function join(message) {
    joinData.value = message;
    newUserMessageModalOpen.value = true;
}
function toAbsoluteTimeString(ti) {
    var date = new Date(ti);
    return date.toString()+'\n'+date.toUTCString();
}
function toRelativeTimeString(ti) {
    ti = stlib.Utils.utcTime()-ti;
	var d = Math.floor(ti/86400000); ti -= d*86400000;  
	var h = Math.floor(ti/3600000); ti -= h*3600000;
	var m = Math.floor(ti/60000);
	var str = null;
	if(d > 0) str = `${d}d ${h}h ${m}m`;
	else if(h > 0) str = `${h}h ${m}m`;
	else str = `${m}m`;
	return str;
}
</script>
<style scoped>
.message { background-color: lightsalmon; }
.message[data-verified="true"] {
    background-color: white;
}
</style>



