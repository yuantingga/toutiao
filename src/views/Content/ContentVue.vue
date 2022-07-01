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
        <!--
          TabsList进行存储tab的所有选项数据，使用的是axios发送请求封装的UserChannels  函数进行获取
          title绑定的item.name进行选项的文本 -->
          <van-tab :name="item.id" v-for="item in TabsList" :title="item.name" :key="item.id"> </van-tab>
        </van-tabs>
        <!-- addbtn选项的是一个加号他是跳转到频道页面的路由 -->
        <div class="addBtn" @click.prevent="$router.push('/channel')">+</div>
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
import { GetToken, SetToken } from '@/utils/token'
import MainVue from '@/components/Main/MainVue.vue'
import EventBUS from '@/utils/eventBus'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Content',
  data () {
    return {
      // 获取tabs中的选项数据
      TabsList: '',
      // 保持tabs选项选中状态，如果获取不到本地缓存中的数据，那么就是使用0 作为默认值
      TabsSelect: JSON.parse(GetToken('Tab')) || 0,
      isLoading: ''
    }
  },

  // watch: {
  //   // 监听tab属性中数据变化，从而将选中中的选项发送到本地缓存中进行保存
  //   '$store.state.Tab': function (newVal) {
  //     console.log(newVal);
  //     SetToken('Tab', newVal)
  //     this.TabsSelect = newVal
  //   }
  // },

  async created () {
    try {
      // 获取tabs中的选项数据
      UserChannels().then(value => {
        this.TabsList = value.data.channels
      })

      // Router设置为/Index/Content说明是首页，Router用于区分是首页搜索页面还是历史页面中的数据
      SetToken('Router', JSON.stringify('/Index/Content'))
    } catch (error) {}
  },
  methods: {
    // 搜索小图标的点击事件
    Search () {
      // 修改本地缓存中的Router属性，用于区分显示在首页，而mainVue中的数据需要进行改变
      // 从而重新渲染组件中的数据
      // 本地缓存修改Router
      SetToken('Router', JSON.stringify('/Search'))
      // 使用store属性进行设置存储的Router属性中的数据修改为/Search
      this.$store.commit('SetRouter', '/Search')
      // 跳转页面
      this.$router.push('/Search')
    },
    Tabs (value) {
      console.log(value + '我是change事件')
      SetToken('Tab', JSON.stringify(value))
      this.$store.commit('SetTab', value)
      this.TabsSelect = value
    },
    onRefresh () {
      setTimeout(async () => {
        try {
          // 下拉刷新，获取新闻表格的数据，通过eventBus传递给传递给mainvue组件进行重新加载数据
          journalism({ channel_id: this.$store.state.Tab, timestamp: Date.now() + 1 }).then(Value => {
            EventBUS.$emit('refresh', Value.data.results)
            // 设置为false代表加载完成，没有处于加载状态
            this.isLoading = false
          })
          // this.list = res.data.results
        } catch (error) {
          console.log(error)
        }
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
