const Router = require('express').Router()
const AppRoute = require('./router')
// 给定义好的路由注册事件
const initRoute = (routers, path = '') => {
  routers.forEach(route => {
    if (route.path && route.children) {
      const prePath = [path, route.path].join('')
      return initRoute(route.children, prePath)
    }

    if (route.type) {
      Router[route.type](`${path}${route.url || '/'}`, route.cb || function() {})
    }
  })
}

initRoute(AppRoute)

// blog 路由代表博客路由
Router['get']('/blog*', (req, res, next) => {
  res.render('app')
})


module.exports = Router
