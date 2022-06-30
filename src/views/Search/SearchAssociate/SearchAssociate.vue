<template>
  <div>
    <van-cell v-for="(item,index) in options" :key="index"  :title="item" icon="search" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      options: ''
    }
  },
  activated () {
    this.options = this.$store.state.Lenovo
  }
}
</script>

<style>

</style>
