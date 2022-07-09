<template>
  <div class="ArticleContent">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ArticleContent'
}
</script>

<style lang="less" scoped>
.ArticleContent{
  width: 100%;
  overflow: hidden;
  background-color: white;
}
/deep/ .content {
  font-size: 0.32rem;
  line-height: 0.64rem;
  width: 100%;
  height: 100%;
  overflow: auto;
  word-break: break-all;
  writing-mode: horizontal-tb;

  img{
    width: 100%;
  }
  pre{
    white-space: pre-wrap;
    word-wrap: break-word;
    background: #ccc;
  }
  .cnblogs_code {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    word-break: break-all;
    writing-mode: horizontal-tb;
  }
  p {
    word-break: break-all;
  }
}
</style>
