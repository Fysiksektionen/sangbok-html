# Noter
Noter skrivs för närvarande i [MuseScore](https://musescore.org), eftersom det är gratis, och har ett cli för att generera svg-filer.

## Nya noter
Systemet hittar noter med hjälp av indexet. Med andra ord: se till att namnet på din .mscz-fil har börjar med samma index som låten du vill lägga till den med. När du läser detta kanske jag har fixat det, men det innebär för närvarande att noter ej kan läggas till i THS-kapitlet. (Se issue [25](https://github.com/Fysiksektionen/sangbok-html/issues/25))

## Konvertering
Denna mapp innehåller ett skript, `./convert.sh`, som konverterar om noterna i `mscz`-mappen till svg:s. Skriptet måste köras från denna mapp.
Vid normal utveckling körs skriptet utan flaggor, och vid produktions-builds bör den köras med flaggan `--compress` (vilket sparar ca. 50% utrymme, men är långsamt). Notera att detta skript automatiskt kopierar de genererade filerna till de mappar där de används av Vue om inte flaggan `--no-move` används. 

Skriptet kräver MuseScore 3 och bash. Har du inte MuseScore, kan du gå till den senaste [build-körningen](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/build-vue.yml), och ladda ner `music-svgs`. svg-filerna läggs sedan i `public/msvg`, och `svgs.json` flyttas till `src/assets/msvgs.json`.

## Noter och upphovsrätt
Det är inte upphovsrättsligt korrekt att ha med alla noter öppet på hemsidan. Tumregeln är att om kompositören varit död i mer än 70 år, är det fritt fram att lägga upp dem. I vissa fall kan det dock vara så att melodin är public domain, men arrangemanget är upphovsrätsskyddat. Sådana arrangemang bör undvikas.