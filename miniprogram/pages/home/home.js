Page({
  data: {
    user: {
      avatar: "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
      nickname: '微信用户'
    },
    isLoggedIn: false // 新增变量用于控制登录按钮显示与隐藏
  },
  onGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      const userInfo = e.detail.userInfo;
      this.setData({
        'user.avatar': userInfo.avatarUrl,
        'user.nickname': userInfo.nickName,
        isLoggedIn: true // 用户已登录
      });
      console.log('用户信息', this.data.user)
      // 手动触发数据绑定
      this.setData({
        user: this.data.user
      });
      // 将用户信息传递给云函数进行登录操作
      wx.cloud.callFunction({
        name: 'login',
        data: {
          userInfo: userInfo
        },
        success: res => {
          console.log('登录成功', res.result)
          wx.setStorageSync('openid', res.result.openid);
          // 登录成功后的处理逻辑
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          })
          // 可以跳转到其他页面
        },
        fail: err => {
          console.error('登录失败', err)
          // 处理登录失败情况，例如显示错误信息给用户
          wx.showToast({
            title: '登录失败，请重试',
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      // 用户拒绝授权的处理逻辑
      wx.showToast({
        title: '请授权后登录',
        icon: 'none',
        duration: 2000
      })
    }
  },
  logout: function() {
    // 清空用户信息
    this.setData({
      'user.avatar': "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
      'user.nickname': '微信用户',
      isLoggedIn: false 
    });
    // 手动触发数据绑定
    this.setData({
      user: this.data.user
    });
    // 这里可以调用云函数或后台接口来清除登录状态
    console.log('退出登录');
  }
});
