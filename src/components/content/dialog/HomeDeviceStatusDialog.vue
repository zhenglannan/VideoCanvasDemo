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
          <span class="title">站房设备详情</span>
        </div>
        <el-table
          :data="regionData"
          style="width: 100%;margin-top: 5px;"
          height="300px"
          border
          highlight-current-row
          ref="singleTable"
        >
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="name" label="站房名称" :show-overflow-tooltip="true" align="center"></el-table-column>
          <el-table-column
            prop="eventlevelname"
            :label="deviceLabel"
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" align="center" min-width="100px">
            <template slot-scope="scope">
              <el-button @click.native.prevent="showDetail(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <p class="title">设备详情</p>
        <el-table
          :data="regionDeviceData"
          style="width: 100%;margin-top: 5px;"
          height="300px"
          :border="true"
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
          <el-table-column label="设备状态" prop="state" :show-overflow-tooltip="true" align="center"></el-table-column>
          <el-table-column
            label="开启时间"
            :show-overflow-tooltip="true"
            align="center"
            prop="updatetime"
          ></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  <!-- </div> -->
</template>
 
<script>
import { getRegionSensorState, getRegionStartedDevice } from 'network/home'
export default {
  name: 'HomeDeviceStatus',
  data () {
    return {
      visual: false,
      title: ' ',
      regionData: [],
      regionDeviceData: [],
    };
  },
  props: {
    modelkind: {
      type: String
    }
  },
  computed: {
    deviceLabel () {
      if (this.modelkind == 'tacd') {
        return "站房空调"
      } else if (this.modelkind == 'tdrm') {
        return "站房门禁"
      } else if (this.modelkind == 'tlig') {
        return "站房灯光"
      }
    }
  },
  methods: {
    showDialog () {
      // 获取站房详情
      this.getRegionSensorState(this.modelkind);
      this.regionDeviceData=null;
    },
    getRegionSensorState (type) {
      getRegionSensorState(type).then(res => {
        this.regionData = res.data
      })
    },
    handleClose (done) {
      this.visual = false;
    },
    // 站房对应告警设备
    showDetail (row) {
      // console.log(this.value);
      getRegionStartedDevice(row.id, this.modelkind).then(res => {
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
}
</style>