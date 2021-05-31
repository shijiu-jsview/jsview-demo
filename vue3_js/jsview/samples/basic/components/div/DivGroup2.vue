<template>
    <div id='item-root'>
        <ContentBlock :class=contentClass :style="{ top: itemSides.height*0}" :=contentBlockProps :index=1 title="Radius(实现圆角)">
            <DivRadius/>
        </ContentBlock>
    </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { defineProps } from "vue";
import ContentBlock from '../ContentBlock';
import DivRadius from './DivRadius';

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