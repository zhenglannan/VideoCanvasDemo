<template>
  <div id="patrol-dialog">
    <el-dialog
      title="巡检记录"
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
          <span class="title">巡检任务日志</span>
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
          <el-button
            icon="el-icon-search"
            type="primary"
            style="margin-left: 11px;"
            @click="search"
          ></el-button>
        </div>
        <el-table
          :data="patrolData"
          style="width: 100%;margin-top: 5px;"
          height="300px"
          highlight-current-row
          ref="singleTable"
        >
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column
            prop="patrolidname"
            label="任务名称"
            min-width="120"
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="starttime"
            label="开始时间"
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="stoptime"
            label="结束时间"
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" align="center" min-width="100px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click.native.prevent="getPatrolItemLog(scope.row)"
              >明细</el-button>
              <el-button
                size="mini"
                style="background: transparent;border:1px solid #428af7;color: #4B8DFF;"
              >导出报表</el-button>
              <!-- <el-button
                size="mini"
                style="background: transparent;border:1px solid #428af7;color: #4B8DFF;"
                @click="downloadPatrolLog(scope.row)"
              >导出报表</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <p class="title">巡检点位日志</p>
        <el-table
          :data="patrolItemData"
          style="width: 100%;margin-top: 5px;"
          height="300px"
        >
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column
            prop="patrolidname"
            label="任务名称"
            min-width="120"
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="presetnoname"
            label="点位名称"
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="patroltime"
            label="开始时间"
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column prop="patrolfile" label="图片" align="center" width="60px">
            <template slot-scope="scope">
              <el-image :src="scope.row.patrolfile" @click="preview(scope.row)">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column
            prop="patrolresult"
            label="结果"
            :show-overflow-tooltip="true"
            align="center"
          >
            <template slot-scope="scope">
              <!-- to-do:还有其他的方法吗 -->
              <span
                style="color:green"
                v-if="scope.row.patrolresult=='完成'"
              >{{scope.row.patrolresult}}</span>
              <span style="color:red" v-else>{{scope.row.patrolresult}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog
      class="imgDialog"
      :title="title"
      :visible.sync="dialogVisible"
      width="62%"
      :modal="false"
    >
      <el-image :src="previewImg"></el-image>
    </el-dialog>
  </div>
</template>
 
<script>
import {formateDate} from 'utils/index'
import path from '@/settings'
const qs = require("qs");
import { getPatrolLog, getPatrolItemLog, downloadPatrolLog } from 'network/patrol'
export default {
  name: 'PatrolDialog',
  data () {
    return {
      visual: false,
      // patrolData: [],
      patrolData: [
        {
          id: "62",
          patrolid: "1",
          patrolidname: "日常巡检1#",
          starttime: "2021-03-25 10:56:03",
          stoptime: "2021-03-25 10:56:20"
        }],
      patrolItemData: [],

      dialogVisible: false,
      previewImg: '',
      title: '',
      startTime:formateDate(new Date(new Date().toLocaleDateString())),
      endTime:formateDate(new Date(new Date().toLocaleDateString()).getTime()+ 24 * 60 * 60 * 1000),
    };
  },
  props: {
    patrolid: {
      type: [Number, String]
    }
  },
  methods: {
    // 预览放大
    preview (row) {
      this.dialogVisible = true;
      this.previewImg = row.patrolfile;
      this.title = row.patrolidname + "---" + row.presetnoname;
    },
    showDialog () {
      // 巡检任务日志
      this.getPatrolLog(this.patrolid, this.startTime, this.endTime);
      this.patrolItemData = null;
    },
    getPatrolLog (id, stime, etime) {
      getPatrolLog(id, stime, etime).then(res => {
        this.patrolData = res.data
      })
    },
    // 范围查找
    search () {
      if (this.startTime == undefined||this.endTime == undefined) {
        this.getPatrolLog(this.patrolid);
      } else {
        this.getPatrolLog(this.patrolid, this.startTime, this.endTime);
      }
    },
    handleClose (done) {
      this.visual = false;
    },
    // 巡检点位日志
    getPatrolItemLog (row) {
      getPatrolItemLog(row.id).then(res => {
        this.patrolItemData = res.data.map(item => {
          return {
            patrolidname: item.patrolidname,
            presetnoname: item.presetnoname,
            patroltime: item.patroltime,
            patrolresult: item.patrolresult == 1 ? "完成" : "异常",
            patrolfile: `${path.fileUrl}${item.patrolfile}`
            // patrolfile: "http://192.168.90.57:8097" + item.patrolfile
          }
        });
      });
      this.setCurrent(row);
    },
    // 导出报表
    downloadPatrolLog (row) {
      // this.setCurrent(row);
      // this.$axios.post("downloadPatrolLog", {"data": {"id": row.id}}, { responseType: 'blob' }).then(res => {
      //   console.log(res);
      // });
      this.$axios({
        url: `${path.requestUrl}/downloadPatrolLog`,
        method: "post",
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        // data: qs.stringify({
        //   data: {
        //     id: row.id
        //   }
        // }),
        params: {
          data: {
            id: row.id
          }
        },
        responseType: 'blob'
        // responseType: 'arraybuffer'
      }).then(res => {
        console.log(res);
        const { data, headers } = res;
        const fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1');
        // console.log(escape(fileName));
        // console.log(decode(escape(fileName)));
        // 此处当返回json文件时需要先对data进行JSON.stringify处理，其他类型文件不用做处理
        // const blob = new Blob([JSON.stringify(data)], ...)
        const blob = new Blob([data], { type: headers['content-type'] });
        let url = window.URL.createObjectURL(blob);
        // 制作a标签
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.download = decodeURI(escape(fileName));//todo 不能解析特殊字符：#
        // link.download=fileName;
        // link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); //下载完成移除元素
        window.URL.revokeObjectURL(url); //释放掉blob对象
      });
    },
    setCurrent (row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    download (res) {
      console.log(res.headers);
      // 文件流是application/octet-stream？
      if (!res) {
        return
      }
      const { data, headers } = res;
      const fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1');
      console.log(fileName);
      // 此处当返回json文件时需要先对data进行JSON.stringify处理，其他类型文件不用做处理
      //const blob = new Blob([JSON.stringify(data)], ...)
      // const blob = new Blob([data], { type: headers['content-type'] });
      // let url = window.URL.createObjectURL(blob);
      // // 制作a标签
      // let link = document.createElement('a');
      // link.style.display = 'none';
      // link.href = url;
      // // link.download = decodeURI(fileName)
      // link.setAttribute('download', fileName);//文件名确定,手动换成xlsx也是没有数据，只有时间
      // // link.setAttribute('download', 'response.xls');//todo文件名确定,手动换成xlsx也是没有数据，只有时间
      // document.body.appendChild(link);
      // link.click();
      //!使用 Blob 对返回的 stream 进行解析，同时使用 URL.createObjectURL 将 blob 转换为一个 url 再进行下载，下载完毕后再对 url 进行释放!
    }
    // getTdStyle ({ row, column, rowIndex, columnIndex }) {
    //   if (row.patrolresult=="完成") {
    //     return { color: "red" }
    //   }
    // },
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