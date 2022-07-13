<template>
  <div class="app">
    <div class="indexx">
    <router-link to="Index"></router-link>
    <keep-alive exclude="EditVue,HistoryVue,SmallFour,SearchVue,Article">
      <router-view></router-view>
    </keep-alive>
    </div>
  </div>
</template>

<script>
import { fangxiang } from '@/api/index'
const jsonBigint = require('json-bigint')

export default {
  created () {
    // ({storeAsString:true})已字符串的形式输出，而不是以bigNumber进行输出
    const str = '[{"id":1302900300041101987}]'
    const nnn = JSON.parse(str)
    const num = jsonBigint.parse(str)
  },
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
