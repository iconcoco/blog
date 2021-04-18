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
      if (path) {
        Router.use(path, (() => {
          Router[route.type](route.url || '/', route.cb || function() {})
          return Router
        })())
      } else {
        Router[route.type](route.url || '/', route.cb || function() {})
      }
    }
  })
}

initRoute(AppRoute)

module.exports = Router
