// 请求的域名
export const baseURL = 'http://lj.tieqiao.shop'

/* 将base64转换为file */
export function dataURLtoFile (dataurl, filename) { // 将base64转换为文件
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, {
    type: mime
  })
}
