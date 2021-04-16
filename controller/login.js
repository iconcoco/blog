const fs = require('fs')
const path = require('path')
// 避免重复读取文件
let timer = false

class Login {
  constructor() {
    this.allUserInfo = []
  }

  /**
   * 查询所有用户信息
   */
  __searchAllUserInfo() {
    if (this.allUserInfo.length && timer) return this.allUserInfo
    timer = true
    try {
      const data = fs.readFileSync(path.resolve(__dirname, './../data/user.json'), 'utf8')
      this.allUserInfo = JSON.parse(data)

    } catch (error) {
      
    }
    return this.allUserInfo
  }
  __addUserAccount(username,  password) {
    const data = this.__searchAllUserInfo()
    data.push({
      name: username,
      psw: password
    })
    try {
      fs.writeFileSync(path.resolve(__dirname, './../data/user.json'), JSON.stringify(data))
      timer = false
    } catch (error) {
    }

    return true
  }
  // 判断用户的账号与密码
  checkLoginInfo (username, password) {
    const data = this.__searchAllUserInfo()
    
    const res = data.find(i => i.name == username.trim())
    if (!res) return false

    if (res.psw !== password) return false
    
    return true
  }

  addAccount(username,  password) {
    const data = this.__searchAllUserInfo()
    // 已经存在
    const res = data.find( i => i.name == username )
    if (res) return {
      code: 1000,
      msg: '账户已存在'
    }

    const bol = this.__addUserAccount(username,  password)
    if (bol) {
      return {
        code: 0,
        msg: 'success'
      }
    } else {
      return {
        code: 1000,
        msg: 'error'
      }
    }
  }
}

module.exports = Login
