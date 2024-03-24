Page({
  data: {
    name: '',
    trans: '',
    usphone: '',
    ukphone: '',
    pos: '',  //词性
    example: '',  //例句
  },

  // 输入框内容变化时触发的事件处理函数
  inputChange: function (e) {
    const { id } = e.currentTarget;
    const { value } = e.detail;
    this.setData({
      [id]: value
    });
  },

  // 上传词汇
  onSubmit: function() {
    const { name, trans, usphone, ukphone, pos, example } = this.data;
    console.log("名称：", name);
    console.log("翻译：", trans);
    // 验证输入信息
    if (!name || !trans) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
        duration: 2000,
      });
      return;
    }

    // 获取用户 OpenID
    const openid = wx.getStorageSync('openid');

    // 调用云函数上传词汇
    wx.cloud.callFunction({
      name: 'uploadword',
      data: {
        name,
        trans,
        usphone,
        ukphone,
        pos,
        example,
        openid,
      },
      success: res => {
        console.log('上传词汇成功', res.result);

        // 显示上传成功提示
        wx.showToast({
          title: '上传词汇成功',
          icon: 'success',
          duration: 2000,
        });

        // 重置表单
        this.setData({
          name: '',
          trans: '',
          usphone: '',
          ukphone: '',
          pos: '',
          example: '',
        });
      },
      fail: err => {
        console.error('上传词汇失败', err);

        // 显示上传失败提示
        wx.showToast({
          title: '上传词汇失败',
          icon: 'none',
          duration: 2000,
        });
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})