<template>
  <div class="shi">
    <div ref="dialog" class="dialog">
      <div class="robot" >
        <div class="header"></div>
        <div class="content">我是小思</div>
      </div>
      <div class="user" v-for="(item, index) in user" :key="index">
        <div class="content">{{ item }}</div>
        <div class="header" ref="header"></div>
      </div>
    </div>
    <div class="inputbox">
      <div class="box">
        <van-field v-model="value" placeholder="说点什么....." />
        <span @click="SubmitEvent">提交</span>
      </div>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client'
import { GetToken } from '@/utils/token'

export default {
  data () {
    return {
      value: '',
      header: '',
      user: ['我是用户'],
      socket: ''
    }
  },
  created () {
    this.$store.dispatch('SetUser').then((value) => {
      this.header = value.data.photo

      const headerDom = this.$refs.header
      headerDom.forEach((element) => {
        element.style.background = `url(${value.data.photo})`
      })

      // headerDom.
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
    this.socket.on('connect', (socket) => {
      console.log('连接成功')
    })
    // 响应回来的数据
    this.socket.on('message', (obj) => {
      const str = `<div class="robot" >
        <div class="header"></div>
        <div class="content">${obj.msg}</div>
      </div>`
      this.$refs.dialog.insertAdjacentHTML('beforeend', str)
    })
  },
  methods: {
    SubmitEvent () {
      const data = this.value
      this.value = ''
      this.socket.emit('message', { msg: data })
      this.user.push(data)
      this.socket.on()
      this.$nextTick(function () {
        const headerDom = this.$refs.header
        console.log(headerDom)
        headerDom.forEach((element) => {
          element.style.background = `url(${this.header})`
        })
      })
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
  .user {
    display: flex;
    float: right;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;

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
      background: url('https://img01.yzcdn.cn/vant/cat.jpeg') no-repeat;
      background-size: 100% 100%;
      border-radius: 50%;
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
