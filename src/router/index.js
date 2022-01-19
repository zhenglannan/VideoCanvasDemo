import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import("views/login/Login")

const Home = () => import("views/home/Home")
const Home2 = () => import("views/home/Home2")

const EnvMonitor = () => import("views/envMonitor/EnvMonitor")
const ListMonitor = () => import("views/envMonitor/child/ListMonitor")
const MapMonitor = () => import("views/envMonitor/child/MapMonitor")
const TableMonitor = () => import("views/envMonitor/child/TableMonitor")
const ThreeMonitor = () => import("views/envMonitor/child/ThreeMonitor")

const VideoMonitor = () => import("views/videoMonitor/VideoMonitor")

const NotFoundComponent = () => import("common/404/NotFoundComponent")

Vue.use(VueRouter)

const routes = [
  // 重定向路径页面
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/404',
    component: NotFoundComponent,
  },
  {
    // 登录
    path: '/login',
    component: Login,
  },
  {
    // 首页
    path: '/home',
    name: 'Home',//命名路由
    component: Home,
    meta: {
      title: '智辅平台'
    }
  },
  {
    // 首页2
    path: '/home2',
    name: 'Home2',//命名路由
    component: Home2,
    meta: {
      title: '智辅平台'
    }
  },
  {
    //环境监控
    path: '/envMonitor',
    component: EnvMonitor,
    redirect: '/envMonitor/list',
    name: 'EnvMonitor',
    meta: {
      title: '环境监测'
    },
    children: [{
      path: 'list',
      component: ListMonitor,
      name: 'ListMonitor',
    }, {
      path: 'map',
      component: MapMonitor,
      name: 'MapMonitor',
    }, {
      path: 'table',
      component: TableMonitor,
      name: 'TableMonitor',
    }, {
      path: 'three',
      component: ThreeMonitor,
      name: 'ThreeMonitor',
    },]
  },
  {
    //视频监测
    path: '/videoMonitor',
    component: VideoMonitor,
    name: 'VideoMonitor',
    meta: {
      title: '视频监测'
    },
  },
  // 由于路由表是由上至下匹配的，一定要将任意匹配规则至于最底部，否则至于此路由规则下的路由将全部为404组件，无法正确匹配。
  { path: '*', redirect: '/404' }
]

const router = new VueRouter({
  // mode: 'history',//!历史模式路由嵌套路由会出错
  base: process.env.BASE_URL,//跟vue.config.js里的publicPath绑定
  routes
})

// 同步路由？
// router.onError((error) => {
//   const pattern = /Loading chunk (\d)+ failed/g;
//   const isChunkLoadFailed = error.message.match(pattern);
//   const targetPath = router.history.pending.fullPath;
//   if (isChunkLoadFailed) {
//     router.replace(targetPath);
//   }
// });
export default router
