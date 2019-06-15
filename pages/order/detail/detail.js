// pages/order/detail/detail.js
import http from '@chunpu/http';
import util from '../../../utils/util.js';
import {
  urls
} from '../../../utils/webservice.js';
import OrderStatus from '../../../utils/order.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_sn: null, //当前 
    order: null, //订单详细
    orderStatus: OrderStatus,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      order_sn: options.order_sn
    });
    this.reflash();
    console.log('onLoad');
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
    if(this.data.order){
      this.reflash();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(this.data.countdownId);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.data.countdownId);
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
  /** 上报bug */
  onReportBug: function () {
    wx.navigateTo({
      url: '/pages/order/bug/bug?order_sn=' + this.data.order_sn
    });
  },
  //---------------------------------------------------------------------------------------------------
  //
  // 自定义方法
  //
  //---------------------------------------------------------------------------------------------------
  /**
   * 刷新界面
   */
  reflash: function() {
    this.getOrderDetail(this.data.order_sn).then((data) => {
      data.password_arr = [...data.password];
      this.setData({
        order: data
      });
      this.startCountdown();
    });
  },
  /**
   * 获取订单详情
   */
  getOrderDetail: function(order_sn) {
    return http.get(urls.GET_ORDER_DETAIL + "?order_sn=" + order_sn)
      .then(response => {
        let data = response.data;
        if (data && typeof data === 'object') {
          data['created_time'] = util.formatDateTime(data['created_at']);
          data['pay_time'] = util.formatDateTime(data['pay_at']);
          data['finish_time'] = util.formatDateTime(data['end_at']);
          return data
        }
        return Promise.reject(response)
      }).catch(err => {
        wx.showModal({
          content: '加载订单详情失败！',
          showCancel: false,
        });
        console.log(err);
      });;
  },
  /**
   * 开始倒计时
   */
  startCountdown: function() {
    let now = Math.round(new Date().getTime() / 1000);
    let end = this.data.order.end_at;
    let value = end - now;

    clearInterval(this.data.countdownId);
    this.data.countdownId = setInterval(() => {
      let v = value--;
      if (v < 0) {
        v = 0;
        clearInterval(this.data.countdownId);
        //this.reflash();
      }
      this.setData({
        time: util.formatTimeByInt(v)
      });
    }, 1000);
  }
})