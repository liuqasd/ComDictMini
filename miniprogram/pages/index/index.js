Page({
  data: {
    // 页面的初始数据
    inputFocus: false,
    searchText: "" // 存储搜索关键词
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

    // wx.request({
    //   url: 'https://qwerty.kaiyi.cool/dicts/itVocabulary.json', // 请求的网址
    //   method: 'GET', // 请求方法
    //   success: function(res) {
    //     console.log('请求成功', res.data); // 打印返回的数据
    //     // 在这里处理返回的数据，将其展示到前台
    //   },
    //   fail: function(error) {
    //     console.error('请求失败', error);
    //     // 处理请求失败的情况
    //   }
    // });
    
  }
})
