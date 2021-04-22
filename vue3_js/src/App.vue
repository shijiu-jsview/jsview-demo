<template>
  <img alt="Vue logo" src="./assets/logo.png" :style="{width:'400px'}"/>
  <HelloWorld msg="Welcome to Your Vue.js App" :style="{top: '50px', width:'400px'}"/>
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