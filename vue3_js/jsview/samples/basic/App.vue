<template>
  <div class="root">
    <div class="content-size" :style="{top:20, left:20}">
      <TitleBar class="content-size" :itemSides=itemSides />
      <div class="content-size" :style="{top:20}">
        <DivGroup1 class="content-size"
          contentClass="content-size" :itemSides=itemSides />
        <DivGroup2 :style="{left: itemSides.width}"
          contentClass="content-size" :itemSides=itemSides />
        <TextGroup :style="{left: itemSides.width*2}"
          contentClass="content-size" :itemSides=itemSides />
        <AnimGroup :style="{left: itemSides.width*3}"
          contentClass="content-size" :itemSides=itemSides />
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import TitleBar from './components/TitleBar';
import DivGroup1 from './components/div/DivGroup1';
import DivGroup2 from './components/div/DivGroup2';
import TextGroup from './components/text/TextGroup';
import AnimGroup from './components/anim/AnimGroup';

const name = 'Basic';
const itemSides = {
  top: 0,
  left: 0,
  width: 240,
  height: 160,
};
</script>

<style>
.root {
  top: 10; left: 10;
  width: 1250; height: 670;
  background-color: rgba(200, 200, 200, 1)
}

.content-size {
  width: 1210; height: 630;
}

</style>