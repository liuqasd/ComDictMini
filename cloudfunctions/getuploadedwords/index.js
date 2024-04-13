// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const openid = cloud.getWXContext().OPENID;
    const res = await db.collection('newwordsfromusers').where({
      openid: openid
    }).get();
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
