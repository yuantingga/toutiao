<template>
<!-- 评论消息的组件 -->
    <div class="comment">
        <div class="header">
          <div class="title">
            <div class="img">
            <van-image  v-lazy="list.aut_photo"  height="100%" width="100%">
              <template v-slot:error>加载失败</template>
            </van-image>
              <!-- <img :src="CommentInfo.aut_photo" alt="" /> -->
            </div>
            <span>{{list.aut_name}}</span>
          </div>
          <div class="love" @click.prevent="CutLove">
            <van-icon v-if="love" color="red" name="like" />
            <van-icon v-else name="like-o" />
          </div>
        </div>
        <div class="content">
        <!-- 评论的文本 -->
          <span>{{list.content}}</span>
          <!-- 评论的时间 -->
          <span>{{list.pubdate}}</span>
        </div>

      </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { addLove, removeLove, SetCommentOf } from '@/api/index.js'
export default {
  props: ['CommentInfo'],
  // 传递过来的数据进行遍历创建每一个评论信息
  data () {
    return {
      // 评论最右边的小爱心就点击
      love: this.CommentInfo.is_liking,
      // 遍历对象，当添加评论就添加到这个list中
      list: this.CommentInfo
    }
  },
  watch: {
    CommentInfo: function (newval) {
      console.log(newval)
      this.list = newval
    }
  },
  methods: {
    // 小爱心的点击于取消
    CutLove () {
      this.love = !this.love
      if (this.love) {
        addLove(this.list.com_id).catch()
      } else {
        removeLove(this.list.com_id).catch()
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
    /deep/ .van-image__loading-icon{
      font-size: 16px;
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
