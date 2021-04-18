// 路由定义引入
// 1. 页面路由
const indexRouter = require('./pages/index')
const meRouter = require('./pages/me')

// 2. 接口路由
const apiRouter = require('./api/index')

const AppRoute = [
  ...apiRouter,
  ...indexRouter,
  ...meRouter
]

module.exports = AppRoute
