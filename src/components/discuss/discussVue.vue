<template>
  <!-- 评论消息的组件 -->
  <div class="comment">
    <div class="header">
      <div class="title">
        <div class="img">
          <van-image :src="list.aut_photo" height="100%" width="100%">
            <template v-slot:error>加载失败</template>
          </van-image>
          <!-- <img :src="CommentInfo.aut_photo" alt="" /> -->
        </div>
        <span>{{ list.aut_name }}</span>
      </div>
      <div class="love" @click.prevent="CutLove">
        <span style="margin-right: 5px">{{ num }}</span>
        <van-icon v-if="love" color="red" name="like" />
        <van-icon v-else name="like-o" />
      </div>
    </div>
    <div class="content">
      <!-- 评论的文本 -->
      <p style="color: rgb(102, 102, 102); font-size: 21px">{{ list.content }}</p>
      <!-- 评论的时间 -->
    </div>
    <div class="reply">
      <div @click="replyEvent">
        <div v-if="inn1 == 0"></div>
        <div v-else>{{ inn1 }}</div>回复
        <van-icon name="arrow" />
      </div>
      <span>{{ list.pubdate | countDown }}</span>
    </div>
    <TextareaVue @BackEvent="GetBack" position="right" rightText="" :show="show" :title="number+'条回复'" >
      <template #html>
        <div class="Text">
          <div class="header">
            <div class="title">
              <div class="img">
                <van-image :src="list.aut_photo" height="100%" width="100%">
                  <template v-slot:error>加载失败</template>
                </van-image>
                <!-- <img :src="CommentInfo.aut_photo" alt="" /> -->
              </div>
              <span>{{ list.aut_name }}</span>
            </div>
            <div>关注</div>
          </div>
          <div class="content">
            <!-- 评论的文本 -->
            <p style="color: rgb(102, 102, 102); font-size: 21px; margin-bottom: 6px">{{ list.content }}</p>
            <div class="floot">
              {{ list.pubdate | countDown }}
              <div>
                <div class="love" @click.prevent="CutLove">
                  <span style="margin-right: 5px">{{ num }}</span>
                  <van-icon v-if="love" color="red" name="like" />
                  <van-icon v-else name="like-o" />
                </div>
              </div>
            </div>
            <!-- 评论的时间 -->
          </div>
        </div>
        <div class="TextContent">
          <h1>全部评论</h1>
          <van-empty v-if="show2" description="还没有人评论哦" />
          <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <div v-for="(item, index) in list2" :key="index" class="againDiscuss">
              <AgainDiscuss :discuss="item"></AgainDiscuss>
            </div>
          </van-list>
        </div>
      </template>
      <template #tabbar>
        <van-tabbar>
          <div @click="InputClick" style="flex: 1"><input type="text" placeholder="抢沙发1..." disabled /></div>
          <div class="ico" v-show="collect"><van-icon class="like1" style="color: pink" name="like" />收藏</div>
          <div class="ico" v-show="!collect"><van-icon class="like2" name="like-o" />收藏</div>
          <div class="ico"><van-icon name="share-o" />分享</div>
        </van-tabbar>
      </template>
    </TextareaVue>
    <TextareaVue BackEvent="GetBack2" position="bottom" rightText="发布" :show="show3" title="回复评论" :fun="onClickRight">
      <template #html>
        <van-field v-model="message" rows="2" autosize type="textarea" maxlength="50" :placeholder="'@' + list.aut_name" show-word-limit />
      </template>
    </TextareaVue>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { addLove, removeLove, SetCommentOf, GetComment, SendComments } from '@/api/index.js'
import TextareaVue from '@/components/textarea/TextareaVue.vue'
import AgainDiscuss from '@/components/discuss/AgainDiscuss.vue'
import { hiti, clear } from '@/utils/hint'

