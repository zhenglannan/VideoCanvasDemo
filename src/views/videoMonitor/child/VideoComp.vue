<template>
  <div
    class="videoContainer"
    :class="{selectBox:isSelect}"
    :style="{width:videoWidth,height:videoHeight}"
    v-show="isVideoShow"
  >
    <div class="toolBar">
      <el-select v-model="flag" style="margin-right: 10px;">
        <el-option label="主码流" :value="0"></el-option>
        <el-option label="子码流" :value="1"></el-option>
      </el-select>
      <img
        v-if="!isFullScreen"
        src="~assets/image/videoMonitor/resize.png"
        alt
        @click="fullScreen"
        style="margin-right: 13px;"
      />
      <img
        v-else
        src="~assets/image/videoMonitor/quitFull.png"
        alt
        @click="fullScreen"
        style="margin-right: 13px;"
      />
      <img src="~assets/image/videoMonitor/stop.png" alt @click="flv_close" />
    </div>
    <div class="videoWrapper">
      <canvas :id="`canvas${index}`"></canvas>
      <video muted @click="selectVideo" class="videoControl" ref="video" :id="`video${index}`"></video>
      <div v-show="isWaitText" class="waitText">
        <img src="~assets/image/videoMonitor/videoPoster.png" alt style="vertical-align: middle;" />
        <span>暂无数据</span>
      </div>
      <div class="ball-scale" v-show="isWait"></div>
      <!-- 信息框 -->
      <SensorInfo
        v-for="item in sensorArr"
        :key="item.sensorid"
        :state="item.state"
        :eventlevel="item.eventlevel"
        :networkstate="item.networkstate"
        :pointlist="item.pointlist"
        :axis="item.axis"
        :canvasW="canvasW"
        :canvasH="canvasH"
      ></SensorInfo>
    </div>
    <img src="~assets/image/arrow.png" ref="img" id="img" v-show="false" />
  </div>
</template>

<script>
import path from '@/settings'
import SensorInfo from './SensorInfo.vue'
import { getEnumValue } from 'utils/index'

