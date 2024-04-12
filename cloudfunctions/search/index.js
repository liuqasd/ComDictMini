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

    // 定义一个空数组来存储所有结果
    const results = [];

    // 在第一个数据库中查询
    let result = await db.collection('ITVocabulary').where({
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
      item.source = '计算机通用';
    });
    // 将结果添加到数组中
    results.push(...result.data);

    // 在第二个数据库中查询
    result = await db.collection('LinuxCommand').where({
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
      item.source = 'Linux命令';
    });
    // 将结果添加到数组中
    results.push(...result.data);

    // 在第三个数据库中查询
    result = await db.collection('AIMachineLearning').where({
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
      item.source = '机器学习';
    });
    // 将结果添加到数组中
    results.push(...result.data);
    
    // 在第四个数据库中查询
    result = await db.collection('AIForScience').where({
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
      item.source = '人工智能';
    });
    // 将结果添加到数组中
    results.push(...result.data);

    // 在第五个数据库中查询
    result = await db.collection('newwordsfromusers').where({
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
      item.source = '用户上传';
    });
    // 将结果添加到数组中
    results.push(...result.data);


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