export default {
  props: ['CommentInfo', 'inn'],
  // 传递过来的数据进行遍历创建每一个评论信息
  data () {
    return {
      // 评论最右边的小爱心就点击
      num: 0,
      love: this.CommentInfo.is_liking,
      // 遍历对象，当添加评论就添加到这个list中
      list: this.CommentInfo,
      show: false,
      // 用于评论再评论的显示
      show2: false,
      value: '',
      // 评论再评论的再评论的显示面板
      show3: false,
      list2: [],
      loading: false,
      finished: false,
      collect: false,
      message: '',
      inn1: this.CommentInfo.reply_count,
      number: this.CommentInfo.reply_count
    }
  },
  watch: {

    CommentInfo: function (newval) {
      console.log(newval)
      this.list = newval
      this.inn1 = newval.reply_count
    },
    created () {
      console.log('list')
      console.log(this.list)
    },

    number (newval) {
      console.log(newval)
      this.number = newval
      this.$emit('NumberEvent', this.number)
    }
  },

  methods: {
    async onClickRight () {
      this.show3 = false

      const target = this.list.com_id
      const artid = this.$route.params.number
      const content = this.message
      hiti({ type1: 'loading', message1: '发送中' })
      SendComments({ target, artid, content }).then((value) => {
        clear()
        this.list2.unshift(value.data.new_obj)
        this.show2 = false
        this.finished = true

        this.number++
        this.inn1++
        this.message = ''
        this.$emit('changedId', this.number)
      })
    },

    InputClick () {
      this.show3 = true
    },
    onLoad () {
      GetComment(this.list.com_id, 'c', 10).then((value) => {
        value.data.results.forEach((element) => {
          this.list2.push(element)
        })

        if (value.data.results.length === 0) {
          this.show2 = true
          return
        }
        console.log(this.list2.length)
        console.log(value.data.total_count)
        if (this.list2.length >= value.data.total_count) {
          this.finished = true
        } else {
          GetComment(value.data.end_id, 'c', 10).then((value) => {
            console.log(value)
            value.data.results.forEach((element) => {
              this.list2.push(element)
            })
            if (this.list2.length >= value.data.total_count - 1 || value.data.results.length === 0) {
              this.finished = true
            }
          })
        }
      })
    },
    replyEvent () {
      this.show = true
    },
    GetBack2 (newval) {
      this.show2 = newval
    },
    GetBack (value) {
      console.log(value)
      this.show = value
    },

    // 小爱心的点击于取消
    CutLove () {
      this.love = !this.love
      if (this.love) {
        addLove(this.list.com_id).catch()
        this.num++
      } else {
        removeLove(this.list.com_id).catch()
        this.num--
      }
    }
  },
  components: { TextareaVue, AgainDiscuss }
}
</script>

<style lang="less" scoped>
.comment {
  display: flex;
  flex-direction: column;
  .van-tabbar--fixed {
    position: sticky;
    bottom: 0;
  }
  .text {
    padding-bottom: 0;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    .title {
      display: flex;
      span {
        margin-left: 10px;
        margin-top: 5px;
      }
      .img {
        width: 40px;
        height: 40px;
        overflow: hidden;
        border-radius: 50%;
      }
    }
  }
  .content {
    margin-left: 50px;
    padding-bottom: 5px;
    display: flex;
    justify-content: space-between;
    font-size: 14px;

    p {
      word-break: break-all;
      &:last-child {
        font-size: 12px;
        color: grey;
      }
    }
  }
  .Text {
    border-bottom: 1px solid #f1f1f1;
    padding: 10px;
    .header {
      font-size: 20px;
    }
    .content {
      display: flex;
      flex-direction: column;

      .floot {
        color: #ccc;
        display: flex;
        justify-content: space-between;
        font-size: 21px;
      }
    }
  }
  .TextContent {
    padding: 10px;
    font-size: 20px;
    height: 100%;
    .van-list {
      height: 100%;
    }
    h1 {
      margin-bottom: 10px;
    }
  }
  .van-tabbar {
    padding: 5px 0;
    input {
      width: 100%;
      padding: 10px;
      height: 40px;
      margin-left: 5px;
      background: #f1f1f1;
      border-radius: 20px;
    }
    .ico {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 20px;
      margin: 0 10px;
      .van-icon {
        font-size: 26px;
      }
    }
  }
  /deep/ .van-image__loading-icon {
    font-size: 16px;
  }
  .reply {
    padding-left: 40px;
    margin-top: 5px;
    display: flex;
    align-items: center;
    span {
      font-size: 14px;
      color: #ccc;
      margin-left: 5px;
    }
    > div/deep/ {
      width: 70px;
      padding: 5px 0;
      border-radius: 30px;
      font-size: 12px;
      background: #f8f8f8;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
    }

    .van-icon {
      margin-left: 5px;
    }
  }
}
</style>
