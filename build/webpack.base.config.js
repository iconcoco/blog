const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin') //用于将css从js中抽离出来  可能会碰上不支持高版本的webapck  这时候需要安装 npm install --save-dev extract-text-webpack-plugin@next
const VueLoaderPlugin = require('vue-loader/lib/plugin') //vue-loader@15.x版本需要用插件来启用
const path = require('path')
// const MyPlugin = require('./plugins/webpack.my.plugin')
// const MyAnalysisPlugin = require('./plugins/webpack.analysis.plugin')

const { getClientEntry, getWebpackHtml } = require('./utils')

const entry = getClientEntry(path.resolve(__dirname, '../public/src/pages/index/index.js'))

module.exports = {
  entry,
  output: {
    path: path.resolve(__dirname, '../public/dist'),
    filename: 'js/[name].[hash:8].js',
    publicPath: '/',
    chunkFilename: 'js/[name].[hash:8].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // loader: ['style-loader', 'css-loader', 'postcss-loader']
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              singleton: true,
              // minimize: true //css压缩
            }
          }, 'postcss-loader']
        })
      }, {
        test: /\.(png|gif|jpg|ttf|woff|woff2|svg|ttf|eot)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 5000, //把小于50000 byte的文件打包成Base64的格式写入JS
            outputPath: 'img/', //当大于是使用file-loader将图片打包到images目录下
            name: '[name].[ext]?v=[hash]' //定义图片输出的名字,否则会以base64格式输出,在html页面中引入会报找不到图片
          }
        }
      }, {
        test: /\.(html|htm|xml)$/i,
        use: ['html-withimg-loader']
        // 'ejs-loader'
      }, {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              singleton: true,
              minimize: true //css压缩
            }
          }, 'postcss-loader', 'sass-loader']
        })
      }, {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }, {
        test: /\.vue$/,
        loader: 'vue-loader'
      }, {
        test: /\.(tpl|ejs)$/,
        use: 'ejs-loader'
      }],
  },
  plugins: [
    // new MyAnalysisPlugin(),

    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('../public/static/dll/manifest.json')
    }),

    new VueLoaderPlugin(), //vue-loader@15.x版本之后需要用的插件
    new ExtractTextPlugin({
      // filename: 'page/[name]/[name]-[hash:3].css'
      filename: 'css/[name].[hash:8].css',
      allChunks: true
    }), //配置打包之后的css放置于哪个位置,

    ...getWebpackHtml(entry)

    // new webpack.DllReferencePlugin({
    //     context: __dirname,
    //     manifest: require('./dll/manifest.json'),
    // }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all', //默认作用于异步chunk，值为all/initial/async/function(chunk),值为function时第一个参数为遍历所有入口chunk时的chunk模块，chunk._modules为chunk所有依赖的模块，通过chunk的名字和所有依赖模块的resource可以自由配置,会抽取所有满足条件chunk的公有模块，以及模块的所有依赖模块，包括css
      minSize: 30000,  //表示在压缩前的最小模块大小,默认值是30kb
      minChunks: 1,  // 表示被引用次数，默认为1；
      maxAsyncRequests: 5,  //所有异步请求不得超过5个
      maxInitialRequests: 3,  //初始话并行请求不得超过3个
      automaticNameDelimiter: '~', //名称分隔符，默认是~
      name: true,  //打包后的名称，默认是chunk的名字通过分隔符（默认是～）分隔
      cacheGroups: { //设置缓存组用来抽取满足不同规则的chunk,下面以生成common为例
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          name: 'vendors',
        },
        // common: {
        //     name: 'common',  //抽取的chunk的名字
        //     chunks(chunk) { //同外层的参数配置，覆盖外层的chunks，以chunk为维度进行抽取
        //     },
        //     test(module, chunks) {  //可以为字符串，正则表达式，函数，以module为维度进行抽取，只要是满足条件的module都会被抽取到该common的chunk中，为函数时第一个参数是遍历到的每一个模块，第二个参数是每一个引用到该模块的chunks数组。自己尝试过程中发现不能提取出css，待进一步验证。
        //     },
        //     priority: 10,  //优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中
        //     minChunks: 2,  //最少被几个chunk引用
        //     reuseExistingChunk: true,//  如果该chunk中引用了已经被抽取的chunk，直接引用该chunk，不会重复打包代码
        //     enforce: true  // 如果cacheGroup中没有设置minSize，则据此判断是否使用上层的minSize，true：则使用0，false：使用上层minSize
        // }
      }
    },
    runtimeChunk: { name: 'manifest' }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../public/src/'),
      '@app': path.resolve(__dirname, '../public/src/pages/app'),
    }
  }
  // 第三方包不打包进入bundle
  // externals: {
  //   "vue": 'vue',
  //   "jquery": "jquery"
  // },
}
