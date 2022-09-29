<template>
  <DefaultModal title="Threads">
        <div class="flex gap-x-3">
            <div class="mt-1">
              <label for="username" class="block text-sm font-medium text-gray-700">Enter thread name: </label>
              <div class="mt-1">
                <input
                  id="username"
                  name="username"
                  v-model="accountName"
                  @keyup.enter="action(accountName)"
                  type="text"
                  class="inputText1"
                  placeholder="Thread name"
                  :read-only="isLoading"
                  :disabled="isLoading"
                />
              </div>
            </div>
            <div class="mt-1">
                <label for="username" class="block text-sm font-medium text-gray-700">Or select thread: </label>
                <div v-for="threadName in threadNames">
                    <button class="btn" @click="action(threadName)">{{threadName}}</button>
                </div>
            </div>
        </div>

        <div><small>{{errorMessage}}</small></div>

        <div class="flex mt-1">
          <button
            @click="action(accountName)"
            class="btn grow"
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
              Sending invite...</span
            >
            <span v-else>Use thread</span>
          </button>
           <button
            @click="showAll()"
            class="btn grow"
            :disabled="isLoading"
          >Show All Messages</button>
        </div>

    
         </DefaultModal>
</template>

<script setup lang="ts">
import { useAccountStore } from "../../stores/account";
const accountStore = useAccountStore();
const router = useRouter();
const emit = defineEmits(["oninput"]);
const threadNames = ref([]);
//const props = defineProps<{
//}>();
const isLoading = ref(false);
const accountName = ref("");
const errorMessage = ref("");

async function init() {
    const manager = getManager();
    var threads = await manager.getThreads();
    threadNames.value = Object.keys(threads);
}
init();

const action = async (threadName: string) => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    threadName = threadName.trim();
    if(threadName) {
        emit("oninput", threadName);
        emit("close");
    }
    else errorMessage.value = "Enter thread name."
  } 
  finally {
    isLoading.value = false;
  }
};
function showAll() {
    emit("oninput", null);
    emit("close");
}
</script>
