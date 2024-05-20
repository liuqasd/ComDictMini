Page({
  data: {
    upLoadedWords: []
  },
  onLoad: function() {
    this.getUploadedWords();
  },

  // 调用云函数获取已上传的词汇列表
  getUploadedWords: function() {
    const openid = wx.getStorageSync('openid');
    if (!openid) {
      console.log('未获取到用户 ID!');
      return;
    }

    wx.cloud.callFunction({
      name: 'getuploadedwords',
      data: {
        orderBy: 'createTime',  //指定排序字段为上传时间
        order: 'desc' //指定排序方式为降序
      },
      success: res => {
        // 将时间戳转换为标准时间格式
        const uploadedWordsWithStandardTime = res.result.data.map(item => {
          const standardTime = new Date(item.createTime);
          item.createTime = standardTime.toLocaleString(); // 转换为本地时间格式，也可以根据需要格式化
          return item;
        });

        this.setData({ upLoadedWords: uploadedWordsWithStandardTime });
        console.log('已上传的词汇列表：', uploadedWordsWithStandardTime);
        
        // this.setData({ upLoadedWords: res.result.data });
        // console.log('已上传的词汇列表：', res.result.data);
      },
      fail: err => {
        console.error('获取已上传的词汇列表失败：', err);
      }
    });
  },

  // 在页面的事件处理函数中调用云函数来撤销上传
  onCancelUpload(event) {
    const item = event.currentTarget.dataset.item;
    console.log("要撤销上传的单词信息：", item);
    
    wx.cloud.callFunction({
      name: 'cancelupload',
      data: {
        openid: item.openid, // 传递要撤销的用户ID
        name: item.name // 传递要撤销的词条名称
      },
      success: res => {
        console.log('撤销上传成功', res.result);
        // 执行撤销上传成功后的操作，例如刷新页面或提示用户撤销成功
      },
      fail: err => {
        console.error('撤销上传失败', err);
        // 执行撤销上传失败后的操作，例如提示用户撤销失败
      }
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
        tok: '24.8d8308eab85e0a2313236e59aeb21979.2592000.1718811738.282335-61031662',
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
    this.getUploadedWords(); // 重新拉取收藏数据
    wx.stopPullDownRefresh(); // 停止下拉刷新动画
  },
})
