// components/navigationBar/navigation.js
const app = getApp();

Component({
  properties: {
    // 是否显示图标
    isShow:{
      type: Boolean,
      value: false
    },
    // 是否显示搜索
    isShowSearch: {
      type: Boolean,
      value: false
    },
    // 导航栏高度
    navBarHeight:{
      type: String,
      value: '45'
    },
    // 状态栏高度
    statusBarHeight:{
      type: String,
      value: '20'
    },
    // 导航栏背景色
    navBarBgColor:{
      type: String,
      value: '#fff',
    },
    // 搜索框边框色
    searchBoxBorderColor:{
      type: String,
      value: '#f2f2f2',
    },
    // 搜索框背景色
    searchBoxBgColor: {
      type: String,
      value: '#f2f2f2',
    },
    // 搜索框提示语
    searchTipsColor:{
      type: String,
      value: '#d3d3d3',
    },
    // 图标组边框颜色
    iconBorderColor:{
      type: String,
      value: '#e5e5e5'
    },
    dividBgColor:{
      type: String,
      value: '#e5e5e5'
    },
    // 标题
    title:{
      type: String,
      value: ''
    },
    // 标题文本颜色
    titleTextColor:{
      type: String,
      value: '#000',
    },
    // 标题文字大小
    titleFontSize:{
      type: String,
      value: '13'
    }
  },
  data: {
    homePage: '/pages/index/index',
    searchPage: '/pages/search/search'
  },
  methods: {
    // 后退
    goBack: function () {
      wx.navigateBack({
        delta: 1
      });
    },
    // 主页
    goHome: function () {
      wx.switchTab({
        url: this.data.homePage
      });
    },
    // 搜索页
    goSearch: function(){
      wx.navigateTo({
        url: this.data.searchPage
      });
    }
  }
})