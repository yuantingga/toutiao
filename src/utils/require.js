import axios from 'axios'
const wPath = window.document.location.href
console.log()

const ajax = axios.create({
  // 自定义的ajax就是axios对象

  baseURL: 'http://geek.itheima.net/v1_0' // 请求根路径
})
console.log('12345')

// 导出ajax
export default ajax
