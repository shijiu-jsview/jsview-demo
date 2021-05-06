<template>
<div id='layout-root'>
    <div class="content-font" :style="{ width: 70, height: 50, backgroundColor: 'rgba(0, 255, 0, 1)' }">坐标未设</div>
    <div class="content-font" :style="{ top: 0, left: 75, backgroundColor: 'rgba(0, 255, 0, 1)' }">宽高未设</div>
    <div class="content-font" :style="{ top: 55, left: 0, width: 70, height: 50, backgroundColor: 'rgba(0, 200, 0, 1)', visibility: 'hidden' }">不可视</div>
    <div class="content-font" :style="{ top: 55, left: 75, width: 70, height: 50, backgroundColor: 'rgba(0, 200, 0, 1)', visibility: 'visible' }">可视属性</div>
</div>;
</template>

<style>
@import "../FontStyle.css";
</style>