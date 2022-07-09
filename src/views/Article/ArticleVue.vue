<template>
  <div class="article">
    <!-- 文章详情的头部 点击小图标进行返回 -->
    <van-nav-bar title="文章详情" left-arrow @click-left="$router.back()" />
    <!-- 加载组件的显示，等请求数据成功后才显示list组件的内容，
    当组件被缓存将show2设置为false那么点击每一个组件都会重新显示加载修改等待请求数据成功-->
    <van-loading v-if="!show2" size="24px" color="#1989fa" style="margin-top: 10px">加载中...</van-loading>
    <!-- list 用于包裹所有的新闻详细信息和评论列表内容
    v-show="show2"等待请求数据成功，才进行显示内容
     -->

    <div v-else>
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
        <ArticleConten>
          <template>
            <div class="content" v-html="html"></div>
          </template>
        </ArticleConten>
      </lazy-component>
      <!-- 分割线 -->

        <!-- 评论列表 需要传递 user.aut_photo ， user.aut_name  -->
        <div class="Discuss"  >
          <div class="title" ref="img">
            <div>全部评论({{ num }})</div>
            <div style="color: #ccc; font-sont: 15px">{{ user.like_count }}点赞</div>
          </div>

          <van-empty v-show="show" image="error" description="暂无数据" />
          <van-list  v-show="!show" style="margin: 20px 0" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <DiscussVue v-for="(item, index) in text" :key="index" :CommentInfo="item"></DiscussVue>
          </van-list>
        </div>

      <van-tabbar>
        <van-field @click="InputCilck" v-model="value1" left-icon="smile-o" placeholder="抢沙发..." />
        <van-icon name="chat-o" :badge="num" @click="discussList" />
        <van-icon @click="PraiseEvent" v-show="like" class="praise1" name="good-job" />
        <van-icon @click="PraiseEvent" v-show="!like" class="praise2" name="good-job-o" />
        <van-icon @click="starEvent" v-show="user.is_collected" class="like1" style="color: pink" name="like" />
        <van-icon @click="starEvent" v-show="!user.is_collected" class="like2" name="like-o" />
        <van-icon @click="share" name="share-o" />
      </van-tabbar>
      <!-- 分享面板 -->
      <!-- showShare -->
      <van-share-sheet v-model="showShare" title="立即分享给好友" :options="options" />
      <TextareaVue :fun="onClikcRight" position="bottom" rightText="提交" :show="show3" title="评论文章">
        <template #html>
          <van-field v-model="message" rows="2" autosize  type="textarea" maxlength="50" placeholder="请输入留言" show-word-limit />
        </template>
      </TextareaVue>
    </div>
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
import $ from 'jquery'
import TextareaVue from '@/components/textarea/TextareaVue.vue'
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
      text: [],
      // input 控制显示input还是留言框
      input: false,
      // 控制显示加载中还是文章详情内容
      show2: false,
      //  分享面板的开启于隐藏
      showShare: false,
      // 发送评论的面板弹窗
      // 评论的textarse组件的内容message
      message: '',
      show3: false,
      // 显示空状态
      show: false,
      // num用于显示全部评论的个数
      num: '',
      // 表单绑定
      value1: '',
      // 定时器的对象
      options: [
        [
          { name: '微信', icon: 'wechat' },
          { name: '朋友圈', icon: 'wechat-moments' },
          { name: '微博', icon: 'weibo' },
          { name: 'QQ', icon: 'qq' }
        ],
        [
          { name: '复制链接', icon: 'link' },
          { name: '分享海报', icon: 'poster' },
          { name: '二维码', icon: 'qrcode' },
          { name: '小程序码', icon: 'weapp-qrcode' }
        ]
      ]
    }
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
    DiscussVue,
    TextareaVue
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
      console.log(value)
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
      }
    })
  },
  methods: {

    onLoad () {
      // 评论列表的绘制
      GetComment(JSON.parse(GetStorage('art_id')))
        .then((value) => {
          this.num = value.data.results.length
          if (value.data.results.length === 0) {
            this.show = !this.show
            return
          }

          value.data.results.forEach((element) => {
            this.text.push(element)
          })
          this.loading = false
          if (this.text.length >= value.data.total_count) {
            this.finished = true
          }
        })
        .catch((value) => {
          console.log(value)
        })
    },
    // 提交评论的发送请求函数
    onClikcRight () {},
    // input的点击
    InputCilck () {
      this.show3 = true
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
      // 获取第一个评论信息组件距离页面底部的距离，滚动条向下滚动的距离就是多远
      const img = this.$refs.img.offsetTop
      console.log(img)

      const height = document.documentElement.offsetHeight || document.body.offsetHeight
      console.log(img + parseInt(height))
      const article = document.querySelector('.article')
      article.scrollTop = img + 400

      // // 屏幕的可视高度
      // const height = document.documentElement.offsetHeight || document.body.offsetHeight
      // // 进行滚动的元素
      // const article = document.querySelector('.article')
      // // 滚动的终点:使用第一条
      // const destination = img
      // if (img && destination > 0) {
      //   // 可视区域
      //   article.scrollTop = destination
      //   // roll(article, 30, 100, destination)
      //   // // 使用定时器进行进行滚动，让评论的内容滚动到可视区域内
      //   // function roll (obj, speed, num, destination) {
      //   //   clearInterval(obj.time)
      //   //   obj.time = setInterval(() => {
      //   //     const scrollTop = article.scrollTop

      //   //     if (scrollTop > destination) {
      //   //       num = -num
      //   //     }
      //   //     // eslint-disable-next-line no-mixed-operators
      //   //     if ((num > 0 && destination < scrollTop) || (num < 0 && destination > scrollTop)) {
      //   //       console.log('停止')
      //   //       clearInterval(obj.time)
      //   //     }

      //   //     obj.scrollTop = scrollTop + num
      //   //   }, speed)
      //   // }
      // }
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
      console.log(this.showShare)
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
      if (this.attention) {
        attention(this.user.aut_id).then((value) => {
          console.log(value)
          if (value === undefined) {
            this.attention = false
            hiti({ type1: 'html', message1: '自己不能关注自己' })
          }
        })
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
  background: #f1f1f1;

  /deep/.van-tabbar {
    display: flex;
    align-items: center;
    background: white !important;
    > .van-icon /deep/ {
      font-size: 25px;
      margin: 0 10px;
    }
    .like1 {
      color: pink !important;
    }
    .praise1 {
      color: crimson !important;
    }
    .van-field {
      height: 30px;
      border-radius: 15px;
      margin: 10px;
      background: #f1f1f1;

      .van-field__left-icon .van-icon {
        color: #ccc;
      }
    }
  }
  .Discuss {
    margin-top: 20px;
    background: white;
    .title {
      width: 100%;
      height: 40px;
      border-bottom: 1px solid #f1f1f1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .van-loading {
    text-align: center;
  }
  .title {
    display: flex;
    justify-content: space-between;
    background: white;
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
      justify-content: space-evenly;
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
  /deep/.van-divider {
    margin: 0;
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
/deep/.van-field__value {
    overflow: visible;
    background: #f1f1f1;
    border-radius: 5px;
    padding: 5px;
}
</style>
