Page({
  data: {
    // 页面的初始数据
    inputFocus: false,
    searchText: "", // 存储搜索关键词
    searchResults: []
  },

  onLoad() {
    // 获取随机单词数据
    wx.cloud.callFunction({
      name: 'hotwords',
      success: (res) => {
        console.log('云函数返回的数据：', res.result)
        this.setData({ searchResults: res.result.data })
        console.log('searchResults：', this.data.searchResults)
      },
      fail: (err) => {
        console.error('获取随机单词数据失败:', err)
      }
    })
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

  onSearchHotWords: function(e) {
    // 获取点击的单词名称
    const hotword = e.currentTarget.dataset.item;
    // 点击热词卡片跳转
    console.log('跳转词汇：', hotword.name);
    wx.navigateTo({
      url: '/pages/searchResult/searchResult?searchText=' + hotword.name
    });
  }
})
