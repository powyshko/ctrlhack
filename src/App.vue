<template>
  <div id="app">
    <h1>Default</h1>

    <the-default-log />

    <h1>Vuex</h1>

    <the-vuex-log />
  </div>
</template>

<script>
import TheDefaultLog from './components/TheDefaultLog.vue';
import TheVuexLog from './components/TheVuexLog.vue'

export default {
  name: 'App',
  components: { TheDefaultLog, TheVuexLog }
};
</script>

<style lang="scss"></style>
