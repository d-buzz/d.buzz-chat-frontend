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
        <div class="mt-1" v-if="input != null">
            <input class="inputText1" v-model="inputValue">
        </div>
        <div class="flex mt-1">
          <button
            @click="action()"
            class="grow btn"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="inline-flex items-center transition ease-in-out duration-150 cursor-not-allowed"
              >Loading...</span
            >
            <span v-else>{{yes}}</span>
          </button>
            <button @click="$emit('close')" class="btn2 grow" :disabled="isLoading">{{no}}</button>
        </div>
    </DefaultModal>
</template>

<script setup lang="ts">
import { useAccountStore } from "../../stores/account";
const accountStore = useAccountStore();
const emit = defineEmits(["action"]);
const router = useRouter();
const props = defineProps({
    title: {type: String, default: ''},
    yes: {type: String, default: 'Yes'},
    no: {type: String, default: 'No'},
    text0: {type: String, default: null},
    text: {type: String, default: null},
    input: {type: String, default: null}
});
const inputValue = ref(props.input.value);
const isLoading = ref(false);

const action = async () => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    emit("action", inputValue.value);
    emit("close");
  } finally {
    isLoading.value = false;
  }
};
</script>
