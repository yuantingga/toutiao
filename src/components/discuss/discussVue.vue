<template>
    <div class="comment">
        <div class="header">
          <div class="title">
            <div class="img">
            <van-image :src="list.aut_photo"  height="100%" width="100%">
              <template v-slot:error>加载失败</template>
            </van-image>
              <!-- <img :src="CommentInfo.aut_photo" alt="" /> -->
            </div>
            <span>{{list.aut_name}}</span>
          </div>
          <div class="love" @click="CutLove">
            <van-icon v-if="love" color="red" name="like" />
            <van-icon v-else name="like-o" />
          </div>
        </div>
        <div class="content">
          <span>{{list.content}}</span>
          <span>{{list.pubdate}}</span>
        </div>
        <!-- <div class="reply">
          <van-icon name="chat-o"  />
          <van-icon name="good-job-o" />
        </div> -->
      </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { addLove, removeLove, SetCommentOf } from '@/api/index.js'
export default {
  props: ['CommentInfo'],
  data () {
    return {
      love: this.CommentInfo.is_liking,
      list: this.CommentInfo,
      add: ''
    }
  },
  created () {
    console.log(this.love)
  },

  methods: {
    async CutLove () {
      this.love = !this.love
      if (this.love) {
        const { data: res } = await addLove(this.list.com_id)
        console.log(res)
      } else {
        //
        const { data: res } = await removeLove(this.list.com_id)
        console.log(res)
      }
    }
  }

}
</script>

<style lang="less" scoped>
 .comment {
    display: flex;
    flex-direction: column;
    padding: 10px;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        display: flex;
        span {
          margin-left: 10px;
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
    .reply{
        padding-left: 46px;
        margin-top: 5px;
        .van-icon{
          margin-left:5px;
        }
      }

  }
</style>
