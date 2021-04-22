<template>
<div id='layout-root'>
    <div :style="{ ...blockStyle,
        width: blockSize.width*1.5}">
        左上(默认)
    </div>
    <div :style="{ ...blockStyle,
        top: blockSize.height+5,
        textAlign: 'center' }">
        中上
    </div>
    <div :style="{ ...blockStyle,
        left: blockSize.width+5, top: blockSize.height+5,
        textAlign: 'right' }">
        右上
    </div>
    <div :style="{ ...blockStyle,
        top: (blockSize.height+5)*2,
        lineHeight: blockSize.height}">
        垂直中
    </div>
    <div :style="{ ...blockStyle,
        left: blockSize.width+5, top: (blockSize.height+5)*2,
        lineHeight: blockSize.height,
        textAlign: 'center' }">
        正中
    </div>
</div>
</template>

<script setup>
import { ContentFont } from '../../FontStyle';

</script>

<script jsv-style>
const blockSize = {
    width: 90,
    height: 40,
};

const blockStyle = {
    ...ContentFont,
    width: blockSize.width,
    height: blockSize.height,
    backgroundColor: 'rgba(255, 255, 0, 0.5)',
    color: 'rgba(255, 0, 0, 1)',
};
</script>