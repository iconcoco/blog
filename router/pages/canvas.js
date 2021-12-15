
module.exports = [
  /**
   * me首页
   */
  {
    url: '/canvas',
    type: 'get',
    cb: (req, res) => {
      res.render('canvas')
    }
  },
]
