<template>
  <div id="app">
    <div id="nav">
      <Navbar/>
    </div>
    <transition name="el-fade-in-linear" mode="out-in">
    <router-view :key="$route.fullPath"/>
    </transition>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
    name: 'app',
  components: {
    Navbar
  }
}
</script>

<style lang="scss">
*{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
  color: unset;
}

textarea{
  font-family: Avenir, Helvetica, Arial, sans-serif;
  resize: none!important;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.el-avatar>img {
    width: 100%;
    object-position:50% 50%;
}

</style>
