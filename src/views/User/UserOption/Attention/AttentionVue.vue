<template>
  <div>
    <van-tabs v-model="active">
      <van-tab title="我的关注">
        <keep-alive>
           <ListVue :keyword="active"></ListVue>
        </keep-alive>
      </van-tab>
      <van-tab title="我的粉丝">
        <keep-alive>
          <ListVue :keyword="active"></ListVue>
        </keep-alive>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import ListVue from '@/components/fans/ListVue.vue'

export default {
  data () {
    return {
      active: ''
    }
  },
  components: {
    ListVue
  }
}
</script>

<style lang="less" scoped>
/deep/.van-tabs__nav--line {
  width: 200px;
}
</style>
