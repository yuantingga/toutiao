<template>
  <div class="article">
    <!-- 文章详情的头部 点击小图标进行返回 -->
    <van-nav-bar title="文章详情" left-arrow @click-left="Back" />
    <!-- 加载组件的显示，等请求数据成功后才显示list组件的内容，
    当组件被缓存将show2设置为false那么点击每一个组件都会重新显示加载修改等待请求数据成功-->
    <van-skeleton v-if="!show2" title :row="7" />
    <van-skeleton v-if="!show2" title :row="7" />
    <!-- <van-loading  size="24px" color="#1989fa" style="margin-top: 10px">加载中...</van-loading> -->
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
          </div>
        </div>
        <div class="concern" @click.prevent="attentionEvent">
          <van-tag v-if="attention" type="primary">已关注</van-tag>
          <van-tag v-else plain type="primary">+关注</van-tag>
        </div>
      </div>

      <van-divider />
      <!-- 中间内容 -->

      <ArticleConten>
        <template>
          <div class="content" v-html="html"></div>
        </template>
      </ArticleConten>

      <div class="articleFlood">
        发布文章时间 <span>{{ user.pubdate }}</span>
      </div>
      <!-- 分割线 -->

      <!-- 评论列表 需要传递 user.aut_photo ， user.aut_name  -->
      <div class="Discuss">
        <div class="title" ref="img">
          <div>全部评论({{ num }})</div>
          <div style="color: #ccc; font-sont: 15px">{{ user.like_count }}点赞</div>
        </div>

        <van-empty v-if="show" image="error" description="还没有评论哦" />
        <van-list v-else style="margin: 20px 0" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <DiscussVue @changedId="ChangedId" @NumberEvent="numberEvent"   v-for="(item, index) in text" :key="index" :CommentInfo="item"></DiscussVue>
        </van-list>
      </div>

      <van-tabbar>
        <van-field @click.prevent="InputCilck" disabled v-model="value1" left-icon="smile-o" placeholder="抢沙发..." />
        <div class="ico"><van-icon name="chat-o" :badge="num" @click="discussList" />评论</div>
        <div class="ico" v-show="like"><van-icon @click="PraiseEvent" class="praise1" name="good-job" />点赞</div>
        <div class="ico" v-show="!like"><van-icon @click="PraiseEvent" class="praise2" name="good-job-o" />点赞</div>
        <div class="ico" v-show="user.is_collected"><van-icon @click="starEvent" class="like1" style="color: pink" name="like" />收藏</div>
        <div class="ico" v-show="!user.is_collected"><van-icon @click="starEvent" class="like2" name="like-o" />收藏</div>
        <div class="ico"><van-icon @click="share" name="share-o" />分享</div>
      </van-tabbar>
      <!-- 分享面板 -->
      <!-- showShare -->
      <van-share-sheet v-model="showShare" title="立即分享给好友" :options="options" />

    </div>
    <TextareaVue @BackEvent="GetBack" position="bottom" rightText="发布" title="评论文章" :show="show3" :fun="onClikcRight">
        <template #html>
          <van-field v-focue v-model="message" rows="2" autosize type="textarea" maxlength="100" placeholder="请输入留言" show-word-limit />
        </template>
      </TextareaVue>
  </div>
</template>

<script>
// import $ from 'jquery'
import { hiti, clear } from '@/utils/hint'
import ArticleConten from '@/views/Article/ArticleConten.vue'
// eslint-disable-next-line no-unused-vars
import { GetArticle, GetComment, SendComments, attention, NotAttention, collects, NotCollects, SetLike, CancelLike, CommentList } from '@/api/index.js'

