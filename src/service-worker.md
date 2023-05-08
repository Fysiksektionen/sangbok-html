# Service worker
Service workern (som hanterar PWA) har inaktiveras, då den orsakade för många cache-buggar. Filerna `registerServiceWorker.ts` och `service-worker.ts` ligger dock kvar. För att aktivera service workern igen, behöver:
 - `registerServiceWorker.ts` importeras i `main.ts`
 - `service-worker.js` (no-op, se längre ner) tas bort från `/public/`
 - Följande (eller liknande) läggas till i `vue.config.js` under `module.exports`:
```js
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
```

## No-op service worker
När webbläsaren har laddat ner en service worker kommer den att finnas kvar tills webbläsaren hittar en ny (eller tills användaren rensar webbläsardata). För att inaktivera en service worker krävs därför en så kallad "no-op" service worker, dvs. en service worker som inte gör någonting alls. Ett exempel på detta finns i `/public/sw.js`, och eventuellt i `service-worker.js`. _Ta inte bort_ `sw.js`. Tidigare hade vi en felaktig service worker där, och det skadar ingen att ha kvar den. `service-worker.js` bör endast tas bort om du försöker implementera service workern på nytt.

## Tidigare fel
Tidigare har det huvudsakliga problemet med service workern (och därav dess inaktivering) varit att webbläsaren cachear `index.html` längre än skripten som också krävs för att köra sidan. Webbläsaren har då försökt använda den cachade versionen av `index.html`, som pekar på gamla, numera icke-existerande versioner av skriptfilerna (vars namn innehåller hash). Trots upprepade försök har problemet alltid återkommit, men kanske kan just du som läser detta lösa detta problem.