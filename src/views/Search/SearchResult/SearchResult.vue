<template>
  <div>
    <van-nav-bar title="标题"  left-arrow @click-left="$router.back()"  />
    <keep-alive>
        <MainVue></MainVue>
    </keep-alive>
  </div>
</template>

<script>
import MainVue from '@/views/Content/Main/MainVue.vue'
export default {
  components: {
    MainVue
  }
}
</script>

<style></style>
