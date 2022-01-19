<template>
  <div id="head">
    <div class="title">
      <!-- <img src="~assets/image/headTitle.png" alt /> -->
      <span>{{$store.state.webTitle}}</span>
    </div>
    <div class="tabArea">
      <ul>
        <head-btn
          @click.native="$store.state.style?$router.push($store.state.style):$router.push('/home')"
        >首页</head-btn>
        <head-btn @click.native="$router.push('/envMonitor')" path="envMonitor">环境监控</head-btn>
        <head-btn @click.native="$router.push('/securityMonitor')" path="securityMonitor">安消防监控</head-btn>
        <head-btn @click.native="$router.push('/lineMonitor')" path="lineMonitor">在线监测</head-btn>
        <head-btn @click.native="$router.push('/videoMonitor')" path="videoMonitor">视频监控</head-btn>
        <head-btn @click.native="$router.push('/smartPatrol')" path="smartPatrol">智能巡检</head-btn>

        <!-- <head-btn @click.native="$router.push('/home')">AI智能</head-btn>
        <head-btn @click.native="$router.push('/home')">告警分析</head-btn>-->

        <head-btn @click.native="$router.push('/statistics')" path="statistics">统计分析</head-btn>
        <head-btn @click.native="$router.push('/ai')" path="ai">AI分析</head-btn>
        <!-- <head-btn @click.native="$router.push('/robot')" path="robot">机器人</head-btn> -->
      </ul>
      <!-- 时间 -->
      <div class="top-date">
        <span>{{$store.state.nickname}}</span>
        <div class="splitLine"></div>
        <div class="time-chart-container">
          <span>{{date|formatDate}}</span>
          <!-- ?使用无效？ -->
          <!-- <span>{{date|$options.filters.formatDate}}</span> -->
        </div>
        <i
          class="el-icon-switch-button"
          style="color: #fff;
    padding: 0 10px; cursor:pointer"
          @click="loginOut"
        ></i>
      </div>
    </div>
  </div>
</template>
 
<script>
import { formateDate } from 'utils/index'
import HeadBtn from 'common/button/HeadBtn'
export default {
  name: 'HeadSecond',
  data () {
    return {
      date: new Date(),
    };
  },
  components: {
    HeadBtn
  },
  methods: {
    loginOut () {
      sessionStorage.clear();
      this.$store.commit("RESET_STATE");
      this.$router.replace('/login');
    }
  },
  filters: {
    formatDate: function (value) {
      if (!value) return ''
      return formateDate(value);
    }
  },
  mounted () {
    // var _this = this;//声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(() => {
      this.date = new Date();
    }, 1000)
  },
  //实例销毁之前调用。主要解绑一些使用addEventListener监听的事件等
  beforeDestroyed () {
    if (this.timer) {
      clearInterval(this.timer);//在Vue实例销毁前，清除定时器
    }
  }
}
</script>
 
<style lang='scss' scoped>
#head {
  height: 72px;
  position: relative;
  .title {
    width: 550px;
    height: 100%;
    position: absolute;
    background: url("~assets/image/headTitleArea.png");
    span {
      color: #c0dbf5;
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 4px;
      position: relative;
      left: 77px;
      top: 18px;
    }
  }
  .tabArea {
    position: absolute;
    left: 510px;
    width: calc(100% - 508px);
    background: url("~assets/image/headTabArea.png");
    ul {
      position: relative;
      left: 118px;
    }
    li {
      display: inline-block;
      width: 102px;
      height: 70px;
      font-size: var(--font-size);
      // font-family: PingFangSC-Regular;
      color: #d1ebff;
      text-align: center;
      line-height: 70px;
      cursor: pointer;
      &:hover {
        background: url("~assets/image/liHover.png");
      }
    }
    .top-date {
      position: absolute;
      height: 48px;
      right: 35px;
      top: 0px;
      bottom: 0;
      margin: auto;
      pointer-events: auto;
      font-size: 16px;
      display: flex;
      align-items: center;
      span {
        color: #d4ecff;
        line-height: 48px;
        padding: 0 8px 0 8px;
        white-space: nowrap;
      }
      .splitLine {
        width: 2px;
        height: 13px;
        background: linear-gradient(180deg, #cce6f9 0%, #81b3db 100%);
      }
    }
  }
}
</style>