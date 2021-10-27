# Deployment

## Körning utan docker
Självfallet kan programmet servas statiskt genom att köra `npm run build`, och kopiera över filerna från dist-mappen till lämplig plats på servern. I mappen du nu betraktar finns även en  `.htaccess`-fil som kan läggas tillsammans med de byggda filerna för att hantera caching. Du som gör detta är nog dock mer bevandrad i Apache än jag, så den kanske inte är så användbar.

Alternativt kan du som läser detta gå till den senaste [build-körningen](https://github.com/Fysiksektionen/sangbok-html/actions/workflows/build-vue.yml), skrolla ner till artifacts, och klicka på `dist-node-16.x` för att ladda ner en zip-fil med statiskt innehåll.

## Docker
Denna mapp innehåller filer som används för att generera docker-containrar. Docker-containrar kan ses som en slags lätt virtual machine, dvs. en isolerad miljö där serven körs.

Generellt sett är processen följande:
* Alla byggprocesser antar att rätt notfiler finns i `/public`-mappen.
* Vue-källkoden kopieras in i en container, och programmet byggs.
* Den byggda appen förkomprimeras till lämpliga format (gzip och/eller brotli)
* Filerna från den byggda appen kopieras till en container med en webbserver (nginx eller statigz)

Jag har valt nginx, då den tar väldigt lite plats, samtidigt som den är mer än kompetent nog att serva statiska filer. statigz är en nödlösning, då [den modul](https://github.com/splitice/ngx_brunzip_module) som nginx använder för att dekomprimera brotli-filer är svår att få att fungera ordentligt.

### Taggar
Containrarna är taggade efter vilken branch de kommer från, dvs.
* `latest` - från `main`
* `edge` - från `dev`
Dessa containrar är [nginx](https://www.nginx.com)-baserade, och innehåller förkomprimerade filer i både brotli- och gzip-format. Brotli-filerna är ca. 30% mindre än motsvarande gzip-filer.

Utöver detta finns några suffix om användaren mot förmodan skulle vilja ha en mindre container på bekostnad av prestandan.
* `slim-nginx` - [nginx](https://www.nginx.com)-baserad. Innehåller endast förkomprimerade filer i gzip-format.
* `slim` - [statigz](https://pkg.go.dev/github.com/vearutop/statigz)-baserad. Innehåller endast förkomprimerade filer i brotli-format. 

De [nginx](https://www.nginx.com)-baserade presterar generellt sett bättre, och kräver mindre RAM. De klarar sig bra på 8mb RAM, men kan dra nytta av upp till ca. 20mb. `slim`-containrarna är optimerade för att serva brotli-komprimerade filer. Det finns egentligen ingen anledning att använda `slim`-containrarna framför den vanliga om en inte har platsbrist på servern. Statigz-containern kräver 16mb ram, och trivs bäst med ca. 48mb.

### Varför fungerar inte bilderna?
Se till att du proxyar trafiken till port 80 på containern. Containrarna är tänkta att användas bakom en reverse proxy (dvs. t.ex. [traefik](https://traefik.io/traefik/) eller någon webbserver, t.ex. [Apache](httpd.apache.org)), och accepterar requests till `/`, `/sangbok` och `/sangbok2`. Vill du ha den på någon annan path, får du antingen modifiera dockerfilerna, eller låta din reverse-proxy skriva om sökvägen.

Nginx-containrarna använder en relativt strikt Content-Security-Policy, så om du läser detta långt in i framtiden, kan det hända att Vue/Webpack har uppdaterat den kod som laddar rätt skriptversion baserat på webbläsarens ålder. Det som måste göras då är att hashet i nginx.conf:s Content-Securit-Policy måste uppdateras, eller bytas ut mot `'unsafe-inline'`.