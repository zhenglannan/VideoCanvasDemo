<template>
  <el-row>
    <el-col :span="19">
      <object
        :data="`${mapUrl}/svg/${svgUrl}`"
        width="1600px"
        height="1000px"
        id="svg_obj"
      >Sorry your browser does not support inline frames.</object>
      <!-- <object
        :data="`http://192.168.90.57:8082/svg${svgUrl}`"
        width="1600px"
        height="1000px"
        id="svg_obj"
      >Sorry your browser does not support inline frames.</object>-->
      <!-- <object
        data="static/zks.svg"
        border="0"
        width="1600px"
        height="1000px"
        id="svg_obj"
      >Sorry your browser does not support inline frames.</object>-->
    </el-col>
    <svg-video-dialog :cameraid="cameraid" :type="type" :presetno="presetno" ref="dialog"></svg-video-dialog>
  </el-row>
</template>
 
<script>
import path from '@/settings'
const { mapUrl } = path;
import $ from 'jquery';
// import DisplayMap from "common/display/DisplayMap";
import SvgVideoDialog from "content/svgVideoDialog/SvgVideoDialog";

import { getAllSensor, getRegionMap, getAllSensorType } from 'network/envmonitor'
import { mapState } from 'vuex'
import { getSocket } from 'utils/socket'

