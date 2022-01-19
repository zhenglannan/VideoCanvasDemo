<template>
  <div id="app">
    <div class="wrapper">
      <div class="container">
        <div class="dashboard-bg-image"></div>
        <div :style="marginStyle">
          <div style="position: relative">
            <div :class="changeBg" style="width: 1920px; height: 1080px" :style="transformStyle">
              <Head v-show="showHead" v-if="$route.path=='/home'" @changeProgram="changeProgram"></Head>
              <Head2
                v-show="showHead"
                v-else-if="$route.path.indexOf('home2')>-1"
                @changeProgram="changeProgram"
              ></Head2>
              <head-second v-show="showHead" v-else></head-second>
              <div class="sidebar">
                <router-view />
              </div>
              <!-- <Footer></Footer> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <alarm-video-dialog :cameraid="cameraid" :presetno="presetno" ref="dialog"></alarm-video-dialog>
    <el-drawer title="风格搭配" :visible.sync="drawer" :modal="false">
      <div class="programWrapper">
        <img src="~assets/image/home/p1.png" @click="selectStyle('/home')" alt />
        <img src="~assets/image/home/p2.png" @click="selectStyle('/home2')" alt />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import Head from "common/header/Head";
import Head2 from "common/header/Head2";
import HeadSecond from "common/header/HeadSecond";
import AlarmVideoDialog from "content/svgVideoDialog/AlarmVideoDialog";

// import Sidebar from "content/sidebar/Sidebar";
// import Footer from "common/footer/Footer";
import { debounce } from "lodash";
import { getComputedStyle } from "./utils/index";
import { mapState } from 'vuex'

