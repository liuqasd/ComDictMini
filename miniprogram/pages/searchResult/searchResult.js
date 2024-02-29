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
        that.setData({
          searchResults: res.result.data.map((item) => {
            return {
              word: item.word,
              type: item.type,
              translation: item.translation,
              pronounce: item.pronounce,
            }
          })
        });
        },
        fail: function(error) {
          console.error(error)
        }
      }),
      console.log('调用云函数完毕');
    }
  }
})
