# sangbok-html
[![Build](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/build-vue.yml/badge.svg?branch=vue)](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/build-vue.yml) [![ESLint](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/lint.yml/badge.svg?branch=vue)](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/lint.yml)

Sångboken, för hemsidan. Work-in-progress. Detta är alltså _inte_ [den version](https://f.kth.se/sangbok/) som ligger uppe på hemsidan nu. Vill du se hur det går, ligger en hyfsat uppdaterad version [här](https://f-sangbok-3cf6d8.netlify.app). Vill du hänga på, eller har fler förslag på vad som kan förbättras är det bara att hojta till 😊.  
/ Oskar

## Att göra
Se [issues](https://github.com/Fysiksektionen/sangbok-html/issues). Saker som kan göras i mån av tid och behov är:
* Fixa en parser för att generera `lyrics.json` direkt från LaTeX-filerna i [sångboksrepot](https://github.com/Fysiksektionen/Sangbok).
* Fixa ett alternativt tema för att matcha den nya hemsidan.
* Fixa så att rewrites ej behövs för docker-containern.

## Hur du kör detta projekt
### Utveckling
Installera [Node.js 16](https://nodejs.org) om du inte redan har det. Klona sedan repot, och kör `npm install` i rotmappen. Utvecklingsservern körs sedan med `npm start`. Andra kommandon är:
* `npm run build` - kompilera projektet.
* `npm run lint` - lintar och fixar källkoden.

### Körning
Gå till den senaste [build-körningen](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/build-vue.yml), skrolla ner till artifacts, och klicka på `dist`. Alternativt kan Docker användas med `docker run ghcr.io/fysiksektionen/sangbok:main -p <hostPort>:80`, som startar en [lighttpd](https://www.lighttpd.net)-baserad container med sångboken på `/`.

<!-- See [Configuration Reference](https://cli.vuejs.org/config/). -->

## Noter och upphovsrätt
Det är inte säkert att det är upphovsrättsligt korrekt att ha med alla noter öppet på hemsidan.
Noter som vi i princip garanterat kan ha:
* Du gamla du fria
* Längtan till landet
* Smedsvisa
* Molltoner från Norrland (aka. Vårvindar friska)
* Studentsången
* O gamla klang och jubeltid
* Lyft ditt välförsedda glas (Ding dong Merrily on high. Arrat av Charles Wood)
* Kungssången

Noter som förmodligen är upphovsrättsskyddade:
* Nu grönskar det (egentligen är texten upphovsrättsskyddad, men...)
* Sveriges flagga (Upphovsrätten innehas av [Hugo Alfvénfonden](http://www.musakad.se/omakademien/organisation/stifelserochfonder/hugoalfvenfonden.601.html))
* Porthos visa
* Amanda Lundbom
