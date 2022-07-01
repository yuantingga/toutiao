<template>
  <div class="shi">
    <div ref="dialog" class="dialog">
      <div class="robot">
        <van-image class="header" round  src="https://img01.yzcdn.cn/vant/cat.jpeg">
            <template v-slot:loading>

            </template>
          </van-image>
        <div class="content">我是小思</div>
      </div>
      <div class="user"  v-for="(item, index) in user" :key="index">
        <div class="content">{{ item }}</div>
         <van-image round  class="header"  :src="photo">
            <template v-slot:loading>
            </template>
          </van-image>
      </div>
    </div>
    <div class="inputbox">
      <div class="box">
        <van-field v-model="value" placeholder="说点什么....." @keyup.enter="SubmitEvent" />
        <span @click.prevent="SubmitEvent">提交</span>
      </div>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client'
import { GetToken } from '@/utils/token'

export default {
  name: 'SmallFour',
  data () {
    return {
      value: '',
      header: '',
      // 用户输入的信息
      user: ['我是用户'],
      socket: '',
      photo: GetToken('photo')
    }
  },
  async created () {
    this.$store.dispatch('SetUser').then((value) => {
      // 通过store进行设置获取用户信息,进行发送请求获取用户信息
      // 使用this.header属性进行存储图片信息
      this.header = value.data.photo
      // // 获取到页面上所有的header组件进行设置信息头像
      // const headerDom = this.$refs.header
      // // 通过遍历进行获取到页面每一个header组件进行设置北京图片
      // headerDom.forEach((element) => {
      //   element.style.background = `url(${value.data.photo})`
      // })
    })

    // 发送websocket请求，进行获取到小机器人的数据
    // 下载 npm run socket.io-client@4.0.0 这个是前端的
    // 直接下载socket.io是后端的
    // 在created生命周期函数中进行连接websocket，
    // 头部进行按需导入io import {io} from "socket.io-client"
    // const wstext = document.location.protocol === 'https:' ? 'wss' : 'ws'
    // const websocketUrl = wstext + '://' + window.location.host
    // console.log(websocketUrl)
    this.socket = io('http://geek.itheima.net', {
      query: {
        token: GetToken('token')
      },
      transports: ['websocket']
    })
    // 触发connect表示服务器与客户端连接成功，自定义事件
    this.socket.on('connect', (socket) => {
      console.log('连接成功')
    })
    // 响应回来的数据，使用的也是自定义事件
    this.socket.on('message', (obj) => {
      const str = `<div class="robot" >
         <div class="header"  >
            <img  src="https://img01.yzcdn.cn/vant/cat.jpeg" alt=''/>
          </div>
        <div class="content">${obj.msg}</div>
      </div>`
      console.log(str)
      // 进行添加字符串
      this.$refs.dialog.insertAdjacentHTML('beforeend', str)
    })
  },
  methods: {
    // 用户输入信息
    SubmitEvent () {
      const data = this.value
      this.value = ''
      // 向服务器进行发送数据
      this.socket.emit('message', { msg: data })
      // 添加用户自己输入的内容的信息
      this.user.push(data)
    }
  }
}
</script>
<style lang="less" scoped>
.shi {
  height: 100%;
  width: 100%;
}
.dialog {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-right: 5px;
  .user {
    display: flex;
    float: right;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin: 10px 0;

    .header {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-size: 100% 100% !important;
    }
    .content {
      padding: 10px;
      border: 0.01333rem solid #c2d9ea;
      background-color: #e0effb;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      margin-right: 20px;
      font-size: 16px;
      border-radius: 5px;
      &::after {
        content: '';
        border: 10px solid #e0effb;
        position: absolute;
        right: -19px;
        border-right: 10px solid transparent;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
      }
    }
  }
  /deep/.robot {
    margin-top: 10px;
    margin-left: 10px;
    display: flex;
    .header {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      img{
        width: 100%;
        height: 100%;
      border-radius: 50%;
      }
    }
    .content {
      padding: 10px;
      border: 0.01333rem solid #c2d9ea;
      background-color: #e0effb;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      margin-left: 20px;
      font-size: 16px;
      border-radius: 5px;
      &::after {
        content: '';
        border: 10px solid #e0effb;
        position: absolute;
        left: -19px;
        border-left: 10px solid transparent;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
      }
    }
  }
}
.inputbox {
  position: absolute;
  bottom: 0;
  width: 100%;
  .box {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    input {
      flex: 2;
    }
    span {
      width: 50px;
      font-size: 14px;
      color: rgb(153, 153, 153);
    }
  }
}
</style>
