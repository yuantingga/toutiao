<template>
  <div class="UserOption">
    <van-nav-bar :title="title"  left-arrow    @click-left.prevent="onClickLeft" />
   <keep-alive>
     <component :is="$route.params.id"></component>
   </keep-alive>
  </div>
</template>

<script>
import { SetStorage, RemoveSetStorage, GetStorage } from '@/utils/storage.js'
import Edit from '@/views/User/UserOption/Edit/EditVue.vue'
import History from '@/views/User/UserOption/History/HistoryVue.vue'
import SmallFour from '@/views/User/UserOption/SmallFour/SmallFour.vue'
import dynamic from '@/views/User/UserOption/Dynamic/dynamicVue.vue'
import collect from '@/views/User/UserOption/Collect/CollectVue.vue'
import attention from '@/views/User/UserOption/Attention/AttentionVue.vue'

import Information from '@/views/User/UserOption/Information/InformationVue.vue'
import showreel from '@/views/User/UserOption/Showreel/ShowreelVue.vue'
import feedback from '@/views/User/UserOption/feedback/feedbackVue.vue'
// 动态dynamic

// 关注
// 粉丝
// import { User } from '@/api/index.js'
export default {
  data () {
    return {
      title: ''
    }
  },
  // title用于显示导航条底部的标题内容的文字
  activated () {
    this.title = GetStorage('title')
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
    dynamic,
    collect,
    attention,
    Information,
    showreel,
    feedback
  }
}
</script>
<style lang="less" scoped>
.UserOption{
  height: 100%;
  width: 100%;
  overflow: auto;
}
</style>
