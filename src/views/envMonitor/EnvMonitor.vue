<template>
  <pane-monitor>
    <Button class="topBtn" @click.native="$router.push('/envMonitor/list')" path="list">面板模式</Button>
    <Button
      class="topBtn"
      @click.native="$router.push('/envMonitor/map')"
      path="map"
      style="margin-left: 24px;"
    >鸟瞰模式</Button>
    <Button
      class="topBtn"
      @click.native="$router.push('/envMonitor/table')"
      path="table"
      style="margin-left: 24px;"
    >列表模式</Button>
    <Button class="topBtn" @click.native="$router.push('/envMonitor/three')" path="three">三维模式</Button>
  </pane-monitor>
</template>
 
<script>
import Button from "components/common/button/Button";

import PaneMonitor from "content/paneMonitor/PaneMonitor";
export default {
  name: 'EnvMonitor',
  data () {
    return {
    };
  },
  components: {
    PaneMonitor,
    Button
  },
}
</script>