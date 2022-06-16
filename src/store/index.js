import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Tab: sessionStorage.getItem('Tab') || 0
  },
  getters: {
  },
  mutations: {
    setTab (state, value) {
      state.Tab = value
    }
  },
  actions: {

  },
  modules: {
  }
})
