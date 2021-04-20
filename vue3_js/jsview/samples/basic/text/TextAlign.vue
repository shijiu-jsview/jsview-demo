<template>
<div id='layout-root'>
    <div :style="{ ...blockStyle,
        width: (blockSize.width*1.5)+'px' }">
        左上(默认)
    </div>
    <div :style="{ ...blockStyle,
        top: (blockSize.height+5)+'px',
        textAlign: 'center' }">
        中上
    </div>
    <div :style="{ ...blockStyle,
        left: (blockSize.width+5)+'px', top: (blockSize.height+5)+'px',
        textAlign: 'right' }">
        右上
    </div>
    <div :style="{ ...blockStyle,
        top: ((blockSize.height+5)*2)+'px',
        lineHeight: blockSize.height+'px' }">
        垂直中
    </div>
    <div :style="{ ...blockStyle,
        left: (blockSize.width+5)+'px', top: ((blockSize.height + 5)*2)+'px',
        lineHeight: blockSize.height+'px',
        textAlign: 'center' }">
        正中
    </div>
</div>
</template>

<script setup>
import { ContentFont } from '../FontStyle';

</script>

<script jsv-style>
const blockSize = {
    width: 90,
    height: 40,
};

const blockStyle = {
    ...ContentFont,
    width: blockSize.width+"px",
    height: blockSize.height+"px",
    backgroundColor: 'rgba(255, 255, 0, 0.5)',
    color: 'rgba(255, 0, 0, 1)',
};
</script>