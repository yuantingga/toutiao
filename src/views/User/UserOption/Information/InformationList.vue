<template>
  <div>
    <van-list v-if="show" v-model="loading" :finished="finished" :finished-text="text" @load="onLoad">
      <div v-for="item in list" :key="item.id">
        <van-cell>
          <!-- 使用 right-icon 插槽来自定义右侧图标 -->
          <template #icon>
            {{ item.title }}
          </template>
          <template #title>
            <div style="color:#ccc">{{ item.content }}</div>

          </template>
          <template #right-icon>
            <div style="color:#ccc">{{ item.create_time }}</div>
          </template>
        </van-cell>
        <div v-if="item.comment_target" class="comment_target">{{ item.comment_target }}</div>\
        <div v-if="item.comment_content" class="comment_content">{{item.comment_content}}</div>
      </div>
    </van-list>
    <van-empty v-else description="暂无数据" />
  </div>
</template>

<script>
import { notifyApi } from '@/api/index'
export default {
  props: ['num'],
  data () {
    return {
      loading: false,
      finished: false,
      arr: '',
      inn: '',
      list: [],
      show: true,
      text: '没有更多了'
    }
  },
  methods: {
    async  Load (inn, n, cut) {
      await notifyApi(inn, n, cut).then(value => {
        if (value.data.results.length === 0) {
          this.finished = true
          this.text = ''
          this.show = false
          return
        }
        value.data.results.forEach(element => {
          console.log(element)
          this.list.push(element)
          if (this.list.length >= value.data.total_count) {
            this.finished = true
          }
        })
      })
    },

    async onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      if (this.num === 0) {
      // 显示全部
        this.Load(1, 10, '')
      } else {
      // 显示其他的内容
        this.Load(1, 10, this.num)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.comment_target {
  margin: 0px 0.42667rem;
  padding: 10px 5px;
  background: #f1f1f1;
  color: rgb(157, 157, 157);
  font-size: 16px;
}
.comment_content{
  margin: 0px 0.42667rem;
  font-size: 16px;
}
</style>
