# Sångboken för webben
[![Build](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/build-vue.yml/badge.svg?branch=vue)](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/build-vue.yml) [![ESLint](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/lint.yml/badge.svg?branch=vue)](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/lint.yml)

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
Gå till den senaste [build-körningen](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/build-vue.yml), skrolla ner till artifacts, och klicka på `dist` för att ladda ner en zip-fil med statiskt innehåll. Alternativt kan Docker användas, via `docker pull ghcr.io/fysiksektionen/sangbok-html:main`. Denna container exponerar port 80 till vilken HTTP-requests kan skickas. Requestsen måste skickas till `/sangbok/`, annars returneras 404.

#### Docker-containrar
Containrarna är taggade efter vilken branch de kommer från, dvs.
* `latest` - från `main`
* `edge` - från `vue`
Dessa containrar är [nginx](https://www.nginx.com)-baserade, och innehåller förkomprimerade filer i både brotli- och gzip-format.

Utöver detta finns några suffix om användaren mot förmodan skulle vilja ha en mindre container på bekostnad av prestandan.
* `nginx-gz` - [nginx](https://www.nginx.com)-baserad. Innehåller förkomprimerade förkomprimerade filer gzip-format.
* `statigz` - [statigz](https://pkg.go.dev/github.com/vearutop/statigz)-baserad. Innehåller förkomprimerade filer i brotli-format.

De [nginx](https://www.nginx.com)-baserade presterar generellt sett bättre, med mindre RAM. De klarar sig bra på 8mb RAM, men kan dra nytta av upp till ca. 20mb. `nginx-pc` är den "bästa" containern i alla avseenden, med undantaget att containern är större än de andra två. `nginx-gz` kommer i praktiken alltid att serva gzip-komprimerade filer, vilka är ca. 40-50% större än motsvarande brotli-komprimerade filer (även om den "kan" omkomprimera gzip -> brotli, görs detta endast om klienten har stöd för brotli men inte gzip, vilket i praktiken aldrig inträffar). `statigz`-containrarna är optimerade för att serva brotli-komprimerade filer. Det finns egentligen ingen anledning att använda denna framför `nginx-pc` om en inte har platsbrist på servern.Statigz kräver minst 16mb ram, och gärna uppemot 48mb.

<!-- See [Configuration Reference](https://cli.vuejs.org/config/). -->

### Noter
Se [music/Readme.md](music/Readme.md)
