<template>
  <light-plate-pane :eventlevel="eventl">
    <!-- <light-plate-pane :eventlevel="eventl"> -->
    <template v-slot:title>{{title}}</template>
    <div class="main" v-if="modelkind!='tacd'" @click="showPointList">
      <div class="content">
        <div class="icon">
          <!-- 图标 -->
          <img :src="imgurl" :title="title" />
        </div>
        <div class="intro">
          <p :style="stateColor">{{stateValue}}</p>
          <!-- 展示yc测点 -->
          <ul :class="ulClass">
            <light-plate-list-item
              v-for="item in computedPointList"
              :key="item.sensorpointid"
              :eventlevel="networkstate=='0'?'-2':item.eventlevel"
            >{{item.sensorpointidname}}: {{networkstate=="0"?"--":item.value|formatter()}}{{item.unit}}{{networkstate=='0'?'':(item.eventtypeText?item.eventtypeText.trim():"")}}</light-plate-list-item>
          </ul>
          <label v-show="isMoreShow">
            <span>更多</span>
            <i class="el-icon-more"></i>
          </label>
          <div v-show="isShowSwitch" style="padding-left:3px">
            <el-button
              class="offBtn"
              circle
              :disabled="isDisabled"
              @click="changeState(0)"
              style="background: linear-gradient(0deg, #cd4c28, #e8882d);
    color:  #f7f7f5;border: 2px solid  #f7f7f5;padding: 6px;border-radius: 24%;font-size: 12px;"
            >OFF</el-button>
            <el-button
              class="offBtn"
              circle
              :disabled="isDisabled"
              @click="changeState(1)"
              style="background: linear-gradient(0deg, #2e59b8, #499eea);
    color:  #f7f7f5;border: 2px solid  #f7f7f5;padding: 6px;border-radius: 24%;font-size: 12px;"
            >ON</el-button>
          </div>
        </div>
      </div>
      <p class="time">
        <!-- 时间 -->
        <slot name="time"></slot>
      </p>
    </div>
    <!-- 空调面板 -->
    <div class="main" v-else>
      <div class="condContent">
        <!-- 展示对应图片 -->
        <div class="viewPane">
          <span style="position: absolute; left: 86px; top: 6px;" v-show="isSwitchShow">关机</span>
          <!-- <span class="value">{{realtmpvalue}}℃</span> -->
          <div class="value">
            <!-- <span>{{parseInt(realtmpvalue)}}</span> -->
            <span>{{computedTmpValue}}</span>
            <span v-show="computedTmpValue!='--'">.</span>
            <span style="font-size: 22px;">{{tepCeil}}</span>
            <span
              v-show="computedTmpValue!='--'"
              style="    position: absolute; left: 51px; font-size: 16px;"
            >℃</span>
          </div>
          <div>
            <p>设定</p>
            <p style="font-size: 16px;">
              {{tmpvalue}}
              <span style="color: #4ecdff; font-size: 12px;">℃</span>
            </p>
          </div>
          <img :src="realmodeUrl" alt style="position: absolute; left: 178px; top: 12px;" />
          <img :src="realfengshanUrl" alt style="position: absolute; left: 18px; top: 47px;" />
          <img :src="realspeedUrl" alt style="position: absolute; left: 178px; top: 41px;" />
        </div>
        <!-- 空调控制按钮 -->
        <div class="controlPane">
          <img :src="switchUrl" alt @click="controlSwitch()" />
          <p></p>
          <img :src="modeUrl" alt @click="controlCond('mode')" />
          <p></p>
          <img :src="fengshanUrl" alt @click="controlCond('fengshan')" />
          <p></p>
          <img :src="speedUrl" alt @click="controlCond('speed')" />
          <p></p>
          <img src="~assets/image/env/add.png" alt @click="controlCond('add')" />
          <p></p>
          <img src="~assets/image/env/less.png" alt @click="controlCond('less')" />
        </div>
      </div>
    </div>
    <el-button
      class="show3D"
      size="mini"
      type="primary"
      @click="showLine3D"
      v-show="modelkind==='tpds'"
    >图形</el-button>
  </light-plate-pane>
