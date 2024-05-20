const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event) => {
  try {
    const userId = event.openid; // 获取要撤销的用户ID
    const wordName = event.name; // 获取要撤销的词条
    // 在数据库中查找符合条件的记录并删除
    const res = await db.collection('newwordsfromusers').where({
      openid: userId,
      name: wordName
    }).remove();
    if (res.stats.removed > 0) {
      return {
        code: 200,
        message: '撤销上传成功'
      };
    } else {
      return {
        code: 404,
        message: '未找到匹配的上传记录'
      };
    }
  } catch (e) {
    return {
      code: 500,
      message: `撤销上传失败: ${e}`
    }
  }
}
