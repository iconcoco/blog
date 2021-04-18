const db = require('../../db/article.json')

module.exports = [
  {
    url: '/getArticleList',
    type: 'get',
    cb(req, res) {
      const data = Object.values(db)

      res.json({
        code: 0,
        data
      })
    }
  },
  {
    url: '/article',
    type: 'post',
    cb(req, res) {
      const { id } = req.body

      const send = {}
      if (db[id]) {
        res.json({
          code: 0,
          data: db[id]
        })
      } else {
        res.json({
          code: -1,
          msg: '找不到文章'
        })
      }
    }
  }
]
