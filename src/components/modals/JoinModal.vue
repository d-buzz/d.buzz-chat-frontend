<template>
  <DefaultModal>
     <JoinModalContent :community="community" :hideVisitButton="hideVisitButton"></JoinModalContent>
  </DefaultModal>
</template>

<script setup lang="ts">
const props = defineProps({
    community: String,
    hideVisitButton: Boolean
});
</script>

