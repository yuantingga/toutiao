<template>
  <div class="Search">
    <div class="SearchHeader">
      <span class="iconfont icon-zuo" @click="back"></span>
      <van-search @keyup.prevent="AntiShake" @search="SearchKeyword" v-model="value" shape="round"
       background="cornflowerblue" placeholder="请输入搜索关键词" />
    </div>
    <!-- 搜索联想组件 -->
    <!-- 搜索历史组件 -->
    <keep-alive>
      <component :is="ele"></component>
    </keep-alive>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { GetToken, SetToken } from '@/utils/token'
import SearchHistory from './SearchHistory/SearchHistory.vue'
import SearchAssociate from './SearchAssociate/SearchAssociate.vue'
export default {
  data () {
    return {
      // 搜索关键字
      value: '',
      obj: {},
      history: JSON.parse(GetToken('history')) || [],
      ele: 'SearchHistory'
    }
  },
  created () {
    // 设置Router的值，说明当前是搜索页面的mainvue组件
    this.$store.commit('SetRouter', '/Search')
  },
  methods: {
    // 搜索联想的防抖
    AntiShake () {
      this.ele = 'SearchAssociate'
      clearTimeout(this.obj.time)
      const antiShake = () => {
        clearTimeout(this.obj.time)
        this.obj.time = setTimeout(() => {
          console.log(this.value)

          this.ele = 'SearchAssociate'
        }, 1000)
      }
      antiShake()
    },
    // 搜索事件
    async SearchKeyword () {
      console.log(this.value)
      // 需要传递到searchHisory中的props属性中
      // value是搜索关键字
      const value = this.value
      // 进行遍历，判断历史对象中是否又该关键字，又就不能进行添加history这个对象中
      const flag = this.history.some(ele => value === ele)
      if (!flag) {
        this.history.push(value)
      }
      // 将this.history添加到本地缓存中，刷新搜索页面不会丢失历史记录
      SetToken('history', JSON.stringify(this.history))
      this.ele = 'SearchHistory'
      // 修改历史关键字
      this.$store.commit('SetValue', this.value)
      this.$store.commit('SetRouter', '/Search')
      this.$router.push(`/Search/${this.value}`)
      this.value = ''
    },
    // 点击返回就跳转到首页
    back () {
      this.$router.push('/Index/Content')
      this.$store.commit('SetRouter', '/Index/Content')
    }
  },
  components: { SearchHistory, SearchAssociate }
}

</script>

<style lang="less" scoped>
.Search {
  height: 100%;
  overflow: auto;
  .SearchHeader {
    position: relative;
    .icon-zuo {
      position: absolute;
      top: 31%;
      z-index: 10;
      font-size: 0.48rem;
      margin-left: 0.26667rem;
      color: white;
    }
    .van-search {
      padding-left: 40px;
    }
  }
  .text {
    display: flex;
    justify-content: space-between;
    margin: 10px 5px;
    span {
      font-size: 18px;
    }
    svg {
      width: 20px;
      height: 20px;
    }
  }
  .history {
    display: flex;
    div {
      width: 60px;
      height: 40px;
      background: #efefef;
      border-radius: 10px;
      margin: 0 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
