<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-10" @close="$emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      </TransitionChild>

      <div class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-6"
            >
              <div class="min-h-full flex flex-col justify-center">
                
<TabGroup>
    <TabList class="tab">
      <Tab>Direct Message</Tab>
      <Tab>Group Message</Tab>
    </TabList>
<TabPanels>
    <TabPanel>
        <div class="mt-1">
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
        </div>

        <div><small>{{errorMessage}}</small></div>

        <div>
          <button
            @click="authenticate(accountName)"
            class="w-full btn"
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
            <span v-else>Direct Message</span>
          </button>
        </div>


    </TabPanel>
    <TabPanel>
        <div class="mt-1">
            <label class="text-sm font-medium text-gray-700 mb-1"> Group name: </label>
            <div class="flex"><input id="groupname" type="text" class="inputText1" placeholder="group name" value="Group">
            </div>
        </div> 
        <div>
            <button class="btn float-right" @click="generateKey()">Generate</button>
            <small>Enter or generate a public key.</small>
        </div>
        <div class="mt-1">
            <label class="text-sm font-medium text-gray-700 mb-1"> Group public key: </label>
            <div class="flex"><input id="grouppublickey" type="text" class="inputText1" placeholder="STM123... group public key">
            <button class="btn py-2 ml-1 my-0" title="copy to clipboard" @click="copyToClipboard('grouppublickey')"><span class="oi oi-clipboard"></span></button>
            </div>
        </div> 

        <hr class="mt-3">

        <div class="mt-1">
            <small>Select how you would like to store the private key:</small>
            <div class="flex flex-col">
                <div>
                    <input type="radio" id="store_none" name="store_type" value="none">
                    <label for="store_none"> Do not store.</label>
                </div>
                <div>
                    <input type="radio" id="store_local" name="store_type" value="local">
                    <label for="store_local"> Encrypted locally in browser.</label>
                </div>
                <div>
                    <input type="radio" id="store_preferences" name="store_type" value="preferences" checked>
                    <label for="store_preferences"> Encrypted in public user prefernces.</label>      
                </div>
            </div>
        </div>

        <div class="mt-1">
            <label class="block text-sm font-medium text-gray-700 mb-1"> Group private key: </label>
            <div class="flex">
            <input id="groupprivatekey" type="password" class="inputText1 mr-1 " placeholder="optional">
            <button class="btn py-2 my-0" title="copy to clipboard" @click="copyToClipboard('groupprivatekey')"><span class="oi oi-clipboard"></span></button>
            <button class="btn py-2 my-0" title="show or hide" @click="showHide('groupprivatekey')"><span class="oi oi-eye"></span></button>
            </div>
        </div> 

        <div><small>{{errorMessage}}</small></div>
        <div class="mt-1">
            <button class="w-full btn" @click="createGroup()">Create Group</button>
        </div>
    </TabPanel>
</TabPanels>
</TabGroup>

              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { useAccountStore } from "../stores/account";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
const accountStore = useAccountStore();
const router = useRouter();
const emit = defineEmits(["close"]);

const props = defineProps<{
  show: boolean;
}>();
const isLoading = ref(false);
const accountName = ref("");
const errorMessage = ref("");

const authenticate = async (account: string) => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    //todo later check if account exists, if can pm
    var users = account.split(/[ ,]+/);
    if(users.length < 1 || users.length > 3) {
        errorMessage.value = "Enter from 1 to 3 users.";
        return;
    }
    router.push("/p/"+users.join('/'));
    emit("close");
  } finally {
    isLoading.value = false;
  }
};
async function createGroup() {
    var groupname = document.getElementById("groupname").value.trim(); 
    var puKey = document.getElementById("grouppublickey").value.trim(); 
    var piKey = document.getElementById("groupprivatekey").value.trim();

    if(puKey.length === 0) return;

    const manager = getManager();
    var pref = await manager.getPreferences();
    
    if(pref === null) return;

    var storeType = document.querySelector("input[type='radio'][name=store_type]:checked").value; 

    var groupId = pref.findFreeGroupId(); 
    if(groupId === -1) { 
        errorMessage.value = "Limit reached. Delete groups to create new ones.";
        return;
    }
    
    var group = pref.setGroup(groupId, puKey);
    group['name'] = groupname;
    if(piKey.length > 0 && storeType !== 'none') {
        var conversation = "#"+manager.user+"/"+groupId;
        switch(storeType) {
            case "local":
                await manager.storeKeyLocallyEncryptedWithKeychain(conversation, piKey);
                break;
            case "preferences":
                var privatePref = await manager.getPrivatePreferences();
                privatePref.setKeyFor(conversation, piKey);
                break;
        }
    }
    var result = await manager.updatePreferences(pref);
    if(result.isSuccess()) {
        emit("close");
    }
    else {
        pref.setGroup(groupId, null);
        errorMessage.value = "Failed to update preferences. " + result.getError();
    }
}
async function generateKey() {
    var user = accountStore.account.name;
    if(user == null) return;
    var timestamp = stlib.Utils.utcTime();
    //generate a random key by using signature as entropy
    var p = new Promise<SignableMessage>((resolve, error)=>{
        hive_keychain.requestSignBuffer(user,
             "generateKey " + timestamp + " " + Math.random(), 'Posting', (result)=>{
		    if(result.success) {
			    resolve(dhive.cryptoUtils.sha256(result.result));
		    }
		    else error(result);
	    });
    });
    var signature = await p;    
    var piKey = dhive.PrivateKey.fromSeed(signature+(""+Math.random()));
    document.getElementById("grouppublickey").value = piKey.createPublic("STM").toString(); 
    document.getElementById("groupprivatekey").value = piKey.toString();
}
function copyToClipboard(id: string) {
    if(navigator.clipboard) {
        navigator.clipboard.writeText(document.getElementById(id).value) 
    }
}
function showHide(id: string) {
    var input = document.getElementById(id);
    input.type = input.type==="password"?"text":"password";
}
/*function storeLocal(piKey: string) {
    const manager = getManager();
    var key = "#"+manager.user+"/"+groupId);
    window.localStorage.setItem(key, piKey);
}*/
</script>
