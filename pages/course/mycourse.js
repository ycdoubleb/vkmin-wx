// pages/course/mycourse.js
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
    this.preReady();
  },

  onUnload: function () {
    // 删除登录事件侦听
    // app.getBus().remove(EventName.LOGIN, this);
  },
  //--------------------------------------------------------------------------------------
  //
  // 自定函数
  //
  //--------------------------------------------------------------------------------------
  /**
   * 初始准备
   */
  preReady() {
    const user = app.getUser();
    if (!user) {
      app.getBus().on(EventName.LOGIN, this, this.ready);
    } else {
      if (app.getHasLogin()) this.ready({ user });
    }
  },

  ready({user}) {
    // 加载课程详情
    Api.get(Api.GET_MY_COURSE, { user_id: user.id }).then(data => {
      this.setData({
        ready: true,
        learningLog: data.learnLog,
        courseList: data.courses
      });
    });
  }
})