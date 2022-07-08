<template>
  <div>
    <div class="fans">
      <div class="header">
        <van-image round :src="list1.photo">
          <template> </template>
        </van-image>
        <div class="hima">
          <span>{{ list1.name }}</span>
          <div>粉丝数：{{ list1.fans_count }} 人</div>
        </div>
      </div>
      <div v-if="fans === 1">
        <div v-show="list1.mutual_follow" class="focus" ref="focus" @click="cut">+关注</div>
        <div v-show="!list1.mutual_follow" class="blur" ref="focus" @click="cut">互相关注</div>
      </div>
      <div v-else>
        <div v-show="!list1.mutual_follow" class="blur" ref="focus" >取消关注</div>
      </div>
    </div>
  </div>
</template>

<script>
import { hiti } from '@/utils/hint'
import { attention, NotAttention } from '@/api/article.js'
export default {
  props: ['list', 'fans'],
  data () {
    return {
      list1: this.list
    }
  },
  created () {},
  methods: {
    cut () {
      this.list1.mutual_follow = !this.list1.mutual_follow
      if (this.list1.mutual_follow === true) {
        console.log('关注')
        attention(this.list1.id)
      } else {
        console.log('互相关注')
        NotAttention(this.list1.id)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.fans {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header {
    display: flex;
    align-items: center;
    .van-image {
      width: 50px;
      height: 50px;
    }
    .hima {
      margin-left: 10px;
      font-size: 16px;
    }
  }
  .focus {
    width: 70px;
    height: 40px;
    border-radius: 20px;
    background: palevioletred;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 14px;
  }
  .blur {
    background: #ccc;
    color: #f8f8f8;
    font-size: 14px;
    width: 100px;
    height: 40px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
