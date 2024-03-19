// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { name, openid } = event;
  const collection = db.collection('collection');

  // 检查参数
  if (!name || !openid) {
    console.error('参数错误:', event);
    return {
      code: 400,
      message: '参数错误'
    };
  }

  // 从数据库中删除词汇
  const result = await collection.where({
    name,
    openid
  }).remove();

  // 返回结果
  if (result.stats.removed === 1) {
    console.log('删除成功');
    return {
      code: 200,
      message: '删除成功'
    };
  } else {
    console.error('删除失败:', result);
    return {
      code: 500,
      message: '删除失败'
    };
  }
};
