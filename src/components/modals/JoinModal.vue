<template>
  <DefaultModal>
     <JoinModalContent :community="community" :hideVisitButton="hideVisitButton" @closeAll="close()"></JoinModalContent>
  </DefaultModal>
</template>

<script setup lang="ts">
const emit = defineEmits(["closeAll"]);
const props = defineProps({
    community: String,
    hideVisitButton: Boolean
});
function close() {
    emit('close');
    emit('closeAll');
}
</script>

