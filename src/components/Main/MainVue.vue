<template>
  <div>
    <van-list v-model="loading" :finished="finished" offset="0"  finished-text="没有更多了" @load="onLoad">
      <div v-if="list.length != 0" class="list">
      <!--ArticleEvent点击单元格实现跳转到文章详情页面  -->
      <!-- 通过v-for进行遍历 -->
        <van-cell @click="ArticleEvent(item)" v-for="(item, index) in list" :key="index" :title="item.title">
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
          <!-- 小叉号 -->
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
// DisLike 点击叉号的处理，进行设置不感兴趣新闻/举报新闻
import { DisLike, report } from '@/api/index.js'
import { Toast } from 'vant'
import EventBUS from '@/utils/eventBus'
// eslint-disable-next-line no-unused-vars
import { GetToken, SetToken } from '@/utils/token'

export default {
  data () {
    return {
      //
      cacheObj: {},
      // 加载渲染表格的数据对象
      list: [],
      // 加载状态结束
      loading: false,
      // 数据还没有加载完成
      finished: false,

      // 获取contentVue组件中tabs选项卡选中的选项
      stope: this.$store.state.Tab,
      // 面板的显示于隐藏
      show: false,
      show2: false,
      // 面板点击的选项id
      textId: '',
      // 面板显示内容
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

  async created () {
    // 获取到下拉刷新的新数据进行渲染list中的数据，进行显示新数据
    EventBUS.$on('refresh', (value) => {
      this.list = value
    })
  },
  watch: {
    // 这里是数据的切换导致显示不同额数据
    // 监听tab数据的变化
    // 在第一次渲染中或是下拉将数据进行获取到保存下来
    '$store.state.Tab': async function (newval) {
      if (JSON.parse(GetToken(`${newval}`))) {
        this.list = JSON.parse(GetToken(`${newval}`))
      } else {
        this.$store.dispatch('glideEvent').then((value) => {
          this.list = value
          SetToken(`${newval}`, JSON.stringify(value))
        }).catch(value => {
          console.log(value)
        })
      }
      // 切换发送请求
    },

    // 用于区分首页，搜索页面，历史界面
    '$store.state.Route': async function (newVal) {
      this.loading = false
    },

    // 监听搜索关键字的变化，而导致组件渲染不同的数据
    '$store.state.value': function (newVal) {
      this.list = []
      this.$store.dispatch('glideEvent').then((value) => {
        console.log(value)
        if (value.length > 0) {
          this.list = value
        } else {
          this.finished = true
        }
      })
    }

  },
  destroyed () {
    this.loading = false
  },
  methods: {
    // 跳转到文章详情页面
    ArticleEvent (item) {
      this.$router.push(`/article/${item.art_id}`)
      SetToken('login', JSON.stringify(item.art_id))
    },
    // 第二个面板点击返回显示第一个面板
    PanelCancel () {
      this.show = true
    },
    // 举报面板进行发送请求进行举报
    async PanelSelect2 (value) {
      report({ target: this.textId, type: value.name }).then(value => {
        Toast('举报成功')
      }).catch(value => {
        Toast('举报失败')
      })
    },
    // 第一个面板，点击的是不感兴趣进行发送请求
    async PanelSelect (value) {
      console.log(value)
      if (value.name === '不感兴趣') {
        DisLike({ target: this.textId }).then(value => {
          Toast('反馈成功')
        }).catch(value => {
          Toast('反馈失败')
        })
      } else {
        // 显示举报的面板
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

    // list的上拉刷新
    onLoad () {
      console.log('加载')
      setTimeout(() => {
        // 这里是第一次加载数据，或是下拉数据的获取
        this.$store.dispatch('glideEvent').then((value) => {
          console.log(value)
          // 如果获取的是一个空数组那么
          if (value.length === 0) {
            this.finished = true
            return ''
          }
          value.forEach(element => {
            // this.CellList.push(element)
            // console.log(element)
            this.list.push(element)
          })

          // for (let i = 0; i < 10; i++) {
          //   if (this.CellList[this.list.length]) {
          //     this.list.push(this.CellList[this.list.length])
          //   }
          // }
          // 加载状态结束
          this.loading = false
          // 数据全部加载完成
          // if (this.list.length >= 40) {
          //   this.finished = true
          // }
        }).catch((value) => {
          console.log(value)
          this.list = []
          this.finished = true
        })
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
