import Vue from 'vue'
import Vuex from 'vuex'
// eslint-disable-next-line no-unused-vars
import { journalism, SearchResult } from '@/api/index.js'
// eslint-disable-next-line no-unused-vars
import { GetToken } from '@/utils/token'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Tab: parseInt(sessionStorage.getItem('Tab')) || 0,
    CellList1: '',
    IndexLoad: ''
  },
  getters: {
  },
  mutations: {
    setTab (state, value) {
      state.Tab = value
    },
    SetCellList (state, value) {
      console.log(value)
      // 初始化数据
      state.CellList1 = value
    }

  },
  actions: {
    async IndexLoadEven (context, value) {
      console.log(context)
      let d = 1552266004895
      d += 4
      const { data: res } = await journalism({ channel_id: context.state.Tab, timestamp: d })
      context.state.IndexLoad = res.data.results
    },
    async Search (context, value) {
      let d = 1
      d += 1
      const { data: res } = await SearchResult({ q: value, page: d })
      context.state.IndexLoad = res.data.results
    }
  },
  modules: {
  }
})