</template>
 
<script>
import LightPlatePane from "content/display/LightPlatePane"
import LightPlateListItem from "content/display/LightPlateListItem"
// import { getEnumValue } from 'utils/index'
import { ControlCommandIssue } from 'network/home'
// import { debounce } from "lodash";
export default {
  name: 'LightPlate',
  data () {
    return {
      // 初始按钮状态
      valueSwitch: this.state == "开" ? 1 : 0,
      value: 1,
      stateValue: this.state,
      eventl: this.eventlevel,

      // 空调面板控制图片索引
      modeIndex: 0,
      speedIndex: 0,
      fengshanIndex: 0,
      switchIndex: 0,

      // 实时数据索引
      realmodeIndex: 0,
      realspeedIndex: 0,
      realfengshanIndex: 0,
      realswitchIndex: 0,
      realtmpvalue: 16,

      // 原有状态索引
      oldmodeIndex: 0,
      oldspeedIndex: 0,
      oldfengshanIndex: 0,
      oldswitchIndex: 0,

      tmpvalue: 16,
      oldtmpvalue: 16,

      // 空调对应遥调测点(yt)
      ytmodePointid: '',
      ytfengshanPointid: '',
      ytspeedPointid: '',
      yttmpPointid: '',
      ytswitchPointid: '',
    };
  },
  components: {
    LightPlatePane,
    LightPlateListItem
  },
  props: {
    title: {
      type: String
    },
    pointlist: {
      type: Array,
      default: null
    },
    state: {
      type: String
    },
    eventlevel: {
      type: [Number, String]
    },
    modelkind: {
      type: String
    },
    networkstate: {
      type: [Number, String]
    },
    sensorid: {
      type: [Number, String]
    }
  },
  watch: {
    // !没必要监听?但是不监听不会变？
    state (val) {
      this.stateValue = val;
    },
    eventlevel (val) {
      this.eventl = val;
    },
    //todo 监听到空调测点改动，更换图标(里面值没变，不能执行函数)
    // 第一次创建没有监听!没有改动也不会做处理
    pointlist: {
      handler (nval, oval) {
        // alert(nval);
        this.setIconChange();
      },
      deep: true,
      // immediate: true//todo初始值也会监听到
    }
  },
  methods: {
    showPointList () {
      let arr = this.pointlist.filter(item => item.remotetype === "yc");
      if (arr.length > 3) {
        let obj = {
          sensoridname: this.title,
          pointlist: this.pointlist,
          networkstate: this.networkstate,
        }
        this.$emit("show-point-list", obj);
      }
      // if(this.modelkind==='tpds'){
      //   this.$emit("showLine3D", this.sensorid);
      // }
    },
    showLine3D () {
      this.$emit("show-line3D", this.sensorid);
    },
    //开/关 控制
    // changeState: _.debounce(function (val) {
    changeState (val) {
      this.$confirm(`确认${val ? "打开" : "关闭"}${this.title}?`, this.title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        modal: false
      }).then(() => {
        this.controlCom(this.sensorid, this.getPointId, val);
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消控制',
          position: 'bottom-right',
        });
      });
    },
    //得到控制之前的开关val
    // getOppositeState (val) {
    //   if (val == 0) {
    //     return 1
    //   } else if (val == 1) {
    //     return 0
    //   }
    // },
    // 控制下发
    controlCom (sensorid, pointid, val, state, modelkind = "") {
      console.log(sensorid + "; " + pointid + "; " + val + "; " + state + "; " + modelkind + "; ");
      // this.$emit("changeV", sensorid, val);//取消开关改变state状态，state只根据实时改变！
      if (modelkind == "tacd") {
        // 空调传所有yt，yk测点
        ControlCommandIssue({ sensorid: sensorid, pointid: pointid, value: val, state: state, modelkind: modelkind, ytoptioins: this.ytoptioins }).then((res) => {
          console.log(res);//" "
        })
      } else {
        ControlCommandIssue({ sensorid: sensorid, pointid: pointid, value: val }).then((res) => {
          console.log(res);
          if (res.code === 0) {
            val === 1 ? this.stateValue = "开" : this.stateValue = "关"
          }
        })
      }
    },
    // 空调设置图片索引值区间
    setPropValue (val, minV, maxV) {
      if (val < minV) {//todo minvalue为"" Number型为0;空调必须有
        return minV;
      } else if (val > maxV) {
        return maxV;
      } else {
        return val
      }
    },
    // setPropValue (val, item, minV, maxV) {
    //   if (val < item.minvalue) {//todo minvalue为"" Number型为0;空调必须有
    //     return minV;
    //   } else if (val > item.maxvalue) {
    //     return maxV;
    //   } else {
    //     return val
    //   }
    // },
    // 初始值的时候再修改
    setInitIcon () {
      if (this.modelkind == "tacd") {
        // alert("tacd")
        // 遥信测点都加了s
        this.pointlist.forEach((item, index) => {
          if (item.unit == "ktmss") {// 空调模式
            this.realmodeIndex = item.value == "--"||item.value === ""  ? "0" : this.setPropValue(parseInt(item.value), item.minvalue, item.maxvalue);
            // if (this.realmodeIndex < item.minValue) {1
            //   this.realmodeIndex = 0;
            // } else if (this.realmodeIndex > item.maxValue) {
            //   this.realmodeIndex = 4;
            // }
            this.modeIndex = this.realmodeIndex;
            this.oldmodeIndex = this.realmodeIndex;
          } else if (item.unit == "ktms") {// 空调模式设定
            this.ytmodePointid = item.sensorpointid;
          } else if (item.unit == "ktfbs") {// 空调风栅
            this.realfengshanIndex = item.value == "--"||item.value === ""  ? "0" : this.setPropValue(parseInt(item.value), item.minvalue, item.maxvalue);
            this.fengshanIndex = this.realfengshanIndex;
            this.oldfengshanIndex = this.realfengshanIndex;
          } else if (item.unit == "ktfb") {// 空调风栅设定
            this.ytfengshanPointid = item.sensorpointid;
          } else if (item.unit == "ktfls") {// 空调风量
            this.realspeedIndex = item.value == "--"||item.value === ""  ? "3" : this.setPropValue(parseInt(item.value) ,item.minvalue, item.maxvalue);
            this.speedIndex = this.realspeedIndex;
            this.oldspeedIndex = this.realspeedIndex;
          } else if (item.unit == "ktfl") {// 空调风量设定
            this.ytspeedPointid = item.sensorpointid;
          } else if (item.unit == "ktkgs") {// 空调开关
            this.realswitchIndex = item.value == "--"||item.value === ""  ? "0" : parseInt(item.value);
            this.switchIndex = this.realswitchIndex;
            this.oldswitchIndex = this.realswitchIndex;
          } else if (item.unit == "ktkg") {// 空调开关设定
            this.ytswitchPointid = item.sensorpointid;
          } else if (item.unit == "ktwds") {// 空调温度
            this.realtmpvalue = item.value.indexOf("-9999") > -1 || item.value.indexOf("--") > -1||item.value === ""  ? "--" : item.value;//实时温度
            this.tmpvalue = this.realtmpvalue == 0 || this.realtmpvalue == "--" ? "16" : parseInt(this.realtmpvalue);//设定温度默认为16
            this.oldtmpvalue = this.tmpvalue;//todo设定原有温度
          } else if (item.unit == "ktwd") {// 空调温度设定
            this.yttmpPointid = item.sensorpointid;
          }
        })
      }
    },
    // 监听到变化再修改状态
    setIconChange () {
      if (this.modelkind == "tacd") {
        this.pointlist.forEach((item, index) => {
          if (item.unit == "ktmss") {// 空调模式
            this.realmodeIndex = item.value == "--"||item.value === "" ? "0" : this.setPropValue(parseInt(item.value),item.minvalue, item.maxvalue);
          } else if (item.unit == "ktms") {// 空调模式设定
            this.modeIndex = item.value == "--"||item.value === "" ? this.modeIndex : parseInt(item.value);
            this.oldmodeIndex = this.modeIndex;
          } else if (item.unit == "ktfbs") {// 空调风栅
            this.realfengshanIndex = item.value == "--"||item.value === "" ? "0" : this.setPropValue(parseInt(item.value),item.minvalue, item.maxvalue);
          } else if (item.unit == "ktfb") {// 空调风栅设定
            this.fengshanIndex = item.value == "--"||item.value === ""  ? this.fengshanIndex : parseInt(item.value);
            this.oldfengshanIndex = this.fengshanIndex;
          } else if (item.unit == "ktfls") {// 空调风速
            this.realspeedIndex = item.value == "--"||item.value === "" ? "0" : this.setPropValue(parseInt(item.value), item.minvalue, item.maxvalue);
            // this.speedPointid = item.sensorpointid;
          } else if (item.unit == "ktfl") {// 空调风速设定
            this.speedIndex = item.value == "--"||item.value === ""  ? this.speedIndex : parseInt(item.value);
            this.oldspeedIndex = this.speedIndex;
          } else if (item.unit == "ktkgs") {// 空调开关
            this.realswitchIndex = item.value == "--"||item.value === "" ? "0" : parseInt(item.value);
          } else if (item.unit == "ktkg") {// 空调开关设定
            this.switchIndex = item.value == "--"||item.value === ""  ? this.switchIndex : parseInt(item.value);
            this.oldswitchIndex = this.switchIndex;
          } else if (item.unit == "ktwds") {// 空调温度
            this.realtmpvalue = item.value.indexOf("-9999") > -1 || item.value.indexOf("--") > -1||item.value === "" ? "--" : item.value;//todo实时温度
          } else if (item.unit == "ktwd") {// 空调温度设定
            // this.tmpvalue = item.value.indexOf("--") > -1 ? "18" : item.value;//?item.value.indexOf is not a function
            this.tmpvalue = item.value == "--"||item.value === ""  ? this.tmpvalue : item.value;//todo设定温度
            this.oldtmpvalue = this.tmpvalue;//todo设定原有温度
          }
        })
      }
    },
    // 空调面板发送指令(防抖)
    sendOrder: _.debounce(function (sensorid, ytPointid, val, oval) {
      this.controlCom(sensorid, ytPointid, val, oval, "tacd");
      this.$emit("change-value", sensorid, ytPointid, val);
    }, 500),
    controlCond (type) {
      //离线或者关机不能点击,关机时除了开关按钮
      if (this.networkstate == 0 || this.realswitchIndex == 0) {//todo怎么设置鼠标点击样式为禁止
        this.$message({
          type: 'warning',
          message: '离线或未开机不能控制',
          duration: 1000
        });
        return
      }
      this.$confirm(`确认控制${this.title}?`, this.title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        modal: false
      }).then(() => {
        // 模式：4种
        if (type == "mode") { // 模式：5种
          this.modeIndex = (this.modeIndex + 1) % 5;
          if (this.modeIndex > 5) {
            this.modeIndex = 0;
          }
          this.sendOrder(this.sensorid, this.ytmodePointid, this.modeIndex, this.oldmodeIndex);
        } else if (type == "speed") {      // 风速：4种
          this.speedIndex = (this.speedIndex + 1) % 4;
          // this.speedIndex++;
          if (this.speedIndex > 4) {
            this.speedIndex = 0;
          }
          this.sendOrder(this.sensorid, this.ytspeedPointid, this.speedIndex, this.oldspeedIndex);
        } else if (type == "fengshan") {// 风栅：2种 0,1
          this.fengshanIndex = (this.fengshanIndex + 1) % 2;
          // this.fengshanIndex++;
          if (this.fengshanIndex > 2) {
            this.fengshanIndex = 0;
          }
          this.sendOrder(this.sensorid, this.ytfengshanPointid, this.fengshanIndex, this.oldfengshanIndex);
        } else if (type == "add") {
          if (this.tmpvalue >= 30) {
            this.$message({
              message: '最高设置温度为30度',
              type: 'error'
            });
            return
          }
          this.tmpvalue++;
          this.sendOrder(this.sensorid, this.yttmpPointid, this.tmpvalue, this.oldtmpvalue);
        } else if (type == "less") {
          if (this.tmpvalue <= 16) {
            this.$message({
              message: '最低设置温度为16度',
              type: 'error'
            });
            return
          }
          this.tmpvalue--;
          this.sendOrder(this.sensorid, this.yttmpPointid, this.tmpvalue, this.oldtmpvalue);
        }
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消控制',
          position: 'bottom-right',
        });
      });
    },
    // 空调开关控制
    controlSwitch () {
      if (this.networkstate == 0) {//todo怎么设置鼠标点击样式为禁止
        return
      }
      this.$confirm(`确认控制${this.title}?`, this.title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        modal: false
      }).then(() => {
        this.switchIndex = (this.switchIndex + 1) % 2;
        if (this.switchIndex > 2) {
          this.switchIndex = 0;
        }
        this.sendOrder(this.sensorid, this.ytswitchPointid, this.switchIndex, this.oldswitchIndex);
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消控制',
          position: 'bottom-right',
        });
      });
    }
    // fileExists (url) {
    //   var isExists;
    //   $.ajax({
    //     url: url,
    //     async: false,
    //     type: 'HEAD',
    //     error: function () {
    //       isExists = 0;
    //     },
    //     success: function () {
    //       isExists = 1;
    //     }
    //   });
    //   if (isExists == 1) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }

  },
  computed: {
    // 返回空调所有yk，yt测点
    ytoptioins () {
      return {
        0: { id: this.ytmodePointid, val: this.realmodeIndex },
        1: { id: this.ytfengshanPointid, val: this.realfengshanIndex },
        2: { id: this.ytspeedPointid, val: this.realspeedIndex },
        3: { id: this.yttmpPointid, val: this.realtmpvalue==='--'?0:this.realtmpvalue},
        4: { id: this.ytswitchPointid, val: this.realswitchIndex },
      }
      // return {points:"{id:1,val:2}${id:3,val:4}"}
    },
    // 测定根据eventlevel降序排列
    computedPointList () {
      if (this.pointlist) {
        return this.pointlist.filter(i => i.remotetype === 'yc').sort((a, b) => parseInt(b.eventlevel) - parseInt(a.eventlevel))
      }
      return ""
    },
    isMoreShow () {
      return this.computedPointList.length > 3
    },
    // 状态字体颜色
    stateColor () {
      if (this.eventl == -1 || this.eventl == -9999) {//正常
        return 'color:#4ECDFF'
      } else if (this.eventl == -2) {//离线(灰色)
        return 'color:#A7C7D4'
      } else if (this.eventl == 1) {//预警
        return 'color:#FF8826'
      } else if (this.eventl == 2) {//告警
        return 'color:#FF3D1F'
      }
    },
    // 图标分类
    imgurl () {
      // !为啥要在这手动改变量？而不用props传值
      // if (this.networkstate == 0) {
      //   this.eventl = -2;//离线
      // }
      // modelkind开始为undefined？
      // eventl为-9999为正常，无意义?
      // if (this.eventl == '-9999') {
      //   return require('assets/image/envicon/' + this.modelkind + '_-1.png')
      // }
      if (this.modelkind) {
        // let test = this.fileExists('assets/image/envicon/' + this.modelkind + '_' + this.eventl + '.png');
        // if (test) {
        // todo 还是找不到模块会自动出错，没办法替换成别的图片？
        return require('assets/image/envicon/' + this.modelkind + '_' + this.eventl + '.png')
        // } else {
        // return require('assets/image/envicon/tfan_-1.png')
        // }
        // if(require('assets/image/envicon/' + this.modelkind + '_' + this.eventl + '.png')){
        // }
      }
    },
    // 根据遥控测点决定是否显示开关按钮
    isShowSwitch () {
      return this.pointlist.filter(item => item.remotetype == 'yk').length != 0
    },
    // 在线监测不显示遥控设备
    // isPaneShow () {
    //   if (this.$route.path.indexOf("lineListMonitor") > -1 && this.checkYkpoint) {
    //     return false
    //   }
    //   return true
    // },
    // 得到yk测点id
    getPointId () {
      if (this.checkYkpoint) {
        return this.pointlist.find(item => item.remotetype == 'yk').sensorpointid
      }
    },
    // 判断是否有yk测点
    checkYkpoint () {
      return this.pointlist.some(item => item.remotetype == 'yk')
    },
    // todo 不能使用依赖，因为不改变依赖
    // valueSwitch: {
    //   // state改变遥控属性
    //   get: function () {
    //     if (this.stateValue == "开") {
    //       return 1
    //     } else {
    //       return 0
    //     }
    //   },
    //   // 遥控属性改变state(stateValue要及时改变)
    //   set: function (val) {
    //     // if (val == 0) {
    //     //   this.stateValue = "关";
    //     // } else if (val == 1) {
    //     //   this.stateValue = "开";
    //     // }
    //   }
    // },
    // 根据网络状态判断开关是否可控
    isDisabled () {
      return this.networkstate == 0 ? true : false
    },
    modeUrl () {
      return require("assets/image/env/M" + this.modeIndex + ".png")
    },
    fengshanUrl () {
      return require("assets/image/env/F" + this.fengshanIndex + ".png")
    },
    speedUrl () {
      return require("assets/image/env/S" + this.speedIndex + ".png")
    },
    realmodeUrl () {
      return require("assets/image/env/M" + this.realmodeIndex + ".png")
    },
    realfengshanUrl () {
      return require("assets/image/env/F" + this.realfengshanIndex + ".png")
    },
    realspeedUrl () {
      return require("assets/image/env/S" + this.realspeedIndex + ".png")
    },
    //?根据离线切换按钮
    switchUrl () {
      return this.networkstate == 0 ? require("assets/image/env/close.png") : require("assets/image/env/open.png")
    },
    // 是否显示空调关机小字
    isSwitchShow () {
      if (this.realswitchIndex == 0) {
        this.realtmpvalue = "--";
      }
      return this.realswitchIndex == 0;
    },
    // 空调温度取小数
    tepCeil () {
      // return Number.isInteger(Number(this.realtmpvalue)) ? "0" : this.realtmpvalue.split(".")[1].subString(0, 1);
      if (this.computedTmpValue == "--") {
        return ""
      } else {
        // 取一位小数
        return Number.isInteger(Number(this.realtmpvalue)) ? "0" : this.realtmpvalue.split(".")[1].subString(0, 1);
      }
    },
    // 温度显示
    computedTmpValue () {
      return this.realswitchIndex == 0 ? "--" : (this.realtmpvalue == "--" ? "--" : parseInt(this.realtmpvalue))
    },
    // 几行显示分环境和在线
    ulClass () {
      if (this.$route.path.indexOf("lineMonitor") > -1) {
        return "ulLineClass"
      } else {
        return "ulListClass"
      }
    }
  },
  filters: {
    // 值包含-9999，为--
    formatter: function (value, that) {
      if (value.indexOf("-9999") > -1) {
        return '--'
      }
      return value
    }
  },
  mounted () {
    // this.$nextTick(() => {
    // 实时改变开关状态
    // if (this.state == "开") {
    //   this.value = true;
    // } else if (this.state == "关") {
    //   this.value = false;
    // }
    // })
  },
  created () {
    // !直接在data变量中设置
    // this.stateValue = this.state;
    // this.eventl = this.eventlevel;
    this.setInitIcon();
  }

}
</script>
 
