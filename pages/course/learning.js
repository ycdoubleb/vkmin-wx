// pages/course/learning.js
import http from '@chunpu/http';
import util from '../../utils/util.js';
import Api from '../../utils/api.js';

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
    this.preReady();
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
    // 判断是否已经登录，如果未登录则先登录
    if (!app.getHasLogin()) {
      app.auth().then(() => {
        this.ready();
      });
    }else{
      this.ready();
    }
  },
  ready() {
    // 获取用户信息
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