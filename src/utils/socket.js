import { Message } from 'element-ui' //单独引用
// import 'element-ui/lib/theme-chalk/index.css'//element-ui的css
import path from '@/settings'
let socket;
let timer = null;
// let params;//发服务端消息参数
// let callback;//回调函数
var lockReconnect = true;  //避免ws重复连接

// 创建连接以及初始化回调
function createWebSocket (params, callback) {
  // !如果你的服务所在的域是HTTPS的，那么使用的WebSocket协议也必须是wss, 而不能是ws
  socket = new WebSocket(path.socketUrl.replace("https", "wss").replace("http", "ws"));
  init(params, callback);
}

function init (params, callback) {
  // 连接成功回调
  socket.onopen = function () {
    console.log("socket连接成功");
    socket.send(params);
  };
  //获得消息
  socket.onmessage = function (msg) {
    lockReconnect = false;
    heartCheck.reset().start();
    // if(msg.data!=="连接成功"){
    //   JSON.parse()
    // }
    // 收到{type:"heartbeat","data":"heartbeat"}就发送heartbeat
    if (msg.data.indexOf('heartbeat') !== -1) {
      socket.send(msg.data);
    } else {
      callback(msg.data, socket);
    }
  };
  //关闭事件
  socket.onclose = function (e) {
    console.log("socket已关闭");
    //!1006 用于期望收到状态码时连接非正常关闭 (也就是说, 没有发送关闭帧).该错误码一般出现在断网时。大多情况都是因为websocket 连接在nginx 配置的 proxy_read_timeout 内没有收到数据，nginx主动发起的连接断开（不是客户端主动断开，也不是服务端主动断开的)。
    //! nginx使用proxy模块时，默认的读取超时时间是60s。
    console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
    lockReconnect = true;
    reconnect(params, callback);
  };
  //连接过程中失败事件
  socket.onerror = function (msg) {
    Message.closeAll();
    Message.error('获取实时数据失败，请稍后再试。')
    console.log("socket连接错误");
    lockReconnect = true;
    reconnect(params, callback);
  };
}

export function getSocket (params, callback) {
  // params = params;
  // callback = callback;
  if (typeof (WebSocket) == 'undefined') {
    console.log('您的浏览器不支持WebSocket');
  } else {
    //todo 在页面切换之后需要主动的将websocket进行断开操作
    if (socket) {
      socket.close();//!切换页面时也会触发重连,直接调用重连函数
      socket = null;
    }
    createWebSocket(params, callback);
  }
};

// 重连
function reconnect (params, callback) {
  
  clearTimeout(timer);
  timer = setTimeout(function () {     //没连接上会一直重连，设置延迟避免请求过多
    // !必须调用方法才行，不然不能调用init()就不能触发onerror
    if (lockReconnect) {
      // console.log(11);
      createWebSocket(params, callback);
    }
    // lockReconnect = false;
  }, 2000);
  // if (lockReconnect) return;
  // lockReconnect = true;
  // clearTimeout(timer);
  // timer = setTimeout(function () {     //没连接上会一直重连，设置延迟避免请求过多
  //   // !必须调用方法才行，不然不能调用init()就不能触发onerror
  //   createWebSocket(params, callback);
  //   lockReconnect = false;
  // }, 10000);
}

//心跳检测
var heartCheck = {
  // timeout: 5000,        //9分钟发一次心跳
  timeout: 10000,        //9分钟发一次心跳
  timeoutObj: null,
  serverTimeoutObj: null,
  reset: function () {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  },
  start: function () {
    var self = this;
    this.timeoutObj = setTimeout(function () {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      socket.send('{type:"heartbeat","data":"heartbeat"}');
      console.log("heartbeat!")
      self.serverTimeoutObj = setTimeout(function () {//如果超过一定时间还没重置，说明后端主动断开了
        socket.close();     //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
      }, self.timeout)
    }, this.timeout)
  }
}