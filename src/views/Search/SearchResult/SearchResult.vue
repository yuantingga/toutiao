<template>
  <div class="SearchResult">
    <van-nav-bar title="搜索结果" fixed  left-arrow @click-left="Back"  />
    <keep-alive>
     <MainVue></MainVue>
    </keep-alive>
  </div>
</template>

<script>
import MainVue from '@/components/Main/MainVue.vue'

export default {
  data () {
    return {
      flag: true
    }
  },
  components: {
    MainVue
  },
  created () {
    // 刷新关键字，以及Router的数据都会丢失，需要重新发送数据
    this.$store.commit('SetRouter', '/Search')
    this.$store.commit('SetValue', this.$route.params.value)
  },
  methods: {

    Back () {
      // 点击返回
      this.$router.back()
    }
  }

}
</script>

<style lang="less" scoped>
.SearchResult{
  height: 100%;
  overflow: auto;
  padding-top:  1.22667rem;
}
</style>
