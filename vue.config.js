// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  publicPath: '', // See https://cli.vuejs.org/config/#publicpath for limitations.
  chainWebpack: config => {
    config.output.chunkFilename('js/[name].[id].[chunkhash:8].js') // Allow custom filenames for chunks
    config.module.rule('images').use('url-loader').loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10240 })) // Limit inline images to 10kb
  }
}
