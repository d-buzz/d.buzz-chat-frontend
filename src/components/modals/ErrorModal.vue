<template>
  <DefaultModal :title="title">
        <div class="mt-1">
            <label v-if="text0" class="text-sm font-medium text-gray-700 mb-1 whitespace-pre-wrap">
                <span><b>{{text0}}</b></span>
            </label>
            <label v-if="text" class="text-sm font-medium text-gray-700 mb-1 whitespace-pre-wrap">
                <span>{{text}}</span>
            </label>
        </div> 
        <div class="flex">
           <button @click="$emit('close')" class="btn2 grow" :disabled="isLoading">Close</button>
        </div>
    </DefaultModal>
</template>

<script setup lang="ts">
import { useAccountStore } from "../../stores/account";
const accountStore = useAccountStore();
const emit = defineEmits();
const router = useRouter();
const props = defineProps({
    title: {type: String, default: ''},
    text0: {type: String, default: null},
    text: {type: String, default: null}
});
const isLoading = ref(false);

const action = async () => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    emit("close");
  } finally {
    isLoading.value = false;
  }
};
</script>
