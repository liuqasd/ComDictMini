const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { name, trans, usphone, ukphone, pos, example, openid } = event

  // 验证输入参数
  if (!name || !trans) {
    return {
      success: false,
      message: '参数错误'
    }
  }

  // 将新词信息存入数据库
  const db = cloud.database()
  const collection = db.collection('newwordsfromusers')
  const result = await collection.add({
    data: {
      name,
      trans,
      usphone, 
      ukphone, 
      pos,
      example,
      openid,
      createTime: Date.now()
    }
  })

  // 返回结果
  if (result.errMsg === 'collection.add:ok') {
    return {
      success: true,
      message: '上传成功'
    }
  } else {
    return {
      success: false,
      message: '上传失败，原因：' + result.errMsg
    }
  }
}
