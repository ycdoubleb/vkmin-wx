// pages/course/learning.js
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
    this.setData({
      url: options.file,
    });
  }
})