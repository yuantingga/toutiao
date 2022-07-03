const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const lesspath = path.resolve(__dirname, 'src/style/Vants.less')
module.exports = defineConfig({
  transpileDependencies: true
})
// vue.config.js
module.exports = {
  devServer: {
    headers: {
      // 允许跨域的源url地址
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      // 这里监听一个别名，下面替换掉
      '/api': { // 这里最好有一个 /
        target: 'http://c.m.163.com', // 后台接口域名
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
