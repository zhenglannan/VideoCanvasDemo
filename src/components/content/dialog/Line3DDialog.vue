<template>
  <!-- <el-dialog
    :visible.sync="visual"
    width="100%"
    :modal-append-to-body="false"
    :before-close="handleClose"
    @opened="showDialog"
  > -->
  <el-dialog
    :visible.sync="visual"
    width="54%"
    :modal-append-to-body="false"
    :before-close="handleClose"
    @opened="showDialog"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="实时信息" name="first">
        <div id="line2D" style="width:100%;height:600px"></div>
      </el-tab-pane>
      <el-tab-pane label="3维历史数据" name="second">
        <el-date-picker
          v-model="startTime"
          type="datetime"
          placeholder="选择起始时间"
          default-time="00:00:00"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
        <el-date-picker
          v-model="endTime"
          type="datetime"
          placeholder="选择结束时间"
          default-time="00:00:00"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
        <el-button
          icon="el-icon-search"
          type="primary"
          circle
          style="margin-left: 11px;"
          @click="search"
        ></el-button>
        <div id="line3D" style="width:100%;height:600px"></div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
 
<script>
import { formateDate } from 'utils/index'
import { getThreeDdata, getGisRealData } from 'network/envmonitor'

export default {
  name: 'Line3DDialog',
  props: {
    sensorid: String
  },
  data () {
    return {
      visual: false,
      activeName: "first",

      dom1: null,
      dom2: null,
      line3dData: [],
      line2dData: [],

      startTime: formateDate(new Date(new Date().toLocaleDateString())),
      endTime: formateDate(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000),

      testData: []
    };
  },
  watch: {
    activeName (val) {
      this.$nextTick(() => {
        val === 'first' ? this.dom1.resize() : this.dom2.resize()
      })
    }
  },
  methods: {
    handleClose (done) {
      clearTimeout(this.timer);
      done()
    },
    search () {
      getThreeDdata(this.sensorid, this.startTime, this.endTime).then(res => {
        this.initChart(res.data);
      })
    },
    // 请求实时数据
    getRealData () {
      clearTimeout(this.timer);
      getGisRealData(this.sensorid).then(res => {
        this.initChartRealData(res.data);
      })
      this.timer = setTimeout(() => {
        this.getRealData();
      }, 5000);
    },
    // todo 打开结束后的回调 获取实时数据
    showDialog () {
      this.activeName = "first";
      if (!this.dom1) {
        this.dom1 = this.$echarts.init(document.getElementById("line2D"));
        this.dom2 = this.$echarts.init(document.getElementById("line3D"));
      } else {
        this.dom1.clear();
        this.dom2.clear();
      }
      this.getRealData();
    },
    //2d渲染
    initChartRealData (arr) {
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          textStyle: {
            color: "#D4ECFF"
          },
        },
        xAxis: [{
          type: "category",
          // axisTick: { show: false },
          axisLabel: {
            color: "#fff",
          },
          triggerEvent: true
        },],
        yAxis: [{
          type: 'value',
          minInterval: "1",
          axisLabel: {
            color: "#fff",
          },
          inverse: true,
          splitLine: {
            show: true,
            lineStyle: {
              color: '#192a44'
            },
          },
          axisLine: {
            show: true,
          },
        }],
        dataset: {
          // source: this.testData
          source: arr
        },
        series: {
          type: "line",
          smooth: 0.6,
          symbol: 'none',
        },
      };
      this.dom1.setOption(option);
    },
    // 3d渲染
    initChart (data) {
      let option = {
        tooltip: {},
        backgroundColor: 'transpranet',
        visualMap: {
          show: false,
          dimension: 2,
          min: -80,
          max: 0,
          inRange: {
            color: [
              '#313695',
              '#4575b4',
              '#74add1',
              '#abd9e9',
              '#e0f3f8',
              '#ffffbf',
              '#fee090',
              '#fdae61',
              '#f46d43',
              '#d73027',
              '#a50026'
            ]
          }
        },
        xAxis3D: {
          type: 'value',
          scale: true,
          name: "相位"
        },
        yAxis3D: {
          type: 'category',
          name: "时间",
          nameGap: 40
        },
        zAxis3D: {
          type: 'value',
          scale: true,
          name: "图谱值"
        },
        grid3D: {
          viewControl: {
            projection: 'orthographic',
          },
          axisLine: {
            lineStyle: {
              color: '#fff',
            }
          },
          axisLabel: {
            color: '#fff'
          },
          axisPointer: {
            lineStyle: {
              color: 'red',
            }
          }
        },
        series: [
          {
            type: 'surface',
            wireframe: {
              // show: false
            },
            shading: 'lambert',
            data: data
            // data: [
            //   [1, '2021-09-24 7:10:30', 0], [2, '2021-09-24 7:10:30', 0], [3, '2021-09-24 7:10:30', 0], [4, '2021-09-24 7:10:30', 0], [5, '2021-09-24 7:10:30', 0],
            //   [1, '2021-09-25 8:10:30', 0], [2, '2021-09-25 8:10:30', 30], [3, '2021-09-25 8:10:30', 0], [4, '2021-09-25 8:10:30', 1], [5, '2021-09-25 8:10:30', 0],
            //   [1, '2021-09-26 9:10:30', 0], [2, '2021-09-26 9:10:30', 0], [3, '2021-09-26 9:10:30', 0], [4, '2021-09-26 9:10:30', 0], [5, '2021-09-26 9:10:30', 0],
            //   [1, '2021-09-27 10:10:30', 0], [2, '2021-09-27 10:10:30', 1], [3, '2021-09-27 10:10:30', 0], [4, '2021-09-27 10:10:30', 20], [5, '2021-09-27 10:10:30', 0],
            //   [1, '2021-09-28 11:10:30', 0], [2, '2021-09-28 11:10:30', 0], [3, '2021-09-28 11:10:30', 0], [4, '2021-09-28 11:10:30', 0], [5, '2021-09-28 11:10:30', 0]
            // ]
          }
        ]
      };
      this.dom2.setOption(option);
    }
  },
  beforeDestroy () {
    if (this.dom1) {
      this.dom1.dispose();
      this.dom2.dispose();
    }
    clearTimeout(this.timer)
  },
  // created () {
  //   this.$axios("json/bar.json").then(res => {
  //     this.testData = res.data.data;
  //   })
  // }
}
</script>
 
<style lang='scss' scoped>
</style>