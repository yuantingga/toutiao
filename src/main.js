import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/style/reset.css'
import '@/plugins/index.js'
import '@/utils/flexble.js'
import axios from 'axios'

Vue.config.productionTip = false
Vue.directive('focue', { Inserted: function (e) { e.focus() } })
Vue.filter('descriptor', function (value) {
  function formattingDate (value) {
    const d = Date.now() / 1000 - new Date(value).getTime() / 1000
    const dd = d / 60 / 60 / 24 / 365 > 0 ? parseInt(d / 60 / 60 / 24 / 365) + '年前' : parseInt(d / 60 / 60 / 24 / 12) + '月前'
    return dd
  }

  return `${value.aut_name} ${value.comm_count} 评论 ${formattingDate(value.pubdate)}`
})
Vue.filter('day', function (value) {
  const d = new Date(value)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDay()}`
})
// 代理转发
axios({
  url: 'api/nc/article/headline/T1348647853363/0-40.html'
}).then(value => {
  console.log(value)
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
