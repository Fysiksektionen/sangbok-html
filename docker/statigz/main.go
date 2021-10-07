package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"strings"
	"time"

	"sangbok-statigz/statigz"
)

const colorReset = "\033[0m"

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

	return fmt.Sprintf("%s%d%s", color, code, colorReset) // can also include http.StatusText(code)
}

func formatEncoding(encoding string, statusCode int) string {
	if encoding == "br" {
		return "\033[32mbr\033[0m"
	} else if encoding == "gzip" {
		return "\033[33mgz\033[0m"
	} else if encoding == "" && 300 <= statusCode && statusCode < 400 {
		return "\033[32mna\033[0m"
	} else if encoding == "" {
		return "\033[31mna\033[0m"
	} else {
		return "\033[31m?\033[0m"
	}
}

// Injects headers, handles logging and subdirectories.
func handle(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		stripPrefixes := []string{"/sangbok/", "/sangbok2/", "/sangbokgz/"}

		start := time.Now()
		lrw := NewLoggingResponseWriter(w)

		var h2 http.Handler
		for _, prefix := range stripPrefixes {
			if strings.HasPrefix(r.URL.Path, prefix) {
				h2 = http.StripPrefix(prefix, h)
			} else if strings.TrimSuffix(prefix, "/") == r.URL.Path {
				statigz.LocalRedirect(w, r, prefix)
				log.Default().Printf("%s - %s - %s - %s - %s %s", formatStatus(301), formatEncoding("", 301), time.Since(start), r.RemoteAddr, r.Method, r.RequestURI)
				return
			}
		}
		if h2 == nil {
			h2 = h
		}

		if strings.HasSuffix(r.URL.Path, ".js") || strings.HasSuffix(r.URL.Path, ".css") || strings.HasSuffix(r.URL.Path, ".min.svg") {
			// Add Cache header to files with the above prefixes.
			lrw.Header().Add("Cache-Control", "public, max-age=2592000")
		}

		// Other headers
		// w.Header().Add("Content-Security-Policy", "font-src https://fonts.gstatic.com; script-src self;")
		// lrw.Header().Add("Server", "statigz")

		// Let statigz do the rest.
		h2.ServeHTTP(lrw, r)

		// Log request information (to stdout). Use bash pipes to redirect it elsewhere.
		log.Default().Printf("%s - %s - %s - %s - %s %s", formatStatus(lrw.statusCode), formatEncoding(w.Header().Get("Content-Encoding"), lrw.statusCode), time.Since(start), r.RemoteAddr, r.Method, r.RequestURI)
	})
}

//
// Main code. See https://github.com/vearutop/statigz
//

//go:embed dist/*
var st embed.FS

func main() {
	log.Default().Print("Listening on port 80.")
	// statigz.SkipCompressionExt = []string{".gz", ".gif", ".jpg", ".png", ".webp"}
	// Retrieve sub directory.
	sub, err := fs.Sub(st, "dist")
	if err != nil {
		log.Fatal(err)
	}

	// Plug static assets handler to your server or router.
	server := statigz.FileServer(sub.(fs.ReadDirFS))
	err = http.ListenAndServe(":80", handle(server))
	if err != nil {
		log.Fatal(err)
	}
}
