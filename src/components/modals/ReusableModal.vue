<template>
  <div class="relative z-10 reusable-modal modal-hide" ref="ModalDiv"> 
    <div class="fixed z-10 inset-0 bg-gray-500 bg-opacity-75"></div>
    <div class="fixed z-10 inset-0 overflow-y-auto">
      <div class="relative flex items-start justify-center min-h-full p-4 text-center sm:p-0"
        @click.self="$emit('close')">
          <div class="appbg2 appfg2 rounded-lg px-6 pt-5 pb-5 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 max-w-md w-full" :style="`${dialogPanelCss}`">
            <small class="closeButton oi oi-x" @click="$emit('close')"></small>
              <div class="min-h-full flex flex-col justify-center">
                 <b v-if="title!=null">{{title}}</b>
                 <slot></slot>
              </div>
            </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const ModalDiv = ref();
const emit = defineEmits(["close"]);
const props = defineProps({
  title: {type: String, default: ''},
  dialogPanelCss: {type: String, default: ''}
});
var closed = false;
function open() {
  closed = false;
  ModalDiv.value.setAttribute("class", "relative z-10 modal");
  window.tooltip(null);
}
function close() {
  ModalDiv.value.setAttribute("class", "relative z-10 reusable-modal modal-hide");
  if(closed) return;
  closed = true;
  emit("close");
}
defineExpose({open, close});
</script>
<style scoped>
.reusable-modal {
  opacity: 1;
  /* transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1); */
  visibility: visible;  
}
.modal-hide {
  visibility: hidden;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;  
}
.closeButton {
    @apply cursor-pointer absolute;
    top: 5px;
    right: 5px;
    opacity: 0.35;
}
.closeButton:hover { opacity: 1.0; }
</style>
