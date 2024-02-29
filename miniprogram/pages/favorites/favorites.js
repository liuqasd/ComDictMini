Page({
  data: {
    favorites: []
  },
  onLoad: function() {
    // 这里从后端或本地存储中获取收藏的术语
    // 例如：this.setData({ favorites: 获取到的收藏列表 });
  },
  onUnfavorite: function(e) {
    const id = e.currentTarget.dataset.id;
    // 实现取消收藏的逻辑
    console.log('取消收藏术语ID：', id);
    // 更新收藏列表
  }
})
