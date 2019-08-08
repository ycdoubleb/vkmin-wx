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
  /**
   * 开始学习
   */
  learning: function(){
    wx.navigateTo({
      url: "/pages/course/learning?course_id=" + this.data.courseInfo.id+"&file="+this.data.courseInfo.url,
    })
  },
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
    Api.get(Api.GET_COURSE_DETAIL, {id: this.data.id}).then(data => {
      this.setData({
        ready: true,
        courseInfo: data.course
      });
    });
  }
})