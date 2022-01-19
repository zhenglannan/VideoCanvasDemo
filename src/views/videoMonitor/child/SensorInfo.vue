<template>
  <div
    class="SensorInfo"
    :style="{left:styleLeft,top:styleTop,width:infoWidth+'px',height:infoHeight+'px'}"
  >
    <p :style="{color:stateColor(eventlevel)}">{{state}}</p>
    <ul class="ulLineClass">
      <li
        v-for="item in computedPointList"
        :key="item.sensorpointid"
        :style="{color:stateColor(networkstate=='0'?'-2':item.eventlevel)}"
        :title="item.sensorpointidname+':'+item.value"
      >{{item.sensorpointidname}}:{{networkstate=="0"?"--":item.value|formatter()}}{{item.unit}}</li>
    </ul>
  </div>
</template>
 
<script>
export default {
  name: 'SensorInfo',
  props: {
    title: {
      type: String
    },
    pointlist: {
      type: Array,
      default: null
    },
    state: {
      type: String
    },
    eventlevel: {
      type: [Number, String]
    },
    modelkind: {
      type: String
    },
    networkstate: {
      type: [Number, String]
    },
    sensorid: {
      type: [Number, String]
    },
    canvasW: {
      type: [Number, String]
    },
    canvasH: {
      type: [Number, String]
    },
    axis: String
  },
  data () {
    return {
      infoWidth: 177,
      infoHeight: 112,
    };
  },
  methods: {
    // 状态面板字体颜色
    stateColor (eventlevel) {
      if (eventlevel == -1 || eventlevel == -9999) {//正常
        return '#4ECDFF'
      } else if (eventlevel == -2) {//离线(灰色)
        return '#84d0ce'
      } else if (eventlevel == 1) {//预警
        return '#FF8826'
      } else if (eventlevel == 2) {//告警
        return '#FF3D1F'
      }
    },
  },
  filters: {
    // 值包含-9999，为--
    formatter: function (value, that) {
      if (value.indexOf("-9999") > -1) {
        return '--'
      }
      return value
    }
  },
  computed: {
    styleLeft () {
      // 判断边界，溢出x坐标返回canvas宽度-信息框宽度
      if (this.canvasW - (this.axis.split(",")[0] * this.canvasW + 2) < this.infoWidth) {
        return this.canvasW - this.infoWidth + 'px'
      }
      return this.axis.split(",")[0] * this.canvasW + 2 + "px"
    },
    styleTop () {
      if (this.canvasH - (this.axis.split(",")[1] * this.canvasH + 2) < this.infoHeight) {
        return this.canvasH - this.infoHeight + 'px'
      }
      return this.axis.split(",")[1] * this.canvasH + 2 + "px"
    },
    // 测定根据eventlevel降序排列
    computedPointList () {
      if (this.pointlist) {
        return this.pointlist.filter(i => i.remotetype === 'yc').sort((a, b) => parseInt(b.eventlevel) - parseInt(a.eventlevel))
      }
      return ""
    },
  }
}
</script>
 
<style lang='scss' scoped>
.SensorInfo {
  position: absolute;
  color: #fff;
  // width: 177px;
  // height: 112px;
  background: url("~assets/image/home/maoInfoBg.png") no-repeat center/100% 100%;
  padding: 15px;
  overflow: hidden;
  p{
    text-align: right;
  }
  .ulLineClass {
    overflow: hidden;
    color: #dfe5ff;
    height: calc(100% - 16px); 
    & > li {
      padding-top: 7px;
      font-size: 13px;
      white-space: nowrap;
    }
  }
}
</style>