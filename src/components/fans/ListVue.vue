<template>
  <div>
     <van-empty v-show="show" description="暂无数据" />
     <van-list v-model="loading" :finished="finished" :finished-text="Text" @load="onLoad">
        <FansVue v-for="(item,index) in arr" :key="index" :list="item" :fans="keyword"></FansVue>
    </van-list>
  </div>
</template>

<script>
import FansVue from '@/components/fans/FansVue.vue'
import { Followings, followers } from '@/api/index'
export default {
  props: ['keyword'],
  data () {
    return {
      loading: false,
      finished: false,
      arr: [],
      show: false,
      Text: '没有更多了',
      res: ''

    }
  },
  created () {

  },

  methods: {
    Load (value) {
      if (value.data.results.length === 0) {
        //
        this.Text = ''
        this.finished = true
        this.show = true
      }
      value.data.results.forEach(element => {
        console.log(element)
        this.arr.push(element)
      })
      if (this.arr.length >= value.data.results.length) {
        this.finished = true
      }
    },
    onLoad () {
      if (this.keyword === 0) {
        Followings(1, 10).then((value) => {
          this.Load(value)
        })
      } else {
        followers(1, 10).then((value) => {
          this.Load(value)
        })
      }
    }
  },
  components: {
    FansVue
  }
}
</script>

<style>

</style>
