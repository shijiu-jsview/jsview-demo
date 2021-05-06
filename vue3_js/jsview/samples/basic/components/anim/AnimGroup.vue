<template>
    <div id='item-root'>
        <ContentBlock
            :class=contentClass
            :style="{ top: itemSides.height * 0 }"
            :=contentBlockProps
            :index=1
            title="Keyframe基础动画集合">
            <AnimKeyframeBasic/>
        </ContentBlock>
        <ContentBlock
            :class=contentClass
            :style="{ top: itemSides.height * 1 }"
            :=contentBlockProps
            :index=2
            title="Keyframe组合示例">
            <AnimKeyframeComposite/>
        </ContentBlock>
        <ContentBlock
            :class=contentClass
            :style="{ top: itemSides.height * 2}"
            :="{...contentBlockProps, itemSides: {...itemSides, height:290}}"
            :index=3
            title="Transition动画示例">
            <AnimTransition :timeCount=state.timeCount />
        </ContentBlock>
    </div>

</template>

<script setup>
/* eslint-disable no-unused-vars */
import { defineProps, reactive, onMounted, onBeforeUnmount } from "vue";
import ContentBlock from '../ContentBlock';
import AnimKeyframeBasic from './AnimKeyframeBasic';
import AnimKeyframeComposite from './AnimKeyframeComposite';
import AnimTransition from './AnimTransition';

const name = 'DivGroup2';
const props = defineProps({
  contentClass: String,
  itemSides: Object 
})

const state = reactive({
    timeCount: 20
})
var timerId = -1;

onMounted(() => {
    timerId = setInterval(() => {
        // console.log('change timeCount: ' + timeCount);
        state.timeCount = (state.timeCount + 5);
    }, 2000);
});

onBeforeUnmount(() => {
    if (timerId >= 0) {
      window.clearInterval(timerId);
    }
    timerId = -1;
});

const contentBlockProps = {
    colIndex: 0,
    itemSides: props.itemSides
};
</script>