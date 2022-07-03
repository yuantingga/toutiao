<template>
  <div class="article">
    <!-- 文章详情的头部 点击小图标进行返回 -->
    <van-nav-bar title="文章详情" left-arrow @click-left="$router.replace('/Index/Content')" />
    <!-- 加载组件的显示，等请求数据成功后才显示list组件的内容，
    当组件被缓存将show2设置为false那么点击每一个组件都会重新显示加载修改等待请求数据成功-->
    <van-loading v-show="!show2" size="24px" color="#1989fa" style="margin-top: 10px">加载中...</van-loading>
    <!-- list 用于包裹所有的新闻详细信息和评论列表内容
    v-show="show2"等待请求数据成功，才进行显示内容
     -->

    <van-list v-show="show2" v-model="loading" ref="list" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <!-- 头部   -->
      <div class="title">
        <div class="header">
          <div class="img">
            <van-image :src="user.aut_photo" width="100%" height="100%">
              <template v-slot:error>加载失败</template>
            </van-image>
            <!-- <img width="100%" :src="user.aut_photo" alt="" /> -->
          </div>
          <div class="text">
            <span>{{ user.aut_name }}</span>
            <span>{{ user.pubdate }}</span>
          </div>
        </div>
        <div class="concern" @click.prevent="attentionEvent">
          <van-tag v-if="attention" type="primary">已关注</van-tag>
          <van-tag v-else plain type="primary">+关注</van-tag>
        </div>
      </div>

      <van-divider />
      <!-- 中间内容 -->
      <lazy-component>
        <ArticleConten @click.prevent="contentEvent">
          <template>
            <div class="content" v-html="html"></div>
          </template>
        </ArticleConten>
      </lazy-component>
      <!-- 分割线 -->
      <van-divider dashed>end</van-divider>
      <!-- 点赞部分 -->
      <div class="praise" @click.prevent="PraiseEvent">
        <van-tag v-if="like" type="danger"> <van-icon name="good-job-o" />点赞 </van-tag>
        <van-tag v-else plain type="danger"> <van-icon name="good-job-o" />已点赞 </van-tag>
      </div>

      <!-- 评论列表 需要传递 user.aut_photo ， user.aut_name  -->
      <DiscussVue ref="img" v-for="(item, index) in text" :key="index" :CommentInfo="item"></DiscussVue>

      <!-- 底部导航，进行发布评论分享收藏等 -->
      <van-tabbar ref="tabbar">
        <div v-show="input === true">
          <textarea placeholder="友善评论，理想发言，阳光心灵" v-focus ref="textarea" name="" id="" cols="30" rows="10"></textarea>
          <span @click.prevent="addDiscuss">发送</span>
        </div>
        <div v-show="input === false">
          <van-icon name="arrow-left" @click.prevent="$router.back()" />

          <input type="text" @focus="FocusEvent" placeholder="发表评论" />
          <div class="icon">
            <van-badge :content="text.length">
              <van-icon name="comment-o" @click.prevent="discussList" />
            </van-badge>
            <div @click.prevent="starEvent">
              <van-icon v-if="this.user.is_collected" color="yellow" name="star" />
              <van-icon v-else name="star-o" />
            </div>
            <van-icon name="share-o" @click.prevent="share" />
          </div>
        </div>
      </van-tabbar>
    </van-list>

    <!-- 分享面板 -->
    <van-share-sheet v-model="showShare" title="立即分享给好友" :options="options" />
  </div>
</template>

<script>
// import $ from 'jquery'
import { hiti } from '@/utils/hint'
import ArticleConten from '@/views/Article/ArticleConten.vue'
// eslint-disable-next-line no-unused-vars
import { GetArticle, GetComment, SendComments, attention, NotAttention, collects, NotCollects, SetLike, CancelLike } from '@/api/index.js'

import DiscussVue from '@/components/discuss/discussVue.vue'
import { SetStorage, RemoveSetStorage, GetStorage } from '@/utils/storage.js'

