<template>
<div id='layout-root'>
    <div class="content-font" :style="{ width: 180, height: 50, backgroundColor: 'rgba(255, 255, 0, 1)' }">style.backgroundColor</div>
    <div class="content-font" :style="{ top: 60, width: 180, height: 50, backgroundImage: `url(${iconImgPath})` }">style.backgroundImage</div>
</div>;
</template>

<script setup>
/* eslint-disable no-unused-vars */
import iconImgPath from '../../assets/icon.png';
</script>

<style>
@import "../FontStyle.css";
</style>