export default {
  name: "App",
  data () {
    return {
      scaleX: 1,
      scaleY: 1,
      marginHorizontal: 0,
      cameraid: "",
      presetno: "",
      drawer: false,
      // 通知实例
      notifyInstance: null
    };
  },
  components: {
    Head,
    Head2,
    HeadSecond,
    AlarmVideoDialog
  },
  mounted () {
    this.init();
    this.$bus.$on("changeEvent", (payload) => {
      const h = this.$createElement;
      // 只允许同时显示一个通知

      if (payload.type === 'AI' && payload.eventlevel !== '-1') {//*AI告警
        if (this.notifyInstance) {
          this.notifyInstance.close();
        }
        this.notifyInstance = this.$notify({
          // duration: 0,
          duration: 5000,
          dangerouslyUseHTMLString: true,
          position: 'bottom-right',
          type: 'warning',
          customClass: 'warningNotify',
          message: h(
            'div', { class: 'notify-msg-box' },
            [h('img',
              {
                domProps: {
                  src: path.fileUrl + payload.file[0].url
                },
                style: { width: '200px', height: '100px' }
              }),//todo
            h('p', {}, '站房名称:' + payload.regionidname),
            h('p', {}, '事件类型:' + payload.eventtypename),
            h('p', {}, '事件源:' + payload.sensoridname),
            h('p', {}, '事件时间:' + payload.time)]
          )
        });
      } else if (payload.handlecameraid && payload.handlepresetno) {//*视频联动弹框
        console.log("APP:reportevent");
        this.changeEvent(payload.handlecameraid, payload.handlepresetno);
      } else if (payload.eventlevel !== '-1') {//*普通告警
        if (this.notifyInstance) {
          this.notifyInstance.close();
        }

        // eventlevel为-1时取消告警
        this.notifyInstance = this.$notify({
          // duration: 0,
          duration: 5000,
          dangerouslyUseHTMLString: true,
          position: 'bottom-right',
          type: 'warning',
          customClass: 'warningNotify',
          message: h(
            'div', { class: 'notify-msg-box' },
            [h('p', {}, '站房名称:' + payload.regionidname),
            h('p', {}, '设备名称:' + payload.sensoridname),
            h('p', {}, '测点名称:' + payload.sensorpointidname),
            h('p', {}, '告警时间:' + payload.time),
            h('p', {}, '告警类型:' + payload.eventtypename),
            h('p', {}, '告警等级:' + payload.eventlevelname)]
          )
        });
      }
    });
  },
  computed: {
    ...mapState(['userid', 'webTitle']),
    transformStyle: function () {
      return {
        transform: `scale(${this.scaleX}, ${this.scaleY})`,
      };
    },
    marginStyle: function () {
      return {
        margin: `0px ${this.marginHorizontal}px`,
      };
    },
    changeBg () {
      return this.$route.path.indexOf('home') > -1 ? "dashboard-container" : "dashboard-container2"
    },
    showHead () {
      return this.$route.path.indexOf('login') == -1 && this.$route.path.indexOf('404') == -1
    }
  },
  methods: {
    selectStyle (path) {
      this.$router.push(path);
      this.$store.commit("SET_STYLE", path);
    },
    // 切换方案
    changeProgram () {
      this.drawer = true;
    },
    init () {
      this.listenResize();
    },
    // 缩小也要适应
    initScale () {
      let $container = document.querySelector(".container");
      let containerWidth = getComputedStyle($container, "width").replace("px", "");
      let containerHeight = getComputedStyle($container, "height").replace("px", "");
      containerWidth = Number(containerWidth);
      containerHeight = Number(containerHeight);
      containerWidth = isNaN(containerWidth) ? 0 : containerWidth;
      containerHeight = isNaN(containerHeight) ? 0 : containerHeight;

      let defaultHeight = 1080;
      let defaultWidth = 1920;
      // todo sacle 缩放比例。
      let scale = 1;
      if (containerHeight < defaultHeight) {
        scale = containerHeight / defaultHeight;
      }

      this.scaleX = scale;
      this.scaleY = scale;

      let marginWidth = defaultWidth * scale;
      //
      this.marginHorizontal = 0;
      if (containerWidth > marginWidth) {
        marginWidth = (containerWidth - marginWidth) / 2;
        this.marginHorizontal = marginWidth;
      }
    },
    listenResize () {
      this.initScale();
      // todo这样防抖可能不起作用，在mounted里面加比较好吧?
      window.addEventListener(
        "resize",
        debounce(() => {
          this.initScale();
        }, 300)
      );
    },
    // 告警联动弹窗
    changeEvent (cameraid, presetno) {
      this.$refs.dialog.visual = true;
      this.cameraid = cameraid;
      this.presetno = presetno;
    },
  },
  created () {
    // todo 先请求静态json获取标题
    this.$axios("static/config.json").then(res => {
      this.$store.commit("SET_WEBTITLE", res.data.name);
      // todo 
      document.title = this.webTitle;
    })
    //todo加在这？全局能改变吗还没测试  当协议为https时改标志
    if (window.location.protocol === 'https:') {
      MPlayer.sslFlag = true;
    }
  },
};
</script>
<style lang="scss">
@import "styles/base.scss";
@mixin node($bg, $p-bg) {
  // background: url("~assets/image/dialogBg3.png") no-repeat center/100% 100% $bg !important;;
  background-color: $bg !important;
  border: none !important;
  .el-notification__closeBtn {
    color: #fff;
  }
  .notify-msg-box {
    display: flex;
    flex-direction: column;
    p {
      color: #fff;
      font-size: 14px;
      padding: 3px;
      background: $p-bg;
      margin: 2px;
    }
  }
}
.warningNotify {
  @include node(rgb(44 56 183 / 49%), rgb(9 82 255 / 26%));
}
// .successNotify {
//   @include node(#1f8815, none);
// }
#app {
  @include wh100;
}
.wrapper {
  @include wh100;
  position: relative;
}
// 在wrapper里居中
.container {
  background-color: #030c3b;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.dashboard-bg-image {
  @include wh100;
  position: absolute;
  background: linear-gradient(#090b24, #010134);
}

.dashboard-container {
  position: relative;
  user-select: none;
  @include wh100;
  transform-origin: 0 0;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  transition: all 0.3s linear;
  overflow: hidden;
  background: url(assets/image/background.png) 0 0 / 100%;
  // background: url(assets/image/title.png) 0 0 / 100%;
  display: flex;
  flex-flow: column;

  .sidebar {
    flex: 1;
    height: 100%;
    overflow: hidden;
  }
}

.dashboard-container2 {
  position: relative;
  user-select: none;
  @include wh100;
  transform-origin: 0 0;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  transition: all 0.3s linear;
  overflow: hidden;
  background: url(assets/image/background2.png) 0 0 / 100%;
  display: flex;
  flex-flow: column;

  .sidebar {
    flex: 1;
    height: 100%;
    overflow: hidden;
  }
}

.programWrapper {
  @include wh100;
  padding: 15px;
  display: flex;
  justify-content: space-around;

  img {
    width: 173px;
    height: 112px;
    cursor: pointer;
    transition: all 0.5s;

    &:hover {
      transform: scale(1.3, 1.3);
    }
  }
}

.el-drawer.rtl {
  height: 33% !important;
  top: 80px !important;
  background-color: #fff;
}
</style>