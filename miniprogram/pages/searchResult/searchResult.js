Page({
  data: {
    searchResults: [],
    searchText: "" // 存储搜索关键词
  },

  onLoad: function(options) {
    // 获取传递的参数
    const searchText = options.searchText;
    // 在这里可以使用 searchText 进行后续操作，如展示搜索结果
    console.log('从index.js传递来的搜索词汇：', searchText);
    // 其他处理逻辑
    this.setData({
      searchResults: []
    });
    // 调用 search() 函数来处理搜索结果
    console.log('调用 search() 函数来处理搜索结果', searchText);
    this.search(searchText);
  },

  search: function(query) {
    let that = this; // 保存当前页面的引用
    if (query) {
      // 调用云函数
      wx.cloud.callFunction({
        name: 'search', // 云函数的名字
        data: {
          searchQuery: query
        },
        success: function(res) {
          console.log('搜索结果:', res.result);
          // 处理搜索结果
          if (res.result.code === 200) {
            let formattedResults = res.result.data.map((item) => {
              return {
                name: item.name,
                trans: item.trans,
                usphone: item.usphone,
                ukphone: item.ukphone
              }
            });

            that.setData({
              searchResults: formattedResults
            });
          } else {
            console.error('查询失败:', res.result.message);
          }
          // 在成功回调函数内部输出日志
          console.log('调用云函数完毕');
        },
        fail: function(error) {
          console.error(error)
        }
      })
    }
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
  
  onCollectionTap(e) {
    const item = e.currentTarget.dataset.item;
    console.log("收藏的单词：",item);
    // 获取用户的 OpenID
    const openid = wx.getStorageSync('openid');
    console.log("收藏的用户：",openid);

    if (!openid) {
      // 用户未登录，显示提示消息
      wx.showToast({
        title: '收藏失败，请登录',
        icon: 'none',
        duration: 2000
      });
      return; // 结束函数执行
    }

    // 调用云函数添加词汇到收藏集合，并传递用户的 OpenID
    wx.cloud.callFunction({
      name: 'addcollection',
      data: {
        name: item.name,  // 传递收藏的词条名称
        trans: item.trans,  // 传递收藏的词条翻译
        usphone: item.usphone,  // 传递收藏的词条美式发音
        ukphone: item.ukphone,  // 传递收藏的词条英式发音
        openid: openid  // 传递用户的 OpenID
      },
      success: res => {
        console.log('收藏成功', res.result);
        // 显示收藏成功提示
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 2000
        });
      },
      fail: err => {
        console.error('收藏失败', err);
        // 显示收藏失败提示
        wx.showToast({
          title: '收藏失败，请登录',
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
})
