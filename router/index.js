const Router = require('express').Router()
const AppRoute = require('./router')
// 给定义好的路由注册事件
AppRoute.forEach( route => {
  if (route.type) {
    Router[route.type](route.url || '/', route.cb || function() {})
  }
})

// blog 路由代表博客路由
Router['get']('/blog*', (req, res, next) => {
  res.render('app')
})


module.exports = Router
