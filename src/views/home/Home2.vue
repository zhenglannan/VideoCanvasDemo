<template>
  <div class="home">
    <div id="mapContainer"></div>
    <!-- 区域 -->
    <div class="regionListTree">
      <region-tree></region-tree>
    </div>
    <div class="infoPaneWrapper">
      <div class="infoPane">
        <p>运行状态</p>
        <div id="info1"></div>
      </div>
      <div class="infoPane">
        <p>设备状态</p>
        <div id="info2"></div>
      </div>
      <div class="infoPane">
        <p>设备告警</p>
        <div id="info3"></div>
      </div>
      <div class="infoPane">
        <p>设备数量</p>
        <div id="info4"></div>
      </div>
    </div>
  </div>
</template>
 
<script>
import RegionTree from "content/regiontree/RegionTree";
import { getRegionTree } from 'network/home'

export default {
  name: 'Home',
  data () {
    return {
      dom1: null,
      infoData: [{
        name: '已投运',
        value: 10
      }, {
        name: '建设中',
        value: 50
      }],
      infoData2: [{
        name: '离线',
        value: 10
      }, {
        name: '在线',
        value: 40
      }],
      infoData3: [{
        name: '消防告警',
        value: 10
      }, {
        name: '人员告警',
        value: 0
      }, {
        name: '设备异常',
        value: 20
      }, {
        name: '实时告警',
        value: 15
      }],
      infoData4: [{
        name: '安防设备',
        value: 10
      }, {
        name: '消防设备',
        value: 40
      }, {
        name: '监测设备',
        value: 30
      }, {
        name: '环境设备',
        value: 50
      },],
    };
  },
  components: {
    RegionTree
  },
  methods: {
    initMap (options) {
      var map = new BMapGL.Map('mapContainer', {
        enableBizAuthLogo: false
      });
      map.centerAndZoom(new BMapGL.Point(options.center[0], options.center[1]), 18);// 初始化地图，设置中心点坐标和地图级别 
      // map.centerAndZoom("南京市", 12);//?无法加载 
      map.enableKeyboard();
      map.enableScrollWheelZoom(true);
      map.enableInertialDragging();
      map.enableContinuousZoom();
      map.setTilt(60); //设置地图的倾斜角度
      map.setHeading(0);//设置地图旋转角度
      map.setMapStyleV2({
        styleId: '619ab1d19d7c51182354c0d12cd56982'
      });
      return map
    },
    init () {
      // getData().then(res => {
        // 1.创建地图实例
        var map = this.initMap({
          center: [118.751695, 31.945166]
        });
        // 2. 创建MapVGL图层管理器
        var view = new mapvgl.View({
          map: map
        });
        view.startAnimation();
        // 3. 创建可视化图层，并添加到图层管理器中
        var lineLayer = new mapvgl.LineLayer({
          width: 30,
          color: '#dbcffd',
          style: 'road',
          enablePicked: true,
          onClick: e => {
            this.$router.push("/envMonitor");
            // console.log(e);
          }
        });
        view.addLayer(lineLayer);
        // 4. 准备好规范化坐标数据
        // var data = [{
        //   geometry: {
        //     type: 'Point',
        //     coordinates: [116.403748, 39.915055]
        //   }
        // }];
        var data = [
          {
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  118.750773,
                  31.944837
                ],
                [
                  118.750656,
                  31.947143
                ],
                [
                  118.752071,
                  31.948464
                ],
                [
                  118.752071,
                  31.949464
                ]
              ]
            }
          }
        ];

        // 5. 关联图层与数据，享受震撼的可视化效果
        lineLayer.setData(data);

      // })


      // var scaleCtrl = new BMapGL.ScaleControl();  // 添加比例尺控件
      // map.addControl(scaleCtrl);
      // var zoomCtrl = new BMapGL.ZoomControl({ anchor: BMAP_ANCHOR_TOP_LEFT });  // 添加缩放控件
      // map.addControl(zoomCtrl);
      // var point = new BMapGL.Point(118.767413, 32.041544);
      // var point2 = new BMapGL.Point(118.767413, 31.041543);
      // var point3 = new BMapGL.Point(118.767412, 32.041541);
      // var point4 = new BMapGL.Point(118.767414, 32.041542);
      // // var myIcon = new BMapGL.Icon("~/icons/svg/站房.svg", new BMapGL.Size(23, 25), {
      // //   anchor: new BMapGL.Size(10, 25),
      // // });
      // // var marker = new BMapGL.Marker(point, { icon:myIcon});        // 创建标注   
      // var marker = new BMapGL.Marker(point);        // 创建标注   
      // var marker2 = new BMapGL.Marker(point2);        // 创建标注   
      // var marker3 = new BMapGL.Marker(point3);        // 创建标注   
      // var marker4 = new BMapGL.Marker(point4);        // 创建标注   
      // map.addOverlay(marker);
      // map.addOverlay(marker2);
      // map.addOverlay(marker3);
      // map.addOverlay(marker4);
      // marker.addEventListener("click", function () {
      //   map.openInfoWindow(infoWindow, point);        // 打开信息窗口
      // });
      // marker2.addEventListener("click", function () {
      //   map.openInfoWindow(infoWindow, point2);        // 打开信息窗口
      // });
      // marker3.addEventListener("click", function () {
      //   map.openInfoWindow(infoWindow, point3);        // 打开信息窗口
      // });
      // marker4.addEventListener("click", function () {
      //   map.openInfoWindow(infoWindow, point4);        // 打开信息窗口
      // });
      // var opts = {
      //   width: 250,     // 信息窗口宽度
      //   height: 100,    // 信息窗口高度
      //   title: "故宫博物院",// 信息窗口标题
      // }
      // var infoWindow = new BMapGL.InfoWindow("地址：北京市东城区王府井大街88号乐天银泰百货八层", opts);  // 创建信息窗口对象
      // this.$axios.get('/map.json').then(res => {
      //   map.setMapStyleV2({ styleJson: res.data });
      // })
    },
    initChart () {
      let _this = this;
      // let color = [ // 颜色
      //   ['#6fc1fb', '#1971e7'],
      //   ['#983fff', '#2c23ff'],
      // ];
      let color = ['#6fc1fb', '#2c23ff'];
      let color2 = ['#f969be', '#37d8ff'];
      let sum1 = this.infoData.reduce((pre, n) => pre + n.value, 0);
      let sum2 = this.infoData2.reduce((pre, n) => pre + n.value, 0);
      let series1 = [];
      let series2 = [];
      for (let i = 0; i < this.infoData.length; i++) {
        series1.push({
          type: 'pie',
          name: this.infoData[i].name,
          center: ['30%', '45%'],
          radius: [60 - i * 30 + '%', 80 - i * 30 + '%'], // 圆环
          data: [{
            value: this.infoData[i].value,
            itemStyle: {
              // color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [{
              //   offset: 0,
              //   color: color[i][0]
              // }, {
              //   offset: 1,
              //   color: color[i][1]
              // }])
              color: color[i]
            }
          },
          {
            value: sum1 - this.infoData[i].value,
            itemStyle: {
              color: 'rgba(35, 55, 146,.5)'
              // color: 'transparent'
            },
            // tooltip: { // 不显示提示框
            //   show: false
            // },
          }
          ],
          label: {
            show: false,
            position: "center",
            color: "#fff",
            formatter: "{b|{d}%}",
            // formatter: "{b|{c}}",
            rich: {
              b: {
                color: "#fff",
                fontSize: "60%",
                lineHeight: 24,
              }
            }
          },
          emphasis: {
            label: {
              show: true,
              fontWeight: "bold",
              formatter: ["{b|{d}}"],
              rich: {
                b: {
                  color: "#fff",
                  fontSize: "60%",
                  lineHeight: 24,
                }
              }
            }
          },
        });
      }
      for (let i = 0; i < this.infoData2.length; i++) {
        series2.push({
          type: 'pie',
          name: this.infoData2[i].name,
          center: ['30%', '45%'],
          radius: [60 - i * 30 + '%', 80 - i * 30 + '%'], // 圆环
          data: [{
            value: this.infoData2[i].value,
            itemStyle: {
              // color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [{
              //   offset: 0,
              //   color: color[i][0]
              // }, {
              //   offset: 1,
              //   color: color[i][1]
              // }])
              color: color2[i]
            }
          },
          {
            value: sum2 - this.infoData2[i].value,
            itemStyle: {
              color: 'rgba(35, 55, 146,.5)'
              // color: 'transparent'
            },
            // tooltip: { // 不显示提示框
            //   show: false
            // },
          }
          ],
          label: {
            show: false,
            position: "center",
            color: "#fff",
            formatter: "{b|{d}%}",
            // formatter: "{b|{c}}",
            rich: {
              b: {
                color: "#fff",
                fontSize: "60%",
                lineHeight: 24,
              }
            }
          },
          emphasis: {
            label: {
              show: true,
              fontWeight: "bold",
              formatter: ["{b|{d}}"],
              rich: {
                b: {
                  color: "#fff",
                  fontSize: "60%",
                  lineHeight: 24,
                }
              }
            }
          },
        });
      }
      let option1 = {
        color: ['#6fc1fb', '#2c23ff'],//必须手动设置color数组，legend才会跟系列保持一致
        legend: {
          orient: 'vertical',
          type: 'scroll',
          icon: "circle",
          right: '6%',
          top: '20%',
          itemGap: 10,
          itemWidth: 16,
          // 手动设置data;每个legend代表一个series
          data: this.infoData.map(i => i.name),
          formatter: function (name) {
            var target = _this.infoData.find(item => item.name == name).value;
            // for (var i = 0, l = _this.infoData.length; i < l; i++) {
            //   if (_this.infoData[i].name == name) {
            //     target = _this.infoData[i].value;
            //   }
            // }

            var arr2 = [
              '{a|' + name + '}',
              '{b|(' + target + ')}',
            ];
            return arr2.join('')
          },
          textStyle: {
            rich: {
              a: {
                fontSize: 12,
                align: 'left',
                width: 70,
                color: "#D4ECFF"
              },
              b: {
                fontSize: 12,
                align: 'left',
                width: 40,
                color: "#D4ECFF"
              },
            }
          },
        },
        series: series1,
      };
      let option2 = {
        color: ['#f969be', '#37d8ff'],//必须手动设置color数组，legend才会跟系列保持一致
        legend: {
          orient: 'vertical',
          type: 'scroll',
          icon: "circle",
          right: '6%',
          top: '20%',
          itemGap: 10,
          itemWidth: 16,
          // 手动设置data;每个legend代表一个series
          data: this.infoData2.map(i => i.name),
          formatter: function (name) {
            var target = _this.infoData2.find(item => item.name == name).value;
            // for (var i = 0, l = _this.infoData.length; i < l; i++) {
            //   if (_this.infoData[i].name == name) {
            //     target = _this.infoData[i].value;
            //   }
            // }
            var arr2 = [
              '{a|' + name + '}',
              '{b|(' + target + ')}',
            ];
            return arr2.join('')
          },
          textStyle: {
            rich: {
              a: {
                fontSize: 12,
                align: 'left',
                width: 70,
                color: "#D4ECFF"
              },
              b: {
                fontSize: 12,
                align: 'left',
                width: 40,
                color: "#D4ECFF"
              },
            }
          },
        },
        series: series2,
      };
      let option3 = {
        legend: {
          orient: 'vertical',
          type: 'scroll',
          icon: "circle",
          right: '6%',
          top: '20%',
          itemGap: 10,
          itemWidth: 16,
          formatter: function (name) {
            var target = _this.infoData3.find(item => item.name == name).value;
            var arr2 = [
              '{a|' + name + '}',
              '{b|(' + target + ')}',
            ];
            return arr2.join('')
          },
          textStyle: {
            rich: {
              a: {
                fontSize: 12,
                align: 'left',
                width: 70,
                color: "#D4ECFF"
              },
              b: {
                fontSize: 12,
                align: 'left',
                width: 40,
                color: "#D4ECFF"
              },
            }
          },
        },
        tooltip: {},
        series: [{
          type: 'pie',
          center: ['25%', '50%'],
          radius: [40, 50],
          data: this.infoData3.sort(function (a, b) { return b.value - a.value; }),//降序
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
                '#F4E001', '#F0805A', '#26C0C0',
                '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                '#D7504B', '#C6E579',
              ];
              return colorList[params.dataIndex]
            }
          }
        }],
      }
      let option4 = {
        legend: {
          orient: 'vertical',
          type: 'scroll',
          icon: "circle",
          right: '6%',
          top: '20%',
          itemGap: 10,
          itemWidth: 16,
          formatter: function (name) {
            var target = _this.infoData4.find(item => item.name == name).value;
            var arr2 = [
              '{a|' + name + '}',
              '{b|(' + target + ')}',
            ];
            return arr2.join('')
          },
          textStyle: {
            rich: {
              a: {
                fontSize: 12,
                align: 'left',
                width: 70,
                color: "#D4ECFF"
              },
              b: {
                fontSize: 12,
                align: 'left',
                width: 40,
                color: "#D4ECFF"
              },
            }
          },
        },
        tooltip: {},
        series: [{
          type: 'pie',
          center: ['25%', '50%'],
          radius: [40, 50],
          data: this.infoData4.sort(function (a, b) { return b.value - a.value; }),//降序
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
                '#E87C25', '#27727B',
                '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
              ];
              return colorList[params.dataIndex]
            }
          }
        }],
      }
      this.dom1.setOption(option1);
      this.dom2.setOption(option2);
      this.dom3.setOption(option3);
      this.dom4.setOption(option4);
    }
  },
  mounted () {
    // 初始化地图
    this.init();
    this.dom1 = this.$echarts.init(document.getElementById("info1"));
    this.dom2 = this.$echarts.init(document.getElementById("info2"));
    this.dom3 = this.$echarts.init(document.getElementById("info3"));
    this.dom4 = this.$echarts.init(document.getElementById("info4"));
    this.initChart();
  },
  created () {
    if (!this.$store.state.treeData) {
      getRegionTree().then(res => {
        this.$store.commit("SET_TREEDATA", res.data);
      })
    }
  }
}
</script>
 
