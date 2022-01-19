import { request } from './request';
import store from '@/store/index.js';


/**
 *站房在线离线设备个数
 *
 * @export
 * @param {*} [regionid=store.state.regionid]
 * @return {*} 
 */
export function getSersonOnlineCensus (regionid = store.state.regionid) {
  return request({
    url: '/getSersonOnlineCensus',
    params: {
      regionid: regionid,
    }
  })
}

/**
 *根据传感器类型或者站房获取传感器
 *
 * @export
 * @param {*} sensortype 传感器类型
 * @param {*} [region=store.state.regionid]
 * @return {*} 
 */
export function getSensorOfRegion (sensortype, region = store.state.regionid) {
  return request({
    url: '/getSensorOfRegion',
    params: {
      data: {
        region: region,
        sensortype: sensortype || ""
      }
    }
  })
}

/**
 *根据站房获取设备类型
 *
 * @export
 * @param {*} [regionid=store.state.regionid]
 * @return {*} 
 */
export function getSensorTypeOfStation (regionid = store.state.regionid) {
  return request({
    url: '/getSensorTypeOfStation',
    params: {
      regionid: regionid,
    }
  })
}

/**
 *设备类型对应的测点
 *
 * @export
 * @param {*} type 传感器类型
 * @return {*} 
 */
export function getSensorTypePoint (type) {
  return request({
    url: '/getSensorTypePoint',
    params: {
      type: type || '',
    }
  })
}


/**
 *查询历史表格
 *
 * @export
 * @param {*} options type:设备类型; tabletype表格类型 当为历史数据：data; 历史告警：alarm
 * @param {*} [regionid=store.state.regionid]
 * @return {*} 
 */
export function getHistoryTableData (options, regionid = store.state.regionid) {
  return request({
    url: '/getHistoryTableData',
    params: {
      data: {
        page: options.page,
        pagesize: options.pagesize,
        type: options.type || '',
        sensorid: options.sensorid || '',
        modelpointid: options.modelpointid || '',
        tabletype: options.tabletype,
        stime: options.stime,
        etime: options.etime,
        regionid: regionid,
      }
    }
  })
}

/**
 *告警数据图表 折线图
 *
 * @export
 * @param {*} options
 * @param {*} [regionid=store.state.regionid]
 * @return {*} 
 */
export function getFigureOne (options, regionid = store.state.regionid) {
  return request({
    url: '/getFigureOne',
    params: {
      data: {
        type: options.type,
        sensorid: options.sensorid,
        stime: options.stime,
        etime: options.etime,
        regionid: regionid,
      }
    }
  })
}

/**
 *告警数据图表 柱状图
 *
 * @export
 * @param {*} options
 * @param {*} [regionid=store.state.regionid]
 * @return {*} 
 */
export function getFigureTwo (options, regionid = store.state.regionid) {
  return request({
    url: '/getFigureTwo',
    params: {
      data: {
        type: options.type,
        sensorid: options.sensorid,
        stime: options.stime,
        etime: options.etime,
        regionid: regionid,
      }
    }
  })
}
/**
 *告警数据图表 散点图
 *
 * @export
 * @param {*} options
 * @param {*} [regionid=store.state.regionid]
 * @return {*} 
 */
export function getFigureThree (options, regionid = store.state.regionid) {
  return request({
    url: '/getFigureThree',
    params: {
      data: {
        type: options.type,
        sensorid: options.sensorid,
        stime: options.stime,
        etime: options.etime,
        regionid: regionid,
      }
    }
  })
}

