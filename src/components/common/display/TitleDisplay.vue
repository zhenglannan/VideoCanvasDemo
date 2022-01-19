<template>
  <div :style="{height:height}">
    <div class="decorate-chart-container">
      <div class="decorate-item">
        <!-- 标题 -->
        <div class="titleWrapper">
          <div class="simple-text-chart-container">
            <slot name="title"></slot>
          </div>
        </div>
        <div class="scrollPane">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
export default {
  name: 'TitleDisplay',
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
  // padding: 10px;
  overflow: hidden;
  .decorate-item {
    border-image-source: url("~assets/image/border1.png");
    border-image-slice: 2 fill;
    border-width: 1px;
    border-style: solid;
    border-color: #2275e4;
    box-shadow: 0px 0px 12px 0px #1031b2;
    background-clip: padding-box;
    filter: blur(0px);
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-flow: column;
    .titleWrapper {
      height: 50px;
      // background: url("~assets/image/titleImage.png");
      background: linear-gradient(
        180deg,
        #3b57bb 0%,
        #072466 96%,
        #284db0 100%
      );
      font-family: PingFangSC-Medium;
      & + div {
        flex: 1;
      }
    }
    .scrollPane {
      overflow: hidden;
      overflow-y: auto;
      // position: relative;
      // &::-webkit-scrollbar {
      //   padding-left: 1px;
      // }
    }
  }
}
</style>
