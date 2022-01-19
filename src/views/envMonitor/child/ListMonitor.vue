<template>
  <pane-list id="ListMonitor" monitortype="hjjc"></pane-list>
</template>
 
<script>
import PaneList from "content/paneList/PaneList";
export default {
  name: 'ListMonitor',
  data () {
    return {};
  },
  components: {
    PaneList
  },
}
</script>
<style>
#ListMonitor .el-dialog {
  background: url("~assets/image/dialogBg2.png") no-repeat center/100% 100% !important;
  width: 44% !important;
  padding: 30px 50px 29px 39px;
}
</style>