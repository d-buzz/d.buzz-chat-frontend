<template>

    <div class="min-h-full flex flex-col justify-center" style="align-items:center;" v-if='community'>
        <div class="max-w-md w-md border border-gray-300 rounded-md p-3 bg-white">
            <div class="flex">
                <div class="flex-shrink-0 mr-5px">
                    <img
                    class="rounded-full"
                    :src="`https://images.hive.blog/u/${community.getName()}/avatar/medium`"
                    alt="@"
                    />
                </div>
                <div class="grow" style="margin-top:-7px;">
                    <div class="flex justify-between">
                        <small>C/{{community.getName()}}</small>
                        <small>{{community.communityData.subscribers}} <span class="oi oi-people"></span></small>
                    </div>
                    <h1 class="text-xl font-bold">{{community.getTitle()}}</h1>
                    <p>{{community.getAbout()}}</p>
                </div>
            </div>
            <hr>
            <div class="mt-2">
                <a class="btn" href="/controlpanel">Open</a>
                <a class="btn" href="/controlpanel">Join</a>
            </div>
        </div>    
    </div>


   
</template>
<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
const community = ref(null);
async function initInfo() {
    var user2 = route.params.user;
    if(user2 == null || user2 == "") return;
    community.value = await stlib.Community.load(user2);
    console.log(community.value);
}
initInfo();
</script>
