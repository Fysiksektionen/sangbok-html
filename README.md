# sangbok-html
Sångboken, för hemsidan. WIP (detta är alltså _inte_ den version som ligger uppe på hemsidan nu).

## Varför?
Jag har tänkt att sångboken behöver uppdateras lite. Det fattas noter och matematikhatarvisor, och sångbladsskaparen borde vara mer användarvänlig. Vill du hänga på, eller har fler förslag på vad som kan göras är det bara att hojta till 😊.  
/ Oskar

## Att göra
* Skriva om layouten i Vue för att underlätta framtida underhåll.
  - Städa i koden så att den blir mer läsbar.
* Tillåt typos i sökmotorn.
* Hitta en lösning för att lägga in noter i sångboken (t.ex. svg eller [Vexflow](https://www.vexflow.com)).
* Förbättra sångbladsskaparen.
  - Ersätt python-filen med LaTeX (Python-filen renderar pdf:en, och sammanfogar sedan sidorna i rätt ordning för att göra pdf:en redo för direkt utskrift).
  - Undersöka möjligheten att använda [Overleafs API](https://www.overleaf.com/devs) för sångbladsskapande.
* Ev. fixa en parser för att generera `lyrics.min.js` direkt från LaTeX-filerna i [sångboksrepot](https://github.com/Fysiksektionen/Sangbok).
* Ev. fixa ett alternativt tema för att matcha den nya hemsidan.

## Hur du kör detta projekt
Installera [Node.js 16](https://nodejs.org) om du inte redan har det. Klona sedan repot, och kör `npm install` i rotmappen. Utvecklingsservern körs sedan med `npm start`. Andra kommandon är:
* `npm run build` - kompilera projektet.
* `npm run lint` - lintar och fixar källkoden.

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