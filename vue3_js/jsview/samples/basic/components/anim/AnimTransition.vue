<template>
<div id='layout-root'>
    <div>
        <div class="content-font" :style="{ ...titleStyle }">坐标变化</div>
        <div class="content-font" :style="{ ...itemStyle,
          left: timeCount*10%200,
          transition: 'left 1s linear' }"/>
    </div>
    <div :style="{ top: 70 }">
        <div class="content-font" :style="{ ...titleStyle }">坐标和尺寸变化</div>
        <div class="content-font" :style="{ ...itemStyle,
          left: timeCount*10%200,
          width: timeCount*10%100+10,
          transition: 'left 0.5s linear, width 1s linear 1s' }"/>
    </div>

    <div :style="{ top: 140, width: 240, height: 160, backgroundColor: 'rgba(0, 0, 255, 0.5)' }">
        <div :style="{ ...titleStyle }">transform</div>
        <div class="content-font" :style="{ ...itemStyle,
            top: 20,
            transition: 'transform 2.5s linear 0.5s',
            transform: state.transform,
            transformOrigin: state.transformOrigin }">移动缩放旋转</div>
        <div class="content-font" :style="{ ...itemStyle,
            top: 100,
            transition: 'transform 2.5s linear 0.5s',
            transformOrigin: 'center center',
            transform: state.transformTranslate }">移动</div>
        <div class="content-font" :style="{ ...itemStyle,
            left: 140, top: 20,
            transition: 'transform 2.5s linear 0.5s',
            transformOrigin: 'center center',
            transform: state.transformScale }">缩放</div>
        <div class="content-font" :style="{ ...itemStyle,
            top: 75,
            left: 140,
            transition: 'transform 2.5s linear 0.5s',
            transformOrigin: 'center center',
            transform: state.transformRotate }">旋转</div>
    </div>
</div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { defineProps, onMounted, onBeforeUnmount } from "vue";


const props = defineProps({
  timeCount: Number,
})

var state = {
    transform: null,
    transformOrigin: null,
    transformTranslate: null,
    transformRotate: null,
    transformScale: null,
};

var timerId = -1;

onMounted(() => {
    changeState();
    timerId = setInterval(() => {
      changeState();
    }, 6000);
});

onBeforeUnmount(() => {
    if (timerId >= 0) {
      window.clearInterval(timerId);
    }
    timerId = -1;
});

function changeState() {
    setTimeout(() => {
        // 状态变更
        state.transform = 'translate3d(80px,0px,0) scale3d(2,2,1.0) rotate3d(0, 0, 1, 360deg)';
        state.transformOrigin = 'center center';
        state.transformScale = 'scale3d(0.2,0.2,1.0)';
        state.transformRotate = 'rotate3d(0, 0, 1.0, 360deg)';
        state.transformTranslate = 'translate3d(180px,0px,0)';
        // 状态变更
        setTimeout(() => {
            state.transform = 'translate3d(30px,0px,0) scale3d(0.2,0.2,1.0) rotate3d(0, 0, 1, -360deg)';
            state.transformOrigin = 'center center';
            state.transformScale = 'scale3d(1.2,1.2,1.0)';
            state.transformRotate = 'rotate3d(0, 0, 1.0, -360deg)';
            state.transformTranslate = 'translate3d(-80px,0px,0)';
        }, 3000);
    }, 3000);
}

const titleStyle = {
    width: 100,
    height: 20,
    textAlign: 'left',
    lineHeight: 20
};

const itemStyle = {
    top: 20,
    width: 50, height: 50,
    whiteSpace: 'pre-wrap',
    backgroundColor: 'rgba(255, 0, 0, 1)'
};
</script>

<style>
@import "../FontStyle.css";
</style>

<style>
</style>
