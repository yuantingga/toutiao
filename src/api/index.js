
// eslint-disable-next-line no-unused-vars
import { axioss, ajax } from '@/api/Home.js'
import { GetToken } from '@/utils/token.js'
// import io from 'socket.io'

// 获取所有频道接口
function AllChannel () {
  return axioss({ url1: '/channels' })
}
function login ({ mobile, code }) {
  try {
    return axioss({ url1: '/authorizations', method: 'post', data: { mobile, code } })
  } catch (error) {
    console.log(error)
  }
}
function GetTabs () {
  try {
    return axioss({
      url1: '/user/channels',
      headers: {
        Authorization: `Bearer${GetToken('token')}`
      }
    })
  } catch (error) {
    console.log(error)
  }
}
function journalism (obj) {
  try {
    return axioss({
      url1: '/articles',
      headers: {
        Authorization: `Bearer ${GetToken('token')}`
      },
      params: {
        ...obj
      }
    })
  } catch (error) {
    console.log(error)
  }
}
function DisLike (obj) {
  try {
    return axioss({
      url1: '/article/dislikes',
      headers: {
        Authorization: `Bearer ${GetToken('token')}`
      },
      method: 'post',
      data: obj
    })
  } catch (error) {
    console.log(error)
  }
}
function report (obj) {
  try {
    return axioss({
      url1: '/article/dislikes',
      headers: {
        Authorization: `Bearer ${GetToken('token')}`
      },
      method: 'post',
      data: obj
    })
  } catch (error) {
    console.log(error)
  }
}
// 获取用户频道
function UserChannels () {
  try {
    return axioss({
      url1: '/user/channels',
      headers: {
        Authorization: `Bearer ${GetToken('token')}`
      }
    })
  } catch (error) {
    console.log(error)
  }
}
function AllChannels () {
  try {
    return axioss({
      url1: '/channels'
    })
  } catch (error) {
    console.log(error)
  }
}
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
      },
      headers: {
        Authorization: `Bearer ${GetToken('token')}`
      }
    })
  } catch (error) {
    console.log(error)
  }
}
function SearchResult (value) {
  try {
    return axioss({
      url1: '/search',
      params: {
        ...value
      }
    })
  } catch (error) {
    console.log(error)
  }
}
function User () {
  try {
    return axioss({
      url1: '/user',
      headers: {
        Authorization: `Bearer ${GetToken('token')}`
      }
    })
  } catch (error) {
    console.log(error)
  }
}
function UserData () {
  try {
    return axioss({
      url1: '/user/profile',
      headers: {
        Authorization: `Bearer ${GetToken('token')}`
      }
    })
  } catch (error) {
    console.log(error)
  }
}
function UserAmend (obj) {
  try {
    return axioss({
      url1: '/user/profile',
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${GetToken('token')}`
      },
      data: {
        ...obj
      }
    })
  } catch (error) {
    console.log(error)
  }
}
function Setphoto (obj) {
  try {
    return axioss({
      url1: '/user/photo',
      method: 'PATCH',
      data: obj,
      headers: {
        Authorization: `Bearer ${GetToken('token')}`
      }
    })
  } catch (error) {
    console.log(error)
  }
}

function histories () {
  try {
    return axioss({
      url1: '/user/histories',
      headers: {
        Authorization: `Bearer ${GetToken('token')}`
      }
    })
  } catch (error) {
    console.log(error)
  }
}
function GetArticle (str) {
  return axioss({
    url1: `/articles/${str}`,
    headers: {
      Authorization: `Bearer ${GetToken('token')}`
    }
  })
}
function roborApi () {
  return axioss({
    url1: '/socket.io/'

  })
}
function GetComment (id) {
  return axioss({
    url1: '/comments',
    params: {
      type: 'a',
      source: id,
      limit: 10
    }
  })
}
function SendComments ({ target, content }) {
  console.log(target)
  console.log(content)
  return axioss({
    url1: '/comments',
    method: 'post',
    data: {
      target,
      content
    },
    headers: {
      Authorization: `Bearer ${GetToken('token')}`
    }
  })
}
// 关注
function attention (id) {
  return axioss({
    url1: '/user/followings',
    method: 'post',
    data: {
      target: id
    },
    headers: {
      Authorization: `Bearer ${GetToken('token')}`
    }
  })
}
function NotAttention (id) {
  return axioss({
    url1: `/user/followings/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${GetToken('token')}`
    }
  })
}
function addLove (id) {
  return axioss({
    url1: '/comment/likings',
    headers: {
      Authorization: `Bearer ${GetToken('token')}`
    },
    method: 'post',
    data: {
      target: id
    }
  })
}
function removeLove (id) {
  return axioss({
    url1: `/comment/likings/${id}`,
    headers: {
      Authorization: `Bearer ${GetToken('token')}`
    },
    method: 'DELETE'

  })
}

// 收藏
function collects (id) {
  return axioss({
    url1: '/article/collections',
    headers: {
      Authorization: `Bearer ${GetToken('token')}`
    },
    data: {
      target: id
    }
  })
}

// 取消收藏
function NotCollects (id) {
  return axioss({
    url1: `/article/collections/${id}`,
    headers: {
      Authorization: `Bearer ${GetToken('token')}`
    },
    method: 'DELETE'
  })
}
function SetLike (id) {
  return axioss({
    url1: '/article/likings',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GetToken('token')}`
    },
    data: {
      target: id
    }
  })
}
function CancelLike (id) {
  return axioss({
    url1: `/article/collections/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${GetToken('token')}`
    }
  })
}
export {
  AllChannel, login, GetTabs, journalism, DisLike, report,
  UserChannels, AllChannels, PutChannel, SearchResult,
  User, UserData, Setphoto, UserAmend, histories, roborApi,
  GetArticle, GetComment, SendComments, attention, NotAttention,
  addLove, removeLove, collects, NotCollects, SetLike, CancelLike
}
