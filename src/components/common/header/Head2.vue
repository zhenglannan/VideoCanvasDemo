<template>
  <div id="head">
    <div style="position: absolute;
    left: 83px;
    line-height: 86px;">
      <!-- <el-button @click="$router.push('/home')" v-if="$route.path.indexOf('home2')!=-1">首页1</el-button>
      <el-button @click="$router.push('/home2')" v-else>首页2</el-button> -->
      
      <!-- <router-link to="/home" v-if="$route.path.indexOf('home2')!=-1" ></router-link>
      <router-link to="/home2" v-else></router-link> -->
    </div>
    <!-- 顶部标题图片 -->
    <div class="center-img"></div>
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
      <i
        class="el-icon-more"
        style="color: #fff;padding-left: 104px; cursor:pointer"
        @click="$emit('changeProgram')"
      ></i>
    </div>
    <!-- 站房详情 -->
    <!-- <div class="top-icon" v-if="$route.path==='/home'">
      <svg-icon icon-class="homeTop" style="    width: 34px;
    height: 18px;" :stroke="'red'"></svg-icon>
      <router-link to="/envMonitor">站房详情</router-link>
    </div>-->
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
#head {
  height: 86px;
  position: relative;

  .center-img {
    width: 468px;
    height: 43px;
    position: absolute;
    left: 0;
    right: 0;
    top: 26px;
    margin: auto;
    background: url("~assets/image/title.png") 0 0 / 100% no-repeat;
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
    position: absolute;
    height: 29px;
    left: 103px;
    top: 45px;
    padding: 5px;
    background: #115fb1;
    border-radius: 11px;
    box-shadow: 0px 0px 5px #9ab1b7;
    a {
      color: #d4ecff;
    }
    &:hover a {
      color: #dcb2b2;
    }
  }
}
</style>
