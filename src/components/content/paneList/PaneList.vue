<template>
  <el-row>
    <el-col :span="20">
      <div class="plateWrapper">
        <div class="plate">
          <light-plate
            v-for="item in plateData"
            :key="item.sensorid"
            :pointlist="item.pointlist||null"
            :eventlevel="item.eventlevel||-2"
            :title="item.sensoridname"
            :modelkind="item.modelkind"
            :networkstate="item.networkstate"
            :state="item.state"
            :sensorid="item.sensorid"
            @change-value="changeValue"
            @show-point-list="showPointList"
            @show-line3D="showLine3D(item.sensorid)"
            :ref="item.sensorid"
          >
            <template v-slot:time>{{item.time}}</template>
          </light-plate>
        </div>
      </div>
      <div style="text-align: center;">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
          :hide-on-single-page="false"
          :background="true"
        ></el-pagination>
      </div>
    </el-col>
    <el-col :span="4">
      <div>
        <list-montor-type @select-type="selectType" :type-data="typeData" style="    left: -17px;"></list-montor-type>
      </div>
    </el-col>
    <point-list-dialog :list="list" ref="dialog"></point-list-dialog>
    <line3D-dialog ref="dialog3D" :sensorid="sensorid"></line3D-dialog>
  </el-row>
</template>
 
