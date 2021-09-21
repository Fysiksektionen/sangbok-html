# Sångboken för webben
[![Build](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/build-vue.yml/badge.svg?branch=main)](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/build-vue.yml) [![ESLint](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/lint.yml/badge.svg?branch=main)](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/lint.yml)

Sångboken, för hemsidan. Work-in-progress. Detta är alltså _inte_ [den version](https://f.kth.se/sangbok/) som ligger uppe på hemsidan nu (se [Helmers repo](https://github.com/HelmerNylen/sangbok-f) för koden till den). Vill du se hur det går, ligger en hyfsat uppdaterad version [här](https://f-sangbok-3cf6d8.netlify.app). Vill du hänga på, eller har fler förslag på vad som kan förbättras är det bara att hojta till 😊.  
/ Oskar

## Att göra
Se [issues](https://github.com/Fysiksektionen/sangbok-html/issues). Saker som kan göras i mån av tid och behov är:
* Fixa ett alternativt tema för att matcha den nya hemsidan.
* Easter-eggs

## Hur du kör detta projekt
### Utveckling
Installera [Node.js 16](https://nodejs.org) om du inte redan har det. Klona sedan repot, och kör `npm install` i rotmappen. Gå sedan till mappen `music` och kör `./convert.sh`*. Utvecklingsservern körs sedan i huvudmappen med `npm start`. Andra kommandon är:
* `npm run build` - kompilera projektet.
* `npm run lint` - lintar och fixar källkoden.

\* Detta steg kräver MuseScore 3 och bash. Har du inte MuseScore, kan du gå till den senaste [build-körningen](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/build-vue.yml), och ladda ner `music-svgs`. svg-filerna läggs sedan i `public/msvg`, och `svgs.json` flyttas till `src/assets/msvgs.json`.

### Körning
Gå till den senaste [build-körningen](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/build-vue.yml), skrolla ner till artifacts, och klicka på `dist` för att ladda ner en zip-fil med statiskt innehåll.

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

Att lägga till (övriga):
* Punschen kommer
* Månvisa
* Vikingen
* Härjavisan (upphovsrätten går ut 28 augusti 2022)
* Jag har aldrig vart på snusen
* Auld lang syne
* Marseljäsen
* En sockerbagare
* Te deum
* Väva vadmal
* Var redo
* Gubben Noak (eller Gubben Noach)
* Karl Alfred boy (kolla upphovsrätt)
* Typ hela lambda-kapitlet
