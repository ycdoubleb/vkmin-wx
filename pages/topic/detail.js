// pages/topic/detail.js
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Object.assign(this.data, options);
    this.ready();
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
  //--------------------------------------------------------------------------------------
  //
  // 自定函数
  //
  //--------------------------------------------------------------------------------------
  /**
   * 
   */
  ready() {
    // 加载课程详情
    Api.get(Api.GET_TOPIC_DETAIL, {topic_id: this.data.id}).then(data => {
      this.setData({
        ready: true,
        topic: data.topic,
        topicCourses: data.courses
      });
    });
  }
})