package main

import (
	"f-sangbok-backend/generator"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	prefix := os.Getenv("PREFIX")

	// Static files.
	r.Static(prefix+"/js", "../dist/js")
	r.Static(prefix+"/css", "../dist/css")
	r.Static(prefix+"/tex", "../dist/tex")
	r.StaticFile(prefix+"/", "../dist/index.html")
	r.StaticFile(prefix+"/favicon.ico", "../dist/favicon.ico")

	// API for generating latex
	r.GET(prefix+"/generate/:b64", generator.GeneratorHandler)
	r.GET(prefix+"/overleaf/:b64", func(c *gin.Context) { // Handler for redirecting to Overleaf.
		// TODO: Parse host and slashes more rigorously (to avoid double slashes, etc.)
		baseurl := "https://" + c.Request.Host + "/" + prefix + "/"

		c.Redirect(http.StatusTemporaryRedirect,
			"https://www.overleaf.com/docs?"+
				"snip_uri[]="+baseurl+"tex/blad.cls&snip_name[]=blad.cls"+
				"&snip_uri[]="+baseurl+"tex/logga.pdf&snip_name[]=logga.pdf"+
				"&snip_uri[]="+baseurl+"generate/"+c.Param("b64")+"&snip_name[]=main.tex",
		)
	})

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
