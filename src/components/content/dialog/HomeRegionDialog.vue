<template>
  <!-- <div> -->
  <el-dialog
    :visible.sync="visual"
    width="62%"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    @open="showDialog"
    :before-close="handleClose"
    :modal="true"
  >
    <div>
      <div>
        <span class="title">站房详情</span>
      </div>
      <!-- <el-scrollbar style="height:100%"> -->
        <!-- el-table使用max-height最外层也会有个滚动条；height用于固定表头-->
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
            prop="eventlevelname"
            label="站房状态"
            :show-overflow-tooltip="true"
            align="center"
          >
            <template slot-scope="scope">
              <!-- todo:还有其他的方法吗(告警弹出层只有3种情况) computed不行，methods可以，与v-if比哪个效率高一点 -->
              <span
                style="color:#FF3D1F"
                v-if="scope.row.eventlevel==2||scope.row.eventlevel==3  "
              >{{scope.row.eventlevelname}}</span>
              <span
                style="color:#FF8826"
                v-else-if="scope.row.eventlevel==1"
              >{{scope.row.eventlevelname}}</span>
              <span style="color:#A7C7D4" v-else>{{scope.row.eventlevelname}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="100px">
            <template slot-scope="scope">
              <el-button type="primary" @click.native.prevent="showDetail(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      <!-- </el-scrollbar> -->
    </div>
    <div>
      <p class="title">设备详情</p>
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
          min-width="150"
        ></el-table-column>
        <el-table-column
          prop="sensoridname"
          label="设备名称"
          :show-overflow-tooltip="true"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column
          label="告警参数"
          prop="sensorpointidname"
          :show-overflow-tooltip="true"
          align="center"
        ></el-table-column>
        <el-table-column label="告警值" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{scope.row.value}}{{scope.row.unit}}</template>
        </el-table-column>
        <el-table-column
          prop="eventcontent"
          label="描述"
          :show-overflow-tooltip="true"
          align="center"
          min-width="120px"
        ></el-table-column>
      </el-table>
    </div>
  </el-dialog>
  <!-- </div> -->
</template>
 
<script>
import {getEnumValue } from "utils/index"
import { getRegionState, getRegionEventData } from 'network/home'
export default {
  name: 'HomeRegionDialog',
  data () {
    return {
      visual: false,
      title: ' ',
      regionData: [],
      // regionData: [
      //   {
      //       eventlevel: "3",
      //       eventlevelname: "变位告警",
      //       id: "9",
      //       itemdata: "40",
      //       latitude: "",
      //       longitude: "",
      //       mapurl: "",
      //       name: "1#测试站房（91.250）",
      //       parentregionid: "8",
      //       parentregionidname: "雨花台区",
      //       regiontype: "STATION_TYPE_STAITON",
      //       regiontypename: "配电房",
      //       sgcode: "",
      //       voltagelevel: "VOLTAGE_CLASSES_10KV",
      //       voltagelevelname: "10kv"
      //   }],
      regionDeviceData: [],
    };
  },
  methods: {
    showDialog () {
      // 获取站房详情
      this.getRegionState();
      this.regionDeviceData = null;
    },
    getRegionState () {
      getRegionState().then(res => {
        this.regionData = res.data
      })
    },
    handleClose (done) {
      this.visual = false;
    },
    // 站房对应告警设备
    showDetail (row) {
      // console.log(this.value);
      getRegionEventData(row.id).then(res => {
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
  color:#75b1f7;
}
</style>
