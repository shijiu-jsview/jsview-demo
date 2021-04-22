<template>
  <img alt="Vue logo" src="./assets/logo.png" :style="{width:100}"/>
  <HelloWorld msg="Welcome to Your Vue.js App" :style="{top: 50, width:200}"/>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
</style>