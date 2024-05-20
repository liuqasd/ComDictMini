Page({
  data: {
    searchResults: [],
    searchText: "",   // 存储搜索关键词
    collectedWords: [], // 已收藏的词汇列表
    searchTextForShare: [], // 存储当前展示的单词信息用于分享
  },

  options: {
    enableShareAppMessage: true
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
                collected: isCollected, // 添加字段表示是否已被收藏
                source: item.source
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

    // 如果已经被收藏，则取消收藏
    if (isCollected) {
      console.log('取消收藏');
      // 调用云函数从收藏集合中删除词汇
      wx.cloud.callFunction({
        name: 'removecollection',
        data: {
          name: item.name, // 传递要取消收藏的词条名称
          openid: openid // 传递用户的 OpenID
        },
        success: res => {
          console.log('取消收藏成功', res.result);
          // 更新当前项的收藏状态为未收藏
          item.collected = false;

          // 使用 map 方法遍历 searchResults 数组
          const searchResults = this.data.searchResults.map(item => {
            if (item.name === e.currentTarget.dataset.item.name) {
              item.collected = !item.collected;
            }
            return item;
          });
          // 更新页面数据，触发重新渲染
          this.setData({
            searchResults
          });

          // 显示取消收藏成功提示
          wx.showToast({
            title: '取消收藏成功',
            icon: 'success',
            duration: 2000
          });
        },
        fail: err => {
          console.error('取消收藏失败', err);
          // 显示取消收藏失败提示
          wx.showToast({
            title: '取消收藏失败，请登录',
            icon: 'none',
            duration: 2000
          });
        }
      });
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

        // 使用 map 方法遍历 searchResults 数组
        const searchResults = this.data.searchResults.map(item => {
          if (item.name === e.currentTarget.dataset.item.name) {
            item.collected = !item.collected;
          }
          return item;
        });
        // 更新页面数据，触发重新渲染
        this.setData({
          searchResults
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
  },

  // 下拉刷新触发的事件
  onPullDownRefresh() {
    this.getCollectedWords(); // 重新拉取收藏数据
    this.setData({
      searchResults: this.data.searchResults
    });
    wx.stopPullDownRefresh(); // 停止下拉刷新动画
  },

  onShareAppMessage() {
    const searchResults = this.data.searchResults;
    if (searchResults.length > 0) {
      const currentWord = searchResults[0];
      return {
        title: '我向你分享了一个计算机专业词汇词条：' + currentWord.name,
        path: '/pages/searchResult/searchResult?searchText=' + encodeURIComponent(currentWord.name)
      }
    } else {
      return {
        title: '我向你分享了一个计算机专业词汇词条',
        path: '/pages/index/index'
      }
    }
  }  
})
