# Sångboken för webben
[![Build](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/build-vue.yml/badge.svg?branch=main)](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/build-vue.yml) 
[![ESLint](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/lint.yml/badge.svg?branch=main)](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/lint.yml) 
[![Tests](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/jest.yml/badge.svg?branch=main)](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/jest.yml) 
[![codecov](https://codecov.io/gh/Fysiksektionen/sangbok-html/branch/dev/graph/badge.svg?token=AJEO5EPXXU)](https://codecov.io/gh/Fysiksektionen/sangbok-html)

[Sångboken](https://f.kth.se/sangbok/), för hemsidan. Omskriven och utökad version av [Helmers original](https://github.com/HelmerNylen/sangbok-f). Vill du hänga på, eller har fler förslag på vad som kan förbättras är det bara att hojta till 😊.
/ Oskar

## Hur du kör detta projekt
### Utveckling
Installera [Node.js 18](https://nodejs.org) om du inte redan har det. Klona sedan repot, och kör `npm install` i rotmappen. Gå sedan till mappen `music` och kör `./convert.sh` ([se /music](music/Readme.md)). Utvecklingsservern körs sedan i huvudmappen med `npm start`. Andra kommandon är:
* `npm run build` - kompilera projektet.
* `npm run lint` - lintar och fixar källkoden.

### Användning
Se [docker](docker)-mappen. Projektet är testat för att ligga på sökvägen `/sangbok/`. Även andra sökvägar bör fungera, om [PWA-manifestet](public/pwa/manifest.json) uppdateras.

## Projektstruktur
Se [src](src/Readme.md)-mappen.

## Sångbladsmallen
Hittar du [här](public/tex/blad.cls). Det finns även [en version](public/tex/blad.v1.1.3.cls) som är bakåtkompatibel med fkm*:s gamla mall, om du som läser detta bara vill ha en mall som löser problemet med dubbelsidighet. Den hanterar dock inte melodi-layout på rätt sätt. Får du problem med marginalerna, dubbelkolla att dokumentklassen är specificerad som `\documentclass[a4paper, titlepage, twoside]{blad}`.

## Nya låtar
För att lägga till noter, gör en [MuseScore](https://musescore.org/)-fil med dessa, och följ sedan instruktionerna här[music/README.md]. Systemet för att lägga till nya låtar (texter) är inte helt enhetligt. Se (denna fil)[src/lyrics/README.md] för mer information.
