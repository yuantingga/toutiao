<template>
  <div class="channel">
    <van-nav-bar title="频道管理">
      <template #right>
        <span class="iconfont icon-close"  @touchstart.prevent="$router.push('/Index/Content')"></span>
      </template>
    </van-nav-bar>
    <div class="text"><span>我的频道</span><i  @click="RemoveChannel">{{channelEdit}}</i><em  @touchstart.prevent="edit" >{{editText}}</em></div>
    <div class="ChannelSeparation">
      <div v-for="(item,index) in List" :key="index"  @touchstart.prevent="Zapping(item)">{{ item.name }}

       <span v-show="show" v-if="item.id !=0" class="iconfont icon-close"  @touchstart.prevent="removeEdit(item)"></span>
      </div>

    </div>
    <div class="text"><span>点击添加更多频道</span></div>
    <div class="ChannelSeparation">
     <div  v-for="item in List2" :key="item.id" @touchstart.prevent="addChannel(item)">
        {{item.name}}
     </div>
    </div>
  </div>
</template>

<script>

// eslint-disable-next-line no-unused-vars

import { UserChannels, AllChannels, PutChannel } from '@/api/index'
import { Toast } from 'vant'

export default {
  data () {
    return {
      show: false,
      editText: '编辑',
      add: false,
      List: '',
      List2: '',
      channelEdit: '点击进入频道'
    }
  },
  async created () {
    const { data: res } = await UserChannels()

    const { data: res2 } = await AllChannels()

    this.List = res.data.channels
    const arr = res.data.channels
    const arr2 = res2.data.channels
    arr.forEach(ele => {
      arr2.forEach((element, index, shuzu) => {
        // 外面的这个要和里层循环进行比较一旦出现相同那么就需要删除删除arr2中的元素
        //  arr 中的一个元素和arr2中所有的进行比较
        if (ele.id === element.id) {
          shuzu.splice(index, 1)
        }
      })
    })

    this.List2 = arr2
  },
  methods: {
    RemoveChannel () {
      console.log(this.channelEdit)
      if (this.channelEdit === '点击删除频道') {
        this.List2.push(this.List.splice(1, 1)[0])
      } else {
        this.$router.push('/Index/Content')
      }

      try {
        PutChannel(this.List)
      } catch (error) {
        Toast.fail('修改失败')
      }
    },
    async removeEdit (value) {
      try {
        this.List2.push(value)
        this.List.forEach((element, index) => {
          if (element.id === value.id) {
            this.List.splice(index, 1)
          }
        })
        console.log(this.List)
        PutChannel(this.List)
      } catch (error) {
        Toast.fail('修改失败')
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
    addChannel (value) {
      if (!this.add) return
      this.List.push(value)
      this.List2.forEach((element, index) => {
        if (element.id === value.id) {
          this.List2.splice(index, 1)
        }
      })
      try {
        PutChannel(this.List)
      } catch (error) {
        Toast.fail('修改失败')
      }
    },
    Zapping (value) {
      if (this.add) return
      this.$router.push('/Index/Content')
      this.$store.commit('setTab', value.id)
    }
  }
}
</script>

<style lang="less" scoped>
.channel {
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
    em{
      float: right;
       font-size: 18px;
       margin-right: 5px;
    }
  }
  .ChannelSeparation {
    display: flex;
    flex-wrap: wrap;

     div{
      width: 23%;
      height: 50px;
      background: #fafafa;
      margin: 1%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      .icon-close{
      position: absolute;
      right: 0;
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
