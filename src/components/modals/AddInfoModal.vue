<template>
   <DefaultModal title="Add Information Page">
    <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="space-y-3">
        <div>
          <div class="mt-1">
            <label for="username" class="block text-sm font-medium text-gray-700">Select type of page and/or customize below: </label>
            <select class="inputSelect1 w-full" @change="onSelect($event.target.value)">
                <option value="/about">About</option>
                <option value="/created">Posts</option>
                <option value="https://">Url</option>
            </select>

            <!--<select
              id="username"
              name="username"
              v-model="displayName"
              type="username"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            />-->
          </div>
        </div>

        <div>
          <label for="username" class="block text-sm font-medium text-gray-700"> Display name: </label>
          <div class="mt-1">
            <input
              id="username"
              name="username"
              v-model="displayName"
              type="username"
              class="inputText1"
              placeholder="display name"
              :read-only="isLoading"
              :disabled="isLoading"
            />
          </div>
        </div>

        <div>
          <label for="datapath" class="block text-sm font-medium text-gray-700"> Data path: </label>
          <div class="mt-1">
            <input
              id="datapath"
              name="datapath"
              v-model="dataPathModel"
              type="text"
              class="inputText1"
              placeholder="display name"
              :read-only="isLoading"
              :disabled="isLoading"
            />
          </div>
        </div>

        <div>
          <button
            @click="authenticate(displayName, dataPathModel)"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-75"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="inline-flex items-center transition ease-in-out duration-150 cursor-not-allowed"
              >Loading...</span>
            <span v-else>Add Information Page</span>
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
const displayName = ref("About");
const dataPathModel = ref("/about");
const selectData = {"/about":"About", "/created":"Posts", "https://":"Link label"};

function onSelect(value) {
    displayName.value = selectData[value] || "Info";
    dataPathModel.value = value;
}
const authenticate = async (title: string, path: string) => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    title = title.trim();
    if(title.length > 0) emit('oninput', title, path);
    emit("close");
  } finally {
    isLoading.value = false;
  }
};
</script>
