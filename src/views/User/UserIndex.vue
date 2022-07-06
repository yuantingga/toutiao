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
          <div >粉丝</div><!--@click.prevent="FansEvent"-->
        </div>
      </div>
    </div>
    <div class="UserMain">
      <van-cell @click.prevent="Edit" title="编辑资料" icon="location-o" is-link />
      <van-cell @click.prevent="SetHistory" title="历史记录" icon="location-o" is-link />
      <van-cell @click.prevent="SmallFour" title="小四同学" icon="chat-o" is-link />
      <van-cell @click.prevent="quit" title="退出登陆" icon="warning-o" is-link />
    </div>
  </div>
</template>

<script>

import { RemoveToken } from '@/utils/token'
import { Dialog } from 'vant'
import { SetStorage, RemoveSetStorage, GetStorage } from '@/utils/storage.js'
export default {
  data () {
    return {
      img: '',
      user: ''
    }
  },
  async created () {
    this.$store.dispatch('SetUser').then((value) => {
      this.user = value.data
    }).catch((value) => {
    })
  },
  watch: {
    '$store.state.name': function (newval) {
      console.log(newval)
      this.user.name = newval
    },
    '$store.state.photo': function (newval) {
      console.log(newval)
      this.user.photo = newval
    }
  },
  methods: {
    // 退出
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
    // 编辑
    Edit (event) {
      this.$router.push('/User/Edit')
      SetStorage('title', event.target.innerText)
    },
    // 历史
    SetHistory (event) {
      this.$router.push('/User/History')
      this.$store.commit('SetRouter', '/User/History')
      SetStorage('title', event.target.innerText)
    },

    SmallFour (event) {
      this.$router.push('/User/SmallFour')
      SetStorage('title', event.target.innerText)
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
