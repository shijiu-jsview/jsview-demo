<template>
  <img alt="Vue logo" src="./assets/logo.png" class="size"/>
  <HelloWorld msg="Welcome to Your Vue.js App" :style="{top: 50, width:200}"/>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import HelloWorld from './components/HelloWorld.vue'
</script>

<style scoped>
.size {
  width: 500;
}

</style>
