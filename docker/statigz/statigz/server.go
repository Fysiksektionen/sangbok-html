// Package statigz serves pre-compressed embedded files with http.
// A modified version of https://github.com/vearutop/statigz, MIT license.
// This version expects br-precompression, and dynamically recompresses to gzip if only gzip is accepted (instead of pre-compressing to gzip).
package statigz

import (
	"bytes"
	"hash/fnv"
	"io"
	"io/fs"
	"mime"
	"net/http"
	"path"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

// Server is a http.Handler that directly serves compressed files from file system to capable agents.
//
// Please use FileServer to create an instance of Server.
//
// If agent does not accept encoding and uncompressed file is not available in file system,
// it would decompress the file before serving.
//
// Compressed files should have an additional extension to indicate their encoding,
// for example "style.css.gz" or "bundle.js.br".
//
// Caching is implemented with ETag and If-None-Match headers. Range requests are supported
// with help of http.ServeContent.
//
// Behavior is similar to http://nginx.org/en/docs/http/ngx_http_gzip_static_module.html and
// https://github.com/lpar/gzipped, except compressed data can be decompressed for an incapable agent.
type Server struct {
	// OnError controls error handling during Serve.
	OnError func(rw http.ResponseWriter, r *http.Request, err error)

	// Encodings contains supported encodings, default GzipEncoding.
	Encodings []Encoding

	info map[string]fileInfo
	fs   fs.ReadDirFS
}

// SkipCompressionExt lists file extensions of data that is not dynamically recompressed.
var SkipCompressionExt = []string{".gz", ".br", ".gif", ".jpg", ".png", ".webp", ".map"}

// FileServer creates an instance of Server from file system.
//
// Typically file system would be an embed.FS.
//
//   //go:embed *.png *.br
//	 var FS embed.FS
//
func FileServer(fs fs.ReadDirFS, options ...func(server *Server)) *Server {
	s := Server{
		fs:   fs,
		info: make(map[string]fileInfo),
		OnError: func(rw http.ResponseWriter, r *http.Request, err error) {
			http.Error(rw, "Internal Server Error", http.StatusInternalServerError)
		},
		Encodings: []Encoding{BrotliEncoding(), GzipEncoding()},
	}

	for _, o := range options {
		o(&s)
	}

	// Reading from "." is not expected to fail.
	if err := s.hashDir("."); err != nil {
		panic(err)
	}

	return &s
}

func (s *Server) hashDir(p string) error {
	files, err := s.fs.ReadDir(p)
	if err != nil {
		return err
	}

	for _, f := range files {
		fn := path.Join(p, f.Name())

		if f.IsDir() {
			s.info[path.Clean(fn)] = fileInfo{
				isDir: true,
			}

			if err = s.hashDir(fn); err != nil {
				return err
			}

			continue
		}

		h := fnv.New64()

		f, err := s.fs.Open(fn)
		if err != nil {
			return err
		}

		n, err := io.Copy(h, f)
		if err != nil {
			return err
		}

		s.info[path.Clean(fn)] = fileInfo{
			hash: strconv.FormatUint(h.Sum64(), 36),
			size: int(n),
		}
	}

	return nil
}

func (s *Server) reader(fn string, info fileInfo) (io.Reader, error) {
	if info.content != nil {
		return bytes.NewReader(info.content), nil
	}

	return s.fs.Open(fn)
}

func (s *Server) serve(rw http.ResponseWriter, req *http.Request, fn, suf, enc string, info fileInfo,
	decompress func(r io.Reader) (io.Reader, error)) {
	if m := req.Header.Get("If-None-Match"); m == info.hash {
		rw.WriteHeader(http.StatusNotModified)

		return
	}

	ctype := mime.TypeByExtension(filepath.Ext(fn))
	// Some variants of go doesn't recognize these types (alpine?)
	if ctype == "" && filepath.Ext(fn) == ".ico" {
		ctype = "image/x-icon"
	} else if ctype == "" && filepath.Ext(fn) == ".map" {
		ctype = "application/json"
	} else if ctype == "" {
		ctype = "application/octet-stream" // Prevent unreliable Content-Type detection on compressed data.
	}

	rw.Header().Set("Content-Type", ctype)
	rw.Header().Set("Etag", info.hash)

	if enc != "" {
		rw.Header().Set("Content-Encoding", enc)
	}

	if info.size > 0 {
		rw.Header().Set("Content-Length", strconv.Itoa(info.size))
	}

	if req.Method == http.MethodHead {
		return
	}

	r, err := s.reader(fn+suf, info)
	if err != nil {
		s.OnError(rw, req, err)

		return
	}

	if decompress != nil {
		r, err = decompress(r)
		if err != nil {
			rw.Header().Del("Etag")
			s.OnError(rw, req, err)

			return
		}
	}

	if rs, ok := r.(io.ReadSeeker); ok {
		http.ServeContent(rw, req, fn, time.Time{}, rs)

		return
	}

	_, err = io.Copy(rw, r)
	if err != nil {
		s.OnError(rw, req, err)

		return
	}
}

func (s *Server) minEnc(accessEncoding string, fn string) (fileInfo, Encoding) {
	var (
		minEnc  Encoding
		minInfo = fileInfo{size: -1}
	)

	for _, enc := range s.Encodings {
		if !strings.Contains(accessEncoding, enc.ContentEncoding) {
			continue
		}

		info, found := s.info[fn+enc.FileExt]
		if !found {
			continue
		}

		if minInfo.size == -1 || info.size < minInfo.size {
			minEnc = enc
			minInfo = info
		}
	}

	return minInfo, minEnc
}

// Re-encoding helpers
func (s *Server) getAcceptedEncoding(accessEncoding string) *Encoding {
	for _, enc := range s.Encodings {
		if !strings.Contains(accessEncoding, enc.ContentEncoding) {
			continue
		}
		return &enc
	}
	return nil
}

// Returns false if a filename as extensions in SkipCompressionExt.
func shouldRecompress(fn string) bool {
	for _, ext := range SkipCompressionExt {
		if strings.HasSuffix(fn, ext) {
			return false
		}
	}
	return true
}

// ServeHTTP serves static files.
//
// For compatibility with std http.FileServer:
// if request path ends with /index.html, it is redirected to base directory;
// if request path points to a directory without trailing "/", it is redirected to a path with trailing "/".
func (s *Server) ServeHTTP(rw http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet && req.Method != http.MethodHead {
		rw.Header().Set("Allow", http.MethodGet+", "+http.MethodHead)
		http.Error(rw, "Method Not Allowed\n\nmethod should be GET or HEAD", http.StatusMethodNotAllowed)

		return
	}

	if strings.HasSuffix(req.URL.Path, "/index.html") {
		LocalRedirect(rw, req, "./")

		return
	}

	fn := strings.TrimPrefix(req.URL.Path, "/")
	ae := strings.ToLower(req.Header.Get("Accept-Encoding"))

	if s.info[fn].isDir {
		LocalRedirect(rw, req, path.Base(req.URL.Path)+"/")

		return
	}

	if fn == "" || strings.HasSuffix(fn, "/") {
		fn += "index.html"
	}

	// Always add Accept-Encoding to Vary to prevent intermediate caches corruption.
	rw.Header().Add("Vary", "Accept-Encoding")

	if ae != "" {
		minInfo, minEnc := s.minEnc(ae, fn)

		if minInfo.hash != "" {
			// Copy compressed data into response.
			s.serve(rw, req, fn, minEnc.FileExt, minEnc.ContentEncoding, minInfo, nil)

			return
		}
	}

	// Copy uncompressed data into response.
	uncompressedInfo, uncompressedFound := s.info[fn]
	if uncompressedFound {
		s.serve(rw, req, fn, "", "", uncompressedInfo, nil)

		return
	}

	// Decompress compressed data into response.
	for _, enc := range s.Encodings {
		info, found := s.info[fn+enc.FileExt]
		if !found || enc.Decoder == nil || info.isDir {
			continue
		}

		info.hash += "U"
		info.size = 0
		tgtEnc := s.getAcceptedEncoding(ae) // We assume that this will never be the same as enc, since that would (hopefully have returned)
		if tgtEnc != nil && &tgtEnc.ContentEncoding != &enc.ContentEncoding && shouldRecompress(fn) {
			// Attempt re-encoding (usually brotli -> gzip)
			s.serve(rw, req, fn, enc.FileExt, tgtEnc.ContentEncoding, info, func(r io.Reader) (io.Reader, error) {
				uncompressed, err := enc.Decoder(r)
				if err != nil {
					return nil, err
				}
				b, err := tgtEnc.Encoder(uncompressed)
				return bytes.NewReader(b), err
			})
			return
		} else { // Return decompressed
			s.serve(rw, req, fn, enc.FileExt, "", info, enc.Decoder)
			return
		}
	}

	http.NotFound(rw, req)
}

type fileInfo struct {
	hash    string
	size    int
	content []byte
	isDir   bool
}

// OnError is an option to customize error handling in Server.
func OnError(onErr func(rw http.ResponseWriter, r *http.Request, err error)) func(server *Server) {
	return func(server *Server) {
		server.OnError = onErr
	}
}

// LocalRedirect gives a Moved Permanently response.
// It does not convert relative paths to absolute paths like Redirect does.
//
// Copied go1.17/src/net/http/fs.go:685.
func LocalRedirect(w http.ResponseWriter, r *http.Request, newPath string) {
	if q := r.URL.RawQuery; q != "" {
		newPath += "?" + q
	}

	w.Header().Set("Location", newPath)
	w.WriteHeader(http.StatusMovedPermanently)
}
