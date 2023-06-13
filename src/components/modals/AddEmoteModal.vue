<template>
   <ReusableModal ref="modal" :unmount="false">
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
   <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <EmotePicker @oninput="oninput"/>
   </div>
   </ReusableModal>          
</template>

<script setup lang="ts">
//import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
const props = defineProps({
    selectedTab: {type: Number, default: 0}
});
const emit = defineEmits(["oninput"]);
const isLoading = ref(false);
const modal = ref();

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
function open() { modal.value.open(); }
function close() { modal.value.close(); }
defineExpose({open, close});
</script>