<style lang='scss' scoped>
.home {
  width: 100%;
  height: 100%;
  position: relative;
  .infoPaneWrapper {
    position: absolute;
    top: 0px;
    left: 292px;
    width: 85%;
    height: 20%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .regionListTree {
    width: 296px;
    height: 100%;
    background: #3151c599;
    position: absolute;
    top: 0;
    z-index: 999;
  }
  #mapContainer {
    width: 100%;
    height: 100%;
    // z-index: 999;
  }
  .infoPane {
    width: 300px;
    height: 165px;
    // position: absolute;
    // top: 18px;
    // left: 48px;
    background: url("~assets/image/home/maoInfoBg3.png") center/100% 100%;
    // background: red;
    color: #befdfe;
    padding: 14px 16px;
    z-index: 1000;
    #info1,
    #info2,
    #info3,
    #info4 {
      width: 100%;
      height: calc(100% - 10px);
    }
    p {
      font-size: 13px;
      font-weight: 600;
    }
    i {
      margin-left: 63px;
      cursor: pointer;
    }
    ul {
      padding: 4px;
      li {
        padding: 5px;
        font-size: 12px;
        div {
          position: relative;
          & > span:first-child {
            display: inline-block;
            width: calc(100% - 10px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          & > span:last-child {
            right: 0;
            position: absolute;
          }
        }
      }
    }
  }
}
</style>
<style>
.home .el-tree {
  height: calc(100% - 66px);
}
</style>