import DiscussVue from '@/components/discuss/discussVue.vue'
import { SetStorage, RemoveSetStorage, GetStorage } from '@/utils/storage.js'
import $ from 'jquery'
import TextareaVue from '@/components/textarea/TextareaVue.vue'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Article',
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
      // 用于显示骨架的样式
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
      num: 0,
      // 表单绑定
      value1: '',
      // onload的再次加载
      last_id: '',
      // 外层评论的个数
      total_count: '',
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
    this.text = []
    this.num = 0
  },

  // 组件激活
  async created () {
    this.html = ''

    // 第一次加载才进行显示骨架，底二次点击不进行显示
    const artid = JSON.parse(GetStorage('art_id'))
    this.loading = false

    if (JSON.parse(GetStorage(`${artid}`))) {
      const value = JSON.parse(GetStorage(`${artid}`))

      // 主体文本内容
      this.html = value.content
      // 关注的状态
      this.attention = value.is_followed
      // 存储res返回的星星
      this.user = value
      // 小星星的状态收藏的状态
      this.star = value.is_collected
      // 控制显示加载中还是文章详情内容
      this.show2 = true
    } else {
      //
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

          SetStorage(JSON.parse(GetStorage('art_id')), JSON.stringify(value.data))
        }
      })
    }
    this.getComment()
  },
  methods: {
    getComment () {
      GetComment(JSON.parse(GetStorage('art_id')), 'a').then((value) => {
        this.text = value.data.results
        if (this.text.length === 0) {
          this.show = true
          return
        }
        this.num = value.data.results.reduce((num, ele) => {
          num += 1 + ele.reply_count

          return num
        }, 0)
        console.log(this.num)
        console.log(value.data.results)
        this.last_id = value.data.last_id
        this.total_count = value.data.total_count
        if (this.text.length >= this.total_count) {
          this.finished = true
        }
      })
    },
    ChangedId (id) {
      console.log('比较id' + id)
      this.text.forEach(ele => {
        if (ele.com_id === id) {
          ele.reply_count = this.num
        }
      })
    },
    numberEvent (value) {
      this.num += 1
    },
    GetBack (value) {
      this.show3 = value
    },
    Back () {
      this.$router.back()
      this.show3 = false
    },
    onLoad () {
      const type = 'a'
      const source = this.$route.params.number
      const offset = this.last_id
      const limit = 10
      if (this.text.length >= this.total_count) {
        this.finished = true
        return
      }
      CommentList({ type, source, offset, limit })
        .then((value) => {
          console.log(value.data)

          value.data.results.forEach((element) => {
            this.text.push(element)
          })

          const totalcount = value.data.total_count
          if (this.text.length === totalcount) {
            this.finished = true
          } else {
            const offset = value.data.results[value.data.results.length - 1].com_id

            CommentList({ type, source, offset, limit }).then(value => {
              console.log(value.data.results)
              value.data.results.forEach(ele => {
                this.text.push(ele)
              })
              console.log(this.text.length)
              console.log(totalcount)
              if (this.text.length >= totalcount) {
                this.finished = true
              }
            })
          }
        })
        .catch((value) => {
          console.log(value)
        })
    },
    // 提交评论的发送请求函数
    async onClikcRight () {
      const { data: res } = await SendComments({ target: this.user.art_id, content: this.message, artid: null })
      hiti({ type1: 'loading', message1: '发布中' })
      this.num++
      this.message = ''
      clear()
      this.show = false
      this.show3 = false
      this.text = []
      this.getComment()
    },
    // input的点击
    InputCilck () {
      this.show3 = true
      console.log('点击')
      console.log(this.show3)
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
      if (img > height) {
        article.scrollTop = img - height / 2
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
  .van-skeleton {
    margin-top: 20px;
  }
  .articleFlood {
    display: flex;
    justify-content: flex-end;
    background: white;
    padding: 10px;
    color: #ccc;
    font-size: 14px;
  }
  /deep/.van-tabbar {
    display: flex;
    align-items: center;
    background: white !important;

    > .van-icon /deep/ {
      font-size: 30px;
      margin: 0 10px;
      color: black;
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
    margin-bottom: 50px;

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
      width: 56px;
      height: 56px;
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
    padding-bottom: 0;
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
        font-size: 25px;
        color: black;
        margin-left: 5px;
      }
      input {
        background: white;
        margin-left: 10px;
        height: 40px;
        padding: 10px;
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
.ico {
  display: flex;
  flex-direction: column;
  width: 2.86667rem;
  color: black;
  align-items: center;
  .van-icon {
    font-size: 25px;
  }
}
</style>
