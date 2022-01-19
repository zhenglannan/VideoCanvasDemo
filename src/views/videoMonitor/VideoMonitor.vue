<template>
  <div class="videowrapper">
    <!-- 站房列表 -->
    <div class="regionListWrapper">
      <transition name="slide">
        <div v-show="isCameraShow" class="regionListTree">
          <region-tree @open-all-video="openAllVideo"></region-tree>
        </div>
      </transition>
      <!-- 按钮 -->
      <div style="position:relative">
        <!-- <div class="showCamera" :style="{backgroundImage:'url('+url+')'}" @click="isCameraShow=!isCameraShow"></div> -->
        <div :class="showCamera" @click="isCameraShow=!isCameraShow"></div>
      </div>
    </div>
    <!-- 视频显示 -->
    <div class="video">
      <display-without-title height="100%">
        <el-tabs v-model="activeName">
          <el-tab-pane label="实时视频" name="first" style="height: 940px;">
            <div class="videoCompContainer">
              <div v-contextmenu:contextmenu style="height:100%">
                <video-comp
                  v-for="n in videoNum"
                  :key="n"
                  :ref="`video${n}`"
                  @select-video="selectVideo(n)"
                  :width="videoWidth"
                  :height="videoHeight"
                  :index="n"
                  @full-screen="fullScreen"
                  @change-flag="changeFlag()"
                ></video-comp>
              </div>
            </div>
            <div class="numWrapper">
              <div
                v-for="item in numScreenArr"
                :key="item"
                @click="videoNum=item"
                :class="{active:videoNum==item}"
              >
                <!-- <img :src="`assets/image/videoMonitor/${item}.png`" alt=""> -->
                <img :src="require('@/assets/image/videoMonitor/'+item+'.png')" alt />
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="录像回放" name="second">
            <!-- 视频 -->
            <div style="position:relative">
              <video
                ref="recordVideo"
                class="videoControl1"
              >Your browser is too old which doesn't support HTML5 video.</video>
              <div v-show="isWaitText" class="waitText">
                <img
                  src="~assets/image/videoMonitor/videoPoster.png"
                  alt
                  style="vertical-align: middle;"
                />
                <span>暂无数据</span>
              </div>
              <div ref="wait" v-show="isShowWait" class="ball-scale" />
            </div>
            <!-- 时间进度条 -->
            <div>
              <canvas id="wtime" class="TimeControl"></canvas>
            </div>
          </el-tab-pane>
        </el-tabs>
      </display-without-title>
    </div>
    <!-- 云台以及预置位 -->
    <div class="controlWrapper">
      <!-- 按钮 -->
      <div style="position:relative">
        <div :class="showControl" @click="isControlShow=!isControlShow"></div>
      </div>
      <!-- <transition name="slide_right"> -->
      <!-- 视频控制 -->
      <div v-show="isControlShow" class="controlPane" v-if="activeName==='first'">
        <title-display height="367px" class="prestoListwrapper">
          <template v-slot:title>摄像机列表</template>
          <video-monitor-camera :regionid="$store.state.regionid" @send-cameraid="sendCameraid"></video-monitor-camera>
          <!-- <div style="text-align: center;">
            <el-button @click="openAllVideo($store.state.regionid)">全部打开</el-button>
            <el-button @click="closeAllVideo">全部关闭</el-button>
          </div>-->
        </title-display>
        <title-display height="316px" class="prestoListwrapper">
          <template v-slot:title>预置位列表</template>
          <video-monitor-presto :cameraid="cameraid" @send-presetno="sendPresetno"></video-monitor-presto>
        </title-display>
        <title-display height="324px" style="padding: 10px;">
          <template v-slot:title>云台速度</template>
          <video-monitor-yuntai @ptz_control="ptz_control" ref="yuntai"></video-monitor-yuntai>
        </title-display>
      </div>
      <!-- 录像回放控制 -->
      <div v-else v-show="isControlShow" class="controlPane">
        <title-display height="656px" class="prestoListwrapper">
          <template v-slot:title>摄像机列表</template>
          <video-monitor-camera
            style="height:584px"
            :regionid="$store.state.regionid"
            @sendCameraid="sendCameraid"
          ></video-monitor-camera>
        </title-display>
        <title-display height="351px" style="padding: 10px;">
          <template v-slot:title>录像查询</template>
          <div
            style="display:flex;height: 43px;margin: 21px 0;display: flex; justify-content: center;"
          >
            <span style="color:#fff;line-height: 43px;font-size: 14px;">查询时间：</span>
            <el-date-picker v-model="starttime" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </div>
          <div style="display: flex; justify-content: space-evenly;">
            <el-button @click="find()">查询</el-button>
            <el-button @click="mp_pause()">{{comptedStatus}}</el-button>
            <!-- <el-button @click="mp_fast()">快进</el-button> -->
            <el-button @click="mp_close()">关闭</el-button>
          </div>
        </title-display>
      </div>
      <!-- </transition> -->
    </div>
    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item @click="openAllVideo($store.state.regionid)">全部打开</v-contextmenu-item>
      <v-contextmenu-item @click="closeAllVideo">全部关闭</v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>
