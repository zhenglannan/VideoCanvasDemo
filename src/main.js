import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import './element-variables.scss'//?可以在base.scss中引用吗
// 引入本地的iconfont文件
import 'assets/lib/iconfont/iconfont.css'
import 'icons' //icon svg
// require('echarts/lib/chart/bar');
// require('echarts/lib/component/tooltip');
// require('echarts/lib/component/title');
Vue.config.productionTip = false

import * as echarts from 'echarts';
import 'echarts-gl';
Vue.prototype.$echarts = echarts;//全局引入 echarts

import axios from 'axios'
Vue.prototype.$axios = axios

import _ from 'lodash'
Vue.prototype._ = _
// const WebSocket = require('ws');

import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'

Vue.use(contentmenu)
  
// todo 定义全局过滤器,不实现？
import vfilter from 'filters/index'
Object.keys(vfilter).forEach(key => {
  Vue.filter(key, vfilter[key]);
})
// Vue.filter("formatDate",vfilter.formatDate)

Vue.use(ElementUI);
// Vue.use(WebSocket);
 // vue实例是可以作为s事件总线的
 Vue.prototype.$bus = new Vue()
 
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
