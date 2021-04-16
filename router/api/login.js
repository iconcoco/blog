const LoginClass = require('./../../controller/login')
const LoginController = new LoginClass()

module.exports = [
  {
    url: '/api/login',
    type: 'post',
    cb(req, res) {
      const { username, password } = req.body

      if (!password || !username) return res.json({
        code: 1000,
        msg: 'miss params'
      })

      // 检验真伪
      const bol = LoginController.checkLoginInfo(username, password)
      if (!bol) return res.json({
        code: 1000,
        msg: 'error params'
      })


      res.json({
        code: 0,
        msg: 'success'
      })
    }
  },
  {
    url: '/api/regist',
    type: 'post',
    cb(req, res) {

      const { userAccount,  password } = req.body

      if (!userAccount || !password) return res.json({
        code: 1000,
        msg: 'error'
      })

      const result = LoginController.addAccount(userAccount,  password)
      
      res.json(result)
    }
  }
]
