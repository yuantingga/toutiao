<template>
  <div class="UserOption">
    <van-nav-bar :title="title"  left-arrow   @click-left="onClickLeft" />
    <component :is="$route.params.id"></component>
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
  // title用于显示导航条底部的标题内容的文字
  activated () {
    this.title = GetToken('title')
  },
  methods: {
    // 点击返回到新闻界面
    async onClickLeft () {
      this.$router.push('/Index/User')
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
