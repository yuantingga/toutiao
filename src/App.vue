<template>
  <div class="app">
    <div class="indexx">
    <router-link to="Index"></router-link>
    <keep-alive exclude="ChannelVue,EditVue,HistoryVue,SmallFour,SearchVue">
      <router-view></router-view>
    </keep-alive>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {

    }
  }

}
</script>
<style lang="less" scoped>
.app{
  width: 100%;
  height: 100%;
  overflow: hidden;

  .indexx{
    height: 100%;
  }
}
</style>
