<template>
  <div class="devState">
    <svg-icon :icon-class="modelkind" style="    width: 52px;
    height: 46px;"></svg-icon>
    <span class="text">{{name}}</span>
    <span class="num">{{num}}</span>
  </div>
</template>
 
<script>
export default {
  name: 'DevOpenState',
  data () {
    return {};
  },
  methods: {},
  props:{
    name:{
      type:String
    },
    num:{
      type:Number,
      default:0
    },
    modelkind:{
      type:String
    }
  },
  // computed:{
  //   svg(){
  //     return this.modelkind
  //   }
  // }
}
</script>
 
<style lang='scss' scoped>
.devState {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .text {
    display: inline-block;
    width: 70px;
    font-size: 20px;
    color: #d4ecff;
    letter-spacing: 3px;
  }
  .num {
    width: 140px;
    height: 40px;
    background: #152873;
    border-radius: 3px;
    border: 1px solid #293773;
    font-size: 26px;
    font-family: LiGothicMed;
    color: #6fbbff;
    line-height: 40px;
    letter-spacing: 7px;
    text-align: center;
  }
}
.devState::after,
.devState::before {
  content: "";
  display: block;
}
</style>