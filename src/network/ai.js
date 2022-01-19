import { request } from './request';
import store from '@/store/index.js';

// 获取ai数据
export function getAiData (pageIndex, pageSize, type, stime, etime, regionid = store.state.regionid) {
  return request({
    url: '/getAiData',
    params: {
      data: {
        pageIndex: pageIndex || "",
        pageSize: pageSize || "",
        type: type || "",
        stime: stime || "",
        etime: etime || "",
        regionid: regionid || ""
      }
    }
  })
}
// 告警类型
export function getAiType () {
  return request({
    url: '/getAiType',
  })
}