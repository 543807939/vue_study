<template>
  <div id="app">
    <my-todo></my-todo>
  </div>
</template>

<script>
import todoList from './components/Todolist.vue'
export default {
  name: 'App',
  components: {
    'my-todo': todoList,
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
