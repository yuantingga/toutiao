<template>
  <div class="User">
    <div class="header">

    </div>
    <div class="UserMain"></div>
  </div>
</template>

<script>
import { GetToken } from '@/utils/token'
export default {
  created () {
    // 获取token当他的值不存在那么就跳转到登陆界面
    if (!GetToken('token')) {
      this.$router.push('/login')
    }
  }

}
</script>

<style lang="less" scoped>
.User{
  display: flex;
  height: 100%;
  width: 100%;
  .header{
    width: 100%;
    background: blue;
    height: 250px;
  }
}
</style>
