<template>
  <div class="edit">
    <div class="one">
      <van-cell is-link>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #default>
          <!-- 头像 ImgEvent头像点击显示文件表单 user.photo头像图片 -->
          <van-image ref="img" round width="1rem" height="1rem" @click.prevent="ImgEvent" :src="user.photo" />

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
      <!-- name的单元格 -->
      <van-cell :value="$store.state.intro" @click="show4 = true" is-link>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <span class="custom-title">简介</span>
        </template>
      </van-cell>
    </div>
    <div class="two">
      <van-cell :value="six" @click="show3 = true" is-link>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <span class="custom-title">性别</span>
        </template>
      </van-cell>
      <van-cell @click.prevent="show2 = true" :value="birthday" is-link>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <span class="custom-title">生日</span>
        </template>
      </van-cell>
    </div>
    <!--生日的 时间选择器 -->
    <van-action-sheet v-model="show2">
      <van-datetime-picker v-model="currentDate" type="date" title="选择年月日" :min-date="minDate" :max-date="maxDate" @confirm="affirm" @cancel="cancelEvent" />
    </van-action-sheet>

    <!-- name修改的弹窗 -->
    <van-dialog v-model="show" @confirm="DislogEvent" title="修改name" show-cancel-button>
      <van-field placeholder="请输入名称" style="width: 200px; text-align: center" v-model="value" />
    </van-dialog>

    <van-action-sheet v-model="show3" :actions="actions" cancel-text="取消" @select="SixEvent" close-on-click-action @cancel="onCancel" />
    <!-- <van-popup v-model="show4" position="right" :style="{ height: '100%', width: '100%' }">
      <van-nav-bar title="简介" right-text="提交" left-arrow @click-left="show4 = false" @click-right="onClickRight" />

    </van-popup> -->
    <TextareaVue :show="show4" :fun="onClickRight" position="right" rightText="提交" title="编辑简介" >
      <template #html>

        <textarea @input="TextareaInput" v-model="textvalue" name="" id="" cols="30" rows="10" minlength="0" maxlength="100" placeholder="请输入简介"></textarea>
        <span class="num">0/100</span>
      </template>
    </TextareaVue>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { UserData, Setphoto, UserAmend } from '@/api/index.js'
import { Toast } from 'vant'
import dayjs from 'dayjs'
import $ from 'jquery'
import { hiti } from '@/utils/hint'
import TextareaVue from '@/components/textarea/TextareaVue.vue'
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
      currentDate: new Date(2021, 0, 17),
      six: '',
      text: '简介内容',
      show3: false,
      actions: [{ name: '男' }, { name: '女' }],
      show4: false,
      textvalue: '',
      obj: {}
    }
  },
  methods: {
    TextareaInput (e) {
      $('.num')[0].innerHTML = e.target.value.length + '/100'
    },
    onClickRight () {
      const text = this.textvalue.trim()
      if (text) {
        UserAmend({ intro: text }).then((value) => {
          this.show4 = false
          this.$store.commit('Setintro', text)
          hiti({ type1: 'success', message1: '提交成功' })
        })
      } else {
        hiti({ type1: 'fail', message1: '提交内容不能为空！' })
      }
    },
    async SixEvent (value) {
      this.six = value.name
      const val = value.name === '男' ? 0 : 1

      const obj = {
        gender: val
      }
      const { data: res } = await UserAmend(obj)
      console.log(res)
    },
    onCancel () {
      // Toast('取消')
      this.show3 = false
    },
    // 弹出的确认，修改name
    async DislogEvent () {
      this.name = this.value

      UserAmend({ name: this.name }).then((value) => {
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
      Setphoto(f).then((value) => {
        this.user.photo = value.data.photo
        this.$store.commit('SetPhoto', value.data.photo)
      })
    }
  },
  // 生命周期函数，编辑资料界面用户数据
  async created () {
    UserData()
      .then((value) => {
        this.user = value.data
        this.value = value.data.name
        this.birthday = value.data.birthday
        this.name = value.data.name
        this.six = value.data.gender === 0 ? '男' : '女'
        this.$store.commit('Setintro', value.data.intro)
        this.textvalue = value.data.intro
      })
      .catch((value) => {
        //
        console.log('cw')

        // console.log(value)
      })
  },
  components: {
    TextareaVue
  }
}
</script>

<style lang="less" scoped>
.edit {
  background: #f8f8f8;
  box-sizing: border-box;
  /deep/ .van-nav-bar__right {
    .van-nav-bar__text {
      color: #fc6627;
    }
  }
  textarea {
    resize: none;
    height: 100px;
    width: 95%;
    background: #f8f8f8;
    margin: 10px 10px;
    border: none;
    border-radius: 5px;
    padding: 20px 10px;
    padding-top: 10px;
    font-size: 15px;
  }
  .num {
    position: absolute;
    top: 135px;
    right: 21px;
    font-size: 15px;
    color: #ccc;
  }
  .two {
    margin-top: 20px;
  }
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
}
</style>
