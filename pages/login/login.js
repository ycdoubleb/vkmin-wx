// pages/login/login.js
import http from '@chunpu/http';
import {urls} from '../../utils/webservice.js';

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
      http.post(urls.BIND_USER_INFO, {
        encryptedData: detail.encryptedData,
        iv: detail.iv,
        signature: detail.signature
      }).then(() => {
        return app.getUserInfo().then(
          ()=>{
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
    console.log({ detail })
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})