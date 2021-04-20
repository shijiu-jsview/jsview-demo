<template>
<div>
  <div :style=titleStyle>
    {{title}}
  </div>
  <div key="blockColor" :style="{ top: titleStyle.lineHeight, width: itemSides.width+'px', height: (itemSides.height - 18)+'px', backgroundColor: 'rgba(0,0,255,'+blockOpacity+')' }">
  </div>
  <div key="container" :style="{ top: titleStyle.lineHeight }">
    <slot/>
  </div>
</div>
</template>

<script setup>
import { TitleFont } from './FontStyle';
import { defineProps, ref } from "vue";

const name = 'TitleBlock';
const props = defineProps({
  title: String,
  index: Number,
  contentSize: Object,
  itemSides: Object 
})

const blockOpacity = (((props.index) % 2 === 0) ? 0.2 : 0.5);
</script>

<script jsv-style>
const titleStyle = { 
  ...TitleFont, lineHeight: '18px',
  width: props.itemSides.width+'px', height: '18px',
  backgroundColor: 'rgba(0,0,255,0.7)',
};
</script>