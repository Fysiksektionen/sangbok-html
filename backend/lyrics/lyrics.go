package lyrics

import (
	"encoding/json"
	"fmt"
	"io/ioutil"

	"github.com/gin-gonic/gin"
)

/*
 * Type declarations
 */

type Song struct {
	Title  string  `json:"title"`
	Author *string `json:"author"`
	Melody *string `json:"melody"`
	Text   string  `json:"text"`
}

type Chapter struct {
	Chapter string `json:"chapter"`
	Prefix  string `json:"prefix"`
	Songs   []Song `json:"songs"`
}

type LyricsDatabase struct {
	Chapters []Chapter  `json:"chapters"`
	Indexes  [][]string `json:"indexes"`
}

// Global cache of lyrics
var db = loadLyrics()

func GetLyrics() LyricsDatabase {
	return db
}

func GetLyricsByIndex(chapter int, song int) Song {
	return db.Chapters[chapter].Songs[song]
}

/*
 * Internal helpers
 */

func loadLyrics() LyricsDatabase {
	var lyricsLocation string

	if gin.Mode() == "debug" {
		lyricsLocation = "../src/assets/lyrics.json"
	} else {
		lyricsLocation = "/app/lyrics.json"
	}

	data, err := ioutil.ReadFile(lyricsLocation)
	if err != nil {
		fmt.Print(err)
	}

	var db LyricsDatabase
	err = json.Unmarshal(data, &db)
	if err != nil {
		fmt.Println("error:", err)
	}

	return db
}
