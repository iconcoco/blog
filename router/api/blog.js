const db = require('../../db/article.json')
const Blog = require('../../controller/blog.js')

const BlogController = new Blog()
let routes = []

// 获取文章列表
routes.push({
  url: '/getArticleList',
  type: 'get',
  cb(req, res) {
    const data = BlogController.getBlogList()

    res.json({
      code: 0,
      data
    })
  }
})

// 获取文章内容
routes.push({
  url: '/article',
  type: 'post',
  cb(req, res) {
    const { id } = req.body

    const send = {}
    const content = BlogController.getBlogContent(id)

    if (content) {
      res.json({
        code: 0,
        data: content
      })
    } else {
      res.json({
        code: -1,
        msg: '找不到文章'
      })
    }
  }
})

// 发表文章
routes.push({
  url: '/publishArticle',
  type: 'post',
  async cb(req, res) {
    const { title, summary, content } = req.body
    if (![title, summary, content].every(i => !!i)) {
      return res.json({
        code: -1,
        data: '缺少参数'
      })
    }

    const err = await BlogController.setBlogContent({
      title,
      summary,
      content
    })
    if (err) {
      res.json({
        code: -1,
        msg: err
      })
    } else {
      res.json({
        code: 0,
        data: '成功啦'
      })
    }
  }
})

module.exports = routes
