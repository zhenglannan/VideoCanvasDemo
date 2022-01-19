<template>
  <div id="head">
    <!-- 顶部标题图片 -->
    <div class="center-img">
      <span>{{$store.state.webTitle}}大屏</span>
    </div>
    <!-- 时间 -->
    <div class="top-date">
      <!-- <div class="simple-text-chart-container"> -->
      <span>{{$store.state.nickname}}</span>
      <!-- </div> -->
      <div class="splitLine"></div>
      <div class="time-chart-container">
        <span>{{date|formatDate}}</span>
      </div>

      <i
        class="el-icon-switch-button"
        style="color: #fff;
    padding: 0 10px; cursor:pointer"
        @click="loginOut"
      ></i>
    </div>
    <!-- 站房详情 -->
    <div class="top-icon" v-if="$route.path==='/home'">
      <!-- <svg-icon icon-class="homeTop" style="width: 24px;
      height: 15px;"></svg-icon>-->
      <router-link to="/envMonitor">站房详情</router-link>
    </div>
    <!--后台配置按钮  -->
    <div class="toAdmin">
      <!-- <i class="iconfont icon-houtaipeizhi" style="font-size: 17px;color: #fff;"></i> -->
      <a :href="href">后台配置</a>
    </div>
  </div>
</template>
 
<script>
import Button from "components/common/button/Button";
import { formateDate } from 'utils/index.js'
export default {
  name: "Head",
  data () {
    return {
      date: new Date(),
      timer: null,
      href: `${window.location.protocol}//${window.location.hostname}:${window.location.port}/admin/`
    };
  },
  components: {
    Button
  },
  methods: {
    loginOut () {
      // sessionStorage.clear();
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
    var _this = this;//声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(function () {
      _this.date = new Date();
    }, 1000)
  },
  //实例销毁之前调用。主要解绑一些使用addEventListener监听的事件等
  beforeDestroyed () {
    if (this.timer) {
      clearInterval(this.timer);//在Vue实例销毁前，清除定时器
    }
  }
};
</script> 
 
<style lang="scss" scoped>
@mixin btn($left, $top) {
  position: absolute;
  left: $left;
  top: $top;
  height: 29px;
  padding: 6px;
  background: #2939a9;
  border-radius: 5px;
  white-space: nowrap;
  border: 1px solid transparent;
  a {
    color: #d4ecff;
  }
  &:hover {
    border-color: #5c6fe0;
  }
}
#head {
  height: 86px;
  position: relative;
  .toAdmin {
    @include btn(210px, 44px);
  }
  .center-img {
    text-align: center;
    position: relative;
    top: 26px;
    span {
      font-size: 36px;
      font-weight: 900;
      background: linear-gradient(0deg,#b5ddfb, #78b0f7);
      -webkit-text-fill-color: transparent;
      -webkit-background-clip: text;
    }
    // background: url("~assets/image/title.png") 0 0 / 100% no-repeat;
  }
  .top-date {
    position: absolute;
    height: 48px;
    right: 40px;
    top: 35px;
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
  .top-icon {
    @include btn(103px, 44px);
  }
}
</style>
