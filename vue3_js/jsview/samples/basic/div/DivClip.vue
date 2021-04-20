<template>
<div id='layout-root'>
    <div style="{top: '0px'}">
        <div :style="{ ...ContentFont, width: '50px', height: titleHeight+'px' }">原图</div>
        <div :style="{ top: titleHeight+'px',
            width: (imageSize.width+4)+'px', height: (imageSize.height+4)+'px',
            backgroundColor: 'rgba(0, 255, 0, 1)' }">
            <div :style="{ left: '2px', top: '2px',
                width: imageSize.width+'px', height: imageSize.height+'px',
                backgroundImage: `url(${testImgPath})` }"/>
        </div>
    </div>

    <div :style="{top: (imageSize.height+titleHeight+4)+'px'}">
        <div :style="{ ...ContentFont, width: '120px', height: titleHeight+'px' }">左上Overflow</div>
        <div :style="{ top: titleHeight+'px',
            width: (imageSize.width+4)+'px', height: (imageSize.height+4)+'px',
            backgroundColor: 'rgba(0, 255, 0, 1)' }">
            <div key="clipArea" :style="{ left: '2px', top: '2px',
                width: clipSize.width+'px', height: clipSize.height+'px',
                overflow: 'hidden' }">
                <div :style="{ width: imageSize.width+'px',
                    height: imageSize.height+'px',
                    backgroundImage: `url(${testImgPath})` }"/>
            </div>
        </div>
    </div>

    <div :style="{ top: ((imageSize.height+titleHeight+4)*2)+'px' }">
        <div :style="{ ...ContentFont, width: '120px', height: titleHeight+'px' }">右下Overflow</div>
        <div :style="{ top: titleHeight+'px',
            width: (imageSize.width+4)+'px', height: (imageSize.height+4)+'px',
            backgroundColor: 'rgba(0, 255, 0, 1)' }">
            <div key="clipArea" :style="{ top: (2+(imageSize.height-clipSize.height))+'px',
                left: (2+(imageSize.width-clipSize.width))+'px',
                width: clipSize.width+'px', height: clipSize.height+'px',
                overflow: 'hidden' }">
                <div :style="{ top: (-((imageSize.height-clipSize.height)))+'px',
                    left: (-(imageSize.width-clipSize.width))+'px',
                    width: imageSize.width+'px', height: imageSize.height+'px',
                    backgroundImage: `url(${testImgPath})` }"/>
            </div>
        </div>
    </div>

    <div :style="{ top: (imageSize.height+titleHeight+4)+'px', left: (imageSize.width+16)+'px' }">
        <div :style="{ ...ContentFont, width: '100px', height: titleHeight+'px' }">ClipPath</div>
        <div :style="{ top: titleHeight+'px',
            width: (imageSize.width+4)+'px', height: (imageSize.height+4)+'px',
            backgroundColor: 'rgba(0, 255, 0, 1)' }">
            <div key="clipArea" :style="{ left: '2px', top: '2px',
                width: imageSize.width+'px', height: imageSize.height+'px',
                clipPath: 'inset(5px 10px 15px 20px)'/* margin of top, right, bottom, left */ }">
                <div :style="{ width: imageSize.width+'px', height: imageSize.height+'px',
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