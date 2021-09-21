// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  publicPath: '', // See https://cli.vuejs.org/config/#publicpath for limitations.
  chainWebpack: config => {
    config.output.chunkFilename('js/[name].[id].[chunkhash:8].js')
  }
}
