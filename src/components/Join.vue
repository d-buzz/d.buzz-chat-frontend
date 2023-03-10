<template>

    <div class="min-h-full flex flex-col justify-center appfg0 appbg0" style="align-items:center;">
        <div class="max-w-md w-md border border-gray-300 rounded-md p-3 appfg1 appbg1">
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


            <div v-if="!showWelcomeMessage" style="min-width:350px;">
                <div>
                    <b>Login</b>
                </div>
                <div class="mt-1 mb-1">
                  <div class="text-orange-700"><small>{{errorMessage}}</small></div>
                  <label for="username" class="block text-sm font-bold text-gray-700">username</label>
                  <div class="mt-1">
                    <input
                      name="username"
                      v-model="accountName"
                      type="username"
                      class="inputText1"
                      @keyup.enter="loginKeychain(accountName)"                  
                      placeholder="hive username"
                      :read-only="isLoading"
                      :disabled="isLoading"
                    />
                  </div>
                </div>
                <div class="mt-2 mb-2 flex flex-row justify-evenly text-center">
                    <button class="btn grow" @click="loginKeychain(accountName)" :read-only="isLoading" :disabled="isLoading">Login with Keychain</button>
                </div>
                <div>
                    <p class="text-xs text-gray-700">Recommended to use the Keychain "do not prompt" for best experience.</p>
                </div>
                <!--<div class="mt-2">
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
                -->
                    <hr class="mt-3"/>
                    <div class="mt-1">
                        <b>Login as guest</b>
                    </div>
                    <label for="username" class="block text-sm font-bold text-gray-700">username</label>
                  <div class="mt-1">
                    <input
                      name="username"
                      v-model="accountName"
                      type="username"
                      class="inputText1"
                      @keyup.enter="loginGuest(accountName)"                  
                      placeholder="pick an username"
                      :read-only="isLoading"
                      :disabled="isLoading"
                    />
                  </div>
                  <button class="btn grow" @click="loginGuest(accountName)" :read-only="isLoading" :disabled="isLoading">Open as Guest</button>
                  <div v-if="guestAccounts.length>0">
                    <div><b>Recent Logins</b></div>
                    <div class="flex">
                        <div v-for="name in guestAccounts">
                            <button class="btn grow" @click="loginGuest(name)" 
                                :read-only="isLoading" :disabled="isLoading">{{name}}</button>
                        </div>
                    </div>
                  </div>
            </div>
            <div v-else style="width:350px;">
                <div>
                    <div><b>Welcome!</b></div>
                    <div class="text-xs text-gray-700">Select who can directly message you and whether to show online status.</div>
                    <div class="flex flex-row" v-for="item in defaultPreferences">
                        <Preference :item="item"></Preference>
                    </div>
                    <div class="mt-2 mb-2 flex flex-row justify-evenly text-center">
                        <button class="btn grow" @click="updatePreferences" :read-only="isLoading" :disabled="isLoading">Update Preferences</button>
                        <button class="btn2 grow" @click="skip" :read-only="isLoading" :disabled="isLoading">Maybe later</button>                
                    </div>
                </div>
                <hr/>
                <div>
                    <small><b>How does it work?</b></small>
                    <p class="text-xs text-gray-700">Keychain uses Hive keys to encrypt and decrypt messages as well as user preferences.</p>
                    <small><b>Decrypting</b></small>
                    <p class="text-xs text-gray-700">Use the Keychain "do not prompt" option to easily and quickly read encrypted messages.</p>
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
const accountName = ref("");
const community = ref(null);
const isLoading = ref(false);
const showWelcomeMessage = ref(false);
const guestAccounts = ref([]);
const errorMessage = ref("");
const manager = getManager();
const defaultPreferences = [
    {name: "directMessage:s", display: "Direct Message", desc: "Permission to message directly is granted to:",
     value: 'everyone', newvalue:'everyone', options:[
        ['everyone', 'Everyone'],['accounts', 'Hive users'],
        ['communities','Communities in common'], ['friends', 'Friends']]},
    {name: "showOnline:b", display: "Online Status", desc: "Show online status.", value: true, newvalue:true},
];  

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
        console.log("authenticate" , username);
        await accountStore.authenticate(username);
        var user = accountStore.account.name;
        
        if(user != null) {
            var preferences = await stlib.Utils.getAccountPreferences(user);
            if(preferences == null) {                
                showWelcomeMessage.value = true;
                return;
            }
        }
        skip();
    }
    catch(e) {
        errorMessage.value = "login failed";
        console.log(e);
    }
    finally {
        isLoading.value = false;    
    }
}
async function updatePreferences() {
    var user = accountStore.account.name;
    if(user == null) return;
    var manager = getManager();
    var prefs = await manager.getPreferences();
    for(var item of defaultPreferences) {
        item.value = item.newvalue;
        prefs.setValue(item.name, item.value);
    }
    var result;
    if(prefs.getValue("showOnline:b", false) === true) result = await manager.setupOnlineStatus(true);
    else result = await manager.updatePreferences(prefs);
    if(result.isSuccess()) {
        skip();    
    }
    else errorMessage.value = "Failed to update preferences. " + result.getError();
}
function skip() {
    router.push((community.value == null)?'/home':`/i/${community.value.getName()}/about`);
}
</script>
