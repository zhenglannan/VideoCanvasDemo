<template>
  <div id="main4">
    <div id="demo4" class="chart4"></div>
    <el-table
      :data="tableData"
      height="244px"
      @row-click="rowClick"
      :cell-style="getTdStyle"
      :header-cell-style="{background: 'linear-gradient(180deg, rgba(52, 65, 131,.5) 0%, rgba(28, 43, 148,.5) 100%)',border:'none'}"
      ref="table"
    >
      <el-table-column
        label="站房"
        prop="regionidname"
        min-width="80"
        :show-overflow-tooltip="true"
        align="center"
      ></el-table-column>
      <el-table-column
        label="设备"
        prop="sensoridname"
        min-width="80"
        :show-overflow-tooltip="true"
        align="center"
      ></el-table-column>
      <el-table-column
        label="告警类型"
        prop="eventcontent"
        :show-overflow-tooltip="true"
        align="center"
      ></el-table-column>
      <el-table-column
        label="告警等级"
        prop="eventlevelname"
        :show-overflow-tooltip="true"
        align="center"
      ></el-table-column>
      <el-table-column label="时间" prop="eventtime" :show-overflow-tooltip="true" align="center"></el-table-column>
    </el-table>
    <el-dialog
      custom-class="detailTable"
      title="告警事件详细信息"
      :visible.sync="dialogVisible"
      width="56%"
      :append-to-body="true"
      :before-close="handleClose"
    >
      <el-table :data="msg" style="width: 100%;" max-height="237px" :stripe="true">
        <el-table-column
          label="站房"
          prop="regionidname"
          width="160"
          :show-overflow-tooltip="true"
          align="center"
        ></el-table-column>
        <el-table-column
          label="设备"
          prop="sensoridname"
          min-width="80"
          :show-overflow-tooltip="true"
          align="center"
        ></el-table-column>
        <el-table-column
          label="告警类型"
          prop="eventcontent"
          :show-overflow-tooltip="true"
          align="center"
        ></el-table-column>
        <el-table-column
          label="告警等级"
          prop="eventlevelname"
          :show-overflow-tooltip="true"
          align="center"
        ></el-table-column>
        <el-table-column
          label="时间"
          prop="eventtime"
          width="200"
          :show-overflow-tooltip="true"
          align="center"
        ></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      class="imgDialog"
      :title="title"
      :visible.sync="aiDialogVisible"
      width="56%"
      :append-to-body="true"
      :before-close="handleClose"
    >
      <el-image :src="aiImg"></el-image>
    </el-dialog>
  </div>
</template>
 
<script>
import path from '@/settings'

