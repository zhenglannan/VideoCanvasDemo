<template>
  <div class="main2">
    <div style=" padding-top: 11px;padding-left: 26px;">
      <el-button
        @click="initChart('modelkind')"
        :class="{active:type=='modelkind'}"
        class="alarmtypeBtn"
      >设备分类</el-button>
      <el-button
        @click="initChart('monitortype')"
        :class="{active:type=='monitortype'}"
        class="alarmtypeBtn"
      >监测类型</el-button>
    </div>
    <div id="demo5" class="chart5"></div>
  </div>
</template>
 
<script>
import { getSensorTypeEcharts } from 'network/home';
export default {
  name: 'Demo5',
  data () {
    return {
      type: '',
      dom: null,
      option: "",
      typeTimer: null,
      index: 0,
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
    initChart (type) {
      this.type = type;
      if (type == "modelkind") {
        this.index = 0;
      } else if (type == "monitortype") {
        this.index = 1;
      }
      getSensorTypeEcharts(type).then(res => {
        var arr = res.data;
        // var arr = this.testData;
        this.option = {
          legend: {
            orient: 'vertical',
            type: 'scroll',
            icon: "circle",
            itemWidth: 16,
            itemGap: 10,
            right: '4%',
            top: '10%',
            formatter: (name) => {
              let total = 0;
              let target;
              for (let i = 0, l = arr.length; i < l; i++) {
                total += arr[i].value;
                if (arr[i].name === name) {
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
                  // verticalAlign: 'right',
                  fontSize: 12,
                  align: 'left',
                  // padding:[0,28,0,0],
                  // *只能定宽对齐
                  width: type == "modelkind" ? 130 : 100,
                  color: "#D4ECFF"
                },
                b: {
                  fontSize: 12,
                  align: 'left',
                  // padding:[0,28,0,0],
                  width: 40,
                  color: "#D4ECFF"
                },
                c: {
                  fontSize: 12,
                  align: 'left',
                  width: 40,
                  color: "#75B1F7"
                }
              }
            },
          },
          tooltip: {},
          series: [{
            type: 'pie',
            emptyCircleStyle: {
              // 将样式改为空心圆
              color: 'transparent',
              borderColor: '#ddd',
              borderWidth: 1
            },
            center: type == "modelkind" ? ['23%', '46%'] : ['26%', '46%'],
            radius: [40, 70],
            data: arr.sort(function (a, b) { return a.value - b.value; }),
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function () {
              return Math.random() * 200;
            },
            // hoverAnimation: true, //鼠标移入变大
            itemStyle: {
              // borderRadius: 5,
              // borderColor: '#fff',
              // borderWidth: 10
            },
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
            // !颜色库有局限性，要多少种颜色？颜色不够怎么办？颜色具体是哪些颜色？
            // itemStyle: {
            //   color: function (params) {
            //     var colorList = [
            //       '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
            //       '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
            //       '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0',
            //     ];
            //     return colorList[params.dataIndex]
            //   }
            // }
            // label: {
            //   formatter: [
            //     '{title|{b}}',
            //     '{rate|{d}%}',
            //   ].join('\n'),
            //   backgroundColor: "transparent",
            //   padding: [0, -45],

            //   rich: {
            //     title: {
            //       color: "#ffffff",
            //       fontSize: "12px",
            //       padding: [0, 0, 20, 0],
            //       color: 'inherit',
            //     },
            //     rate: {
            //       color: "#ffffff",
            //       fontSize: "17px",
            //       color: 'inherit',
            //     }
            //   }
            // },
            // labelLine: {
            //   length2: 60,
            // }
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
    this.dom = this.$echarts.init(document.getElementById("demo5"));
    this.initChart("modelkind");
    let arr = ["modelkind", "monitortype"];
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
.chart5 {
  width: 100%;
  height: 100%;
}
.el-button {
  width: 60px;
  height: 28px;
  background: transparent;
  padding: 0;
  border: 1px solid #428af7;
  color: #fff;
}
.alarmtypeBtn {
  width: 80px;
}
</style>