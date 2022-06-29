<template>
  <LoginModal
    :openModal="openModal"
    :closeModalAction="closeModalAction"
  ></LoginModal>
  <SideBar></SideBar>
</template>
<script setup>
let openModal = ref(true);
const openModalAction = () => {
  openModal.value = true;
};
const closeModalAction = () => {
  openModal.value = false;
};
</script>
