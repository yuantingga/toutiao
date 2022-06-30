<template>
  <!-- 搜索历史组件 -->
   <div>
    <div class="text">
      <span>搜索历史</span>
      <!-- 清空历史记录 -->
      <svg @touchstart.prevent="clear" t="1655445808268" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7841" width="200" height="200">
        <path
          d="M895.464448 119.006208 677.967872 119.006208c0 0-32.8448 1.020928-58.648576-26.943488-10.395648-12.050432-27.804672-23.795712-56.4224-24.799232l-41.183232 0-6.280192 0-41.182208 0c-28.618752 1.004544-46.031872 12.749824-56.4224 24.799232-25.807872 27.964416-58.6496 26.943488-58.6496 26.943488L141.682688 119.006208c-13.99296 0-25.33888 11.34592-25.33888 25.33888l0 93.090816c-0.053248 26.927104 26.083328 26.396672 26.083328 26.396672l49.83808 0L192.265216 913.65376c0 0-3.966976 44.084224 40.121344 46.45888l269.31712 0 33.738752 0 30.808064 0.238592 38.500352 0 174.934016 0 24.297472 0 0.782336-0.238592c44.080128-2.374656 40.117248-46.45888 40.117248-46.45888L844.88192 263.832576l49.842176 0c0 0 26.133504 0.530432 26.083328-26.396672l0-93.090816C920.8064 130.353152 909.46048 119.006208 895.464448 119.006208zM430.539776 803.171328c0 17.042432-13.828096 30.865408-30.865408 30.865408-17.042432 0-30.865408-13.824-30.865408-30.865408L368.80896 320.736256c0-17.042432 13.824-30.865408 30.865408-30.865408 17.038336 0 30.865408 13.824 30.865408 30.865408L430.539776 803.171328zM663.436288 803.171328c0 17.042432-13.824 30.865408-30.865408 30.865408-17.038336 0-30.865408-13.824-30.865408-30.865408L601.705472 320.736256c0-17.042432 13.828096-30.865408 30.865408-30.865408 17.041408 0 30.865408 13.824 30.865408 30.865408L663.436288 803.171328z"
          p-id="7842"
        ></path>
      </svg>
    </div>
    <!-- 历史记录的遍历绘制 -->
    <div class="history">
    <!-- 历史记录的点击事件，进行跳转到搜索结果页面并将数据进行渲染 通过监听vuex中的value搜索关键字的变化-->
      <div @click="HistoryEvent(item)"  v-for="(item, index) in history" :key="index">{{ item }}</div>
    </div>
   </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { GetToken, RemoveToken } from '@/utils/token'
export default {

  data () {
    return {
      history: []
    }
  },
  activated () {
    this.history = JSON.parse(GetToken('history'))
  },
  methods: {
    // 历史记录的点击
    HistoryEvent (item) {
      this.$store.commit('SetValue', item)
      this.$store.commit('SetRouter', '/Search')
      this.$router.push(`/Search/${item}`)
    },
    // 清空历史记录
    clear () {
      // 发送清空历史记录请求
      this.history = []
      RemoveToken('history')
      // 点击清空历史记录
    }
  }
}
</script>

<style lang="less" scoped>
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
</style>
