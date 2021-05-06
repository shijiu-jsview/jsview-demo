<template>
<div id='layout-root'>
    <div>
        <div class="content-font" :style="{ ...titleStyle }">Translate3d</div>
        <div :style="{ ...itemStyle, animation: 'AnimTranslate 3s infinite' }"/>
    </div>
    <div :style="{ left: blockSize.width }">
        <div class="content-font" :style="{ ...titleStyle }">Scale3d</div>
        <div :style="{ ...itemStyle, animation: 'AnimScale 3s infinite linear' }"/>
    </div>
    <div :style="{ left: blockSize.width*2 }">
        <div class="content-font" :style="{ ...titleStyle }">Rotate3d</div>
        <div :style="{ ...itemStyle, animation: 'AnimRotate 3s infinite linear' }"/>
    </div>
    <div :style="{ left: blockSize.width, top: blockSize.height }">
        <div class="content-font" :style="{ ...titleStyle }">Skew</div>
        <div :style="{ ...itemStyle, animation: 'AnimSkew 3s infinite ease-in' }"/>
    </div>
    <div :style="{ left: blockSize.width*2, top: blockSize.height }">
        <div class="content-font" :style="{ ...titleStyle }">Opacity</div>
        <div :style="{ ...itemStyle, width: 20, animation: 'AnimOpacityOut 3s infinite ease-out' }"/>
        <div :style="{ ...itemStyle, left: 25, width: 20, animation: 'AnimOpacityIn 3s infinite ease-in-out' }"/>
    </div>
</div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
const blockSize = {
    width: 70,
    height: 70,
};

const titleStyle = {
    width: 60, height: 20,
    textAlign: 'center',
    lineHeight: 20
};

const itemStyle = {
    top: 20,
    width: 50, height: 50,
    backgroundColor: 'rgba(255, 0, 0, 1)'
};

</script>

<style>
@keyframes AnimTranslate {
  from {
    transform: translate3d(50%, 50px, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
};

@keyframes AnimScale {
  from {
    transform: scale3d(1.5, 1.5, 1);
  }
  to {
    transform: scale3d(0, 0, 0);
  }
}

@keyframes AnimRotate {
  from {
    transform: rotate3d(1.5, 1, 1, 90deg);
  }
  to {
    transform: rotate3d(1.5, 1, 1, 0);
  }
}

@keyframes AnimSkew {
  from {
    transform: skew(30deg, 45deg);
  }
  to {
    transform: skew(0, 0);
  }
}

@keyframes AnimOpacityOut {
  from {
    opacity: 0.1;
  }
  to {
    opacity: 1;
  }
}

@keyframes AnimOpacityIn {
  from {
    opacity: 1;
  }
  to {
    opacity: 20%;
  }
}
</style>