<template>
  <DefaultModal>
    <div class="flex">
        <div class="flex-shrink-0 mr-5px">
            <img
            class="rounded-full"
            style="width:128px;height:128px;"
            :src="`https://images.hive.blog/u/${user}/avatar/medium`"
            alt="@"
            />
        </div>
        <div class="grow" style="margin-top:-7px;">
            <b class="text-lg">{{user}}</b>
            <div v-if="communityData">
                <div><b>{{role}}</b>
                <button class="btn" @click="setRole('member')">setRole</button>
                <button class="btn" @click="setTitle('title1')">setTitle</button>
                </div>
                <div><span v-for="title in titles">{{title}} </span></div>   
            </div>
        </div>
    </div>
    <div class="mt-2">
        <a class="btn" :href="`/p/${user}`"><span class="oi oi-chat text-sm"></span> Message</a> 
        <a class="btn" :href="`https://peakd.com/@${user}`" target="_blank" rel="noreferrer noopener"><span class="oi oi-external-link text-sm"></span> Blog</a>
    </div>
    <div class="mt-1"><small>{{updateMessage}}</small></div>
  </DefaultModal>
</template>

<script setup lang="ts">
const props = defineProps<{
    user: String,
    community: String
}>();
var communityData = ref(null);
var role = ref(null);
var titles = ref(null);
var updateMessage = ref("");
async function setRole(role) {
    var user = getManager().user;
    var community = props.community;
    console.log("settitle ", community, role);
    if(!community || !user) return;
    var json = ["setRole", {
		    "community": community,
		    "account": props.user, "role": role  
        }];
    updateMessage.value = "";
    
    var p = stlib.Utils.queueKeychain((keychain, resolve, error)=>{
        keychain.requestCustomJson(user, "community", "Posting",
         JSON.stringify(json), "Set Title", (result)=>{
            if(result.success) resolve(result.result);
            else error(result);
        });
    });
    try {
        await p;
        updateMessage.value="Succesfully updated.";
    } catch(e) {
        updateMessage.value="Error: " + e.error;
        console.log(e);
    }
}
async function setTitle(titles) {
    var user = getManager().user;
    var community = props.community;
    console.log("settitle ", community, titles);
    if(!community || !user) return;
    if(Array.isArray()) titles = titles.join(",");
    var json =  ["setUserTitle", {
		    "community": community,
		    "account": props.user, "title": titles
        }];
    updateMessage.value = "";
    
    var p = stlib.Utils.queueKeychain((keychain, resolve, error)=>{
        keychain.requestCustomJson(user, "community", "Posting",
         JSON.stringify(json), "Set Title", (result)=>{
            if(result.success) resolve(result.result);
            else error(result);
        });
    });
    try {
        await p;
        updateMessage.value="Succesfully updated.";
    } catch(e) {
        updateMessage.value="Error: " + e.error;
        console.log(e);
    }
}
async function init() {
    //bridge.list_community_roles
    var community = props.community;
    if(!community) return;
    var user = props.user;
    var data = await stlib.Community.load(community);
    if(user && data) {
        role.value = data.getRole(user);
        titles.value = data.getTitles(user);
        communityData.value = data;
    }
}
init();
</script>
