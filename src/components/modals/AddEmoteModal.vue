<template>
   <DefaultModal title="Add Emote">
    <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-md">
      <EmojiPicker pickerType='' :native="true" @select="action" />
   </div>
   </DefaultModal>          
</template>

<script setup lang="ts">
import EmojiPicker from 'vue3-emoji-picker'
console.log("emotepicker ", EmojiPicker);
const router = useRouter();
const emit = defineEmits(["oninput"]);
const isLoading = ref(false);
const accountName = ref("");

const action = async (emote: any) => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;

    console.log("emote", emote);
    /*title = title.trim();
    if(title.length > 0) emit('oninput', title);
    emit("close");*/
  } finally {
    isLoading.value = false;
  }
};
</script>
