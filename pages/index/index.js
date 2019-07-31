//index.js
import http from '@chunpu/http';
import util from '../../utils/util.js';
import Api from '../../utils/api.js';

//获取应用实例
const app = getApp()

Page({

  data: {
    banners: {},
    recommend_courses: {},
    topics: {},
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    ready: false
  },

  //--------------------------------------------------------------------------------------
  //
  // Page 事件
  //
  //--------------------------------------------------------------------------------------
  onLoad: function(options) {
    Object.assign(this.data, options);
    this.ready();
  },

  /**
   * 卸载页面
   */
  onUnload: function() {
    // 删除登录事件侦听
  },
  //--------------------------------------------------------------------------------------
  //
  // 自定义事件
  //
  //--------------------------------------------------------------------------------------
  
  //--------------------------------------------------------------------------------------
  //
  // 自定函数
  //
  //--------------------------------------------------------------------------------------
  /**
   * 
   */
  ready() {
    // 加载首页数据，比如banner数据，推荐课程，专題
    Api.get(Api.GET_HOME_DATA).then(data =>{
      this.setData({
        ready : true,
        banners: data.banners,
        recommend_courses: data.recommend_courses,
        topics: data.topics
      });
    });
  },
})