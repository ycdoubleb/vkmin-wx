import util from '../../utils/util.js';
import Api from '../../utils/api.js';
import {EventName} from '../../utils/event.js';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Object.assign(this.data, options);
    app.ready(() => {
      if (!app.checkUserAuth(true)) {
        app.getBus().on(EventName.USER_CHANGED, this, this.ready);
      } else {
        this.ready();
      }
    });
  },

  onUnload: function () {
    // 删除登录事件侦听
    app.getBus().remove(EventName.USER_CHANGED, this);
  },
  //--------------------------------------------------------------------------------------
  //
  // 自定函数
  //
  //--------------------------------------------------------------------------------------
  ready() {
    const user = app.getUser();
    // 保存学习记录
    Api.post(Api.SAVE_LEARNING, { 
      course_id: this.data.course_id,
      user_id: user.id
    }).then(data =>{
      console.log(data);
      this.setData({
        url: this.data.file,
      });
    });
  },
})