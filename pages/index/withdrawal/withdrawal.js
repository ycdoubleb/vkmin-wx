import http from '@chunpu/http';
import util from '../../../utils/util.js';
import {
  urls
} from '../../../utils/webservice.js';

//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    has_apply_money: 0, //今天已经申请的金额
    newest_money: 0, //当前余额
    need_check: 0, //是否需要审核
    once_max_money: 0, //单笔最大金额
    day_max_money: 0, //一天最大金额
    input_value: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.ready(() => {
      this.setData({
        userInfo: app.globalData.userInfo,
      });
      this.ready();
    });
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

  },

  //---------------------------------------------------------------------------------------------------
  //
  // 自定义事件
  //
  //---------------------------------------------------------------------------------------------------
  /**
   * 全部提现
   */
  onWithdrawalAll: function(e) {
    const canWithdrawalMoney = Math.max((this.data.day_max_money * 100 - this.data.has_apply_money * 100) / 100, 0);
    const value = Math.min(canWithdrawalMoney, this.data.once_max_money, this.data.newest_money);

    this.setData({
      input_value: value
    });
  },

  /**
   * 提现
   */
  submit: function() {
    const self = this;
    this.createSelectorQuery().select('.money-input').fields({
      properties: ['value'],
    }, function(r) {
      if (r.value > 0) {
        http.post(urls.USER_WITHDRAWAL, {
            money: r.value
          })
          .then(response => {
            wx.hideLoading();
            wx.showModal({
              content: '你的提现申请已提交!',
              showCancel: false,
              success: (res) => {
                if (res.confirm) {
                  self.ready();
                }
              },
            })
          }).catch(err => {
            wx.hideLoading();
            wx.showModal({
              content: err.message,
              showCancel: false,
            })
          });
      }
    }).exec();
  },

  /**
   * 提现记录
   */
  onGotoLog: function() {
    wx.navigateTo({
      url: '/pages/index/withdrawal_log/withdrawal_log'
    })
  },
  //---------------------------------------------------------------------------------------------------
  //
  // 自定函数
  //
  //---------------------------------------------------------------------------------------------------
  /**
   * 准备，获取当前用户下在运行的订单，套餐信息
   */
  ready() {
    wx.showLoading();
    return http.get(urls.USER_WITHDRAWAL_READY)
      .then(response => {
        wx.hideLoading();
        let data = response.data;
        if (data && typeof data === 'object') {
          this.setData(data);
          this.init();
          return data
        }
        return Promise.reject(response)
      }).catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: '提现准备失败！',
        })
      });
  },

  /**
   * 初始
   */
  init: function() {

  },


})