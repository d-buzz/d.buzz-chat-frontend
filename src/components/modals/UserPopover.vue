<template>
  <Popover v-slot="{ open }" class="static">
      <PopoverButton class="outline-none">
        <slot></slot>
      </PopoverButton>

      <transition 
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-1 opacity-0"
      >
        <PopoverPanel
          class="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-y-1/2 -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl"
         >
          <div
            class="overflow-hidden rounded-lg border border-gray-400 shadow-lg ring-1 ring-black ring-opacity-5 bg-white p-4"
          >
            <div class="flex">
                <div class="flex-shrink-0 mr-5px">
                    <img
                    class="rounded-full avMessage"
                    :src="`https://images.hive.blog/u/${message.getUser()}/avatar/small`"
                    alt="@"
                    />
                </div>
                <div class="grow" style="margin-top:-7px;">
                    <small><b>{{message.getUser()}}</b></small>
                </div>
            </div>
          </div>
        </PopoverPanel>
      </transition>
    </Popover>
</template>

<script setup lang="ts">
const props = defineProps<{
    message: Object
}>();
</script>
