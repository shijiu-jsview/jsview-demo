<template>
    <div id='item-root'>
        <ContentBlock :=contentBlockProps :index=0 title="文字对齐" :style="{ top: itemSides.height*0}">
             <TextAlign/>
        </ContentBlock>
        <ContentBlock :=contentBlockProps :index=1 title="字体和字号" :style="{ top: itemSides.height*1}">
            <TextFontStyle/>
        </ContentBlock>
        <ContentBlock :="{...contentBlockProps, itemSides: {...itemSides, height:290}}" :index=2 title="文字折行" :style="{ top: itemSides.height*2}">
            <TextOverflow/>
        </ContentBlock>
    </div>
</template>

<script setup>
import { defineProps, ref } from "vue";
import ContentBlock from '../ContentBlock';
import TextAlign from './TextAlign';
import TextFontStyle from './TextFontStyle';
import TextOverflow from './TextOverflow';

const name = 'DivGroup2';
const props = defineProps({
  contentSize: Object,
  itemSides: Object 
})
</script>


<script jsv-style>
const contentBlockProps = {
    colIndex: 0,
    contentSize: props.contentSize,
    itemSides: props.itemSides
};
</script>