<template>
  <div class="User">
    <div class="header">
      <div class="headerMain">
        <div class="img">
          <van-image round width="2rem" height="2rem" src="https://img01.yzcdn.cn/vant/cat.jpeg" />
        </div>
        <div class="text">
          <div>22</div>
          <div class="NCB">申请认证</div>
        </div>
      </div>
      <div class="headerFloot">
        <div>
          <div>0</div>
          <div>动态</div>
        </div>
        <div>
          <div>0</div>
          <div>关注</div>
        </div>
        <div>
          <div>0</div>
          <div>粉丝</div>
        </div>
      </div>
    </div>
    <div class="UserMain">
      <van-cell title="编辑资料" icon="location-o" is-link />
      <van-cell title="小四同学" icon="chat-o" is-link />
      <van-cell title="退出登陆" icon="warning-o" is-link />
    </div>
  </div>
</template>

<script>
import { GetToken } from '@/utils/token'
export default {
  created () {
    // 获取token当他的值不存在那么就跳转到登陆界面
    if (!GetToken('token')) {
      this.$router.push('/login')
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
        .NCB{
          color: cornflowerblue;
          background: white;
          border-radius: 5px ;
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
