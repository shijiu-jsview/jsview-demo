<template>
  <div>
    <div :style="{...contentSize, backgroundColor: 'rgba(255, 255, 255, 1.0)'}"/>

    <div>
      <div :style="{...itemStyle, left: itemSides.width * 0}">div标签1</div>
      <div :style="{...itemStyle, left: itemSides.width * 1}">div标签2</div>
      <div :style="{...itemStyle, left: itemSides.width * 2}">div文本</div>
      <div :style="{...itemStyle, left: itemSides.width * 3}">动画</div>
    </div>
  </div>
</template>

<script setup>
import { TitleFont } from '../FontStyle';
import { defineProps, ref } from "vue";

const name = 'Title';
const props = defineProps({
  contentSize: Object,
  itemSides: Object 
})
</script>

<script jsv-style>
const itemStyle = { ...TitleFont,
  textAlign: 'center',
  width: props.itemSides.width
};
</script>