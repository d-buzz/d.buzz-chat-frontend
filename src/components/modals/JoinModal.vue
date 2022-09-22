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
        <button class="btn" @click="visitCommunity(community)"><span class="oi oi-globe text-sm"></span> Visit</button>
        <button class="btn" @click="join(!joinedCommunity)"><span class="oi oi-people text-sm"></span> {{joinedCommunity?'Leave':'Join'}}</button>
    </div>
    <div class="mt-1"><small>{{updateMessage}}</small></div>
  </DefaultModal>
</template>

<script setup lang="ts">
const router = useRouter();
const props = defineProps<{
    community: String
}>();
var communityData = ref(null);
var joinedCommunity = ref(false);
var updateMessage = ref("");

async function join(joinOrLeave=true) {
    var user = getManager().user;
    var community = props.community;
    if(!community || !user) return;
    var json = [joinOrLeave?"subscribe":"unsubscribe", { community }];
    updateMessage.value = "";
    
    var p = stlib.Utils.queueKeychain((keychain, resolve, error)=>{
        keychain.requestCustomJson(user, "community", "Posting",
         JSON.stringify(json), json[0] + " " + community, (result)=>{
            if(result.success) resolve(result.result);
            else error(result);
        });
    });
    try {
        await p;
        updateMessage.value="Succesfully " + (joinOrLeave?"joined.":"left.");
    } catch(e) {
        updateMessage.value="Error: " + e.error;
        console.log(e);
    }
}
function visitCommunity(community) {
    const manager = getManager();
    router.push(manager.getSelectedCommunityPage(community, `/i/${community}/about`));
}
function hasJoinedCommunity(communities, community) {
    for(var item of communities)
        if(item[0] === community) return true;
    return false;
}
async function init() {
    //bridge.list_community_roles
    var community = props.community;
    console.log("loading modal ", community);
    if(!community) return;
    var manager = getManager();
    var user = props.user;
    var data = await stlib.Community.load(community);
    console.log("loaded ", data);
    if(data) {
        communityData.value = data;
        var communities = await manager.getCommunities(user);
        console.log("communities ", communities, hasJoinedCommunity(communities, community));
        joinedCommunity.value = hasJoinedCommunity(communities, community);
    }
    /*if(user && data) {
        role.value = data.getRole(user);
        titles.value = data.getTitles(user);
        communityData.value = data;
    }*/
}
init();
</script>
