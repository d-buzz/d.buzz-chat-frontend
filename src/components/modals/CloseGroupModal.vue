<template>
  <DefaultModal title="Close Group?">
        <div class="mt-1">
          <label class="block text-sm font-medium text-gray-700"></label>          
        </div>

        <div><small>{{errorMessage}}</small></div>

        <div>
          <button
            @click="action()"
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
            <span v-else>Close Group</span>
          </button>
        </div>
    </DefaultModal>
</template>

<script setup lang="ts">
import { useAccountStore } from "../../stores/account";
const accountStore = useAccountStore();
const router = useRouter();
const emit = defineEmits();
//const props = defineProps<{
//}>();
const isLoading = ref(false);
const accountName = ref("");
const errorMessage = ref("");

const action = async () => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    console.log("close group");
    emit("close");
  } finally {
    isLoading.value = false;
  }
};
</script>
