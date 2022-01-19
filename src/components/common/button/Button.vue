<template>
  <div :style="{width:width,height:height}">
    <div class="btn-container" :class="{active:isActive}">
      <slot></slot>
    </div>
  </div>
</template>
 
<script>
export default {
  name: 'Button',
  data () {
    return {};
  },
  props: {
    width: {
      type: String,
      default: '119px'
    },
    height: {
      type: String,
      default: '40px'
    },
    path: {
      type: String,
      //  required:true
    }
  },
  methods: {},
  computed: {
    isActive () {
      return this.$route.path.indexOf(this.path) !== -1
    }
  }
}
</script>
 
<style lang='scss' scoped>
.btn-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url("~assets/image/env/topbtn.png") ;
  color: #4d84af;
  line-height: 1;
  cursor: pointer;
  text-align: center;
  padding: 12px 11px;
  font-size: var(--font-size);
  &:hover {
    background: url("~assets/image/env/topbtnActive.png");
  }
}
.active {
  color: #d1ebff;
  background: url("~assets/image/env/topbtnActive.png");
}
</style>
