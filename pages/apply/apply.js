import http from '@chunpu/http';
import util from '../../utils/util.js';
import {
  urls
} from '../../utils/webservice.js';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverURL: urls.BASE_URL + urls.FILE_UPLOAD,
    //商家
    merchant: null,
    //代理商ID，通过扫二维码方式获取
    agency_id: null,
    agency: null,
    //类型数据
    types: null,
    typeIndex: 0,
    //省市区
    region:[],
    regionData: null,
    regions: [null, null, null],
    regionIndex: [0, 0, 0],
    //封面
    merchat_cover_url: null,
    //手机号码
    contact_phone: null,
    //同意相关条约
    isAgree: false,
    //是否显示错误
    showTopTips: false,
    //错误信息
    errorMsg: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    Object.assign(this.data, options);
    app.ready(() => {
      if (app.globalData.merchant == null) {
        if (this.data.agency_id != null) {
          this.getAgency(this.data.agency_id);
        }
        this.applyReady();
      } else if (app.globalData.merchant && app.globalData.merchant.status == 1) {
        this.setData({
          merchant: app.globalData.merchant
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //--------------------------------------------------------------------------
  //
  // 事件
  //
  //--------------------------------------------------------------------------
  /**
   * 扫描代理商
   */
  agencyScan: function(e) {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        const params = util.getUrlkey(res.result);
        if (params['agency_id']) {
          this.getAgency(params['agency_id']);
        } else {
          wx.showModal({
            content: '扫描失败,无法识别！',
            showCancel: false,
          })
        }
      },
      fail: () => {

      }
    });
  },
  /**
   * 类型改变
   */
  typeChange: function(e) {
    this.setData({
      typeIndex: e.detail.value
    });
  },
  /**
   * 上传封面
   */
  uploadMerchantCover: function(e) {
    const _this = this;
    wx.chooseImage({
      count: 1,
      success: function(res) {
        wx.showLoading();
        wx.uploadFile({
          url: urls.BASE_URL + urls.FILE_UPLOAD,
          filePath: res.tempFilePaths[0],
          name: 'file',
          success: (res) => {
            const data = JSON.parse(res.data);
            _this.setData({
              merchat_cover_url: data.data.url,
            });
            wx.hideLoading();
          },
          fail: (e) => {
            wx.hideLoading();
            wx.showModal({
              content: e.message || '上传失败',
              showCancel: false
            })
          },
        })
      },
    });
  },
  /**
   * 获取手机
   */
  getPhoneNumber(e) {
    return http.post(urls.DECRYPTED_DATA, {
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData
      })
      .then(response => {
        wx.hideLoading();
        let data = response.data;
        console.log(data);
        if (data && typeof data === 'object') {
          this.setData({
            contact_phone: data['phoneNumber'],
          });
          return data
        }
        return Promise.reject(response)
      }).catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: '获取数据失败！',
        })
      });
  },

  /**
   * 省市区改变
   */
  regionChange: function(e) {
    this.setData({
      regionIndex: e.detail.value
    })
  },
  regionColumnChange: function(e) {
    const data = {
      regions: this.data.regions,
      regionIndex: this.data.regionIndex
    }
    let value = e.detail.value;
    data.regionIndex[e.detail.column] = e.detail.value;
    for (let i = e.detail.column + 1; i < 3; i++) {
      const parentRegions = data.regions[i - 1];
      const parentRegion = parentRegions[data.regionIndex[i - 1]];
      data.regions[i] = parentRegion.c;
      data.regionIndex[i] = 0;
    }
    this.setData(data);
  },

  /**
   * 阅读并同意相关条款
   */
  bindAgreeChange: function() {
    this.setData({
      isAgree: !this.data.isAgree
    });
  },

  /**
   * 提交申请
   */
  formSubmit: function(e) {
    const value = e.detail.value;
    const data = this.data;
    let errorMsg = "";
    if (data.agency == null) {
      errorMsg += '代理商不能为空！\n';
    } else if (value.merchant_name == "") {
      errorMsg += '名称不能为空！\n';
    } else if (data.merchat_cover_url == null) {
      errorMsg += '封面不能为空！\n';
    } else if (value.contact_name == "") {
      errorMsg += '封面不能为空！\n';
    } else if (data.contact_phone == "") {
      errorMsg += '手机不能为空！\n';
    } else if (value.address == "") {
      errorMsg += '详细地址不能为空！\n';
    }
    if (errorMsg != "") {
      this.setData({
        showTopTips: true,
        errorMsg: errorMsg,
      });
    } else {
      http.post(urls.MERCHANT_APPLY, {
          agency_id: data.agency.id,
          user_id: app.globalData.userInfo.id,
          name: value.merchant_name,
          type_id: data.types[data.typeIndex].id,
          cover_url: data.merchat_cover_url,
          contact_name: value.contact_name,
          contact_phone: data.contact_phone,
          province: data.regions[0][data.regionIndex[0]].id,
          city: data.regions[1][data.regionIndex[1]].id,
          district: data.regions[2][data.regionIndex[2]].id,
          address: value.address
        })
        .then(response => {
          wx.hideLoading();
          let data = response.data;
          if (data && typeof data === 'object') {
            wx.showToast({
              title: '申请成功！',
            });

            this.setData({
              merchant: data
            });
            return data
          }
          return Promise.reject(response)
        }).catch(err => {
          wx.hideLoading();
          wx.showToast({
            title: '提交申请失败！' + err.message,
          })
        });
    }
  },
  //关闭提示
  closeTopTips: function() {
    this.setData({
      showTopTips: false,
      errorMsg: '',
    });
  },
  //--------------------------------------------------------------------------
  //
  // 方法
  //
  //--------------------------------------------------------------------------
  init: function() {
    const level1 = this.data.regionData;
    const level2 = level1[0].c;
    const level3 = level2[0].c;

    this.setData({
      regions: [level1, level2, level3],
    });
  },
  /**
   * 准备,返回商户类型，省市区
   */
  applyReady: function() {
    wx.showLoading();
    return http.get(urls.MERCHANT_APPLY_READY)
      .then(response => {
        wx.hideLoading();
        let data = response.data;
        if (data && typeof data === 'object') {
          this.setData({
            types: data['type'],
            regionData: data['regions']
          });
          this.init();
          return data
        }
        return Promise.reject(response)
      }).catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: '准备获取数据失败！',
        })
      });
  },

  /**
   * 获取代理商信息
   */
  getAgency: function(agency_id) {
    return http.get(urls.GET_AGENCY + "?agency_id=" + agency_id)
      .then(response => {
        wx.hideLoading();
        let data = response.data;
        if (data && typeof data === 'object') {
          this.setData({
            agency: data
          });
          return data
        }
        return Promise.reject(response)
      }).catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: '准备获取数据失败！',
        })
      });
  },
})