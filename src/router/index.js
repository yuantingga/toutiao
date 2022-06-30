// eslint-disable-next-line no-unused-vars
import { login, Token } from '@/api'
import { GetToken, SetToken } from '@/utils/token'
import Vue from 'vue'
import VueRouter from 'vue-router'
// 首页
const Index = () => import(/* webpackChunkName: "Index" */ '@/views/index/indexView.vue')

//  登陆首页加载
const Login = () => import(/* webpackChunkName: "Login" */ '@/views/Login/LoginIndex.vue')
// 首页中间部分内容
const Content = () => import(/* webpackChunkName: "Index" */ '@/views/Content/ContentVue.vue')

// 个人用户界面
const User = () => import(/* webpackChunkName: "User" */'@/views/User/UserIndex.vue')

// 需要在首页，历史记录，搜索页面进行使用
const Main = () => import(/* webpackChunkName: "Main" */'@/components/Main/MainVue.vue')

// 频道页面
const channel = () => import(/* webpackChunkName: "channel" */'@/views/channel/channelVue.vue')

// 搜索关键字页面
const Search = () => import(/* webpackChunkName: "Search" */'@/views/Search/SearchVue.vue')

// 搜索结果页面
const SearchResult = () => import(/* webpackChunkName: "SearchResult" */'@/views/Search/SearchResult/SearchResult.vue')

// 搜索，历史，小四的头部绘制
const UserOption = () => import(/* webpackChunkName: "User" */'@/views/User/UserOption/UserOption.vue')

// 文章详情页面
const Article = () => import(/* webpackChunkName: "Article" */'@/views/Article/ArticleVue.vue')

Vue.use(VueRouter)

const routes = [
  // 路由重定向
  { path: '/', redirect: '/Index' },
  // 首页
  {
    path: '/Index',
    component: Index,
    children: [
      //  重定向到/个人用户界面，
      { path: '/', redirect: '/Index/User' },
      // 首页加载显示
      // 首页新闻页面
      {
        path: '/Index/Content',
        component: Content,
        children: [
          // 首页的tab是进行切换显示不同的main组件
          {
            path: '/Index/Content/:id', component: Main
          }]
      },
      // 个人用户界面，
      {
        path: '/Index/User',
        component: User

      }
    ]
  },
  // 用户界面的编辑，历史，小四
  { path: '/User/:id', component: UserOption },
  // 登陆页面
  {
    path: '/login',
    component: Login,

    beforeEnter: (to, from, next) => {
      if (!GetToken('token')) {
        next()
      }
    }
  },
  // 频道页面
  {
    path: '/channel',
    component: channel
  },
  // 搜索页面
  {
    path: '/Search',
    component: Search
  },
  // 文章页面
  { path: '/article/:number', component: Article },
  // 搜索结果页面
  { path: '/Search/:value', component: SearchResult }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// 导航路由用于判断token的状态
// 为空那么跳转到登陆页面
// 如果是正确的那么就跳转到首页面
// 如果是过期，那么在响应拦截器中继续无感知更新token
router.beforeEach(async (to, from, next) => {
  if (to.path !== '/login' && !GetToken('token')) {
    // 这里是token被清空
    next('/login')
  } else if (to.path === '/login' && GetToken('token') && GetToken('err') === 'true') {
    // token是正确的，但是不能跳转到login页面
    next('Index/Content')
  } else {
    next()
  }
})
export default router
