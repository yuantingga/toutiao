import Vue from 'vue'
import Vuex from 'vuex'
// eslint-disable-next-line no-unused-vars
import { journalism, SearchResult, histories, User } from '@/api/index.js'
// eslint-disable-next-line no-unused-vars
import { GetToken, SetToken } from '@/utils/token'

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
    User: '',
    dialogUser: ['我是编程小王子'],
    robot: ['你好，我是小思'],
    Discuss: ''

  },
  mutations: {
    addDiscuss (state, value) {
      state.Discuss = value
    },
    setDialogUser (state, value) {
      state.dialogUser.push(value)
    },
    setRobot (state, value) {
      state.robot.push(value)
    },
    // 首页的选中是哪一个
    setTab (state, value) {
      state.Tab = value
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
    async SetRobot () {
      // const {data:res} =await
    },
    async SetUser (context) {
      const { data: res } = await User()
      context.state.User = res.data.results
      return res
    },
    async glideEvent (context) {
      // 缓存对象用于存储，首页和搜索页面结果镜像判断

      if (context.state.Route === '/Index/Content') {
        // 判断是首页
        try {
          const { data: res } = await journalism({ channel_id: context.state.Tab, timestamp: Date.now() })
          return res.data.results
        } catch (error) {

        }
      } else if (context.state.Route === '/Search') {
        // 判断是搜索页面
        try {
          const value = context.state.value
          const { data: res } = await SearchResult({ q: value, page: context.state.inn })
          context.state.inn++
          return res.data.results
        } catch (error) {
          console.log(error)
        }
      } else if (context.state.Route === '/User/History') {
        try {
          const { data: res } = await histories({ page: context.state.inn, per_page: 20 })

          return res.data.results
        } catch (error) {

        }
      }
    },
    // 切换tab
    async cutTab (context) {
      try {
        const { data: res } = await journalism({ channel_id: context.state.Tab, timestamp: Date.now() })
        return res.data.results
      } catch (error) {
        console.log(error)
      }
    }
  },
  modules: {
  }
})
