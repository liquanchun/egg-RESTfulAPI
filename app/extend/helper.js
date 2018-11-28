const moment = require('moment')

// 格式化时间
exports.formatTime = time => moment(time).format('YYYY-MM-DD hh:mm:ss')

// 处理成功响应
exports.success = ({ ctx, res = null,total = 0 , msg = '请求成功'})=> {
  ctx.body = {
    code: 0,
    total: total,
    list: res,
    msg
  }
  ctx.status = 200
}
