//app.js
import util from './utils/util';
import http from '@chunpu/http';
import {urls} from './utils/webservice.js';
import Ready from 'min-ready';

const ready = Ready()

App({
  onLaunch: function (options) {
    util.promisify(wx.checkSession)().then(() => {
      //console.log('session 生效')
      return this.getUserInfo()
    }).then(userInfo => {
      console.log('登录成功', userInfo)
    }).catch(err => {
      console.log(`自动登录失败, 重新登录`, err)
      return this.login()
    }).catch(err => {
      console.log(`手动登录失败`, err)
    });
  },


  login() {
    //console.warn('登录')
    return util.promisify(wx.login)().then(({
      code
    }) => {
      return http.post(urls.LOGIN, {
        code,
        type: 'wxapp'
      });
    }).then((r) => {
      //写入/更新token
      wx.setStorageSync('token', r.data['token']);
      wx.setStorageSync('token_expire_time', r.data['token_expire_time']);
      return this.getUserInfo()
    })
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
      if (token_expire_time >= new Date().getTime()) {
        return true;
      }
    }
    return false;
  },

  /* 
   * 获取用户信息
   */
  getUserInfo() {
    return http.get(urls.GET_USER_INFO).then(response => {
      let data = response.data;
      if (data && typeof data === 'object') {
        this.globalData.userInfo = data.user;
        this.globalData.merchant = data.merchant;
        ready.open();
        return data
      }
      return Promise.reject(response)
    })
  },
  /**
   * 检查用户是否为第一次登录
   */
  checkUserAuth() {
    if (!this.globalData.userInfo || this.globalData.userInfo['username'] == '') {
      this.gotoUserAuth();
    }
  },

  /**
   * 跳转用户授权页
   */
  gotoUserAuth() {
    console.log('跳转用户授权页');
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  /**
   * 准备队列
   */
  ready(func) {
    ready.queue(func)
  },

  globalData: {
    //用户信息
    userInfo: null,
    //商家
    merchant: null,
  }
})