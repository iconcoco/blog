// 路由定义引入
const indexRouter = require('./index/index')
const meRouter = require('./me/index')
const apiRouter = require('./api/index')

const AppRoute = [
  ...apiRouter,
  ...indexRouter,
  ...meRouter
]

module.exports = AppRoute
