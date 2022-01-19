var mqtt={};
var host = "192.168.90.57";
var port = 18840;
export default{
  // onConnect 事件
   onConnect() {
    console.log("connected.");
    let i = 0;
    let timer = setInterval(() => {
      i++;
      var raw_message = "信息!" + i;
      // 发送报文
      message = new Paho.MQTT.Message(raw_message);
      message.destinationName = "mqtttest";
      console.log("sending message: " + raw_message);
      mqtt.send(message);
      if (i >= 5) {
        clearInterval(timer);
      }
    }, 1000);
    // 订阅 download topic
    var subOptions = {
      qos: 1,
      onSuccess: onSubscribe,
    };
    // 可订阅多个主题
    mqtt.subscribe("mqtttest", subOptions);
    mqtt.subscribe("access/reportdata/1", subOptions);//此次topic
    mqtt.subscribe("test-topic", subOptions);
  },
  // 订阅主题成功事件
   onSubscribe(context) {
    console.log("subscribe success");
    console.log(context);
  },
  // 连接失败事件
   onFailure(message) {
    console.log("connect failed.");
  },
  // onMessageArrived 事件(接收报文)
   onMessageArrived(message) {
    console.log("new message arrived...");
    console.log(message.payloadString);//收到节点在这里打印!
  },
  // called when a message arrives
   onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
    }
  },
  // 建立 MQTT websocket 连接
   MQTTconnect() {
    console.log("connecting to " + host + ":" + port);
    mqtt = new Paho.MQTT.Client(host, port, "clientid");
    var options = {
      timeout: 3,
      onSuccess: onConnect,
      onFailure: onFailure,
      userName: "test",
      password: "test",
      mqttVersion: 4,
    };
    mqtt.onMessageArrived = onMessageArrived;
    mqtt.onConnectionLost = onConnectionLost;
    mqtt.connect(options);
  },
  // MQTTconnect();
}