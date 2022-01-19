<template>
  <!-- 光字牌外框组件 -->
  <div class="pane" :style="paneStyle">
    <div :class="outClass" :style="outStyle">
      <!-- 标题 -->
      <!-- <div class="title"> -->
      <div class="title" :style="titleStyle">
        <div class="simple-text-chart-container">
          <span>
            <slot name="title"></slot>
          </span>
        </div>
      </div>
      <!-- 内容 -->
      <slot></slot>
    </div>
  </div>
</template>
 
<script>
export default {
  name: 'LightPlatePane',
  data () {
    return {};
  },
  props: {
    eventlevel: {
      type: [Number, String]
    }
  },
  methods: {},
  computed: {
    outClass () {
      if (this.eventlevel == -1) {
        return 'lightplate_normal'
      } else if (this.eventlevel == 1) {
        return 'lightplate_preAlarm'
      } else if (this.eventlevel == 2) {
        return 'lightplate_alarm'
      } else if (this.eventlevel == -2) {
        return 'lightplate_offline'
      }
    },
    // 环境监测和在线监测宽高不一样
    outStyle () {
      return this.$route.path.indexOf("lineMonitor") > -1 ? { "width": "280px", "height": "190px" } : { "width": "210px", "height": "130px" }
      // return this.$route.path.indexOf("list")>-1?{"width":"210px","height":"130px"}:{"width":"210px","height":"130px"}
    },
    titleStyle () {
      return this.$route.path.indexOf("lineMonitor") > -1 ? { "height": "36px" } : { "height": "24px" }
    },
    paneStyle () {
      return this.$route.path.indexOf("lineMonitor") > -1 ? { "padding": "30px 16px" } : { "padding": "18px 16px" }
    }
  }
}
</script>
 
<style lang='scss' scoped>
@mixin lightplate($bgurl) {
  // width: 210px;
  // height: 130px;
  display: flex;
  flex-direction: column;
  background: url($bgurl) center/100% 100%;
  position: relative;
  .title {
    // height: 40px;
    font-family: PingFangSC-Medium;
  }
}
.pane {
  transition: all 0.2s linear;
  // padding: 18px 16px;
  display: inline-block;
  cursor: pointer;
  &:hover {
    transform: scale(1.1, 1.1);
  }
  span {
    font-size: 14px;
    color: #ffffff;
    letter-spacing: 2px;
    text-shadow: 0px 2px 3px rgba(0, 51, 83, 0.5);
  }
}
.lightplate_normal {
  @include lightplate("~assets/image/env/paneNormal.png");
}
.lightplate_offline {
  @include lightplate("~assets/image/env/paneOffine.png");
}
.lightplate_preAlarm {
  @include lightplate("~assets/image/env/panePrealarm.png");
}
.lightplate_alarm {
  @include lightplate("~assets/image/env/paneAlarm.png");
}
</style>