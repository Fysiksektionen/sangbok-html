# Addons
Denna mapp innehåller låtar som inte ingår i den "vanliga" sångboken.
Den innehåller i första hand filer på samma format som `lyrics.json`, eller listor med `Song`-objekt.
`search.json`, innehåller sökbara objekt som inte är sånger (i nuläget används det endast för att låta sökmotorn hitta dolda kapitel).

## Lägga till saker
Vill du lägga till ett eget kapitel, lägg en JSON-fil på `lyrics.json`-format i [chapters](chapters)-mappen, och se till att den importeras i [index.ts](index.ts).  
Vill du lägga till en egen låt som endast syns i sökvyn, görs det enklast genom att lägga till den i [songs.json](songs.json).

## Ikon-index
Internt är alla index strängar, som _inte_ får innehålla HTML. T.ex. THS-kapitlet har index `✻`. Detta används internt för att hitta låtar och dolda kapitel, etc. THS-kapitlet har dock en ikon som visas, istället för `✻`. Detta hanteras av [Index-komponenten](../../components/Index.vue). Vill du lägga till en egen låt eller ett eget kapitel med ett ikon-index, gör följande:
1. Ge ditt kapitel ett internt index (t.ex. en emoji). Gör du ett kapitel, bör detta vara ett prefix.
2. Lägg till din ikon i `/public/img`(../../../public/img), helst helt svartfärgad, då CSS-teman för närvarande applicerar filter på bilderna för att få rätt färg.
3. Lägg till en referens från det interna indexet till bilden i [Index-komponenten](../../components/Index.vue).