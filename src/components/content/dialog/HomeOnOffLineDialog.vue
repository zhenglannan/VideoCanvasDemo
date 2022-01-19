<template>
  <!-- <div> -->
  <el-dialog
    :visible.sync="visual"
    width="62%"
    height="61%"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    @open="showDialog"
    :before-close="handleClose"
  >
    <div>
      <div>
        <span class="title">站房详情</span>
      </div>
      <el-table
        :data="regionData"
        style="width: 100%;margin-top: 5px;"
        height="300px"
        highlight-current-row
        ref="singleTable"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="name" label="站房名称" :show-overflow-tooltip="true" align="center"></el-table-column>
        <el-table-column
          prop="rate"
          :label="rateLabel"
          :show-overflow-tooltip="true"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{scope.row.rate}}%</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="100px">
          <template slot-scope="scope">
            <el-button type="primary" @click.native.prevent="showDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <p class="title">站房设备详情</p>
      <el-table
        :data="regionDeviceData"
        style="width: 100%;margin-top: 5px;"
        height="300px"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column
          prop="regionidname"
          label="站房名称"
          :show-overflow-tooltip="true"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="sensoridname"
          label="设备名称"
          :show-overflow-tooltip="true"
          align="center"
        ></el-table-column>
        <el-table-column label="设备状态" prop="state" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">
            <span style="color:green" v-if="scope.row.state=='在线'">{{scope.row.state}}</span>
            <span style="color:red" v-else>{{scope.row.state}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
  <!-- </div> -->
</template>
 
<script>
import { getSensorOnlineRate, getSensorOfflineRate, getOnOffLineSensor } from 'network/home'
export default {
  name: 'HomeOnOffLineDialog',
  data () {
    return {
      visual: false,
      title: ' ',
      regionData: [],
      regionDeviceData: [],
    };
  },
  props: {
    rateType: {
      type: String
    }
  },
  computed: {
    rateLabel () {
      if (this.rateType == 'online') {
        return "在线率"
      } else {
        return "离线率"
      }
    }
  },
  methods: {
    showDialog () {
      // 获取站房详情
      this.getRegionState(this.rateType);
      this.regionDeviceData = null;
    },
    getRegionState (type) {
      if (type == "online") {
        getSensorOnlineRate("table").then(res => {
          this.regionData = res.data
        })
      } else {
        getSensorOfflineRate("table").then(res => {
          this.regionData = res.data
        })
      }
    },
    handleClose (done) {
      this.visual = false;
    },
    // 站房对应告警设备
    showDetail (row) {
      getOnOffLineSensor(row.regionid).then(res => {
        this.regionDeviceData = res.data;
      });
      this.setCurrent(row);
    },
    setCurrent (row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
  }
}
</script>
 
<style lang='scss' scoped>
.title {
  font-size: 18px;
  padding: 12px;
  margin-right: 11px;
  color: #75b1f7;
}
</style>