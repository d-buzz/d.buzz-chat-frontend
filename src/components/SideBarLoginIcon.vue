<template>
  <LoginModal :show="loginModalOpen" @close="toggleLoginModal(false)"></LoginModal>

  <div class="flex items-center justify-start">
    <div class="flex-shrink-0">
      <div v-if="accountStore.account.authenticated">
        <router-link to="/controlpanel">
          <img class="rounded-full" :src="`https://images.hive.blog/u/${accountStore.account.name}/avatar/small`" :alt="`@${accountStore.account.name}`" />
        </router-link>
      </div>
      <div v-else>
        <img class="rounded-full w-16" :src="Login" alt="+" @click="toggleLoginModal" />
      </div>
    </div>
  </div>
</template>
<script setup>
import Login from "../assets/images/icons/login.svg";
import { useAccountStore } from "../stores/account";
const accountStore = useAccountStore();

const props = defineProps({});
let loginModalOpen = ref(accountStore.account.authenticated);
const toggleLoginModal = () => {
  loginModalOpen.value = !loginModalOpen.value;
};
</script>
