import { request } from './request';
import store from '@/store/index.js';

// 环境设备类型
export function getAllSensorType(type) {
  return request({
    url: '/getSensorType', 
    params:{
      data:{
        type:type
      }
    }
  })
}

/**
 *光字牌
 *
 * @export
 * @param {string} [monitortype=""]
 * @param {string} [modelkind=""]
 * @param {*} page
 * @param {*} pageSize
 * @param {*} [regionid=store.state.regionid]
 * @return {*} 
 */
export function getAllSensor(monitortype="",modelkind="",page,pageSize,regionid=store.state.regionid) {
  return request({
    url: '/getAllSensor',
    params:{
      region:regionid,
      data:{
        monitortype:monitortype,
        modelkind:modelkind,
        page:page,
        pageSize:pageSize,
      }
    }
  })
}

/**
 *svg接线图
 *
 * @export
 * @param {*} type 区别环境监测和在线监测地图
 * @param {*} [regionid=store.state.regionid]
 * @return {*} 
 */
export function getRegionMap(type,regionid=store.state.regionid) {
  return request({
    url: '/getRegionMap',
    params:{
      type:type,
      region:regionid,
    }
  })
}

/**
 *列表数据
 *
 * @export
 * @param {*} monitortype 监测类型
 * @param {*} page 当前页
 * @param {*} pageSize 每页数量
 * @param {*} modelkind  传感器类型
 * @param {*} [regionid=store.state.regionid] 
 * @return {*} 
 */
export function getAllSensorTable(monitortype,page,pageSize,modelkind,regionid=store.state.regionid) {
  return request({
    url: '/getAllSensorTable',
    params:{
      data:{
        monitortype:monitortype||'',
        regionid:regionid,
        pageIndex:page,
        pageSize:pageSize,
        modelkind:modelkind||'',
      }
    }
  })
}

/**
 *历史数据获取局放3d曲面数据
 *
 * @export
 * @param {*} sensorid 传感器id
 * @param {*} stime 开始时间
 * @param {*} etime 结束时间
 * @param {*} [regionid=store.state.regionid] 区域id
 * @return {*} 
 */
export function getThreeDdata(sensorid,stime,etime,regionid=store.state.regionid) {
  return request({
    url: '/getThreeDdata',
    params:{
      data:{
        sensorid:sensorid,
        stime:stime||'',
        etime:etime||'',
        regionid:regionid,
      }
    }
  })
}

/**
 *实时数据获取局放数据
 *
 * @export
 * @param {*} sensorid 传感器id
 * @param {*} [regionid=store.state.regionid]
 * @return {*} 
 */
export function getGisRealData(sensorid,regionid=store.state.regionid) {
  return request({
    url: '/getGisRealData',
    params:{
      data:{
        sensorid:sensorid,
        regionid:regionid,
      }
    }
  })
}