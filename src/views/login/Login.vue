<template>
  <div id="login">
    <div class="loginGroup">
      <div class="logintitle">
        <span>{{$store.state.webTitle}}</span>
      </div>
      <div class="loginPanel">
        <span>账户登录</span>
        <p v-show="isShow" style="color:red">用户名或密码错误</p>
        <el-form ref="form" :model="form" label-width="80px">
          <el-input
            placeholder="请输入用户名"
            prefix-icon="el-icon-user-solid"
            v-model="form.username"
            clearable
            autocomplete="off"
          ></el-input>
          <el-input
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            v-model="form.password"
            show-password
            clearable
            autocomplete="off"
            @keyup.enter.native="onSubmit(form)"
          ></el-input>
          <!-- <button type="primary" @click.prevent="onSubmit(form)">登录</button> -->
          <el-button
            :loading="loading"
            type="primary"
            style="width:100%;margin-top:60px;"
            @click.prevent="onSubmit(form)"
          >登录</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>
 
<script>
export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      loading: false,
      isShow: false
    };
  },
  methods: {
    onSubmit (form) {
      this.loading = true;
      this.$store.dispatch("login", form).then((res) => {
        this.loading = false
        console.log(res);
        if (res == "success") {
          this.$router.replace('/home');
        } else {
          this.isShow = true;
        }
      }).catch((res) => {
        console.log(res);
        this.loading = false;
        this.$message({
          type: 'warning',
          message: '服务器断开连接',
        });
      })
    },
  },
  beforeCreate () {
    sessionStorage.clear();
    this.$axios("static/config.json").then(res => {
      const title = res.data.name;
      this.$store.commit("SET_WEBTITLE", title);
      // todo 
      document.title = title;
    })
  }
}
</script>
 
<style lang='scss' scoped>
#login {
  width: 100%;
  height: 100%;
  background: url("~assets/image/login/loginBg.png");
  position: relative;
  .loginGroup {
    position: absolute;
    left: 1060px;
    top: 0;
    bottom: 0;
    // margin: auto;
    width: 610px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .loginPanel {
      width: 610px;
      height: 560px;
      background: url("~assets/image/login/loginBg2.png");
      padding: 81px 73px 78px 67px;
      & > span:first-child {
        font-size: 42px;
        color: #8beaff;
        font-weight: 400;
      }
      form {
        margin-top: 4px;
      }
      .el-input {
        margin-top: 33px;
      }
    }
    .logintitle {
      height: 37px;
      text-align: center;
      white-space: nowrap;
      margin-bottom: 40px;
      span {
        vertical-align: top;
        line-height: 40px;
        color: #c5f5fe;
        font-size: 60px;
        font-weight: 700;
      }
    }
  }
}
</style>
<style>
#login .el-input--prefix .el-input__inner {
  /* border-radius: 8px;
  border: 2px solid #3e85ff; */
  height: 54px;
  line-height: 54px;
}
#login .el-input--prefix .el-input__inner::placeholder {
  color: #8beaff;
  /* font-size: 20px; */
}
#login .el-button {
  background: url("~assets/image/login/loginBtnBg.png") no-repeat center/100%
    100%;
  height: 63px;
  font-size: 30px;
  color: #000f4f;
}
#login .el-input {
  background: url("~assets/image/login/loginInputBg.png") no-repeat center/100%
    100%;
  font-size: 20px;
  padding: 0 21px;
  letter-spacing: 1px;
  color: #8beaff;
  border: none;
}
#login .el-input__inner {
  background-color: transparent;
  border: none;
  color: #8beaff;
}
</style>