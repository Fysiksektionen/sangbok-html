package main

import (
	"f-sangbok-backend/generator"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Static files.
	r.Static("/js", "../dist/js")
	r.Static("/css", "../dist/css")
	r.Static("/tex", "../dist/tex")
	r.StaticFile("/", "../dist/index.html")
	r.StaticFile("/favicon.ico", "../dist/favicon.ico")

	// API for generating latex
	r.GET("/generate/:b64", generator.GeneratorHandler)

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
