# Sångtexter
Sångtexterna ligger inte längre i en enda fil (`lyrics.json`). Vanliga låtar ligger i JSON-filen för sitt kapitel i [chapters](chapters)-mappen. Sigma-kapitlet har [sin egen mapp](chapters/sigma), där varje årgång har sin egen JSON-fil.

I [sångboksrepot](https://github.com/Fysiksektionen/Sangbok) finns [ett workflow](https://github.com/Fysiksektionen/Sangbok/actions/workflows/json-parse.yml) som konverterar TeX-filer till samma (gamla) format som [lyrics.json](lyrics.json) (kanske har ändrats när du läser detta). Då konverteringen inte fungerar perfekt bör sångerna läggas till manuellt. I slutet av varje år bör sigma-kapitlet genereras, (i JSON-format) och läggas till i [sigma-mappen](chapters/sigma), samt importeras i [chapters/sigma/index.ts](chapters/sigma/index.ts).

## Dolda låtar
Vissa låtar kan bara hittas via sökmotorn. Det enklaste sättet att lägga till en dold låt är att lägga till den i [songs.json](addons/songs.json).

## Dolda kapitel
Precis som för låtar finns det kapitel som endast kan hittas via sökmotorn. Exempel på dessa är Leo, och THS-kapitlena. För att lägga till ett dolt kapitel behöver det importeras i [index.ts](index.ts), och sedan läggas till i både `getSongByStringIndex` samt `getChapterByStringIndex`. För att det sedan ska komma upp i sökmotorn som ett kapitel, läggs det till i (search.json)[addons/search.json].

## Bild-ikoner
THS-kapitlet använder en SVG-fil som ikon. För att göra något liknande, behöver du först välja en Unicode-symbol som representerar ikonen internt, och sedan lägga till en mapping från denna symbol till bildfilen i (Index.tsx)[../components/Index.tsx].