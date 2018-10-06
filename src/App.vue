<template>
  <b-container
    id="app"
    fluid>
    <b-row>
      <side />
      <router-view />
    </b-row>
  </b-container>
</template>

<script>
import Side from '@/views/Sidebar'
export default {
  components: {
    Side
  }

}
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>