export default {
  name: 'PaneMap',
  data () {
    return {
      svgUrl: "#/404", //初始化时可以先展示404，不再跳到登录界面
      plateData: null,
      cameraid: undefined,//?
      presetno: "",
      type: null,
      title: '',//控制弹出框设备名
      dialogVisible: false,
      state: '开',
      sensorid: '',
      pointid: '',
      mapUrl: mapUrl
    };
  },
  components: {
    SvgVideoDialog
  },
  props: {
    monitorType: {
      type: String
    },
    mapType: {
      type: String
    }
  },
  mounted () {
    var _this = this;
    $("#svg_obj").on('load', function () {
      // alert(1) 
      //!跨域不能操作元素
      _this.$_iframe('[sid]').css("cursor", "pointer");
      _this.zoom(this);
      _this.changeData();//?不应该在这改变，万一数据还没有获取到？

      _this.$_iframe("[sid]").on("click", function () {
        _this.$refs.dialog.title = $(this).attr("sname");
        //传感器类型
        if ($(this).attr("type") == "sensor" && $(this).attr("camerastate") == 1) {
          _this.$refs.dialog.visual = true;
          _this.cameraid = $(this).attr("cameraid");
          _this.presetno = $(this).attr("presetno");
          _this.type = $(this).attr("type");
          // _this.$refs.dialog.type = $(this).attr("type");
        } else if ($(this).attr("type") == null) {//摄像机
          _this.$refs.dialog.visual = true;
          _this.cameraid = $(this).attr("sid");
          _this.type = null;
        }
      });
      // 跳转
      _this.$_iframe("g[href]").on("click", function () {
        // 1.本地
        // $("#svg_obj").attr("data","static/"+$(this).attr("href"))
        //2.服务器要加上区域id，暂时为1
        // $("#svg_obj").attr("data", `${_path.mapUrl}/svg/${_this.$store.state.regionid}/` + $(this).attr("href"))
        // $("#svg_obj").attr("data", `${mapUrl}/svg/${_this.$store.state.regionid}/` + $(this).attr("href"))
        $("#svg_obj").attr("data", `${mapUrl}/svg/${_this.$store.state.regionid}/` + $(this).attr("href"))
      })
    })
    // this.$refs.mqtt.MQTTconnect();// 建立mqtt通信
  },
  methods: {
    // svgDom【封装】选择结构
    $_iframe (selector) {
      return $("#svg_obj").contents().find(selector)
    },
    changeData () {
      if (this.plateData && this.plateData.length > 0) {
        this.plateData.forEach((item) => {
          // 判断有无预置位图标
          // if(item.camerastate==0){
          //   this.$_iframe('[sid=' + item.sensorid + ']').hide();
          // }
          this.$_iframe('[sid=' + item.sensorid + ']').attr("camerastate", item.camerastate);//有无视频弹窗
          this.$_iframe('[sid=' + item.sensorid + ']').attr("type", "sensor");//todo给所有非摄像机设备加sensor类型
          this.$_iframe('[sid=' + item.sensorid + ']').attr("cameraid", item.cameraid);
          this.$_iframe('[sid=' + item.sensorid + ']').attr("presetno", item.presetno);
          this.$_iframe('[sid=' + item.sensorid + ']').attr("state", item.state);//?state
          //改变测点值与颜色
          item.pointlist.forEach(ele => {
            this.$_iframe('[pid=' + ele.sensorpointid + ']').attr("remotetype", ele.remotetype);
            if (ele.remotetype == 'yc') {
              // 把单位和上下限加入属性
              this.$_iframe('[pid=' + ele.sensorpointid + '] text').attr("unit", ele.unit);
              this.$_iframe('[pid=' + ele.sensorpointid + '] text').attr("eventtypeText", ele.eventtypeText);
              //改变value值
              if (ele.value.indexOf("-9999") > -1) {
                this.$_iframe('[pid=' + ele.sensorpointid + '] text').text("- -");
              } else {
                if (item.modelkind == "tacd") {
                  this.$_iframe('[pid=' + ele.sensorpointid + '] text').text(ele.value + ele.eventtypeText);
                } else {
                  this.$_iframe('[pid=' + ele.sensorpointid + '] text').text(ele.value + ele.unit + ele.eventtypeText);
                }
              }
              // 颜色
              this.$_iframe('[pid=' + ele.sensorpointid + '] text').attr('fill', this.changeTextColor(ele.eventlevel));
            } else if (ele.remotetype == 'yx') {//遥信
              // 如果是imgs标签修改图片，是color修改path颜色
              if (this.$_iframe('[pid=' + ele.sensorpointid + '] addition>imgs').length != 0) {
                let value = this.$_iframe('[pid=' + ele.sensorpointid + '] addition imgs[id=' + ele.value + ']').attr("value");
                if (value) {
                  this.$_iframe('[pid=' + ele.sensorpointid + '] image').attr("xlink:href", "../link/sensor/" + value + ".png");
                  // this.$_iframe('[pid=' + ele.sensorpointid + '] image').attr("xlink:href", value);
                }
              } else if (this.$_iframe('[pid=' + ele.sensorpointid + '] addition>color').length != 0) {
                let value = this.$_iframe('[pid=' + ele.sensorpointid + '] addition color[id=' + ele.value + ']').attr("value");
                if (value) {
                  this.$_iframe('[pid=' + ele.sensorpointid + '] path').attr("stroke", "rgba(" + value + ")");
                }
              }
            }
          })
        })
      }
    },
    closeVideo () {
      // this.dialogVisible = false;
    },
    //?还有离线否?第一次请求根据告警等级改变颜色
    changeTextColor (eventlevel) {
      if (eventlevel == '-1') {
        return "#A4D3FF"
      } else if (eventlevel == '1') {
        return "#FF8826"
      } else if (eventlevel == '2') {
        return "#FF3D1F"
      }
    },
    // jquery缩放svg插件
    zoom (obj) {
      // alert(2)
      // 此处获取的元素Id是SVG文件中的<g>标签的id值
      // $(obj.getSVGDocument().getElementById('svgid')).hide();
      svgPanZoom(obj, {
        zoomEnabled: true,          //开启缩放功能
        controlIconsEnabled: false, //开启右下角缩放控件功能
        dblClickZoomEnabled: false, //双击
        zoomScaleSensitivity: 0.2,  //缩放灵敏度

        minZoom: 0.3,    //最小
        maxZoom: 2.5    //最大
      });
      // svgPanZoom.setAttribute("transform", "scale(1)");
    },
    // socket接收msg
    getMsg (msg) {
      if (msg !== "连接成功")  {
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
    // 实时改变数值
    changePlateData (payload) {
      const { points, eventlevel } = payload;
      points.forEach(item => {
        let remotetype = this.$_iframe('[pid=' + item.id + ']').attr("remotetype");
        if (remotetype == "yx") {
          if (this.$_iframe('[pid=' + item.id + '] addition>imgs').length != 0) {
            let value = this.$_iframe('[pid=' + item.id + '] addition imgs[id=' + item.value + ']').attr("value");
            if (value) {//todo需判空值
              // this.$_iframe('[pid=' + item.id + '] image').attr("xlink:href", value);
              this.$_iframe('[pid=' + item.id + '] image').attr("xlink:href", "../link/sensor/" + value + ".png");
            }
          } else if (this.$_iframe('[pid=' + item.id + '] addition>color').length != 0) {
            let value = this.$_iframe('[pid=' + item.id + '] addition color[id=' + item.value + ']').attr("value");
            if (value) {//todo需判空值
              this.$_iframe('[pid=' + item.id + '] path').attr("stroke", "rgba(" + value + ")");
            }
          }
        } else if (remotetype == "yc") {
          if (eventlevel == -1) {
            if (item.modelkind == "tacd") {
              this.$_iframe('[pid=' + item.id + '] text').text(item.value);
              this.$_iframe('[pid=' + item.id + '] text').attr("fill", this.changeTextColor(eventlevel));
            } else {
              this.$_iframe('[pid=' + item.id + '] text').text(item.value + this.pointUnit(item.id));
              this.$_iframe('[pid=' + item.id + '] text').attr("fill", this.changeTextColor(eventlevel));
            }
          } else {
            if (item.modelkind == "tacd") {
              let eventtypeText = this.$_iframe('[pid=' + item.id + '] text').attr("eventtypeText");
              this.$_iframe('[pid=' + item.id + '] text').text(item.value + eventtypeText);
            } else {
              let eventtypeText = this.$_iframe('[pid=' + item.id + '] text').attr("eventtypeText");
              this.$_iframe('[pid=' + item.id + '] text').text(item.value + this.pointUnit(item.id) + eventtypeText);
            }
          }
        }
      })
    },
    changeEvent (payload) {
      const { sensorpointid, eventlevel, value, eventtypeText } = payload;
      this.$_iframe('[pid=' + sensorpointid + '] text').text(value + this.pointUnit(sensorpointid) + eventtypeText);
      this.$_iframe('[pid=' + sensorpointid + '] text').attr('fill', this.changeTextColor(eventlevel));
      this.$_iframe('[pid=' + sensorpointid + '] text').attr("eventtypeText", eventtypeText)
    },
    // 返回单位
    pointUnit (id) {
      return this.$_iframe('[pid=' + id + '] text').attr("unit");
    },
    // 获取光字牌
    getSensorPane () {
      getAllSensor(this.monitorType).then(res => {
        this.plateData = res.data;
        //?todo是在svg渲染完成后再修改结构吗
        this.$nextTick(() => {
          this.changeData();
        })
      })
    },
    getRegionMap () {
      getRegionMap(this.mapType).then(res => {
        if (res.data.length != 0) {
          // let item = $("#svg_obj").attr("data");
          // alert(item)
          // todo mapurl如果匹配错误也不会跳转
          this.svgUrl = res.data[0].mapurl;
          // if (item == '' || item == "http://192.168.90.57:8082/svg") {
          // $("#svg_obj").attr("data", "http://192.168.90.57:8082/svg" + this.svgUrl);//!
          // alert($("#svg_obj").attr("data"))
          // }
          // $("#svg_obj").attr("data", "http://192.168.90.57:8082/svg" + this.svgUrl);
        } else {
          // $("#svg_obj").attr("data", "");
          // let item = $("#svg_obj").attr("data");
          // alert(item)
          this.svgUrl = "/default.svg";
        }
        console.log(this.svgUrl);
      })
    }
  },
  computed: {
    ...mapState(['regionid']),
  },
  watch: {
    regionid (val) {
      this.getSensorPane();
      this.getRegionMap();
    }
  },
  created () {
    this.getRegionMap();
    this.getSensorPane();
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
</style>