<script>
import path from '@/settings'

import TitleDisplay from "common/display/TitleDisplay";
import DisplayWithoutTitle from "common/display/DisplayWithoutTitle";
import RegionTree from "content/regiontree/RegionTree";
import VideoMonitorYuntai from "./child/VideoMonitorYuntai";
import VideoMonitorCamera from "./child/VideoMonitorCamera";
import VideoMonitorPresto from "./child/VideoMonitorPresto";
import VideoComp from "./child/VideoComp";
import { getCameraList } from 'network/video';
import { getSocket } from 'utils/socket'

export default {
  name: 'VideoMonitor',
  data () {
    return {
      isCameraShow: true,
      isControlShow: true,
      isControlPaneShow: true,
      activeName: 'first',
      filterText: '',
      cameraid: '',
      hostIp: '192.168.91.96',
      hostPort: path.streamPort,
      videos: [],
      currentVideo: null,

      starttime: new Date(new Date().toLocaleDateString()),
      // starttime: new Date(new Date(new Date().toLocaleDateString()).getTime()),
      // endtime: new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1),
      // endtime: new Date(new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime()+ 24 * 60 * 60 * 1000),
      currentTime: '',
      wt: null,
      mp1: null,
      isWait: false,
      isWaitText: true,
      videoStatus: false,

      videoNum: 4,//几路视频
      currentVideoIndex: 1,
      // videoWidth: "50%",
      // videoHeight: "445px",
      numScreenArr: [1, 4, 6, 9, 16],
      currentNumScreen: 4
    };
  },
  components: {
    TitleDisplay,
    DisplayWithoutTitle,
    VideoMonitorYuntai,
    VideoMonitorCamera,
    VideoMonitorPresto,
    RegionTree,
    VideoComp
  },
  methods: {
    // 关闭所有视频
    closeAllVideo () {
      for (let i = 1; i <= this.videoNum; i++) {
        this.$refs[`video${i}`][0].flv_close();
      }
    },
    // 双击树打开所有视频
    openAllVideo (id) {
      // 先关闭其他视频
      this.closeAllVideo();
      // for (let i = 1; i <= this.videoNum; i++) {
      //   this.$refs[`video${i}`][0].flv_close();
      // }
      getCameraList(id).then(res => {
        for (let i = 1, len = res.data.length; i <= len; i++) {
          if (i <= this.videoNum) {
            let index = i - 1;
            this.$refs[`video${i}`][0].flv_open(res.data[index].sensorid);
          }
        }
      })
    },
    fullScreen (isFullScreen, index) {
      if (isFullScreen) {//全屏隐藏其他video
        for (let i = 1; i <= this.videoNum; i++) {
          if (i != index) {
            this.$refs[`video${i}`][0].isVideoShow = false;
          }
        }
      } else {
        for (let i = 1; i <= this.videoNum; i++) {
          this.$refs[`video${i}`][0].isVideoShow = true;
        }
      }
    },
    // 选中某个video
    selectVideo (n) {
      // !refs []语法需要加[0],可以先打印看看
      // console.log(this.$refs[`video${n}`][0]);
      this.$refs[`video${this.currentVideoIndex}`][0].isSelect = false;
      this.currentVideoIndex = n;
      this.$refs[`video${n}`][0].isSelect = true;
    },
    // 修改主/子码流
    changeFlag () {
      this.$refs[`video${this.currentVideoIndex}`][0].flv_open(this.cameraid);
    },
    // 点击摄像机
    sendCameraid (id) {
      this.cameraid = id; 
      if (this.activeName == "first") {
        this.$refs[`video${this.currentVideoIndex}`][0].flv_open(id);
      }
    },
    sendPresetno (id) {
      this.$refs[`video${this.currentVideoIndex}`][0].ptz_preset(id);
    },
    // 控制选中video
    ptz_control (cmd) {
      this.$refs[`video${this.currentVideoIndex}`][0].ptz_control(cmd, this.$refs.yuntai.speed);
    },

    //录像--查询
    find () {
      this.wt.clear();
      this.wt.startTime = new Date(this.starttime.toLocaleDateString());
      this.wt.stopTime = this.endtime;

      MPlayer.find(this.hostIp, this.hostPort, this.cameraid, this.starttime, this.endtime, (result, data) => {
        if (result) {
          data.forEach(o => {
            this.wt.addPeriod(o.start, o.stop, o.name);
            console.log(this.wt);
          });
        }
        else {
          console.log("find error: " + data);
        }
      });
    },
    mp_pause () {
      if (this.mp1) {
        this.mp1.playPause = !this.mp1.playPause;
        this.videoStatus = this.mp1.playPause;
      }
    },
    // mp_fast () {
    //   if (this.mp1) {
    //     this.mp1.playFast();
    //   }
    // },
    mp_close () {
      if (this.mp1) {
        this.mp1.close();
        this.mp1 = null;
        this.isWait = false;
        this.isWaitText = true;
      }
    },
    mp_open (t) {
      this.mp_close();
      this.mp1 = new MPlayer(this.$refs.recordVideo);
      this.mp1.debugFlag = true;
      this.mp1.onstatechanged = (state) => {
        if (this.mp1) {
          this.isWait = !state;
        }
      }
      this.mp1.ontimechanged = (value) => {
        if (this.mp1) {
          console.log("time changed: " + value);
          this.wt.currentTime = value;
        }
      }

      this.isWait = true;
      this.isWaitText = false;
      this.mp1.openFile(this.hostIp, this.hostPort, this.cameraid, t);
    },
    // JumptoTime () {
    //   this.wt.currentTime = this.currentTime;
    //   this.mp_open(this.currentTime);
    // },
    // 初始化渲染进度条
    initTimeChart () {
      this.$nextTick(() => {
        this.wt = new TimeChart(document.getElementById("wtime"));
        this.wt.canvas.width = this.wt.canvas.clientWidth;
        this.wt.canvas.height = this.wt.canvas.clientHeight;
        this.wt.ontimeclick = (e, t, o) => {
          if (o) {
            this.wt.currentTime = t;
            this.currentTime = t;
            this.mp_open(t);
          }
        }
        this.wt.penColor = "#FFFF00";
        this.wt.barcolor = "#FFFFFF30";
        this.wt.timecolor = "#637DE8";

        //!开始必须要有默认时间
        this.wt.startTime = new Date(2021, 3, 23);
        this.wt.stopTime = new Date(2021, 3, 24);
      })
    },

     // socket接收msg
    getMsg (msg) {
      if (msg !== "连接成功") {
        const res = JSON.parse(msg);
        if (res.topic === "webserver/reportdata/") {
          this.$bus.$emit('changeData',res.data)
        } else if (res.topic === "webserver/reportevent/") {
          this.$bus.$emit('changeEvent',res.data)
        }
      }
    },

  },
  computed: {
    endtime () {
      return new Date(this.starttime.getTime() + 24 * 60 * 60 * 1000)
    },
    comptedStatus () {
      return this.videoStatus ? "继续" : "暂停"
    },
    // 录像是否展示等待状态
    isShowWait () {
      return this.isWait;
    },

    showCamera () {
      if (this.isCameraShow) {
        return "showCamera"
      } else {
        return "showCamera2"
      }
    },
    showControl () {
      if (this.isControlShow) {
        return "showControl"
      } else {
        return "showControl2"
      }
    },
    videoWidth () {
      if (this.videoNum == 1) {
        return "100%"
      } else if (this.videoNum == 4) {
        return "50%"
      } else if (this.videoNum == 6) {
        return Number.parseFloat(100 / 3) + "%"
      } else if (this.videoNum == 9) {
        return Number.parseFloat(100 / 3) + "%"
      } else if (this.videoNum = 16) {
        return "25%"
      }
    },
    videoHeight () {
      if (this.videoNum == 1) {
        return "890px"
      } else if (this.videoNum == 4) {
        return 890 / 2 + "px"
      } else if (this.videoNum == 6) {
        return 890 / 2 + "px"
      } else if (this.videoNum == 9) {
        return Number.parseFloat(890 / 3) + "px"
      } else if (this.videoNum = 16) {
        return Number.parseFloat(890 / 4) + "px"
      }
    }
  },
  watch: {
    // 切换录像后渲染进度条
    activeName (val) {
      val == 'second' ? this.initTimeChart() : ""
    },
    // 切换几路重新默认选择第一个视频窗口
    videoNum (val) {
      this.currentVideoIndex = 1;
      this.$nextTick(() => {
        // 切换 显示1.非全屏，2.解除其他隐藏3.非选中
        for (let i = 1; i <= val; i++) {
          this.$refs[`video${i}`][0].isFullScreen = false;
          this.$refs[`video${i}`][0].isVideoShow = true;
          this.$refs[`video${i}`][0].isSelect = false;
        }
        this.$refs[`video${this.currentVideoIndex}`][0].isSelect = true;
      })
    }
  },
  mounted () {
    //默认选中第一个视频播放窗口
    // this.$nextTick(()=>{
    this.$refs['video1'][0].isSelect = true;
    // ? 获取不到？this.$refs.video1.isSelect = true;
    // })
    this.$refs[`video1`][0].flv_open(713);
  },
  created () {
    getSocket(JSON.stringify({ type: 'client' }), this.getMsg);
  },
  beforeDestroy () {
    // 离开页面关闭所有视频
    this.closeAllVideo();
  }
}
</script>
 
