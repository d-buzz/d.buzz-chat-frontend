<template>
  <DefaultModal title="Rename Grop">
        <div class="mt-1">
            <label class="text-sm font-medium text-gray-700 mb-1">
                <span>Group id: <b>{{conversation}}</b></span>
            </label>
        </div> 

        <div class="mt-1">
          <label for="username" class="block text-sm font-medium text-gray-700"> Group name: </label>
          <div class="mt-1">
            <input
              name="groupName"
              v-model="groupName"
              @keyup.enter="action(groupName)"
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
            @click="action(groupName)"
            class="w-full btn"
            :disabled="isLoading">
            <span v-if="isLoading">Renaming.</span>
            <span v-else>Rename</span>
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
const groupName = ref("");
const errorMessage = ref("");

async function init() {
    var groupInfo = await stlib.Utils.findGroupInfo(props.conversation);
    if(groupInfo != null && groupInfo.name != null)
        groupName.value = groupInfo.name;
}
init();

const action = async (text: string) => {
  if (isLoading.value) return;
  try {
    text = text.trim();
    isLoading.value = true;

    const manager = getManager();
    var group = props.conversation;
    await manager.renameGroup(group, text);
    
    emit("close");
  } 
  catch(e) {
    errorMessage.value = "Error renaming group.";
  }  
  finally {
    isLoading.value = false;
  }
};
</script>
