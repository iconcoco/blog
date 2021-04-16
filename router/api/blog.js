
module.exports = [
  {
    url: '/test',
    type: 'get',
    cb(req, res) {
      
      res.json({
        code: 0,
        msg: '成功啦'
      })
    }
  }
]
