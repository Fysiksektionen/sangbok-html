# Sångtexter
Sångtexterna ligger inte längre i en enda fil (`lyrics.json`). Vanliga låtar ligger i JSON-filen för sitt kapitel i [chapters](chapters)-mappen. Sigma-kapitlet har [sin egen mapp](chapters/sigma), där varje årgång har sin egen JSON-fil.

I [sångboksrepot](https://github.com/Fysiksektionen/Sangbok) finns [ett workflow](https://github.com/Fysiksektionen/Sangbok/actions/workflows/json-parse.yml) som konverterar TeX-filer till samma (gamla) format som [lyrics.json](lyrics.json) (kanske har ändrats när du läser detta). Då konverteringen inte fungerar perfekt bör sångerna läggas till manuellt. I slutet av varje år bör sigma-kapitlet genereras, (i JSON-format) och läggas till i [sigma-mappen](chapters/sigma), samt importeras i [chapters/sigma/index.ts](chapters/sigma/index.ts).

## Dolda låtar och kapitel
Kapitel och låtar som endast kan besökas via sökvyn. Se [addons](addons/README.md) för mer info.

## Taggar
Låtar kan ha taggar, och dessa går att söka på. Detta kan vara användbart om det finns flera alternativa stavningar eller titlar på låten. Exempel:
```json
{
    "title": "Ievan Polkka",
    "author": "E. Kettunen",
    "melody": "",
    "text": "Nuapurista kuulu se polokan tahti\nJalakani pohjii kutkutti\nIevan äiti se tyttöösä vahti\n...",
    "index": "🧅⭮",
    "tags": ["leekspin"]
}
```

Dessutom finns taggen `+`, som gör att låten kommer högre upp i sökresultat.

## Specialtecken
När sångblad ska genereras har LaTeX ofta problem med unicode-symboler. Detta kan lösas genom att lägga till en rad likt följande i [blad.cls](../../public/tex/blad.cls):
```tex
\DeclareUnicodeCharacter{2124}{$\mathbb{Z}$} % ℤ
```
Raden ovan definierar unicode-tecknet U+2124 (dvs. ℤ), och säger åt LaTeX att ersätta det med `$\mathbb{Z}$`.
