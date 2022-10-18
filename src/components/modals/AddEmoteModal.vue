<template>
   <DefaultModal title="Add Emote">
    <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-md">
      <EmotePicker @action="action"/>
   </div>
   </DefaultModal>          
</template>

<script setup lang="ts">
const router = useRouter();
const emit = defineEmits(["oninput"]);
const isLoading = ref(false);
const accountName = ref("");

const action = async (emote: any) => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    if(emote.length > 0) emit('oninput', emote);
    emit("close");
  } finally {
    isLoading.value = false;
  }
};
</script>
