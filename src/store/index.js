import Vue from 'vue'
import Vuex from 'vuex'
// eslint-disable-next-line no-unused-vars
import { journalism, SearchResult } from '@/api/index.js'
// eslint-disable-next-line no-unused-vars
import { GetToken, SetToken } from '@/utils/token'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Tab: '',
    Route: GetToken('Router') || '/Index/Content',
    glide: '',
    inn: 1,
    value: ''

  },
  getters: {
  },
  mutations: {
    setTab (state, value) {
      state.Tab = value
      console.log()
    },
    SetValue (state, value) {
      state.value = value
    },
    SetRouter (state, value) {
      // 初始化数据
      console.log(value)
      state.Route = value
    }

  },
  actions: {
    async glideEvent (context) {
      console.log(context.state.Route)
      if (context.state.Route === '/Index/Content') {
        const { data: res } = await journalism({ channel_id: context.state.Tab, timestamp: Date.now() })
        return res.data.results
      } else if (context.state.Route === '/Search') {
        const { data: res } = await SearchResult({ q: context.state.value, page: 1 })
        return res.data.results
      }
    },
    async cutTab (context) {
      const { data: res } = await journalism({ channel_id: context.state.Tab, timestamp: Date.now() })
      return res.data.results
    }
  },
  modules: {
  }
})
