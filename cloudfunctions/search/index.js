const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    // 执行简单的数据库查询
    const result = await db.collection('words').where({
      word: 'command'
    }).get();

    // 返回查询结果
    return {
      code: 200,
      data: result.data,
      message: '查询成功'
    }
  } catch (e) {
    return {
      code: 500,
      message: `查询失败: ${e}`
    }
  }
}