<style lang='scss' scoped>
@mixin ul($num) {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: $num;
  -webkit-box-orient: vertical;
  color: #acb3d1;
  & > li {
    padding-top: 7px;
    font-size: 13px;
    //?li不能作overflow处理
    // overflow: hidden;
    // text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.show3D {
  position: absolute;
  right: 0.2em;
  top: 0.3em;
  // 按钮样式
  border: 1px solid #428af7;
}
.main {
  flex: 1;
  .condContent {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .viewPane {
      // background: red;
      flex: 1;
      border-bottom: 2px solid #157fd5;
      position: relative;
      color: #4ecdff;
      div {
        position: absolute;
        left: 15px;
        top: 9px;
        font-size: 12px;
        font-family: "PingFangSC-Medium";
      }
      .value {
        position: absolute;
        left: 72px;
        top: 16px;
        span {
          font-size: 41px;
          color: #4ecdff;
        }
      }
    }
    .controlPane {
      height: 31px;
      display: flex;
      padding: 7px 10px;
      justify-content: space-between;
      align-items: center;
      img {
        cursor: pointer;
        // transition: all .3s;
      }
      img:hover {
        transform: scale(1.2, 1.2);
      }
      p {
        width: 1px;
        height: 100%;
        background: #157fd5;
      }
    }
  }
}
.content {
  display: flex;
  height: calc(100% - 17px);
  .icon {
    width: 89px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .intro {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    // !超出部分隐藏
    overflow: hidden;
    // 不能缩放?
    .offBtn {
      transition: all 0.3s;
    }
    .offBtn:hover {
      transform: scale(1.1, 1.1);
      // color: red !important;
    }
    & > p {
      font-size: 19px;
      color: #4ecdff;
      letter-spacing: 3px;
      font-family: PingFangSC-Bold;
      padding-bottom: 9px;
    }
    label {
      color: #fff;
      span {
        font-size: 12px;
      }
    }
    // 环境监测和在线监测显示对应多少行
    .ulListClass {
      @include ul(2);
    }
    .ulLineClass {
      // @include ul(3);
      overflow: hidden;
      color: #dfe5ff;
      height: 64px; //todo 只能设死高度?但是一个测点就不居中了
      & > li {
        padding-top: 7px;
        font-size: 13px;
        white-space: nowrap;
      }
    }
  }
}
.time {
  color: #acb3d1;
  font-size: 12px;
  padding-bottom: 5px;
  text-align: center;
}
</style>
<style lang="scss">
.el-switch__label {
  position: absolute;
  display: none;
  font-size: 12px !important;
  color: #fff !important;
  top: 1px;
}
.el-switch__label * {
  font-size: 12px;
}
.el-switch__label.is-active {
  display: block;
}
.el-switch__label--left {
  left: 24px;
  z-index: 1;
}
.el-switch__label--right {
  left: 4px;
  z-index: 1;
}
.el-switch__core {
  width: 58px !important;
  height: 22px;
  border-color: #0a4d94 !important;
  border-width: 3px;
  border-radius: 11px;
}
.el-switch__core:after {
  background: linear-gradient(180deg, #95adf3, #193380);
  border: 2px solid #3c57a9;
  width: 21px;
  height: 21px;
  top: -2px;
  left: -2px;
}
</style>