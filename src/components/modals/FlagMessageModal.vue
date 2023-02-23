<template>
  <DefaultModal title="Flag Message?">
        <div class="mt-1 mb-1">
            <Message :message="msg" :displayOnly="true"/>
        </div>

        <div>
          <label for="reason" class="block text-sm font-medium text-gray-700"> Reason: </label>
          <div class="mt-1">
            <input
              id="reason"
              name="reason"
              v-model="reason"
              @keyup.enter="action(reason)"
              type="text"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              placeholder="reason for flagging"
              :read-only="isLoading"
              :disabled="isLoading"
            />
          </div>
        </div>

        <div><small>{{errorMessage}}</small></div>

        <div>
          <button
            @click="action(reason)"
            class="w-full btn"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="inline-flex items-center transition ease-in-out duration-150 cursor-not-allowed"
              ><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading...</span
            >
            <span v-else>Flag Message</span>
          </button>
        </div>
    </DefaultModal>
</template>

<script setup lang="ts">
import { useAccountStore } from "../../stores/account";
const accountStore = useAccountStore();
const router = useRouter();
const emit = defineEmits();
const props = defineProps<{
    msg: Object
}>();
const isLoading = ref(false);
const reason = ref("");
const errorMessage = ref("");

const action = async (reason) => {
  if (isLoading.value) return;
  try {
    reason = reason.trim();
    if(reason === "") {
        errorMessage.value = "Enter reason for flagging message.";
        return;
    }
    isLoading.value = true;
    const manager = getManager();
    var msg = stlib.Content.flag(reason, props.msg.message);
    var result = await manager.sendMessage(msg, props.msg.getConversation());
    if(!result.isSuccess()) {
        errorMessage.value = "Error flagging message: ";
        return;
    }
    emit("close");
  } finally {
    isLoading.value = false;
  }
};
</script>
