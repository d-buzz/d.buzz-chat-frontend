<template>
   <DefaultModal title="Emotes">
    <!--<TabGroup :selectedIndex="_selectedTab">
    <TabList class="tab">
      <Tab>Emote</Tab>
      <Tab>Picture</Tab>
    </TabList>
<TabPanels>
    <TabPanel>0
    </TabPanel>
    <TabPanel>1
    </TabPanel>
</TabPanels>
</TabGroup>-->
    <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-md">
      <EmotePicker @oninput="oninput"/>
   </div>
   </DefaultModal>          
</template>

<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
const props = defineProps({
    selectedTab: {type: Number, default: 0}
});
const router = useRouter();
const emit = defineEmits(["oninput"]);
const isLoading = ref(false);
const accountName = ref("");

const oninput = async (emote: any) => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    if(emote.length > 0) emit('oninput', emote);
    emit("close");
  } finally {
    isLoading.value = false;
  }
};
</script>
