# Noter
Noter skrivs för närvarande i [MuseScore](https://musescore.org), eftersom det är gratis, och har ett cli för att generera svg-filer.

## Konvertering
Denna mapp innehåller ett skript, `./convert.sh`, som konverterar om noterna i `mscz`-mappen till svg:s. Skriptet måste köras från denna mapp.
Vid normal utveckling körs skriptet utan flaggor, och vid produktions-builds bör den köras med flaggan `--compress` (vilket sparar ca. 50% utrymme, men är långsamt). Notera att detta skript automatiskt kopierar de genererade filerna till de mappar där de används av Vue om inte flaggan `--no-move` används. 

## Noter och upphovsrätt
Det är inte upphovsrättsligt korrekt att ha med alla noter öppet på hemsidan. Tumregeln är att om kompositören varit död i mer än 70 år, är det fritt fram att lägga upp dem. I vissa fall kan det dock vara så att melodin är public domain, men arrangemanget är upphovsrätsskyddat. Sådana arrangemang bör undvikas.

### Notkapitlet
Övriga låtar i detta kapitel är upphovsrättsskyddade. De tillagda är således:
* Du gamla du fria
* Längtan till landet
* Smedsvisa
* Molltoner från Norrland (aka. Vårvindar friska)
* Studentsången
* O gamla klang och jubeltid
* Lyft ditt välförsedda glas (Ding dong Merrily on high. Arrat av Charles Wood)
* Kungssången

### Upphovsrättsskyddade noter
Tyvärr kan vi inte lägga till dessa klassiker av upphovsrättsskäl.
* Porthos visa
* Amanda Lundbom
* Nu grönskar det (egentligen är texten upphovsrättsskyddad, men...)
* Sveriges flagga (Upphovsrätten innehas av [Hugo Alfvénfonden](http://www.musakad.se/omakademien/organisation/stifelserochfonder/hugoalfvenfonden.601.html)/[Gehrmans](https://www.gehrmans.se/upphovspersoner-lista))
* Livet är härligt (Röda kavalleriet, D. Pokrass))

### Att lägga till:
Dubbelkolla upphovsrätten innan detta görs.
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