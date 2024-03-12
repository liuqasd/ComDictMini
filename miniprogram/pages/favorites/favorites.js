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

  },

  onIconTap0: function(e) {
    const word = e.currentTarget.dataset.word;
    console.log("发音单词：", word);
    // 构建发音的完整 URL
    let audioUrl = `http://dict.youdao.com/dictvoice?type=0&audio=${word}`;
    // 创建音频上下文实例
    const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.src = audioUrl;
  
    // 播放音频
    innerAudioContext.play();
  
    // 监听播放完成事件
    innerAudioContext.onEnded(() => {
      console.log('发音播放完成');
    });
  },

  onIconTap1: function(e) {
    const word = e.currentTarget.dataset.word;
    console.log("发音单词：", word);
    // 构建发音的完整 URL
    let audioUrl = `http://dict.youdao.com/dictvoice?type=1&audio=${word}`;
    // 创建音频上下文实例
    const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.src = audioUrl;
  
    // 播放音频
    innerAudioContext.play();
  
    // 监听播放完成事件
    innerAudioContext.onEnded(() => {
      console.log('发音播放完成');
    });
  },
})
