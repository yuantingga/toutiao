import { axioss, ajax } from '@/api/Home.js'
import { GetToken } from '@/utils/token.js'

// user进行获取，用于设置个人用户界面的信息，关注人数，动态人数，头像等信息
function User () {
  try {
    return axioss({
      url1: '/user'

    })
  } catch (error) {
    console.log(error)
  }
}
// 编辑用户资料界面用户数据
function UserData () {
  try {
    return axioss({
      url1: '/user/profile'

    })
  } catch (error) {
    console.log(error)
  }
}
// 个人用户界面点击确认就行发送请求修改name，以及生日面板中就行修改日期
function UserAmend (obj) {
  try {
    return axioss({
      url1: '/user/profile',
      method: 'PATCH',
      data: {
        ...obj
      }
    })
  } catch (error) {
    console.log(error)
  }
}
// 个人用户界面 上传头像修改
function Setphoto (obj) {
  try {
    return axioss({
      url1: '/user/photo',
      method: 'PATCH',
      data: obj

    })
  } catch (error) {
    console.log(error)
  }
}
// 历史记录的新闻请求
function histories () {
  try {
    return axioss({
      url1: '/user/histories'

    })
  } catch (error) {
    console.log(error)
  }
}
export {
  User, UserData, UserAmend, Setphoto, histories
}
