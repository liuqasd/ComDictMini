const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 定义数据库查询函数
async function queryDatabase(collectionName, wordName) {
  return await db.collection(collectionName).where({
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

    // 并行执行三个数据库查询
    const results = await Promise.all([
      queryDatabase('ITVocabulary', wordName),
      queryDatabase('LinuxCommand', wordName),
      queryDatabase('AIMachineLearning', wordName),
      queryDatabase('newwordsfromusers', wordName),
    ]);

    // 合并查询结果
    const finalResults = results.reduce((acc, cur) => {
      acc.push(...cur.data);
      return acc;
    }, []);

    // 添加来源信息
    finalResults.forEach(item => {
      switch (item._collection) {
        case 'ITVocabulary':
          item.source = '计算机通用';
          break;
        case 'LinuxCommand':
          item.source = 'Linux命令';
          break;
        case 'AIMachineLearning':
          item.source = '机器学习';
          break;
        case 'newwordsfromusers':
          item.source = '用户上传';
          break;
      }
    });

    // 如果找到匹配的单词，则返回结果
    if (finalResults.length > 0) {
      return {
        code: 200,
        data: finalResults,
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
