<template>
  <DefaultModal>
    <div class="flex" v-if='communityData'>
        <div class="flex-shrink-0 mr-5px">
            <img
            class="rounded-full" style="width:128px; height: 128px; "
            :src="`https://images.hive.blog/u/${communityData.getName()}/avatar/medium`"
            alt="@"
            />
        </div>
        <div class="grow" style="margin-top:-7px;">
            <div class="flex justify-between">
                <small>C/{{communityData.getName()}}</small>
                <small>{{communityData.communityData.subscribers}} <span class="oi oi-people"></span></small>
            </div>
            <h1 class="text-xl font-bold">{{communityData.getTitle()}}</h1>
            <p>{{communityData.getAbout()}}</p>
        </div>
    </div>
    <div class="mt-2">
        <!--<router-link :to="`/p/${user}`"><span class="btn" ><span class="oi oi-chat text-sm"></span> Message</span></router-link>--> 
        <button class="btn"><span class="oi oi-people text-sm"></span> Join</button>
    </div>
    <div class="mt-1"><small>{{updateMessage}}</small></div>
  </DefaultModal>
</template>

<script setup lang="ts">
const props = defineProps<{
    community: String
}>();
var communityData = ref(null);
var updateMessage = ref("");
//var role = ref(null);
//var titles = ref(null);

//var editable = ref(false);
/*var roleSet = ref(new stlib.PermissionSet());
async function saveChanges() {
    if(roleSet.value.role != role.value) await setRole(roleSet.value.role);
    var titleToSet = roleSet.value.titles.join(",");
    var titles2 = titles.value==null?'':titles.value.join(",");
    if(titleToSet != titles2) await setTitle(titleToSet);
    editable.value = false;
}
function discardChanges() {
    editable.value = false;
}
function toggleEditable() {
    roleSet.value.setRole(role.value);
    roleSet.value.titles = stlib.Utils.copy(titles.value);
    editable.value = true;
}
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
}*/
async function init() {
    //bridge.list_community_roles
    var community = props.community;
    console.log("loading modal ", community);
    if(!community) return;
    var user = props.user;
    var data = await stlib.Community.load(community);
    console.log("loaded ", data);
    if(data) {
        communityData.value = data;
    }
    /*if(user && data) {
        role.value = data.getRole(user);
        titles.value = data.getTitles(user);
        communityData.value = data;
    }*/
}
init();
</script>
