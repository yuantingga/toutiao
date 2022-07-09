<template>
  <div>

  <van-tabs v-model="active">
  <van-tab title="全部"><InformationList :num="active"></InformationList></van-tab>
  <van-tab title="系统通知"><InformationList :num="active"></InformationList></van-tab>
  <van-tab title="评论"><InformationList :num="active"></InformationList></van-tab>
  <van-tab title="粉丝"><InformationList :num="active"></InformationList></van-tab>
  <van-tab title="点赞"><InformationList :num="active"></InformationList></van-tab>
</van-tabs>
  </div>
</template>

<script>
import InformationList from './InformationList.vue'
export default {
  data () {
    return {
      active: ''
    }
  },

  components: {
    InformationList
  }

}
</script>

<style lang="less" scoped>
/deep/.van-tabs--line .van-tabs__wrap{
  margin-right: 40px;

}
/deep/.van-cell__title{
    margin-left: 10px;
  }
</style>
