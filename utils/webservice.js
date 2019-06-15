import http from '@chunpu/http';
import md5 from 'md5.js';
import util from 'util';

//----------------------------------------------------------------------------------------------------------
//
// API 路径
//
//----------------------------------------------------------------------------------------------------------
const urls = {
  //API域名地址
  //BASE_URL: 'http://tt.apisj.shareline.wskeee.top', //测试地址
  //BASE_URL: 'http://shareline.free.idcfengye.com', //外内测试
  BASE_URL: 'https://apisj.shareline.gchndzkj.com', //生产机地址

  //登录
  LOGIN: '/v1/oauth/login',

  //上传文件
  FILE_UPLOAD:'/v1/file/upload',

  //解密
  DECRYPTED_DATA:'/v1/user/decrypted-data',

  //获取用户信息
  GET_USER_INFO: '/v1/user/get-info',

  //绑定用户账号信息
  BIND_USER_INFO: '/v1/user/bind-info',

  //绑定用户手机
  BIND_USER_PHONE: '/v1/user/bind-phone',

  //提现准备
  USER_WITHDRAWAL_READY: '/v1/user/withdrawal-ready',

  //提现 
  USER_WITHDRAWAL: '/v1/user/withdrawal',

  //获取提现记录
  USER_GET_WITHDRAWAL_LIST: '/v1/user/get-withdrawal-list',

  //获取流水记录
  GET_WALLET_LOG_LIST: '/v1/user/get-wallet-log-list',

  //获取订单列表
  GET_ORDER_LIST: '/v1/order/get-list',

  //获取订单详情
  GET_ORDER_DETAIL:'/v1/order/get-order-detail',

  //获取代理商家
  GET_AGENCY: '/v1/agency/get-agency',

  //商户申请准备
  MERCHANT_APPLY_READY:'/v1/merchant/apply-ready',

  //商户申请
  MERCHANT_APPLY: '/v1/merchant/apply',

  //获取商户销售数据
  MERCHANT_GET_SALE_INFO: '/v1/merchant/get-sale-info',

  //获取商店订单
  MERCHANT_GET_ORDER_LIST: '/v1/merchant/get-order-list',

}


//----------------------------------------------------------------------------------------------------------
//
// http
//
//----------------------------------------------------------------------------------------------------------
const qs = http.qs
http.init({
  baseURL: urls.BASE_URL,
  wx
});
//http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

http.interceptors.response.use(response => {
  // 展开 response.data 并处理错误 code
  var {
    data
  } = response;
  Object.assign(response, data);
  if (data.code != '0') {
    return Promise.reject(new Error(data.msg || 'error'));
  }
  return response
})

http.interceptors.response.use(response => {
  var {
    status
  } = response
  if (status >= 400) {
    return Promise.reject(new Error('error'))
  }
  return response
})

http.interceptors.response.use(response => {
  // 种 cookie
  var {
    headers
  } = response
  var cookies = headers['set-cookie'] || ''
  cookies = cookies.split(/, */).reduce((prev, item) => {
    item = item.split(/; */)[0]
    var obj = qs.parse(item)
    return Object.assign(prev, obj)
  }, {})
  if (cookies) {
    return util.promisify(wx.getStorage)({
      key: 'cookie'
    }).catch(() => {}).then(res => {
      res = res || {}
      var allCookies = res.data || {}
      Object.assign(allCookies, cookies)
      return util.promisify(wx.setStorage)({
        key: 'cookie',
        data: allCookies
      })
    }).then(() => {
      return response
    })
  }
  return response
})

/**
 * 给请求带上 cookie
 */
http.interceptors.request.use(config => {
  return util.promisify(wx.getStorage)({
    key: 'cookie'
  }).catch(() => {}).then(res => {
    if (res && res.data) {
      Object.assign(config.headers, {
        Cookie: qs.stringify(res.data, ';', '=')
      })
    }
    return config
  })
})

/**
 * 给请求带上 token
 * headers [token] = XXXXXX
 */
http.interceptors.request.use(config => {
  return util.promisify(wx.getStorage)({
    key: 'token'
  }).catch(() => {}).then(res => {
    if (res && res.data) {
      Object.assign(config.headers, {
        token: res.data
      })
    }
    return config
  })
})

/**
 * 给请求带上 sign timestamp appkey 作接口机校检
 * headers [token] = XXXXXX
 */
http.interceptors.request.use(config => {
  var data = config.data === undefined ? {} : JSON.parse(config.data);
  if (config.method == 'GET'){
    data = util.getUrlkey(config.url);
  }else{
    data = config.data === undefined ? {} : JSON.parse(config.data);
  }
  //如果有sign字段先删除
  delete data['sign'];
  data = Object.assign(data, {
    appkey: 'shareline',
    timestamp: new Date().getTime()
  });
  //排序合并
  var data_str_arr = [];
  for (var i in data) {
    data_str_arr.push(i + data[i]);
  }
  data_str_arr.sort();
  data['sign'] = md5('wskeee' + data_str_arr.join("") + 'wskeee').toUpperCase();
  //重新设置config
  if (config.method == 'GET') {
    config.url = util.getUrlBaseUrl(config.url) + '?' + util.covertObjectToUrl(data);
  } else {
    config.data = JSON.stringify(data);
  }

  return config;
})

var webservice = module.exports = {
  urls: urls
}