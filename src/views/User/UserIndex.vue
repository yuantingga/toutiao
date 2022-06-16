<template>
  <div>个人用户界面</div>
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

<style>

</style>
