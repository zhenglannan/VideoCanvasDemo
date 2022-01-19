<template>
  <!-- <div> -->
  <el-dialog
    title="站房历史抓图数据查询"
    :visible.sync="visual"
    width="62%"
    height="61%"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    @open="showDialog"
    :before-close="handleClose"
  >
    <el-date-picker
      v-model="startTime"
      type="datetime"
      placeholder="选择起始时间"
      default-time="00:00:00"
      value-format="yyyy-MM-dd HH:mm:ss"
    ></el-date-picker>
    <el-date-picker
      v-model="endTime"
      type="datetime"
      placeholder="选择结束时间"
      default-time="00:00:00"
      value-format="yyyy-MM-dd HH:mm:ss"
    ></el-date-picker>
    <!-- <el-button icon="el-icon-search" circle style="margin-left: 11px;" @click=getPatrolLog(patrolid,value[0],value[1])></el-button> -->
    <el-button
      icon="el-icon-search"
      type="primary"
      circle
      style="margin-left: 11px;"
      @click="search"
    ></el-button>
    <el-table
      :data="captureData"
      style="width: 100%;margin-top: 5px;"
      height="300px"
      highlight-current-row
      :cell-style="getTdStyle"
    >
      <el-table-column prop="regionidname" label="站房" :show-overflow-tooltip="true" align="center"></el-table-column>
      <el-table-column prop="time" label="时间" :show-overflow-tooltip="true" align="center"></el-table-column>
      <el-table-column
        prop="sensoridname"
        label="摄像机名称"
        :show-overflow-tooltip="true"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="img"
        label="图片"
        align="center"
        width="100px"
        class-cell-stylename="imgColumn"
      >
        <template slot-scope="scope">
          <el-image :src="scope.row.img" @click="preview(scope.row)">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  <!-- </div> -->
</template>
 
<script>
import {formateDate} from 'utils/index'
import path from '@/settings'
import { getHistoryCameraCapture } from 'network/home'
export default {
  name: 'HomeCaptureDialog',
  data () {
    return {
      visual: false,
      captureData: [],
      // 当天0点到第二天0点
      startTime:formateDate(new Date(new Date().toLocaleDateString())),
      endTime:formateDate(new Date(new Date().toLocaleDateString()).getTime()+ 24 * 60 * 60 * 1000),
    };
  },
  methods: {
    showDialog () {
      // 获取历史抓图详情
      this.getData(this.startTime,this.endTime);
      // this.value = [new Date(new Date(new Date().toLocaleDateString()).getTime()), new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)];
    },
    getData (stime = "", etime = "") {
      getHistoryCameraCapture(stime, etime).then(res => {
        this.captureData = res.data.map(item => {
          return {
            regionidname: item.regionidname,
            time: item.time,
            sensoridname: item.sensoridname,
            img: `${path.fileUrl}${item.img}`//?
            // img: "http://192.168.90.57:8097"  + item.img
          }
        });
      })
    },
    handleClose (done) {
      this.visual = false;
    },
    // 范围查找
    search () {
      if (this.startTime == undefined||this.endTime == undefined) {
        this.getData();
      } else {
        this.getData(this.startTime, this.endTime);
      }
    },
    // 预览放大
    preview (row) {
      this.$emit("preview-img", row)
    },
    // 单元格样式
    getTdStyle ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 3) {
        return { cursor: "pointer" }
      }
    },
  }
}
</script>
 
<style lang='scss' scoped>
.imgColumn {
  cursor: pointer;
}
</style>