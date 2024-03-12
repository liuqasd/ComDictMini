// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await db.collection('collection').add({
      data: {
        name: event.name,  // 从客户端传递过来的词条名称
        trans: event.trans,  // 从客户端传递过来的词条翻译
        usphone: event.usphone,  // 从客户端传递过来的词条美式发音
        ukphone: event.ukphone,  // 从客户端传递过来的词条英式发音
        openid: event.openid  // 从客户端传递过来的用户 OpenID
      }
    })
    return result
  } catch (err) {
    console.error(err)
    throw err
  }
}
