<template>
  <div>
    <div class="header">
      <div class="title">
        <div class="img">
          <van-image :src="ele.aut_photo" height="100%" width="100%">
            <template v-slot:error>加载失败</template>
          </van-image>
          <!-- <img :src="CommentInfo.aut_photo" alt="" /> -->
        </div>
        <span>{{ ele.aut_name }}</span>
      </div>
      <div>
        <div class="love" @click.prevent="CutLove">
          <span style="margin-right: 5px">{{ num}}</span>
          <van-icon v-if="love" color="red" name="like" />
          <van-icon v-else name="like-o" />
        </div>
      </div>
    </div>
    <div class="content">
      <!-- 评论的文本 -->
      <p style="color: rgb(102, 102, 102); font-size: 21px; margin-bottom: 6px">{{ ele.content }}2</p>
    </div>
  </div>
</template>

<script>
import { addLove, removeLove } from '@/api/index'
export default {
  props: ['discuss'],
  data () {
    return {
      ele: this.discuss,
      love: this.discuss.is_followed,
      num: this.discuss.like_count
    }
  },
  watch: {
    discuss (newval) {
      console.log(newval)
    }
  },
  methods: {
    // 小爱心的点击于取消
    CutLove () {
      this.love = !this.love
      if (this.love) {
        addLove(this.ele.com_id).catch()
        this.num++
      } else {
        removeLove(this.ele.com_id).catch()
        this.num--
      }
    }
  }
}
</script>

<style lang="less" scoped>

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
</style>
