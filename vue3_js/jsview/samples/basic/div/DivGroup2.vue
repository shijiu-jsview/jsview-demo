<template>
    <div id='item-root'>
        <ContentBlock :=contentBlockProps :index=1 title="Radius(实现圆角)" :style="{ top: (itemSides.height * 0)+'px' }">
            <DivRadius/>
        </ContentBlock>
    </div>
</template>

<script setup>
import { defineProps, ref } from "vue";
import ContentBlock from '../ContentBlock';
import DivRadius from './DivRadius';

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