# Deployment
## Körning utan docker
Självfallet kan programmet servas statiskt genom att köra `npm run build`, och kopiera över filerna från dist-mappen till lämplig plats på servern. I mappen du nu betraktar finns även en  `.htaccess`-fil som kan läggas tillsammans med de byggda filerna för att hantera caching. Du som gör detta är nog dock mer bevandrad i Apache än jag, så den kanske inte är så användbar.

Alternativt kan du som läser detta gå till den senaste [build-körningen](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/build-vue.yml), skrolla ner till artifacts, och klicka på `dist-node-18.x` för att ladda ner en zip-fil med statiskt innehåll.

## Docker
Denna mapp innehåller filer som används för att generera docker-containrar. Docker-containrar kan ses som en slags lätt virtual machine, dvs. en isolerad miljö där serven körs.

Generellt sett är processen följande:
* Alla byggprocesser antar att rätt notfiler finns i `/public`-mappen.
* Vue-källkoden kopieras in i en container, och programmet byggs.
* Den byggda appen förkomprimeras till lämpliga format (gzip och/eller brotli)
* Filerna från den byggda appen kopieras till en container med en webbserver (nginx, för närvarande)

### Testkörning
Kör `docker run --pull always --publish 8080:80 ghcr.io/fysiksektionen/sangbok-html:latest` för att testköra containern på port `8080`.

### Taggar
Containrarna är taggade efter vilken branch de kommer från, dvs.
* `latest` - från `main`
* `edge` - från `dev`
Dessa containrar har alla filer förkomprimerade som gzip, och de mest använda filerna förkomprimerade även med brotli.

Utöver detta finns andra containrar, som använder andra trade-offs mellan förkomprimering och prestanda.
* `nginx-gz` - Innehåller endast förkomprimerade filer i gzip-format.
* `nginx-gz-br` - Innehåller förkomprimerade filer i både brotli- och gzip-format. Brotli-filerna är ca. 30% mindre än motsvarande gzip-filer.

### Varför fungerar inte bilderna?
Se till att du proxyar trafiken till port 80 på containern. Containrarna är tänkta att användas bakom en reverse proxy (RP, dvs. t.ex. [traefik](https://traefik.io/traefik/) eller någon webbserver, t.ex. [Apache](httpd.apache.org)), och accepterar requests till `/`, `/sangbok/` och `/sangbok2/`. Vill du ha den på någon annan path, får du antingen modifiera dockerfilerna, eller låta din RP skriva om sökvägen. Requests till `/sangbok` kommer _**inte**_ att fungera om . Detta innebär att RP:n måste omdirigera `/sangbok` till `/sangbok/` om den skriver om redirect-sökvägarna.

```conf
# Exempelkonfiguration för Apache
# Notera att vi nästan alltid vill ha / som suffix.
Redirect 307 /sangbok /sangbok/
<Location "/sangbok/">
    ProxyPass http://url-to-sangbok-container:container-port/
    ProxyPassReverse http://url-to-sangbok-container:container-port/
</Location>
```

Nginx-containrarna använder en relativt strikt Content-Security-Policy, så om du läser detta långt in i framtiden, kan det hända att Vue har uppdaterat den kod som laddar rätt skriptversion baserat på webbläsarens ålder. Det som måste göras då är att hashet i nginx.conf:s Content-Securit-Policy måste uppdateras, eller bytas ut mot `'unsafe-inline'`.

### Uppdatera bilden
Beroende på konfiguration vill du förmodligen köra något i stil med `docker run --detach --name sangbok --pull always ghcr.io/fysiksektionen/sangbok-html:latest` när du startar containern för första gången. För att ta bort containern kan du köra  `docker stop sangbok` följt av `docker rm sangbok`, och sedan kommandot ovan igen för att hämta en ny bild. Har du många gamla bilder som ligger och skräpar kan kommandot `docker image prune` användas.

### Bilden verkar inte ha byggts korrekt
Ibland när arbersflödet ska generera notfiler, kraschar det med en felkod i stil med `Cannot read file tmp/music_file.tmp.mscx: bad format`. Det är något oklart varför det händer, men det brukar lösa sig av att köra om arbetsflödet manuellt.