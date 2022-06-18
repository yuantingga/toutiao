<template>
  <div class="SearchResult">
    <van-nav-bar title="标题"  left-arrow @click-left="Back"  />
    <MainVue></MainVue>
  </div>
</template>

<script>
import MainVue from '@/views/Content/Main/MainVue.vue'
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
    console.log(this.$route)
  },
  methods: {
    Back () {
      this.$router.back()
    }
  }

}
</script>

<style lang="less" scoped>
.SearchResult{
  height: 100%;
  overflow: auto;
}
</style>
