<template>
  <div class="flex min-h-full h-screen">
    <!-- Loading Spinner -->
    <div v-if="isLoading" class="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-gray-100 bg-opacity-50 z-50">
      <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
      <div class="absolute bottom-[15px] text-center">
        <p class="text-lg mb-4 font-bold text-black">v{{ appVersion }}</p>
      </div>
    </div>
    <div class="grow">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { eventBus } from './eventBus'; // Adjust the path to your eventBus

const isLoading = ref(false);

onMounted(() => {
  eventBus.$on('loading', (state) => {
    isLoading.value = state;
  });
});

onUnmounted(() => {
  eventBus.off('loading');
});

const appVersion = import.meta.env.VITE_APP_VERSION;
</script>

<style>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
