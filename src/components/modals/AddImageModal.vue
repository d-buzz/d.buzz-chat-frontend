<template>
   <DefaultModal ref="modal" title="Add Image">
    <small class="fg70">select or drag and drop image to upload/enter image link</small>
    <input type="file" name="file" ref="upload" />
    <div class="mt-1 sm:mx-auto sm:w-full sm:max-w-md">
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
const modal = ref(null);
const upload = ref(null);
const isLoading = ref(false);
const accountName = ref("");

window.ondropfile.set("AddImageModal.vue", (file)=>{
    window.ondropfile.set("AddImageModal.vue", null);
    modal.value.close();
});

const authenticate = async (title: string) => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    var element = upload.value;
    if(element.files.length > 0) {
        var file = element.files[0];
        window.ondropfile.post(file);
    }
    else {
        title = title.trim();
        if(title.length > 0) emit('oninput', title);
    }
    console.log("modal ", modal, modal.value);
    modal.value.close();
  } finally {
    isLoading.value = false;
  }
};
</script>
