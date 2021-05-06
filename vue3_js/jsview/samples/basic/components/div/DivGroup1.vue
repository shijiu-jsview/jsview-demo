<template>
    <div id='item-root'>
        <ContentBlock :class=contentClass :style="{top:itemSides.height*0}" :=contentBlockProps :index=0 title="Layout(布局定位)">
             <DivLayout/>
        </ContentBlock>
        <ContentBlock :class=contentClass :style="{top:itemSides.height*1}" :=contentBlockProps :index=1 title="Background(加载图片)">
            <DivBackground/>
        </ContentBlock>
        <ContentBlock :class=contentClass :style="{top:itemSides.height*2}" :="{...contentBlockProps, itemSides: {...itemSides, height:290}}" :index=2 title="Clip(裁剪)">
            <DivClip/>
        </ContentBlock>
    </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { defineProps } from "vue";
import ContentBlock from '../ContentBlock';
import DivBackground from './DivBackground';
import DivClip from './DivClip';
import DivLayout from './DivLayout';

const name = 'DivGroup1';
const props = defineProps({
  contentClass: String,
  itemSides: Object 
})

const contentBlockProps = {
    colIndex: 0,
    itemSides: props.itemSides
};
</script>