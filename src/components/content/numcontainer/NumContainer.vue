<template>
  <div class="main">
    <div>
      <slot name="icon"></slot>
    </div>
    <p>
      <slot name="num"></slot>
    </p>
    <hr />
    <p>
      <slot name="name"></slot>
    </p>
  </div>
</template>
 
<script>
export default {
  name: 'NumContainer',
  data () {
    return {};
  },
  methods: {}
}
</script>
 
<style lang='scss' scoped>
.main {
  // width: 100px;
  height: 160px;
  padding: 0 11px;
  border: 1px solid #053369;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
  color: #ffffff;
  text-align: center;
  display: flex;
  flex-flow: column;
  justify-content: space-evenly;
}
i {
  font-size: 25px;
}
</style>