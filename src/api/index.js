
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
      Authorization: `Bearer${GetToken('token')}`
    }
  })
}
function journalism (obj) {
  return axioss({
    url1: '/articles',
    headers: {
      Authorization: `Bearer ${GetToken('token')}`
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
      Authorization: `Bearer ${GetToken('token')}`
    },
    method: 'post',
    data: obj
  })
}
function report (obj) {
  return axioss({
    url1: '/article/dislikes',
    headers: {
      Authorization: `Bearer ${GetToken('token')}`
    },
    method: 'post',
    data: obj
  })
}
// 获取用户频道
function UserChannels () {
  return axioss({
    url1: '/user/channels',
    headers: {
      Authorization: `Bearer ${GetToken('token')}`
    }
  })
}
function AllChannels () {
  return axioss({
    url1: '/channels'
  })
}
function PutChannel (obj) {
  const chang = obj.reduce((arr, ele, index) => {
    const obb = {
      id: ele.id,
      seq: index
    }
    arr.push(obb)
    return arr
  }, [])
  console.log(chang)
  return axioss({
    url1: '/user/channels',
    method: 'Put',
    data: {
      channels: chang
    },
    headers: {
      Authorization: `Bearer ${GetToken('token')}`
    }
  })
}
function SearchResult (value) {
  return axioss({
    url1: '/search',
    params: {
      ...value
    }
  })
}
// articles
export {
  AllChannel, login, GetTabs, journalism, DisLike, report, UserChannels, AllChannels, PutChannel, SearchResult
}
