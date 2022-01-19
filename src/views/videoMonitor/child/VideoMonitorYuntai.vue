<template>
  <div>
    <div class="top">
      <!-- left -->
      <div class="yunpanwrapper">
        <div class="total">
          <div class="topBtn" @mousedown="control('top')" @mouseup="ptz_stop()"></div>
          <div class="bottomBtn" @mousedown="control('bottom')" @mouseup="ptz_stop()"></div>
          <div class="leftBtn" @mousedown="control('left')" @mouseup="ptz_stop()"></div>
          <div class="rightBtn" @mousedown="control('right')" @mouseup="ptz_stop()"></div>
          <div class="lefttopBtn" @mousedown="control('lefttop')" @mouseup="ptz_stop()"></div>
          <div class="righttopBtn" @mousedown="control('righttop')" @mouseup="ptz_stop()"></div>
          <div class="leftbottomBtn" @mousedown="control('leftbottom')" @mouseup="ptz_stop()"></div>
          <div class="rightbottomBtn" @mousedown="control('rightbottom')" @mouseup="ptz_stop()"></div>
          <div class="centerBtn" @mousedown="control('center')" @mouseup="ptz_stop()"></div>
        </div>
      </div>
      <!-- right -->
      <div>
        <div class="control">
          <div
            class="control_add_distance"
            @mousedown="control('add_distance')"
            @mouseup="control('add_distance_stop')"
          ></div>
          <p>缩放</p>
          <div
            class="control_less_distance"
            @mousedown="control('less_distance')"
            @mouseup="control('less_distance_stop')"
          ></div>
        </div>
        <div class="control">
          <div class="control_add_focus" @mousedown="control('add_focus')" @mouseup="control('add_focus_stop')"></div>
          <p>聚焦</p>
          <div class="control_less_focus" @mousedown="control('less_focus')" @mouseup="control('less_focus_stop')"></div>
        </div>
        <div class="control">
          <div
            class="control_add_aperture"
            @mousedown="control('add_aperture')"
            @mouseup="ptz_stop()"
          ></div>
          <p>光圈</p>
          <div
            class="control_less_aperture"
            @mousedown="control('less_aperture')"
            @mouseup="ptz_stop()"
          ></div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="range-slider">
        <input type="range" value="5" min="1" max="10" />
        <span class="range-value">0</span>
      </div>
    </div>
  </div>
</template>
 
<script>
export default {
  name: 'VideoMonitorYuntai',
  data () {
    return {
      speed:'',
    };
  },
  methods: {
    control (cmd) {
      // this.$emit("ptz_control",MPlayer.PTZ_LEFT_BOTTOM);
      if (cmd == 'top') {
        this.$emit("ptz_control", MPlayer.PTZ_TOP);
      } else if (cmd == 'bottom') {
        this.$emit("ptz_control", MPlayer.PTZ_BOTTOM);
      } else if (cmd == 'left') {
        this.$emit("ptz_control", MPlayer.PTZ_LEFT);
      } else if (cmd == 'right') {
        this.$emit("ptz_control", MPlayer.PTZ_RIGHT);
      } else if (cmd == 'lefttop') {
        this.$emit("ptz_control", MPlayer.PTZ_LEFT_TOP);
      } else if (cmd == 'righttop') {
        this.$emit("ptz_control", MPlayer.PTZ_RIGHT_TOP);
      } else if (cmd == 'leftbottom') {
        this.$emit("ptz_control", MPlayer.PTZ_LEFT_BOTTOM);
      } else if (cmd == 'rightbottom') {
        this.$emit("ptz_control", MPlayer.PTZ_RIGHT_BOTTOM);
      } else if (cmd == 'center') {
        this.$emit("ptz_control", MPlayer.PTZ_STOP);
      } else if (cmd == 'add_distance') {
        this.$emit("ptz_control", MPlayer.PTZ_ZOOM_IN);
      }else if (cmd == 'add_distance_stop') {
        this.$emit("ptz_control", MPlayer.PTZ_ZOOM_IN_STOP);
      } else if (cmd == 'less_distance') {
        this.$emit("ptz_control", MPlayer.PTZ_ZOOM_OUT);
      } else if (cmd == 'less_distance_stop') {
        this.$emit("ptz_control", MPlayer.PTZ_ZOOM_OUT_STOP);
      } else if (cmd == 'add_focus') {
        this.$emit("ptz_control", MPlayer.PTZ_FOCUS_IN);
      } else if (cmd == 'add_focus_stop') {
        this.$emit("ptz_control", MPlayer.PTZ_FOCUS_IN_STOP);
      } else if (cmd == 'less_focus') {
        this.$emit("ptz_control", MPlayer.PTZ_FOCUS_OUT);
      } else if (cmd == 'less_focus_stop') {
        this.$emit("ptz_control", MPlayer.PTZ_FOCUS_OUT_STOP);
      }else if (cmd == 'add_aperture') {
        this.$emit("ptz_control", MPlayer.PTZ_APERTURE_INCREASE);
      } else if (cmd == 'less_aperture') {
        this.$emit("ptz_control", MPlayer.PTZ_APERTURE_DECREASE);
      } else {
        this.$emit("ptz_control", cmd);
      }
    },
    ptz_stop () {
      this.control(MPlayer.PTZ_STOP);
    }
  },
  mounted () {
    var _this=this;
    $(".range-value").text($('.range-slider input[type="range"]').attr("value"));
    this.speed=$(".range-value").text();
    $('.range-slider input[type="range"]').on("input", function () {
      $(this)
        .next()
        .text($(this).val());
        _this.speed=$(this).val();
        // _this.$emit("send")
        
    });
  }
}
</script>
 
