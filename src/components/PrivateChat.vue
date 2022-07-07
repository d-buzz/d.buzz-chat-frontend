<template>
  <div class="w-full h-full">
    <div>
      <MessageSent class="fixed bottom-0" />
    </div>
    <div>
      <MessageReceived class="fixed bottom-0" />
    </div>
    <input
      class="fixed bottom-0 shadow appearance-none border rounded-full w-[calc(100%-4rem)] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      id="Message"
      type="text"
      placeholder="Message"
    />
    <button class="fixed bottom-0 right-0 x-16 bg-primary text-white font-bold py-2 px-4 rounded-full">Send</button>
  </div>
</template>
<script setup>
//will be used when click on someone else's profile to chat 1-on-1
</script>
