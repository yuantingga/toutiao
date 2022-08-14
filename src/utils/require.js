import axios from 'axios'
const wPath = window.document.location.href
console.log()

const ajax = axios.create({
  // 自定义的ajax就是axios对象

  baseURL: 'http://localhost:8080' // 请求根路径
})

// 导出ajax
export default ajax
