<template>
  <div class="content" @scroll="Rolloffset" ref="content">
    <div class="Header">
      <!-- <van-nav-bar>

         <template #left>
          <div class="Headerleft">
          <img  src="../../assets/toutiao_logo.4653c8be.png" alt="" />
          </div>
        </template>

        <template #right>
          <span  @click="Search" style="color:white">
            <van-icon name="search" />
          </span>
        </template>
      </van-nav-bar> -->

      <div class="Tabs">
        <van-tabs v-model="TabsSelect" @change="Tabs" animated>
          <!--
          TabsList进行存储tab的所有选项数据，使用的是axios发送请求封装的UserChannels  函数进行获取
          title绑定的item.name进行选项的文本 -->
          <van-tab :name="item.id" v-for="item in TabsList" :title="item.name" :key="item.id"> </van-tab>
        </van-tabs>
        <!-- addbtn选项的是一个加号他是跳转到频道页面的路由 -->
        <div class="addBtn0" @click="Search">
          <van-icon name="search" />
        </div>
        <div class="addBtn" @click.prevent="actionClick">
          <van-icon name="wap-nav" />
        </div>
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
    <van-popup @opened="OpenEvent" v-model="show" closeable close-icon="close" position="left" :style="{ height: '100%', width: '100%' }">
     <keep-alive>
       <ChannelVue></ChannelVue>
     </keep-alive>
    </van-popup>
  </div>
</template>

<script>
import { journalism, UserChannels } from '@/api/index'
import { SetStorage, RemoveSetStorage, GetStorage } from '@/utils/storage.js'
import MainVue from '@/components/Main/MainVue.vue'
import EventBUS from '@/utils/eventBus'
import ChannelVue from '../channel/channelVue.vue'
import $ from 'jquery'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Content',
  data () {
    return {
      // 获取tabs中的选项数据
      TabsList: '',
      // 保持tabs选项选中状态，如果获取不到本地缓存中的数据，那么就是使用0 作为默认值
      TabsSelect: JSON.parse(GetStorage('Tab')) || 0,
      isLoading: '',
      flag: false,
      show: false,
      value: ''
    }
  },
  watch: {
    '$store.state.UserChannels': function (newval) {
      console.log(newval)
      this.TabsList = newval
    }
  },
  async created () {
    try {
      // 获取tabs中的选项数据
      UserChannels().then((value) => {
        this.TabsList = value.data.channels
      })
      SetStorage('Router', JSON.stringify('/Index/Content'))
      EventBUS.$on('cut', value => {
        this.value = value
      })
    } catch (error) {}
  },

  methods: {
    OpenEvent () {
      this.$nextTick(() => {
        const index = JSON.parse(GetStorage('Tab'))
        console.log(document.querySelector('.ChannelSeparation div'))
        console.log()
        if (this.value === '') return
        // eslint-disable-next-line array-callback-return
        this.value.some((ele, inn) => {
          if (ele.id === index) {
            const div = [...document.querySelectorAll('.ChannelSeparation div')]
            div.forEach(ele => {
              ele.style.color = 'black'
            })
            document.querySelectorAll('.ChannelSeparation div')[inn].style.color = '#fc6627'
          }
        })
      })
    },
    actionClick () {
      this.show = !this.show
    },
    // 滚动节流函数 flag:false
    Rolloffset (e) {
      if (this.flag === false) {
        this.flag = setTimeout(() => {
          this.$store.commit('SetRollOffset', e.target.scrollTop)
          this.flag = false
        }, 1000)
      }
    },

    // 搜索小图标的点击事件
    Search () {
      // 修改本地缓存中的Router属性，用于区分显示在首页，而mainVue中的数据需要进行改变
      // 从而重新渲染组件中的数据
      // 本地缓存修改Router
      SetStorage('Router', JSON.stringify('/Search'))
      // 使用store属性进行设置存储的Router属性中的数据修改为/Search
      this.$store.commit('SetRouter', '/Search')
      // 跳转页面
      this.$router.push('/Search')
    },
    Tabs (value) {
      console.log(value + '我是change事件')
      SetStorage('Tab', JSON.stringify(value))
      this.$store.commit('SetTab', value)
      this.TabsSelect = value
    },
    onRefresh () {
      setTimeout(async () => {
        try {
          // 下拉刷新，获取新闻表格的数据，通过eventBus传递给传递给mainvue组件进行重新加载数据
          journalism({ channel_id: this.$store.state.Tab, timestamp: Date.now() + 1 }).then((Value) => {
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
    MainVue,
    ChannelVue
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
      .addBtn,
      .addBtn0 {
        position: absolute;
        width: 40px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        background: #fff;
        font-size: 20px;
      }
      .addBtn {
        top: 0px;
        right: 0;
      }
      .addBtn0 {
        right: 40px;
        top: 0px;
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
