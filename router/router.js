// 路由定义引入
const indexRouter = require('./index/index')
const meRouter = require('./me/index')
const loginRouter = require('./api/login')

const AppRoute = [
  ...indexRouter,
  ...loginRouter,
  ...meRouter
]

module.exports = AppRoute
