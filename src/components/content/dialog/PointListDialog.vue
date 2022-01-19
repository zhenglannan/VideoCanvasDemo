<template>
  <el-dialog
    :title="list?list.sensoridname:''"
    :visible.sync="visual"
    width="54%"
    height="61%"
    :modal-append-to-body="false"
    :before-close="handleClose"
  >
    <div class="title">
      <p>名称</p>
      <p>值</p>
      <p>单位</p>
      <p>时间</p>
    </div>
    <ul>
      <li
        v-for="item in list?list.pointlist:''"
        :key="item.sensorid"
        v-show="item.sensorpointidname!='设备网络状态'&&item.remotetype!='yk'&&item.remotetype!='yt'"
        :style="list.networkstate=='0'?stateColor(-2):stateColor(item.eventlevel)"
      >
        <div class="liWrapper">
          <p>{{item.sensorpointidname}}</p>
          <!--如果用括号括起来，过滤器就不识别:{{info.status == '1' ? '进行中' : (info.modified_time |getFormateTime) }} -->
          <!-- formatter 3元表达式不能实现过滤器？只能全局使用过滤器方法？只能这样调用? -->
          <!-- <p>{{list.networkstate=="0"?"--":(item.remotetype=='yc'?(item.value|formatter) : getValue(item))}}{{list.networkstate=='0'?'':item.eventtypeText.trim()}}</p> -->
          <p>{{list.networkstate=="0"?"--":(item.remotetype=='yc'?$options.filters.formatter(item.value) : getValue(item))}}{{list.networkstate=='0'?'':(item.eventtypeText?item.eventtypeText.trim():"")}}</p>
          <!-- <p>{{list.networkstate=="0"?"--":item.value|formatter()}}{{list.networkstate=='0'?'':item.eventtypeText.trim()}}</p> -->
          <p>{{item.unit}}</p>
          <p>{{item.time}}</p>
        </div>
      </li>
    </ul>
  </el-dialog>
</template>
 
<script>
import { getEnumValue } from 'utils/index'
export default {
  name: 'PointListDialog',
  data () {
    return {
      visual: false,
    };
  },
  props: {
    list: {
      type: Object,
      default: null
    }
  },
  methods: {
    handleClose (done) {
      this.visual = false;
    },
    stateColor (eventlevel) {
      if (eventlevel == -1 || eventlevel == -9999) {//正常
        return 'color:#4ECDFF'
      } else if (eventlevel == -2) {//离线
        return 'color:#A7C7D4'
      } else if (eventlevel == 1) {//预警
        return 'color:#FF8826'
      } else if (eventlevel == 2||eventlevel == 3) {//告警(3为遥信变位告警)
        return 'color:#FF3D1F'
      }
    },
    getValue: function (item) {
      return getEnumValue(item.datadesctype, item.value)
    }
  },
  // filters: {
  //   // 值包含-9999，为--
  //   formatter: function (value, that) {
  //     if (value.indexOf("-9999") > -1) {
  //       return '--'
  //     }
  //     return value
  //   },
  // },
}
</script>
 
<style lang='scss' scoped>
ul {
  max-height: 300px;
  overflow-y: auto;
  li {
    // color: #f2f6fc;
    padding: 4px 0;
    font-size: 16px;
    .liWrapper {
      display: flex;
      justify-content: space-around;
      p {
        width: 100%;
        text-align: center;
        white-space: nowrap;
      }
    }
  }
}
.title {
  display: flex;
  justify-content: space-around;
  color: #f2f6fc;
  padding-right: 5px; //ul有滚动条，为title与数值居中需要向左移动一点
  p {
    // padding: 4px;
    font-size: 16px;
    width: 100%;
    text-align: center;
  }
}
</style>