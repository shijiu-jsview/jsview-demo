<template>
<div id='layout-root'>
    <div :style="{ ...ContentFont, width: '70px', height: '50px', backgroundColor: 'rgba(0, 255, 0, 1)' }">坐标未设</div>
    <div :style="{ ...ContentFont, top: '0px', left: '75px', backgroundColor: 'rgba(0, 255, 0, 1)' }">宽高未设</div>
    <div :style="{ ...ContentFont, top: '55px', left: '0px', width: '70px', height: '50px', backgroundColor: 'rgba(0, 200, 0, 1)', visibility: 'hidden' }">不可视</div>
    <div :style="{ ...ContentFont, top: '55px', left: '75px', width: '70px', height: '50px', backgroundColor: 'rgba(0, 200, 0, 1)', visibility: 'visible' }">可视属性</div>
</div>;
</template>

<script setup>
import { ContentFont } from '../FontStyle';
</script>