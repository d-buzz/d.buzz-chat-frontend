<template>
  <TransitionRoot as="template" :show="props.openModal">
    <Dialog as="div" class="relative z-10" @close="props.closeModalAction">
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
        />
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
              <div
                class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
              >
                <div class="max-w-md w-full space-y-8">
                  <div>
                    <h2
                      class="mt-6 text-center text-3xl font-extrabold text-gray-900"
                    >
                      Sign in with HIVE
                    </h2>
                    <p class="mt-2 text-center text-sm text-gray-600">
                      Or
                      {{ " " }}
                      <a
                        href="https://signup.hive.io"
                        target="_blank"
                        class="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Signup for Hive
                      </a>
                    </p>
                  </div>
                  <form class="mt-8 space-y-6" @submit.prevent="authenticate">
                    <input type="hidden" name="remember" value="true" />
                    <div class="rounded-md shadow-sm -space-y-px">
                      <div>
                        <label for="hive-account" class="sr-only"
                          >Hive Account:</label
                        >
                        <input
                          id="hive-account"
                          name="hive-account"
                          type="text"
                          required
                          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          placeholder="Username"
                          v-model="accountStore.account.name"
                        />
                      </div>
                    </div>
                    <div>
                      <button
                        type="submit"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <span
                          class="absolute left-0 inset-y-0 flex items-center pl-3"
                        >
                          <LockClosedIcon
                            class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                            aria-hidden="true"
                          ></LockClosedIcon>
                        </span>
                        Sign in
                      </button>
                    </div>
                  </form>
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
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { useAccountStore } from "../stores/account";
const accountStore = useAccountStore();
const authenticate = async () => {
  await accountStore.authenticate();
  props.closeModalAction();
};
const props = defineProps<{
  openModal: any;
  closeModalAction: any;
}>();
</script>
