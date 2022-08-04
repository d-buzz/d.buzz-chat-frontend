<template>
  <DefaultModal title="Add Group User" :show="show">
        <div class="mt-1">
          <label for="username" class="block text-sm font-medium text-gray-700"> Account name/s: </label>
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
            @click="action(accountName)"
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
            <span v-else>Add Group User</span>
          </button>
        </div>

    
         </DefaultModal>
</template>

<script setup lang="ts">
import { useAccountStore } from "../../stores/account";
const accountStore = useAccountStore();
const router = useRouter();
const emit = defineEmits();
const props = defineProps<{
  show: boolean;
}>();
const isLoading = ref(false);
const accountName = ref("");
const errorMessage = ref("");

const action = async (account: string) => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    var users = account.split(/[ ,]+/);
    for(var user of users) {
        console.log("user", user);
    }
    emit("close");
  } finally {
    isLoading.value = false;
  }
};
</script>
