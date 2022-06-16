import Vue from 'vue'
import { Button, NavBar, Tabbar, TabbarItem, Form, Field, PullRefresh, Toast, Tab, Tabs, Cell, CellGroup, List, Lazyload, Image as VanImage, Loading, ActionSheet } from 'vant'

Vue.use(ActionSheet)
// 注册时可以配置额外的选项
Vue.use(Lazyload, {
  lazyComponent: true
})
Vue.use(Loading)
Vue.use(VanImage)
Vue.use(Lazyload)
Vue.use(List)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Toast)
Vue.use(PullRefresh)
Vue.use(Form)
Vue.use(Field)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(NavBar)
Vue.use(Button)
