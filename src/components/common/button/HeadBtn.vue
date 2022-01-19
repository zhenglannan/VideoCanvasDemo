<template>
  <li :class="{active:isActive}">
    <slot></slot>
  </li>
</template>
 
<script>
export default {
  name: 'HeadBtn',
  data () {
    return {};
  },
  props: {
    path:{
       type: String,
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
li {
  display: inline-block;
  width: 102px;
  height: 70px;
  font-size: var(--font-size);
  color: #d1ebff;
  text-align: center;
  line-height: 70px;
  cursor: pointer;
  &:hover {
    background: url("~assets/image/liHover.png");
  }
  &.active {
    background: url("~assets/image/liHover.png");
  }
}
</style>