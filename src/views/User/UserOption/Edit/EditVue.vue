<template>
  <div>
    <van-cell is-link>
      <!-- 使用 title 插槽来自定义标题 -->
      <template #default>
      <!-- 头像 ImgEvent头像点击显示文件表单 user.photo头像图片 -->
        <van-image ref="img" round width="1.5rem" height="1.5rem" @click.prevent="ImgEvent" :src="user.photo" />

        <!-- 点击头像进行显示文件选择器，默认选择的是image类型的文件
        onFileChange
         -->
         <!-- 上传文件状态会发送改变从而触发事件 -->
        <input ref="file" type="file" name="" v-show="false" accept="image/*" @change="onFileChange" id="" />
      </template>
      <template #title>
        <span class="custom-title">头像</span>
      </template>
    </van-cell>

    <!-- name的单元格 -->
    <van-cell :value="name" @click.prevent="show = true" is-link>
      <!-- 使用 title 插槽来自定义标题 -->
      <template #title>
        <span class="custom-title">名称</span>
      </template>
    </van-cell>

    <!-- 生日的单元格 -->
    <van-cell @click.prevent="show2 = true" :value="birthday" is-link>
      <!-- 使用 title 插槽来自定义标题 -->
      <template #title>
        <span class="custom-title">生日</span>
      </template>
    </van-cell>
    <!--生日的 时间选择器 -->
    <van-action-sheet v-model="show2">
      <van-datetime-picker v-model="currentDate" type="date" title="选择年月日" :min-date="minDate" :max-date="maxDate" @confirm="affirm" @cancel="cancelEvent" />
    </van-action-sheet>

    <!-- name修改的弹窗 -->
    <van-dialog v-model="show" @confirm="DislogEvent" title="修改name" show-cancel-button>
      <van-field placeholder="请输入名称" style="width: 200px; text-align: center" v-model="value" />
    </van-dialog>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { UserData, Setphoto, UserAmend } from '@/api/index.js'
import dayjs from 'dayjs'
export default {
  name: 'EditVue',
  data () {
    return {
      user: '',
      file: [],
      // name的弹窗
      show: false,
      // 事件选择器的面板
      show2: false,
      // 生日的数据
      birthday: '',
      // 修改name的弹窗
      value: '',
      // name的数据存储
      name: '',
      // 最小的日期
      minDate: new Date(2020, 0, 1),
      // 最大的日期
      maxDate: new Date(2025, 10, 1),
      // 时间选择器的选中
      currentDate: new Date(2021, 0, 17)
    }
  },
  methods: {
    // 弹出的确认，修改name
    async DislogEvent () {
      this.name = this.value

      UserAmend({ name: this.name }).then(value => {
        this.$store.commit('SetName', this.value)
      })
    },

    // 时间选择器的取消按钮，面板就行隐藏
    cancelEvent () {
      this.show2 = false
    },
    // 时间的确认按钮，修改生日
    async affirm () {
      // 面板就行隐藏
      this.show2 = false
      // 格式化事件日期
      const d = dayjs(this.currentDate).format('YYYY-MM-DD')
      this.birthday = d
      // 发送请求修改生日日期
      UserAmend({ birthday: this.birthday })
    },

    ImgEvent (e) {
      // 触发文件表单的点击事件
      this.$refs.file.click()
    },
    onFileChange (e) {
      const f = new FormData()
      f.append('photo', e.target.files[0])
      Setphoto(f).then(value => {
        this.user.photo = value.data.photo
        this.$store.commit('SetPhoto', value.data.photo)
      })
    }
  },
  // 生命周期函数，编辑资料界面用户数据
  async created () {
    UserData().then(value => {
      console.log(value)
      this.user = value.data
      this.value = value.data.name
      this.birthday = value.data.birthday
      this.name = value.data.name
    }).catch(value => {
      //
      console.log('cw')

      // console.log(value)
    })
  }
}
</script>

<style lang="less" scoped>
.van-cell {
  align-items: center;
}
.van-dialog {
  /deep/ .van-dialog__content {
    display: flex;
    justify-content: center;
  }
  /deep/ .van-field__control {
    text-align: center;
  }
}
</style>
