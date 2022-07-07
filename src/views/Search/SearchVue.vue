<template>
  <div class="Search">
    <div class="SearchHeader">
      <span class="iconfont icon-zuo" @click.prevent="back">
        <van-icon name="arrow-left" />
      </span>
      <van-search  @keyup.prevent="AntiShake" @search="SearchKeyword"
      v-model="value" shape="round"
       background="white" placeholder="请输入搜索关键词" />
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
import { SetStorage, RemoveSetStorage, GetStorage } from '@/utils/storage.js'
import { GetToken, SetToken } from '@/utils/token'
import SearchHistory from './SearchHistory/SearchHistory.vue'
import SearchAssociate from './SearchAssociate/SearchAssociate.vue'
import { SearchLenovo } from '@/api/index'
import eventBus from '@/utils/eventBus'
export default {
  name: 'SearchVue',
  data () {
    return {
      // 搜索关键字
      value: '',
      obj: {},
      history: JSON.parse(GetStorage('history')) || [],
      ele: 'SearchHistory'
    }
  },
  created () {
    // 设置Router的值，说明当前是搜索页面的mainvue组件
    this.$store.commit('SetRouter', '/Search')

    eventBus.$on('LenoveClick', value => {
      this.value = ''
      this.ele = 'SearchHistory'
    })
  },
  activated () {
    this.ele = 'SearchHistory'
  },
  methods: {
    // 搜索联想的防抖
    AntiShake () {
      clearTimeout(this.obj.time)
      const antiShake = () => {
        clearTimeout(this.obj.time)
        this.obj.time = setTimeout(() => {
          console.log(this.value)
          if (this.value.trim() === '') {
            this.ele = 'SearchHistory'
          }
          SearchLenovo(this.value).then(value => {
            if (value.data.options[0]) {
              this.$store.commit('SetLenovo', value.data.options)
              this.ele = 'SearchAssociate'
            } else {
              this.ele = 'SearchHistory'
            }
          })
          // } else {
          //   this.ele = 'SearchHistory'
          // }
        }, 500)
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
      SetStorage('history', JSON.stringify(this.history))
      this.ele = 'SearchHistory'
      // 修改历史关键字,回车进行显示搜索结果组件并修改
      this.$store.commit('SetValue', this.value)
      this.$store.commit('SetRouter', '/Search')
      this.$router.push(`/Search/${this.value}`)
      this.value = ''
    },
    // 点击返回就跳转到首页
    back () {
      this.$router.push('/Index/Content')
      this.$store.commit('SetRouter', '/Index/Content')
      this.value = ''
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
      top: 25%;
      z-index: 10;
      font-size: 0.48rem;
      margin-left: 0.26667rem;
      color:black;
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
