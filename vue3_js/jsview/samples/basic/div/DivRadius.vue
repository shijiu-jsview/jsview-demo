<template>
<div id='layout-root'>
    <div :style="{ ...ContentFont,
        width: blockSize.width+'px', height: blockSize.height+'px',
        backgroundColor: 'rgba(255, 255, 0, 1)',
        borderRadius: '10px' }">
        各角相同
    </div>
    <div :style="{ ...ContentFont,
        left: (blockSize.width+gap)+'px',
        width: blockSize.width+'px', height: blockSize.height+'px',
        backgroundColor: 'rgba(255, 255, 0, 1)',
        borderRadius: '0 10px 20px 30px'}">
        各角不同
    </div>
    <div :style="{ ...ContentFont,
        top: (blockSize.height+gap)+'px',
        width: blockSize.width+'px', height: blockSize.height+'px',
        backgroundImage: `url(${iconImgPath})`,
        borderRadius: '10px'}">
        各角相同
    </div>
    <div :style="{ ...ContentFont,
        left: (blockSize.width+gap)+'px', top: (blockSize.height+gap)+'px',
        width: blockSize.width+'px', height: blockSize.height+'px',
        backgroundImage: `url(${iconImgPath})`,
        borderRadius: '0 10px 20px 30px'}">
        各角不同
    </div>
</div>;
</template>

<script setup>
import { ContentFont } from '../FontStyle';
import iconImgPath from '../resources/icon.png';
</script>

<script jsv-style>

const blockSize = {
    width: 65,
    height: 65,
};

const gap = 5;
</script>