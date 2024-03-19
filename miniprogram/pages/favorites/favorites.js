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
    }

    wx.cloud.callFunction({
      name: 'getcollectedwords',
      success: res => {
        // console.log('已收藏的词汇列表：', res.result.data);
        this.setData({ collectedWords: res.result.data });
        // console.log('存储的已收藏的词汇列表collectedWords：', this.data.collectedWords);
      },
      fail: err => {
        console.error('获取已收藏的词汇列表失败：', err);
      }
    });
  },

  onUnfavorite: function(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.collectedWords.find(item => item.id === id);
  
    // 判断用户是否登录
    const openid = wx.getStorageSync('openid');
    if (!openid) {
      wx.showToast({
        title: '收藏失败，请登录',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
  
    // 调用云函数从收藏集合中删除词汇
    wx.cloud.callFunction({
      name: 'removecollection',
      data: {
        name: item.name, // 传递要取消收藏的词条名称
        openid, // 传递用户的 OpenID
      },
      success: res => {
        console.log('取消收藏成功', res.result);
  
        // 更新页面数据
        const collectedWords = this.data.collectedWords.filter(word => word.id !== id);
        this.setData({ collectedWords });
  
        // 显示取消收藏成功提示
        wx.showToast({
          title: '取消收藏成功',
          icon: 'success',
          duration: 2000,
        });
      },
      fail: err => {
        console.error('取消收藏失败', err);
  
        // 显示取消收藏失败提示
        wx.showToast({
          title: '取消收藏失败，请登录',
          icon: 'none',
          duration: 2000,
        });
      },
    });
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

  // 下拉刷新触发的事件
  onPullDownRefresh() {
    this.getCollectedWords(); // 重新拉取收藏数据
    wx.stopPullDownRefresh(); // 停止下拉刷新动画
  },
})