<style lang='scss' scoped>
@mixin wh100 {
  width: 100%;
  height: 100%;
}
@mixin wh($width, $height) {
  width: $width;
  height: $height;
}
@mixin inOutBtn {
  width: 14px;
  height: 34px;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  cursor: pointer;
  z-index: 100;
}
.videowrapper {
  display: flex;
  @include wh100;
  .regionListWrapper {
    // @include wh(300px, 100%);
    display: flex;
    padding: 10px;
    // width: 296px;
    .regionListTree {
      position: relative;
      // width: 100%;
      width: 276px;
      height: 100%;
    }
    .showCamera {
      @include inOutBtn;
      background: url("~assets/image/leftinBtn.png") no-repeat;
    }
    .showCamera2 {
      @include inOutBtn;
      background: url("~assets/image/rightinBtn.png") no-repeat;
    }
  }
  .video {
    flex: 1;
    .videoCompContainer {
      height: calc(100% - 50px);
      overflow: hidden;
    }
    .numWrapper {
      height: 50px;
      background: url("~assets/image/videoMonitor/itemBg.png") no-repeat
        center/100% 100%;
      text-align: right;
      padding-top: 12px;
      div {
        width: 40px;
        height: 34px;
        margin-right: 10px;
        padding: 6px 10px;
        display: inline-block;
        cursor: pointer;
        &:hover {
          background: url("~assets/image/videoMonitor/hover.png");
        }
        &.active {
          background: url("~assets/image/videoMonitor/hover.png");
        }
      }
    }
  }
  .controlWrapper {
    position: relative;
    display: flex;
    // padding: 10px;
    .controlPane {
      position: relative;
      width: 350px;
      height: 100%;

      .prestoListwrapper {
        padding-bottom: 14px;
        padding: 10px;
      }
    }
    // 切换
    .showControl {
      left: -4px;
      @include inOutBtn;
      background: url("~assets/image/rightinBtn.png") no-repeat;
    }
    .showControl2 {
      left: -16px;
      @include inOutBtn;
      background: url("~assets/image/leftinBtn.png") no-repeat;
    }
  }
  .videoControl1 {
    display: block;
    background-color: #1f2342;
    object-fit: fill;
    width: 100%;
    height: 841px;
  }
  .waitText {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    span {
      color: #acb1dc;
      font-size: 18px;
      padding-left: 23px;
    }
  }
  .TimeControl {
    background-color: #f0f0f030;
    color: white; /* 文本颜色 */
    font: 12px Arial; /* 文本字体 */
    width: 100%;
    height: 100px;
  }
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s;
}
.slide-enter,
.slide-leave-to {
  transform: translate(-278px);
}
.slide_right-enter-active,
.slide_right-leave-active {
  transition: transform 0.5s;
}
.slide_right-enter,
.slide_right-leave-to {
  transform: translate(278px);
}
</style>
<style>
.videowrapper .el-tree {
  height: calc(100% - 66px);
}
.videowrapper .el-input {
  font-size: 14px;
  padding: 0;
}
.videowrapper .el-button {
  background: #4763e8;
  color: #eef1ff;
  width: 83px;
}
/* 
.videoControl {
  display: block;
  background-color: #1f2342;
  object-fit: fill;
  width: 622px;
  height: 442px;
  box-sizing: border-box;
} */

