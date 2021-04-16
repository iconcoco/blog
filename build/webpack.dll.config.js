const webpack = require('webpack')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin') 
const outPutPath = '../public/static'

const library = '[name]_[hash]'

const vendors = [
  'vue', 
  'vue-router',
  // 'element-ui',
  // 'jquery'
]

module.exports = {
  // mode: 'production',
  output: {
    path: path.join(__dirname, outPutPath, 'dll'),
    filename: '[name].[hash:8].js',
    library,
    publicPath: '/static/dll/'
  },
  entry: {
    lib: vendors,
  },
  module: {
    rules: [
      {
        test: /\.(html|htm|xml)$/i,
        use: ['html-withimg-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(path.join(__dirname, outPutPath, 'dll')),
    new webpack.DllPlugin({
      path: path.join(__dirname, outPutPath, '/dll/manifest.json'),
      name: library,
      // context: __dirname,
    }),

    new htmlWebpackPlugin({
      template: path.resolve(__dirname, '../views/template.html'),
      filename: path.resolve(__dirname, '../views/common/vue.dll.html'),
    })
  ],
  optimization: {
    minimize: true
  }
}
