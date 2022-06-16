import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '@/views/index/indexView.vue'
import Login from '@/views/Login/LoginIndex.vue'
import Content from '@/views/Content/ContentVue.vue'
import User from '@/views/User/UserIndex.vue'
import Main from '@/views/Content/Main/MainVue.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/Index' },
  {
    path: '/Index',
    component: Index,
    children: [
      { path: '/', redirect: '/Index/Content' },
      {
        path: '/Index/Content',
        component: Content,
        children: [

          {
            path: '/Index/Content/:id', component: Main
          }]
      },
      { path: '/Index/User', component: User }
    ]
  },
  { path: '/login', component: Login }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
