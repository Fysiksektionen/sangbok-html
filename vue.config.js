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
  },
  pwa: { // https://cli.vuejs.org/core-plugins/pwa.html#configuration
    name: 'Konglig Fysiks Sångbok',
    themeColor: '#FF642B',
    msTileColor: '#222',
    manifestOptions: {
      short_name: 'Sångboken',
      background_color: '#222222',
      // Description
      author: 'F.com',
      description: 'Den officiella, sökbara sångboken för Fysiksektionen vid THS innehåller både nya och gamla sånger för gasque och bankett.',
      // Display info
      lang: 'sv',
      dir: 'ltr',
      orientation: 'portrait',
      display: 'standalone',
      start_url: pwaRoot,
      scope: pwaRoot
    },
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // See https://developer.chrome.com/docs/workbox/reference/workbox-webpack-plugin/
      // Paths to exclude from pre-caching. Format: https://webpack.js.org/configuration/module/#condition
      // index.html is excluded, since we manually add '/' in service-worker.ts
      exclude: ['msvg', 'tex', 'img/icons', /\/js\/[generator|qrcodelib]\.[0-9|a-f]{8}\.js/, /\.map$/],
      // service-worker base
      swSrc: '@/service-worker.ts'
    }
  }
}
