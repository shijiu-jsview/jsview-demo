<template>
<div id='layout-root'>
    <div>
        <div :style="{ ...titleStyle }">四种变形动画</div>
        <div :style="{ ...itemStyle, animation: 'AnimComposite1 3s infinite' }"/>
    </div>
    <div :style="{ left: 100 }">
        <div :style="{ ...titleStyle }">变形+透明动画</div>
        <div :style="{ ...itemStyle, animation: 'AnimComposite2 3s infinite' }"/>
    </div>
</div>
</template>

<script setup>
import { ContentFont } from '../FontStyle';

</script>

<script jsv-style>
const titleStyle = {
    ...ContentFont,
    width: 100,
    height: 20,
    textAlign: 'center',
    lineHeight: 20
};

const itemStyle = {
    top: 20,
    width: 50,
    height: 50,
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