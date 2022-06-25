<template>
  <div>
    <van-nav-bar title="黑马头条-登陆"   />
    <van-form @submit="onSubmit">
      <van-field v-model="username" required name="mobile" label="手机号" placeholder="手机号"
       :rules="[{ required: true, message: '请填写手机号',pattern :/^1[3456789]\d{9}$/ }]" />
      <van-field v-model="password" required type="password" name="code" label="密码" placeholder="密码"
      :rules="[{ required: true, message: '请填写密码',pattern:/\w{6,8}/ }]" />
      <div style="margin: 16px">
        <van-button round block type="info" :disabled="Disabled" :loading="Loading"
         loading-text="加载中..." native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login } from '@/api/index'
import { Toast } from 'vant'
import { GetToken, SetToken } from '@/utils/token.js'
import EventBus from '@/utils/eventBus'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  data () {
    return {
      username: '13888888888',
      password: '246810',
      Loading: false,
      Disabled: false
    }
  },
  methods: {
    // 提交登陆
    async onSubmit (values) {
      // 按钮的禁用余加载效果
      this.Loading = true
      this.Disabled = true
      try {
        // 发送登陆请求
        // eslint-disable-next-line no-unused-vars
        const { data: res, status } = await login(values)
        // 设置token到本地缓存中
        SetToken('token', res.data.token)
        Toast.success('登陆成功')
        if (GetToken('login') === '/channel') {
          this.$router.replace(GetToken('login'))
        } else {
          this.$router.replace('/Index/Content')
          EventBus.$emit('UserClick', '/Index/Content')
        }
      } catch (error) {
        Toast.fail('登陆失败')
      }
      setTimeout(() => {
        this.Loading = false
        this.Disabled = false
      }, 1000)
    }
  }
}
</script>
<style scoped></style>
