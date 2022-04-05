// vue.config.js
/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack')

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  publicPath: '/sangbok/', // See https://cli.vuejs.org/config/#publicpath for limitations.
  lintOnSave: true,
  configureWebpack: {
    plugins: [new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 12288 /* Minimum number of characters */ })]
  },
  chainWebpack: config => {
    config.output.chunkFilename('js/[name].[chunkhash:8].js') // Allow custom filenames for chunks
    config.module.rule('images').use('url-loader').loader('url-loader')
      .tap(options => Object.assign(options, { limit: 5120 })) // Limit inline images to 5kb
    config.plugins.delete('prefetch')
    // config.optimization.splitChunks({ // Doesn't work.
    //   cacheGroups: {
    //     styles: {
    //       name: 'styles',
    //       test: /.*\.s?css$/,
    //       chunks: 'all',
    //       minChunks: 1,
    //       reuseExistingChunk: true,
    //       enforce: true
    //     }
    //   }
    // })
  }
}