<script> 
// import DisplayMap from "common/display/DisplayMap";
import LightPlate from "content/display/LightPlate";
import ListMontorType from "content/listMontorType/ListMontorType";
import PointListDialog from "content/dialog/PointListDialog";
import Line3DDialog from "content/dialog/Line3DDialog";
import { getAllSensor,getAllSensorType } from 'network/envmonitor'
import { getEnumValue } from 'utils/index'
import { getSocket } from 'utils/socket'
// import { formatDate } from 'utils/index'
import { mapState } from 'vuex'
export default {
  name: 'PaneList',
  props: {
    monitortype: {
      type: String
    }
  },
  data () {
    return {
      filterText: '',
      // data: null,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // regionid: null,
      plateData: [],
      typeData: [],
      list: null,
      modelkind: "",

      currentPage: 1,
      pageSize: this.monitortype === "zxjc" ? 8 : 15,
      total: 0,

      sensorid: ""
    };
  },
  components: {
    LightPlate,
    ListMontorType,
    PointListDialog,
    Line3DDialog
  },
  methods: {
    handleCurrentChange (val) {
      this.currentPage = val;
    },
    showPointList (item) {
      this.$refs.dialog.visual = true;
      this.list = item;
    },
    showLine3D (id) {
      this.$refs.dialog3D.visual = true;
      this.sensorid = id;
    },
    //更改空调测点列表的值
    changeValue (sid, pid, val) {
      let index = this.plateData.findIndex(item => item.sensorid === sid);
      if (index != -1) {
        let index2 = this.plateData[index].pointlist.findIndex(item => item.sensorpointid == pid);
        if (index2 != -1) {
          this.plateData[index].pointlist[index2].value = val;
        }
      }
    },
    // socket接收msg
    getMsg (msg) {
      if (msg !== "连接成功") {
        const res = JSON.parse(msg);
        if (res.topic === "webserver/reportdata/") {
          this.changePlateData(res.data);
        } else if (res.topic === "webserver/reportevent/") {
          this.$bus.$emit('changeEvent',res.data)
          this.changeEvent(res.data);
        } else if (res.topic === "webserver/reply/") {
          this.changeCommandIssue(res.data);
        }
      }
    },
    selectType (id) {
      this.modelkind = id;
      this.currentPage = 1;
      this.getSensorPane(id)
    },
    // 根据类型获取光字牌
    getSensorPane (modelkind) {
      getAllSensor(this.monitortype, modelkind, this.currentPage, this.pageSize).then(res => {
        this.plateData = res.data;
        this.total = res.total;
      })
    },
    // 实时改变数据
    changePlateData (payload) {
      const { sensorid, points, timestamp, eventlevel, networkstate, workpointid, state, sensorremotetype } = payload;
      // if (sensorid === "629") {
      //   console.log(payload);
      // }
      let index = this.plateData.findIndex(item => item.sensorid === sensorid);
      //todo：findIndex减少循环？
      if (index != -1) {
        this.plateData[index].time = timestamp;
        this.plateData[index].networkstate = networkstate;

        if (networkstate == 0) {
          this.plateData[index].state = "离线";
          this.plateData[index].eventlevel = -2;
          // 可以用映射吗map?只改变这3个数据
          this.plateData[index].pointlist.forEach((point, index1) => {
            this.plateData[index].pointlist[index1].eventlevel = -2;
            this.plateData[index].pointlist[index1].value = "--";
            this.plateData[index].pointlist[index1].eventtypeText = "";
          });
          return
        }

        if (networkstate == 1) {//离线转在线（控制类怎么设置）
          if (eventlevel == -9999) {//网络状态测点
            if (workpointid != "") {//判断遥信设备 yx测点
              this.plateData[index].eventlevel = -1;
              // 离线转在线时需要根据workpointid获取之前存在变量中的值
              let index2 = this.plateData[index].pointlist.findIndex(item => item.sensorpointid == workpointid);
              //?应该是改光字牌的state
              this.plateData[index].state = getEnumValue(this.plateData[index].pointlist[index2].datadesctype, this.plateData[index].pointlist[index2].value);
              // this.plateData[index].pointlist[index2].state = getEnumValue(this.plateData[index].pointlist[index2].datadesctype, this.plateData[index].pointlist[index2].value);
            } else {//遥测直接return
              return
            }
          } else {
            // eventlevel为-1且sensorremotetype不等于yk且不等于yt时显示正常
            if (eventlevel == -1 && (sensorremotetype != "yk" && sensorremotetype != "yt")) {//todo 由告警转为正常
              this.plateData[index].state = "正常";
              this.plateData[index].eventlevel = -1;
            } else {//todo 告警状态(有测点还在告警)
              this.plateData[index].state = state;
              this.plateData[index].eventlevel = eventlevel;
            }
          }
        }

        points.forEach(ele => {
          this.plateData[index].pointlist.forEach((point, index1) => {
            if (point.sensorpointid == ele.id) {
              this.plateData[index].pointlist[index1].time = timestamp;
              // 遥信测点（根据枚举值改状态值）
              if (point.datadesctype != '--' && point.datadesctype.indexOf(":") > -1) {//测点枚举值判断真假
                if (workpointid != "" && point.sensorpointid == workpointid) {//有工作id(开关)才获取枚举值（区分网络状态测点枚举值，网络状态测点没有工作id）
                  this.plateData[index].state = getEnumValue(point.datadesctype, ele.value);
                  if (this.plateData[index].modelkind == "tacd") {
                    this.plateData[index].pointlist[index1].value = ele.value;//
                  }
                  // return //forEach实现for循环continue的效果
                } else if (this.plateData[index].modelkind == "tacd") {//没有workpointid但是有枚举值且是空调
                  this.plateData[index].pointlist[index1].value = ele.value;
                }
              } else {
                // 遥测测点（只改变测点值）
                this.plateData[index].pointlist[index1].value = ele.value;//改变测点的值
                this.plateData[index].pointlist[index1].eventlevel = ele.eventlevel;
                this.plateData[index].pointlist[index1].eventtypeText = ele.eventtypeText;
                if (eventlevel == -1) {//全部恢复正常 
                  this.plateData[index].pointlist[index1].eventlevel = -1;
                  this.plateData[index].pointlist[index1].eventtypeText = "";
                }
              }
            }
          });
        });
      }
    },
    // 实时告警状态(也要改变数据)不分遥信、遥测？
    changeEvent (payload) {
      const { sensorid, sensorpointid, eventlevel, MaxEventLv, state, time, value, eventtypeText } = payload;
      this.plateData.forEach((item, index) => {
        if (item.sensorid == sensorid) {
          this.plateData[index].state = state;
          this.plateData[index].time = time;
          this.plateData[index].eventlevel = MaxEventLv;//面板的eventlevel
          item.pointlist.forEach((point, index1) => {
            if (point.sensorpointid == sensorpointid) {
              this.plateData[index].pointlist[index1].eventlevel = eventlevel;//测点的eventlevel
              this.plateData[index].pointlist[index1].value = value;
              this.plateData[index].pointlist[index1].eventtypeText = eventtypeText;
              this.plateData[index].pointlist[index1].time = time;
            }
          });
        }
      });
    },
    // 下发回复指令
    changeCommandIssue (payload) {
      console.log(payload);
      // state为之前的状态 为什么发yxpointid？
      const { error, sensorid, pointid, state, userid, modelkind, yxpointid, sid } = payload;
      if (sid == this.$store.state.sid) {
        if (error == "success") {
          this.$notify({
            type: 'success',
            message: '成功下发指令',
            position: 'bottom-right',
          });
        } else if (error) {
          if (error == "error") {
            this.$notify({
              message: '下发指令失败',
              type: 'error',
              position: 'bottom-right',
            });
          } else {
            // error之外的其他错误，如权限不足
            this.$notify({
              message: error,
              type: 'error',
              position: 'bottom-right',
            });
          }
          // 返回之前面板开关的状态
          let index = this.plateData.findIndex(item => item.sensorid == sensorid);
          if (index > -1) {
            // 空调更改yt测点值
            if (modelkind === "tacd") {
              let index2 = this.plateData[index].pointlist.findIndex(item => item.sensorpointid == pointid);
              if (index2 > -1) {
                this.plateData[index].pointlist[index2].value = state;
              }
            }
          }
        }
      }
    },
    // 获取设备类型
    getAllSensorType (type) {
      getAllSensorType(type).then(res => {
        this.typeData = res.data;
      })
    }
  },
  computed: {
    ...mapState(['regionid']),
    // 光字牌列表是否显示可下划提示
    // prompt () {
    //   // return false
    //   return this.plateData.length > 15
    // }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    },
    regionid () {
      this.currentPage = 1;
      this.getSensorPane();
    },
    currentPage (val) {
      this.getSensorPane(this.modelkind);
    }
  },
  created () {
    this.getSensorPane();
    // this.$axios.get("json/plate.json").then(res=>{
    //   this.plateData=res.data.data;
    // })
    this.getAllSensorType(this.monitortype);
    getSocket(JSON.stringify({ type: 'client' }), this.getMsg);
  },
}
</script>
 
