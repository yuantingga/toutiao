<template>
  <div class="app">
    <div class="indexx">
    <router-link to="Index"></router-link>
    <keep-alive>
    <router-view></router-view>
    </keep-alive>
    </div>
  </div>
</template>

<script>
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
