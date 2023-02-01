<template>
    <div style="min-height:128px;">
        <Transition>
            <div v-if='communityData'>
                <div class="flex">
                    <div class="flex-shrink-0 mr-5px">
                        <!--<img
                        class="rounded-full" style="width:128px; height: 128px; "
                        :src="`https://images.hive.blog/u/${communityData.getName()}/avatar/medium`"
                        alt="@"
                        />-->
                        <UserIcon :name="communityData.getName()" imgCss="av128" size="medium"/>
                    </div>
                    <div class="grow" style="margin-top:-7px;">
                        <div class="flex gap-x-2 justify-between">
                            <small>C/{{communityData.getName()}}</small>
                        </div>
                        <h1 class="text-xl font-bold">{{communityData.getTitle()}}</h1>
                        <p>{{communityData.getAbout()}}</p>
                        <hr>
                        <small><span class="oi oi-people"></span> {{communityData.communityData.subscribers}}</small>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
    <div class="mt-2">
        <button v-if="showMessageButton" class="btn float-left hideButton" @click.stop="showBar()"><span class="oi oi-envelope-closed text-sm"></span> {{$t('JoinModalContent.Message')}}</button>
        <button v-if="!hideVisitButton && !addedCommunity" class="btn" 
            @click="addCommunity(community)"
            @mouseenter="tooltip($event.target, $t('JoinModalContent.Add.Tooltip'))"><span class="oi oi-plus text-sm"></span> {{$t('JoinModalContent.Add')}}</button>        
        <button v-if="!hideVisitButton" class="btn" 
            @click="visitCommunity(community)"
            @mouseenter="tooltip($event.target, $t('JoinModalContent.Visit.Tooltip'))"><span class="oi oi-globe text-sm"></span> {{$t('JoinModalContent.Visit')}}</button>
        <button class="btn" @click="join(!joinedCommunity)"
            @mouseenter="tooltip($event.target, $t(joinedCommunity?'JoinModalContent.Leave.Tooltip':'JoinModalContent.Join.Tooltip'))"><span class="oi oi-people text-sm"></span> {{$t(joinedCommunity?'JoinModalContent.Leave':'JoinModalContent.Join')}}</button>
    </div>
    <div class="mt-1"><small>{{updateMessage}}</small></div>
</template>

<script setup lang="ts">
const tooltip = ref(window.tooltip);
const router = useRouter();
const props = defineProps({
    community: String,
    hideVisitButton: Boolean,
    showMessageButton: {type: Boolean, default: false }
});
var communityData = ref(null);
var addedCommunity = ref(false);
var joinedCommunity = ref(false);
var updateMessage = ref("");

async function join(joinOrLeave=true) {
    const manager = getManager();
    var user = manager.user;
    var community = props.community;
    if(!community || !user) return;
    updateMessage.value = "";

    if(stlib.Utils.isGuest(user)) {
        var preferences = await manager.getPreferences();
        preferences.setCommunity(community, joinOrLeave);
        var result = await manager.updatePreferences(preferences);
        if(result.isSuccess()) updateMessage.value = "Succesfully " + (joinOrLeave?"joined.":"left.");
        else updateMessage.value = "Error: " + result.getError();
    }
    else {
        var json = [joinOrLeave?"subscribe":"unsubscribe", { community }];
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
}
function showBar() {
    if(window.showStreambar)
        window.showStreambar(true);
}
function addCommunity(community) {
    const manager = getManager();
    manager.addCommunity(community, true);
    addedCommunity.value = true;
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
<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.hideButton {
    display: none;
}
@media (max-width: 767px) {
    .hideButton {
        display: block;
    }
}
</style>
