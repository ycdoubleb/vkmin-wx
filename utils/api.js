import http from '@chunpu/http';
import md5 from 'md5.js';
import util from 'util';

export default class Api {
  //------------------------------------------------------------------------------------------
  //
  // API 路径
  //
  //------------------------------------------------------------------------------------------
  static APP_KEY = 'vk';
  // 秘钥
  static API_SECRET_KEY = 'vk_min_e';
  //API域名地址
  static BASE_URL = 'http://tt.api.vk.studying8.com'; //测试地址
  //BASE_URL: 'http://shareline.free.idcfengye.com', //外内测试
  //BASE_URL: 'https://api.vk.studying8.com', //生产机地址

  //授权
  static AUTH_LOGIN = '/v1/oauth/login';

  //登录
  static LOGIN = '/v1/user/login';

  //上传文件
  static FILE_UPLOAD = '/v1/file/upload';

  //解密
  static DECRYPTED_DATA = '/v1/user/decrypted-data';
  //获取用户信息
  static GET_USER_INFO = '/v1/user/get-info';
  //绑定用户账号信息
  static BIND_USER_INFO = '/v1/user/bind-info';
  //绑定用户手机
  static BIND_USER_PHONE = '/v1/user/bind-phone';

  // vk
  // 获取首页数据
  static GET_HOME_DATA = '/v1/vk/get-home-data';
  // 获取课程详情
  static GET_COURSE_DETAIL = '/v1/vk/get-course-detail';
  // 获取专题详情
  static GET_TOPIC_DETAIL = '/v1/vk/get-topic-detail';
  // 获取我的课程
  static GET_MY_COURSE = '/v1/vk/get-my-course';
  // 获取搜索信息
  static GET_SEARCH_INFO = '/v1/vk/get-search-info';
  // 保存学习记录
  static SAVE_LEARNING = '/v1/vk/save-learning';

  //------------------------------------------------------------------------------------------
  //
  // static public method
  //
  //------------------------------------------------------------------------------------------
  /**
   * 上传文件
   */
  static uploadImage(options = {}, loading = true) {
    const op = {
      count: 1
    };
    Object.assign(op, options);
    return util.promisify(wx.chooseImage)(op).then((res) => {
      if (loading) wx.showLoading();
      return util.promisify(wx.uploadFile)({
        url: Api.BASE_URL + Api.FILE_UPLOAD,
        filePath: res.tempFilePaths[0],
        name: 'file',
      }).then((res) => {
        const data = JSON.parse(res.data);
        if (loading) wx.hideLoading();
        return Promise.resolve(data.data);
      }).catch((e) => {
        if (loading) wx.hideLoading();
        wx.showModal({
          content: e.message || '上传失败',
          showCancel: false
        });
        return Promise.reject(e.message);
      })
    })
  }

  /**
   * get 请求
   * 
   * @param String url   接口地址,不带http://自动加上公共url
   * @param Object params 拼在url上的参数
   * 
   * @param Object options 选项
   *  Boolean showLoading 是否使用Loading
   *  String loadingTitle loading 显示标题
   *  Boolean showError 是否显示错误
   */
  static get(url, params = {}, options = {
    showLoading: true,
    loadingTitle: "",
    showError: true
  }) {
    const {
      showLoading,
      loadingTitle,
      showError
    } = options;
    if (showLoading) wx.showLoading({
      title: loadingTitle,
    });
    return http.get(url, {
      params
    }).then(r => {
      if (showLoading) wx.hideLoading();
      return Promise.resolve(r.data);
    }).catch(data => {
      if (showLoading) wx.hideLoading();
      if (showError) {
        wx.showModal({
          content: data.msg,
          showCancel: false,
        });
      }
      return Promise.reject(data);
    });
  }

  /**
   * post 请求
   * 
   * @param String url   接口地址,不带http://自动加上公共url
   * @param Object data postdata
   * @param Object params 拼在url上的参数
   * 
   * @param Object options 选项
   *  Boolean showLoading 是否使用Loading
   *  String loadingTitle loading 显示标题
   *  Boolean showError 是否显示错误
   */
  static post(url, data = {}, params = {}, options = {
    showLoading: true,
    loadingTitle: "",
    showError: true
  }) {
    const {
      showLoading,
      loadingTitle,
      showError
    } = options;
    if (showLoading) wx.showLoading({
      title: loadingTitle,
    });
    return http.post(url, data, {
      params
    }).then(r => {
      if (showLoading) wx.hideLoading();
      return Promise.resolve(r.data);
    }).catch(data => {
      if (showLoading) wx.hideLoading();
      if (showError) {
        wx.showModal({
          content: data.msg,
          showCancel: false,
        });
      }
      return Promise.reject(data);
    });
  }
}

//----------------------------------------------------------------------------------------------------------
//
// http
//
//----------------------------------------------------------------------------------------------------------
const qs = http.qs;
http.init({
  baseURL: Api.BASE_URL,
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
    return Promise.reject(data);
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
  if (config.method == 'GET') {
    data = util.getUrlkey(config.url);
  } else {
    data = config.data === undefined ? {} : JSON.parse(config.data);
  }
  //如果有sign字段先删除
  delete data['sign'];
  data = Object.assign(data, {
    appkey: Api.APP_KEY,
    timestamp: new Date().getTime()
  });
  //排序合并
  var data_str_arr = [];
  for (var i in data) {
    data_str_arr.push(i + data[i]);
  }
  data_str_arr.sort();
  const API_SECRET_KEY = Api.API_SECRET_KEY;
  data['sign'] = md5(API_SECRET_KEY + data_str_arr.join("") + API_SECRET_KEY).toUpperCase();
  //重新设置config
  if (config.method == 'GET') {
    config.url = util.getUrlBaseUrl(config.url) + '?' + util.covertObjectToUrl(data);
  } else {
    config.data = JSON.stringify(data);
  }

  return config;
});