import { getRealTimeAlarm, getRealTimeRadar } from 'network/home';
export default {
  name: 'Demo4',
  data () {
    return {
      dom: null,
      tableData: null,
      dialogVisible: false,
      aiDialogVisible: false,
      msg: [],
      aiImg: "",
      title: "",
    };
  },
  methods: {
    updateAll () {
      this.initChart();
      this.getData();
    },
    initChart () {
      getRealTimeRadar().then(res => {
        let arr = res.data;
        // 获取返回的数组对象中某个属性值的最大值
        let max = Math.max.apply(Math, arr.map(i => i.value));
        // let max=Math.max(...arr.map(i=>i.value));
        let option = {
          // tooltip: {
          //   // textStyle: {
          //   //   fontSize: 12,
          //   // }
          // },
          radar: {
            // shape: 'circle',
            axisName: {
              color: '#8EC2FF',
              borderRadius: 3,
              padding: [3, 5],
              // formatter:function(params){
              //   i
              // }
            },
            // 必须设max，否则为0会到最边边
            indicator: arr.map(item => ({ name: item.name, max: max })),
            radius: "60%",
            // 分割线
            splitLine: {
              show: true,
              lineStyle: {
                // color: "#1894FF"
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 0,
                  colorStops: [{
                    offset: 0, color: '#067282' // 0% 处的颜色
                  }, {
                    offset: 1, color: '#0E58AD' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              },
            },
            splitArea: {
              areaStyle: {
                color: "transparent"
              }
            },
            axisLine: {
              lineStyle: {
                color: "#1894FF"
              }
            }
          },
          series: [{
            name: '告警分类',
            type: 'radar',
            areaStyle: {},
            label: {
              show: true,
              color: "#fff"
            },
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#6ABBFF' // 0% 处的颜色
                }, {
                  offset: 1, color: '#105CFF' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
            lineStyle: {
              color: "#1990f9"
            },
            data: [
              {
                value: arr.map(item => item.value),
              }
            ]
          }]
        };
        this.dom.setOption(option);
      });
    },
    getData () {
      getRealTimeAlarm().then(res => {
        this.tableData = res.data.map(item => ({
          id: item.sensorpointid + "_" + item.eventtype,//todo测点
          regionidname: item.regionidname,
          sensoridname: item.sensoridname,
          eventcontent: item.eventcontent,
          eventlevelname: item.eventlevelname,
          eventtime: item.eventtime
        }));
      });
    },
    rowClick (row, column, event) {
      this.msg.length = 0;//todo每次点击先清空?
      // console.log(Boolean(row.type=="Ai")); //todo就算没有type字段，也显示false不应该显示没有type这个字段吗
      if (row.type === "AI") {
        this.aiDialogVisible = true;
        this.title = row.regionidname + "---" + row.sensoridname + "---" + row.eventcontent + "---" + row.eventtime;
        this.aiImg = `${path.fileUrl}${row.file[0].url}`;
        // this.aiImg = "http://192.168.90.57:8097" + row.file[0].url;
      } else {
        this.dialogVisible = true;
        this.msg.push({
          regionidname: row.regionidname,
          sensoridname: row.sensoridname,
          eventcontent: row.eventcontent,
          eventlevelname: row.eventlevelname,
          eventtime: row.eventtime,
        })
      }
    },
    // 接收首页socket信息
    changeEvent (message) {
      if (this.tableData) {
        // todo传eventlevel为-1时，告警变为正常，删除之前测点对应数据，否则加数据
        if (message.eventlevel == -1) {
          let id = message.sensorpointid + "_" + message.type;
          // 删除同样id的数据
          this.tableData.forEach((item, index) => {
            if (item.id === id) {
              this.tableData.splice(index, 1);
            }
          });
        } else {
          this.tableData.unshift({
            regionidname: message.regionidname,
            sensoridname: message.sensoridname,
            eventcontent: message.eventtypename,
            eventlevelname: message.eventlevelname,
            eventtime: message.time,

            type: message.type,
            file: message.file,
          });
        }
        // this.$emit("updateMsg");
        // ?每次添加一个数据自动滚动到最后一行
        // this.$refs.table.bodyWrapper.scrollTop=this.$refs.table.bodyWrapper.scrollHeight;
      }
    },
    // 单元格样式
    getTdStyle ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex % 2 !== 0) {
        return { backgroundColor: "linear-gradient(180deg, rgba(52, 65, 131,.5) 0%, rgba(28, 43, 148,.5) 100%)" }
      }
    },
    handleClose (done) {
      done();
    }
  },
  mounted () {
    this.dom = this.$echarts.init(document.getElementById("demo4"));
    this.initChart();
  },
  created () {
    this.getData();
  },
  beforeDestroy () {
    if (this.dom) {
      this.dom.dispose();
    }
  }
};
</script>
 
<style lang='scss' scoped>
#main4 {
  overflow: hidden;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  height: 100%;
  padding: 0 8px;
  .chart4 {
    width: 38%;
    height: 100%;
  }
}
</style>
<style>
#main4 .detailTable .el-dialog {
  background: url("~assets/image/dialogBg4.png") no-repeat center/100% 100% !important;
  padding: 30px 50px 29px 39px;
}
/* #main4 .aiTable .el-dialog {
  background: url("~assets/image/dialogBg3.png") no-repeat center/100% 100% !important;
  padding: 30px 50px 29px 39px;
} */
</style>