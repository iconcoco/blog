const FILENAME_QUERY_REGEXP = /\?.*$/u;
const FILENAME_EXTENSIONS = /\.(js|mjs)$/iu;

// const fs = require('fs')
// const path = require('path')

class webpackAnalysis {
  apply(compiler) {
    const done = (stats, callback) => {
      const bundleStats = this.filters(stats.toJson())
      bundleStats.chunks.forEach(i => {
        // console.log(i.info);
        console.log('=====');
        console.log(i);
      })
      // fs.writeFile('./build.js', JSON.stringify(stats), () => {})
      callback()
    }
    if (compiler.hooks) {
      compiler.hooks.done.tapAsync('webpackAnalysis', done);
    } else {
      compiler.plugin('done', done);
    }
  }

  filters(bundleStats) {
    bundleStats.assets = bundleStats.assets.filter(asset => {
      asset.name = asset.name.replace(FILENAME_QUERY_REGEXP, '');
  
      return FILENAME_EXTENSIONS.test(asset.name)
      // && !_.isEmpty(asset.chunks) && isAssetIncluded(asset.name);
    })

    return bundleStats
  }
}

module.exports = webpackAnalysis