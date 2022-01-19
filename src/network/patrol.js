import { request } from './request';
import store from '@/store/index.js';

// 任务列表
export function getPatrolTask (regionid=store.state.regionid) {
  return request({
    url: '/getPatrolTask',
    params: {
      regionid: regionid,
    }
  })
}
// 下发任务
export function controlPatrolTask (patrolid, opt) {
  return request({
    url: '/controlPatrolTask',
    params: {
      data: {
        patrolid: patrolid,
        opt: opt,
      },
    }
  })
}
// 任务节点
export function getPatrolItem (patrolid) {
  return request({
    url: '/getPatrolItem',
    params: {
      data: {
        patrolid: patrolid,
      },
    }
  })
}
// 巡检任务日志
export function getPatrolLog (patrolid,stime="",etime="") {
  return request({
    url: '/getPatrolLog',
    params: {
      data: {
        patrolid: patrolid,
        stime:stime,
        etime:etime,  
      },
    }
  })
}
// 巡检点位日志
export function getPatrolItemLog (id) {
  return request({
    url: '/getPatrolItemLog',
    params: {
      data: {
        id: id,
      },
    }
  })
}
// 巡检日志--导出报表
export function downloadPatrolLog (id) {
  return request({
    url: '/downloadPatrolLog',
    method:"post",
    params: {
      data: {
        id: id,
      },
    },
    responseType: 'blob'
  })
}