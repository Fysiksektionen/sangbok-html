# Sångboken för webben
[![Build](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/build-vue.yml/badge.svg?branch=main)](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/build-vue.yml) 
[![ESLint](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/lint.yml/badge.svg?branch=main)](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/lint.yml) 
[![Tests](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/jest.yml/badge.svg?branch=main)](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/jest.yml) 
[![codecov](https://codecov.io/gh/Fysiksektionen/sangbok-html/branch/main/graph/badge.svg?token=AJEO5EPXXU)](https://codecov.io/gh/Fysiksektionen/sangbok-html)

Sångboken, för hemsidan. Work-in-progress. Detta är alltså _inte_ [den version](https://f.kth.se/sangbok/) som ligger uppe på hemsidan nu (se [Helmers repo](https://github.com/HelmerNylen/sangbok-f) för koden till den). Vill du se hur det går, ligger en hyfsat uppdaterad version [här](https://f-sangbok-3cf6d8.netlify.app). Vill du hänga på, eller har fler förslag på vad som kan förbättras är det bara att hojta till 😊.  
/ Oskar

## Hur du kör detta projekt
### Utveckling
Installera [Node.js 16](https://nodejs.org) om du inte redan har det. Klona sedan repot, och kör `npm install` i rotmappen. Gå sedan till mappen `music` och kör `./convert.sh` ([se /music](music/Readme.md)). Utvecklingsservern körs sedan i huvudmappen med `npm start`. Andra kommandon är:
* `npm run build` - kompilera projektet.
* `npm run lint` - lintar och fixar källkoden.

### Användning
Se [docker](docker)-mappen.

## Projektstruktur
Se [src](src/Readme.md)-mappen.