import {
  EventName
} from '../../utils/event.js';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    userList: [
      {
        title: '我的课程',
        icon: '/images/icon/right_arrow.png',
        url: '/pages/course/mycourse'
      }
    ]
  },
  //------------------------------------------------------------------------
  //
  // 生命周期函数
  //
  //------------------------------------------------------------------------
  /**
   * 监听页面加载
   */
  onLoad: function(options) {
    this.preReady();
  },

  onUnload: function() {
    // 删除登录事件侦听
    app.getBus().remove(EventName.LOGIN, this);
  },

  //------------------------------------------------------------------------
  //
  // 事件
  //
  //------------------------------------------------------------------------
  /**
   * 登录操作
   */
  onLogin: function(e) {
    app.auth();
  },
  //------------------------------------------------------------------------
  //
  // 方法
  //
  //------------------------------------------------------------------------
  /**
   * 初始准备
   */
  preReady() {
    const user = app.getUser();
    if (!user) {
      app.getBus().on(EventName.LOGIN, this, this.ready);
    } else {
      if (app.getHasLogin()) this.ready({user});
    }
  },

  ready({user}) {
    this.setData({
      user
    });
  },
})