<template>
    <div id='item-root'>
        <ContentBlock :=contentBlockProps :index=0 title="Layout(布局定位)" :style="{ top: (itemSides.height * 0)+'px' }">
             <DivLayout/>
        </ContentBlock>
        <ContentBlock :=contentBlockProps :index=1 title="Background(加载图片)" :style="{ top: (itemSides.height * 1)+'px' }">
            <DivBackground/>
        </ContentBlock>
        <ContentBlock :="{...contentBlockProps, itemSides: {...itemSides, height:290}}" :index=2 title="Clip(裁剪)" :style="{ top: (itemSides.height * 2)+'px'}">
            <DivClip/>
        </ContentBlock>
    </div>
</template>

<script setup>
import { defineProps } from "vue";
import ContentBlock from '../ContentBlock';
import DivBackground from './DivBackground';
import DivClip from './DivClip';
import DivLayout from './DivLayout';

const name = 'DivGroup1';
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