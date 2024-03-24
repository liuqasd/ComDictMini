const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { word, definition } = event

  // 使用自然语言处理技术判断新词的含义是否符合规范
  const result = await nlp.process(word, definition)

  // 根据结果返回审核结果
  if (result.isCorrect) {
    return {
      success: true,
      message: '审核通过'
    }
  } else {
    return {
      success: false,
      message: '审核失败，原因：' + result.message
    }
  }
}
