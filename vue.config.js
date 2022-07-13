const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const lesspath = path.resolve(__dirname, 'src/style/Vants.less')
module.exports = defineConfig({
  transpileDependencies: true
})
// 配置cnd
// vue.config.js

let cdn = { css: [], js: [] }
// 通过环境变量 来区分是否使用cdn
console.log(process.env.NODE_ENV === 'development')
const isDev = process.env.NODE_ENV === 'development' // 判断是否是开发环境
let externals = {}
if (!isDev) {
  // 如果是非开发环境 就排除打包 否则不排除
  externals = {
    // key(包名) / value(这个值 是 需要在CDN中获取js, 相当于 获取的js中 的该包的全局的对象的名字)
	   vue: 'Vue', // 后面的名字不能随便起 应该是 js中的全局对象名
	  'vue-router': 'VueRouter',
	   moment: 'moment',
    'ant-design-vue': 'antd',
	   axios: 'axios',
    jquery: '$',
    'vue-lazyload': 'VueLazyload',
    bignumber: 'bignumber',
    vuex: 'Vuex',
    nprogress: 'NProgress',
    'highlight.js': 'highlight.js'
  }
  cdn = {
	  css: [
      'https://cdn.jsdelivr.net/npm/ant-design-vue@1.7.2/dist/antd.min.css', // 提前引入ant design vue样式
      'https://cdn.bootcdn.net/ajax/libs/nprogress/0.2.0/nprogress.css',
      '//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/default.min.css'

	  ], // 放置css文件目录
	  // eslint-disable-next-line no-tabs
	  js: [
      'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js', // vuejs
      'https://cdn.jsdelivr.net/npm/vue-router@3.2.0/dist/vue-router.min.js',
      'https://cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js', // 必须先引入moment，否则报错“TypeError: Cannot read property 'default' of undefined”
      'https://cdn.jsdelivr.net/npm/moment@2.29.1/locale/zh-cn.js', // 需同步引入语言包，否则日期选择控件等将默认显示为英文
      'https://cdn.jsdelivr.net/npm/ant-design-vue@1.7.2/dist/antd.min.js', // ant design vue
      'https://cdn.jsdelivr.net/npm/axios@0.21.0/dist/axios.min.js',
      'https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js',
      'https://cdn.bootcdn.net/ajax/libs/vue-lazyload/3.0.0-rc.2/vue-lazyload.js',
      'https://cdn.bootcdn.net/ajax/libs/bignumber.js/9.0.2/bignumber.js',
      'https://cdn.bootcdn.net/ajax/libs/vuex/2.4.1/vuex.js',
      'https://cdn.bootcdn.net/ajax/libs/nprogress/0.2.0/nprogress.js',
      '//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/highlight.min.js'
	  ]// 放置js文件目录
  }
}

// vue.config.js
module.exports = {

  configureWebpack: {
    // 排除打包的某些选项
    externals: externals
  },
  chainWebpack: config => {
    //  注入cdn的变量到index.html中
    config.plugin('html').tap((arg) => {
      arg[0].cdn = cdn
      return arg
    })
  },
  // 优化访问css
  publicPath: './',
  // 可以设置成相对路径，这样所有的资源都会被链接为相对路径，打出来的包可以被部署在任意路径
  outputDir: 'dist',
  // 打包时生成的生产环境构建文件的目录
  assetsDir: 'public',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  devServer: {
    headers: {
      // 允许跨域的源url地址
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      // 这里监听一个别名，下面替换掉
      '/api': { // 这里最好有一个 /
        target: 'http://geek.itheima.net/v1_0', // 后台接口域名
        // ws: true, // 如果要代理 webSockets，配置这个参数
        // secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/api': '' // 替换成
        }
      }
    }
  },
  css: {
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        lessOptions: {
          modifyVars: {
            // 直接覆盖变量
            'text-color': '#111',
            'border-color': '#eee',
            // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
            hack: `true; @import "${lesspath}";`
          }
        }
      }
    }
  }
}
