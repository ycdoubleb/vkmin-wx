// pages/login/login.js
import http from '@chunpu/http';
import Api from '../../utils/api.js';

//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 绑定用户信息，包括头像、名称
   */
  bindUserInfo: function(e) {
    var detail = e.detail
    if (detail.iv) {
      http.post(Api.BIND_USER_INFO, {
        encryptedData: detail.encryptedData,
        iv: detail.iv,
        signature: detail.signature
      }).then(() => {
        return app.getUserInfo().then(
          (data) => {
            app.onLogin(true, {user: data});
            wx.navigateBack();
          }
        )
      })
    }
  },

  /**
   * 绑定用户手机号码
   */
  bindPhoneNumber(e) {
    var detail = e.detail
    console.log({
      detail
    })
    if (detail.iv) {
      http.post(urls.BIND_USER_PHONE, {
        encryptedData: detail.encryptedData,
        iv: detail.iv
      }).then(() => {
        return app.getUserInfo().then(userInfo => {
          this.setData({
            userInfo: userInfo
          })
        })
      })
    }
  },
})