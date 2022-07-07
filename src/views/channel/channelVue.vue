<template>
  <div class="channel">
      <van-nav-bar>
        <template #right>
          <span class="iconfont icon-close" @click.prevent="Back"></span>
        </template>
      </van-nav-bar>
     <van-loading v-show="!show2" size="24px" color="#1989fa" style="margin-top:10px">加载中...</van-loading>
    <div v-show="show2">

      <div class="text">
        <span>我的频道</span>
        <!-- channelEdit:点击进入频道|点击删除频道的切换 -->
        <i @click.prevent="RemoveChannel">{{ channelEdit }}</i>
        <!-- editText编辑|完成之间的切换 -->
        <em @click.prevent="edit">{{ editText }}</em>
      </div>

      <!-- 用户的频道列表
        List存储的是用户的频道列表
        Zapping点击用户频道进行切换到首页的tab对应的频道上进行显示新闻信息列表
     -->
      <div class="ChannelSeparation">
        <div v-for="(item, index) in List" :key="index" @click.prevent="Zapping(item)">
          {{ item.name }}
          <!-- 小叉号图标的显示与隐藏，点击编辑显示，点击完成隐藏
        removeEdit在用户频道中进行删除该频道
        在未添加的频道中进行添加该点击的频道
         -->
          <span v-show="show" v-if="item.id != 0" class="iconfont icon-close" @click.prevent="removeEdit(item)">
            <van-icon name="close" />
          </span>
        </div>
      </div>
      <!-- 下方未添加的频道列表 -->
      <div class="text"><span>点击添加更多频道</span></div>
      <div class="ChannelSeparation">
        <!--

      存储的是未添加的用户频道
      addChannel点击继续添加到用户频道中在原本频道中进行删除
     -->
        <div v-for="item in List2" :key="item.id" @click.prevent="addChannel(item)">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import $ from 'jquery'
import { UserChannels, AllChannels, PutChannel } from '@/api/index'
import { hiti } from '@/utils/hint'
import { SetStorage, RemoveSetStorage, GetStorage } from '@/utils/storage.js'
import eventBus from '@/utils/eventBus'

