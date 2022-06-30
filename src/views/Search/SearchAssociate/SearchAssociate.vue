<template>
  <div>
    <van-cell @click="SearchResult(item)" v-for="(item,index) in options" :key="index"  :title="item" icon="search" />
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import { GetToken, SetToken } from '@/utils/token'
export default {
  data () {
    return {
      options: ''
    }
  },
  activated () {
    this.options = this.$store.state.Lenovo
  },
  methods: {
    SearchResult (item) {
      const arr = JSON.parse(GetToken('history'))
      const flag = arr.some(ele => item === ele)
      if (!flag) {
        arr.push(item)
      }
      // 将this.history添加到本地缓存中，刷新搜索页面不会丢失历史记录
      SetToken('history', JSON.stringify(arr))
      eventBus.$emit('LenoveClick')
      this.$store.commit('SetValue', item)
      this.$router.push(`/Search/${item}`)
    }
  }
}
</script>

<style>

</style>
