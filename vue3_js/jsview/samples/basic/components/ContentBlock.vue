<template>
<div>
  <div class="title-font" :style=titleStyle>
    {{title}}
  </div>
  <div key="blockColor" :style="{ top: titleStyle.lineHeight, width: itemSides.width, height: itemSides.height - 18, backgroundColor: 'rgba(0,0,255,'+blockOpacity+')' }">
  </div>
  <div key="container" :style="{ top: titleStyle.lineHeight }">
    <slot/>
  </div>
</div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { defineProps } from "vue";

const name = 'TitleBlock';
const props = defineProps({
  title: String,
  index: Number,
  itemSides: Object 
})

const blockOpacity = (((props.index) % 2 === 0) ? 0.2 : 0.5);

const titleStyle = { 
  lineHeight: 18,
  width: props.itemSides.width, height: 18,
  backgroundColor: 'rgba(0,0,255,0.7)',
};
</script>

<style>
@import "./FontStyle.css";
</style>