/**
 * Date: 4/20/20
 */
export function getComputedStyle (el, key) {
  return el && el.currentStyle ? el.currentStyle[key] : window.getComputedStyle ? window.getComputedStyle(el, void 0).getPropertyValue(key) : el.style[key];
}
function padDate (value) {
  return value < 10 ? '0' + value : value;
}
// 格式化时间戳122124为具体时间
export function formateDate (value) {
  var date = new Date(value);
  var year = date.getFullYear();
  var month = padDate(date.getMonth() + 1);
  var day = padDate(date.getDate());
  var hour = padDate(date.getHours());
  var minute = padDate(date.getMinutes());
  var second = padDate(date.getSeconds());
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}
// 根据具体值获取枚举值
export function getEnumValue (datadesctype, value) {
  let txt = '';//状态文本值
  let arr = datadesctype.split(",");
  arr.forEach(item => {
    if (item.split(":")[0] == value) {
      txt = item.split(":")[1];
    }
  })
  return txt;
}
// 生成唯一值
export function guid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


