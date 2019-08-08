import Api from '../../utils/api.js';

//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 绑定用户信息，包括头像、名称
   */
  bindUserInfo: function(e) {
    var detail = e.detail
    if (detail.iv) {
      Api.post(Api.BIND_USER_INFO, {
        encryptedData: detail.encryptedData,
        iv: detail.iv,
        signature: detail.signature
      }).then(() => {
        return app.getUserInfo().then(
          (data) => {
            app.onAuth(data);
            wx.navigateBack();
          }
        )
      })
    }
  },
})