<template>
  <div>
    <ul>
      <li
        v-for="(item,index) in presetList"
        :key="item.presetname"
        @click="sendPresetno(item.presetno,index)"
        :class="{active:currentIndex===index}"
      >
        <i class="el-icon-video-camera-solid"></i>
        <span>{{item.presetnoname }}</span>
      </li>
    </ul>
  </div>
</template>
 
<script>
import { getPresetList, getPresetListBySensor } from 'network/video'
export default {
  name: 'VideoMonitorPresto',
  data () {
    return {
      presetList: [],
      currentIndex: "",
    };
  },
  props: {
    cameraid: {
      type: [String, Number]
    },
    type: {
      type: [String, Object],
      default: null
    }
  },
  methods: {
    getData () {
      // todo与视频弹框预置位用的统一的组件
      if (this.type == "sensor") {
        getPresetListBySensor(this.cameraid).then(res => {
          this.presetList = res.data;
        })
      } else {
        getPresetList(this.cameraid).then(res => {
          this.presetList = res.data;
        })
      }
    },
    sendPresetno (id,index) {
      this.$emit("send-presetno", id);
      this.currentIndex = index;
    },
  },
  watch: {
    cameraid (val) {
      this.getData();
    }
  }
}
</script>
 
<style lang='scss' scoped>
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