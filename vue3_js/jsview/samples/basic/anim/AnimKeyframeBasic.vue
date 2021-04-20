<template>
<div id='layout-root'>
    <div>
        <div :style="{ ...titleStyle }">Translate3d</div>
        <div :style="{ ...itemStyle, animation: 'AnimTranslate 3s infinite' }"/>
    </div>
    <div :style="{ left: blockSize.width+'px' }">
        <div :style="{ ...titleStyle }">Scale3d</div>
        <div :style="{ ...itemStyle, animation: 'AnimScale 3s infinite linear' }"/>
    </div>
    <div :style="{ left: (blockSize.width*2)+'px' }">
        <div :style="{ ...titleStyle }">Rotate3d</div>
        <div :style="{ ...itemStyle, animation: 'AnimRotate 3s infinite linear' }"/>
    </div>
    <div :style="{ left: blockSize.width+'px', top: blockSize.height+'px' }">
        <div :style="{ ...titleStyle }">Skew</div>
        <div :style="{ ...itemStyle, animation: 'AnimSkew 3s infinite ease-in' }"/>
    </div>
    <div :style="{ left: (blockSize.width*2)+'px', top: blockSize.height+'px' }">
        <div :style="{ ...titleStyle }">Opacity</div>
        <div :style="{ ...itemStyle, width: '20px', animation: 'AnimOpacityOut 3s infinite ease-out' }"/>
        <div :style="{ ...itemStyle, left: '25px', width: '20px', animation: 'AnimOpacityIn 3s infinite ease-in-out' }"/>
    </div>
</div>
</template>

<script setup>
import { ContentFont } from '../FontStyle';

</script>

<script jsv-style>
const blockSize = {
    width: 70,
    height: 70,
};

const titleStyle = {
    ...ContentFont,
    width: '60px',
    height: '20px',
    textAlign: 'center',
    lineHeight: '20px'
};

const itemStyle = {
    top: '20px',
    width: '50px',
    height: '50px',
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
}

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