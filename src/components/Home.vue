<template>
    <div class="w-full h-full break-all overflow-scroll" v-if="accountStore.account.name">
        <div class="flex mt-3 mr-3">
            <div class="flex-shrink-0 mr-5px">
                <img
                class="rounded-full"
                :src="`https://images.hive.blog/u/${accountStore.account.name}/avatar/medium`"
                alt="@"
                />
            </div>
            <div class="grow" style="margin-top:-7px;">
                <b class="text-lg">{{accountStore.account.name}}</b>
            </div>
            <div style="margin-top:-7px;">
                <button class="btn" @click="logout()">logout</button>
            </div>
        </div>
        <div class="mt-2">
            <TabGroup>
                <TabList class="tab">
                  <Tab>Communities</Tab>
                  <Tab>Preferences</Tab>
                  <Tab>...</Tab>
                </TabList>
            <TabPanels>
                <TabPanel>
                    <div class="flex flex-row flex-wrap mt-1">
                     <SideBarIcon v-for="community in communities" :img="community[0]" :name="community[1]" :community="community" :key="updateKey" />
                    </div>
                </TabPanel>
                <TabPanel>
                    <div class="mt-2"></div>
                    <div class="flex flex-row" v-for="item in preferences">
                        <div>
                            <div><b>{{item.display}}</b></div>
                            <div><small>{{item.desc}}</small></div>
                        </div>
                        <div>
                            <input type="checkbox">
                        </div>
                    </div>

                    <button class="btn" @click="updatePreferences">Update</button>
                     <!--<div class="mt-1">
                      <label for="username" class="block text-sm font-medium text-gray-700"> Account name/s (add 1-3 users): </label>
                      <div class="mt-1">
                        <input
                          id="username"
                          name="username"
                          v-model="accountName"
                          @keyup.enter="authenticate(accountName)"
                          type="username"
                          autocomplete="username"
                          class="inputText1"
                          placeholder="Account name"
                          :read-only="isLoading"
                          :disabled="isLoading"
                        />
                      </div>
                    </div>-->
                </TabPanel>
                <TabPanel>...</TabPanel>
            </TabPanels>
            </TabGroup>
        </div>  
    </div>
</template>
<script setup>
import { useAccountStore } from "../stores/account";
const accountStore = useAccountStore();
const router = useRouter();
const communities = ref([]);
const preferences = ref([]);
const updateKey = ref("");

const defaultPreferences = [
    {name: "autoDecode:b", display: "Auto Decode", desc: "Automatically decode private messages.", value: false}
];

async function initCommunities() {
    var user = accountStore.account.name;
    if(user == null) return;
    var manager = getManager();
    communities.value = await manager.getCommunities(user);
    var prefs = await manager.getPreferences();
    var values = prefs.getValues();
    var array = [];
    for(var pref of defaultPreferences) {
        try {
            var name = pref.name;
            var value = values[name];
            if(value != null) array.push({name, display:pref.display, desc:pref.desc, value});
            else array.push(pref);
        }
        catch(e) {
            console.log(e);
        }
    }
    preferences.value = array;
    updateKey.value = user+'#'+stlib.Utils.utcTime(); 
}
initCommunities();
function updatePreferences() {
    /*var user = accountStore.account.name;
    if(user == null) return;
    community.setStreams(streams.value);
    var json = community.updateStreamsCustomJSON();
    updateMessage.value = "";
    window.hive_keychain.requestCustomJson(user, "community", "Posting",
         JSON.stringify(json), "Update Community Data", (result)=>{
        if(result.success) updateMessage.value="Succesfully updated settings."
        else updateMessage.value="Error: " + result.error;
    });*/
}
function logout() {
  accountStore.signOut();
  router.push("/");
}
//will be used when click on user's own profile to logout, change settings, etc
</script>
