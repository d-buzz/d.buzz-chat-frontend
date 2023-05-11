<template>
   <DefaultModal title="Add Image">
    <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700"> Image link: </label>
          <div class="mt-1">
            <input
              id="username"
              name="username"
              v-model="accountName"
              @keyup.enter="authenticate(accountName)"
              type="username"
              class="inputText1"
              placeholder="image link"
              :read-only="isLoading"
              :disabled="isLoading"
            />
          </div>
        </div>

        <div>
          <button
            @click="authenticate(accountName)"
            class="w-full btn"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="inline-flex items-center transition ease-in-out duration-150 cursor-not-allowed"
              >Loading...</span>
            <span v-else>Add Image</span>
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
const accountName = ref("");

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
