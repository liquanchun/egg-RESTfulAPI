const moment = require('moment')
const _ = require('lodash')
// 格式化时间
exports.formatTime = time => moment(time).format('YYYY-MM-DD hh:mm:ss')

// 处理成功响应
exports.success = ({
  ctx,
  res = null,
  data = null,
  total = 0,
  msg = '请求成功'
}) => {
  ctx.body = {
    status: 0,
    total: total,
    list: res,
    data: data,
    msg
  }
  ctx.status = 200
}

exports.newBody = payload => {
  const body = _.mapValues(payload, function (o) {
    return _.isArray(o) ? o.toString() : o
  })
  if(body.UpdateTime) delete body.UpdateTime
  return body
}