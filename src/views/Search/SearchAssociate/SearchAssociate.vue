<template>
  <div>
    <van-cell @click.prevent="SearchResult(item)" v-for="(item,index) in options" :key="index"  :title="item" icon="search" />
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import { SetStorage, RemoveSetStorage, GetStorage } from '@/utils/storage.js'
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
      let arr = JSON.parse(GetStorage('history'))
      if (!arr) {
        arr = []
        arr.push(item)
      } else {
        const flag = arr.some(ele => item === ele)
        if (flag) return
        arr.push(item)
      }

      // 将this.history添加到本地缓存中，刷新搜索页面不会丢失历史记录
      SetStorage('history', JSON.stringify(arr))
      eventBus.$emit('LenoveClick')
      this.$store.commit('SetValue', item)
      this.$router.push(`/Search/${item}`)
    }
  }
}
</script>

<style>

</style>
