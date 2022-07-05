<template>
  <header class="bg-primary">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
      <div class="w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
        <div class="flex items-center"></div>
        <div class="ml-10 space-x-4">
          <a href="#" @click="logout()" class="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium hover:bg-indigo-50"
            >Logout</a
          >
        </div>
      </div>
      <div class="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
        <a v-for="link in navigation" :key="link.name" :href="link.href" class="text-base font-medium text-white hover:text-indigo-50">
          {{ link.name }}
        </a>
      </div>
    </nav>
  </header>
</template>
<script setup>
import { useAccountStore } from "../stores/account";
const accountStore = useAccountStore();
const router = useRouter();

function logout() {
  accountStore.signOut();
  router.push("/landing");
}
//will be used when click on user's own profile to logout, change settings, etc
</script>
