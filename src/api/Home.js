import axios from '@/utils/require.js'
import $ from 'jquery'
import router from '@/router/index.js'
import { Token } from '@/api'
import { GetToken, RemoveToken, SetToken } from '@/utils/token'

axios.interceptors.response.use(function (config) {
  return Promise.resolve(config.data)
}, async function (err) {
  // 响应还未报错跳转页面
  if (err.response.status === 401) {
    // 由于区分token是正确还是错误的
    SetToken('err', 'false')
    // 获取新的token
    const { data: res } = await Token()
    SetToken('token', res.token)
    axios(err.config)
    SetToken('err', 'true')
  }
})
axios.interceptors.request.use(function (config) {
  if (GetToken('err') === 'true') {
    config.headers.Authorization = `Bearer ${GetToken('token')}`
  } else {
    config.headers.Authorization = `Bearer ${GetToken('refresh_token')}`
  }
  return config
})
function axioss ({ url1, method = 'get', data = {}, headers = {}, params = {} }) {
  return axios({
    url: url1,
    method,
    data,
    params,
    headers
  })
}

function ajax ({ url, method = 'get', data = {}, headers = {}, params = {} }) {
  url += '?'
  for (const item in params) {
    // eslint-disable-next-line no-unused-vars
    url += `${item}=${params[item]}&`
  }
  return new Promise((resolve, reject) => {
    $.ajax({
      url,
      type: method,
      data,
      headers,
      success: function (res) {
        return resolve(res)
      },
      error: function (res) {
        return reject(res)
      }

    })
  })
}
export {
  axioss,
  ajax
}
