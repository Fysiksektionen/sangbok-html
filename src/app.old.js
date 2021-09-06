// app.js from the old version of this site
/* eslint-disable */

angular.module('sangbok', ['ngRoute', 'sangbok.lyrics', 'sangbok.resources'])

  .config(function ($routeProvider) {
    $routeProvider
      .when('/search/:searchtext', {})
      .when('/chapter/:chapterindex', {})
      .when('/chapter/:chapterindex/song/:songindex', {})
      .otherwise({ redirectTo: '/' })
  })

  .controller('sangbokctrl', function ($scope, $sce, $location, $routeParams, Lyrics, Resources) {
    $scope.chapters = Lyrics.chapters
    $scope.indexes = Lyrics.indexes
    $scope.settings = JSON.parse(window.localStorage.getItem('sangbok.settings')) || { translate: false, night: true, larger: false, generator: false, download: null }
    $scope.stages = {
      search: 0,
      chapters: 1,
      songs: 2,
      lyrics: 3
    }
    $scope.stage = $scope.stages.chapters
    $scope.current = {}

    $scope.generatorSongs = JSON.parse(window.localStorage.getItem('sangbok.generator')) || []

    $scope.prefix = function (greek) {
      return $scope.settings.translate ? {
        Αα: 'Alfa',
        Ββ: 'Beta',
        Γγ: 'Gamma',
        Δδ: 'Delta',
        Εε: 'Epsilon',
        Ζζ: 'Zeta',
        Ηη: 'Eta',
        Θθ: 'Theta',
        Ιι: 'Iota',
        Κκ: 'Kappa',
        Λλ: 'Lambda',
        Μμ: 'My',
        Νν: 'Ny',
        Οο: 'Omikron',
        Σσ: 'Sigma',
        Lℓ: 'Leo'
      }[greek] : greek
    }

    $scope.showSettings = false
    $scope.toggleShowSettings = function () {
      $scope.showSettings ^= true
      $scope.deleteCheckmark()
    }
    $scope.toggleSetting = function (str) {
      $scope.settings[str] ^= true
    }
    $scope.saveSettings = function () {
      window.localStorage.setItem('sangbok.settings', JSON.stringify($scope.settings))
    }

    $scope.search = { text: '' }
    $scope.performSearch = function () {
      if ($scope.search.text.trim().length == 0) { return $scope.back() }

      // http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
      var regexEscape = function (s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
      }

      var text = $scope.search.text.trim()
      var keywords = text.split(' ').filter(function (a) { return a.length })
        .map(regexEscape)
        .map(function (a) {
          return new RegExp(a
            .replace(/\bporth?/g, 'porth?') // låt Porthos visa hittas av portos
            .replace(/stem/g, 'st[eè]m'), // låt Système International hittas av systeme
          'igm')
        })
      var regexedText = new RegExp(regexEscape(text), 'igm')

      var hits = [] // försök till bintree

      for (var i = 0; i < $scope.chapters.length; i++) {
        for (var j = 0; j < $scope.chapters[i].songs.length; j++) {
          var song = $scope.chapters[i].songs[j]
          var indexes = { chapterindex: i, songindex: j }

          // träff i olika egenskaper ger olika mycket poäng
          var rating = (song.title.search(regexedText) > -1) * 100 + (song.text.search(regexedText) > -1) * 50 + ((song.melody || '').search(regexedText) > -1) * 30 + ((song.author || '').search(regexedText) > -1) * 20

          var missing = 0
          // träff på någon av orden ger mindre poäng
          for (var k = 0; k < keywords.length; k++) {
            var keyword = keywords[k]
            var subrating = (song.title.search(keyword) > -1) * 10 + (song.text.search(keyword) > -1) * 5 + ((song.melody || '').search(keyword) > -1) * 3 + ((song.author || '').search(keyword) > -1) * 2

            rating += subrating
            if (subrating == 0) { missing++ }
          }
          if (rating == 0 || missing >= 2) { continue }

          // lägg till sökträff
          var node = hits
          var same = false
          while (node.length > 0) {
            if (rating > node[1].rating) { node = node[2] } else if (rating < node[1].rating) { node = node[0] } else {
              same = true
              break
            }
          }
          if (same) { node[1].songs.push(indexes) } else {
            node.push([], {
              songs: [indexes],
              rating: rating
            }, [])
          }
        }
      }

      // plocka ut ur trädet
      var res = []
      var extract = function (node) {
        if (node.length == 3) {
          extract(node[0])
          node[1].songs.reverse().forEach(function (a) { res.push(a) })
          extract(node[2])
        }
      }
      extract(hits)
      res.reverse()

      var last = $scope.stage
      $scope.current = { results: res, lastSearch: true, searchString: $scope.search.text }
      $scope.stage = $scope.stages.search
    }

    $scope.openChapter = function (chapterindex) {
      $scope.current = { chapterindex: chapterindex, lastSearch: false }
      $scope.stage = $scope.stages.songs
    }
    $scope.openSong = function (chapterindex, songindex) {
      $scope.current = { chapterindex: chapterindex, songindex: songindex, lastSearch: !!$scope.current.lastSearch, searchString: $scope.current.searchString }
      $scope.stage = $scope.stages.lyrics
    }
    $scope.back = function () {
      if ($scope.stage == $scope.stages.search || $scope.stage == $scope.stages.songs) { $scope.newUrl($scope.stages.chapters) } else if ($scope.stage == $scope.stages.lyrics) {
        if ($scope.current.lastSearch) { $scope.newUrl($scope.stages.search, $scope.current.searchString) } else { $scope.newUrl($scope.stages.songs, $scope.current.chapterindex) }
      }
    }

    $scope.convertToHTML = function (text) {
      return $sce.trustAsHtml(text.replace(/</gm, '&lt;').replace(/>/gm, '&gt;').replace(/\n/igm, '<br />'))
    }

    // https://stackoverflow.com/a/30810322
    $scope.copyToClipboard = function (song) {
      $scope.deleteCheckmark()

      var textArea = document.createElement('textarea')

      textArea.style.position = 'fixed'
      textArea.style.top = 0
      textArea.style.left = 0
      textArea.style.width = '2em'
      textArea.style.height = '2em'
      textArea.style.padding = 0
      textArea.style.border = 'none'
      textArea.style.outline = 'none'
      textArea.style.boxShadow = 'none'
      textArea.style.background = 'transparent'

      textArea.value = song.title + '\n\n' + song.text

      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        var successful = document.execCommand('copy')
        if (successful) {
          // console.log('Copied ' + song.title + ' to clipboard');
          var copy = document.getElementsByClassName('copy')
          if (copy.length > 0) {
            copy = copy[0]
            var checkbox = document.createElement('div')

            checkbox.innerHTML = '&#10004;'
            checkbox.classList.add('checkmark')

            copy.appendChild(checkbox)
          }
        } else { console.log('Copying failed') }
      } catch (err) {
        console.log(err)
        console.log('Unable to copy')
      }

      document.body.removeChild(textArea)
    }
    $scope.deleteCheckmark = function () {
      var checkbox = document.getElementsByClassName('checkmark')
      for (var i = 0; i < checkbox.length; i++) { checkbox[i].parentNode.removeChild(checkbox[i]) }
    }

    $scope.addToGenerator = function (chapterIndex, songIndex) {
      var item = [$scope.chapters[chapterIndex].songs[songIndex], chapterIndex, songIndex]
      if (!$scope.generatorSongs.some(function (i) {
        return i[1] == item[1] && i[2] == item[2]
      })) {
        $scope.generatorSongs.push(item)

        $scope.saveGeneratorSongs()
      }
    }
    $scope.removeFromGenerator = function (index) {
      $scope.generatorSongs.splice(index, 1)

      $scope.saveGeneratorSongs()
    }
    $scope.moveInGenerator = function (index, direction) {
      var temp = $scope.generatorSongs[index]
      $scope.generatorSongs[index] = $scope.generatorSongs[index + direction]
      $scope.generatorSongs[index + direction] = temp

      $scope.saveGeneratorSongs()
    }
    var generatorSongsToIndexes = function (generatorSongs) {
      return generatorSongs.map(function (item) {
        return [item[1], item[2]]
      })
    }
    var generatorSongsFromIndexes = function (generatorSongs) {
      var a = generatorSongs.map(function (item) {
        return [$scope.chapters[item[0]].songs[item[1]], item[0], item[1]]
      })
      return a
    }
    $scope.saveGeneratorSongs = function () {
      window.localStorage.setItem(
        'sangbok.generator',
        JSON.stringify(generatorSongsToIndexes($scope.generatorSongs))
      )
    }

    $scope.downloaded = false
    $scope.downloadSongs = function () {
      $scope.saveSettings()
      var d = $scope.settings.download
      var songs = $scope.generatorSongs.map(function (item) {
        return item[0]
      })

      var latexEscapes = [
        [/\"/g, "''"],
        [/Ω/g, '\\(\\Omega\\)'],
        [/ω/g, '\\(\\omega\\)'],
        [/τ/g, '\\(\\tau\\)'],
        [/π/g, '\\(\\pi\\)'],
        [/ζ/g, '\\(\\zeta\\)'],
        [/σ/g, '\\(\\sigma\\)'],
        [/δ/g, '\\(\\delta\\)'],
        [/ε/g, '\\(\\varepsilon\\)'],
        [/β/g, '\\(\\beta\\)'],
        [/β/g, '\\(\\beta\\)'],
        [/ϱ/g, '\\(\\rho\\)'],
        [/°/g, '\\(^\\circ\\)'],
        [/²/g, '\\(^2\\)'],
        [/³/g, '\\(^3\\)'],
        [/₂/g, '\\(_2\\)']
      ]
      var escapeAll = function (s) {
        for (var i = 0; i < latexEscapes.length; i++) { s = s.replace(latexEscapes[i][0], latexEscapes[i][1]) }

        return s
      }

      var content = []

      content.push('\\documentclass[a4paper, twoside, titlepage]{blad}\n\\usepackage{amsmath,amsfonts,amssymb,graphicx}\n%amsmath används ganska ofta graphicx är till för att använda grafik\n\n\\usepackage{verbatim}\n\\usepackage[T1]{fontenc}\n%\\usepackage{moreverb}\n%\\usepackage{xspace}\n%\\usepackage{float}\n\n%\\setlength{\\parindent}{0pt}     % tar bort indrag från stycken. Avslaget\n%\\setlength{\\parskip}{3pt}       % Ändra så att stycken skiljs av\n                                 % blankrader. Avslaget\n%\\addtolength{\\topmargin}{-0.8cm} %Minskar marginalerna litegrann\n%\\addtolength{\\textheight}{0.8cm}\n\n% Titel, författare etc.\n\\title{')
      content.push(d[0].settings[0].value)
      content.push('}\n')

      if (d[0].settings[1].value) { content.push('\\author{\\includegraphics[width=.8\\textwidth]{logga}}\n') }

      if (d[0].settings[2].value) { content.push('%') }
      content.push('\\date{}                          %Ta bort kommentaren om du inte vill ha med datum.\n\n\\begin{document}\n')

      content.push('\\pagenumbering{arabic}\n\\maketitle\n')

      var addDefaultText = function (text) {
        content.push(escapeAll(text
          .replace(/\n\n\n/g, '\\\\ \\vspace*{0.5cm}')
          .replace(/\n\n/g, '\\\\ ')
          .replace(/\n/g, '\\\\*\n')
          .replace(/\\\\ /g, '\n\n')
          .replace(/\\vspace\*{0\.5cm}/g, '\\vspace*{0.5cm}\n')
        ))
      }

      for (var i = 0; i < songs.length; i++) {
        content.push('\\begin{sang}{')
        content.push(escapeAll(songs[i].title))
        content.push('}\n')

        if (d[0].settings[3].value && songs[i].melody) {
          var melodyContent = (songs[i].melody
            .split('\n').filter(function (line) {
              return !d[1].settings[0].value || line.indexOf('notkapitlet') == -1
            }).join('\\hfil\\\\*\n\\hfil '))

          if (melodyContent.length != 0) {
            content.push('\\hfil\\textit{')
            content.push(escapeAll(melodyContent))
            content.push('}\\hfil\\\\*\n')
            content.push('\\vspace*{0.1cm}\n')
          }
        }

        var item = $scope.generatorSongs[i]

        var settingsIndex = 0
        switch (d.findIndex(function (entry, currentIndex) {
          return currentIndex >= 2 && entry.indexes.some(function (index) {
            return index[0] == item[1] && index[1] == item[2]
          })
        })) {
        case 2: // Årskursernas
          var description = songs[i].text.split('\n').filter(function (line) {
            return /^(?!\d\d)/.test(line)
          })
          var years = songs[i].text.split('\n').filter(function (line) {
            return /^\d\d/.test(line)
          })

          addDefaultText(description.join('\n') + '\n')
          var yearsContent = []

          var year = 1900
          var yearIndex = 0
          while (year < d[2].settings[0].value && ++yearIndex < years.length) {
            var digits = years[yearIndex].slice(0, 2) * 1
            if (digits == 0) { year = Math.ceil(year / 100) * 100 } else { year = Math.floor(year / 100) * 100 + digits }
          }
          for (var j = yearIndex; j < years.length; j++) { yearsContent.unshift(years[j] + '\\\\\n') }

          if (d[2].settings[3].value) { yearsContent = yearsContent.reverse() }

          if (d[2].settings[1].value) { yearsContent.push('Gästerna\\\\\n') }
          if (d[2].settings[2].value) { yearsContent.push('Köket\\\\\n') }

          content = content.concat(yearsContent)

          break

        case 3: // Regelbunden text
          if (d[3].settings[0].value) {
            content.push('\\begin{tabular}{llllll}\n')
            content.push(escapeAll(songs[i].text
              .split(/\n/g)
              .map(function (s) { return s.trim().replace(/\s+/g, ' & ') })
              .join('\\\\*\n')
            ))
            content.push('\n\\end{tabular}')
          } else {
            addDefaultText(songs[i].text
              .replace(/\n/g, '\\\\')
              .replace(/\s+/g, ' ')
              .replace(/\\\\/g, '\n')
            )
          }
          break

        case 4: // Monospace
          if (d[4].settings[0].value) { content.push('\\texttt{') }

          addDefaultText(songs[i].text)

          if (d[4].settings[0].value) { content.push('}') }
          break

          // Trunkeras
        case 5:
          if (settingsIndex == 0) { settingsIndex = 5 }
        case 6:
          if (settingsIndex == 0) { settingsIndex = 6 }
        case 7:
          if (settingsIndex == 0) { settingsIndex = 7 }

          addDefaultText(songs[i].text
            .split('\n\n')
            .slice(0, (d[settingsIndex].settings[0].value || d[settingsIndex].settings[0].max) * (settingsIndex == 5 ? 2 : 1))
            .join('\n\n')
          )
          settingsIndex = 0
          break

        case 8: // Gamla klang
          if (d[8].settings[0].value) {
            if (d[8].settings[1].value) { addDefaultText(songs[i].text.replace(/KÄRNAN/g, '\\textbf{KÄRNAN}')) } else {
              addDefaultText(songs[i].text
                .replace(/KÄRNAN/g, '\\textbf{KÄRNAN}')
                .split(/\n\n\n/g)[0]
              )
            }
          } else {
            if (d[8].settings[1].value) { addDefaultText(songs[i].text) } else { addDefaultText(songs[i].text.split(/\n\n\n/g)[0]) }
          }
          break

          // Med info i slutet
        case 9:
          if (settingsIndex == 0) { settingsIndex = 9 }

        case 10:
          if (settingsIndex == 0) { settingsIndex = 10 }

        case 11:
          if (settingsIndex == 0) { settingsIndex = 11 }

        case 12:
          if (settingsIndex == 0) { settingsIndex = 12 }

        case 13:
          if (settingsIndex == 0) { settingsIndex = 13 }

          if (!d[settingsIndex].settings[0].value) { addDefaultText(songs[i].text.split(/\n\n\n/g)[0]) } else { addDefaultText(songs[i].text) }
          settingsIndex = 0
          break

        case 14: // Hyllningsvisa
          if (!d[14].settings[0].value) {
            addDefaultText(songs[i].text.split(/\n\n\n/g)[0])
            addDefaultText('\n\nDessa tekniska lik!!! Barampam!')
          } else { addDefaultText(songs[i].text.replace(/</g, '\\textit{').replace(/>/g, '}')) }
          break

        case 15: // ODE till en husvagn
          if (d[15].settings[0].value) {
            var verses = songs[i].text.split(/\n\n/g)
            verses[4] = '\\begin{flalign*}m\\ddot{x}+c\\dot{x}+kx&=mg\n\\dot{x}&=A\\omega_n\\cos{\\omega_n t}\n\\tau&=\\frac{2\\pi}{\\omega_n}\n\\omega_n&=\\sqrt{\\frac{k}{m}}\\end{flalign*}'
            addDefaultText(verses.join('\n\n'))
          } else { addDefaultText(songs[i].text) }
          break

        default:
          if (item[1] == 8 && item[2] == 14) // Aris summavisa
          {
            addDefaultText(songs[i].text
              .replace('trollat bort n', 'trollat bort \\(n\\)')
              .replace('Maclaurin av ln', 'Maclaurin av \\(\\ln\\)')
            )
          } else if (item[1] == 8 && item[2] == 16) // Liten visa om Gram-Schmidts metod
          {
            addDefaultText(songs[i].text
              .replace(/M/g, '\\(M\\)')
              .replace('vektor a', 'vektor \\(\\boldsymbol{a}\\)')
            )
          } else if (item[1] == 9 && item[2] == 15) // Stad i ljus
          { addDefaultText(songs[i].text.split(/\n\n\n/g)[0]) } else { addDefaultText(songs[i].text) }
          break
        }

        content.push('\n')

        if (d[0].settings[4].value && songs[i].author !== null && songs[i].author.length !== 0) {
          content.push('\\\\* \\vspace*{0.1cm}\n')
          content.push('\\raggedleft\\textit{')
          content.push(escapeAll(songs[i].author.replace('\n', '\\\\* ')))
          content.push('}\n')
        }

        content.push('\\end{sang}\n')
      }

      content.push('\n\\end{document}')

      var blob = new Blob([Resources.sangbladPy(Resources.bladCls, Resources.logga64, content.join(''))], { type: 'text/plain' })
      var url = window.URL.createObjectURL(blob)

      $scope.download(url, 'sångblad.py')
      window.URL.revokeObjectURL(url)

      $scope.downloaded = true
    }
    $scope.download = function (link, filename) {
      var a = document.createElement('a')
      a.setAttribute('href', link)
      a.setAttribute('download', filename)
      a.setAttribute('target', '_blank')

      a.style.display = 'none'
      document.body.appendChild(a)

      a.click()
      document.body.removeChild(a)
    }
    $scope.generatorSettingRelevant = function (indexes) {
      for (var i = 0; i < $scope.generatorSongs.length; i++) {
        for (var j = 0; j < indexes.length; j++) {
          if (indexes[j][0] == $scope.generatorSongs[i][1] && indexes[j][1] == $scope.generatorSongs[i][2]) { return true }
        }
      }

      return false
    }
    $scope.generatorUpdateSetting = function (setting, newValue) {
      if (newValue !== undefined) { setting.value = newValue }

      $scope.saveSettings()
    }

    $scope.generatorSongs = generatorSongsFromIndexes($scope.generatorSongs)
    if (!$scope.settings.download || $scope.generatorSongs.length == 0) {
      $scope.settings.download = [
        {
          title: 'Allmänt',
          settings: [{
            text: 'Titel på förstasida',
            type: 'string',
            value: 'Sångblad'
          }, {
            text: 'Logga på förstasida',
            type: 'bool',
            value: true
          }, {
            text: 'Datum på förstasida',
            type: 'bool',
            value: true
          }, {
            text: 'Inkludera melodi',
            type: 'bool',
            value: true
          }, {
            text: 'Inkludera författare',
            type: 'bool',
            value: false
          }]
        }, {
          title: 'Notkapitlet',
          indexes: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [3, 7], [9, 7], [9, 12], [10, 3], [10, 5], [13, 4], [13, 6]],
          settings: [{
            text: 'Ta bort notis om notkapitlet',
            type: 'bool',
            value: true
          }]
        }, {
          title: 'Årskursernas hederssång',
          indexes: [[13, 1]],
          settings: [{
            text: 'Inkludera t.o.m.',
            type: 'number',
            value: new Date().getFullYear() - 5,
            min: 1900,
            max: 2100,
            placeholder: 'År'
          }, {
            text: 'Inkludera "gästerna"',
            type: 'bool',
            value: false
          }, {
            text: 'Inkludera "köket"',
            type: 'bool',
            value: false
          }, {
            text: 'Stigande ordning',
            type: 'bool',
            value: false
          }]
        }, {
          title: 'Système International och liknande',
          indexes: [[8, 0], [8, 17], [8, 18]],
          settings: [{
            text: 'Ordna texten regelbundet',
            type: 'bool',
            value: true
          }]
        }, {
          title: 'The BASIC song',
          indexes: [[8, 4]],
          settings: [{
            text: 'Monospace-typsnitt',
            type: 'bool',
            value: true
          }]
        }, {
          title: 'Fredmans sång n:o 21 - Måltidssång',
          indexes: [[10, 0]],
          settings: [{
            text: 'Antal verser',
            type: 'number',
            value: 8,
            min: 1,
            max: 8,
            placeholder: 'Antal'
          }]
        }, {
          title: 'Fredmans epistel n:o 48',
          indexes: [[10, 2]],
          settings: [{
            text: 'Antal verser',
            type: 'number',
            value: 7,
            min: 1,
            max: 7,
            placeholder: 'Antal'
          }]
        }, {
          title: 'Molltoner från Norrland',
          indexes: [[10, 3]],
          settings: [{
            text: 'Antal verser',
            type: 'number',
            value: 6,
            min: 1,
            max: 6,
            placeholder: 'Antal'
          }]
        }, {
          title: 'O gamla klang och jubeltid',
          indexes: [[13, 6]],
          settings: [{
            text: 'Fetstilt "KÄRNAN"',
            type: 'bool',
            value: true
          }, {
            text: 'Inkludera info om bordsdunkande',
            type: 'bool',
            value: false
          }]
        }, {
          title: 'Vodka, vodka',
          indexes: [[3, 33]],
          settings: [{
            text: 'Inkludera varianter på första versen',
            type: 'bool',
            value: true
          }]
        }, {
          title: 'Sista punschvisan',
          indexes: [[5, 14]],
          settings: [{
            text: 'Inkludera info om andra versen',
            type: 'bool',
            value: false
          }]
        }, {
          title: 'Jag var full en gång',
          indexes: [[7, 1]],
          settings: [{
            text: 'Inkludera info om andra versen',
            type: 'bool',
            value: true
          }]
        }, {
          title: 'Dom som är nyktra',
          indexes: [[7, 5]],
          settings: [{
            text: 'Inkludera vers att sjunga i dur',
            type: 'bool',
            value: true
          }]
        }, {
          title: 'Konglig Fysiks Paradhymn',
          indexes: [[13, 0]],
          settings: [{
            text: 'Inkludera rad om att fysiker står',
            type: 'bool',
            value: false
          }]
        }, {
          title: 'Hyllningsvisa',
          indexes: [[11, 4]],
          settings: [{
            text: 'Inkludera rader om mössan',
            type: 'bool',
            value: true
          }]
        }, {
          title: 'ODE till en husvagn',
          indexes: [[8, 7]],
          settings: [{
            text: 'Femte stycket som formler',
            type: 'bool',
            value: false
          }]
        }]
    }

    $scope.newUrl = function (stage, arg1, arg2) {
      if (stage == $scope.stages.search) {
        $location.url('/search/' + window.encodeURIComponent($scope.search.text))
      } else if (stage == $scope.stages.chapters) {
        $location.url('/')
      } else if (stage == $scope.stages.songs) {
        $location.url('/chapter/' + arg1)
      } else if (stage == $scope.stages.lyrics) {
        $location.url('/chapter/' + arg1 + '/song/' + arg2)
      }
    }

    $scope.$on('$routeChangeSuccess', function () {
      if ($routeParams.searchtext !== undefined) {
        $scope.search.text = $routeParams.searchtext
        $scope.performSearch()
      } else if ($routeParams.chapterindex !== undefined) {
        if ($routeParams.songindex !== undefined) {
          var c = $routeParams.chapterindex * 1
          var s = $routeParams.songindex * 1
          if (c >= 0 && c < Lyrics.indexes.length && s >= 0 && s < Lyrics.indexes[c].length) { $scope.openSong(c, s) } else { $location.url('/') }
        } else {
          var c = $routeParams.chapterindex * 1
          if (c >= 0 && c < Lyrics.indexes.length) { $scope.openChapter(c) } else { $location.url('/') }
        }
      } else if ($location.url() == '/') {
        $scope.current = {}
        $scope.stage = $scope.stages.chapters
      }

      if ($scope.stage == $scope.stages.chapters) { $scope.search.text = '' }
    })

    var deletedSongs = [
      [6, 9] // Avundsjuk visa
    ]
    for (var i = 0; i < deletedSongs.length; i++) {
      $scope.chapters[deletedSongs[i][0]].songs.splice(deletedSongs[i][1], 1)
      $scope.indexes[deletedSongs[i][0]].splice(deletedSongs[i][1], 1)
    }

    var appendedSongs = [
      {
        chapter: {
          chapter: 'Visor till Leo',
          prefix: 'Lℓ',
          songs: [
            { title: 'Leos visa', author: 'Johan', melody: "You can't get a man with a gun", text: 'Jag vill börja gasqua, var fan är vår Leo?\nVarför är grabben alltid så se-en?\nSkall Leo få kräva, vi väntar med att häva\nÄh vi kör det är han som är klen!\nVilken segis, är han fegis?\nVilka tror Leo inte vill hit?\n\nTill Täby vi rider och sedan Leo lider\nHan har gömt sig på sitt lilla rum\nEn flaska vi hava, av festligaste cava\nSå vi ger honom vinet, och se, där är flinet\nFör han är vår törstiga Leoo' },
            { title: 'Leos reservvisa', author: null, melody: "You can't get a man with a gun", text: 'Jag vill börja gasqua, var fan är min Leo?\nVem i helvete stal min butelj?\nSkall Leo mig tvinga, en Leo börja svinga\nNej, för fan bara blunda och svälj\nVilken Leo, får jag spörja\nVem för fan tror att jag är en Leo?\n\nTill Leo vi rider och sedan Leo lider\nTräffar vi Leo på Leo Leo\nOch Leo vi Leo, blott Leo av det Leo\nUtav Leo, och Leo, jag Leo gå Leo\nFör att Leo på Leo Leoo' },
            { title: 'Han är Leo', author: 'Från klubbishörnan på Stuggasquen', melody: 'Hallelujah', text: "Han minns ej festen '95\nFör han var inte född då än\nJa, pojken är en jätteliten klubbis\nBland Fysiker han häfver sämst\nMen grillmeister det är han främst\nNär det ska lagas fågel på en sittning\n\nHan är Leo..." },
            { title: 'Han är fortfarande Leo', author: 'Johan', melody: 'Hallelujah', text: 'Han klagar, suckar, drygar loss \noch inte är han snäll mot oss\nmen detta är ju en del av hans fasad\nHans hjärta pumpar, stort och varmt\nEn vän som stödjer genom allt\nTill honom, nu vi tar en sup med mening\n(Stående)\n\nSkål för Leo...' },
            { title: 'Man ska ha Leo', author: null, melody: 'Husvagn', text: 'Jag har prövat nästan allt\nsom finns att välja på\nBlinddejt, tinder, nattklubb, skriva dikter eller så\nJag har försökt att ragga på de konstigaste sätt\nMen äntligen jag funnit hur man ska få haffa rätt\n\nMan ska ha Leo\nDen bästa wingman man kan ha\nMan ska ha Leo\nDå kommer natten sluta bra\nMan ska ha Leo\nDå säger alla bara "Japp!"\nMan ska ha Leo\nOm man vill få napp\n\nFör Leo, han är både lite dryg och ganska trevlig\nMen i med lite punsch så blir han både söt och kelig\nDå kvittar det vem man i baren råkar stöta på\nFör Leo är den ende som besvarar ens åtrå\n\nMan ska ha Leo\nHan är så stor, han är så stark\nMan ska ha Leo\nAtt pussa på i någon park\nMan ska ha Leo\nAtt fria till en vacker dag\nMan ska ha Leo\nLeo svarar "Ja!"' },
            { title: 'Skål för Leo', author: null, melody: 'Rule Britannia', text: 'På Data hör det till god ton och etikett\nAtt gå omkring och skryta vitt och brett\nMen deras matte den är alltför lätt\n\nMen vi kan det mesta\noch bäst av oss är han;\nhan som allting utom hållfen ace:a kan!\n\nSkål för Leo, tjoho för L-E-O\nSkål för grabben som är både glad och go!\nSkål för Leo, som höjer vårat snitt\nFrån hans labbar kan vi kopiera fritt!' },
            { title: 'Leosång', author: null, melody: 'Kungssången', text: 'Ur Fysikernas djup en gång\nen samfälld och en enkel sång\nsom går till Leo fram\nVar honom trofast och hans vett\nGör tentan i regleren lätt\nmen lagar han en kycklingrätt\nvar något mer aktsam' },
            { title: 'Trasten', author: 'Cred: Hanna', melody: 'Måsen', text: "Det satt en trast i en fågelholk\nDär var det livat i lördags\nDen hade capsat med fågelfolk\nLångt inpå morgonen öl dracks\n\"Du är för full för att flyga\", sa en\nAv dess kamrater, men ändå flög den\nFrån sitt kalas, rätt in i glas\n\nDet flög en trast lite av och an\nden hade knockats av smällen\nDen vingla' runt tills den ändå fann\nen plats att glömma bort kvällen\n\"Jag tar en tupplur på detta galler!\nDå är det noll risk att jag sen faller\ni askan där - jag sover här!\"\n\nDet låg en trast på sektionens grill,\ndär den i natt hade somnat\nDet tog ett tag tills den kvickna till\nDå hade vingarna domnat\n\"Det känns så varmt\", tänkte fågeln dåsigt\n\"Jag tror jag brinner, det var ju tråkigt\"\nSen var den där, hos Sankte Per\n\n:(" },
            { title: 'Leo kommer', author: 'Cred: Gabbe', melody: 'Glada änkan', text: 'Leo kommer, Leo kommer\ntill vår sal\nLeo rimmar tills vi svimmar,\nsmäller av\nDricker sen till Leo\ntills vi illa mår\nInga sorger finnas mer\nnär Leo går' },
            { title: 'Jag gillar Leo', author: null, melody: 'Jag gillar punschen', text: 'Länge har jag tänkt\natt Leo övergiva\nMen det blir aldrig av\nså länge jag får leva\nför när jag en gång dör\nså står det på min grav\n"Här vilar en som Leo Enge grillat har"\n\nJag grillar\nJag grillar Leo\nJag grillar de som Leo skapat har\nMamma Ingrid, och Pappa Ulrik\nDe är så jävla, jävla bra!' },
            { title: 'Det var en gång en klubbis', author: null, melody: 'Det var en gång en fågel', text: 'Det var en gång en liten klubbis\nJa en klubbis\nHan bodde i Täby och Leo hette han\nHan ville gärna supa med sina vänner\nMed sina vänner\nMen det fick inte han' },
            { title: 'Marseleo', author: null, melody: 'Marseljäsen/de Lisle', text: "Han dricker punsch, han dricker alkohol\nHan dricker mer än vad han tål!\nSedan tejpar vi 'hop ben och armar\noch så rullar han runt på vårt golv\nTrots att klockan knappt har slagit tolv\nTuggar han gamla pannkakor\nSå går det när man super 'kapp\nMen inte får nåt handikapp\nMot göteborgare med hybris\nDe dricker utan stopp\nTills ölen kommer opp\n\n||: Drick en, drick fem\nvarenda en\n1: Sen vinglar båda hem! :||\n2: Med risk för liv och lem!" },
            { title: 'Fångad hos Leo', author: null, melody: 'Fångad av en stormvind', text: "Jag har aldrig slutat tro\nAtt efter varje natt väntar räddningen\nRedan ätit upp min sko\nJag sover på hans golv, han som en gång var min vän\n\nJag hör dunset av en källardörr som stängs\nPlötsligt står han där och leendet förvrängs\n\nJag är fångad av vår Leo\nBunden fast\nTrots han knappt är 20 bast\nHar han redan mördat åtta\nFångad av vår Leo\nNatt och dag\nTappat räkningen har jag\nInget ljus når genom grottans tak\n\nHur kan allt ha gått så fel?\nEn fågel grilla' han, fick sen blodad tand\nMen nu vill han spela spel\n\"Jag sågar av din fot, om du gnager av din hand\"\n\n\"Annars ryker både axlar, knän och tår\"\nHan har redan tagit tuggor av mitt lår\n\nJag är fångad av vår Leo..." },
            { title: 'Leos spritvisa', author: null, melody: 'Snickerboa', text: "Till Konsulatet ränner jag\noch plingar på dess dörr\nDär sitter Leo varje dag\noch pluggar tills han dör\nGK han blev inte glad\nnär Leo vingla ut och sa\n\"Jag drack till lunch\nen flaska punsch,\noch spydde upp min Bullen-brunch\"\n\n\"Men, detta var ju inte bra\ndet är ju fest ikväll\nOch Leo, du är ska ansvara\"\n\"Men ja ja, sluta gnäll!\"\nLeo börja' nyktra till\noch gasquen gick helt utan spill\nTills väktarn kom\noch fann honom\ni skrubben med en flaska rom" },
            { title: 'Leos grillarvisa', author: null, melody: 'Idas sommarvisa', text: 'Du ska inte tro det blir sittning\nIfall inte nån lagar mat\nOch vad är då bättre än grillning?\nMed Leo tar lågorna fart\nHan sågar ner träden i skogen\nOch häller sen på terpentin\nSnart syns inte Kons för all smogen\nPå Leo syns bara ett flin\n\nHan lägger en fågel på grillen\nOch ser hur den fräser och pyr\nGarnerar med moroten, dillen\nSmakar en bit, och sen spyr\nNär Roger är redo att käkas\nSå ger vi Fest PrU halva var\nSen turas de om om att kräkas\nSå bränner vi det som är kvar' },
            { title: 'Tillståndsinspektör', author: null, melody: 'Melodi: Blå förgätmigej\nSjungs knästående för tillståndsenheten. Med kläderna på.', text: 'Hur gärna skulle jag ej strippa\nInför en tillståndsinspektör\nInför en tillståndsinspektör\nDå skulle jag från festen slippa\noch ensam kröka utanför' },
            { title: 'O gamla klang och Leotid', author: null, melody: 'O gamla klang och jubeltid', text: "Båd' spårvagn, buss och elhybrid\nGår alldeles för långsamt\nEn Täbybo har sällan tid\nAtt färdas i nåt sådant\nDe duger ej för våran grabb\nNär han kör bil då går det snabbt\nFör Leo, Leo, Leo\nJa, grabben heter Leo!\n\nVem äro han som gjorde allt\nFrån fester till sonnetter\nSom grillat korp åt de som svalt\nHelt utan kolbriketter\nSom klarat hållfen helt galant\noch pysslat om vår elefant\nJo Leo, Leo, Leo\nJa, grabben heter Leo!\n\nMen hjärtat hos vår Överföhs\nKan ingen hoppas smälta\nÅt Leos dikter hon blott fnös\nVi får väl honom hjälpa\nVi ringer noll sju no-oll sex\nNio fyrtio två fem ett\nTill Leo, Leo, Leo\nJa grabben heter Leo!\n\nMed tillräckligt med gyckelhets\nÄr Leo på det mesta\nVid stugan drogs det till sin spets\nDå fick han allting testa\nTrots att han inte alltid vill\nSå dricker vi vår Leo till\nSå skålar vi till Martin!\nSå skålar vi till Leo!" }
          ]
        },
        index: ['ℓ1a', 'ℓ1b', 'ℓ2a', 'ℓ2b', 'ℓ3', 'ℓ4', 'ℓ5', 'ℓ6', 'ℓ7', 'ℓ8', 'ℓ9', 'ℓ10', 'ℓ11', 'ℓ12', 'ℓ13', 'ℓ14', 'ℓ∞'],
        unlocks: new Date(2027, 10 - 1, 28),
        urlkey: 'leo'
      }
    ]
    for (var i = 0; i < appendedSongs.length; i++) {
      if ((appendedSongs[i].unlocks && new Date() > appendedSongs[i].unlocks) ||
            (appendedSongs[i].urlkey && !!new URL(location.href).searchParams.get(appendedSongs[i].urlkey))) {
        $scope.chapters.push(appendedSongs[i].chapter)
        $scope.indexes.push(appendedSongs[i].index)
      }
    }
  })
