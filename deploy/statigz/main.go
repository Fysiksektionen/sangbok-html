package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"strings"

	"github.com/vearutop/statigz"
	"github.com/vearutop/statigz/brotli"
)

// Declare your embedded assets.

// See https://ndersson.me/post/capturing_status_code_in_net_http/
type loggingResponseWriter struct {
	http.ResponseWriter
	statusCode int
}

func NewLoggingResponseWriter(w http.ResponseWriter) *loggingResponseWriter {
	return &loggingResponseWriter{w, http.StatusOK}
}

func (lrw *loggingResponseWriter) WriteHeader(code int) {
	lrw.statusCode = code
	lrw.ResponseWriter.WriteHeader(code)
}

// Formating nicities
func formatStatus(code int) string {
	var color string
	if 100 <= code && code < 400 {
		color = "\033[32m" // Green
	} else if code > 400 {
		color = "\033[31m" // Red
	}

	return fmt.Sprintf("%s%d\033[0m", color, code) // can also include http.StatusText(code)
}

// Injects headers, and handles logging
func handle(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		lrw := NewLoggingResponseWriter(w)

		if strings.HasSuffix(r.URL.Path, ".js") || strings.HasSuffix(r.URL.Path, ".css") || strings.HasSuffix(r.URL.Path, ".min.svg") {
			// Add Cache header to files with the above prefixes.
			lrw.Header().Add("Cache-Control", "public, max-age=2592000")
		}
		// Other headers
		// w.Header().Add("Content-Security-Policy", "font-src https://fonts.gstatic.com; script-src self;")

		// Let statigz do the rest.
		lrw.Header().Add("Server", "statigz")
		h.ServeHTTP(lrw, r)

		// Log request information (to stdout). Use bash pipes to redirect it elsewhere.
		log.Default().Printf("%s - %s - %s %s", formatStatus(lrw.statusCode), r.RemoteAddr, r.Method, r.RequestURI)
	})
}

//
// Main code. See https://github.com/vearutop/statigz
//

//go:embed dist/*
var st embed.FS

func main() {
	log.Default().Print("Listening on port 80.")
	// Retrieve sub directory.
	sub, err := fs.Sub(st, "dist")
	if err != nil {
		log.Fatal(err)
	}

	// Plug static assets handler to your server or router.
	err = http.ListenAndServe(":80", handle(statigz.FileServer(sub.(fs.ReadDirFS), brotli.AddEncoding)))
	if err != nil {
		log.Fatal(err)
	}
}