<style lang='scss' scoped>
.treeContent {
  position: relative;
  background: #151d4a;
  width: 200px;
  height: 100%;
}
.plateWrapper {
  height: 624px;
  margin-top: 163px;
  background: url("~assets/image/env/plateWrapper.png") no-repeat center;
  position: relative;
  overflow: hidden;
  .plate {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 1300px;
    height: 500px;
    overflow-y: auto;
    padding-left: 45px;
    // &::-webkit-scrollbar {
    //   display: none;
    // }
  }
}
.mouse {
  position: absolute;
  left: -255px;
  right: 0;
  margin: auto;
  // animation-name: slide;
  // animation-iteration-count: infinite;
  // animation-duration: 1s;
  // animation-direction:alternate;
  background: #4e5559
    linear-gradient(transparent 0%, transparent 50%, #ffffff 50%, #ffffff 100%);
  width: 52px;
  height: 88px;
  border-radius: 100px;
  background-size: 100% 200%;
  animation: colorSlide 5s linear infinite, nudgeMouse 5s ease-out infinite;
}
.mouse::before {
  width: 46px;
  height: 82px;
  background-color: #222a30;
  border-radius: 100px;
}
.mouse::after {
  background-color: #ffffff;
  width: 10px;
  height: 10px;
  border-radius: 100%;
  animation: trackBallSlide 5s linear infinite;
}
.mouse::before,
.mouse::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}
// @-webkit-keyframes slide{
//   0%{
//     transform: translate(0,0);
//   }
//   100%{
//     transform: translate(0,30px);
//   }
// }
@-webkit-keyframes colorSlide {
  0% {
    background-position: 0% 100%;
  }
  20% {
    background-position: 0% 0%;
  }
  21% {
    background-color: #4e5559;
  }
  29.99% {
    background-color: #ffffff;
    background-position: 0% 0%;
  }
  30% {
    background-color: #4e5559;
    background-position: 0% 100%;
  }
  50% {
    background-position: 0% 0%;
  }
  51% {
    background-color: #4e5559;
  }
  59% {
    background-color: #ffffff;
    background-position: 0% 0%;
  }
  60% {
    background-color: #4e5559;
    background-position: 0% 100%;
  }
  80% {
    background-position: 0% 0%;
  }
  81% {
    background-color: #4e5559;
  }
  90%,
  100% {
    background-color: #ffffff;
  }
}
@-webkit-keyframes trackBallSlide {
  0% {
    opacity: 1;
    -webkit-transform: scale(1) translateY(-20px);
    transform: scale(1) translateY(-20px);
  }
  6% {
    opacity: 1;
    -webkit-transform: scale(0.9) translateY(5px);
    transform: scale(0.9) translateY(5px);
  }
  14% {
    opacity: 0;
    -webkit-transform: scale(0.4) translateY(40px);
    transform: scale(0.4) translateY(40px);
  }
  15%,
  19% {
    opacity: 0;
    -webkit-transform: scale(0.4) translateY(-20px);
    transform: scale(0.4) translateY(-20px);
  }
  28%,
  29.99% {
    opacity: 1;
    -webkit-transform: scale(1) translateY(-20px);
    transform: scale(1) translateY(-20px);
  }
  30% {
    opacity: 1;
    -webkit-transform: scale(1) translateY(-20px);
    transform: scale(1) translateY(-20px);
  }
  36% {
    opacity: 1;
    -webkit-transform: scale(0.9) translateY(5px);
    transform: scale(0.9) translateY(5px);
  }
  44% {
    opacity: 0;
    -webkit-transform: scale(0.4) translateY(40px);
    transform: scale(0.4) translateY(40px);
  }
  45%,
  49% {
    opacity: 0;
    -webkit-transform: scale(0.4) translateY(-20px);
    transform: scale(0.4) translateY(-20px);
  }
  58%,
  59.99% {
    opacity: 1;
    -webkit-transform: scale(1) translateY(-20px);
    transform: scale(1) translateY(-20px);
  }
  60% {
    opacity: 1;
    -webkit-transform: scale(1) translateY(-20px);
    transform: scale(1) translateY(-20px);
  }
  66% {
    opacity: 1;
    -webkit-transform: scale(0.9) translateY(5px);
    transform: scale(0.9) translateY(5px);
  }
  74% {
    opacity: 0;
    -webkit-transform: scale(0.4) translateY(40px);
    transform: scale(0.4) translateY(40px);
  }
  75%,
  79% {
    opacity: 0;
    -webkit-transform: scale(0.4) translateY(-20px);
    transform: scale(0.4) translateY(-20px);
  }
  88%,
  100% {
    opacity: 1;
    -webkit-transform: scale(1) translateY(-20px);
    transform: scale(1) translateY(-20px);
  }
}
@-webkit-keyframes nudgeMouse {
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
  20% {
    -webkit-transform: translateY(8px);
    transform: translateY(8px);
  }
  30% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
  50% {
    -webkit-transform: translateY(8px);
    transform: translateY(8px);
  }
  60% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
  80% {
    -webkit-transform: translateY(8px);
    transform: translateY(8px);
  }
  90% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
}
</style>