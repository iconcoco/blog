const IndexClass = require('../../controller/index')
const IndexController = new IndexClass()

module.exports = [
  {
    url: '/index',
    type: 'get',
    cb(req, res) {
      const data = IndexController.getPageInfoData()
      
      res.render('index', data)
    }
  },
  // 如果匹配不到node的路由，默认会返回单页面应用
  // {
  //   url: '*',
  //   type: 'get',
  //   cb: (req, res) => {
  //     res.render('dist/index')
  //   }
  // },


  {
    url: '/ssr',
    type: 'get',
    cb: (req, res) => {
      const ssrPromise = IndexController.renderSsr()

      ssrPromise.then(html => {
        res.end(html)
      }, () => {
        res.render('404')
      })
    }
  }
]
