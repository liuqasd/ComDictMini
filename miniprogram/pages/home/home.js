Page({
  onGetUserInfo: function(e) {
    // 这里处理登录逻辑
    console.log(e.detail.userInfo);
    logout: () => {
      wx.cloud.callFunction({
        name: 'logout',
        data: {},
        success: res => {
          // 在云函数成功执行后，可以执行清除用户信息、跳转到登录页面等操作
          // 你可以根据云函数的返回结果来确定退出登录是否成功
          // 例如，如果云函数返回成功标志，可以执行以下操作：
          // 清除本地缓存的用户信息
          wx.removeStorageSync('userInfo');
          // 跳转到登录页面
          wx.navigateTo({
            url: '/pages/index/index',
          });
        },
        fail: err => {
          // 云函数调用失败，处理错误情况
          console.error('退出登录失败：', err);
        }
      });
    }
    
  }
});
