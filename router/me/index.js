const MeClass = require('../../controller/me')

module.exports = [
  /**
   * me首页
   */
  {
    url: '/me',
    type: 'get',
    cb: (req, res) => {
      const meControler = new MeClass()
      res.render('me', meControler.getPageInfo())
    }
  },
  /**
   * me/info 页面（请求）
   */
  {
    url: '/me/info',
    type: 'get',
    cb: (req, res) => {
      const { name = '', town = '' } = req.query
      if (req.xhr) {
        
        res.json({
          code: 0,
          msg: 'success',
          data: {
            name: `your (${name}) success request at ${town}`
          }
        })

      } else {
        res.render('me', {
          name,
          address: town,
          work: '99999'
        })
      }
    }
  },
  /**
   * 获取个人中心的优惠券
   */
  {
    url: '/me/getMyCoupon',
    type: 'post',
    cb: (req, res) => {
      res.json({
        code: 0,
        msg: 'success',
        data: req.body
      })
    }
  }
]
