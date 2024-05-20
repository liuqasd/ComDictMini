const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 查询数据库的函数
async function queryDatabase(collectionName, wordName) {
  let result = await db.collection(collectionName).where({
    $or: [
      {
        name: {
          $regex: `.*${wordName}.*`, // 使用正则表达式进行模糊匹配
          $options: 'i' // 忽略大小写
        }
      },
      {
        "trans.0": {
          $regex: `.*${wordName}.*`,
          $options: 'i'
        }
      }
    ]
  }).get();
  // 添加来源信息
  result.data.forEach(item => {
    item.source = collectionName; // 使用数据库集合名称作为来源信息
  });
  return result.data;
}

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

    // 定义一个空数组来存储所有结果
    const results = [];

    // 查询多个数据库
    const collections = ['ITVocabulary', 'LinuxCommand', 'AIMachineLearning', 'AIForScience', 'newwordsfromusers', 'csharp','SQL_statement', 'go'];
    for (let collection of collections) {
      const collectionResults = await queryDatabase(collection, wordName);
      results.push(...collectionResults);
    }

    // 如果找到匹配的单词，则返回结果
    if (results.length > 0) {
      return {
        code: 200,
        data: results,
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
