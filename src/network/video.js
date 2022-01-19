import { request } from './request';

// 获取摄像机
export function getCameraList(regionid) {
  return request({
    url: '/getCamera',
    params:{
      region:regionid,
    }
  })
}

// 摄像机获取预置位
export function getPresetList(cameraid) {
  return request({
    url: '/getCameraPreset',
    params:{
      data:{sensorid:cameraid},
    }
  })
}
// 传感器获取预置位
export function getPresetListBySensor(cameraid) {
  return request({
    url: '/getCameraPreset',
    params:{
      data:{objectid:cameraid},
    }
  })
}