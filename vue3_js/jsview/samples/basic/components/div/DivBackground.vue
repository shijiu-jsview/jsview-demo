<template>
<div id='layout-root'>
    <div :style="{ ...ContentFont, width: 180, height: 50, backgroundColor: 'rgba(255, 255, 0, 1)' }">style.backgroundColor</div>
    <div :style="{ ...ContentFont, top: 60, width: 180, height: 50, backgroundImage: `url(${iconImgPath})` }">style.backgroundImage</div>
</div>;
</template>

<script setup>
import { ContentFont } from '../../FontStyle';
import iconImgPath from '../../assets/icon.png';
</script>