<template>
  <div class="article">
    <van-nav-bar title="文章详情" left-arrow @click-left="$router.push('/Index/Content')" />
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div class="title">
        <div class="header">
          <div class="img">

             <van-image :src="user.aut_photo"   width="100%">
                 <template v-slot:error>加载失败</template>
              </van-image>
          <!-- <img width="100%" :src="user.aut_photo" alt="" /> -->

          </div>
          <div class="text">
            <span>{{ user.aut_name }}</span>
            <span>{{ user.pubdate }}</span>
          </div>
        </div>
        <div class="concern" @click="attentionEvent">
          <van-tag v-if="attention"  type="primary">已关注</van-tag>
          <van-tag v-else plain type="primary">+关注</van-tag>

        </div>
      </div>
      <van-divider />
      <ArticleConten>
        <template>
          <div class="content" v-html="html"></div>
        </template>
      </ArticleConten>
      <van-divider dashed>end</van-divider>
      <div class="praise" @click="ListEvent">
        <van-tag v-if="like" type="danger">  <van-icon name="good-job-o" />点赞 </van-tag>
        <van-tag v-else plain type="danger">  <van-icon name="good-job-o" />已点赞 </van-tag>
      </div>

      <!-- 评论列表 需要传递 user.aut_photo ， user.aut_name  -->
      <DiscussVue v-for="(item,index) in text" :key="index" :CommentInfo="item" ></DiscussVue>
      <van-tabbar ref="tabbar">
        <div v-show="input === true">
          <textarea placeholder="友善评论，理想发言，阳光心灵" v-focus
          ref="textarea" name="" id="" cols="30" rows="10" @blur="loadEvent"></textarea>
           <span  @click="addDiscuss">发送</span>

        </div>
        <div v-show="input === false">
          <van-icon name="arrow-left" />
          <input type="text" @focus="FocusEvent" placeholder="发表评论" />
          <div class="icon">
            <van-badge :content="text.length">
              <van-icon name="comment-o" @click="discussList" />
            </van-badge>
            <div @click="starEvent">
              <van-icon v-if="this.user.is_collected" color="yellow" name="star" />
              <van-icon v-else name="star-o" />
            </div>
            <van-icon name="share-o" @click="share" />
          </div>
        </div>
      </van-tabbar>
    </van-list>
    <van-share-sheet v-model="showShare" title="立即分享给好友" :options="options" />
    <van-action-sheet v-model="show" :title="'评论('+text.length+')'">
      <div class="ActionContent">
        <!-- <van-list v-model="loading2" :finished="finished2" finished-text="没有更多了" @load="onLoad2"> -->
       <DiscussVue v-for="(item,index) in text" :key="index" :CommentInfo="item" ></DiscussVue>
        <!-- </van-list> -->
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import ArticleConten from '@/views/Article/ArticleConten.vue'
// eslint-disable-next-line no-unused-vars
import { GetArticle, GetComment, SendComments, attention, NotAttention, collects, NotCollects, SetLike, CancelLike } from '@/api/index.js'
import { Toast } from 'vant'
import DiscussVue from '@/components/discuss/discussVue.vue'
export default {
  data () {
    return {
      html: '',
      list: [],
      user: '',
      star: '',
      attention: '',
      like: false,
      loading: false,
      loading2: false,
      finished: false,
      finished2: false,
      text: '',
      input: false,
      show: false,
      commentList: '',
      showShare: false,
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
  async created () {
    const { data: res } = await GetComment(this.$route.params.id)

    this.text = res.data.results
    console.log('评论列表')
    console.log(this.text)
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
  async activated () {
    this.html = ''
    try {
      const { data: res } = await GetArticle(this.$route.params.id)
      console.log(res.data)

      this.html = res.data.content
      this.attention = res.data.is_followed
      this.user = res.data
      this.star = res.data.is_collected
    } catch (error) {
      Toast.fail('加载失败')
    }
  },
  methods: {
    loadEvent () {
      this.input = !this.input
    },
    async addDiscuss () {
      const target = this.$route.params.id
      const content = this.$refs.textarea.value
      const { data: res } = await SendComments({ target, content })
      this.text.unshift(res.data.new_obj)
      // 进行添加
      this.$refs.textarea.value = ''
      this.input = !this.input
    },
    // 表单获取焦点进行切换为留言框
    FocusEvent () {
      this.input = !this.input
    },
    share () {
      this.showShare = !this.showShare
    },
    discussList () {
      if (this.text.length > 0) {
        this.show = !this.show
      }
    },
    async  starEvent () {
      this.user.is_collected = !this.user.is_collected
      if (this.user.is_collected) {
        // 收藏
        const { data: res } = await collects(this.user.art_id)
        console.log(res)
      } else {
        // 取消收藏
        const { data: res } = await NotCollects(this.user.art_id)
        console.log(res)
      }
    },

    onLoad () {
      this.finished = true
    },
    onLoad2 () {
      this.finished2 = true
    },
    async ListEvent () {
      this.like = !this.like
      console.log(this.like)
      if (this.like) {
        const { data: res } = await SetLike(this.user.art_id)
        console.log(res)
      } else {
        // 取消点赞
        const { data: res } = await CancelLike(this.user.art_id)
        console.log(res)
      }
    },
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
  font-size: 16px ;
  width: 100%;

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
    background:cornflowerblue;
    div {
      display: flex;
      align-items: center;
      padding: 7px 0;
      justify-content: space-evenly;
      width: 100%;
      textarea{
        height: 70px;
        background: white;
        padding: 5px;
        border-radius: 10px;
      }
      span{
        color: white;
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
