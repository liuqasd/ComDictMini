const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event) => {
  try {
    const wordName = event.searchQuery; // 获取传入的单词名称
    console.log('传入的单词:', wordName);
    // 确保传入了单词名称
    if (!wordName) {
      return {
        code: 400,
        message: '未提供单词名称'
      };
    }

    // 执行简单的数据库查询
    const result = await db.collection('ITVocabulary').where({
      name: wordName
    }).get();

    // 如果找到匹配的单词，则返回结果
    if (result.data.length > 0) {
      return {
        code: 200,
        data: result.data,
        message: '查询成功'
      };
    } else {
      return {
        code: 404,
        message: '未找到匹配的单词'
      };
    }
  } catch (e) {
    return {
      code: 500,
      message: `查询失败: ${e}`
    }
  }
}