export default {
  name: 'ChannelVue',
  data () {
    return {
      // 小叉号的点击显示与隐藏
      show: false,
      // 编辑于完成的切换
      editText: '编辑',
      // add 节流阀未true才能点击下方未添加频道的频道内，未true可以操作
      add: false,
      // 点击进入频道和点击删除频道的切换
      channelEdit: '点击进入频道',

      // 用户的频道列表
      List: '',
      // 未添加的频道列表
      List2: '',
      show2: false
    }
  },

  async created () {
    // 用户的频道列表
    try {
      const res = await UserChannels().then(value => {
        console.log()
        this.List = value.data.channels
        eventBus.$emit('cut', this.List)
        this.$nextTick(() => {
          const index = JSON.parse(GetStorage('Tab'))
          console.log(index)
          // eslint-disable-next-line array-callback-return
          value.data.channels.some((ele, inn) => {
            console.log(ele.id)
            if (ele.id === index) {
              console.log(document.querySelectorAll('.ChannelSeparation div')[inn])

              const div = [...document.querySelectorAll('.ChannelSeparation div')]
              div.forEach(ele => {
                ele.style.color = 'black'
              })
              document.querySelectorAll('.ChannelSeparation div')[inn].style.color = '#fc6627'
            }
          })
        })
        return value
      })
      // 所有的频道列表
      const res2 = await AllChannels()
      this.show2 = true

      // 存储用户的频道列表

      // 使用遍历进行判断所有频道列表中的频道是否有于用户的频道列表中相同的内容
      // 通过遍历 arr 存储的是用户的信息列表 进行遍历他，
      // 用户频道遍历一次就需要和所有频道列表都比较一次，发现相同的那么就使用splice方法进行删除
      const arr = res.data.channels
      const arr2 = res2.data.channels
      arr.forEach((ele) => {
        arr2.forEach((element, index, shuzu) => {
        // 外面的这个要和里层循环进行比较一旦出现相同那么就需要删除删除arr2中的元素
        //  arr 中的一个元素和arr2中所有的进行比较
          if (ele.id === element.id) {
            shuzu.splice(index, 1)
          }
        })
      })
      // 操作完成的arr2就是list2所有频道列表的内容

      this.List2 = arr2
    } catch (error) {
      console.log(error)
    }
  },

  methods: {
    Back () {
      this.$router.push('/Index/Content')
    },
    // 点击删除频道的点击事件
    async RemoveChannel () {
      try {
        if (this.channelEdit === '点击删除频道') {
          this.List2.push(this.List.splice(1, 1)[0])
        } else {
          // 如果点击的是点击进入频道那么就直接条到首页面
          this.$router.push('/Index/Content')
        }
        PutChannel(this.List).then(value => {
          if (value.data.message === '游客不能设置个性化频道') {
            this.$router.push('/login')
          }
        })
      } catch (error) {
        hiti({ type1: 'danger', message1: '修改失败' })

        if (error.response.data.message === '游客不能设置个性化频道') {
          this.$router.push('/login')
          // SetToken('login', '/channel')
        }
      }
    },
    // 进行删除用户频道中的频道并添加到所有频道列表中
    async removeEdit (value) {
      try {
        this.List2.push(value)
        this.List.forEach((element, index) => {
          if (element.id === value.id) {
            this.List.splice(index, 1)
          }
        })
        this.$store.commit('SetUserChannels', this.List)

        PutChannel(this.List).then(value => {
          if (value.data.message === '游客不能设置个性化频道') {
            this.$router.push('/login')
          }
        })
      } catch (error) {
        hiti({ type1: 'danger', message1: '修改失败' })
        if (error.response.data.message === '游客不能设置个性化频道') {
          this.$router.push('/login')
          // SetToken('login', '/channel')
        }
      }
    },
    edit () {
      this.show = !this.show
      this.channelEdit = this.channelEdit === '点击进入频道' ? '点击删除频道' : '点击进入频道'
      this.editText = this.editText === '编辑' ? '完成' : '编辑'
      if (this.editText === '完成') {
        this.add = true
      } else {
        this.add = false
      }
    },
    async addChannel (value) {
      try {
        // 为false进行返回
        if (!this.add) return
        // 为true显示小图标点击下方为添加的频道进行添加，在未添加的频道列表中进行删除该频道
        this.List.push(value)
        this.List2.forEach((element, index) => {
          if (element.id === value.id) {
            this.List2.splice(index, 1)
          }
        })
        PutChannel(this.List)
      } catch (error) {
        // 如果不是游客问题一律弹窗修改失败
        hiti({ type1: 'danger', message1: '修改失败' })
        // 进行修改用户的频道，如果返回的是游客，那么就会跳转到用户界面
        if (error.response.data.message === '游客不能设置个性化频道') {
          this.$router.push('/login')
          // 并将
          // SetToken('login', '/channel')
        }
      }
    },

    Zapping (value) {
      // add为true 进行返回不能不能进行 ，显示小叉号时点击不能进行跳转
      if (this.add) return
      console.log(1111)
      this.$router.push('/Index/Content')
      this.$store.commit('SetTab', value.id)
    }
  }
}
</script>

<style lang="less" scoped>
.channel {
  .van-loading{
    text-align: center;

  }
  .text {
    margin: 10px 5px;
    span {
      font-size: 18px;
      margin-right: 10px;
    }
    i {
      font-size: 14px;
      color: rgb(207, 207, 207);
    }
    em {
      float: right;
      font-size: 18px;
      margin-right: 5px;
    }
  }
  .ChannelSeparation {
    display: flex;
    flex-wrap: wrap;

    div {
      width: 23%;
      height: 50px;
      background: #fafafa;
      margin: 1%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      border-radius: 20px;
      font-size: 14px;
      .icon-close {
        position: absolute;
        right: 5px;
        top: 0;
        color: rgb(207, 207, 207);
      }
    }
  }
}
.iconfont {
  font-size: 16px;
  color: white;
}
</style>
