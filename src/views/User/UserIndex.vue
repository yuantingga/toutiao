<template>
  <div class="User">
    <div class="header">
      <div class="headerMain">
        <div class="img">
          <van-image round width="2rem" height="2rem" :src="user.photo" />
        </div>
        <div class="text">
          <div>{{ user.name }}</div>
          <div class="NCB">申请认证</div>
        </div>
      </div>
      <div class="headerFloot">
        <div>
          <div>{{ user.art_count }}</div>
          <div>动态</div>
        </div>
        <div>
          <div>{{ user.follow_count }}</div>
          <div>关注</div>
        </div>
        <div>
          <div>{{ user.fans_count }}</div>
          <div >粉丝</div><!--@click="FansEvent"-->
        </div>
      </div>
    </div>
    <div class="UserMain">
      <van-cell @click="Edit" title="编辑资料" icon="location-o" is-link />
      <van-cell @click="SetHistory" title="历史记录" icon="location-o" is-link />
      <van-cell @click="SmallFour" title="小四同学" icon="chat-o" is-link />
      <van-cell @click="quit" title="退出登陆" icon="warning-o" is-link />
    </div>
  </div>
</template>

<script>

import { GetToken, SetToken, RemoveToken } from '@/utils/token'
import { Dialog } from 'vant'

export default {
  data () {
    return {
      img: '',
      user: ''
    }
  },
  async created () {
    // 获取token当他的值不存在那么就跳转到登陆界面
    if (!GetToken('token')) {
      this.$router.push('/login')
    }

    this.$store.dispatch('SetUser').then((value) => {
      this.user = value.data
    })
  },
  activated () {
    this.$store.dispatch('SetUser').then((value) => {
      this.user = value.data
    })
  },
  watch: {
    '$store.state.User': function () {

    }
  },
  methods: {
    quit () {
      Dialog.confirm({
        title: '确认退出?',
        message: '这就走了?不爱我了吗?'
      })
        .then(() => {
          // on confirm
          // this.$router.push()
          RemoveToken('token')
          this.$router.push('/login')
        })
        .catch(() => {
          // on cancel
        })
    },
    Edit (event) {
      this.$router.push('/User/Edit')
      SetToken('title', event.target.innerText)
    },
    SetHistory (event) {
      this.$router.push('/User/History')
      this.$store.commit('SetRouter', '/User/History')
      SetToken('title', event.target.innerText)
    },
    FansEvent () {
      this.$router.push('/User/Fans')
      SetToken('title', event.target.innerText)
    },
    SmallFour (event) {
      this.$router.push('/User/SmallFour')
      SetToken('title', event.target.innerText)
    }
  }
}
</script>

<style lang="less" scoped>
.User {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  .icon-you1 {
    font-size: 18px;
    color: #969799;
  }
  .header {
    width: 100%;
    background: cornflowerblue;
    height: 250px;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .headerFloot,
    .headerMain {
      flex: 1;
      display: flex;
    }
    .headerMain {
      .img {
        width: 70px;
        height: 70px;

        display: flex;
        justify-content: center;
        align-items: center;
      }
      .text {
        margin-left: 10px;
        .NCB {
          width: 80px;
          color: cornflowerblue;
          background: white;
          border-radius: 5px;
          font-size: 14px;
          padding: 2px 10px;
          margin-top: 10px;
        }
      }
      div {
        color: white;
        font-size: 16px;
      }
    }
    .headerFloot {
      > div {
        flex: 1;
        display: flex;
        align-content: center;
        flex-direction: column;
        text-align: center;
        color: white;
        font-size: 16px;
        justify-content: center;
      }
    }
  }
}
</style>
