<template>
  <div class="listwrapper">
    <div class="con allBtn" @click="sendId()">全部</div>
    <div class="typecontainer"></div>
    <p v-show="isShowBottom">
      <i class="el-icon-bottom"></i>
    </p>
  </div>
</template>
 
<script>
import $ from 'jquery'
export default {
  name: 'ListMontorType',
  props: {
    typeData: {
      type: Array,
    }
  },
  data () {
    return {
      // 核心数据
      // li: {
      //   size: 8,//设备个数
      //   itemSize: 6,//显示个数
      //   data: [
      //     {
      //       "itemcode": "tist",
      //       "name": "红外对射"
      //     },
      //     {
      //       "itemcode": "tlig",
      //       "name": "灯光"
      //     },
      //     {
      //       "itemcode": "ttah",
      //       "name": "温湿度"
      //     },
      //     {
      //       "itemcode": "twtr",
      //       "name": "水浸"
      //     },
      //     {
      //       "itemcode": "tsf6",
      //       "name": "六氟化硫"
      //     },
      //     {
      //       "itemcode": "tsmk",
      //       "name": "烟雾传感器"
      //     },
      //     {
      //       "itemcode": "tdrm",
      //       "name": "门禁"
      //     },
      //     {
      //       "itemcode": "tdrm",
      //       "name": "门禁"
      //     }
      //   ],
      // },
      endTime: new Date(),//节流
      li: null,
      fistName: 0,
      endName: 0,
    };
  },

  methods: {
    // 初始化渲染
    beginIte (li) {
      let typeArr = li.data;
      for (let j = 0; j < li.itemSize; j++) {
        if (typeArr[j]) {//判断是否为undefined（这次不是字符串形式的了？）
          $(".typecontainer").append(
            // "<div class='con' name=" + (j + 1) + " id=" + typeArr[j].itemcode + "><img :src='imgUrl("+typeArr[j].itemcode+")'></img>" + '&nbsp;&nbsp;&nbsp;&nbsp;' + typeArr[j].name + "</div>"
            // "<div class='con' name=" + (j + 1) + " id=" + typeArr[j].itemcode + "><img :src='require(assets/image/envicon/" + typeArr[j].itemcode + "_-2.png)'></img>" + '&nbsp;&nbsp;&nbsp;&nbsp;' + typeArr[j].name + "</div>"
            `<div class="con" name="${j + 1}" id="${typeArr[j].itemcode}"><span class='pdf-${typeArr[j].itemcode}'></span><label title='${typeArr[j].name}'>${typeArr[j].name}</label></div>`
          );
          // $(`.pdf_${typeArr[j].itemcode}`).css("background-image",`url(../../../../../assets/image/envicon/${typeArr[j].itemcode}_-2.png) no-repeat center/100% 100%`)
        }
      }
    },
    // imgUrl(itemcode){
    //   return require("assets/image/envicon/"+itemcode+"_-2.png")
    // },
    getData (li, position) {
      return { name: li.data[position].name, id: li.data[position].itemcode };
    },
    setlocate () {
      this.setlocation(300, 50, 15, this.li.itemSize);
    },
    // 三角函数设置位置
    setlocation (R, top, ROff, contentSize) {
      let qual = R / contentSize; //总长度一半的 X轴等分
      let n = 1;
      for (var i = 1; i <= contentSize; i++) {
        let conSi = Math.round(contentSize / 2);
        if (i <= conSi) {
          let x = qual * i; // x的值
          let left = R - Math.sqrt(R * R - x * x); //y的值
          // console.log(conSi - i);
          $(".typecontainer")
            .children()
            .eq(conSi - i)
            .css({ top: top, left: left + ROff });
        } else {
          let x = qual * n; // x的值
          let left = R - Math.sqrt(R * R - x * x); //y的值
          $(".typecontainer")
            .children()
            .eq(i - 1)
            .css({ top: top, left: left + ROff });
          n++;
        }
      }
    },
    handleScroll (e) {
      let $fr = $(".typecontainer").children(":first-child");
      let fistName = parseInt($fr.attr("name"));
      this.fistName = fistName;
      let firstId = $fr.attr("id");

      let $en = $(".typecontainer").children(":last-child");
      let endName = parseInt($en.attr("name"));
      this.endName = endName;
      let endId = $en.attr("id");

      let len = this.li.size;
      if (new Date() - this.endTime < 200) return console.log("忽略");//?
      if (e.wheelDeltaY < 0) {
        //往下
        if (endName == len) {
          return
        }
        // if (endName < len) {
        let na = endName + 1;
        let data = this.getData(this.li, na - 1);
        $("#" + endId).after(
          "<div class='con' name=" +
          na +
          " id=" +
          data.id +
          "><span class='pdf-" + data.id + "'></span><label title=" + data.name + ">" + data.name + "</label></div>"
        );
        // } else {
        // return
        // $("#" + endId).after(
        //   "<div class='con' id=" +
        //   this.getData(this.li, 0).id +
        //   " name=" +
        //   1 +
        //   ">" +
        //   this.getData(this.li, 0).name +
        //   "</div>"
        // );
        // }
        $(`#${firstId}`).remove();
      } else {
        //往上
        if (fistName == 1) {
          return
        }
        // if (fistName > 1 && fistName <= len) {
        let dna = fistName - 1;
        let data = this.getData(this.li, dna - 1);
        $("#" + firstId).before(
          "<div class='con' id=" +
          data.id +
          " name=" +
          dna +
          "><span class='pdf-" + data.id + "'></span><label title=" + data.name + ">" + data.name + "</label></div>"
        );
        // } else {
        //   $("#" + firstId).before(
        //     "<div class='con' id=" +
        //     this.getData(this.li, len - 1).id +
        //     " name=" +
        //     len +
        //     ">" +
        //     this.getData(this.li, len - 1).name +
        //     "</div>"
        //   );
        // }
        $("#" + endId).remove();
      }
      //container.style.transform = `translateY(-${i * 100}px)`
      this.endTime = new Date();
      this.setlocate();
    },
    initData () {
      this.li = {
        size: this.typeData.length,
        itemSize: 6,//类型显示几个
        data: this.typeData
      }
      this.$nextTick(() => {
        this.beginIte(this.li);//离线无法渲染？
        this.setlocate();
      })
    },
    sendId (id) {
      this.$emit("select-type", id);
      // 点击全部时取消选中效果
      if (!id) {
        $(".typecontainer").children().removeClass("active");
      }
    }
  },
  mounted () {
    // 不在mounted中立即调用created中产生的data中的数据，在获取数据后就调用?还是设置setTimeOut?
    let _this = this;
    // window.addEventListener('mousewheel', this.handleScroll, false);
    this.$nextTick(() => {
      document.getElementsByClassName("typecontainer")[0].addEventListener("mousewheel", this.handleScroll, false);
    })
    $(".typecontainer").on("click", "div", function () {//jquery里的this不是vue的实例，需要把this赋值给另一个实例
      $(this).addClass("active").siblings().removeClass("active");
      _this.sendId($(this).attr("id"))
    });
  },
  computed: {
    isShowBottom () {
      return this.li ? this.li.size > this.li.itemSize : false
    },
  },
  watch: {
    typeData (val) {
      this.initData();
    }
  },
  created () {
    this.initData()
  }
}
</script>
 
