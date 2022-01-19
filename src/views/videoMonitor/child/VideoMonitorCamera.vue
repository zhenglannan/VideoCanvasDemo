<template>
  <!-- <div> -->
  <ul>
    <li
      v-for="(item,index) in cameraList"
      :key="item.sensorid"
      @click="sendCameraid(item.sensorid,index)"
      :class="{active:currentIndex===index}"
    >
      <i class="el-icon-camera"></i>
      <span>{{item.sensoridname }}</span>
    </li>
  </ul>
  <!-- </div> -->
</template>
 
<script>
import { getCameraList } from 'network/video'
export default {
  name: 'VideoMonitorCamera',
  data () {
    return {
      cameraList: [],
      currentIndex: "",
    };
  },
  props: {
    regionid: {
      type: [String, Number]
    }
  },
  methods: {
    getData (regionid) {
      getCameraList(regionid).then(res => {
        this.cameraList = res.data;
      })
    },
    sendCameraid (id, index) {
      this.$emit("send-cameraid", id);
      this.currentIndex = index;
    },
  },
  watch: {
    regionid (nval, oval) {
      this.getData(nval);
    }
  },
  created () {
    // this.getData(this.$store.state.regionid);
    this.getData(this.regionid);
  }
}
</script>
 
<style lang='scss' scoped>
ul{
  height: 295px;
    overflow: hidden;
    overflow-y: auto;
}
li {
  cursor: pointer;
  color: var(--color-text);
  padding: 10px;
  span {
    padding-left: 10px;
  }
}
li:hover {
  background: var(--color-background);
  color: var(--color-high-text);
}
.active {
  background: var(--color-background);
  color: var(--color-high-text);
}
</style>