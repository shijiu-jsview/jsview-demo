<template>
<div id='layout-root'>
    <div>
        <div :style="{ ...titleStyle }">坐标变化</div>
        <div :style="{ ...itemStyle,
          left: (timeCount*10%200)+'px',
          transition: 'left 1s linear' }"/>
    </div>
    <div :style="{ top: '70px' }">
        <div :style="{ ...titleStyle }">坐标和尺寸变化</div>
        <div :style="{ ...itemStyle,
          left: (timeCount*10%200)+'px',
          width: (timeCount*10%100+10)+'px',
          transition: 'left 0.5s linear, width 1s linear 1s' }"/>
    </div>

    <div :style="{ top: '140px', width: '240px', height: '160px', backgroundColor: 'rgba(0, 0, 255, 0.5)' }">
        <div :style="{ ...titleStyle }">transform</div>
        <div :style="{ ...itemStyle,
            top: '20px',
            transition: 'transform 2.5s linear 0.5s',
            transform: state.transform,
            transformOrigin: state.transformOrigin }">移动缩放旋转</div>
        <div :style="{ ...itemStyle,
            top: '100px',
            transition: 'transform 2.5s linear 0.5s',
            transformOrigin: 'center center',
            transform: state.transformTranslate }">移动</div>
        <!-- <div :style="{ ...itemStyle,
            left: '140px', top: '20px',
            transition: 'transform 2.5s linear 0.5s',
            transformOrigin: 'center center',
            transform: state.transformScale }">缩放</div> -->
        <div :style="{ ...itemStyle,
            top: '75px',
            left: '140px',
            transition: 'transform 2.5s linear 0.5s',
            transformOrigin: 'center center',
            transform: state.transformRotate }">旋转</div>
    </div>
</div>
</template>

<script setup>
import { defineProps, reactive, onMounted, onBeforeUnmount } from "vue";
import { ContentFont } from '../FontStyle';


const props = defineProps({
  timeCount: Number,
})

var state = {
    transform: null,
    transformOrigin: null,
    transformTranslate: null,
    transformRotate: null,
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

</script>

<script jsv-style>
const titleStyle = {
    ...ContentFont,
    width: '100px',
    height: '20px',
    textAlign: 'left',
    lineHeight: '20px'
};

const itemStyle = {
    ...ContentFont,
    top: '20px',
    width: '50px', height: '50px',
    whiteSpace: 'pre-wrap',
    backgroundColor: 'rgba(255, 0, 0, 1)'
};

</script>

<style>
@keyframes AnimComposite1 {
  from {
    transform: translate3d(50%, 30px, 0) scale3d(1.5, 1.5, 1) rotate3d(1.5, 1, 1, 90deg) skew(30deg, 45deg);
  }
  to {
  }
}

@keyframes AnimComposite2 {
  from {
    transform: translate3d(50%, 30px, 0) scale3d(1.5, 1.5, 1) rotate3d(1.5, 1, 0, 90deg) skew(30deg, 45deg);
    opacity: 0.1;
  }
  to {
  }
}
</style>
