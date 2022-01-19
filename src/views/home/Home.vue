<template>
  <div class="home">
    <!-- <el-row type="flex"  justify="space-around"> -->
    <el-row style="    padding: 0 6px;">
      <el-col :span="6">
        <display height="324px" :isShow="true">
          <template v-slot:img>
            <img src="~assets/image/home/demo1.png" alt />
          </template>
          <template v-slot:title>站房总览</template>
          <template v-slot:more>
            <i class="el-icon-more" @click="getDetail" title="更多"></i>
          </template>
          <demo1 ref="demo1"></demo1>
        </display>
        <display height="336px">
          <template v-slot:img>
            <img src="~assets/image/home/demo2.png" alt />
          </template>
          <template v-slot:title>站房类型统计信息</template>
          <demo2 ref="demo2"></demo2>
        </display>
        <display height="314px" :isShow="true">
          <template v-slot:img>
            <img src="~assets/image/home/demo3.png" alt />
          </template>
          <template v-slot:title>视频巡航</template>
          <template v-slot:more>
            <i class="el-icon-more" @click="getCaptureDetail" title="更多"></i>
          </template>
          <demo3 @preview-img="previewImg" ref="demo3"></demo3>
        </display>
      </el-col>
      <el-col :span="12">
        <display-map height="661px">
          <demo8 ref="demo8" @open-dialog="openOnOffLineDialog"></demo8>
        </display-map>
        <display-home-bottom height="312px" :isShow="true">
          <template v-slot:img>
            <img src="~assets/image/home/demo4.png" alt />
          </template>
          <template v-slot:title>实时告警统计</template>
          <template v-slot:more>
            <i class="el-icon-more" @click="getDetail" title="更多"></i>
          </template>
          <demo4 ref="demo4"></demo4>
        </display-home-bottom>
      </el-col>
      <el-col :span="6">
        <display height="324px" :isShow="true">
          <template v-slot:img>
            <img src="~assets/image/home/demo7.png" alt />
          </template>
          <template v-slot:title>设备启动状态信息</template>
          <demo7 ref="demo7" @openDialog="openDeviceDialog"></demo7>
        </display>
        <display height="336px">
          <template v-slot:img>
            <img src="~assets/image/home/demo2.png" alt />
          </template>
          <template v-slot:title>设备统计</template>
          <demo5 ref="demo5"></demo5>
        </display>
        <display height="314px" :isShow="true">
          <template v-slot:img>
            <img src="~assets/image/home/demo6.png" alt />
          </template>
          <!-- <template v-slot:title>当日告警分类统计信息</template> -->
          <template v-slot:title>当日告警统计</template>
          <template v-slot:more>
            <i class="el-icon-more" @click="getDetail" title="更多"></i>
          </template>
          <demo6 ref="demo6"></demo6>
        </display>
      </el-col>
    </el-row>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="62%"
      class="imgDialog"
      :modal="true"
      :modal-append-to-body="false"
    >
      <el-image :src="img"></el-image>
    </el-dialog>
    <!-- 视频循环 -->
    <home-capture-dialog ref="capturedialog" @preview-img="previewImg"></home-capture-dialog>
    <!-- 站房总览，当日告警统计，当日告警分类统计点击 -->
    <home-region-dialog ref="dialog"></home-region-dialog>
    <!-- 设备启动点击 -->
    <home-device-status-dialog ref="deviceDialog" :modelkind="modelkind"></home-device-status-dialog>
    <!-- 地图设备离线在线率弹框 -->
    <home-on-off-line-dialog ref="onofflineDialog" :rate-type="rateType"></home-on-off-line-dialog>
  </div>
</template>
 
<script>
import Display from "common/display/Display";
import DisplayMap from "common/display/DisplayMap";
import DisplayHomeBottom from "common/display/DisplayHomeBottom";
import HomeRegionDialog from "content/dialog/HomeRegionDialog";
import HomeDeviceStatusDialog from "content/dialog/HomeDeviceStatusDialog";
import HomeCaptureDialog from "content/dialog/HomeCaptureDialog";
import HomeOnOffLineDialog from "content/dialog/HomeOnOffLineDialog";
import Demo1 from "./child/Demo1";
import Demo2 from "./child/Demo2";
import Demo3 from "./child/Demo3";
import Demo4 from "./child/Demo4";
import Demo5 from "./child/Demo5";
import Demo6 from "./child/Demo6";
import Demo7 from "./child/Demo7";
import Demo8 from "./child/Demo8";
import { mapState } from 'vuex';
import { getSocket } from 'utils/socket'

export default {
  name: "Home",
  data () {
    return {
      dialogVisible: false,
      img: "",
      title: "",
      modelkind: "",
      rateType: "",

    };
  },
  components: {
    Display,
    DisplayMap,
    DisplayHomeBottom,
    HomeRegionDialog,
    HomeDeviceStatusDialog,
    HomeCaptureDialog,
    HomeOnOffLineDialog,
    Demo1,
    Demo2,
    Demo3,
    Demo4,
    Demo5,
    Demo6,
    Demo7,
    Demo8,
  },
  computed: {
    ...mapState(["mapregionid"]),
  },
  watch: {
    // 地图区域id变化更新全部页面数据
    mapregionid (val) {
      this.updateAll();
    }
  },
  methods: {
    // 实时告警传过来及时刷新，加上防抖
    updateMsg: _.debounce(function () {
      this.$refs.demo1.getData();
      this.$refs.demo4.initChart();
      this.$refs.demo7.initChart();
      this.$refs.demo6.initChart();
      this.$refs.demo8.getNum();
    }, 1000),
    // 点击地图更新
    updateAll: _.debounce(function () {
      this.$refs.demo1.getData();
      this.$refs.demo2.initChart('regiontype');
      this.$refs.demo3.getData();
      this.$refs.demo4.updateAll();
      this.$refs.demo5.initChart("modelkind");
      this.$refs.demo6.initChart();
      this.$refs.demo7.initChart();
      this.$refs.demo8.getNum();
    }, 200),
    previewImg (row) {
      this.dialogVisible = true;
      this.img = row.img;
      this.title = row.regionidname + "---" + row.sensoridname;
    },
    // 站房详情对话框
    getDetail () {
      this.$refs.dialog.visual = true;
    },
    // 历史抓图对话框
    getCaptureDetail () {
      this.$refs.capturedialog.visual = true;
    },
    // 设备启动状态对话框
    openDeviceDialog (type) {
      this.modelkind = type;
      this.$refs.deviceDialog.visual = true;
    },
    // 在线/离线设备详情弹框
    openOnOffLineDialog (type) {
      this.rateType = type;
      this.$refs.onofflineDialog.visual = true;
    },
    // socket接收msg
    getMsg (msg) {
      if (msg !== "连接成功") {
        const res = JSON.parse(msg);
        if (res.topic === "webserver/reportevent/") {
          this.$bus.$emit('changeEvent',res.data)
          if (this.$refs.demo4) {
            this.$refs.demo4.changeEvent(res.data);
            this.updateMsg();
          }
        } else if (res.topic === "webserver/cameracapture/") {
          if (this.$refs.demo3) {
            this.$refs.demo3.getMsg(res.data);
          }
        }
      }
    },
  },
  created () {
    getSocket(JSON.stringify({ type: 'client' }), this.getMsg);
  }
};
</script>
 
<style lang='scss' scoped>
.home {
  width: 100%;
  height: 100%;
}
</style>