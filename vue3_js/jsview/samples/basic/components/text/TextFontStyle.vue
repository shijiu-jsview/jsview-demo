<template>
<div id='layout-root'>
    <div>
        <div class="content-font" :style="{ ...blockStyle }">[字体]</div>
        <div class="content-font" :style="{ ...blockStyle, top: 25,
            fontFamily: '宋体' }">
            abc宋体
        </div>
        <div class="content-font" :style="{ ...blockStyle, top: 25, left: blockStyle.width+gap,
            fontFamily: '黑体' }">
            abc黑体
        </div>
        <div :style="{ top: 25, left: (blockStyle.width+gap)*2-10,
            width: blockStyle.width+20, height: 28,
            fontFamily: '黑体', fontSize: '24px',
            WebkitTextStroke: '1px rgba(255,255,0,1.0)'}">
            abc描边
        </div>

        <div class="content-font" :style="{ ...blockStyle, top: 50,
            fontWeight: 'bold' }">
            abc粗体
        </div>
        <div class="content-font" :style="{ ...blockStyle, top: 50, left: blockStyle.width+gap,
            fontStyle: 'italic' }">
            abc斜体
        </div>
    </div>

    <div :style="{ top: 75 }">
        <div class="content-font" :style="{ ...blockStyle }">[其他]</div>
        <div :style="{ top: 25,  width: 130, height: 35,
            fontSize: '30px' }">
            abc字号
        </div>
        <div :style="{ top: 25, left: 120,
            width: 130, height: 35,
            color: 'rgba(255, 0, 0, 1)', fontFamily: 'sans-serif',
            fontSize: '30px', fontStyle: 'italic', fontWeight: 'bold' }">
            abc综合
        </div>
    </div>
</div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
const gap = 5;

const blockStyle = {
    width: 70,
    height: 20
};
</script>

<style>
@import "../FontStyle.css";
</style>