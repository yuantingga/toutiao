// eslint-disable-next-line no-unused-vars
import { GetToken } from '@/utils/token'
import Vue from 'vue'
import VueRouter from 'vue-router'

// import { GetToken } from '@/utils/token'
// // 首页新闻加载
// import Index from '@/views/index/indexView.vue'
const Index = () => import(/* webpackChunkName: "Index" */ '@/views/index/indexView.vue')

// // 登陆首页加载
// import Login from '@/views/Login/LoginIndex.vue'
const Login = () => import(/* webpackChunkName: "Login" */ '@/views/Login/LoginIndex.vue')
// import Content from '@/views/Content/ContentVue.vue'
const Content = () => import(/* webpackChunkName: "Index" */ '@/views/Content/ContentVue.vue')

// import User from '@/views/User/UserIndex.vue'
const User = () => import(/* webpackChunkName: "User" */'@/views/User/UserIndex.vue')

// // 需要在首页，历史记录，搜索页面进行使用
// import Main from '@/components/Main/MainVue.vue'
const Main = () => import(/* webpackChunkName: "Main" */'@/components/Main/MainVue.vue')

// import channel from '@/views/channel/channelVue.vue'
const channel = () => import(/* webpackChunkName: "channel" */'@/views/channel/channelVue.vue')

// import Search from '@/views/Search/SearchVue.vue'
const Search = () => import(/* webpackChunkName: "Search" */'@/views/Search/SearchVue.vue')

// import SearchResult from '@/views/Search/SearchResult/SearchResult.vue'
const SearchResult = () => import(/* webpackChunkName: "SearchResult" */'@/views/Search/SearchResult/SearchResult.vue')

// import UserOption from '@/views/User/UserOption/UserOption.vue'
const UserOption = () => import(/* webpackChunkName: "User" */'@/views/User/UserOption/UserOption.vue')

// import Article from '@/views/Article/ArticleVue.vue'
const Article = () => import(/* webpackChunkName: "Article" */'@/views/Article/ArticleVue.vue')

Vue.use(VueRouter)

const routes = [
  // 路由重定向
  { path: '/', redirect: '/Index' },
  {
    path: '/Index',
    component: Index,
    children: [
      // 路由重定向到user中
      { path: '/', redirect: '/Index/User' },
      // 首页加载显示
      {
        path: '/Index/Content',
        component: Content,
        children: [
          // 首页的tab是进行切换显示不同的main组件
          {
            path: '/Index/Content/:id', component: Main
          }]
      },
      {
        path: '/Index/User',
        component: User

      }
    ]
  },
  { path: '/User/:id', component: UserOption },
  { path: '/login', component: Login },
  { path: '/channel', component: channel },
  {
    path: '/Search',
    component: Search
  },
  { path: '/article/:id', component: Article },
  { path: '/Search/:value', component: SearchResult }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  // 请求拦截器实现token没有或是token 401跳转到login页面
  // 我们只需要解决tokne存在且要去往login页面的问题
  if (to.path !== '/login' && !GetToken('token')) {
    // token为空，
    next('/login')
  } else if (to.path === '/login' && GetToken('token') && GetToken('err') === 'false') {
    // 此时是不能跳转过去
    next(from.path)
  } else {
    next()
  }
})
export default router
