<template>
<div id='layout-root'>
    <div class="content-font" :style="{
        width: blockSize.width, height: blockSize.height,
        backgroundColor: 'rgba(255, 255, 0, 1)',
        borderRadius: '10px' }">
        各角相同
    </div>
    <div class="content-font" :style="{
        left: blockSize.width+gap,
        width: blockSize.width, height: blockSize.height,
        backgroundColor: 'rgba(255, 255, 0, 1)',
        borderRadius: '0 10px 20px 30px'}">
        各角不同
    </div>
    <div class="content-font" :style="{
        top: blockSize.height+gap,
        width: blockSize.width, height: blockSize.height,
        backgroundImage: `url(${iconImgPath})`,
        borderRadius: '10px'}">
        各角相同
    </div>
    <div class="content-font" :style="{ 
        left: blockSize.width+gap, top: blockSize.height+gap,
        width: blockSize.width, height: blockSize.height,
        backgroundImage: `url(${iconImgPath})`,
        borderRadius: '0 10px 20px 30px'}">
        各角不同
    </div>
</div>;
</template>

<script setup>
/* eslint-disable no-unused-vars */
import iconImgPath from '../../assets/icon.png';

const blockSize = {
    width: 65,
    height: 65,
};

const gap = 5;
</script>

<style>
@import "../FontStyle.css";
</style>