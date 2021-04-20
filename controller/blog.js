const path = require('path')

const dbPath = path.resolve(__dirname, '../db/article.json')

const db = require(dbPath)
const fs = require('fs')

class Blog {

  getBlogList () {
    return Object.values(db) || []
  }

  getBlogContent (id) {
    return db[id] || ''
  }

  setBlogContent ({ title, summary, content } = params) {
    const keys = Object.keys(db)
    const id = keys[keys.length - 1] && (Number(keys[keys.length - 1]) + 1) || 1001

    db[id] = {
      id,
      name: title,
      intro: summary,
      content
    }

    const result = JSON.stringify(db)
    return new Promise((resolve) => {
      fs.writeFile(dbPath, result, (err) => {
        if (err) {
          resolve(err)
        } else {
          resolve(null)
        }
      })
    })
  }
}

module.exports = Blog