<style lang='scss' scoped>
@mixin imgPos($x, $y) {
  background: url("~assets/image/videoSprite.png") no-repeat $x $y;
}
@mixin rightIcon($x, $y) {
  @include imgPos($x, $y);
  width: 26px;
  height: 26px;
  margin-top: 3px;
  cursor: pointer;
}
.top {
  height: 190px;
  display: flex;
  .yunpanwrapper {
    width: 170px;
    position: relative;
    .total {
      width: 134px;
      height: 134px;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      @include imgPos(-16px, -16px);
      div {
        position: absolute;
        width: 12px;
        height: 9px;
        cursor: pointer;
      }
      .topBtn {
        @include imgPos(-166px, -16px);
        transform: rotate();
        left: 60px;
        top: 11px;
      }
      .bottomBtn {
        @include imgPos(-166px, -16px);
        transform: rotate(180deg);
        left: 64px;
        top: 113px;
      }
      .leftBtn {
        @include imgPos(-166px, -16px);
        transform: rotate(270deg);
        left: 10px;
        top: 62px;
      }
      .rightBtn {
        @include imgPos(-166px, -16px);
        transform: rotate(90deg);
        left: 113px;
        top: 62px;
      }
      .topBtn:hover,
      .bottomBtn:hover,
      .leftBtn:hover,
      .rightBtn:hover {
        @include imgPos(-166px, -76px);
      }
      .lefttopBtn {
        @include imgPos(-166px, -48px);
        // transform: rotate(90deg);
        left: 26px;
        top: 28px;
      }
      .righttopBtn {
        @include imgPos(-166px, -48px);
        transform: rotate(90deg);
        left: 97px;
        top: 28px;
      }
      .leftbottomBtn {
        @include imgPos(-166px, -48px);
        transform: rotate(270deg);
        left: 26px;
        top: 96px;
      }
      .rightbottomBtn {
        @include imgPos(-166px, -48px);
        transform: rotate(180deg);
        left: 97px;
        top: 96px;
      }
      .lefttopBtn:hover,
      .righttopBtn:hover,
      .leftbottomBtn:hover,
      .rightbottomBtn:hover {
        @include imgPos(-166px, -109px);
      }
      .centerBtn {
        width: 40px;
        height: 40px;
        @include imgPos(-166px, -136px);
        left: 48px;
        top: 47px;
      }
      .centerBtn:hover {
        @include imgPos(-232px, -136px);
      }
    }
  }
  .control {
    width: 140px;
    height: 36px;
    @include imgPos(-286px, -16px);
    margin-top: 21px;
    display: flex;
    justify-content: center;
    align-items: center;
    p {
      padding: 0 21px;
      color: #c3d4ff;
      text-shadow: 0px 2px 4px #0a1546;
      font-size: 14px;

      font-family: PingFangSC-Regular, PingFang SC; //字体解析失败
    }
    .control_add_distance {
      @include rightIcon(-286px, -68px);
    }
    .control_add_distance:hover {
      @include rightIcon(-380px, -68px);
    }
    .control_less_distance {
      @include rightIcon(-328px, -68px);
    }
    .control_less_distance:hover {
      @include rightIcon(-422px, -68px);
    }
    .control_add_focus {
      @include rightIcon(-286px, -110px);
    }
    .control_add_focus:hover {
      @include rightIcon(-380px, -110px);
    }
    .control_less_focus {
      @include rightIcon(-328px, -110px);
    }
    .control_less_focus:hover {
      @include rightIcon(-422px, -110px);
    }
    .control_add_aperture {
      @include rightIcon(-286px, -150px);
    }
    .control_add_aperture:hover {
      @include rightIcon(-380px, -150px);
    }
    .control_less_aperture {
      @include rightIcon(-328px, -150px);
    }
    .control_less_aperture:hover {
      @include rightIcon(-422px, -150px);
    }
  }
}
.bottom {
  // height: 80px;
  .range-slider {
    padding: 27px 0 0 20px;
  }
  .range-slider input[type="range"] {
    background: linear-gradient(156deg, #5177d7 0%, #175bbc 100%);
    border-image: linear-gradient(
        180deg,
        rgba(127, 158, 216, 1),
        rgba(57, 98, 207, 1)
      )
      1 1;
    box-shadow: 0px 0px 1px 0px #9bb5ff;
    width: calc(100% - (85px));
    height: 10px;
    border-radius: 5px;
    border: 1px solid #08164e;

    float: left;
    -webkit-appearance: none;
    position: relative;
  }
  .range-slider input[type="range"]::-webkit-slider-thumb {
    background: url("~assets/image/videoSprite.png") no-repeat -20px -246px;
    width: 20px;
    height: 30px;
    position: relative;
    top: 6px;
    cursor: pointer;
    -webkit-appearance: none; //;/*清除默认样式*/
    appearance: none;
  }
  .range-slider input[type="range"]::-webkit-slider-thumb:hover,
  .range-slider input[type="range"]:active::-webkit-slider-thumb {
    background: url("~assets/image/videoSprite.png") no-repeat -65px -246px;
  }
  .range-slider .range-value {
    color: #c3d4ff;
    background: url("~assets/image/video_speed.png");
    font-size: var(--font-size);
    text-align: center;
    line-height: 28px;
    width: 40px;
    height: 28px;
    margin-left: 11px;
    display: inline-block;
    position: relative;
    top: -11px;
  }
}
</style>