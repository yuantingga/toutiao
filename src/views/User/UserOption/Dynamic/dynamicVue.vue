<template>
  <div class="dynamic">
    <van-tabs @change="Tabs" v-model="active">
      <van-tab title="作品">
        <keep-alive>
          <MainVue></MainVue>
        </keep-alive>
      </van-tab>
      <van-tab title="公告">
          <van-cell v-for="item in cell" :key="item.id" :title="item.title" :label="item.pubdate" />
      </van-tab>
      <van-tab title="数据">
         <div class="data">
          <div></div>
          <div></div>
         </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { notice } from '@/api/index'
import MainVue from '@/components/Main/MainVue.vue'
export default {
  data () {
    return {
      active: 0,
      cell: ''
    }
  },
  created () {
    this.$store.commit('SetRouter', '/production')
  },
  methods: {
    Tabs (value) {
      console.log(value)
      if (value === 0) {
        this.$store.commit('SetRouter', '/production')
      } else if (value === 1) {
        //
        notice(1, 10).then(value => {
          this.cell = value.data.results
        })
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
  div{
    flex: 1;
  }
}
}
</style>
