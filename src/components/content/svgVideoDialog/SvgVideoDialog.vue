<template>
  <el-dialog
  custom-class="videoDialog"
    :title="title"
    :visible.sync="visual"
    width="62%"
    height="61%"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    @open="showVideo"
    @close="closeVideo"
    :before-close="handleClose"
  >
    <div class="svgVideo">
      <div class="videoWrapper">
        <video
          width="700px"
          height="550px"
          ref="video"
          id="video"
        >Your browser is too old which doesn't support HTML5 video.</video>
        <div class="ball-scale"  v-show="isWait"/>
      </div>
      <div class="svgVideoControl">
        <title-display height>
          <template v-slot:title>云台速度</template>
          <video-monitor-yuntai @ptz_control="ptz_control" ref="yuntai"></video-monitor-yuntai>
        </title-display>
        <title-display height="100%" class="prestoListwrapper">
          <template v-slot:title>预置位列表</template>
          <video-monitor-presto
            :cameraid="camera"
            :type="sensortype"
            ref="preset"
            @send-presetno="sendPresetno"
          ></video-monitor-presto>
        </title-display>
      </div>
    </div>
  </el-dialog>
</template>
 
<script>
import path from '@/settings'

import TitleDisplay from "common/display/TitleDisplay";
import VideoMonitorYuntai from "views/videoMonitor/child/VideoMonitorYuntai";
import VideoMonitorPresto from "views/videoMonitor/child/VideoMonitorPresto";
export default {
  name: 'SvgVideoDialog',
  data () {
    return {
      hostIp: path.streamIp,
      hostPort: path.streamPort,
      fp: null,
      visual: false,
      camera: '',
      preset: '',
      sensortype: null,
      title: null,
      isWait:false
    };
  },
  components: {
    TitleDisplay,
    VideoMonitorYuntai,
    VideoMonitorPresto
  },
  props: {
    // dialogVisible: {
    //   type: Boolean,
    //   default: false
    // },
    cameraid: {
      type: [String, Number],
      // default:null
    },
    presetno: {
      type: [String, Number],
      default:0
    },
    // 传感器类型
    type: {
      type: [String, Object],
      default:null
    },

  },
  computed: {
    // visibleComputed () {
    //   return this.dialogVisible
    // },
    // cameraComputed(){
    //   this.$nextTick(() => {  
    //     console.log("computed "+this.cameraid);
    //     return this.cameraid
    //   })
    // }
  },
  methods: {
    handleClose (done) {
      this.visual = false;
      this.flv_close(this.fp);
    },
    showVideo () {
      // nextTick之后可以获取更新渲染完成后的dom（对话框打开可能里面dom还未更新结束）
      this.$nextTick(() => {
        this.camera = this.cameraid;
        this.sensortype = this.type;
        this.flv_open(this.cameraid);
      })
    },
    closeVideo () {
      // this.$emit("closeVideo", false)
    },
    flv_open (id) {
      this.flv_close(this.fp);
      this.fp = new MPlayer(document.getElementById("video"));
      // console.log(this.fp);
      this.fp.onstatechanged = (state) => {
        if (this.fp) {
          this.isWait=!state;
        }
      };
      this.isWait=true;
      this.fp.open(this.hostIp, this.hostPort, id, "0");
      this.ptz_preset(this.presetno);
    },
    flv_close (fp) {
      if (fp) {
        fp.close();
        fp = null;
        this.isWait=false;
      }
    },
    // 控制video
    ptz_control (cmd) {
      if (this.fp) {
        // var speed = document.getElementById("ctrlSpeed").value;
        this.fp.ptz(cmd, this.$refs.yuntai.speed);
      }
    },
    sendPresetno (id) {
      this.ptz_preset(id)
    },
    // 转到预置位
    ptz_preset (id) {
      if (this.fp) {
        this.fp.preset(MPlayer.PRESET_GOTO, id);
      }
    },
  },
  mounted () {
    // alert(this.$refs.video)
    // alert(document.getElementById("video"))
    // this.flv_open(this.cameraid);
  },
  created () {
    // console.log("SvgVideoDialog "+ this.cameraid);
  }
};
</script>
 
<style lang='scss' scoped>
.svgVideo {
  display: flex;
  .videoWrapper {
    position: relative;
    border-image-source: url("~assets/image/border1.png");
    border-image-slice: 2 fill;
    border-width: 2px;
    border-style: solid;
    background-clip: padding-box;
    filter: blur(0px);
    // width: 100%;
    // height: 100%;
    video {
      display: block;
      background-color: black;
      object-fit: fill;
    }
  }
  .svgVideoControl {
    margin-left: 5px;
    display: flex;
    flex-direction: column;
    .prestoListwrapper {
      flex: 1;
      padding-top: 1px;
    }
  }
}
</style>
<style>
.videoDialog {
  mix-blend-mode: unset;
}
.videoDialog .el-dialog {
  background: url("~assets/image/dialogBg3.png") no-repeat center/100% 100%;
}
</style>