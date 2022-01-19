import Vue from 'vue'
import Vuex from 'vuex'
import { guid } from 'utils/index'

Vue.use(Vuex)
import { login } from 'network/home'

const getDefaultState = () => {
  return {
    userid: sessionStorage.getItem("userid"),
    regionid: sessionStorage.getItem("regionid"),
    regionname: sessionStorage.getItem("regionname"),
    nickname: sessionStorage.getItem("nickname"),
    sid: guid(),//加了唯一标识,每次网页刷新更改
    mapregionid: "",
    style: sessionStorage.getItem("style"),
    webTitle:sessionStorage.getItem("webTitle"),
  }
}
const state = getDefaultState();
export default new Vuex.Store({
  // state: {
  //   userid: JSON.parse(sessionStorage.getItem("userid")),
  //   regionid: JSON.parse(sessionStorage.getItem("regionid")),
  //   nickname: JSON.parse(sessionStorage.getItem("nickname")),
  //   treeData: JSON.parse(sessionStorage.getItem("treeData")),
  // },
  state,
  mutations: {
    RESET_STATE: (state) => {
      Object.assign(state, getDefaultState())
    },
    SET_USERID (state, payload) {
      sessionStorage.setItem("userid", payload);
      // sessionStorage.setItem("userid", JSON.stringify(payload));
      state.userid = payload;
    },
    SET_NICKNAME (state, payload) {
      sessionStorage.setItem("nickname", payload);
      state.nickname = payload;
    },
    SET_REGIONID (state, payload) {
      sessionStorage.setItem("regionid", payload);
      state.regionid = payload;
    },
    SET_REGIONNAME (state, payload) {
      sessionStorage.setItem("regionname", payload);
      state.regionname = payload;
    },
    SET_MAPREGIONID (state, payload) {
      state.mapregionid = payload;
    },
    SET_STYLE (state, payload) {
      sessionStorage.setItem("style", payload);
      state.style = payload;
    },
    SET_WEBTITLE (state, payload) {
      sessionStorage.setItem("webTitle", payload);
      state.webTitle = payload;
    },
  },
  actions: {
    //登录
    login ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        login(payload).then(res => {
          if (res.message == "success") {
            commit("SET_USERID", res.userId);
            commit("SET_NICKNAME", res.nickname);
            resolve("success");
          } else {
            resolve("error");
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // logout ({ commit }, payload) {
    //   return new Promise((resolve, reject) => {

    //   })
    // }
  },
  // modules: {
  // }
})
