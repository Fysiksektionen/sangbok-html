// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  publicPath: '', // See https://cli.vuejs.org/config/#publicpath for limitations.
  lintOnSave: true,
  chainWebpack: config => {
    config.output.chunkFilename('js/[name].[chunkhash:8].js') // Allow custom filenames for chunks
    config.module.rule('images').use('url-loader').loader('url-loader')
      .tap(options => Object.assign(options, { limit: 5120 })) // Limit inline images to 5kb
    config.plugins.delete('prefetch')
    // config.optimization.splitChunks.cacheGroups = { // Doesn't work.
    //   styles: {
    //     name: 'styles',
    //     test: /\.s?css$/,
    //     chunks: 'all',
    //     minChunks: 1,
    //     reuseExistingChunk: true,
    //     enforce: true
    //   }
    // }
  }
}
