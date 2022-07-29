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
    <TabPanel>Content 2</TabPanel>
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
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
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
</script>
