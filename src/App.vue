<template style="background-color:#FFFFFB">
  <b-container
    id="app"
    fluid>
    <b-row>
      <b-col
        md="4"
        sm="12">
        <side/>
      </b-col>
      <b-col
        md="8"
        sm="12">
        <router-view/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Side from '@/views/Sidebar'
import Upload from '@/views/Upload'

export default {
  components: {
    Side,
    Upload
  }

}
</script>

<style lang="scss">
  @import url(//fonts.googleapis.com/earlyaccess/notosanstc.css);

  #app {
    font-family: 'Noto Sans TC', sans-serif;
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
