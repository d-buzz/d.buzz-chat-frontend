<template>
  <span ref="span" class="break-word" :class="{'name':long}" :key="updateKey">{{name}}</span>
</template>
<script setup type="ts">
const props = defineProps({
  name: String
});
const span = ref();
const long = ref(false);
const updateKey = ref('#'+stlib.Utils.nextId());
function onVisible(element, callback) {
  var observer = new ResizeObserver((items, observer) => {
    items.forEach(item => {
      try { nextTick(()=>{callback();}); }
      catch(e) { console.log(e); }
      observer.disconnect();
    });
  });
  observer.observe(element);
}
nextTick(()=>{
  var element = span.value;
  if(element && element.innerText && element.innerText.length > 0) {
    if(element.clientWidth === 0) {
      onVisible(element, ()=>{
        if((element.clientWidth >= 190 || element.clientHeight > 30)) {
          long.value = true;
          updateKey.value = '#'+stlib.Utils.nextId();
        }
      });
    }
    else if((element.clientWidth >= 190 || element.clientHeight > 30)) {
      long.value = true;
      updateKey.value = '#'+stlib.Utils.nextId();
    }
  }
});
</script>
<style scoped>
.name {
  display: inline-block;
  font-size: smaller;
  line-height: 1;
}
</style>
