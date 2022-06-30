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
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        ></div>
      </TransitionChild>

      <div class="fixed z-10 inset-0 overflow-y-auto">
        <div
          class="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0"
        >
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
                <div class="sm:mx-auto sm:w-full sm:max-w-md">
                  <h2
                    class="text-center mt-6 text-3xl font-extrabold text-gray-900"
                  >
                    Sign into your account
                  </h2>
                </div>

                <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                  <div class="space-y-6">
                    <div>
                      <label
                        for="username"
                        class="block text-sm font-medium text-gray-700"
                      >
                        Account name:
                      </label>
                      <div class="mt-1">
                        <input
                          id="username"
                          name="username"
                          v-model="accountName"
                          @keyup.enter="authenticate(accountName)"
                          type="username"
                          autocomplete="username"
                          class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                          placeholder="Account name"
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
                        <span
                          v-if="isLoading"
                          class="inline-flex items-center transition ease-in-out duration-150 cursor-not-allowed"
                          ><svg
                            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              class="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              stroke-width="4"
                            ></circle>
                            <path
                              class="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Loading...</span
                        >
                        <span v-else>Sign in with Keychain</span>
                      </button>
                    </div>
                  </div>

                  <div class="mt-6">
                    <div class="relative">
                      <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300" />
                      </div>
                      <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white text-gray-500">
                          Or register at
                        </span>
                      </div>
                    </div>

                    <div class="mt-6 grid grid-cols-3 gap-3">
                      <div>
                        <a
                          href="https://signup.hive.io"
                          class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span class="sr-only">Hive.io</span>
                          <img
                            :src="HiveBlogLogo"
                            class="w-5 h-5 grayscale opacity-50"
                            aria-hidden="true"
                          />
                        </a>
                      </div>

                      <div>
                        <a
                          href="https://peakd.com/register"
                          class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span class="sr-only">PeakD</span>
                          <img
                            :src="PeakdLogo"
                            class="w-5 h-5 grayscale opacity-50"
                            aria-hidden="true"
                          />
                        </a>
                      </div>

                      <div>
                        <a
                          href="https://ecency.com/signup"
                          class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span class="sr-only">Ecency</span>
                          <img
                            :src="EcencyLogo"
                            class="w-5 h-5 grayscale opacity-50"
                            aria-hidden="true"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import PeakdLogo from "../assets/images/icons/peakd.svg";
import EcencyLogo from "../assets/images/icons//ecency.svg";
import HiveBlogLogo from "../assets/images/icons/hive-blog.svg";
import { useAccountStore } from "../stores/account";

const emit = defineEmits(["close"]);

const props = defineProps<{
  show: boolean;
}>();
const isLoading = ref(false);
const accountName = ref("");

const accountStore = useAccountStore();
const authenticate = async (account: string) => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    await accountStore.authenticate(account);
    emit("close");
  } finally {
    isLoading.value = false;
  }
};
</script>