/* .ToolBar {
  text-align: right;
  height: 21px;
}

.Button {
  cursor: pointer;
  padding: 2px;
  color: #fff;
  border: none;
  text-align: center;
  background-color: transparent;
}
.Button:hover {
  color: #ffffff;
  background-color: #999999;
} */

/* .ArrowButton {
  width: 32px;
  height: 32px;
  line-height: 32px;
}

.ToolButton {
  float: right;
  width: 24px;
  height: 24px;
  color: #b6c7d9;
} */
/* .ListItem {
  position: relative;
  cursor: pointer;
  color: #111111;
  transition: color 0.5s;
}

.ListItem::before {
  content: "";
  position: absolute;
  left: 0;
  background: deeppink;
  z-index: -1;
  transform: scale3d(0, 1, 1);
  transform-origin: 100% 50%;
  transition: transform 0.5s;
}

.ListItem:hover {
  color: #ffffff;
}
.ListItem:hover::before {
  transform: scale3d(1, 1, 1);
  transform-origin: 0% 50%;
  transition-timing-function: ease-in;
} */

/* .SelectBox {
  border: 1px solid yellow;
}
.UnselectBox {
  border: 1px solid #4b63ba;
} */

/* @keyframes ball-scale {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
.ball-scale {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 48px;
  width: 48px;
  background-color: #a2c7c59f;
  background-image: radial-gradient(black, yellow, black);
  border-radius: 100%;
  animation: ball-scale 1s 0s ease-in-out infinite;
} */
</style>