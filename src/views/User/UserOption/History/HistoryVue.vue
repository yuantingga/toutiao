<template>
  <div class="history">
    <MainVue></MainVue>
  </div>

</template>

<script>
import MainVue from '@/components/Main/MainVue.vue'

export default {
  created () {

  },
  activated () {
    this.$store.commit('SetRouter', '/User/History')
  },
  components: {
    MainVue
  }
}
</script>

<style lang="less" scoped>
.history{
  height: 100%;
  overflow: auto;
}
</style>
