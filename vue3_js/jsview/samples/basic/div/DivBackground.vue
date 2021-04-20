<template>
<div id='layout-root'>
    <div :style="{ ...ContentFont, width: '180px', height: '50px', backgroundColor: 'rgba(255, 255, 0, 1)' }">style.backgroundColor</div>
    <div :style="{ ...ContentFont, top: '60px', width: '180px', height: '50px', backgroundImage: `url(${iconImgPath})` }">style.backgroundImage</div>
</div>;
</template>

<script setup>
import { ContentFont } from '../FontStyle';
import iconImgPath from '../resources/icon.png';
</script>