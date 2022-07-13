import { axioss, ajax } from '@/api/Home.js'
import { GetToken } from '@/utils/token.js'
// 获取所有频道接口
function AllChannel () {
  return axioss({ url1: '/channels' })
}
// 获取用户频道
function UserChannels () {
  try {
    return axioss({
      url1: '/user/channels'

    })
  } catch (error) {
    console.log(error)
  }
}
// 所有频道
function AllChannels () {
  try {
    return axioss({
      url1: '/channels'
    })
  } catch (error) {
    console.log(error)
  }
}
// 修改频道
function PutChannel (obj) {
  const chang = obj.reduce((arr, ele, index) => {
    const obb = {
      id: ele.id,
      seq: index
    }
    arr.push(obb)
    return arr
  }, [])

  try {
    return axioss({
      url1: '/user/channels',
      method: 'Put',
      data: {
        channels: chang
      }

    })
  } catch (error) {
    console.log(error)
  }
}
export {
  AllChannel, UserChannels, AllChannels, PutChannel
}
