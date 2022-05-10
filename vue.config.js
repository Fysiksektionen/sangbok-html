// vue.config.js
/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack')
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin')

// Root path
const root = '/sangbok/'

// Version info
let commitId
try {
  commitId = require('child_process').execSync('git rev-list --max-count=1 --abbrev=8 --abbrev-commit HEAD').toString()
} catch {
  console.warn('[WARNING] git doesn\'t seem to be installed. Cannot add commit info to the build. This may cause problems with PWA caching.')
}

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  publicPath: root, // See https://cli.vuejs.org/config/#publicpath for limitations.
  lintOnSave: true,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({ __COMMIT__: JSON.stringify(commitId) }),
      new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 12288 /* Minimum number of characters */ }),
      new ServiceWorkerWebpackPlugin({
        entry: '@/service-worker.ts',
        publicPath: root,
        includes: ['**/*', '**/**/*'],
        excludes: ['**/.*', '**/*.map']
      })
    ]
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
  },
  devServer: { headers: { 'Service-Worker-Allowed': 'http://localhost:8080' } }
}
