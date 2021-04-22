<template>
<div id='layout-root'>
    <div style="{top: 0}">
        <div :style="{...ContentFont, width: 50, height: titleHeight}">原图</div>
        <div :style="{top: titleHeight,
            width: imageSize.width+4, height: imageSize.height+4,
            backgroundColor: 'rgba(0, 255, 0, 1)' }">
            <div :style="{ left: 2, top: 2,
                width: imageSize.width, height: imageSize.height,
                backgroundImage: `url(${testImgPath})` }"/>
        </div>
    </div>

    <div :style="{top: imageSize.height+titleHeight+4}">
        <div :style="{ ...ContentFont, width: 120, height: titleHeight }">左上Overflow</div>
        <div :style="{ top: titleHeight,
            width: imageSize.width+4, height: imageSize.height+4,
            backgroundColor: 'rgba(0, 255, 0, 1)' }">
            <div key="clipArea" :style="{ left: 2, top: 2,
                width: clipSize.width, height: clipSize.height,
                overflow: 'hidden' }">
                <div :style="{ width: imageSize.width,
                    height: imageSize.height,
                    backgroundImage: `url(${testImgPath})` }"/>
            </div>
        </div>
    </div>

    <div :style="{ top: (imageSize.height+titleHeight+4)*2 }">
        <div :style="{ ...ContentFont, width: 120, height: titleHeight }">右下Overflow</div>
        <div :style="{ top: titleHeight,
            width: imageSize.width+4, height: imageSize.height+4,
            backgroundColor: 'rgba(0, 255, 0, 1)' }">
            <div key="clipArea" :style="{ top: 2+(imageSize.height-clipSize.height),
                left: 2+(imageSize.width-clipSize.width),
                width: clipSize.width, height: clipSize.height,
                overflow: 'hidden' }">
                <div :style="{ top: -((imageSize.height-clipSize.height)),
                    left: -(imageSize.width-clipSize.width),
                    width: imageSize.width, height: imageSize.height,
                    backgroundImage: `url(${testImgPath})` }"/>
            </div>
        </div>
    </div>

    <div :style="{ top: imageSize.height+titleHeight+4, left: imageSize.width+16 }">
        <div :style="{ ...ContentFont, width: 100, height: titleHeight }">ClipPath</div>
        <div :style="{ top: titleHeight,
            width: imageSize.width+4, height: imageSize.height+4,
            backgroundColor: 'rgba(0, 255, 0, 1)' }">
            <div key="clipArea" :style="{ left: 2, top: 2,
                width: imageSize.width, height: imageSize.height,
                clipPath: 'inset(5px 10px 15px 20px)'/* margin of top, right, bottom, left */ }">
                <div :style="{ width: imageSize.width, height: imageSize.height,
                    backgroundImage: `url(${testImgPath})` }"/>
            </div>
        </div>
    </div>

</div>
</template>

<script setup>
import { ContentFont } from '../FontStyle';
import testImgPath from '../resources/test.jpg';

</script>

<script jsv-style>
const titleHeight = 16;
const imageSize = {
    width: 80,
    height: 64,
};
const clipSize = {
    width: 50,
    height: 40,
};
</script>