import { axioss, ajax } from '@/api/Home.js'
import { GetToken } from '@/utils/token.js'
// 搜索页面进行发送请求
function SearchResult (value) {
  try {
    return axioss({
      url1: '/search',
      params: {
        ...value
      }
    })
  } catch (error) {
    console.log(error)
  }
}
function SearchLenovo (value) {
  return axioss({
    url1: '/suggestion',
    params: {
      q: value
    }
  })
}
export {
  SearchResult, SearchLenovo
}
