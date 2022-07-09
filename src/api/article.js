import { axioss, ajax } from '@/api/Home.js'
import { GetToken } from '@/utils/token.js'
// 文章内容
function GetArticle (str) {
  return axioss({
    url1: `/api/articles/${str}`,
    headers: {
      Authorization: `Bearer ${GetToken('token')}`
    }
  })
}
// 获取评论信息
function GetComment (id) {
  console.log(id)
  return axioss({
    url1: '/api/comments',
    params: {
      type: 'a',
      source: id,
      limit: 10
    }
  })
}
// 发送评论
function SendComments ({ target, content, artid }) {
  return axioss({
    url1: '/api/comments',
    method: 'post',
    data: {
      target,
      content,
      art_id: artid
    },
    headers: {
      Authorization: `Bearer ${GetToken('token')}`
    }
  })
}
// 关注
function attention (id) {
  return axioss({
    url1: '/api/user/followings',
    method: 'post',
    data: {
      target: id
    },
    headers: {
      Authorization: `Bearer ${GetToken('token')}`
    }
  })
}
// 取消关注
function NotAttention (id) {
  return axioss({
    url1: `/api/user/followings/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${GetToken('token')}`
    }
  })
}
// 点赞评论
function addLove (id) {
  return axioss({
    url1: '/api/comment/likings',
    headers: {
      Authorization: `Bearer ${GetToken('token')}`
    },
    method: 'post',
    data: {
      target: id
    }
  })
}
// 取消点赞评论
function removeLove (id) {
  return axioss({
    url1: `/api/comment/likings/${id}`,
    headers: {
      Authorization: `Bearer ${GetToken('token')}`
    },
    method: 'DELETE'

  })
}

// 收藏
function collects (id) {
  return axioss({
    url1: '/api/article/collections',
    headers: {
      Authorization: `Bearer ${GetToken('token')}`
    },
    method: 'post',
    data: {
      target: id
    }
  })
}

function collectsList (inn, num) {
  return axioss({
    url1: '/api/article/collections',
    params: {
      page: inn,
      per_page: num
    }
  })
}
// 取消收藏
function NotCollects (id) {
  return axioss({
    url1: `/api/article/collections/${id}`,
    headers: {
      Authorization: `Bearer ${GetToken('token')}`
    },
    method: 'DELETE'
  })
}
// 点赞文章于
function SetLike (id) {
  return axioss({
    url1: '/api/article/likings',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GetToken('token')}`
    },
    data: {
      target: id
    }
  })
}
// 取消点赞文章
function CancelLike (id) {
  return axioss({
    url1: `/api/article/collections/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${GetToken('token')}`
    }
  })
}
export {
  CancelLike, SetLike, NotCollects, collects, removeLove, addLove, NotAttention, attention, SendComments, GetComment
  , GetArticle, collectsList
}
