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

    // 在第一个数据库中查询
    let result = await db.collection('ITVocabulary').where({
      name: wordName
    }).get();

    // 如果在第一个数据库中找到匹配的单词，则返回结果
    if (result.data.length > 0) {
      return {
        code: 200,
        data: result.data,
        message: '查询成功'
      };
    }

    // 在第二个数据库中查询
    result = await db.collection('LinuxCommand').where({
      name: wordName
    }).get();

    // 如果在第二个数据库中找到匹配的单词，则返回结果
    if (result.data.length > 0) {
      return {
        code: 200,
        data: result.data,
        message: '查询成功'
      };
    }

    // 在第三个数据库中查询
    result = await db.collection('AIMachineLearning').where({
      name: wordName
    }).get();

    // 如果中找到匹配的单词，则返回结果
    if (result.data.length > 0) {
      return {
        code: 200,
        data: result.data,
        message: '查询成功'
      };
    }
    
    // 在第四个数据库中查询
    result = await db.collection('newwordsfromusers').where({
      name: wordName
    }).get();

    // 如果中找到匹配的单词，则返回结果
    if (result.data.length > 0) {
      return {
        code: 200,
        data: result.data,
        message: '查询成功'
      };
    }

    // 都没有找到匹配的单词
    return {
      code: 404,
      message: '未找到匹配的单词'
    };
    } catch (e) {
    return {
      code: 500,
      message: `查询失败: ${e}`
    }
  }
}
