<template>
  <div>
    <keep-alive>
      <MainVue></MainVue>
    </keep-alive>
  </div>
</template>

<script>
import MainVue from '@/components/Main/MainVue.vue'
export default {
  created () {
    this.$store.commit('SetRouter', '/production')
  },
  components: {
    MainVue
  }
}
</script>

<style>

</style>
