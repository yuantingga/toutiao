import { axioss, ajax } from '@/api/Home.js'
import { GetToken } from '@/utils/token.js'
// 首页推荐，新闻界面的数据
function journalism (obj) {
  try {
    return axioss({
      url1: '/articles',

      params: {
        ...obj
      }
    })
  } catch (error) {
    console.log(error)
  }
}

// 或是所有切换tab的文本
function GetTabs () {
  try {
    return axioss({
      url1: '/user/channels'

    })
  } catch (error) {
    console.log(error)
  }
}

// 对文章不感兴趣
function DisLike (obj) {
  try {
    return axioss({
      url1: '/article/dislikes',

      method: 'post',
      data: obj
    })
  } catch (error) {
    console.log(error)
  }
}

// 举报文章
function report (obj) {
  try {
    return axioss({
      url1: '/article/dislikes',

      method: 'post',
      data: obj
    })
  } catch (error) {
    console.log(error)
  }
}

export {
  journalism, GetTabs, DisLike, report
}
