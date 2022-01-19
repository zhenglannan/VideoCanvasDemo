<template>
  <div>
    <div id="ThreeJS" style="left: 0px; top: 0px; background:#0a173f"></div>
    <svg-video-dialog :cameraid="cameraid" ref="dialog"></svg-video-dialog>
  </div>
</template>
 
<script>
import SvgVideoDialog from "content/svgVideoDialog/SvgVideoDialog";
import { getAllSensor } from 'network/envmonitor'
import { getSocket } from 'utils/socket'

import 'utils/t3'
import t3scene from 'utils/test.model.js'
export default {
  name: 'TableMonitor',
  data () {
    return {
      t3: null,
      timer: null,
      cameraid: '',
      p: null,
      id: ""
    };
  },
  components: {
    SvgVideoDialog,
  },
  methods: {
    // 控制设备开关
    opendevice (v, state) {
      var o = this.t3.getObject('id', v);
      if (o) {
        o.deviceState = state;
      }
    },
    padDate (value) {
      return value < 10 ? '0' + value : value;
    },
    formatDate (d) {
      return this.padDate(d.getHours()) + ":" + this.padDate(d.getMinutes()) + ":" + this.padDate(d.getSeconds());
    },
    // 循环动画
    animate () {
      this.id = requestAnimationFrame(this.animate);//
      // TWEEN.update();
      this.t3.animate();
    },
    // socket接收msg
    getMsg (msg) {
       if (msg !== "连接成功") {
        const res = JSON.parse(msg);
        if (res.topic === "webserver/reportdata/") {
          this.changePlateData(res.data);
        } else if (res.topic === "webserver/reportevent/") {
          this.$bus.$emit('changeEvent', res.data);
          this.changeEvent(res.data);
        } 
      }
    },
    // todo 实时数据 (暂时定死id，防止多次循环)
    changeTableData (payload) {
      const { sensorid, points, timestamp, eventlevel, networkstate, workpointid, state, sensorremotetype } = payload;
      // if (sensorid == "386" || sensorid == "387") {
      //   points.forEach(ele => {
      //     $(`#${ele.id}`).text(ele.value);
      //   });
      // }
      if (sensorremotetype == "yt" || sensorremotetype == "yk") {
        this.opendevice(sensorid, state == "开" ? true : false);
      } else {
        points.forEach(ele => {
          $(`#${ele.id}`).text(ele.value);
        });
      }

    },
    // todo 实时告警 （烟感，水浸告警怎么控制?）
    changeEvent (payload) {
      const { sensorid, sensorpointid, eventlevel, state, MaxEventLv, time, value, eventtypeText } = payload;
      if (sensorid == "386" || sensorid == "387") {
        points.forEach(ele => {
          $("#" + ele.id + "").text(ele.value)
        });
      }
      // todo 告警会传eventlevel为-1吗
      // this.opendevice(sensorid, true);
    },
    getPane () {
      getAllSensor("hjjc").then(res => {
        this.plateData = res.data;
        this.$nextTick(() => {
          this.init();
        })
      })
    },
    // 初始化值与状态
    init () {
      this.plateData.forEach(item => {
        if (item.state == "开" || item.state == "关") {
          this.opendevice(item.sensorid, item.state == "开" ? true : false)
        } else {
          item.pointlist.forEach(ele => {
            $(`#${ele.sensorpointid}`).text(ele.value)
          })
        }
      })
    }
  },
  mounted () {
    //!F 再次新建一个对象，js里面的东西已经被修改过了
    this.t3 = new T3Player();
    let container = document.getElementById('ThreeJS');
    this.t3.load(container, t3scene);

    this.t3.onObjectClick = (object) => {
      console.log(object);
      // 摄像机弹出弹框
      if (object.listener.type == "camera") {
        this.cameraid = object.listener.tag.id;
        this.$refs.dialog.visual = true;
        return
      } else if (object.listener.type == "device") {
        return
      }

      // 控制设备开关
      this.$confirm('确认控制此设备?', object.listener.tip ? object.listener.tip.innerHTML : "提示", {
        confirmButtonText: '开',
        cancelButtonText: '关',
        type: 'warning',
        modal: false,
        distinguishCancelAndClose: true
      }).then(() => {
        this.opendevice(object.listener.tag.id, true)
      }).catch(action => {
        action === 'cancel' ? this.opendevice(object.listener.tag.id, false) : (this.$notify({
          type: 'info',
          message: '已取消控制',
          position: 'bottom-right',
        }));
      });
    };
    // this.$nextTick(() => {
    if (this.t3) {
      this.animate();
    }
    this.p = this.t3.getObject('id', 'time1');

    this.timer = setInterval(() => {
      this.p.text = this.formatDate(new Date);
    }, 1000);

    // })

  },
  created () {
    this.getPane();
    getSocket(JSON.stringify({ type: 'client' }), this.getMsg);

  },
  beforeDestroy () {
    // delete THREE.Object3D.prototype.display;

    // this.t3 = null;
    // window.cancelAnimationFrame(this.id);
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
}
</script>
 
<style lang='scss'>
// .label {
//   color: #fff;
//   font-family: sans-serif;
//   font-size: 40px;
//   padding: 2px;
//   background: rgba(0, 0, 0, 0.6);
// }

// .device_pan {
//   box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.5);
//   border: 1px solid rgba(127, 255, 255, 0.25);
//   background: rgba(0, 127, 127, 0.8);
//   font-family: Helvetica, sans-serif;
//   text-align: center;
//   line-height: normal;
//   cursor: default;
// }

// .device_pan:hover {
//   box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.75);
//   border: 1px solid rgba(127, 255, 255, 0.75);
// }

// .device_pan .title {
//   font-size: 12px;
//   color: rgba(127, 255, 255, 0.75);
// }

// .device_pan .name {
//   /* position: absolute; */
//   font-size: 12px;
//   color: rgba(127, 255, 255, 0.75);
// }

// .device_pan .value {
//   /* position: absolute; */
//   font-size: 12px;
//   font-weight: bold;
//   color: rgba(255, 255, 255, 0.75);
//   text-shadow: 0 0 10px rgba(0, 255, 255, 0.95);
// }
// .device_pan .unit {
//   /* position: absolute; */
//   font-size: 12px;
//   font-weight: bold;
//   color: rgba(255, 255, 255, 0.75);
//   text-shadow: 0 0 10px rgba(0, 255, 255, 0.95);
// }
</style>