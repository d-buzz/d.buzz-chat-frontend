<template>
   <DefaultModal :title="$t('AddCommunityModal.Title')">
     <div :key="updateKey">
        <hr v-if="shown.length > 0">
        <div v-if="shown.length > 0" class="text-gray-700 text-sm">{{$t("AddCommunityModal.Msg.Add")}}</div>
        <div class="flex flex-row flex-wrap">
            <span v-for="community in shown" @click="hideCommunity(community[0], true)">
                <CommunityIcon :fade="false" :joinModal="false" :img="community[0]" :name="community[1]" :number="''" />
            </span>
        </div>
        <hr>
        <div v-if="hidden.length > 0" class="text-gray-700 text-sm">{{$t("AddCommunityModal.Msg.Remove")}}</div>
        <div class="flex flex-row flex-wrap" :key="updateKey">
            <span v-for="community in hidden" @click="hideCommunity(community[0], false)">
                <CommunityIcon :fade="true" :joinModal="false" :img="community[0]" :name="community[1]" :number="''" />
            </span>
        </div>
    </div>

    <!--<TabGroup>
        <TabList class="tab">
            <Tab>{{$t("AddCommunityModal.Add")}}</Tab>
            <Tab>{{$t("AddCommunityModal.Remove")}}</Tab>
        </TabList>
        <TabPanels class="mt-1">
            <TabPanel>
                <div class="flex flex-row flex-wrap" :key="updateKey">
                    <span v-for="community in shown" @click.prevent.stop="hideCommunity(community[0], true)">
                        <CommunityIcon :fade="false" :img="community[0]" :name="community[1]" :number="''" />
                    </span>
                </div>
            </TabPanel>
            <TabPanel>
                <div class="flex flex-row flex-wrap" :key="updateKey">
                    <span v-for="community in hidden" @click.prevent.stop="hideCommunity(community[0], false)">
                        <CommunityIcon :fade="true" :img="community[0]" :name="community[1]" :number="''" />
                    </span>
                </div>
            </TabPanel>
        </TabPanels>
    </TabGroup>-->
    
    <div class="display-block flex mt-3 mr-auto ml-auto" style="max-width:350px;">
        <input class="inputText1 mr-1" type="text" v-model="searchBar"
            placeholder="find communties"
            @keyup.enter="findCommunities(searchBar)"/>
        <button title="find communities" class="btn1 mr-1" @click="findCommunities(searchBar)">
            <span class="oi oi-magnifying-glass"></span>
        </button>
        <button v-if="searchBar" title="reset" class="btn1 mr-1" @click="findReset()">
            <span class="oi oi-x"></span>
        </button>
    </div>
    <TabGroup>
        <TabList class="tab">
            <Tab>{{$t("Home.Active")}}</Tab>
            <Tab>{{$t("Home.All")}}</Tab>
        </TabList>
        <TabPanels class="mt-1">
            <TabPanel>
                <div v-if="communitiesActive.length > 0">
                    <div class="w-100 text-sm font-bold text-right md:text-center text-gray-400 mt-1">activity measured by messages in last 7 days</div>
                    <div class="flex flex-row flex-wrap" :key="updateKey+'#3'">
                     <CommunityIcon v-for="community in communitiesActive" :img="community.name" 
                        :name="community.title" :number="''+community.number" @closeAll="emit('close')" />
                    </div>
                </div>
            </TabPanel>
            <TabPanel>
                <div v-if="communitiesFound.length > 0">
                    <div class="w-100 text-sm font-bold text-right md:text-center text-gray-400 mt-1">found</div>
                    <div class="flex flex-row flex-wrap" :key="updateKey+'#2'">
                     <CommunityIcon v-for="community in communitiesFound" :fade="!isActive(community.name, communitiesActive)" :img="community.name"
                         :name="community.title" :number2="''+community.subscribers" @closeAll="emit('close')" />
                        <div v-if="hasNextPage" class="btn" @click="findCommunities(searchBar, true)">
                           next<br>page
                        </div>
                    </div>
                </div>
            </TabPanel>
        </TabPanels>
    </TabGroup>

    
   </DefaultModal>          
</template>

<script setup lang="ts">
import { useAccountStore } from "../../stores/account";
const accountStore = useAccountStore();
const router = useRouter();
const emit = defineEmits(["oninput"]);
const isLoading = ref(false);
const accountName = ref("");

const communities = ref([]);
const shown = ref([]);
const hidden = ref([]);
const communitiesFound = ref([]);
const communitiesActive = ref([]);
const hasNextPage = ref(false);
const searchBar = ref("");
const updateKey = ref('#'+stlib.Utils.nextId());

async function hideCommunity(community, hide) {
    var manager = getManager();
    manager.hideCommunity(community, hide);
    shown.value = await manager.getCommunitiesSorted();
    hidden.value = await manager.getCommunitiesHidden();
}

function isActive(name, communities) {
    if(!communities) return true;
    for(var community of communities) { if(community.name == name) return true; }
    return false;
}
async function findCommunities(text, nextPage=false) {
    var query = {"limit":100,"sort":"subs"};
    if(text) query["query"] = text;
    if(nextPage && communitiesFound.value.length > 0)
        query.last = communitiesFound.value[communitiesFound.value.length-1].name;
    var result = await stlib.Utils.getDhiveClient()
        .call("bridge", "list_communities", query);
    hasNextPage.value = result.length >= query.limit;
    if(nextPage) communitiesFound.value.push.apply(communitiesFound.value, result);
    else communitiesFound.value = result;
}
var defaultCommunities = [];
async function initCommunities() {
    var user = accountStore.account.name;
    if(user == null) return;
    var manager = getManager();
    var update = async () => {
        shown.value = await manager.getCommunitiesSorted();
        hidden.value = await manager.getCommunitiesHidden();
    };
    await update();
    manager.oncommunityhide.set("AddCommunityModal.vue", update);
    await findCommunities();
    defaultCommunities = communitiesFound.value;
    updateKey.value = '#'+stlib.Utils.nextId(); 
}
initCommunities();
var defaultActiveCommunities = [];
async function initActiveCommunities() {
    var result = await getManager().getClient().readStats();
    if(result.isSuccess()) {
        var obj = {};
        var dailyStatsArrays = result.getResult()[0];
        for(var day of dailyStatsArrays) {
            for(var community in day) {
                var messageCount = day[community];
                if(obj[community] === undefined) obj[community] = messageCount;
                else obj[community] += messageCount;
            }
        }
        var sorted = [];
        for(var community in obj) {
            var title = "";            
            try { 
                var community0 = await stlib.Community.load(community);
                title = community0.getTitle();
            }
            catch(e) { console.log(e); }
            sorted.push({name:community,title,number:obj[community]});
        }
        sorted.sort((a,b)=>b.number-a.number);
        defaultActiveCommunities = sorted;
        communitiesActive.value = defaultActiveCommunities;
        updateKey.value = '#'+stlib.Utils.nextId(); 
    }
}
initActiveCommunities();
function formatDate(date) {
    var t = date.indexOf('T');
    if(t !== -1) date = date.substring(0, t);
    return date;
}
</script>
