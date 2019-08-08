import util from '../../utils/util.js';
import Api from '../../utils/api.js';
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchInput: '',
    searchType: [],
    resultList: [],
    page: 1,
    pageSize: 6,
    isShowClear: false,
    hasMoreData: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Object.assign(this.data, options);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function(){
    if (this.data.hasMoreData){
      this.fetchSearchResult();
    }else{
      wx.showToast({
        title: '没有数据',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //--------------------------------------------------------------------------------------
  //
  // 自定义事件
  //
  //--------------------------------------------------------------------------------------
  /**
   * 提交表单
   */
  formSubmit: function (e) {
    this.setData({
      searchInput: e.detail.value.keyword,
      searchType: e.detail.value.search_type,
      page: 1,
      hasMoreData: true,
    });
    this.fetchSearchResult();
  },
  /**
   * 输入时显示
   */
  bindInput:function(e){
    var value = e.detail.value;
    this.setData({
      isShowClear: value ? true : false,
      searchInput: value ? value : '',
    });
  },
  /**
   * 清除内容
   */
  clearContent: function(e){
    this.setData({
      isShowClear: false,
      searchInput: ''
    });
  },
  //--------------------------------------------------------------------------------------
  //
  // 自定函数
  //
  //--------------------------------------------------------------------------------------
  /**
   * 获取搜索结果
   */
  fetchSearchResult: function(){
    Api.get(Api.GET_SEARCH_INFO, {
      keyword: this.data.searchInput,
      search_type: this.data.searchType,
      page: this.data.page,
      limit: this.data.pageSize
    }).then(data => {
      var resultListTem = this.data.resultList;
      if (this.data.page == 1){
        resultListTem = [];
      }
      var resultList = data.results.list;
      // 如果resultList小于每页个数则不加载
      if (resultList.length < this.data.pageSize){
        this.setData({
          resultList: resultListTem.concat(resultList),
          hasMoreData: false,
        })
      }else{
        this.setData({
          resultList: resultListTem.concat(resultList),
          page: this.data.page + 1
        })
      }
    });
  },
})