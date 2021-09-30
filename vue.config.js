// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  publicPath: '', // See https://cli.vuejs.org/config/#publicpath for limitations.
  chainWebpack: config => {
    config.output.chunkFilename('js/[name].[chunkhash:8].js') // Allow custom filenames for chunks
    config.module.rule('images').use('url-loader').loader('url-loader')
      .tap(options => Object.assign(options, { limit: 5120 })) // Limit inline images to 5kb
    config.plugins.delete('prefetch')
  }
}
