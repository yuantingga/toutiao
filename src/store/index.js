import Vue from 'vue'
import Vuex from 'vuex'
// eslint-disable-next-line no-unused-vars
import { journalism, SearchResult } from '@/api/index.js'
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
    value: ''

  },
  mutations: {
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
      // 初始化数据
      state.Route = value
    }

  },
  actions: {
    async glideEvent (context) {
      // 缓存对象用于存储，首页和搜索页面结果镜像判断

      if (context.state.Route === '/Index/Content') {
        // 判断是首页
        const { data: res } = await journalism({ channel_id: context.state.Tab, timestamp: Date.now() })
        return res.data.results
      } else if (context.state.Route === '/Search') {
        // 判断是搜索页面
        const value = context.state.value
        const { data: res } = await SearchResult({ q: value, page: context.state.inn })
        context.state.inn++
        return res.data.results
      }
    },
    // 切换tab
    async cutTab (context) {
      const { data: res } = await journalism({ channel_id: context.state.Tab, timestamp: Date.now() })
      return res.data.results
    }
  },
  modules: {
  }
})
