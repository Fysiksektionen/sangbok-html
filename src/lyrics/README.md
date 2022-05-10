# Sångtexter
De flesta av sångtexterna ligger i (lyrics.json)[lyrics.json], som helst bör genereras automatiskt från TeX-filerna i (sångboksrepot)[https://github.com/Fysiksektionen/Sangbok]. När detta skrivs fungerar detta endast på `digital`-branchen, varpå filerna genereras automatiskt, och kan hittas [här](https://github.com/Fysiksektionen/Sangbok/actions/workflows/json-parse.yml). Detta bör fungera som det ska för de vanliga kapitlena. I slutet av varje år bör sigma-kapitlet genereras, (i JSON-format), för att sedan manuellt läggas i (denna mapp)[https://github.com/Fysiksektionen/Sangbok/tree/digital/parser/inject/15] med namnet `sigmaXX.json` där XX är årtalet. Alla låtar i JSON-filer i denna mapp läggs automatiskt till i sigma-kapitlet.

## Dolda låtar
Vissa låtar kan bara hittas via sökmotorn. Det enklaste sättet att lägga till en dold låt är att lägga till den i [songs.json](addons/songs.json).

## Dolda kapitel
Precis som för låtar finns det kapitel som endast kan hittas via sökmotorn. Exempel på dessa är Leo, och THS-kapitlena. För att lägga till ett dolt kapitel behöver det importeras i [index.ts](index.ts), och sedan läggas till i både `getSongByStringIndex` samt `getChapterByStringIndex`. För att det sedan ska komma upp i sökmotorn som ett kapitel, läggs det till i (search.json)[addons/search.json].

## Bild-ikoner
THS-kapitlet använder en SVG-fil som ikon. För att göra något liknande, behöver du först välja en Unicode-symbol som representerar ikonen internt, och sedan lägga till en mapping från denna symbol till bildfilen i (Index.tsx)[../components/Index.tsx].