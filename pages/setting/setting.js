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
  onLoad: function (options) {
    app.ready(() => {
      if (!app.checkUserAuth()) {
        app.getBus().on(EventName.USER_CHANGED, this, this.ready);
      } else {
        this.ready({
          user: app.getUser()
        });
      }
    });
  },

  onUnload: function () {
    // 删除登录事件侦听
    app.getBus().remove(EventName.USER_CHANGED, this);
  },

  //------------------------------------------------------------------------
  //
  // 事件
  //
  //------------------------------------------------------------------------
  /**
   * 登录操作
   */
  onLogin: function (e) {
    app.checkUserAuth(true);
  },
  //------------------------------------------------------------------------
  //
  // 方法
  //
  //------------------------------------------------------------------------
  ready({
    user
  }) {
    this.setData({
      user
    });
  },
})