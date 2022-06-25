<template>
  <div>
    <van-cell is-link>
      <!-- 使用 title 插槽来自定义标题 -->
      <template #default>
        <van-image ref="img" round width="1.5rem"  height="1.5rem" @click="ImgEvent" :src="user.photo" />
        <input ref="file" type="file" name="" v-show="false" accept="image/*" @change="onFileChange" id="">
      </template>
      <template #title>
        <span class="custom-title">头像</span>
      </template>
    </van-cell>
    <van-cell :value="name" @click="show = true" is-link>
      <!-- 使用 title 插槽来自定义标题 -->
      <template #title>
        <span class="custom-title">名称</span>
      </template>
    </van-cell>
    <van-cell @click="show2=true" :value="birthday" is-link>
      <!-- 使用 title 插槽来自定义标题 -->
      <template #title>
        <span  class="custom-title">生日</span>
      </template>
    </van-cell>

    <van-action-sheet v-model="show2" >
      <van-datetime-picker v-model="currentDate" type="date" title="选择年月日"
      :min-date="minDate" :max-date="maxDate" @confirm="affirm" @cancel="cancelEvent" />
    </van-action-sheet>

    <!-- 时间选择器 -->

    <!-- 弹窗 -->
    <van-dialog v-model="show" @confirm="DislogEvent" title="标题" show-cancel-button>
      <van-field placeholder="请输入名称" style="width: 200px;text-align:center" v-model="value" />
    </van-dialog>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { UserData, Setphoto, UserAmend } from '@/api/index.js'
import dayjs from 'dayjs'
export default {
  data () {
    return {
      user: '',
      file: [],
      show: false,
      show2: false,
      birthday: '',
      value: '',
      name: '',
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(2021, 0, 17)
    }
  },
  methods: {
    // 弹出的确认，修改name
    async DislogEvent () {
      this.name = this.value
      const { data: res } = await UserAmend({ name: this.name })
      console.log(res)
    },

    // 时间选择器的取消按钮
    cancelEvent () {
      this.show2 = false
      console.log('点击取消')
    },
    // 时间的确认按钮，修改时间
    async affirm () {
      this.show2 = false
      this.show = false
      const d = dayjs(this.currentDate).format('YYYY-MM-DD')
      this.birthday = d
      const { data: res } = await UserAmend({ birthday: this.birthday })
      console.log(res)
    },

    //  通过点击头像弹窗收集用户图片的表单，获取到files中存储上传的文件使用fromdata进行存储获取到的图片，发送请求
    // <van-image round width="1.5rem"  height="1.5rem" @click="ImgEvent" :src="user.photo" />
    // <input ref="file" type="file" name="" v-show="false" accept="image/*" @change="onFileChange" id="">
    // 头像图片点击
    /* 发送请求
     function Setphoto (obj) {
      return axioss({
        url1: '/user/photo',
        method: 'PATCH',
        data: obj,
        headers: {
          Authorization: `Bearer ${GetToken('token')}`
        }
      })
    } */
    ImgEvent (e) {
      this.$refs.file.click()
    },
    async onFileChange (e) {
      const f = new FormData()
      f.append('photo', e.target.files[0])
      const { data: res } = await Setphoto(f)
      console.log(res)
      this.user.photo = res.data.photo
      // this.$refs.img.src = res.data.photo
    }

  },
  // 生命周期函数
  async created () {
    const { data: res } = await UserData()
    this.user = res.data
    this.value = res.data.name
    this.birthday = res.data.birthday
    this.name = res.data.name
  }
}
</script>

<style lang="less" scoped>
.van-cell {
  align-items: center;
}
.van-dialog {
 /deep/ .van-dialog__content{
    display: flex;
    justify-content: center;
  }
/deep/ .van-field__control{
  text-align: center;
}
}
</style>
