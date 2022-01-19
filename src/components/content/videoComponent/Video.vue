<template>
  <div class="videowrapper">
    <div class="toolbox">
      <el-select v-model="value">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
        <img src="~assets/image/videoMonitor/resize.png" alt="">
        <img src="~assets/image/videoMonitor/stop.png" alt="">
      </el-select>
    </div>
  </div>
</template>
 
<script>
export default {
  name: 'Video',
  data () {
    return {
      value: '1',
      options: [{
        value: '1',
        label: '子码流'
      }, {
        value: '0',
        label: '主码流'
      }]
    };
  },
  methods: {}
}
</script>
 
<style lang='scss' scoped>
.videowrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .toolbox {
    height: 32px;
    text-align: right;
  }
}
</style>