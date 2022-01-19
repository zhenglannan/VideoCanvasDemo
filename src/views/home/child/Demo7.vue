<template>
  <div class="main7">
    <div id="demo7" class="chart7"></div>
  </div>
</template>
 
<script>
import { getSensorBar } from 'network/home';
export default {
  name: 'Demo4',
  data () {
    return {
      dom: null,
      testData: []
    };
  },
  methods: {
    initChart () {
      getSensorBar().then(res => {
        var arr = res.data;
        // var arr = this.testData;
        var series = [];
        for (let i = 1, len = arr[0].length; i < len; i++) {
          // 两种类别不一样的渐变
          if (i == 1) {
            series.push({
              type: "bar",
              barWidth: 15,
              barGap: "50%",//柱子宽度的 30%
              emphasis: { focus: 'series' },
              itemStyle: {
                borderRadius: [5, 5, 0, 0],
                color: new this.$echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#45B6FF' },
                    { offset: 1, color: '#0F83DB' }
                  ]
                )
              }
            })
          } else {
            series.push({
              type: "bar",
              barWidth: 15,
              // barGap: 1,
              emphasis: { focus: 'series' },
              itemStyle: {
                borderRadius: [5, 5, 0, 0],
                color: new this.$echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#E3AE2C' },
                    { offset: 1, color: '#FC8B22' }
                  ]
                )
              }
            })
          }
        }
        // var axisLabel = {
        //   show: true,
        //   // color: "#4C679B"
        // }
        this.dom.setOption({
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
            //类目轴（category）默认情况下，类目轴对应到 dataset 第一列。
            type: "category",
            axisTick: { show: false },
            axisLabel: {
              color: "#fff",
            },
            triggerEvent: true
            // boundaryGap: false,
            // axisLabel: { rotate: 50, interval: 0 },
            // axisTick: {
            //   alignWithLabel: true//坐标轴刻度与标签对齐
            // }
          },],
          yAxis: [{ type: 'value', minInterval: "1" }],
          // 多个dataset
          dataset: {
            source: arr
          },
          //默认情况下，每个系列会自动对应到 dataset 的每一列。
          series: series,
        });

        this.dom.on("click", function (params) {
          if (params.componentType == "xAxis") {
            //!modelkind没有，怎么x轴绑定modelkind？
            // this.$emit("openDialog",modelkind)
            alert(params.value)
          }
        })

      });
    },
  },
  mounted () {
    this.dom = this.$echarts.init(document.getElementById("demo7"));
    this.initChart();
  },
  beforeDestroy () {
    if (this.dom) {
      this.dom.dispose();
    }
  }
};
</script>
 
<style lang='scss' scoped>
.main7 {
  overflow: hidden;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  height: 100%;
}
.chart7 {
  width: 100%;
  height: 100%;
}
</style>