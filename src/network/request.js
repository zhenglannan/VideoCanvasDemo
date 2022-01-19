import axios from 'axios'
import path from '@/settings'
import { Message } from 'element-ui';
export function request (config) {
  // 1.创建axios实例
  const instance1 = axios.create({
    baseURL: path.requestUrl,
    // baseURL: process.env.VUE_APP_BASE_API,
    timeout: 10000
  })
  // 2.axios的拦截器
  // 请求拦截
  instance1.interceptors.request.use(config => {
    // console.log(config);
    // 拦截之后必须要返回，不然拿不到数据
    return config
  }, err => {
    console.log(err);
    return Promise.reject(err);//?axios的catch中处理？
  }),
    // 响应拦截
    instance1.interceptors.response.use(res => {
      // console.log(res);
      // 返回真正需要的值
      return res.data
    }, err => {
      console.log(err);
      Message.closeAll();
      Message.warning("服务器断开连接");
      return Promise.reject(err);//?axios.catch中打印？
    })

  return instance1(config)
}
