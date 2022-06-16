
// eslint-disable-next-line no-unused-vars
import { axioss, ajax } from '@/api/Home.js'
import { GetToken } from '@/utils/token.js'
// 获取所有频道接口
function AllChannel () {
  return axioss({ url1: '/channels' })
}
function login ({ mobile, code }) {
  return axioss({ url1: '/authorizations', method: 'post', data: { mobile, code } })
}
function GetTabs () {
  return axioss({
    url1: '/user/channels',
    headers: {
      Authorization: `Bearer${GetToken()}`
    }
  })
}
function journalism (obj) {
  return axioss({
    url1: '/articles',
    headers: {
      Authorization: `Bearer ${GetToken()}`
    },
    params: {
      ...obj
    }
  })
}
function DisLike (obj) {
  return axioss({
    url1: '/article/dislikes',
    headers: {
      Authorization: `Bearer ${GetToken()}`
    },
    method: 'post',
    data: obj
  })
}
function report (obj) {
  return axioss({
    url1: '/article/dislikes',
    headers: {
      Authorization: `Bearer ${GetToken()}`
    },
    method: 'post',
    data: obj
  })
}
// articles
export {
  AllChannel,
  login,
  GetTabs,
  journalism,
  DisLike,
  report
}
