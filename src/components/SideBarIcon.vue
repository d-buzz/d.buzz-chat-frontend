<template>
  <div class="flex items-center justify-start">
    <div class="flex-shrink-0">
      <img
        class="rounded-full"
        :src="`https://images.hive.blog/u/${img}/avatar/small`"
        alt="witness.owner"
      />
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  img: String,
});
</script>
