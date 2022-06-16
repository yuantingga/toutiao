// 设置token
export function SetToken (name, value) {
  sessionStorage.setItem(name, value)
}
// 读取token
export function GetToken (value) {
  return sessionStorage.getItem(value)
}
// 清除token
export function RemoveToken (value) {
  sessionStorage.removeItem(value)
}
