<template>
  <div class="content">
    <div class="Header">
      <van-nav-bar>
        <!-- 左侧logo -->
        <template #left>
          <div class="Headerleft">
            <img src="../../assets/toutiao_logo.4653c8be.png" alt="" />
          </div>
        </template>
        <!-- 右侧搜索 -->
        <template #right>
          <span class="iconfont icon-sousuo1" @click="Search" style="color:white"></span>
        </template>
      </van-nav-bar>

      <div class="Tabs">
        <van-tabs v-model="TabsSelect" @change="Tabs" animated>
          <van-tab :name="item.id" v-for="item in TabsList" :title="item.name" :key="item.id"> </van-tab>
        </van-tabs>
        <div class="addBtn" @touchstart.prevent="$router.push('/channel')">+</div>
      </div>
    </div>
    <!-- 新闻信息列表组件封装，使用的是$stope中的数据进行发送网络请求进行遍历数据生成新闻列表 -->
    <div class="main">
      <van-pull-refresh v-model="isLoading" success-text="刷新成功" @refresh="onRefresh">
      <keep-alive>
        <MainVue></MainVue>
      </keep-alive>
      </van-pull-refresh>
    </div>

  </div>
</template>

<script>
import { journalism, UserChannels } from '@/api/index'
import { SetToken } from '@/utils/token'
import MainVue from '@/components/Main/MainVue.vue'
import EventBUS from '@/utils/eventBus'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Content',
  data () {
    return {
      TabsList: '',
      // 保持tabs选项选中状态，如果获取不到本地缓存中的数据，那么就是使用0 作为默认值
      TabsSelect: parseInt(sessionStorage.getItem('Tab')) || 0,
      isLoading: ''
    }
  },

  watch: {
    '$store.state.Tab': function (newVal) {
      SetToken('Tab', newVal)
      this.TabsSelect = newVal
    }
  },

  async created () {
    try {
      // 获取tabs中的选项数据
      const { data: res } = await UserChannels()
      this.TabsList = res.data.channels
      SetToken('Router', JSON.stringify('/Index/Content'))
    } catch (error) {}
  },
  methods: {
    Search () {
      SetToken('Router', JSON.stringify('/Search'))
      this.$store.commit('SetRouter', '/Search')
      this.$router.push('/Search')
    },
    Tabs (value) {
      // 将tabs发送选项状态的变化存储在本地缓存中使刷新页面并不会丢失选中元素
      sessionStorage.setItem('Tab', value)
      // 传递到stope对象中用于发送不同的数据进行渲染页面
      this.$store.commit('setTab', value)
      // 并将tabs的选中元素进行切换
      this.TabsSelect = parseInt(sessionStorage.getItem('Tab'))
    },
    onRefresh () {
      setTimeout(async () => {
        const { data: res } = await journalism({ channel_id: this.$store.state.Tab, timestamp: Date.now() + 1 })
        // this.list = res.data.results

        EventBUS.$emit('refresh', res.data.results)
        this.isLoading = false
      }, 1000)
    }
  },
  components: {
    MainVue
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding-bottom: 50px;
  .Header {
    position: sticky;
    top: 0;
    width: 100%;
    z-index: 10;
    .Tabs {
      position: relative;
      padding-right: 30px;
      .addBtn {
        position: absolute;
        width: 50px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0px;
        right: 0;
        background: white;
        font-size: 18px;
      }
    }
    .Headerleft {
      height: 100%;
      img {
        height: 100%;
      }
    }
  }
  .main {
    width: 100%;

  }
}
</style>
