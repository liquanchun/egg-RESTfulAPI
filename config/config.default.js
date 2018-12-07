module.exports = appInfo => {
  const config = exports = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1513779989145_1674'

  // add your config here
  // 加载 errorHandler 中间件
  config.middleware = ['errorHandler']

  // 只对 /api 前缀的 url 路径生效
  // config.errorHandler = {
  //   match: '/api',
  // }

  config.security = {
    csrf: {
      enable: false
    },
    domainWhiteList: ['http://localhost:4200']
  }

  config.multipart = {
    fileExtensions: ['.apk', '.pptx', '.docx', '.csv', '.doc', '.ppt', '.pdf', '.pages', '.wav', '.mov'], // 增加对 .apk 扩展名的支持
  },

  config.bcrypt = {
    saltRounds: 10 // default 10
  }

  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: '193.112.155.251',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: 'KGFKO8dtZt',
      // 数据库名
      database: 'car_app',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  config.jwt = {
    secret: 'Great4-M',
    enable: true, // default is false
    match: '/jwt', // optional
  }

  return config
}