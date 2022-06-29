<template>
  <LoginModal :show="true" @close="toggleLoginModal(false)"></LoginModal>
  <SideBar></SideBar>
</template>
<script setup>
let loginModalOpen = ref(true);
const toggleLoginModal = (open = false) => {
  loginModalOpen.value = open;
};
</script>
