<template>
  <div class="text">
    <van-popup v-model="show1" :position="direction" :style="{ height: '100%', width: '100%' }">
      <van-nav-bar :title="title1" :right-text="rightText1" left-arrow @click-left="show1 = false" @click-right="onClickRight" />
      <slot name="html"></slot>
    </van-popup>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  props: ['position', 'show', 'rightText', 'title', 'fun'],
  name: 'TextareaVue',
  data () {
    return {

      show1: this.show,

      direction: this.position,
      title1: this.title,
      rightText1: this.rightText
    }
  },
  watch: {
    show: function (newval) {
      console.log(newval)
      this.show1 = newval
    }
  },
  methods: {
    TextareaInput (e) {
      $('.num')[0].innerHTML = e.target.value.length + '/100'
    },
    onClickRight () {
      this.fun()
    }
  }
}
</script>

<style lang="less" scoped>
.text{
  padding: 10px;
  overflow: hidden;
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
</style>
