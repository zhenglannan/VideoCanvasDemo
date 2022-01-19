import { request } from './request';
import qs from 'qs'
import store from '@/store/index.js';
// 登录(post)
export function login (formData) {
  return request({
    url: '/loginIn',
    method: 'post',
    params: {//?怎么才能不在url中带参？
      data: f_encrypt(JSON.stringify(formData))
    }
  })
}
// todo因为实例配置原因好像无法用axios自带这种方式？
// export function login (formData) {
//   return request.post("/loginIn",{data: f_encrypt(JSON.stringify(formData))})
// }
// 地图数据
export function getMapRegionNum (mapregionid = store.state.mapregionid, userid = store.state.userid) {
  return request({
    url: '/getMapRegionNum',
    params: {
      data: {
        regionid: mapregionid,
        userid: userid,
      }
    }
  })
}
// 查询站房经纬度信息
export function getRegionInfo (mapregionid = store.state.mapregionid, userid = store.state.userid) {
  return request({
    url: '/getRegionInfo',
    params: {
      data: {
        regionid: mapregionid,
        userid: userid,
      }
    }
  })
}
// 历史告警
export function getHistoryAlarm (userid = store.state.userid) {
  return request({
    url: '/getHistoryAlarmData',
    method: 'get',
    params: {
      userid: userid
    }
  })
}
/**
 *到设备节点的树接口
 *
 * @export
 * @param {*} nodetype 为sensor时查询带传感器的站房；为空时只查询站房
 * @param {*} [userid=store.state.userid]
 * @return {*} 
 */
 export function getRegionSensorTreeData (nodetype, userid = store.state.userid) {
  return request({
    url: '/getRegionSensorTreeData',
    params: {
      userid: userid,
      nodetype: nodetype || ''
    }
  })
}
// 获取站房统计
export function getStationState (userid = store.state.userid, mapregionid = store.state.mapregionid) {
  return request({
    url: '/getStationStateStatistics',
    params: {
      data: {
        userid: userid,
        regionid: mapregionid
      }
    }
  })
}
// 获取站房类型统计
export function getStationType (type, userid = store.state.userid, mapregionid = store.state.mapregionid) {
  return request({
    url: '/getStationTypeData',
    params: {
      data: {
        type: type,
        userid: userid,
        regionid: mapregionid,
      }
    }
  })
}
// 设备启动状态信息
// export function getDeviceStatus (userid = store.state.userid) {
//   return request({
//     url: '/getDeviceStatusData',
//     params: {
//       userid: userid
//     }
//   })
// }
// 设备启动状态信息
export function getSensorBar (userid = store.state.userid, mapregionid = store.state.mapregionid) {
  return request({
    url: '/getSensorBar',
    params: {
      data: {
        userid: userid,
        regionid: mapregionid
      }
    }
  })
}
// 获取视频巡航
export function getCameraCapture (userid = store.state.userid, mapregionid = store.state.mapregionid) {
  return request({
    url: '/getCameraCaptureData',
    params: {
      data: {
        userid: userid,
        regionid: mapregionid,
      }
    }
  })
}
// 获取当日告警分类统计
export function getSameDayAlarmLine (userid = store.state.userid, mapregionid = store.state.mapregionid) {
  return request({
    url: '/getSameDayAlarmLine',
    params: {
      data: {
        userid: userid,
        regionid: mapregionid,
      }
    }
  })
}
// export function getSameDayAlarm (type, userid = store.state.userid,mapregionid = store.state.mapregionid) {
//   return request({
//     url: '/getSameDayAlarmData',
//     params: {
//       type: type,
//       userid: userid,
//       regionid: mapregionid,
//     }
//   })
// }

// 设备统计
export function getSensorTypeEcharts (type, userid = store.state.userid, mapregionid = store.state.mapregionid) {
  return request({
    url: '/getSensorTypeEcharts',
    params: {
      data: {
        type: type,
        userid: userid,
        regionid: mapregionid,
      }
    }
  })
}
// 获取当前告警事件信息
export function getRealTimeAlarm (userid = store.state.userid, mapregionid = store.state.mapregionid) {
  return request({
    url: '/getRealTimeAlarmData',
    params: {
      data: {
        userid: userid,
        regionid: mapregionid,
      }
    }
  })
}

