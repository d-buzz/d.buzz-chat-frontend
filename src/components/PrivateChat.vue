<template>
  <div class="w-full h-full flex flex-col justify-end overflow-y-scroll">
    <div class="text-left mb-1">
      <MessageSent class="" />
    </div>
    <div class="text-right mb-1">
      <MessageReceived class="" />
    </div>
    <div class="flex mt-4">
      <input
        class="shadow appearance-none border rounded-full w-[calc(100%-4rem)] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grow"
        id="Message"
        type="text"
        placeholder="Message"
      />
      <button class="right-0 x-16 bg-primary text-white font-bold py-2 px-4 rounded-full">Send</button>
    </div>
  </div>
</template>
<script setup>
//will be used when click on someone else's profile to chat 1-on-1
</script>
