const loginApi = require('./login')
const blogApi = require('./blog')

module.exports = [
  {
    path: '/api',
    children: [
      ...loginApi,
      ...blogApi
    ]
  }
]