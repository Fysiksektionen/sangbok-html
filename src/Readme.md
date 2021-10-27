# Frontend
Frontend-koden finns huvudsakligen i denna mapp. Även filer från [../public](../public) används, samt ett antal konfigurationsfiler i huvudmappen. Resterande mappar innehåller bara hjälpskript för byggprocessen.

## Struktur
Denna mapp innehåller följande mappar:
* `assets` - Innehåller statiska filer, mestadels bilder.
* `components` - Innehåller komponenter som används av flera views. Målet med dessa ska vara att vara så flexibla och små som möjligt
* `lyrics` - Innehåller `json`-filer med sångtexter, samt hjälpfunktioner för att hitta rätt låt, etc.
* `router` - Innehåller instruktioner för vilken sida som ska visas.
* `store` - Innehåller en global lagrings-singleton, dvs. variabler som alla sidor kan använda, och saker som vi vill spara mellan olika sessions.
* `themes` - Innehåller filer för att generera teman-
* `views` - Innehåller i första hand separata sidor, men även sångbladsgeneratorn. Här ska alla "större" komponenter vara.
* `views/**/` - Innehåller komponenter som endast används av en view (med komponentnamnet istället för `**`).

Framför allt komponenterna är ej uppdelade korrekt just nu.