<template>
  <div class="main3">
    <!-- <el-button @click="add">add</el-button> -->
    <el-table
      :data="tableData"
      style="width: calc(100% - 32px); position: absolute;
    left: 0;
    right: 0;
    margin: auto;"
      max-height="244px"
      :show-header="false"
      :cell-style="getTdStyle"
      :border="false"
    >
      <el-table-column prop="regionidname" label="区域" :show-overflow-tooltip="true" align="center"></el-table-column>
      <el-table-column prop="time" label="时间" :show-overflow-tooltip="true" align="center"></el-table-column>
      <el-table-column
        prop="sensoridname"
        label="摄像机名称"
        :show-overflow-tooltip="true"
        align="center"
      ></el-table-column>
      <el-table-column prop="img" label="图片" align="center">
        <template slot-scope="scope">
          <el-image :src="scope.row.img" @click="preview(scope.row)">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-dialog :visible.sync="dialogVisible" width="70%" class="dialog">
      <el-image :src="previewImg"></el-image>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>
 
<script>
import path from '@/settings'
const { fileUrl } = path
// import ElImageViewer from 'element-ui/packages/image/src/image-viewer.vue'
import { getCameraCapture } from 'network/home';
export default {
  name: 'Demo3',
  data () {
    return {
      tableData: [],
      // srcList: [
      //   require('assets/img/map.png')
      // ],
      dialogVisible: false,
      previewImg: '',
    };
  },
  methods: {
    // 单元格样式
    getTdStyle ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex % 2 !== 0) {
        return { backgroundColor: "rgba(41, 59, 123, .3)" }
      }
      if (columnIndex == 3) {
        return { cursor: "pointer" }
      }
    },
    getData () {
      getCameraCapture().then(res => {
        this.tableData = res.data.map(item => {
          return {
            id: item.regionid + item.sensorid + item.presetno,//用于删除同样的数据
            regionidname: item.regionidname,
            time: item.time,
            sensoridname: item.sensoridname,
            img: `${fileUrl}${item.img}`//只能在js中使用ES6模板字符串？
            // img: "http://192.168.90.57:8097" + item.img
          } 
        });
      })
    },
    // 首页传来socket数据
    getMsg (message) {
      if (this.tableData) {
        let id = message.regionid + message.sensorid + message.presetno;
        // 删除同样id的数据
        this.tableData.forEach((item, index) => {
          if (item.id === id) {
            // this.tableData.splice(this.tableData.indexOf(item), 1);
            this.tableData.splice(index, 1);
          }
        });
        message.id = id;
        message.img = `${fileUrl}${message.img}`;
        // message.img = "http://192.168.90.57:8097/" + message.img;
        this.tableData.unshift(message);
      }
    },
    // 预览放大
    preview (row) {
      // this.dialogVisible = true;
      // this.previewImg = img;
      this.$emit("preview-img", row)
    }
  },
  created () {
    this.getData();
  }
}
</script>
 
<style lang='scss' scoped>
.main3 {
  overflow: hidden;
  left: 0;
  right: 0;
  margin: auto;
  height: 100%;
}
.chart3 {
  width: 100%;
  height: 100%;
}
</style>
<style>
/* 删除表格下横线 */
/* .main3 .el-table::before {
  height: 0 !important;
} */
/* 去除边框 */
/* .main3  .el-table--border th,tr,
td {
  border: none !important;
} */
</style>