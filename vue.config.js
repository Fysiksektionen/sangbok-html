// vue.config.js
/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack')
const path = require('path')

// Root path
const root = '' // Compilation root path
const pwaRoot = '/sangbok/' // PWA entrypoint

// Version info
let commitId
try {
  commitId = require('child_process').execSync('git rev-list --max-count=1 --abbrev=8 --abbrev-commit HEAD').toString().trimEnd('\n')
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
      new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 12288 /* Minimum number of characters */ })
    ]
  },
  chainWebpack: config => {
    config.output.chunkFilename('js/[name].[chunkhash:8].js') // Allow custom filenames for chunks
    config.plugins.delete('prefetch')
  },
  devServer: {
    headers: { 'Service-Worker-Allowed': 'http://localhost:8080' },
    static: { directory: path.join(__dirname, 'public'), publicPath: root }
  }
}
