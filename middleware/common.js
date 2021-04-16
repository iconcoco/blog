// const AppRoute = require('./../router/router')
// const AllPath = AppRoute.map(i => i.url)
module.exports = (req, res, next) => {
  // 中间件。所有请求处理公共方法，如处理cookie
  // if (AllPath.includes(req.originalUrl)) {
  // console.log(req);
  next()
  // } else {
  // res.render('dist/index')
  // }
  
}
