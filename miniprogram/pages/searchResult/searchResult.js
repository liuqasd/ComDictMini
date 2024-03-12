Page({
  data: {
    searchResults: [],
    searchText: "",   // 存储搜索关键词
    collectedWords: [], // 已收藏的词汇列表
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
    // 页面加载时获取已收藏的词汇列表
    this.getCollectedWords();
    // 调用 search() 函数来处理搜索结果
    console.log('调用 search() 函数来处理搜索结果', searchText);
    this.search(searchText);
  },

  onSearchIconClick: function() {
    console.log("点击搜索");
    this.setData({
      inputFocus: true
    });
    console.log("Input focus set to true");
  },

  onSearchInput: function(e) {
    console.log('输入词汇：', e.detail.value);
    const query = e.detail.value;
    this.setData({
      searchText: query // 存储搜索关键词
    });
  },

  onSearchSubmit: function(e) {
    // 搜索提交时的处理函数
    console.log('搜索词汇：', e.detail.value);
    const searchText = this.data.searchText;
    console.log('搜索词汇：', searchText);
    wx.navigateTo({
      url: '/pages/searchResult/searchResult?searchText=' + searchText
    });
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
              // 判断当前项是否已被收藏
              const isCollected = that.data.collectedWords.some(word => word.name === item.name);
              console.log('是否被收藏:', isCollected);
              return {
                name: item.name,
                trans: item.trans,
                usphone: item.usphone,
                ukphone: item.ukphone,
                collected: isCollected // 添加字段表示是否已被收藏
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

    // 检查当前项是否已经被收藏
    const isCollected = this.data.collectedWords.some(word => word.name === item.name);

    if (isCollected) {
      // 如果已经被收藏，则不执行收藏操作，直接返回
      return;
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
        // 更新当前项的收藏状态为已收藏
        item.collected = true;
        // 更新页面数据，触发重新渲染
        this.setData({
          searchResults: this.data.searchResults
        });
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
  }
})
