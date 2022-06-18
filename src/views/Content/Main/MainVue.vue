<template>
  <div>
    <van-list v-model="loading" :finished="finished" offset="0" finished-text="没有更多了" @load="onLoad">
      <div v-if="list.length != 0" class="list">
        <van-cell v-for="(item, index) in list" :key="index" :title="item.title">
          <!-- 图片只有一张时 -->
          <template #label v-if="item.cover.type === 0">
            <div class="CellLabel0">
              {{ item | descriptor }}
            </div>
          </template>
          <!-- 图片两张显示 -->
          <template #right-icon v-else-if="item.cover.type === 1">
            <div class="Cellright">
              <lazy-component>
                <van-image :src="item.cover.images[0]">
                  <template v-slot:default> </template>
                </van-image>
              </lazy-component>
            </div>
            <span class="label">
              {{ item | descriptor }}
            </span>
          </template>
          <!-- 图片三张显示 -->
          <template #label v-else-if="item.cover.type === 3">
            <lazy-component class="CellLabel3">
              <van-image v-for="(inn, index) in item.cover.images" :key="index" :src="inn">
                <template v-slot:default>
                  <!-- <i class="van-icon van-icon-photo van-image__loading-icon"></i> -->
                </template>
              </van-image>
            </lazy-component>

            {{ item | descriptor }}
          </template>
          <template #extra>
            <div class="clone" @touchstart.prevent="Clone(item)">x</div>
          </template>
        </van-cell>
      </div>
    </van-list>
    <van-action-sheet v-model="show" @select="PanelSelect" :actions="actions" cancel-text="取消" close-on-click-action />
    <van-action-sheet v-model="show2" @select="PanelSelect2" @cancel="PanelCancel" :actions="actions2" cancel-text="返回" close-on-click-action />
  </div>
</template>

<script>
import { journalism, DisLike, report } from '@/api/index.js'
import { Toast } from 'vant'
import EventBUS from '@/utils/eventBus'
// eslint-disable-next-line no-unused-vars
import { GetToken, SetToken } from '@/utils/token'

export default {
  data () {
    return {
      // 通过
      CellList: [],
      list: [],
      loading: false,
      finished: false,
      stope: this.$store.state.Tab,
      flag: true,
      isLoading: false,
      cacheObj: GetToken('cacheObj') || {},
      obj: [],
      index: 0,
      show: false,
      show2: false,
      textId: '',
      actions: [
        { name: '不感兴趣', color: 'black' },
        { name: '反馈垃圾内容', color: 'black' }
      ],
      actions2: [
        { name: '其他问题', color: 'black' },
        { name: '标题夸张', color: 'black' },
        { name: '低俗色情', color: 'black' },
        { name: '错别字多', color: 'black' },
        { name: '旧闻重复', color: 'black' },
        { name: '内容不实', color: 'black' },
        { name: '侵权', color: 'black' },
        { name: '涉嫌违反犯罪', color: 'black' }
      ]
    }
  },
  filters: {
    descriptor (value) {
      function formattingDate (value) {
        const d = Date.now() / 1000 - new Date(value).getTime() / 1000
        const dd = d / 60 / 60 / 24 / 365 > 0 ? parseInt(d / 60 / 60 / 24 / 365) + '年前' : parseInt(d / 60 / 60 / 24 / 12) + '月前'
        return dd
      }

      return `${value.aut_name} ${value.comm_count} 评论 ${formattingDate(value.pubdate)}`
    }
  },
  async created () {
    EventBUS.$on('refresh', (value) => {
      console.log(value)
      this.list = value
    })
  },

  watch: {
    // 监听tab数据的变化，当点击不同的选项就会渲染不同的数据
    '$store.state.Tab': async function (newval) {
      this.finished = false
      this.loading = true
      this.CellList = []
      this.list = []
      this.onLoad()
    },

    '$store.state.value': function (newVal) {
      this.finished = false
      this.loading = true
      this.CellList = []
      this.list = []
      this.onLoad()
    }

  },
  methods: {
    PanelCancel () {
      this.show = true
    },
    async PanelSelect2 (value) {
      try {
        const { data: res } = await report({ target: this.textId, type: value.name })
        if (res.message === 'OK') return Toast('举报成功')
      } catch (error) {
        Toast('举报失败')
      }
    },
    async PanelSelect (value) {
      console.log(value)
      if (value.name === '不感兴趣') {
        console.log('发送请求')
        try {
          const { data: res } = await DisLike({ target: this.textId })
          if (res.message === 'OK') return Toast('反馈成功')
        } catch (error) {
          Toast('反馈失败')
        }
      } else {
        this.show2 = true
      }
    },
    // 小叉号按钮的点击
    Clone (item) {
      console.log(item)
      // 需要弹出面板
      this.textId = item.art_id
      this.show = true
    },
    // 下拉刷新的实现
    onRefresh () {
      setTimeout(async () => {
        const { data: res } = await journalism({ channel_id: this.$store.state.Tab, timestamp: Date.now() + 1 })
        this.list = res.data.results
        this.isLoading = false
      }, 1000)
    },
    // list的上拉刷新
    onLoad () {
      setTimeout(() => {
        const tab = GetToken('Tab') || 0

        if (GetToken('Tab') in this.cacheObj) {
          this.CellList = this.cacheObj[tab][this.index]

          for (let i = 0; i < 10; i++) {
            this.list.push(this.CellList[i])
          }

          // 加载状态结束
          this.loading = false

          // 数据全部加载完成
          if (this.list.length >= 40) {
            this.finished = true
            if (this.index > this.cacheObj.length) {
              this.index = 0
            } else {
              this.index++
            }
          }
        } else {
          this.$store.dispatch('glideEvent').then((value) => {
            if (value.length === 0) {
              this.list = []
              this.CellList = []
              this.finished = true
            }
            console.log(value)
            value.forEach(element => {
              this.CellList.push(element)
            // 缓存对象
            })

            this.obj.push(value)

            for (let i = 0; i < 10; i++) {
              if (this.CellList[this.list.length]) {
                this.list.push(this.CellList[this.list.length])
              }
            }

            // 加载状态结束
            this.loading = false

            // 数据全部加载完成
            if (this.list.length >= 40) {
              this.finished = true
              this.cacheObj[tab] = this.obj
              SetToken('cacheObj', JSON.stringify(this.cacheObj))
            }
          })
        }
      }, 1000)
    }
  }
}
</script>
<style lang="less" scoped>
.van-list {
  height: 100%;

}
.Cellright {
  width: 100px;

  padding: 10px 0;
}
.van-image {
  margin-left: 5px;
}
.van-cell {
  .label {
    position: absolute;
    bottom: 10px;
    font-size: 12px;
    color: #ccc;
  }
  .clone {
    position: absolute;
    bottom: -2px;
    width: 0.53333rem;
    right: 8px;
    color: #ccc;
  }
}

.CellLabel3 {
  display: flex;
}
.van-image {
  flex: 1;
  height: 70px;
  width: 98px;
}
img {
  flex: 1;
  height: 70px;
}
</style>
