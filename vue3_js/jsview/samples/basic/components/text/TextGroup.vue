<template>
    <div id='item-root'>
        <ContentBlock :class=contentClass :style="{ top: itemSides.height*0}" :=contentBlockProps :index=0 title="文字对齐">
             <TextAlign/>
        </ContentBlock>
        <ContentBlock :class=contentClass :style="{ top: itemSides.height*1}" :=contentBlockProps :index=1 title="字体和字号">
            <TextFontStyle/>
        </ContentBlock>
        <ContentBlock :class=contentClass :style="{ top: itemSides.height*2}" :="{...contentBlockProps, itemSides: {...itemSides, height:290}}" :index=2 title="文字折行">
            <TextOverflow/>
        </ContentBlock>
    </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { defineProps } from "vue";
import ContentBlock from '../ContentBlock';
import TextAlign from './TextAlign';
import TextFontStyle from './TextFontStyle';
import TextOverflow from './TextOverflow';

const name = 'DivGroup2';
const props = defineProps({
  contentClass: String,
  itemSides: Object 
})
const contentBlockProps = {
    colIndex: 0,
    itemSides: props.itemSides
};
</script>