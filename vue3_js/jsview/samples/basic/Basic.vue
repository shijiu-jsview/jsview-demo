<template>
  <div :style=rootStyle>
    <div :style="{...contentSize, top:20, left:20}">

      <TitleBar :style=contentSize
        :contentSize=contentSize :itemSides=itemSides />
      <div :style="{ ...contentSize, top:'20px' }">
        <DivGroup1 :style=contentSize
          :contentSize=contentSize :itemSides=itemSides />
        <DivGroup2 :style="{...contentSize, left: itemSides.width+'px'}"
          :contentSize=contentSize :itemSides=itemSides />
        <TextGroup :style="{...contentSize, left: (itemSides.width*2)+'px'}"
          :contentSize=contentSize :itemSides=itemSides />
        <AnimGroup :style="{...contentSize, left: (itemSides.width*3)+'px'}"
          :contentSize=contentSize :itemSides=itemSides />
      </div>
    </div>

  </div>
</template>

<script setup>
import TitleBar from './TitleBar';
import DivGroup1 from './div/DivGroup1';
import DivGroup2 from './div/DivGroup2';
import TextGroup from './text/TextGroup';
import AnimGroup from './anim/AnimGroup';

const name = 'Basic';
</script>

<script jsv-style>
const rootStyle = {
  top: 10, left: 10,
  width: 1250, height: 670,
  backgroundColor: 'rgba(0, 0, 255, 0.1)'
};
const contentSize = {
  width: 1210, height: 630,
};

const itemWidth = 240;
const itemHeight = 160;

const itemSides = {
  top: 0,
  left: 0,
  width: 240,
  height: 160,
};

</script>