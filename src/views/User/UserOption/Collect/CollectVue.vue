<template>
  <div>
    <keep-alive>
    <MainVue></MainVue>
    </keep-alive>
  </div>
</template>

<script>
import { collectsList } from '@/api/article'
import MainVue from '@/components/Main/MainVue.vue'
export default {
  created () {
    this.$store.commit('SetRouter', '/collectsList')
  },
  components: { MainVue }
}
</script>

<style>

</style>
