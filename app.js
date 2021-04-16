const express = require('express')
const App = express()
// const ExpressEjsLayout = require('express-ejs-layouts')
const path = require('path')
const bodyParser = require('body-parser')/*post方法*/
const CONFIG = require('./config')

const NODE_ENV = process.env.NODE_ENV

// 中间件
const middleWare = require('./middleware/common')

const appRouter = require('./router')

App.set('views', path.join(__dirname, './views')) // 制定服务器模板目录
App.engine('.html', require('ejs').__express) //指定服务应用的指定渲染引擎;
App.set('view engine', 'html')  //默认扩展名为html(如在路由渲染使用index.html, 则‘.html’可以省去)

//设置静态资源访问路径 在页面则用 /static/资源路径引用
App.use('/static', express.static(path.resolve(__dirname, './public/static')))
App.use('/dist', express.static(path.resolve(__dirname, './public/dist')))

// App.use(ExpressEjsLayout) // 使用layout
App.use(bodyParser.json())// 添加json解析
App.use(bodyParser.urlencoded({ extended: false }))
// 中间件，处理公共属性or方法
App.use(middleWare)

// 路由
App.use(appRouter)
App.use((req, res, next) => {
  // 当所有页面找不到时返回单页面应用
  res.render('404')
})

App.listen(CONFIG.port.server, () => {
  console.log(`server is run at http://localhost:${CONFIG.port.server}`)
})
