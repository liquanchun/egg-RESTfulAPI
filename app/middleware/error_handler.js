'use strict';
const knex = require('../service/knex.js');

module.exports = (option, app) => {
  return async function (ctx, next) {
    try {
      ctx.logger.info(`Request Body:${JSON.stringify(ctx.request.body)}`);
      // 解析token
      // const {
      //   header: {
      //     authorization
      //   }
      // } = ctx.request
      // if (authorization) {
      //   const tokenkey = ctx.app.config.jwt.secret
      //   console.log(authorization)
      //   const decoded = ctx.app.jwt.verify(authorization, tokenkey)
      //   console.log(decoded)
      // } else {
      //   console.log('token is null')
      // }  
      await ctx.app.mysql.insert('sys_log', {
          method: ctx.request.method,
          ip: ctx.request.ip,
          url: ctx.url,
          user: ctx.headers.user,
          msg: JSON.stringify(ctx.request.body),
      });
      await next();
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      app.emit('error', err, this);
      const status = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const error = status === 500 && app.config.env === 'prod' ?
        'Internal Server Error' :
        err.message;
      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = {
        status: status, // 服务端自身的处理逻辑错误(包含框架错误500 及 自定义业务逻辑错误533开始 ) 客户端请求参数导致的错误(4xx开始)，设置不同的状态码
        msg: error
      };
      ctx.logger.error(error);
      if (status === 422) {
        ctx.body.detail = err.errors;
      }
      await ctx.app.mysql.insert('sys_log', {
          method: 'error',
          ip: ctx.request.ip,
          url: ctx.url,
          user: ctx.headers.user,
          msg: JSON.stringify(err),
      });
      ctx.status = 200;
    }
  };
};