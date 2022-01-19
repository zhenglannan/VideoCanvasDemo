<template>
  <div class="main8">
    <div id="container"></div>
    <div class="infoPane">
      <p>当日告警数TOP3</p>
      <ul>
        <!-- <li v-for="item in RegionControlNum" :key="item.id">{{item.name}}---{{item.size}}</li> -->
        <li v-for="item in regionControlNum" :key="item.id">
          <div>
            <span :title="item.name">{{item.name}}</span>
            <span>{{item.size}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="infoPane" style="top: 450px">
      <p>当日控制下发TOP3</p>
      <ul>
        <li v-for="item in regionAlarmNum" :key="item.id">
          <div>
            <span :title="item.name">{{item.name}}</span>
            <span>{{item.size}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="infoPane" style="top: 28px; left: 653px;width: 262px;">
      <p>
        站房设备在线率TOP3
        <i class="el-icon-more" @click="openDialog('online')"></i>
      </p>
      <ul>
        <li v-for="item in deviceOnlineRate" :key="item.id">
          <div>
            <span :title="item.name">{{item.name}}</span>
            <span>{{item.rate}}%</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="infoPane" style="top: 211px;left: 653px;width: 262px;">
      <p>
        站房设备离线率TOP3
        <i class="el-icon-more" @click="openDialog('offline')"></i>
      </p>
      <ul>
        <li v-for="item in deviceOfflineRate" :key="item.id">
          <div>
            <span :title="item.name">{{item.name}}</span>
            <span>{{item.rate}}%</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { getMapRegionNum, getRegionInfo, getRegionAlarmNum, getRegionControlNum, getSensorOnlineRate, getSensorOfflineRate, getOnOffLineSensor } from 'network/home'
export default {
  name: 'Demo8',
  data () {
    return {
      dom: null,
      mapData: null,

      regionControlNum: [],
      regionAlarmNum: [],
      deviceOnlineRate: [],
      deviceOfflineRate: [],

      objMap: null,

      LastTimeName: "浙江省",//todo提前定好省份
      LastTimeUrl: "",
      LastTimeMapId: "",
      TimeFn: null,
      returl: [],
      retname: [],
      retmapId: [],
      geoCoordMap: null
    };
  },
  methods: {
    // todo注释掉
    initialize () {
      var map = new BMapGL.Map('container', {
        enableBizAuthLogo: false
      });// 创建地图实例 
      // map.disableBizAuthLogo(); //关闭JSAPI商用授权挂件?
      // map.centerAndZoom(new BMapGL.Point(116.404, 39.915), 12);// 初始化地图，设置中心点坐标和地图级别 
      map.centerAndZoom("南京市", 12);// 初始化地图，设置中心点坐标和地图级别 
      map.enableScrollWheelZoom(true);
      // var scaleCtrl = new BMapGL.ScaleControl();  // 添加比例尺控件
      // map.addControl(scaleCtrl);
      // var zoomCtrl = new BMapGL.ZoomControl({ anchor: BMAP_ANCHOR_TOP_LEFT });  // 添加缩放控件
      // map.addControl(zoomCtrl);
      var point = new BMapGL.Point(118.767413, 32.041544);
      var point2 = new BMapGL.Point(118.767413, 31.041543);
      var point3 = new BMapGL.Point(118.767412, 32.041541);
      var point4 = new BMapGL.Point(118.767414, 32.041542);
      // var myIcon = new BMapGL.Icon("~/icons/svg/站房.svg", new BMapGL.Size(23, 25), {
      //   anchor: new BMapGL.Size(10, 25),
      // });
      // var marker = new BMapGL.Marker(point, { icon:myIcon});        // 创建标注   
      var marker = new BMapGL.Marker(point);        // 创建标注   
      var marker2 = new BMapGL.Marker(point2);        // 创建标注   
      var marker3 = new BMapGL.Marker(point3);        // 创建标注   
      var marker4 = new BMapGL.Marker(point4);        // 创建标注   
      map.addOverlay(marker);
      map.addOverlay(marker2);
      map.addOverlay(marker3);
      map.addOverlay(marker4);
      marker.addEventListener("click", function () {
        map.openInfoWindow(infoWindow, point);        // 打开信息窗口
      });
      marker2.addEventListener("click", function () {
        map.openInfoWindow(infoWindow, point2);        // 打开信息窗口
      });
      marker3.addEventListener("click", function () {
        map.openInfoWindow(infoWindow, point3);        // 打开信息窗口
      });
      marker4.addEventListener("click", function () {
        map.openInfoWindow(infoWindow, point4);        // 打开信息窗口
      });
      var opts = {
        width: 250,     // 信息窗口宽度
        height: 100,    // 信息窗口高度
        title: "故宫博物院",// 信息窗口标题
      }
      var infoWindow = new BMapGL.InfoWindow("地址：北京市东城区王府井大街88号乐天银泰百货八层", opts);  // 创建信息窗口对象
      this.$axios.get('/map.json').then(res => {
        map.setMapStyleV2({ styleJson: res.data });
      })
    },
    // 
    getData () {
      getMapRegionNum().then(res => {
        this.mapData = res.data;
        this.$nextTick(() => {
        this.$axios('static/config.json').then(res => {
          this.LastTimeName = res.data.mapName;
          this.LastTimeUrl = res.data.mapProvinceName;
          this.initChart();
        })
        })
      });
    },
    // 重新获取接口数据
    getMapData (regionid, option) {
      getMapRegionNum(regionid).then(res => {
        this.mapData = res.data;
        // console.log(option);
        option.series[0].data = this.convertData(this.mapData);
        option.series[1].data = this.convertData(this.mapData);
        option.series[2].data = this.convertData(this.mapData
          .sort(function (a, b) {
            return b.value - a.value;
          })
          .slice(0, 6));
        this.dom.setOption(option, true);//true重新绘制
      });
    },
    // 信息框数据
    getNum () {
      getRegionAlarmNum().then(res => {
        this.regionControlNum = res.data;
      });
      getRegionControlNum().then(res => {
        this.regionAlarmNum = res.data;
      });
      getSensorOnlineRate().then(res => {
        this.deviceOnlineRate = res.data;
      });
      getSensorOfflineRate().then(res => {
        this.deviceOfflineRate = res.data;
      });
    },
    // 拼接经纬度和value
    convertData (data) {
      // console.log(data);
      var res = [];
      for (var i = 0, len = data.length; i < len; i++) {
        var geoCoord = this.geoCoordMap[data[i].name];
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(...[data[i].value, data[i].regionid]),
            // value: geoCoord.push(data[i].value),
          });
        }
      }
      return res;
    },
    getMapJson (url) {
      // this.$axios(url).then(res => {
      //   return res.data;
      // })
      var RetJson;
      $.ajaxSettings.async = false;//在执行之前加$.ajaxSettings.async = false;  (同步执行)
      $.getJSON(url, function (date) {
        RetJson = date;
      });
      $.ajaxSettings.async = true;//执行你的代码之后及时恢复为$.ajaxSettings.async = true； （异步执行）
      return RetJson;
    },
    initChart () {
      this.$axios.get('json/map/'+this.LastTimeUrl+'.json').then(res => {
        let registerMapName = "zhejiang";
        this.$echarts.registerMap(registerMapName, res.data);
        // this.$echarts.registerMap("jiangsu", res.data);
        let option = {
          title: {
            top: 20,
            text: this.LastTimeName,
            left: "center",
            textStyle: {
              color: "#ccc",
            },
          },
          tooltip: {
            trigger: "item",
            showDelay: 0,
            transitionDuration: 0.2,
            formatter: function (params) {//!不知道里面是什么，就打印，不要猜
              if (params.data) {
                // 用于散点图获取数据
                if (params.data.value.length < 3) {//站房级只显示name
                  return params.name;
                }
                return params.name + " : " + params.data.value[2];
              } else {
                return params.name + " : 0";
              }
            },
          },
          label: {
            color: "#fff",
          },
          geo: {
            show: true,
            map: registerMapName,
            label: {
              show: false,
            },
            emphasis: {
              label: {
                show: false,
              },
              itemStyle: {
                areaColor: "#2B91B7",
              }
            },
            roam: true,
            itemStyle: {
              areaColor: "transparent",
              borderColor: "#3fdaff",
              borderWidth: 3,
              shadowColor: "rgba(255, 218, 255, .5)",
              shadowBlur: 10,
            },
          },
          series: [
            {
              name: "light",
              type: "scatter",
              coordinateSystem: "geo",
              data: this.convertData(this.mapData),
              symbolSize: function (val) {
                return val[2] / 1;//图元的大小
              },
              label: {
                formatter: "{b}",
                position: "right",
                show: true,
              },
              itemStyle: {
                color: "#F4E925",
              },
            },
            {
              type: "map",
              map: registerMapName,
              geoIndex: 0,
              aspectScale: 0.75, //长宽比
              showLegendSymbol: false, // 存在legend时显示
              selectedMode: false,//取消地图点击选中激活样式
              data: this.convertData(this.mapData),
              label: {
                show: false,
              },
              emphasis: {
                label: {
                  show: false,
                }
              },
              roam: true,
              animation: false,
            },
            {
              name: "Top 5",
              type: "effectScatter",
              coordinateSystem: "geo",
              data: this.convertData(
                this.mapData
                  .sort(function (a, b) {
                    return b.value - a.value;//降序，只显示前6个
                  })
                  .slice(0, 6)
              ),
              symbolSize: function (val) {
                return val[2] / 1;
              },
              showEffectOn: "render",
              rippleEffect: {
                brushType: "stroke",
              },
              label: {
                formatter: "{b}",
                position: "right",
                show: false,
              },
              itemStyle: {
                color: "#F4E925",
                shadowBlur: 10,
                shadowColor: "#05C3F9",
              },
              zlevel: 1,
            },
          ],
        };
        this.dom.setOption(option);

        this.dom.on('dblclick', () => {
          clearTimeout(this.TimeFn);
          if (this.returl.length > 0) {
            var tmpreturl = this.returl.pop();
            var tmpretjson = this.getMapJson(tmpreturl);
            if (tmpretjson) {
              this.LastTimeName = this.retname.pop();
              this.LastTimeMapId = this.retmapId.pop();//todo
              this.$store.commit("SET_MAPREGIONID", this.LastTimeMapId);//todo
              this.$echarts.registerMap('nangjin2', tmpretjson);
              // var retoption = myChart.getOption();
              option.title.text = this.LastTimeName;
              option.geo.map = 'nangjin2';
              option.series[1].map = 'nangjin2';
              this.getMapData(this.LastTimeMapId, option);//todo
            } else {
              this.$notify({
                message: '没有返回文件',
                type: 'error',
                position: 'bottom-right',
              });
            }
          } else {
            this.$notify({
              message: '此地图为最高一级',
              type: 'error',
              position: 'bottom-right',
            });
          }
        });

        this.dom.on('click', chinaParam => {//chinaParam与tooltip一样
          // console.log(chinaParam);
          // 取消上次延时未执行的方法
          clearTimeout(this.TimeFn);
          //执行延时
          this.TimeFn = setTimeout(() => {
            var mapName = chinaParam.name;
            if (mapName != this.LastTimeName) {

              this.LastTimeUrl = this.objMap[this.LastTimeName];
              var tmpurl = this.objMap[mapName];
              var tmpjson = this.getMapJson(tmpurl);//todo axios异步获取,ajax同步获取
              if (tmpjson) {
                this.returl.push(this.LastTimeUrl);
                this.retname.push(this.LastTimeName);
                this.retmapId.push(this.LastTimeMapId);
                this.LastTimeName = mapName;
                this.LastTimeMapId = chinaParam.data ? chinaParam.data.value[3] : "";//todo
                this.$store.commit("SET_MAPREGIONID", this.LastTimeMapId);//todo

                this.$echarts.registerMap('nangjin1', tmpjson);
                // var option = myChart.getOption();
                option.title.text = mapName;
                option.geo.map = 'nangjin1';
                option.series[1].map = 'nangjin1';

                // 最后为雨花台区时，data全换mapData，自带经纬度，不需要转换
                if (tmpjson.features.length === 1 && tmpjson.features[0].properties["level"] === "district") {
                  // 采用另一个接口
                  getRegionInfo().then(res => {
                    this.mapData = res.data.map(i => ({
                      name: i.name,
                      value: [i.longitude, i.latitude],
                    }));
                    option.series[0].data = this.mapData;
                    option.series[1].data = [{
                      name: mapName,
                      // series-map最后一级的区显示站房总数据
                      value: this.geoCoordMap[mapName].concat(this.mapData.length)
                    }];
                    option.series[2].data = this.mapData;//最后一级只展示经纬度

                    this.dom.setOption(option, true);
                  });
                } else {
                  this.getMapData(this.LastTimeMapId, option);
                }
                //首页其他组件全部根据chinaParam里得id重新获取
              } else {
                if (chinaParam.data && chinaParam.data.value.length < 3) {
                  //todo 点击站房首页换成站房id
                  this.$notify({
                    message: '此为站房级',
                    type: 'error',
                    position: 'bottom-right',
                  });
                } else {
                  this.$notify({
                    message: '没有地图文件',
                    type: 'error',
                    position: 'bottom-right',
                  });
                }
              }
            } else {
              this.$notify({
                message: '为最低一级，不能进入',
                type: 'error',
                position: 'bottom-right',
              });
            }
          }, 200);
        });
      })
    },
    // 在线/离线率弹框
    openDialog (rateType) {
      this.$emit("open-dialog", rateType)
    }

  },
  mounted () {
    this.dom = this.$echarts.init(document.getElementById("container"));
    // this.initChart();
  },
  created () {
    this.getData();
    this.getNum();
    // 在mounted里面数据就为null？
    this.$axios('json/map.json').then(res => {
      this.objMap = res.data.json;
      this.geoCoordMap = res.data.geoCoordMap;
    })
    // this.$axios('json/mapData.json').then(res => {
    //   this.mapData = res.data.data;
    //   this.$nextTick(() => {//?可以获取到dom？
    //     this.initChart();
    //   })
    // })
  },
  beforeDestroy () {
    // 如果实例中有定时器，销毁组件时必须要清楚定时器
    if (this.TimeFn) {
      clearTimeout(this.TimeFn)
    }
    if (this.dom) {
      this.dom.dispose();
    }
  }
}
</script>
 
<style lang='scss' scoped>
.main8 {
  overflow: hidden;
  left: 0;
  right: 0;
  margin: auto;
  height: 100%;
  #container {
    height: 100%;
    z-index: 999;
  }
  .infoPane {
    width: 228px;
    height: 131px;
    position: absolute;
    top: 262px;
    left: 19px;
    background: url("~assets/image/home/maoInfoBg.png") center/100% 100%;
    color: #befdfe;
    padding: 23px 16px;
    z-index: 1000;
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