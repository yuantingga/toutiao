import Vue from 'vue'
import Vuex from 'vuex'
// eslint-disable-next-line no-unused-vars
import { journalism, SearchResult, histories, User } from '@/api/index.js'
// eslint-disable-next-line no-unused-vars
import { GetToken, SetToken } from '@/utils/token'
import { Toast } from 'vant'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 首页的选项
    Tab: '',
    // 用于区分是首页，搜索页面
    Route: '/Index/Content',
    // 搜索页面不断发送请求 的累加
    inn: 1,
    // 搜索关键字
    value: '',
    // 个人用户界面请求数据存储
    User: '',
    // 搜索联想数组
    Lenovo: ''
  },
  mutations: {
    SetLenovo (state, value) {
      state.Lenovo = value
    },
    // 搜索关键字
    SetValue (state, value) {
      state.value = value
    },
    // 用于区分是首页还是搜索页面
    SetRouter (state, value) {
      state.Route = value
    }

  },
  actions: {
    //  发送个人用户页面请求
    SetUser (context) {
      // 发送user用户资料请求，并将获取到的信息添加到user中
      const res = User().then(value => {
        context.state.User = value.data.results
        return value
      }).catch(value => {
        console.log(value)
      })
      return res
    },

    // mainvue组件进行区分是首页还是搜索页面，还是历史界面进行获取不同的数据绘制不同的页面
    async glideEvent (context) {
      // 缓存对象用于存储，首页和搜索页面结果镜像判断

      if (context.state.Route === '/Index/Content') {
        // 判断是首页

        const res = journalism({ channel_id: context.state.Tab, timestamp: Date.now() }).then(value => {
          return value.data.results
        }).catch()
        return res
      } else if (context.state.Route === '/Search') {
        // 判断是搜索页面
        try {
          const value = context.state.value
          const res = SearchResult({ q: value, page: context.state.inn }).then(value => {
            context.state.inn++
            return value.data.results
          }).catch()

          return res
        } catch (error) {
          Toast.fail('加载失败')
          return Error
        }
      } else if (context.state.Route === '/User/History') {
        // 历史记录页面
        try {
          const res = histories({ page: context.state.inn, per_page: 20 }).then(value => {
            return value.data.results
          })
          return res
        } catch (error) {
          Toast.fail('加载失败')
          return Error
        }
      }
    },
    // 切换tab
    async cutTab (context) {
      try {
        const res = journalism({ channel_id: context.state.Tab, timestamp: Date.now() }).then(value => {
          return value.data.results
        }).catch()
        return res
      } catch (error) {
        console.log(error)
      }
    }
  }
})