export default {
  name: 'VideoComp',
  data () {
    return {
      fp: null,
      hostIp: path.streamIp,
      hostPort: path.streamPort,
      isWait: false,
      isWaitText: true,
      isSelect: false,
      isFullScreen: false,
      isVideoShow: true,
      flag: 0,

      canvas: null,
      canvasW: '',//不带单位
      canvasH: '',//不带单位
      ctx: null,
      videoDom: null,

      // videoWidth: this.width,
      // videoHeight: this.height,
      sensorArr: [
        {
          "axis": "0,0",
          "time": "--",
          "camerastate": "0",
          "cameraid": "",
          "presetno": "",
          "modelkind": "tidd",
          "sensorid": "127",
          "sensoridname": "1#红外对射",
          "eventlevel": -2,
          "state": "离线",
          "networkstate": "0",
          "pointlist": [
            {
              "sensorpointid": "1228",
              "sensorpointidname": "设备网络状态",
              "time": "--",
              "value": "--",
              "modelkind": "tidd",
              "modelkindname": "红外双鉴",
              "remotetype": "yx",
              "datadesctype": "0:离线,1:在线",
              "eventlevel": -1,
              "unit": "",
              "eventtypeText": ""
            },
            {
              "sensorpointid": "1229",
              "sensorpointidname": "红外双鉴状态",
              "time": "2021-05-07 02:28:32",
              "value": "1",
              "modelkind": "tidd",
              "modelkindname": "红外双鉴",
              "remotetype": "yc",
              "datadesctype": "0:正常,1:报警",
              "eventlevel": 3,
              "unit": "",
              "eventtypeText": ""
            }
          ]
        },
        {
          "axis": "0.2,0.2",
          "time": "--",
          "camerastate": "0",
          "cameraid": "",
          "presetno": "",
          "modelkind": "tdrm",
          "sensorid": "326",
          "sensoridname": "1#门禁",
          "eventlevel": -2,
          "state": "离线",
          "networkstate": "0",
          "pointlist": [
            {
              "sensorpointid": "2217",
              "sensorpointidname": "设备网络状态",
              "time": "--",
              "value": "--",
              "modelkind": "tdrm",
              "modelkindname": "门禁",
              "remotetype": "yx",
              "datadesctype": "0:离线,1:在线",
              "eventlevel": -1,
              "unit": "",
              "eventtypeText": ""
            },
            {
              "sensorpointid": "2218",
              "sensorpointidname": "门禁状态",
              "time": "--",
              "value": "--",
              "modelkind": "tdrm",
              "modelkindname": "门禁",
              "remotetype": "yx",
              "datadesctype": "1:开,0:关",
              "eventlevel": -1,
              "unit": "",
              "eventtypeText": ""
            },
            {
              "sensorpointid": "2219",
              "sensorpointidname": "门状态",
              "time": "--",
              "value": "--",
              "modelkind": "tdrm",
              "modelkindname": "门禁",
              "remotetype": "yx",
              "datadesctype": "1:开,0:关",
              "eventlevel": -1,
              "unit": "",
              "eventtypeText": ""
            },
            {
              "sensorpointid": "2220",
              "sensorpointidname": "锁状态",
              "time": "--",
              "value": "--",
              "modelkind": "tdrm",
              "modelkindname": "门禁",
              "remotetype": "yx",
              "datadesctype": "1:开,0:关",
              "eventlevel": -1,
              "unit": "",
              "eventtypeText": ""
            },
            {
              "sensorpointid": "2221",
              "sensorpointidname": "门禁控制",
              "time": "--",
              "value": "--",
              "modelkind": "tdrm",
              "modelkindname": "门禁",
              "remotetype": "yk",
              "datadesctype": "1:开,0:关",
              "eventlevel": -1,
              "unit": "",
              "eventtypeText": ""
            }
          ]
        }]
    };
  },
  props: {
    width: {
      type: [String, Number],
    },
    height: {
      type: [String, Number],
    },
    index: {
      type: [String, Number],
    },
  },
  components: {
    SensorInfo
  },
  mounted () {
    this.videoDom = document.getElementById("video" + this.index);
    this.canvas = document.getElementById("canvas" + this.index);
    this.ctx = this.canvas.getContext("2d");
    // 监听video元素变化
    var ro = new ResizeObserver(entries => {
      for (let entry of entries) {
        this.setCanvasWH();
        this.paintAxis()
      }
    });
    // 观察一个或多个元素
    ro.observe(this.videoDom);

    // 实时数据
    this.$bus.$on("changeData", (payload) => {
      // console.log(payload);
      this.changePlateData(payload);
    })
    // 实时告警
    this.$bus.$on("changeEvent", (payload) => {
      this.changeEvent(payload);
    })
  },
  computed: {
    // 根据是否全屏修改大小
    videoWidth: {
      get () {
        if (this.isFullScreen) {
          return "100%"
        } else {
          return this.width
        }
      },
      set (val) {
        return val
      }
    },
    videoHeight: {
      get () {
        if (this.isFullScreen) {
          return "890px"
        } else {
          return this.height
        }
      },
      set (val) {
        return val
      }
    },
  },
  watch: {
    // 码流改变重新播放视频
    flag (val) {
      this.$emit("change-flag");
    },
    sensorArr: {
      handler () {
        this.paintAxis();
      },
      deep: true
    }
  },
  methods: {
    // 动态设置canvas宽高
    setCanvasWH () {
      this.canvas.setAttribute("width", this.videoDom.getBoundingClientRect().width)
      this.canvas.setAttribute("height", this.videoDom.getBoundingClientRect().height)
      this.canvasW = this.canvas.getAttribute("width");
      this.canvasH = this.canvas.getAttribute("height");
    },
    // 绘制坐标定位
    paintAxis () {
      // let img = new Image();
      // img.src = require('assets/image/arrow.png');
      // img.onload=()=>{
      this.ctx.strokeStyle = "red";
      this.sensorArr.forEach(item => {
        let arr = item.axis.split(",");
        this.ctx.beginPath();
        // this.ctx.drawImage(img, this.canvasW * arr[0], this.canvasH * arr[1])
        this.ctx.arc(this.canvasW * arr[0], this.canvasH * arr[1], 10, 0, Math.PI * 2, true)
        this.ctx.stroke();
      });
      // }

    },
    fullScreen () {
      if (!this.isFullScreen) {
        this.videoWidth = "100%";
        this.videoHeight = "890px";
      } else {
        this.videoWidth = this.width;
        this.videoHeight = this.height;
      }
      this.isFullScreen = !this.isFullScreen;
      this.$emit("full-screen", this.isFullScreen, this.index);
    },
    selectVideo () {
      // todo 点击video怎么在父组件通过for循环接收index？
      this.$emit("select-video");
    },
    flv_open (id) {
      this.flv_close();
      if (window.location.protocol === 'https:') {
        MPlayer.sslFlag = true;
      }
      this.fp = new MPlayer(this.$refs.video);
      this.fp.onstatechanged = (state) => {
        if (this.fp) {
          this.isWait = !state;
        }
      };
      this.isWait = true;
      this.isWaitText = false;
      this.fp.open(this.hostIp, this.hostPort, id, this.flag);
    },
    flv_close () {
      if (this.fp) {
        this.fp.close();
        this.fp = null;
        this.isWait = false;
        this.isWaitText = true;
      }
    },
    // 转到预置位
    ptz_preset (id) {
      if (this.fp) {
        this.fp.preset(MPlayer.PRESET_GOTO, id);
      }
    },
    // 控制选中video
    ptz_control (cmd, speed) {
      if (this.fp) {
        this.fp.ptz(cmd, speed);
      }
    },
    // 实时改变数据
    changePlateData (payload) {
      const { sensorid, points, timestamp, eventlevel, networkstate, workpointid, state, sensorremotetype } = payload;
      let index = this.sensorArr.findIndex(item => item.sensorid === sensorid);
      if (index != -1) {
        if (networkstate == 0) {
          this.sensorArr[index].state = "离线";
          this.sensorArr[index].eventlevel = -2;
          // 可以用映射吗map?只改变这3个数据
          this.sensorArr[index].pointlist.forEach((point, index1) => {
            this.sensorArr[index].pointlist[index1].eventlevel = -2;
            this.sensorArr[index].pointlist[index1].value = "--";
            this.sensorArr[index].pointlist[index1].eventtypeText = "";
          });
          return
        }

        if (networkstate == 1) {//离线转在线（控制类怎么设置）
          if (eventlevel == -9999) {//网络状态测点
            if (workpointid != "") {//判断遥信设备 yx测点
              this.sensorArr[index].eventlevel = -1;
              // 离线转在线时需要根据workpointid获取之前存在变量中的值
              let index2 = this.sensorArr[index].pointlist.findIndex(item => item.sensorpointid == workpointid);
              //?应该是改光字牌的state
              this.sensorArr[index].state = getEnumValue(this.sensorArr[index].pointlist[index2].datadesctype, this.sensorArr[index].pointlist[index2].value);
            } else {//遥测直接return
              return
            }
          } else {
            // eventlevel为-1且sensorremotetype不等于yk且不等于yt时显示正常
            if (eventlevel == -1 && (sensorremotetype != "yk" && sensorremotetype != "yt")) {//todo 由告警转为正常
              this.sensorArr[index].state = "正常";
              this.sensorArr[index].eventlevel = -1;
            } else {//todo 告警状态(有测点还在告警)
              this.sensorArr[index].state = state;
              this.sensorArr[index].eventlevel = eventlevel;
            }
          }
        }

        points.forEach(ele => {
          this.sensorArr[index].pointlist.forEach((point, index1) => {
            if (point.sensorpointid == ele.id) {
              // this.sensorArr[index].pointlist[index1].time = timestamp;
              // 遥信测点（根据枚举值改状态值）
              if (point.datadesctype != '--' && point.datadesctype.indexOf(":") > -1) {//测点枚举值判断真假
                if (workpointid != "" && point.sensorpointid == workpointid) {//有工作id(开关)才获取枚举值（区分网络状态测点枚举值，网络状态测点没有工作id）
                  this.sensorArr[index].state = getEnumValue(point.datadesctype, ele.value);
                  if (this.sensorArr[index].modelkind == "tacd") {
                    this.sensorArr[index].pointlist[index1].value = ele.value;//
                  }
                  // return //forEach实现for循环continue的效果
                } else if (this.sensorArr[index].modelkind == "tacd") {//没有workpointid但是有枚举值且是空调
                  this.sensorArr[index].pointlist[index1].value = ele.value;
                }
              } else {
                // 遥测测点（只改变测点值）
                this.sensorArr[index].pointlist[index1].value = ele.value;//改变测点的值
                this.sensorArr[index].pointlist[index1].eventlevel = ele.eventlevel;
                this.sensorArr[index].pointlist[index1].eventtypeText = ele.eventtypeText;
                if (eventlevel == -1) {//全部恢复正常 
                  this.sensorArr[index].pointlist[index1].eventlevel = -1;
                  this.sensorArr[index].pointlist[index1].eventtypeText = "";
                }
              }
            }
          });
        });
      }
    },
  },
}
</script>
 
<style lang='scss' scoped>
.videoContainer {
  // width: 50%;
  // height: 470px;//只能定高
  // height: 100%;
  display: inline-block;
  border: 1px solid #4b63ba;
  .toolBar {
    text-align: right;
    height: 32px;
    line-height: 32px;
    background: #111039;
    padding: 0 7px;
    img {
      cursor: pointer;
    }
  }
  .videoWrapper {
    height: calc(100% - 32px);
    // height: 50%;
    position: relative;
    canvas {
      position: absolute;
    }
    .videoControl {
      display: block;
      background-color: #1f2342;
      object-fit: fill;
      // width: 622px;
      // height: 442px;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
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
  }
}
.selectBox {
  border: 1px solid yellow;
}
// .unselectBox {
//   border: 1px solid #4b63ba;
// }
</style>
<style>
.videoContainer .el-select .el-input {
  padding-bottom: 4px;
}
.videoContainer .el-select .el-input input {
  height: 22px;
  width: 93px;
}
</style>