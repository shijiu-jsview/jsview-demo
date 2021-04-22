<template>
<div id='layout-root'>
    <div :style="{ ...baseStyle,
        whiteSpace: 'nowrap',
        textOverflow: 'clip',
        overflow: 'hidden'}">
        1.长文字截断，后面的文字你可能看不到
    </div>

    <div :style="{ ...baseStyle,
        top: blockSize.height+gap,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'}">
        2.长文字省略，后面的文字你可能看不到
    </div>

    <div :style="{ ...baseStyle,
        top: (blockSize.height+gap)*2,
        whiteSpace: 'pre-wrap',
        textOverflow: 'clip',
        overflow: 'hidden'}">
        3.长文字折行+截断，后面的文字你可能看不到，与PC效果有区别，一二三四五六七八九十
    </div>

    <div :style="{ ...baseStyle,
        top: (blockSize.height+gap)*3,
        whiteSpace: 'pre-wrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'}">
        4.长文字折行+省略，后面的文字你可能看不到，与PC效果有区别，一二三四五六七八九十
    </div>

    <div :style="{ ...baseStyle,
        top: (blockSize.height+gap)*4, height: 65,
        whiteSpace: 'pre-wrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'}">
        5.{{multiLine}}
    </div>

    <div :style="{ ...baseStyle,
        top: (blockSize.height+gap)*4+67, height: 65,
        whiteSpace: 'pre-wrap',
        textOverflow: 'clip',
        overflow: 'hidden'}">
        6.{{multiLine}}
    </div>

</div>
</template>

<script setup>
import { ContentFont } from '../../FontStyle';

console.log("ContentFont=" + JSON.stringify({...ContentFont}), ContentFont);

</script>

<script jsv-style>
const gap = 2;

const blockSize = {
    width: 180,
    height: 35,
};

const baseStyle = {
    ...ContentFont,
    width: blockSize.width,
    height: blockSize.height,
    backgroundColor: 'rgba(255, 255, 0, 0.5)',
    color: 'rgba(255, 0, 0, 1)',
};

// 多行的处理，在PC端依靠CSS属性 white-space: pre-line，在JsView平台不需要特别属性
const multiLine = "多行文字（末尾省略)："
        + "\n第一行：我末尾有个\"\\n\""
        + "\n第二行：一二三四五六七八九十,一二三四五六七八九十,一二三四五六七八九十"
        + "\n第三行：一二三四五六七八九十,一二三四五六七八九十,一二三四五六七八九十";

</script>