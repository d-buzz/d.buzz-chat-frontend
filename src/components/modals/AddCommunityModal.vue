<template>
   <DefaultModal title="Add community">
    <div class="flex flex-row flex-wrap" :key="updateKey">
       <CommunityIcon v-for="community in communities" :img="community[0]" :name="community[1]" :number="''" />
    </div>
    
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
            <Tab>{{$t("Home.All")}}</Tab>
            <Tab>{{$t("Home.Active")}}</Tab>
        </TabList>
        <TabPanels class="mt-1">
            <TabPanel>
                <div v-if="communitiesFound.length > 0">
                    <div class="w-100 text-sm font-bold text-right md:text-center text-gray-400 mt-1">found</div>
                    <div class="flex flex-row flex-wrap" :key="updateKey+'#2'">
                     <CommunityIcon v-for="community in communitiesFound" :fade="!isActive(community.name, communitiesActive)" :img="community.name" :name="community.title" :number2="''+community.subscribers"  />
                        <div v-if="hasNextPage" class="btn" @click="findCommunities(searchBar, true)">
                           next<br>page
                        </div>
                    </div>
                </div>
            </TabPanel>
            <TabPanel>
                <div v-if="communitiesActive.length > 0">
                    <div class="w-100 text-sm font-bold text-right md:text-center text-gray-400 mt-1">activity measured by messages in last 7 days</div>
                    <div class="flex flex-row flex-wrap" :key="updateKey+'#2'">
                     <CommunityIcon v-for="community in communitiesActive" :img="community.name" :name="community.name" :number="''+community.number"  />
                    </div>
                </div>
            </TabPanel>
        </TabPanels>
    </TabGroup>

    <div class="mt-5 w-full">
      <div class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700"> Title: </label>
          <div class="mt-1">
            <input
              id="username"
              name="username"
              v-model="accountName"
              @keyup.enter="authenticate(accountName)"
              type="username"
              autocomplete="title"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              placeholder="title"
              :read-only="isLoading"
              :disabled="isLoading"
            />
          </div>
        </div>
        To do
        <div>
          <button
            @click="authenticate(accountName)"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-75"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="inline-flex items-center transition ease-in-out duration-150 cursor-not-allowed"
              ><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading...</span
            >
            <span v-else>Add Community</span>
          </button>
        </div>
      </div>
   </div>
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
const communitiesFound = ref([]);
const communitiesActive = ref([]);
const hasNextPage = ref(false);
const searchBar = ref("");
const updateKey = ref('#'+stlib.Utils.nextId());

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
    communities.value = await manager.getCommunitiesSorted(user);
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
        for(var community in obj) sorted.push({name:community,number:obj[community]});
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
const authenticate = async (title: string) => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    title = title.trim();
    if(title.length > 0) emit('oninput', title);
    emit("close");
  } finally {
    isLoading.value = false;
  }
};
</script>
