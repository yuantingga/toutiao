import axios from '@/utils/require.js'
import $ from 'jquery'
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
