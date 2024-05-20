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

  onIconTapChinese: function(e) {
    const wordArray = e.currentTarget.dataset.word;
    const word = Array.isArray(wordArray) ? wordArray[0] : wordArray; // 获取数组的第一个元素或者直接使用单词
    console.log("发音单词：", word);

    wx.request({
      url: 'https://tsn.baidu.com/text2audio',
      data: {
        tex: word,
        lan: 'zh',
        ctp: 1,
        AppID: 61031662,
        tok: '24.204c1d69e34a60089fb0e5d78cabd560.2592000.1718290606.282335-61031662',
        cuid: 'Hne7RMhCtxP0h1awclgzQftCW20WoegR',
        spd: 5,
        pit: 5,
        vol: 6,
        per: 0,
        aue: 3
      },
      header: {
        'content-type': 'application/json'
      },
      responseType: 'arraybuffer', // 将响应的数据类型设置为 arraybuffer
      success(res) {
        // 将 arraybuffer 数据保存为临时文件
        const arrayBuffer = res.data
        console.log("音频文件：", arrayBuffer)

        wx.getFileSystemManager().writeFile({
          filePath: wx.env.USER_DATA_PATH + '/temp.mp3',
          data: arrayBuffer,
          encoding: 'binary',
          success() {
            // 获取保存的临时文件路径
            const savedFilePath = wx.env.USER_DATA_PATH + '/temp.mp3'
    
            console.log("临时文件路径：", savedFilePath)
            // 使用 <audio> 组件播放本地文件
            const audioContext = wx.createInnerAudioContext()
            audioContext.src = savedFilePath
            audioContext.play()
          },
          fail(writeErr) {
            console.error('保存文件失败', writeErr)
          }
        })
      },
      fail(err) {
        console.error('请求失败', err)
      }
    })
  },
  
  // 下拉刷新触发的事件
  onPullDownRefresh() {
    this.getCollectedWords(); // 重新拉取收藏数据
    wx.stopPullDownRefresh(); // 停止下拉刷新动画
  },
})
