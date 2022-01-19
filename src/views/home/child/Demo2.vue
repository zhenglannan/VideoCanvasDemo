<template>
  <div class="main2">
    <div style=" padding-top: 11px;padding-left: 26px;">
      <el-button @click="initChart('regiontype')" :class="{active:type=='regiontype'}">功能</el-button>
      <el-button @click="initChart('parentregion')" :class="{active:type=='parentregion'}">区域</el-button>
      <el-button
        @click="initChart('voltagelevel')"
        :class="{active:type=='voltagelevel'}"
        class="voltagelevelBtn"
      >电压等级</el-button>
    </div>
    <div id="demo1" class="chart1"></div>
  </div>
</template>
 
<script>
import { getStationType } from 'network/home';
export default {
  name: 'Demo2',
  data () {
    return {
      type: '',
      dom: null,
      option: '',
      typeTimer: null,
      index: 0
    };
  },
  methods: {
    initChart (type) {
      this.type = type;
      if (type == "regiontype") {
        this.index = 0;
      } else if (type == "parentregion") {
        this.index = 1;
      } else {
        this.index = 2;
      }
      // this.dom.showLoading();
      getStationType(type).then(res => {
        // this.dom.hideLoading();
        var arr = res.data;

        this.option = {
          legend: {
            orient: 'vertical',
            type: 'scroll',
            icon: "circle",
            right: '6%',
            top: '10%',
            itemGap: 10,
            itemWidth: 16,
            formatter: function (name) {
              var total = 0;
              var target;
              for (let i = 0, l = arr.length; i < l; i++) {
                total += arr[i].value;
                if (arr[i].name == name) {
                  target = arr[i].value;
                }
              }
              var arr2 = [
                '{a|' + name + '}',
                '{b|' + target + '}',
                '{c|' + ((target / total) * 100 || 0).toFixed(2) + '%}',
              ]
              return arr2.join('')
            },
            textStyle: {
              rich: {
                a: {
                  fontSize: 12,
                  align: 'left',
                  width: 70,
                  // padding: [0, 0, 0, 10],
                  color: "#D4ECFF"
                },
                b: {
                  fontSize: 12,
                  align: 'left',
                  width: 40,
                  // padding: [0, 0, 0, 10],
                  color: "#D4ECFF"
                },
                c: {
                  fontSize: 12,
                  align: 'right',
                  width: 40,
                  // padding: [0, 0, 0, 30],
                  color: "#75B1F7"
                }
              }
            },
          },
          tooltip: {},
          // todo不能用映射，颜色要不一样
          // visualMap: {
          //   show: false,
          //   min: 1,
          //   max: 50,
          //   inRange: {
          //     color: ["#FFCD5E", "#FDFC93","#41B379","#3A92FF","#45BAFF"]
          //   }
          // },
          series: [{
            type: 'pie',
            center: ['27%', '46%'],
            // radius: 70,
            radius: [30, 70],
            data: arr.sort(function (a, b) { return b.value - a.value; }),//降序
            roseType: 'radius',
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function () {
              return Math.random() * 200;
            },
            emptyCircleStyle: {
              // 将样式改为空心圆
              color: 'transparent',
              borderColor: '#ddd',
              borderWidth: 1
            },
            // hoverAnimation: true, //鼠标移入变大
            label: {
              show: false,
              position: "center",
              color: "#fff",
            },
            emphasis: {
              label: {
                show: true,
                fontWeight: "bold",
                formatter: ["{a|{c}}", "{b|{b}}"].join("\n"),
                rich: {
                  a: {
                    color: "#0AE79A",
                    fontSize: 22,
                    lineHeight: 22,
                    verticalAlign: "bottom",
                  },
                  b: {
                    color: "#fff",
                    fontSize: "60%",
                    lineHeight: 24,
                  }
                }
              }
            },
            //todo
            itemStyle: {
              color: function (params) {
                var colorList = [
                  '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                  '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                  '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                ];
                return colorList[params.dataIndex]
              }
            }
          }],
        };
        this.dom.setOption(this.option);
        // 循环高亮
        this.pieActive(-1);
        // 鼠标划出
        this.dom.on('mouseout', (params) => {
          this.pieActive(params.dataIndex)
        });
      });
    },
    pieActive (dataIndex) {
      let index = dataIndex; //高亮所在下标
      let dataLength = this.option.series[0].data.length;   // 当前饼图有多少个扇形
      clearInterval(this.mTime);
      // 用定时器控制饼图高亮
      this.mTime = setInterval(() => {
        // 清除之前的高亮
        this.dom.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: index
        })
        index = (index + 1) % dataLength;//余数
        // 当前下标高亮
        this.dom.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: index
        })
        if (index > dataLength) {
          index = 0
        }
      }, 1000);
      // 鼠标划入
      this.dom.on('mouseover', (params) => {
        // console.log(params);
        // 停止定时器，清除之前的高亮
        clearInterval(this.mTime)
        this.dom.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: index
        })
      })
    }
  },
  mounted () {
    this.dom = this.$echarts.init(document.getElementById("demo1"));
    this.initChart('regiontype');
    let arr = ["regiontype", "parentregion", "voltagelevel"];
    this.typeTimer = setInterval(() => {
      this.index = (this.index + 1) % arr.length;//余数
      if (this.indexindex > arr.length) {
        this.indexindex = 0;
      }
      this.initChart(arr[this.index]);
    }, 10000);
  },
  beforeDestroy () {
    if (this.typeTimer) {
      clearInterval(this.typeTimer);
      clearInterval(this.mTime);
    }
    if(this.dom){
      this.dom.dispose();
    }
  },
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
    border: none;
  }
}
.chart1 {
  width: 100%;
  height: 100%;
}
.el-button {
  width: 60px;
  height: 28px;
  background: transparent; //!
  padding: 0;
  border: 1px solid #428af7;
  color: #fff;
}
.voltagelevelBtn {
  width: 80px;
}
</style>
<style>
/* .main2 .el-button.is-plain:active{
  background: transparent !important;
} */
</style>