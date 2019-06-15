//index.js
import http from '@chunpu/http';
import util from '../../utils/util.js';
import {
  urls
} from '../../utils/webservice.js';

//获取应用实例
const app = getApp()

Page({

  data: {
    //用户信息
    userInfo: null,
    //商家
    merchant: null,
    //最新金额
    money: 0,
    //日销售
    todaySale: null,
    //月销售
    monthSale: null,
    //总销售
    allSale: null,
    //加载中
    loading: false,
    //是否开户提现功能
    canWithdrawal: false,

    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  //---------------------------------------------------------------------------------------------------
  //
  // Page 事件
  //
  //---------------------------------------------------------------------------------------------------
  onLoad: function(options) {
    Object.assign(this.data, options);
    app.ready(() => {
      //检查用户是否授权
      app.checkUserAuth();

      //检查用户是否开通商家
      if (app.globalData.merchant && app.globalData.merchant.status == 10) {
        this.setData({
          userInfo: app.globalData.userInfo,
          merchant: app.globalData.merchant
        });
        this.ready();
      } else {
        let agency_id = null;

        if (options.q) {
          //扫描二维码进入
          const ops = util.getUrlkey(decodeURIComponent(options.q));
          agency_id = ops.agency_id;
        }

        //跳转申请页
        wx.redirectTo({
          url: '/pages/apply/apply' + (agency_id == null ? "" : "?agency_id=" + agency_id)
        })
      }



      //准备
      //this.ready();
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
    this.ready();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  //---------------------------------------------------------------------------------------------------
  //
  // 自定义事件
  //
  //---------------------------------------------------------------------------------------------------
  onWithdrawal: function(e) {
    if (this.data.canWithdrawal){
      wx.navigateTo({
        url: '/pages/index/withdrawal/withdrawal'
      })
    }else{
      wx.showModal({
        content: '该功能暂不开放使用！',
        showCancel: false,
      });
    }
  },

  //---------------------------------------------------------------------------------------------------
  //
  // 自定函数
  //
  //---------------------------------------------------------------------------------------------------
  /**
   * 准备，获取商家销售数据
   */
  ready() {
    if (this.data.loading || !this.data.merchant) return;
    this.data.loading = true;
    wx.showLoading();
    return http.get(urls.MERCHANT_GET_SALE_INFO + "?merchant_id=" + this.data.merchant.id)
      .then(response => {
        this.data.loading = false;
        wx.hideLoading();
        let data = response.data;
        if (data && typeof data === 'object') {
          this.setData({
            money: data['money'],
            today_sale: data['today_sale'][0],
            month_sale: data['month_sale'][0],
            all_sale: data['all_sale'][0],
            canWithdrawal: data['canWithdrawal'] == 1,
          });
          this.init();
          return data
        }
        return Promise.reject(response)
      }).catch(err => {
        this.data.loading = false;
        wx.hideLoading();
        wx.showToast({
          title: '获取营业数据失败！',
        })
      });
  },

  /**
   * 初始
   */
  init: function() {

  },

})