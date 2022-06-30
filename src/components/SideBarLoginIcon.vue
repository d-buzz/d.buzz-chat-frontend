<template>
  <LoginModal
    :show="loginModalOpen"
    @close="toggleLoginModal(false)"
  ></LoginModal>

  <div class="flex items-center justify-start">
    <div class="flex-shrink-0" @click="toggleLoginModal">
      <img class="rounded-full w-16" :src="Login" alt="+" />
    </div>
  </div>
</template>
<script setup>
import Login from "../assets/images/icons/login.svg";

const props = defineProps({});
let loginModalOpen = ref(true);
const toggleLoginModal = () => {
  loginModalOpen.value = !loginModalOpen.value;
};
</script>
