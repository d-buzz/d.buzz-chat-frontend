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
                    <div class="flex flex-row mt-1">
                     <SideBarIcon v-for="community in communities" :img="community[0]" :name="community[1]" :key="updateKey" />
                    </div>
                </TabPanel>
                <TabPanel>todo preferencs
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
const updateKey = ref("");
async function initCommunities() {
    var user = accountStore.account.name;
    if(user == null) return;
    var manager = getManager();
    communities.value = await manager.getCommunities(user);
    updateKey.value = user+'#'+stlib.Utils.utcTime();
}
initCommunities();

function logout() {
  accountStore.signOut();
  router.push("/");
}
//will be used when click on user's own profile to logout, change settings, etc
</script>
