<template>
  <div class="UserOption">
    <van-nav-bar :title="title"  left-arrow   @click-left="onClickLeft" />

    <keep-alive>
      <component :is="$route.params.id"></component>
    </keep-alive>
  </div>
</template>

<script>
import { GetToken } from '@/utils/token'
import Edit from '@/views/User/UserOption/Edit/EditVue.vue'
import History from '@/views/User/UserOption/History/HistoryVue.vue'
import SmallFour from '@/views/User/UserOption/SmallFour/SmallFour.vue'
import Fans from '@/views/User/UserOption/Fans/FansVue.vue'
// import { User } from '@/api/index.js'
export default {
  data () {
    return {
      title: ''
    }
  },
  activated () {
    this.title = GetToken('title')
    this.$store.commit('SetRouter', '/User/History')
  },
  methods: {
    async onClickLeft () {
      this.$router.push('/Index/User')
      // 重新发送请求渲染页面
      if (this.$route.path === '/User/Edit') {
        //

      }
    }
  },
  components: {
    Edit,
    History,
    SmallFour,
    Fans
  }
}
</script>
<style lang="less" scoped>
.UserOption{
  height: 100%;
  width: 100%;
}
</style>
