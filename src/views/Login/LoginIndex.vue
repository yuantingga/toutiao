<template>
  <div class="login">
    <van-nav-bar left-arrow />
    <div class="content">
      <h1>短信登陆</h1>
      <van-form @submit="onSubmit" ref="form">
        <van-field v-model="username"  name="mobile" placeholder="手机号" autocomplete="off"  :rules="rules.phone" />
        <div class="captcha">
          <van-field v-model="password" type="password" name="code" placeholder="验证码"
          :rules="rules.note"> </van-field>
          <div class="add" @click="sendEvent">发送验证码</div>
        </div>

        <div style="margin: 16px">
          <van-button round block type="info" :disabled="Disabled" :loading="Loading" loading-text="加载中..." native-type="submit">提交</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { login, SMS } from '@/api/index'
import { hiti } from '@/utils/hint'
import { SetStorage, RemoveSetStorage, GetStorage } from '@/utils/storage.js'
import { GetToken, SetToken } from '@/utils/token.js'

// import EventBus from '@/utils/eventBus'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  data () {
    return {
      username: '14567654444',
      password: '100232',
      Loading: false,
      Disabled: false,
      one: true,
      time: false,
      rules: {
        phone: [{
          validator: (val, rule) => {
            const rex = /^1[3456789]\d{9}$/
            if (val === '') {
              rule.message = '请输入手机号'
              return false
            } else if (!rex.test(val)) {
              rule.message = '请输入正确的手机号'
              return false
            } else {
              return true
            }
          },
          trigger: 'onBlur'
        }],
        note: [{
          validator: (val, rule) => {
            if (val.length === 0) {
              rule.message = '请输入验证码'
              return false
            } else if (val.length > 0 && val.length < 6) {
              rule.message = '验证码6个数字'
              return false
            } else {
              return true
            }
          },
          trigger: 'onBlur'

        }]
      }

    }
  },
  methods: {

    // 提交登陆
    async onSubmit (values) {
      // 按钮的禁用余加载效果
      this.Loading = true
      this.Disabled = true
      login(values)
        .then((value) => {
          hiti({
            type1: 'loading',
            message1: '登陆成功'
          })
          SetToken('token', value.data.token)
          SetStorage('refresh_token', value.data.refresh_token)
          hiti({
            type1: 'success',
            message1: '登陆成功'
          })
          if (GetStorage('path')) {
            console.log(GetStorage('path'))
            this.$router.push(GetStorage('path'))
          } else {
            this.$router.push('/Index/Content')
          }
        })
        .catch((value) => {
          console.log(value)
          hiti({
            type1: 'danger',
            message1: '登陆失败'
          })
        })
      SetStorage('err', 'true')
      // 设置token到本地缓存中
      setTimeout(() => {
        this.Loading = false
        this.Disabled = false
      }, 1000)
    },
    sendEvent (e) {
      const rex = /^1[3456789]\d{9}$/
      if (!rex.test(this.username)) {
        this.$refs.form.validate()
        this.time = true
      }
      if (this.time === false) {
        let inn = 100
        SMS(this.username).then(value => {
          console.log(value)
        })
        this.time = setInterval(() => {
          if (inn <= 0) {
            clearInterval(this.time)
            this.time = false
          }
          inn--
          e.target.innerHTML = inn + '秒后获取'
        }, 1000)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.login {
  .content {
    padding: 20px;

    h1 {
      font-size: 30px;
       margin-bottom: 60px;
    }
    .van-cell{
      margin: 10px 0;
    }
    .van-button--normal{
      font-size: 20px;
    }
    /deep/.van-field__control{
      font-size: 20px;
    }
    /deep/.van-field__control::placeholder {
      color: #c8c9cc;
      font-size: 20px;
    }
    .captcha {
      display: flex;
      font-size: 20px;
      .add {
        width: 120px;
        display: flex;
        align-items: center;
        font-size: 15px;
        color: #c8c9cc;
      }
    }
  }
}
</style>
