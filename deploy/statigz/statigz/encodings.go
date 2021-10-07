package statigz

import (
	"bytes"
	"compress/gzip"
	"io"

	"github.com/andybalholm/brotli"
)

// Encoding describes content encoding.
type Encoding struct {
	// FileExt is an extension of file with compressed content, for example ".gz".
	FileExt string

	// ContentEncoding is encoding name that is used in Accept-Encoding and Content-Encoding
	// headers, for example "gzip".
	ContentEncoding string

	// Decoder is a function that can decode data for an agent that does not accept encoding,
	// can be nil to disable dynamic decompression.
	Decoder func(r io.Reader) (io.Reader, error)

	// Encoder is a function that can encode data
	Encoder func(r io.Reader) ([]byte, error)
}

func GzipEncoding() Encoding {
	return Encoding{
		FileExt:         ".gz",
		ContentEncoding: "gzip",
		Decoder: func(r io.Reader) (io.Reader, error) {
			return gzip.NewReader(r)
		},
		Encoder: func(r io.Reader) ([]byte, error) {
			res := bytes.NewBuffer(nil)
			w := gzip.NewWriter(res)

			if _, err := io.Copy(w, r); err != nil {
				return nil, err
			}

			if err := w.Close(); err != nil {
				return nil, err
			}

			return res.Bytes(), nil
		},
	}
}

func BrotliEncoding() Encoding {
	return Encoding{
		FileExt:         ".br",
		ContentEncoding: "br",
		Decoder: func(r io.Reader) (io.Reader, error) {
			return brotli.NewReader(r), nil
		},
		Encoder: func(r io.Reader) ([]byte, error) {
			res := bytes.NewBuffer(nil)
			w := brotli.NewWriterLevel(res, 8)

			if _, err := io.Copy(w, r); err != nil {
				return nil, err
			}

			if err := w.Close(); err != nil {
				return nil, err
			}

			return res.Bytes(), nil
		},
	}
}
