<template>
  <div></div>
</template>
 
<script>
import path from '@/settings'
import 'utils/mqttws31'

export default {
  name: 'Mqtt',
  data () {
    return {
      mqtt: null,
      host: path.streamIp,
      port: path.mqttPort
    };
  },
  methods: {
    onConnect () {
      console.log("connected.");
      // let i = 0;
      // let timer = setInterval(() => {
      //   i++;
        // var raw_message = "信息!";
      //   // 发送报文
        // message = new Paho.MQTT.Message(raw_message);
        // message.destinationName = "mqtttest";
        // console.log("sending message: " + raw_message);
        // this.mqtt.send(message);
      //   if (i >= 5) {
      //     clearInterval(timer);
      //   }
      // }, 1000);

      // 订阅 download topic
      var subOptions = {
        qos: 1,
        onSuccess: this.onSubscribe,
      };
      // 可订阅多个主题
      // this.mqtt.subscribe("center/reportdata/#", subOptions);//数据中心--实时数据
      this.mqtt.subscribe("webserver/cameracapture/", subOptions);//首页--视频巡航
      this.mqtt.subscribe("webserver/reportevent/", subOptions);//java告警事件
      this.mqtt.subscribe("webserver/reportdata/", subOptions);//实时数据
      this.mqtt.subscribe("webserver/reply/", subOptions);//下发指令回复
    },
    //不能单独订阅？
    Subscribe (topic,qos) {
      this.mqtt.subscribe(topic, {
        qos: qos,
        onSuccess: this.onSubscribe,
      });
    },
    // 订阅主题成功事件
    onSubscribe (context) {
      console.log("subscribe success");
      console.log(context);
    },
    // 连接失败事件
    onFailure (message) {
      console.log(message);
      console.log("connect failed.");
    },
    // onMessageArrived 事件(接收报文)
    onMessageArrived (message) {
      // console.log("new message arrived...");
      // console.log(message);
      this.$emit("onMessageArrived", message);
    },
    //连接丢失
    onConnectionLost (responseObject) {
      if (responseObject.errorCode === 0) {
        console.log('连接已断开')
      } else {
        console.log('异常：连接丢失' + responseObject.errorMessage)
      }
    },
    // 建立 MQTT websocket 连接(id为""可以同一页面多个组件同时订阅)
    MQTTconnect (id="") {
      console.log("connecting to " + this.host + ":" + this.port);
      // this.mqtt = new Paho.MQTT.Client(this.host, this.port, "");//clientid不能一样,同一个id连接多次就重新连接
      // this.mqtt = new Paho.MQTT.Client(this.host, this.port+"/mqtt/", id);//clientid不能一样,同一个id连接多次就重新连接
      this.mqtt = new Paho.MQTT.Client(this.host, this.port, id);//clientid不能一样,同一个id连接多次就重新连接
      var options = {
        timeout: 3,
        onSuccess: this.onConnect,
        onFailure: this.onFailure,
        userName: "test",
        password: "test",
        mqttVersion: 4,
      };
      this.mqtt.onMessageArrived = this.onMessageArrived;
      this.mqtt.onConnectionLost = this.onConnectionLost;
      this.mqtt.connect(options);
    }
  },
  created () {
    // this. MQTTconnect()
  }
}
</script>
 
<style lang='scss'>
</style>