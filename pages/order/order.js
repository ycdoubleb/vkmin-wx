import http from '@chunpu/http';
import util from '../../utils/util.js';
import {
  urls
} from '../../utils/webservice.js';
import OrderStatus from '../../utils/order.js';
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    refreshing: false,
    loadmoreing: false,
    orders: [],
    currentPage: 1, // 当前页数  默认是1
    date: null, //日期
    today: util.formatDate('yyyy-MM-dd', new Date()),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.ready(() => {
      this.refresh();
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
   * 点击导航栏
   */
  bindDateChange: function(e){
    this.setData({
      date: e.detail.value
    });
    this.refresh();
  },

  //---------------------------------------------------------------------------------------------------
  //
  // 自定义方法
  //
  //---------------------------------------------------------------------------------------------------
  // 上拉加载更多
  loadMore: function() {
    console.log('上拉加载更多');
    var self = this;
    // 当前页是最后一页
    setTimeout(function() {
      var tempCurrentPage = self.data.currentPage;
      tempCurrentPage = tempCurrentPage + 1;
      self.setData({
        currentPage: tempCurrentPage,
        loadmoreing: true,
      })
      self.getData();
    }, 300);
  },

  // 下拉刷新
  refresh: function(e) {
    console.log('下拉刷新');
    var self = this;
    setTimeout(function() {
      self.setData({
        currentPage: 1,
        refreshing: true,
      })
      self.getData();
    }, 300);
  },

  // 获取数据  pageIndex：页码参数
  getData: function() {
    var self = this;
    const loadmoreing = self.data.loadmoreing;
    const refreshing = self.data.refreshing;
    this.getOrderList().then((data) => {
      const orders = data.list;
      if (refreshing) { // 下拉刷新
        self.setData({
          orders: orders,
          refreshing: false,
        })
      } else { // 加载更多
        console.log('加载更多');
        var tempArray = self.data.orders;
        tempArray = tempArray.concat(orders);
        self.setData({
          orders: tempArray,
          loadmoreing: false,
          page: data.page,
        })
      }
    });
  },

  /**
   * 获取订单
   */
  getOrderList: function(index) {
    const page = this.data.currentPage;
    const date = this.data.date ? this.data.date : "";
    var data = {
      merchant_id: app.globalData.merchant.id,
      page: page,
      date: date,
    };
    var params = util.covertObjectToUrl(data);
    return http.get(urls.MERCHANT_GET_ORDER_LIST + "?" + params)
      .then(response => {
        let datas = response.data;
        let orders = datas.list;
        if (orders && typeof orders === 'object') {
          orders.forEach(function(data, index, array) {
            data['created_time'] = util.formatDateTime(data['created_at']);
            data['order_status_text'] = OrderStatus.getStatusText(data['order_status']);
          });
          if (orders.length == 0) {
            wx.showToast({
              title: '没有更多了',
            })
          }
          return datas
        }
        return Promise.reject(response)
      }).catch(err => {
        wx.showModal({
          content: '加载订单列表失败！',
          showCancel: false,
        });
      });;
  },


})