// 下发指令
export function ControlCommandIssue (options, userid = store.state.userid, sid = store.state.sid) {
  return request({
    url: '/ControlCommandIssue',
    params: {
      data: {
        sensorid: options.sensorid,
        pointid: options.pointid,
        value: options.value,
        state: options.state,//旧值
        modelkind: options.modelkind || "",
        ytoptioins: options.ytoptioins || "",
        // ytoptioins: [{ "id": "2401", "val": 0 }],
        // ytoptioins:"",
        userid: userid,
        sid: sid,
      },
    },
  })
}
// 站房总览--站房详情弹出框
export function getRegionState (userid = store.state.userid, mapregionid = store.state.mapregionid) {
  return request({
    url: '/getRegionState',
    params: {
      data: {
        userid: userid,
        regionid: mapregionid,
      }
    }
  })
}
// 站房总览--站房详情查看详情弹出框
export function getRegionEventData (regionid) {
  return request({
    url: '/getRegionEventData',
    params: {
      data: {
        regionid: regionid,
      }
    }
  })
}
// 设备启动状态-站房详情对话框
export function getRegionSensorState (type, userid = store.state.userid) {
  return request({
    url: '/getRegionSensorState',
    params: {
      data: {
        userid: userid,
        type: type,
      }
    }
  })
}
// 设备启动状态--根据站房查询设备启动状态
export function getRegionStartedDevice (regionid, type) {
  return request({
    url: '/getRegionStartedDevice',
    params: {
      data: {
        regionid: regionid,
        type: type,
      }
    }
  })
}
// 获取视频巡航--历史抓捕数据
export function getHistoryCameraCapture (stime = "", etime = "", userid = store.state.userid, mapregionid = store.state.mapregionid) {
  return request({
    url: '/getHistoryCameraCapture',
    params: {
      data: {
        stime: stime,
        etime: etime,
        userid: userid,
        regionid: mapregionid,
      }
    }
  })
}
// 获取地图  --当日告警TOP3
export function getRegionAlarmNum (userid = store.state.userid, mapregionid = store.state.mapregionid) {
  return request({
    url: '/getRegionAlarmNum',
    params: {
      data: {
        userid: userid,
        regionid: mapregionid
      }
    }
  })
}
// 获取地图  --当日控制下发TOP3
export function getRegionControlNum (userid = store.state.userid, mapregionid = store.state.mapregionid) {
  return request({
    url: '/getRegionControlNum',
    params: {
      data: {
        userid: userid,
        regionid: mapregionid
      }
    }
  })
}
// 地图--站房设备在线率 TOP3
export function getSensorOnlineRate (type = "", userid = store.state.userid, mapregionid = store.state.mapregionid) {
  return request({
    url: '/getSensorOnlineRate',
    params: {
      data: {
        type: type,
        userid: userid,
        regionid: mapregionid
      }
    }
  })
}
// 地图--站房设备离线率 TOP3
export function getSensorOfflineRate (type = "", userid = store.state.userid, mapregionid = store.state.mapregionid) {
  return request({
    url: '/getSensorOfflineRate',
    params: {
      data: {
        type: type,
        userid: userid,
        regionid: mapregionid
      }
    }
  })
}
// 地图--获取站房在线离线的设备详情
export function getOnOffLineSensor (id, type = "", userid = store.state.userid) {
  return request({
    url: '/getOnOffLineSensor',
    params: {
      data: {
        type: type,
        userid: userid,
        regionid: id
      }
    }
  })
}
// 雷达图
export function getRealTimeRadar (userid = store.state.userid, mapregionid = store.state.mapregionid) {
  return request({
    url: '/getRealTimeRadar',
    params: {
      data: {
        userid: userid,
        regionid: mapregionid
      }
    }
  })
}
