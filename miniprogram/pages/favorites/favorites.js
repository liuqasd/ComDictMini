Page({
  data: {
    collectedWords: []
  },
  onLoad: function() {
    this.getCollectedWords();
  },

  // 调用云函数获取已收藏的词汇列表
  getCollectedWords: function() {
    const openid = wx.getStorageSync('openid');
    if (!openid) {
      console.log('未获取到用户 ID!');
      return;
    } else {
      console.log('用户 ID:', openid);
    }

    wx.cloud.callFunction({
      name: 'getcollectedwords',
      success: res => {
        console.log('已收藏的词汇列表：', res.result.data);
        this.setData({ collectedWords: res.result.data });
        console.log('存储的已收藏的词汇列表collectedWords：', this.data.collectedWords);
      },
      fail: err => {
        console.error('获取已收藏的词汇列表失败：', err);
      }
    });
  },

  onUnfavorite: function(e) {
    const id = e.currentTarget.dataset.id;
    console.log('取消收藏术语ID：', id);
    // 调用云函数或其他方法执行取消收藏的逻辑

    // 示例：假设取消收藏后更新收藏列表
    const updatedFavorites = this.data.favorites.filter(item => item.id !== id);
    this.setData({ favorites: updatedFavorites });

  }
})
