// const fileUrl//文件服务路径
// const streamIp;//流媒体服务IP
// const streamPort;//流媒体服务Port
// const mapUrl;//站房地图origin
// const socketUrl;//socket url
// const requestUrl;//socket url
const protocol = window.location.protocol;
const hostname = window.location.hostname;
if (process.env.NODE_ENV === "development") {
  // fileUrl = "http://192.168.90.57:8097";
  // // streamIp = "192.168.90.57";
  // streamIp = "192.168.91.160";
  // streamPort = "8087";
  // mapUrl = "http://192.168.90.57:8082";
  // // socketUrl = "http://192.168.91.88:18082/imserver";
  // socketUrl = "http://192.168.90.57:18082/imserver";
  // requestUrl = "";
  // mqttPort = 18840;

  // fileUrl = "http://192.168.90.57:8097";
  // streamIp = "192.168.90.57";
  // streamPort = "8087/";
  // mapUrl = "http://192.168.90.57:8082";
  // socketUrl = "http://192.168.90.57:18082/imserver";//!
  // requestUrl = "";
  // mqttPort = 18840;

  fileUrl = "http://192.168.91.94:6060/ftp/";
  streamIp = "192.168.91.96";
  streamPort = "6060/media/";
  mapUrl = "http://192.168.91.149:6060";
  socketUrl = "http://192.168.91.96:6060/java_socket/odywebsocket";//!
  // socketUrl = "http://192.168.91.88:18082/odywebsocket";//!
  requestUrl = "";
} else {
  // ! 有代理
  fileUrl = `${protocol}//${hostname}:6060/ftp/`;
  streamIp = hostname;
  streamPort = "6060/media/";
  mapUrl = window.location.origin;
  socketUrl = `${protocol}//${hostname}:6060/java_socket/odywebsocket`;
  // socketUrl = `${protocol}//${hostname}:6060/java_socket/imserver`;
  requestUrl = `${protocol}//${hostname}:6060/java_backend/`;
  // !90.57更新路径 无代理
  // fileUrl = `${protocol}//${hostname}:8097`;
  // streamIp = hostname;
  // streamPort = "8087";
  // mapUrl = window.location.origin;
  // socketUrl = `${protocol}//${hostname}:18082/imserver`;
  // requestUrl = `${protocol}//${hostname}:18082`;
  // mqttPort = 18840;
}

module.exports = {
  fileUrl: fileUrl,
  streamIp: streamIp,
  streamPort: streamPort,
  mapUrl: mapUrl,
  socketUrl: socketUrl,
  requestUrl: requestUrl,
}