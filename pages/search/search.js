// pages/search/search.js
import http from '@chunpu/http';
import util from '../../utils/util.js';
import Api from '../../utils/api.js';
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ready: false,
    isShowClear: false,
    searchInput: '',
    resultList: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Object.assign(this.data, options);
    // this.ready();
  },

  /**
   * 卸载页面
   */
  onUnload: function () {
    // 删除登录事件侦听
  },
  //--------------------------------------------------------------------------------------
  //
  // 自定义事件
  //
  //--------------------------------------------------------------------------------------
  /**
   * 提交表单
   */
  formSubmit: function (e) {
    Api.get(Api.GET_SEARCH_INFO, e.detail.value).then(data => {
      this.ready({data});
    });
  },
  /**
   * 输入时显示
   */
  bindInput:function(e){
    var value = e.detail.value;
    this.setData({
      isShowClear: value ? true : false,
      searchInput: value ? value : '',
    });
  },
  /**
   * 清除内容
   */
  clearContent: function(e){
    this.setData({
      isShowClear: false,
      searchInput: ''
    });
  },
  //--------------------------------------------------------------------------------------
  //
  // 自定函数
  //
  //--------------------------------------------------------------------------------------
  /**
   * 
   */
  ready({data}) {
    // 加载数据
    this.setData({
      ready: true,
      resultList: data.resultList,
    });
  }
})