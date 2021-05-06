<template>
  <div>
    <div class='title-font item-style' :style="{...itemSides, left: itemSides.width * 0}">div标签1</div>
    <div class='title-font item-style' :style="{...itemSides, left: itemSides.width * 1}">div标签2</div>
    <div class='title-font item-style' :style="{...itemSides, left: itemSides.width * 2}">div文本</div>
    <div class='title-font item-style' :style="{...itemSides, left: itemSides.width * 3}">动画</div>
  </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { defineProps } from "vue";

const name = 'Title';
const props = defineProps({
  itemSides: Object 
})
</script>

<style>
@import "./FontStyle.css";
</style>

<style scoped>
.item-style {
  text-align: center;
}

</style>