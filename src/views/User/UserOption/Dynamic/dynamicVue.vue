<template>
  <div class="dynamic">
    <van-tabs @change="Tabs" v-model="active">
      <van-tab title="作品">
        <keep-alive>
          <MainVue></MainVue>
        </keep-alive>
      </van-tab>
      <van-tab title="公告">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <van-cell v-for="item in list" :key="item.id" :title="item.title" :label="item.pubdate" />
        </van-list>
      </van-tab>
      <van-tab title="数据">
         <div class="data">
          <div>
            <div class="fansNum">粉丝数<van-icon name="arrow" /></div>
            <em>{{this.Figure.fans_count}}</em><span>人</span>
          </div>
          <div>
            <div>阅读数</div>
            <em>{{this.Figure.read_count}}</em><span>次</span>
          </div>
         </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { notice, FigureApi } from '@/api/index'
import MainVue from '@/components/Main/MainVue.vue'
export default {
  data () {
    return {
      active: 0,
      cell: '',
      loading: false,
      finished: false,
      list: [],
      Figure: ''
    }
  },
  async created () {
    this.$store.commit('SetRouter', '/production')
    const { data: res } = await FigureApi()
    this.Figure = res
  },
  methods: {
    onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      notice(1, 10).then(value => {
        console.log(value)
        value.data.results.forEach(element => {
          this.list.push(element)
        })
        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= value.data.total_count) {
          this.finished = true
        }
      })
    },
    Tabs (value) {
      console.log(value)
      if (value === 0) {
        this.$store.commit('SetRouter', '/production')
      } else if (value === 1) {
        //
        this.$store.commit('SetRouter', '/notice')
      }
    }
  },
  components: {
    MainVue
  }
}
</script>

<style lang="less" scoped>
.dynamic {
/deep/.van-tabs__wrap{
  width: 200px;
}
.data{
  display: flex;
  >div{
    flex: 1;
    background: #f8f8f8;
    font-size: 25px;
    margin: 10px;
    padding: 10px;
    font-size: 25px;
    border-radius: 10px;
    .fansNum{
      display: flex;
      justify-content: space-between;
    }
    span{
      font-size: 20px;
      color: #ccc;
      margin-left: 5px;
    }
  }
}
}
</style>