// // 统计传感器类型
// export function getAllSensorType (type) {
//   return request({
//     url: '/getSensorType',
//     params: {
//       data: {
//         type: type
//       }
//     }
//   })
// }
// 生成报表
export function getSensorDataOfNearDate (objtype, sensortype, sensorid, type, stime, etime, page, pagesize, region = store.state.regionid) {
  return request({
    url: '/getSensorDataOfNearDate',
    params: {
      data: {
        objtype: objtype,
        sensortype: sensortype,
        sensorid: sensorid,
        type: type,
        stime: stime,
        etime: etime,
        page: page,
        pagesize: pagesize,
        regionid: region,
      },
    }
  })
}
// 获取所有告警信息--折线图(告警走势)
export function getAllAlarmDateLine (options, region = store.state.regionid) {
  return request({
    url: '/getAllAlarmDateLine',
    params: {
      data: {
        stime: options.stime,
        etime: options.etime,
        sensortype: options.sensortype || "",
        sensorid: options.sensorid || "",
        type: options.type || "",
        regionid: region,
      },
    }
  })
}
// 现存告警--柱状图（）
export function getRealAlearmDateBar (options, region = store.state.regionid) {
  return request({
    url: '/getRealAlearmDateBar',
    params: {
      data: {
        stime: options.stime,
        etime: options.etime,
        sensortype: options.sensortype || "",
        sensorid: options.sensorid || "",
        type: options.type || "",
        regionid: region,
      },
    }
  })
}
// 历史告警--柱状图
export function getHistoryAlearmDateBar (options, region = store.state.regionid) {
  return request({
    url: '/getHistoryAlearmDateBar',
    params: {
      data: {
        stime: options.stime,
        etime: options.etime,
        sensortype: options.sensortype || "",
        sensorid: options.sensorid || "",
        type: options.type || "",
        regionid: region,
      },
    }
  })
}
// 历史告警--饼图（告警占比）
export function getRealAlearmDatePie (options, region = store.state.regionid) {
  return request({
    url: '/getRealAlearmDatePie',
    params: {
      data: {
        stime: options.stime,
        etime: options.etime,
        sensortype: options.sensortype || "",
        sensorid: options.sensorid || "",
        type: options.type || "",
        regionid: region,
      },
    }
  })
}

// 历史事件  --折线图
export function getHistoryEventLine (options, region = store.state.regionid) {
  return request({
    url: '/getHistoryEventLine',
    params: {
      data: {
        objtype: options.objtype || "",
        stime: options.stime,
        etime: options.etime,
        sensortype: options.sensortype || "",
        sensorid: options.sensorid || "",
        type: options.type || "",
        regionid: region,
      },
    }
  })
}
// 历史事件  --饼图
export function getHistoryEventPie (options, region = store.state.regionid) {
  return request({
    url: '/getHistoryEventPie',
    params: {
      data: {
        objtype: options.objtype || "",
        stime: options.stime,
        etime: options.etime,
        sensortype: options.sensortype || "",
        sensorid: options.sensorid || "",
        type: options.type || "",
        regionid: region,
      },
    }
  })
}
// 历史事件  --柱状图
export function getSensorTypeEventBar (options, region = store.state.regionid) {
  return request({
    url: '/getSensorTypeEventBar',
    params: {
      data: {
        objtype: options.objtype || "",
        stime: options.stime,
        etime: options.etime,
        sensortype: options.sensortype || "",
        sensorid: options.sensorid || "",
        type: options.type || "",
        regionid: region,
      },
    }
  })
}
// 历史事件  --饼图
export function getSensorTypeEventPie (options, region = store.state.regionid) {
  return request({
    url: '/getSensorTypeEventPie',
    params: {
      data: {
        objtype: options.objtype || "",
        stime: options.stime,
        etime: options.etime,
        sensortype: options.sensortype || "",
        sensorid: options.sensorid || "",
        type: options.type || "",
        regionid: region,
      },
    }
  })
}

// 控制命令--折线图
export function getHistoryOplogLine (options, region = store.state.regionid) {
  return request({
    url: '/getHistoryOplogLine',
    params: {
      data: {
        objtype: options.objtype || "",
        stime: options.stime,
        etime: options.etime,
        sensortype: options.sensortype || "",
        sensorid: options.sensorid || "",
        type: options.type || "",
        regionid: region,
      },
    }
  })
}
// 控制命令--饼图
// export function getHistoryOplogPie (objtype="",stime, etime,sensortype="",sensorid="",type="", region = store.state.regionid) {
//   return request({
//     url: '/getHistoryOplogPie',
//     params: { 
//       data: {
//         objtype: objtype,
//         stime: stime,
//         etime: etime,
//         sensortype: sensortype,
//         sensorid: sensorid,
//         type: type,
//         regionid: region,
//       },
//     }
//   })
// }
// 控制命令--饼图
export function getHistoryOplogPie (options, region = store.state.regionid) {
  return request({
    url: '/getHistoryOplogPie',
    params: {
      data: {
        objtype: options.objtype || "",
        stime: options.stime,
        etime: options.etime,
        sensortype: options.sensortype || "",
        sensorid: options.sensorid || "",
        type: options.type || "",
        regionid: region,
      },
    }
  })
}

// 历史数据--折线图
export function getHistoryDataLine (options, region = store.state.regionid) {
  return request({
    url: '/getHistoryDataLine',
    params: {
      data: {
        objtype: options.objtype || "",
        stime: options.stime,
        etime: options.etime,
        sensortype: options.sensortype || "",
        sensorid: options.sensorid || "",
        type: options.type || "",
        regionid: region,
      },
    }
  })
}