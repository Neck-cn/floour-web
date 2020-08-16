<template>
  <div id="app">
<!--    <keep-alive>-->
<!--      <router-view v-if="$route.meta.keepAlive"></router-view>-->
<!--    </keep-alive>-->
    <router-view></router-view>
    <van-tabbar v-model="selected">
      <van-tabbar-item icon="cart">
        送货
      </van-tabbar-item>
      <van-tabbar-item icon="clock">
        统计
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      selected: 0,
    }
  }, watch: {
    selected(val) {
      if (val === 0) {
        this.$router.replace('/SendGood')
      } else if (val === 1) {
        this.$router.replace('/Account')
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/*a {*/
/*  color: #42b983;*/
/*}*/
</style>
