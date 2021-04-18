const IndexClass = require('../../controller/index')
const IndexController = new IndexClass()

let routers = []

routers.push({
  url: ['/', '/index'],
  type: 'get',
  cb(req, res) {
    const data = IndexController.getPageInfoData()
    
    res.render('index', data)
  }
})

routers.push({
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
})

// Blog App
routers.push({
  url: '/blog*',
  type: 'get',
  cb: (req, res) => {
    res.render('app')
  }
})

module.exports = routers
