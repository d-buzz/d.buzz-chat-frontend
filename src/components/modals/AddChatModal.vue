<template>
    <TransitionRoot :show="newUserMessageModalOpen">
        <NewUserMessageModal :selectedTab="1" @close="toggleNewUserMessageModalOpen(false)"></NewUserMessageModal>
    </TransitionRoot>
   <DefaultModal>
    <TabGroup :selectedIndex="selectedTab">
    <TabList class="tab">
      <Tab>Add Chat</Tab>
      <Tab>Add Encrypted Chat</Tab>
    </TabList>
<TabPanels>
    <TabPanel>
    <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700"> Display Name: </label>
          <div class="mt-1">
            <input
              name="username"
              v-model="accountName"
              @keyup.enter="authenticate(accountName)"
              type="text"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              placeholder="display name"
              :read-only="isLoading"
              :disabled="isLoading"
            />
          </div>
        </div>

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
            <span v-else>Add Chat</span>
          </button>
        </div>
      </div>
   </div>
 </TabPanel>
    <TabPanel>
        <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="">
        <small>Select encrypted group to add or create new one.</small>
        <div class="space-x-1">
            <select class="inputSelect1" v-model="selectModel" @change="selectGroup(selectModel)">
              <option value="">Select group</option>
              <option v-for="group in groups" :value="group">{{group.name}} ({{group.conversation}})</option>
            </select>
            <button class="btn" title="create new" @click="toggleNewUserMessageModalOpen(true)"><span class="oi oi-plus"></span> create new</button> </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"> Display Name: </label>
          <div class="mt-1">
            <input
              name="username"
              v-model="accountName"
              type="text"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              placeholder="display name"
              :read-only="isLoading"
              :disabled="isLoading"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Path: </label>
          <div class="mt-1">
            <input
              v-model="dataPath"
              type="text"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              placeholder="display name"
              :read-only="isLoading"
              :disabled="isLoading"
            />
          </div>
        </div>

        <div>
          <button
            @click="addPrivateChat(accountName, dataPath)"
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
            <span v-else>Add Chat</span>
          </button>
        </div>
      </div>
   </div>
 </TabPanel>
</TabPanels>
</TabGroup>

   </DefaultModal>          
</template>

<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
const router = useRouter();
const emit = defineEmits(["oninput"]);
const isLoading = ref(false);
const accountName = ref("General");
const dataPath = ref("");
const groups = ref([]);
const newUserMessageModalOpen = ref(false);
const toggleNewUserMessageModalOpen = async (open=null) => {
    if(open === false) 
        await init();
    newUserMessageModalOpen.value = open===null?!newUserMessageModalOpen.value:open;
};

async function init() {
    var manager = getManager();
    var groupObjs = await manager.getJoinedAndCreatedGroups();
    var groupArray = [];
    for(var conversation in groupObjs) {
        var groupObj = groupObjs[conversation];
        groupObj.name = conversation;
        groupArray.push(groupObj);
        try {
            groupObj.name = await stlib.Utils.getGroupName(conversation);
        }
        catch(e) {
            console.log(e);
        }
    }
    groups.value = groupArray;
}
init();

const authenticate = async (title: string) => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    title = title.trim();
    if(title.length > 0) {
        emit('oninput', title);
        emit("close");
    }
  } finally {
    isLoading.value = false;
  }
};
function selectGroup(option) {
    var conversation = option.conversation;
    var name = option.name;
    if(conversation.startsWith('#')) {
        console.log(name, conversation);
        accountName.value = name;
        dataPath.value = 'g:'+conversation.substring(1);
    }
}
const addPrivateChat = async (title: string, path: string) => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    title = title.trim();
    path = path.trim();
    if(title.length > 0 && path.length > 0) {
        emit('oninput', title, path);
        emit("close");
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
