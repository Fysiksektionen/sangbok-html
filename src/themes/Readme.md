# Teman
Denna mapp innehåller scss-filer som används för att generera teman. Temaformatet är ännu inte standardiserat (och är därmed inte dokumenterat), men vill du göra ett eget tema, utgå från någon av de som redan finns, och se till att alla variabler är med (annars kommer inte programmet att kompileras).

Lägg sedan in id:t på ditt tema i `index.ts`, och se till så att body-klassen motsvarar detta id. Därefter är det bara att se till så att temat importeras i `../App.vue`.