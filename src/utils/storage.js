// 进行设置sessionStorage
// 或是localStorage
// cookie进行设置
// 设置token
export function SetStorage (name, value) {
  sessionStorage.setItem(name, value)
}
// 读取token
export function GetStorage (value) {
  const result = sessionStorage.getItem(value)
  return result
}
// 清除token
export function RemoveStorage (value) {
  sessionStorage.removeItem(value)
}
