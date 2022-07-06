import { axioss, ajax } from '@/api/Home.js'
import { GetToken } from '@/utils/token.js'
// 获取重置token
function Token () {
  return axioss({
    url1: '/api/authorizations',
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GetToken('refresh_token')}`
    },
    data: {
      refresh_token: GetToken('refresh_token')
    }
  })
}
// 登陆接口
function login ({ mobile, code }) {
  try {
    return axioss({ url1: '/api/authorizations', method: 'post', data: { mobile, code } })
  } catch (error) {
    console.log(error)
  }
}
export {
  Token, login
}
