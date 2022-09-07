<template>
  <LoginModal :show="loginModalOpen" @close="toggleLoginModal(false)"></LoginModal>

  <div class="relative flex items-center justify-start">
    <small v-if="number && number != '0'" class="number"><b>{{number}}</b></small>
    <div class="flex-shrink-0 avCommunity">
      <div v-if="accountStore.account.authenticated">
        <router-link to="/home">
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

const props = defineProps({
    number: String
});
let loginModalOpen = ref(false);
const toggleLoginModal = () => {
  loginModalOpen.value = !loginModalOpen.value;
};
</script>
<style scoped>
.number {
    display: block;
    position: absolute;
    pointer-events: none;
    color: white;
    z-index: 5;
    background: rgb(0, 113, 12);
    top: 0;
    right: 0;
    margin-right: 3px;
    border-radius: 10px;
    padding: 2px 4px;
    line-height: 1;
}
</style>
