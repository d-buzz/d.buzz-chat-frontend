<template>

    <div class="min-h-full flex flex-col justify-center" style="align-items:center;">
        <div class="max-w-md w-md border border-gray-300 rounded-md p-3 bg-white">
            <div class="flex" v-if='community'>
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
            <div>
                <b>Login</b>
            </div>
            <div v-if="guestAccounts.length>0">
                <div v-for="name in guestAccounts">
                    <button class="btn grow" @click="loginGuest(name)" 
                        :read-only="isLoading" :disabled="isLoading">Login: {{name}}</button>
                </div>
            </div>
            <div class="mt-1 mb-1">
              <div class="text-orange-700"><small>{{errorMessage}}</small></div>
              <label for="username" class="block text-sm font-bold text-gray-700">username</label>
              <div class="mt-1">
                <input
                  id="username"
                  name="username"
                  v-model="accountName"
                  type="username"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="pick an username"
                  :read-only="isLoading"
                  :disabled="isLoading"
                />
              </div>
            </div>
            <div class="mt-2 mb-2 flex flex-row justify-evenly text-center">
                <button class="btn grow" @click="loginGuest(accountName)" :read-only="isLoading" :disabled="isLoading">Open as Guest</button>
                <button class="btn grow" @click="loginKeychain(accountName)" :read-only="isLoading" :disabled="isLoading">Login with Keychain</button>
            </div>
            <div class="mt-2">
                <div class="relative">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-300" />
                  </div>
                  <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-white text-gray-500"> or register at </span>
                  </div>
                </div>

                <div class="mt-2 grid grid-cols-3 gap-3">
                  <div>
                    <a
                      href="https://signup.hive.io"
                      class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span class="sr-only">Hive.io</span>
                      <img :src="HiveBlogLogo" class="w-5 h-5 grayscale opacity-50" aria-hidden="true" />
                    </a>
                  </div>

                  <div>
                    <a
                      href="https://peakd.com/register"
                      class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span class="sr-only">PeakD</span>
                      <img :src="PeakdLogo" class="w-5 h-5 grayscale opacity-50" aria-hidden="true" />
                    </a>
                  </div>

                  <div>
                    <a
                      href="https://ecency.com/signup"
                      class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span class="sr-only">Ecency</span>
                      <img :src="EcencyLogo" class="w-5 h-5 grayscale opacity-50" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>


        </div>    
    </div>


   
</template>
<script setup>
import PeakdLogo from "../assets/images/icons/peakd.svg";
import EcencyLogo from "../assets/images/icons//ecency.svg";
import HiveBlogLogo from "../assets/images/icons/hive-blog.svg";
import { useAccountStore } from "../stores/account";
import { useRoute } from "vue-router";
const accountStore = useAccountStore();
const route = useRoute();
const router = useRouter();
const community = ref(null);
const isLoading = ref(false);
const guestAccounts = ref([]);
const errorMessage = ref("");
const manager = getManager();
function init() {
    var array = [];
    var guests = manager.readGuests();
    for(var name in guests) array.push(name);
    guestAccounts.value = array;
}
async function initInfo() {
    var user2 = route.params.user;
    if(user2 == null || user2 == "") return;
    community.value = await stlib.Community.load(user2);
    console.log(community.value);
}
init();
initInfo();
async function loginGuest(username) {
    if(username == null || !((username=username.trim()).length > 0)) { 
        errorMessage.value = "enter username";
        return;
    }    
    try {
        isLoading.value = true;
        console.log("login guest", username);
        var result = await accountStore.loginGuest(username);
        if(result[0]) router.push((community.value == null)?'/home':`/i/${community.value.getName()}/about`);
        else errorMessage.value = "login failed";
    }
    catch(e) {
        errorMessage.value = "login failed";
        console.log(e);
    }
    finally {
        isLoading.value = false;    
    }
}
async function loginKeychain(username) {
    if(username == null || !((username=username.trim()).length > 0)) { 
        errorMessage.value = "enter username";
        return;
    }
    try {
        isLoading.value = true;
        await accountStore.authenticate(username);
        router.push((community.value == null)?'/home':`/i/${community.value.getName()}/about`);
    }
    catch(e) {
        errorMessage.value = "login failed";
        console.log(e);
    }
    finally {
        isLoading.value = false;    
    }
}
</script>
