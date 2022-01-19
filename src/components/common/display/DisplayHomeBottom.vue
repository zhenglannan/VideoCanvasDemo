<template>
  <div :style="{height:height}">
    <div class="decorate-chart-container">
      <div class="decorate-item">
        <!-- title -->
        <div class="headTitle">
          <slot name="img"></slot>
          <span>
            <slot name="title"></slot>
          </span>
          <span style="right: 10px; position: absolute;cursor:pointer" v-show="isShow">
            <slot name="more"></slot>
          </span>
        </div>
        <!-- 展示内容 -->
        <div class="content">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
export default {
  name: 'DisplayHomeBottom',
  data () {
    return {};
  },
  props: {
    height: {
      type: String,
      default: '320px'
    },
    isShow: {
      type: Boolean,
      default: false
    },
  },
  methods: {}
}
</script>
 
<style lang='scss' scoped>
.decorate-chart-container {
  width: 100%;
  height: 100%;
  // padding: 10px;
  padding: 7px 10px;
  overflow: hidden;
  .decorate-item {
    // border-image-source: url("~assets/image/border.png");
    // border-image-slice: 9 fill;
    // border-width: 4px;
    // border-style: solid;
    // background-clip: padding-box;
    background: url("~assets/image/homeBorder3.png") no-repeat center/100% 100%;
    mix-blend-mode: screen; //*黑色底图滤色效果
    filter: blur(0px);
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-flow: column;
    // .simple-text-chart-container {
    //   color: #ffffff;
    //   height: 6.3%;
    //   // height: 21px;
    //   // line-height: 21px;
    //   font-size: 15px;
    //   color: #ffffff;
    //   letter-spacing: 2px;
    //   text-shadow: 0px 2px 4px #0c1753;
    //   & + div {
    //     flex: 1;
    //   }
    // }
    .headTitle {
      height: 51px;
      padding: 15px 0 5px 15px;
      display: flex;
      align-items: center;
      span {
        font-size: 18px;
        color: #b7dcff;
        letter-spacing: 2px;
        margin-left: 6px;
      }
    }
    .content {
      flex: 1;
    }
  }
}
</style>