<style lang='scss'>
// 图标类型名称
$list: ttah, o2, o3, tacd, tdeh, twtt, tdrm, tdrm, telr, tfan, tidd, tist, tlig,
  tsf6, tsmk, twlv, twtr, frbr, shbr, trtm, sctm, ct, la, pt, transformer, tnoi,
  tbmo, ttwl, tpds;

.listwrapper {
  width: 284.28px;
  height: 900px;
  position: relative;
  background: url("~assets/image/env/right.png");
  font-family: PingFangSC-Medium;
  .active {
    border: 1px solid #1c46ff;
  }
  .allBtn {
    left: 118px;
    top: 100px;
    z-index: 9999;
    text-align: center;
  }
  .typecontainer {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 43px;
    margin: auto;
    width: 240px;
    height: 671px;
  }
  .con {
    width: 154px;
    height: 54px;
    background: url("~assets/image/env/typewrapper.png");
    position: relative;
    // text-align: center;
    line-height: 54px;
    cursor: pointer;
    margin-top: 36px;
    color: #ffffff;
    &:hover {
      border-radius: 35px;
      background: linear-gradient(91deg, #406ed3 0%, rgba(5, 11, 71, 0.5) 100%);
    }
    span {
      width: 154px;
      height: 54px;
      // display: inline-block;
      position: absolute;
      cursor: pointer;
      z-index: 99999;

      // background-size: 23%;
      // background-position-x: 15px;
    }
    label {
      left: 54px;
      position: absolute;
      // !无法悬浮显示，z-index靠后
      // width: 133px;
      // overflow: hidden;
      // text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  @mixin bg($img) {
    background: url("~assets/image/envicon/#{$img}.png") no-repeat 10px/23%;
  }
  @each $item in $list {
    .pdf-#{$item} {
      @include bg("#{$item}_-2");
      &:hover {
        @include bg("#{$item}_-1");
      }
    }
  }
  p {
    position: absolute;
    color: #fff;
    font-size: 40px;
    bottom: 61px;
    right: 43px;
  }
}
</style>