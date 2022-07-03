import { Notify, Toast } from 'vant'
function hiti ({ type1, message1, background1 = '' }) {
  if (type1 === 'danger') {
    type1 = 'fail'
  }
  return Toast({
    type: type1,
    message: message1,
    background: background1
  })
}
export {
  hiti
}
