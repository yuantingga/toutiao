import axios from 'axios'

const ajax = axios.create({
  // 自定义的ajax就是axios对象
  baseURL: 'http://geek.itheima.net/v1_0' // 请求根路径
})

// 导出ajax
export default ajax
