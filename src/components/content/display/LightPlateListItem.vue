<template>
  <li :style="pointStyle">
    <!-- <li> -->
    <slot></slot>
  </li>
</template>
 
<script>
export default {
  name: 'LightPlateListItem',
  data () {
    return {};  
  },
  methods: {},
  props: {
    // pointState: {
    //   type: [Number, String]
    // },
    eventlevel: {
      type: [Number, String]
    }
  },
  computed: {
    pointStyle () {
      if (this.eventlevel == -1) {//正常
        return "color:#A4D3FF"
      } else if (this.eventlevel == 1) {//预警
        return "color:#FF8826"
      } else if (this.eventlevel == 2||this.eventlevel == 3) {//告警
        return "color:#FF3D1F"
      }else if (this.eventlevel == -2) {//离线
        return "color:#A7C7D4"
      }
    }
  }
}
</script>
 
<style lang='scss' scoped>
</style>