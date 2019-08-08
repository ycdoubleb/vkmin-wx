import util from '../../utils/util.js';
import Api from '../../utils/api.js';

//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList: [],
    page: 1,
    pageSize: 6,
    ready: false,
    hasMoreData: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Object.assign(this.data, options);
    app.ready(()=>{
      this.fetchCourseResult();
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.fetchCourseResult();
    } else {
      wx.showToast({
        title: '没有数据',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //--------------------------------------------------------------------------------------
  //
  // 自定函数
  //
  //--------------------------------------------------------------------------------------
  /**
   * 加载所有专题课程
   */
  fetchCourseResult: function () {
    Api.get(Api.GET_MY_COURSE, {
      user_id: app.getUser().id,
      page: this.data.page,
      limit: this.data.pageSize
    }).then(data => {
      var resultListTem = this.data.courseList;
      if (this.data.page == 1) {
        resultListTem = [];
      }
      var resultList = data.courses;
      // 如果resultList小于每页个数则不加载
      if (resultList.length < this.data.pageSize) {
        this.setData({
          ready: true,
          learningLog: data.learnLog,
          courseList: resultListTem.concat(resultList),
          hasMoreData: false,
        })
      } else {
        this.setData({
          courseList: resultListTem.concat(resultList),
          page: this.data.page + 1
        })
      }
    });
  },
})