<template>
  <LoginModal
    :show="loginModalOpen"
    @close="toggleLoginModal(false)"
  ></LoginModal>

  <div class="flex items-center justify-start">
    <div class="flex-shrink-0" @click="toggleLoginModal">
      <img
        v-if="accountStore.account.authenticated"
        class="rounded-full"
        :src="`https://images.hive.blog/u/${accountStore.account.name}/avatar/small`"
        alt="@"
      />
      <img v-else class="rounded-full w-16" :src="Login" alt="+" />
    </div>
  </div>
</template>
<script setup>
import { useAccountStore } from "../stores/account";
import Login from "../assets/images/icons/login.svg";
const accountStore = useAccountStore();

const props = defineProps({});
let loginModalOpen = ref(accountStore.account.authenticated);
const toggleLoginModal = () => {
  loginModalOpen.value = !loginModalOpen.value;
};
</script>
