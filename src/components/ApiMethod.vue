<template>
  <div class="font-mono text-sm" v-if="item">
    <span v-if="item.flags.isStatic">static </span>
    <a class="nameClass" :href="`#${link(item)}.${item.name}`">{{item.name}}</a>(
    <span v-if="item.signatures && item.signatures.length > 0 && item.signatures[0].parameters">
      <span v-for="(param, i) in item.signatures[0].parameters">
        <span v-if="i > 0">, </span>
        <span>{{param.name}}: {{typeText(param.type)}}</span>
      </span>
      ):
      <span v-if="item.signatures[0].type">{{typeText(item.signatures[0].type)}}</span>
    </span>
    <span v-else> )</span>
  </div> 
</template>
<script setup>
const props = defineProps({
  item: Object
});
function link(item) {
  if(item.sources) return item.sources[0].fileName;
  var signature = item.signatures[0];  
  return signature.type['package']+'.'+signature.type.name;
}
function typeText(type) {
  var text = "";  
  if(type.name) {
    text = type.name;
    if(type.typeArguments) {
      text += '<'+typeText(type.typeArguments[0]);;
      for(var i = 1; i < type.typeArguments.length; i++)
      text += ", " + typeText(type.typeArguments[i]);
      text += '>';
    }
    return text;
  }
  if(type.type === "array")
    return type.elementType.name+"[]";
  if(type.type === "union") {
    var text = typeText(type.types[0]);
    for(var i = 1; i < type.types.length; i++)
      text += " | " + typeText(type.types[i]);
    return text;
  }
  return type;
}
function toText(summary) {
    var text = "";
    for(var item of summary)
        text += item.text;
    return text;
}
</script>
<style scoped>
.nameClass {
  color:#4A6782;
  font-weight: bold;
}
</style>

