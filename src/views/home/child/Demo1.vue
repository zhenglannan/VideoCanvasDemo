<template>
  <div class="main1">
    <div class="top">
      <div class="amount">
        <!-- <svg-icon icon-class="homeAmount" style="    width: 110px;
        height: 103px;"></svg-icon>-->
        <div class="logo">
          <img src="~assets/image/home/homeLogo.png" alt style />
          <!-- <img src="~assets/image/homeLogo1.png" alt width="40px" height="40px" /> -->
        </div>
        <div class="amountRight">
          <div style="height:22px">
            <div class="simple-text-chart-container" ><p style="font-size: 18px; color: #67A0ED; right: 59px;position: absolute;">站房总数</p></div>
          </div>
          <div style="    padding-top: 17px;">
            <span v-for="(item,index) in getPdfSum" :key="index">{{item}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div>
        <p class="num">{{NormalSum}}</p>
        <p class="desc">正常</p>
      </div>
      <div></div>
      <div>
        <p class="num" style="color:#F5A623">{{AlarmSum}}</p>
        <p class="desc">异常</p>
      </div>
    </div>
  </div>
</template>
 
<script>
import { getStationState } from 'network/home';
import SvgIcon from '../../../components/content/SvgIcon/SvgIcon.vue';
export default {
  name: 'Demo1',
  data () {
    return {
      PdfSum: '',
      NormalSum: '',
      AlarmSum: '',
      // msg: '',
    };
  },
  components: {
    SvgIcon,
  },
  computed: {
    getPdfSum () {
      return this.PdfSum?this.PdfSum.split(""):0
    },
    // getNormalSum () {
    //   return this.NormalSum;
    // },
    // getAlarmSum () {
    //   return this.AlarmSum;
    // },
  },
  methods: {
    getData () {
      getStationState().then(res => {
        // console.log(res.data);
        this.PdfSum = res.data.PdfSum;
        this.NormalSum = res.data.NormalSum;
        this.AlarmSum = res.data.AlarmSum;
      })
    },
  },
  created () {
    this.getData();
  },
}
</script>
 
<style lang='scss' scoped>
.main1 {
  overflow: hidden;
  height: 100%;
  // padding-top: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .top {
    height: 130px;
    width: 100%;
    margin-bottom: 13px;
    .amount {
      display: flex;
      // align-items: center;
      // justify-content: center;
      .logo {
        position: relative;
        width: 200px;
        height: 180px;
        // & > img:first-child {
        //   animation-name: rotate;
        //   animation-iteration-count: infinite;
        //   animation-duration: 9s;
        //   animation-timing-function: linear;
        // }
        // & > img:last-child {
        //   position: absolute;
        //   left: 36px;
        //   top: 31px;
        // }
      }
      .amountRight {
        // width: 191px;
        height: 103px;
        display: inline-block;
        color: #67a0ed;
        text-align: center;
        padding-left: 13px;
        span {
          width: 35px;
          height: 50px;
          background: #162a79;
          border-radius: 4px;
          border: 1px solid #29376c;
          display: inline-block;
          margin-right: 5px;
          color: #4fcbd8;
          line-height: 50px; //垂直居中
          font-family: "DS-DIGI";
          font-size: 42px;
        }
      }
    }
  }
  .bottom {
    width: 100%;
    height: 70px;
    display: flex;
    align-items: center;
    div {
      width: 50%;
      text-align: center;
      height: 100%;
      display: inline-block;
      .desc {
        color: #83b2f0;
        padding: 20px;
      }
      .num {
        font-size: 28px;
        color: #57b0ff;
        letter-spacing: 2px;
        font-family: LiGothicMed;
      }
    }
    & > div:nth-child(2) {
      width: 1px;
      height: 50px;
      background: #1a3f72;
    }
  }
}
// logo旋转动画
// @-webkit-keyframes rotate {
//   from {
//     transform: rotate(0);
//   }
//   to {
//     transform: rotate(360deg);
//   }
// }
</style>