export default {
  data () {
    return {
      // 文章详情主体文本内容
      html: '',
      // list组件
      list: [],
      loading: false,
      finished: false,
      // 文章信息对象进行绘制
      user: '',
      // 收藏的切换
      star: '',
      // 关注于取消关注之间的切换
      attention: '',
      // 点赞
      like: false,
      // 评论信息的获取，通过传递给组件进行遍历评论
      text: '',
      // input 控制显示input还是留言框
      input: false,
      // 控制显示加载中还是文章详情内容
      show2: false,
      //  分享面板的开启于隐藏
      showShare: false,
      // 分享面板内容

      obj: {},
      // 定时器的对象
      options: [
        [
          { name: '微信', icon: 'wechat' },
          { name: '朋友圈', icon: 'wechat-moments' },
          { name: '微博', icon: 'weibo' },
          { name: 'QQ', icon: 'qq' }
        ]
      ]
    }
  },
  created () {
    // 获取评论信息
    GetComment(JSON.parse(GetStorage('art_id')))
      .then((value) => {
        if (value) {
          this.text = value.data.results
        } else {
          this.show2 = true
          hiti({ type1: 'danger', message1: '加载失败' })
          this.$router.back()
          hiti.clear()
        }
      })
      .catch((value) => {
        console.log(value)
      })
    console.log('文章组件激活')
  },
  // 自动获取焦点指令
  directives: {
    focus: {
      update (el, val) {
        el.focus()
      }
    }
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    ArticleConten,
    DiscussVue
  },
  // 组件缓存
  deactivated () {
    // 控制显示加载中还是文章详情内容
    this.show2 = false
  },
  // 组件激活
  async activated () {
    this.html = ''
    GetArticle(JSON.parse(GetStorage('art_id'))).then((value) => {
      if (value) {
        // 主体文本内容
        this.html = value.data.content
        // 关注的状态
        this.attention = value.data.is_followed
        // 存储res返回的星星
        this.user = value.data
        // 小星星的状态收藏的状态
        this.star = value.data.is_collected
        // 控制显示加载中还是文章详情内容
        this.show2 = true
      } else {
        this.show2 = true
        hiti({ type1: 'danger', message1: '加载失败' })
      }
    })
  },
  methods: {
    contentEvent () {
      console.log('内容点击')
    },
    onLoad () {
      // 拉到最底下显示没有更多数据
      this.finished = true
    },
    // 表单获取焦点进行切换为留言框
    FocusEvent () {
      this.input = !this.input
    },
    // 留言框失去焦点切换回去
    loadEvent () {
      this.input = false
    },
    // 发送评论
    async addDiscuss () {
      const target = JSON.parse(GetStorage('art_id'))
      const content = this.$refs.textarea.value.trim()
      const artid = JSON.parse(GetStorage('art_id'))
      if (content !== '') {
        SendComments({ target, content, artid }).then((value) => {
          this.text.unshift(value.data.new_obj)
        })
        this.$refs.textarea.value = ''
        this.input = false
      } else {
        hiti({ type1: 'html', message1: '文本为空' })
        this.$refs.textarea.value = ''
        this.input = false
      }
    },

    // 评论显示个数点击滑动到评论底部
    discussList () {
      console.log('点击')
      // 获取第一个评论信息组件距离页面底部的距离，滚动条向下滚动的距离就是多远
      const img = this.$refs.img[0]
      const height = document.documentElement.offsetHeight || document.body.offsetHeight
      // 进行滚动的元素
      const article = document.querySelector('.article')
      // 滚动的终点:使用第一条
      const destination = img.$el.offsetTop + img.$el.offsetHeight
      if (img && destination > 0) {
        // 可视区域
        roll(article, 30, 100, destination)
        // 使用定时器进行进行滚动，让评论的内容滚动到可视区域内
        function roll (obj, speed, num, destination) {
          clearInterval(obj.time)
          obj.time = setInterval(() => {
            const scrollTop = article.scrollTop

            if (scrollTop > destination) {
              num = -num
            }
            // eslint-disable-next-line no-mixed-operators
            if ((num > 0 && destination < scrollTop) || (num < 0 && destination > scrollTop)) {
              clearInterval(obj.time)
            }
            obj.scrollTop = scrollTop + num
          }, speed)
        }
      }
    },
    // 收藏于取消收藏的点击事件
    starEvent () {
      this.user.is_collected = !this.user.is_collected
      if (this.user.is_collected) {
        collects(this.user.art_id)
      } else {
        // 取消收藏
        NotCollects(this.user.art_id)
      }
    },
    // 分享小图标显示于隐藏分享面板
    share () {
      this.showShare = !this.showShare
    },

    // 点赞于取消点赞事件
    PraiseEvent () {
      this.like = !this.like
      console.log(this.like)
      if (this.like) {
        SetLike(this.user.art_id)
      } else {
        // 取消点赞
        CancelLike(this.user.art_id)
      }
    },
    // 关注于取消关注点击事件
    attentionEvent () {
      this.attention = !this.attention
      console.log(this.attention)
      if (this.attention) {
        attention(this.user.aut_id)
      } else {
        NotAttention(this.user.aut_id)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.article {
  height: 100%;
  overflow: auto;
  font-size: 16px;
  width: 100%;
  .van-loading {
    text-align: center;
  }
  .title {
    display: flex;
    justify-content: space-between;
    padding: 5px;
    align-items: center;
    .header {
      display: flex;
      align-items: center;
      .text {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
      }
    }
    .concern {
      div {
        background: plum;
        padding: 5px 10px;
        border-radius: 5px;
        color: white;
      }
    }
    .img {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      overflow: hidden;
    }
  }
  .content {
    height: 100%;
    padding: 10px;
  }
  .praise {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    .van-tag {
      padding: 10px;
    }
  }
  .comment {
    display: flex;
    flex-direction: column;
    padding: 10px;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        span {
          margin-left: 10px;
        }
        .img {
          width: 40px;
          height: 40px;
        }
      }
    }
    .content {
      margin-left: 50px;
      padding: 0;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      span {
        &:last-child {
          font-size: 12px;
          color: grey;
        }
      }
    }
  }
  .van-tabbar {
    height: inherit;
    background: cornflowerblue;
    div {
      display: flex;
      align-items: center;
      padding: 7px 0;
      justify-content: space-evenly;
      width: 100%;
      textarea {
        height: 70px;
        background: white;
        padding: 5px;
        border-radius: 10px;
      }
      span {
        color: white;

        width: 70px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .van-icon {
        font-size: 20px;
        color: white;
        margin-left: 5px;
      }
      input {
        background: white;
        margin-left: 10px;
        height: 40px;
        border-radius: 20px;
        padding-left: 20px;
      }
      .icon {
        flex: 1;
        display: flex;
        .van-icon {
          margin: 0 15px;
        }
      }
    }
  }
  .ActionContent {
    display: flex;
    flex-direction: column;
    overflow: auto;
    padding: 10px;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        span {
          margin-left: 10px;
        }
        .img {
          width: 40px;
          height: 40px;
        }
      }
    }
    .content {
      margin-left: 50px;
      padding: 0;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      span {
        &:last-child {
          font-size: 12px;
          color: grey;
        }
      }
    }
  }
}
.van-list {
  padding-bottom: 61px;
}
.van-nav-bar {
  position: sticky;
  top: 0;
}
</style>
