<template>
  <div class="main2">
    <!-- <div style=" padding-top: 11px;padding-left: 26px;">
      <el-button
        type="primary"
        plain
        @click="initChart('alarmtype')"
        :class="{active:type=='alarmtype'}"
        class="alarmtypeBtn"
      >告警分类</el-button>
      <el-button
        type="primary"
        plain
        @click="initChart('regiontype')"
        :class="{active:type=='regiontype'}"
      >区域</el-button>
    </div>-->
    <div id="demo6" class="chart6"></div>
  </div>
</template>
 
<script>
// import { getSameDayAlarm } from 'network/home';
import { getSameDayAlarmLine } from 'network/home';
export default {
  name: 'Demo6',
  data () {
    return {
      // type: '',
      dom: null,
      testData: [
        {
          "name": "环境",
          "value": 2
        },
        {
          "name": "安防",
          "value": 5
        },
        {
          "name": "消防",
          "value": 7
        },
        {
          "name": "一般",
          "value": 3
        }
      ]
    };
  },
  methods: {
    initChart () {
      // this.type = type;
      getSameDayAlarmLine().then(res => {
        var arr = res.data;
        var series = [];
        for (let i = 1,len= arr[0].length; i < len; i++) {
          series.push({
            type: "line",
            smooth: 0.6,
            symbol: 'none',
          })
        }
        // var arr = this.testData;
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
            // bottom: "7%"
          },
          xAxis: [{
            type: "category",
            axisTick: { show: false },
            axisLabel: {
              color: "#fff",
            },
            triggerEvent: true
          },],
          yAxis: [{ type: 'value', minInterval: "1" ,axisLabel: {
              color: "#fff",
            },}],
          dataset: {
            source: arr
          },
          series: series,
        };
        this.dom.setOption(option);
      });
    },
  },
  mounted () {
    this.dom = this.$echarts.init(document.getElementById("demo6"));
    this.initChart();
  },
  beforeDestroy () {
    if (this.dom) {
      this.dom.dispose();
    }
  }
}
</script>
 
<style lang='scss' scoped>
.main2 {
  overflow: hidden;
  left: 0;
  right: 0;
  margin: auto;
  height: 100%;
  display: flex;
  flex-flow: column;
  & > div:first-child {
    height: 50px;
  }
  & > div:last-child {
    flex: 1;
  }
  .active {
    background: linear-gradient(180deg, #328df4 0%, #1247b6 100%);
    // border-color: #3a8ee6;
    color: #c2d1ff;
    outline: none;
  }
}
.chart6 {
  width: 100%;
  height: 100%;
}
.el-button {
  width: 60px;
  height: 28px;
  background: transparent;
  padding: 0;
  border-color: #428af7;
  color: #428af7;
}
.alarmtypeBtn {
  width: 80px;
}
</style>