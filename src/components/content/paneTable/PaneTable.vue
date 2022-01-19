<template>
  <div>
    <el-table
      :data="tabelData"
      style="width:100%;margin-top: 168px;"
      height="760px"
      border
      highlight-current-row
      :header-cell-style="{fontSize:'16px',border:'none'}"
      :span-method="cellMerge"
      v-loading="pictLoading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
      element-loading-text="数据正在加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-table-column prop="sensoridname" label="传感器" :show-overflow-tooltip="true" align="center"></el-table-column>
      <el-table-column
        prop="sensorpointidname"
        label="测点"
        :show-overflow-tooltip="true"
        align="center"
      ></el-table-column>
      <el-table-column prop="value" label="值" :show-overflow-tooltip="true" align="center"></el-table-column>
      <el-table-column prop="updatetime" label="时间" :show-overflow-tooltip="true" align="center"></el-table-column>
      <!-- <el-table-column prop="regionidname" label="告警状态" :show-overflow-tooltip="true" align="center"></el-table-column> -->
    </el-table>
    <div style="text-align: center;padding-top: 6px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :hide-on-single-page="false"
        :background="true"
      ></el-pagination>
    </div>
  </div>
</template>
 
<script>
import { getAllSensorTable } from 'network/envmonitor'
import { mapState } from 'vuex'
import { getSocket } from 'utils/socket'

export default {
  name: 'TableMonitor',
  data () {
    return {
      pictLoading: false,
      currentPage: 1,
      pageSize: 20,
      total: 0,
      tabelData: null,
      spanArr: []
    };
  },
  props: {
    monitorType: {
      type: String
    }
  },
  computed: {
    ...mapState(['regionid']),
  },
  watch: {
    regionid (val) {
      this.currentPage=1;
      this.getData();
    },
    currentPage (val) {
      this.getData();
    }
  },
  methods: {
    getData () {
      this.pictLoading = true;
      getAllSensorTable(this.monitorType,this.currentPage,this.pageSize).then(res => {
        this.pictLoading = false;
        this.tabelData = res.data;
        this.total = res.total;
        this.getSpanArr(this.tabelData);
      }).catch(() => {
        this.pictLoading = false;
        this.$message({
          message: '与服务器断开连接！',
          type: 'error'
        });
      })
    },
    // 得到合并列数组
    getSpanArr (data) {
      this.spanArr.length = 0;
      let pos;
      for (let i = 0, len = data.length; i < len; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          pos = 0
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].sensoridname === data[i - 1].sensoridname) {
            this.spanArr[pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            pos = i;
          }
        }
      }
    },
    cellMerge ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // socket接收msg
    getMsg (msg) {
      if (msg !== "连接成功" && this.tabelData.length !== 0) {
        const res = JSON.parse(msg);
        if (res.topic === "webserver/reportdata/") {
          this.changeTableData(res.data);
        } else if (res.topic === "webserver/reportevent/") {
          this.$bus.$emit('changeEvent',res.data);
          this.changeEvent(res.data);
        }
      }
    },
    // 实时数据
    changeTableData (payload) {
      const { sensorid, points, timestamp, eventlevel, networkstate, workpointid } = payload;
      points.forEach(ele => {
        this.tabelData.forEach((item, index) => {
          if (item.sensorpointid == ele.id) {
            this.tabelData[index].updatetime = timestamp;
            this.tabelData[index].value = ele.value;
          }
        });
      });
    },
    // 实时告警
    changeEvent (payload) {
      const { sensorid, sensorpointid, eventlevel, state, MaxEventLv, time, value, eventtypeText } = payload;
      let index = this.tabelData.findIndex(item => item.sensorpointid == sensorpointid);
      if (index != -1) {
        this.tabelData[index].time = time;
        this.tabelData[index].value = value;
      }
      // ?告警状态
    },
    // 每页展示条数
    handleSizeChange (val) {
      this.pageSize = val;
    },
    // 当前页
    handleCurrentChange (val) {
      this.currentPage = val;
      // this.getReport(this.form.sensorArr[0] ? this.form.sensorArr[0] : "", this.form.sensorArr[1] ? this.form.sensorArr[1] : "", this.form.sensorArr[2] ? this.form.sensorArr[2] : "", this.form.type, this.form.startTime, this.form.endTime);
    },
  },
  created () {
    this.getData();
    getSocket(JSON.stringify({ type: 'client' }), this.getMsg);

  }
}
</script>
 
<style lang='scss' scoped>
</style>