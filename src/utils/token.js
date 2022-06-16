// 设置token
export function SetToken (value) {
  sessionStorage.setItem('token', value)
}
// 读取token
export function GetToken (value) {
  return sessionStorage.getItem('token')
}
// 清除token
export function RemoveToken (value) {
  sessionStorage.removeItem('token')
}
