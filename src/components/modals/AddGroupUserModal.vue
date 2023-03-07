<template>
  <DefaultModal title="Add Group User">
        <div class="mt-1">
            <label class="text-sm font-medium text-gray-700 mb-1">
                <span>Group id: <b>{{conversation}}</b></span>
            </label>
        </div> 
        <div class="mt-1">
          <label for="message" class="block text-sm font-medium text-gray-700">Group Invite Message: </label>
          <div class="mt-1">
            <input
              id="message"
              name="message"
              v-model="message"
              type="text"
              class="inputText1"
              placeholder="Group Invite message"
              :read-only="isLoading"
              :disabled="isLoading"
            />
          </div>
        </div>

        <div class="mt-1">
          <label for="username" class="block text-sm font-medium text-gray-700"> Account name/s: </label>
          <div class="mt-1">
            <input
              id="username"
              name="username"
              v-model="accountName"
              @keyup.enter="authenticate(accountName)"
              type="text"
              class="inputText1"
              placeholder="Account name"
              :read-only="isLoading"
              :disabled="isLoading"
            />
          </div>
        </div>

        <div><small>{{errorMessage}}</small></div>

        <div>
          <button
            @click="action(accountName)"
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
              Sending invite...</span
            >
            <span v-else>Add Group User</span>
          </button>
        </div>

    
         </DefaultModal>
</template>

<script setup lang="ts">
import { useAccountStore } from "../../stores/account";
const { t } = useI18n();
const accountStore = useAccountStore();
const router = useRouter();
const emit = defineEmits();
const props = defineProps({
    conversation: {type: String, default: null}
});
const isLoading = ref(false);
const accountName = ref("");
const message = ref(t("AddGroupUserModal.Msg.Join"));
const errorMessage = ref("");

async function init() {
    var groupInfo = await stlib.Utils.findGroupInfo(props.conversation);
    if(groupInfo != null && groupInfo.name != null)
        message.value = t("AddGroupUserModal.Msg.Join") + ' ' + groupInfo.name;
}
init();

const action = async (account: string) => {
  if (isLoading.value) return;
  try {
    account = account.trim();
    if(account.length == 0) {
        errorMessage.value = "Enter users to invite.";
        return;
    }
    isLoading.value = true;
    var users = account.split(/[ ,]+/);
    const manager = getManager();
    var group = props.conversation;
    var groupKey = await manager.getKeyFor(group);
    if(groupKey == null) {
        errorMessage.value = "Group key not found.";
        return;
    }
    for(var user of users) {
        var msg = stlib.Content.groupInvite(message.value, group, groupKey);
        var result = await manager.sendMessage(msg, [manager.user, user]);
        if(!result.isSuccess()) {
            errorMessage.value = "Error sending invite: " + result.getError();
            return;
        }
    }
    emit("close");
  } 
  catch(e) {
    errorMessage.value = "Error sending message.";
  }  
  finally {
    isLoading.value = false;
  }
};
</script>
