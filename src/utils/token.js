// 设置token
export function SetToken (name, value) {
  sessionStorage.setItem(name, value)
}
// 读取token
export function GetToken (value) {
  const result = sessionStorage.getItem(value)
  return result
}
// 清除token
export function RemoveToken (value) {
  sessionStorage.removeItem(value)
}
