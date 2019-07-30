//app.js
import util from './utils/util';
import http from '@chunpu/http';
import Api from './utils/api.js';
import EventBus, {
  EventName
} from './utils/event.js';

App({
  onLaunch: function(options) {
    if (!this.checkTokenValid()) {
      // 未登录或者登录过期
      console.log('未登录或者登录过期');
      this.onLogin(false);
    } else {
      util.promisify(wx.checkSession)().then(() => {
        console.log('session 生效')
        return this.getUserInfo();
      }).then(user => {
        this.onLogin(true, {
          user
        });
        console.log('登录成功', user);
      }).catch(err => {
        console.log(`自动登录失败, 重新登录`, err)
        this.onLogin(false);
      })
    }
  },

  /**
   * 认证
   */
  auth() {
    return util.promisify(wx.login)().then(({
      code
    }) => {
      // 第三方登录
      return Api.post(Api.AUTH_LOGIN, {
        code,
        type: 'wxapp'
      }).then((data) => {
        this.saveLocal(data);
        // 检查用户是否授权，授权后可读取用户昵称和头像，未授权则跳转授权页
        if (this.checkUserAuth(true)) {
          this.onLogin(true, data);
        }
      });
    });
  },

  /**
   * 退出登录
   */
  logout() {
    this.globalData.hasLogin = false;
    wx.setStorageSync('token', null);
    wx.setStorageSync('token_expire_time', null);

    const bus = this.globalData.bus;
    bus.emit(EventName.LOGOUT);
  },

  /**
   * 保存本地
   * @param Boolean success 登录成功
   * @param Object data     登录数据
   */
  onLogin: function(success, data = {}) {
    console.log('onLogin', success,data);
    this.globalData.hasLogin = success;
    if (success) {
      this.saveLocal(data);

      const bus = this.globalData.bus;
      bus.emit(EventName.LOGIN, {
        success,
        user: this.globalData.user
      });
    }
  },

  /**
   * 保存本地
   */
  saveLocal(data) {
    if (data['user']) {
      wx.setStorageSync('user', data['user']);

      this.globalData.user = data['user'];
    }
    if (data['token']) wx.setStorageSync('token', data['token']);
    if (data['token_expire_time']) wx.setStorageSync('token_expire_time', data['token_expire_time']);
  },

  /* 
   *检查token是否有效 
   */
  checkTokenValid() {
    //读取token,token_expire_time
    var token = wx.getStorageSync('token');
    var token_expire_time = wx.getStorageSync('token_expire_time');
    //token不存在或者已经超时
    if (token && token_expire_time) {
      if (token_expire_time * 1000 >= new Date().getTime()) {
        return true;
      }
    }
    return false;
  },

  /**
   * 获取用户
   */
  getUser() {
    const isNotAuth = !this.globalData.user || this.globalData.user['username'] == '';
    return isNotAuth ? null : this.globalData.user;
  },

  /* 
   * 获取用户信息
   */
  getUserInfo() {
    return Api.get(Api.GET_USER_INFO);
  },
  /**
   * 检查用户是否为第一次登录
   * @param Boolean gotoAuth 是否跳转授权页
   */
  checkUserAuth(gotoAuth = false) {
    if (!this.globalData.user || this.globalData.user['username'] == '') {
      if (gotoAuth) this.gotoUserAuth();
      return false;
    }
    return true;
  },

  /**
   * 跳转用户授权页
   */
  gotoUserAuth() {
    console.log('跳转用户授权页');
    wx.navigateTo({
      url: '/pages/auth/auth'
    })
  },

  //--------------------------------------------------------------------------------------
  //
  // globaData
  //
  //--------------------------------------------------------------------------------------
  /**
   * 是否已登录
   */
  getHasLogin(){
    return this.globalData.hasLogin;
  },

  /**
   * 事件总线
   */
  getBus(){
    return this.globalData.bus;
  },

  globalData: {
    //用户是否已登录
    hasLogin: false,
    //用户信息
    user: null,
    // eventbus
    bus: new EventBus()
  }
})