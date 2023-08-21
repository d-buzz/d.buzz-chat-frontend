<template>
  <div>
    <h2 :id="`api_${cls.name}`"><a :href="`#api_${cls.name}`">{{cls.name}}</a></h2>
    <hr/>

    <div class="whitespace-pre mt-3 mb-3" v-if="cls.comment">{{toText(cls.comment.summary)}}</div>

    <div v-if="cls.children">

      <h5 v-if="hasFields(cls.children)">Field Summary</h5>

      <template v-for="item in cls.children">
        <div v-if="(item.kind & 0x420) !== 0">
          <div class="font-mono text-sm">{{item.name}}</div>
        </div>
      </template>

      <h5 v-if="hasConstructor(cls.children)">Constructor Summary</h5>

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

      <h5 v-if="hasFields(cls.children)">Fields</h5>

      <template v-for="item in cls.children">
        <div v-if="(item.kind & 0x420) !== 0">
          <div class="font-mono text-sm">{{item.name}}</div>
        </div>
      </template>

      <h5 v-if="hasConstructor(cls.children)">Constructors</h5>

      <template v-for="item in cls.children">
        <div v-if="(item.kind & 0x200) !== 0">
          <ApiMethod :item="item"/>
          <div v-if="item.signatures && item.signatures[0].comment">
            {{toText(item.signatures[0].comment.summary, false)}}
          </div>
        </div>
      </template>

      <h5>Methods</h5>
      <hr/>
      <template v-for="item in cls.children">
        <div :id="`${link(item)}.${item.name}`" v-if="(item.kind & 0x840) !== 0" class="my-3">
          <ApiMethod :item="item"/>
          <div class="whitespace-pre mt-3 mb-3" v-if="item.signatures && item.signatures[0].comment">
            {{toText(item.signatures[0].comment.summary, false)}}
          </div>
          <hr/>
        </div>
      </template>
      

    </div>

  </div>
</template>
<script setup>
const props = defineProps({
  cls: Object
});
function hasFields(list) {
  for(var item of list)
    if((item.kind & 0x420) !== 0)
      return true;
  return false;
}
function hasConstructor(list) {
  for(var item of list)
    if((item.kind & 0x200) !== 0)
      return true;
  return false;
}
function link(item) {
  if(item.sources) return item.sources[0].fileName;
  var signature = item.signatures[0];  
  return signature.type['package']+'.'+signature.type.name;
}
function typeText(type) {
  if(type.name) return type.name;
  if(type.type === "array")
    return type.elementType.name+"[]";
  return "UNKNOWN"; 
}
function toText(summary, short=false) {
  var text = "";
  for(var item of summary) {
    if(item.kind === "inline-tag") {
      text += item.tag+" ";
    }
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

