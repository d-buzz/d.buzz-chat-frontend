<template>
  <DefaultModal title="Hide Messages from Users">
        <div class="flex gap-x-3">
            <div class="mt-1">
              <label for="username" class="block text-sm font-medium text-gray-700">Enter username/s: </label>
              <div class="mt-1">
                <input
                  id="username"
                  name="username"
                  v-model="accountName"
                  @keyup.enter="action(accountName)"
                  type="text"
                  class="inputText1"
                  placeholder="user name"
                  :read-only="isLoading"
                  :disabled="isLoading"
                />
              </div>
            </div>
            <div class="mt-1">
                <label for="username" class="block text-sm font-medium text-gray-700">Click to remove user from list: </label>
                <div v-for="(value, user) in hiddenUsers">
                    <button class="btn" @click="remove(user)">{{user}}
                        <span class="oi oi-circle-x"></span>
                    </button>
                </div>
            </div>
        </div>

        <div><small>{{errorMessage}}</small></div>

        <div class="flex mt-1">
          <button
            @click="action(accountName)"
            class="btn grow"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="inline-flex items-center transition ease-in-out duration-150 cursor-not-allowed"
              >Processing</span
            >
            <span v-else>Hide</span>
          </button>
            <button
            @click="close"
            class="btn2 grow"
            >
            Close
            </button>
        </div>

    
         </DefaultModal>
</template>

<script setup lang="ts">
import { useAccountStore } from "../../stores/account";
const accountStore = useAccountStore();
const router = useRouter();
const emit = defineEmits([]);
const hiddenUsers = ref(getManager().readHiddenUsers());
const props = defineProps({
  user: {type: String, default: ""}
});
const isLoading = ref(false);
const accountName = ref(props.user);
const errorMessage = ref("");

function remove(user) {
    delete hiddenUsers.value[user];
    getManager().hideUsers(Object.keys(hiddenUsers.value), false);
}
function close() {
    emit('close');
    getManager().postCallbackEvent(null);
}
const action = async (threadName: string) => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    var accountNames = threadName.trim().split(/[ ,]+/);
    if(accountNames.length > 0) {
        for(var user of accountNames)
            hiddenUsers.value[user] = true;
        getManager().hideUsers(Object.keys(hiddenUsers.value), false);
    }
  } 
  finally {
    isLoading.value = false;
  }
};
</script>
