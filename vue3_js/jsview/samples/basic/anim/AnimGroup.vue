<template>
    <div id='item-root'>
        <ContentBlock :=contentBlockProps :index=1 title="Keyframe基础动画集合" :style="{ top: (itemSides.height * 0)+'px' }">
            <AnimKeyframeBasic/>
        </ContentBlock>
        <ContentBlock :=contentBlockProps :index=2 title="Keyframe组合示例" :style="{ top: (itemSides.height * 1)+'px' }">
            <AnimKeyframeComposite/>
        </ContentBlock>
        <ContentBlock :="{...contentBlockProps, itemSides: {...itemSides, height:290}}" :index=3 title="Transition动画示例" :style="{ top: (itemSides.height * 2)+'px'}">
            <AnimTransition :timeCount=state.timeCount />
        </ContentBlock>
    </div>

</template>

<script setup>
import { defineProps, reactive, onMounted, onBeforeUnmount } from "vue";
import ContentBlock from '../ContentBlock';
import AnimKeyframeBasic from './AnimKeyframeBasic';
import AnimKeyframeComposite from './AnimKeyframeComposite';
import AnimTransition from './AnimTransition';

const name = 'DivGroup2';
const props = defineProps({
  contentSize: Object,
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

</script>

<script jsv-style>
const contentBlockProps = {
    colIndex: 0,
    contentSize: props.contentSize,
    itemSides: props.itemSides
};
</script>