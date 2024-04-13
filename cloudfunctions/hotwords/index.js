const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event) => {
  try {
    const collections = [
      { name: 'AIForScience', source: '人工智能' },
      { name: 'AIMachineLearning', source: '机器学习' },
      { name: 'ITVocabulary', source: '计算机通用' },
      { name: 'LinuxCommand', source: 'Linux命令' }
    ]

    // 使用 Promise.all() 并行地获取每个数据库的随机单词数据
    const results = await Promise.all(collections.map(async (collection) => {
      const result = await db.collection(collection.name).aggregate()
        .sample({ size: 4 })
        .end()

      // 为每个单词对象添加来源信息
      result.list.forEach(word => {
        word.source = collection
      })

      return result.list
    }))

    // 将每个数据库的结果合并为一个单一的数组
    const mergedResults = results.reduce((acc, cur) => acc.concat(cur), [])

    // 将结果数组随机打乱顺序
    const shuffledResults = shuffleArray(mergedResults)

    return {
      code: 200,
      data: shuffledResults,
      message: '随机词语获取成功',
    }
  } catch (e) {
    return {
      code: 500,
      message: `获取随机词语失败: ${e}`,
    }
  }
}

// 随机打乱数组顺序的函数
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}
