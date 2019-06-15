//----------------------------------------------------------------------------------------------------------
//
// covertObjectToUrl 转换对象为 URL字符
//
//----------------------------------------------------------------------------------------------------------
const covertObjectToUrl = data => {
  var arr = [];
  for (var i in data) {
    arr.push(encodeURIComponent(i) + "=" + encodeURIComponent(data[i]));
  }
  return arr.join('&');
}

// url参数解析
const getUrlkey = (url) => {
  var params = {};
  var urls = url.split("?");
  var arr = urls[1] ? urls[1].split("&") : [];
  for (var i = 0, l = arr.length; i < l; i++) {
    var a = arr[i].split("=");
    params[a[0]] = a[1];
  }
  return params;
}

//获取基本路径
const getUrlBaseUrl = (url) => {
  if (url && url != "") {
    return url.split("?")[0];
  }
  return '';
}
//----------------------------------------------------------------------------------------------------------
//
// formatTime
//
//----------------------------------------------------------------------------------------------------------
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/**
 * 时间戳大转日期时间
 */
const formatDateTime = timestamp => {
  return formatTime(new Date(timestamp * 1000));
}

/**
 * 时间戳转时间格式
 */
const formatTimeByInt = value => {
  const hour = Math.floor(value / 3600);
  const minute = Math.floor(value % 3600 / 60);
  const second = value - hour * 3600 - minute * 60;
  return [hour, minute, second].map(formatNumber).join(':');
}

/**
 * 时间格式化处理
 */
const formatDate = (fmt, date) => { //author: meizz   
  var o = {
    "M+": date.getMonth() + 1, //月份   
    "d+": date.getDate(), //日   
    "h+": date.getHours(), //小时   
    "m+": date.getMinutes(), //分   
    "s+": date.getSeconds(), //秒   
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
    "S": date.getMilliseconds() //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//----------------------------------------------------------------------------------------------------------
//
// promisify
//
//----------------------------------------------------------------------------------------------------------
const promisify = original => {
  return function(opt) {
    return new Promise((resolve, reject) => {
      opt = Object.assign({
        success: resolve,
        fail: reject
      }, opt)
      original(opt)
    })
  }
}

var util = module.exports = {
  formatTime: formatTime,
  formatTimeByInt,
  formatDateTime,
  formatDate,

  promisify,
  covertObjectToUrl,
  getUrlkey,
  getUrlBaseUrl,
}