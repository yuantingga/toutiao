<template>
  <div class="feedback">
    <textarea @input="TextareaInput" v-model="textvalue" name="" id="" cols="30" rows="10" minlength="0" maxlength="100" placeholder="请输入简介"></textarea>
        <span class="num">0/100</span>

        <van-uploader v-model="fileList" :max-size="20000 * 1024" @oversize="onOversize" multiple :max-count="6" />
        <div class="hiti">最多6张，单个图片不能超过20M</div>
        <h1>联系方式</h1>
        <van-field v-model="value" placeholder="请输入用户名" />
        <van-button type="primary" style="background: cornflowerblue" @click="sendEvent" block>提交反馈</van-button>

  </div>
</template>

<script>
import TextareaVue from '@/components/textarea/TextareaVue.vue'
import { UserAmend } from '@/api/index'
import { hiti } from '@/utils/hint'
import $ from 'jquery'
export default {
  data () {
    return {
      show4: true,
      textvalue: '',
      obj: {},
      fileList: [],
      value: ''
    }
  },
  methods: {
    onOversize () {
      hiti({ type1: 'html', message1: '文件大小不能超过 20M' })
    },
    TextareaInput (e) {
      $('.num')[0].innerHTML = e.target.value.length + '/100'
    },
    sendEvent () {
      this.value = ''
      this.fileList = []
      this.textvalue = ''
      hiti({ type1: 'success', message1: '提交成功' })
    }
  }
}
</script>

<style lang="less" scoped>
.feedback {
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
  .van-uploader {
    margin: 10px;
    margin-bottom: 0;
  }
  .hiti {
    margin: 10px;
    margin-bottom: 0;
    color: #ccc;
    font-size: 18px;
  }
  h1 {
    font-size: 25px;
    margin: 10px;
    margin-bottom: 0;
  }
  /deep/.van-field__value {
    background: #f8f8f8;
    overflow: visible;
  }
  /deep/input {
    padding: 10px;
  }
  /deep/.van-cell {
    padding: 10px;
  }
  /deep/.van-button--block {
    display: block;
    /* width: 100%; */
    width: 95%;
    margin: 10px;
    margin-top: 200px;
  }
}
</style>
