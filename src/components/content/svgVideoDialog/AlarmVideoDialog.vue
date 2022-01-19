<template>
  <el-dialog
  custom-class="videoDialog"
    title="告警联动"
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
        <div v-show="isWait" class="ball-scale" />
      </div>
      <div class="svgVideoControl">
        <title-display height>
          <template v-slot:title>云台速度</template>
          <video-monitor-yuntai @ptz_control="ptz_control" ref="yuntai"></video-monitor-yuntai>
        </title-display>
      </div>
    </div>
  </el-dialog>
</template>
 
<script>
import path from '@/settings'

import TitleDisplay from "common/display/TitleDisplay";
import VideoMonitorYuntai from "views/videoMonitor/child/VideoMonitorYuntai";
export default {
  name: 'AlarmVideoDialog',
  data () {
    return {
      hostIp: path.streamIp,
      hostPort: path.streamPort,
      fp: null,
      visual: false,
      isWait:false
      // title: null
    };
  },
  components: {
    TitleDisplay,
    VideoMonitorYuntai,
  },
  props: {
    cameraid: {
      type: [String, Number],
    },
    presetno: {
      type: [String, Number]
    },
  },
  watch: {
    cameraid (val) {
      this.flv_open(this.cameraid);
    }
  },
  methods: {
    handleClose (done) {
      this.visual = false;
      this.flv_close(this.fp);
    },
    showVideo () {
      // nextTick之后可以获取更新渲染完成后的dom（对话框打开可能里面dom还未更新结束）
      this.$nextTick(() => {
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
      this.ptz_preset(this.presetno);//打开的同时转到预置位
    },
    // setWait (v, display) {
    //   if (display) {
    //     v.wait.style.display = "block";
    //     var r = this.getLocation(v.video);
    //     v.wait.style.top =
    //       r.top + (r.height - v.wait.offsetHeight) / 2 + "px";
    //     v.wait.style.left =
    //       r.left + (r.width - v.wait.offsetWidth) / 2 + "px";
    //   } else {
    //     v.wait.style.display = "none";
    //   }
    // },
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
    // this.flv_open(29);
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
  }
}
@keyframes ball-scale {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.ball-scale {
  height: 48px;
  width: 48px;
  display: none;
  position: absolute;
  background-color: #a2c7c59f;
  background-image: radial-gradient(black, yellow, black);
  border-radius: 100%;
  animation: ball-scale 1s 0s ease-in-out infinite;
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