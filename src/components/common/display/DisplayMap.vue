<template>
  <div :style="{height:height}">
    <div class="decorate-chart-container">
      <div class="decorate-item">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
 
<script>
export default {
  name: 'DisplayMap',
  data () {
    return {};
  },
  props: {
    // width: {
    //   type: String,
    // },
    height: {
      type: String,
      default: '320px'
    },
  },
  methods: {}
}
</script>
 
<style lang='scss' scoped>
.decorate-chart-container {
  width: 100%;
  height: 100%;
  padding: 10px;
  overflow: hidden;
  .decorate-item {
    // border-image-source: url("~assets/image/border1.png");
    // border-image-slice: 2 fill;
    // border-width: 1px;
    // border-style: solid;
    background: url("~assets/image/homeBorder2.png") no-repeat center/100% 100%;
    mix-blend-mode: screen; //*黑色底图滤色效果
    background-clip: padding-box;
    filter: blur(0px);
    width: 100%;
    height: 100%;
    position: relative;
  }
}
</style>
