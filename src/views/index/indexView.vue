<template>
  <div class="index">
    <!-- 路由跳转 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>

    <van-tabbar v-model="active" @change="onChange">
      <van-tabbar-item name="/Index/Content" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item name="/Index/User" icon="setting-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import EventBus from '@/utils/eventBus'
import { GetToken } from '@/utils/token'
// import { GetToken } from '@/utils/token.js'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Index',
  data () {
    return {
      active: this.$route.path
    }
  },
  created () {
    EventBus.$on('UserClick', value => {
      this.active = value
    })
  },

  methods: {
    // 点击首页和我的进行切换路由，双向数据绑定active中的值
    // 底部导航的变化
    onChange (value) {
      if (GetToken('token')) {
        this.active = value
        this.$router.push(value)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.index {
  width: 100%;
  height: 100%;

   /deep/.van-tabbar--fixed{
    position: sticky;
    bottom: 0;
  }
}
.icon-sousuo1 {
  color: white;
  font-size: 18px;
}
</style>
