<template>
  <svg :class="svgClass" aria-hidden="true" ref="svg">
    <use :href="iconName" />
  </svg>
</template>
 
<script>
export default {
  name: 'SvgIcon',
  data () {
    return {};
  },
  methods: {
  },
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    svgClass () {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    },
    iconName () {
      return `#icon-${this.iconClass}`
    },
  }
}
</script>
 
<style lang='scss'>
// svg {
//   width: 100%;
//   height: 100%;
// }
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>  