<template>
  <div>
    <h2 :id="`api_${cls.name}`"><a :href="`#api_${cls.name}`">{{cls.name}}</a></h2>
    <hr/>

    <div class="mt-3 mb-3" v-if="cls.comment">{{toText(cls.comment.summary)}}</div>

    <div v-if="cls.children">

      <h5>Field Summary</h5>

      <template v-for="item in cls.children">
        <div v-if="(item.kind & 0x420) !== 0">
          <div class="font-mono text-sm">{{item.name}}</div>
        </div>
      </template>

      <h5>Constructor Summary</h5>

      <template v-for="item in cls.children">
        <div v-if="(item.kind & 0x200) !== 0">
          <ApiMethod :item="item"/>
          <div v-if="item.signatures && item.signatures[0].comment">
            {{toText(item.signatures[0].comment.summary, true)}}
          </div>
        </div>
      </template>

      <h5>Method Summary</h5>

      <template v-for="item in cls.children">
        <div v-if="(item.kind & 0x840) !== 0" class="my-3">
          <ApiMethod :item="item"/>
          <div v-if="item.signatures && item.signatures[0].comment">
            {{toText(item.signatures[0].comment.summary, true)}}
          </div>
        </div>
      </template>

    </div>

  </div>
</template>
<script setup>
const props = defineProps({
  cls: Object
});
function typeText(type) {
  if(type.name) return type.name;
  if(type.type === "array")
    return type.elementType.name+"[]";
  return "UNKNOWN"; 
}
function toText(summary, short=false) {
  var text = "";
  for(var item of summary) {
    text += item.text;
    if(short) {
      var i = text.indexOf('.');
      return i===-1?text:text.substring(0,i+1);
    }    
  }
  return text;
}
</script>
<style scoped>

</style>

