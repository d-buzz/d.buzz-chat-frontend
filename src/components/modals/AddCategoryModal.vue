<template>
   <DefaultModal title="Add Category">
    <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700"> Category name: </label>
          <div class="mt-1">
            <input
              id="username"
              name="username"
              v-model="accountName"
              @keyup.enter="authenticate(accountName)"
              type="username"
              class="inputText1"
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
              >Loading...</span>
            <span v-else>Add Category</span>
          </button>
        </div>
      </div>
   </div>
   </DefaultModal>          
</template>

<script setup lang="ts">
const router = useRouter();
const emit = defineEmits(["oninput"]);
const isLoading = ref(false);
const accountName = ref("Category");

const authenticate = async (title: string) => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    title = title.trim();
    if(title.length > 0) emit('oninput', title);
    emit("close");
  } finally {
    isLoading.value = false;
  }
};
</script>
