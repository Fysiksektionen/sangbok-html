package main

import (
	"f-sangbok-backend/generator"
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
	r.GET("/generate/:b64", generator.GeneratorHandler)

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
