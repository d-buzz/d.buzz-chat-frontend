<template>
    <Dialog as="div" class="relative z-10" @close="$emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      </TransitionChild>

      <div class="fixed z-10 inset-0 overflow-y-auto">
        <div class="relative flex items-start justify-center min-h-full p-4 text-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="appbg2 appfg2 rounded-lg px-6 pt-5 pb-5 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-md sm:w-full" :style="`${dialogPanelCss}`"
            >
              <small class="closeButton oi oi-x" @click="$emit('close')"></small>
              <div class="min-h-full flex flex-col justify-center">
                 <b v-if="title!=null">{{title}}</b>
                 <slot></slot>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
</template>
<script setup lang="ts">
const emit = defineEmits(["close"]);
const props = defineProps<{
    title: {type: String, default: ''},
    dialogPanelCss: {type: String, default: ''}
}>();
</script>
<style scoped>
.closeButton {
    @apply cursor-pointer absolute;
    top: 5px;
    right: 5px;
    opacity: 0.35;
}
.closeButton:hover { opacity: 1.0; }
</style>
