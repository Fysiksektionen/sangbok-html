// File for generating LaTeX.

package generator

import (
	"encoding/base64"
	"encoding/json"
	"f-sangbok-backend/lyrics"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func GenerateTeX() string {
	return ""
}

func GeneratorHandler(c *gin.Context) {
	originalStringBytes, err := base64.StdEncoding.DecodeString(c.Param("b64"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Unable to decode base64 parameter."})
		return
	}

	var indices [][]int
	err = json.Unmarshal(originalStringBytes, &indices)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Unable parse incides."})
		return
	}

	var songs []lyrics.Song

	for _, idx := range indices {
		songs = append(songs, lyrics.GetLyricsByIndex(idx[0], idx[1]))
	}

	c.String(http.StatusOK, getContent(songs, getContentProps{c.DefaultQuery("title", "Sångblad"), true, true, true, true, false}))
}

func escapeAll(s string) string {
	var latexEscapes = [][2]string{{"\"", "''"},
		{"Ω", "\\(\\Omega\\)"},
		{"ω", "\\(\\omega\\)"},
		{"τ", "\\(\\tau\\)"},
		{"π", "\\(\\pi\\)"},
		{"ζ", "\\(\\zeta\\)"},
		{"σ", "\\(\\sigma\\)"},
		{"δ", "\\(\\delta\\)"},
		{"ε", "\\(\\varepsilon\\)"},
		{"β", "\\(\\beta\\)"},
		{"β", "\\(\\beta\\)"},
		{"ϱ", "\\(\\rho\\)"},
		{"°", "\\(^\\circ\\)"},
		{"²", "\\(^2\\)"},
		{"³", "\\(^3\\)"},
		{"₂", "\\(_2\\)"},
	}

	for _, escape := range latexEscapes {
		s = strings.Replace(s, escape[0], escape[1], -1)
	}
	return s
}

type getContentProps struct {
	title                string
	showLogo             bool
	showDate             bool
	showMelody           bool
	showAuthor           bool
	showSheetMusicNotice bool
}

// TODO: Replace c with an options object.
func getContent(songs []lyrics.Song, props getContentProps) string {
	//
	// Header etc.
	//
	content := []string{
		"\\documentclass[a4paper, twoside, titlepage]{blad}\n\\usepackage{amsmath,amsfonts,amssymb,graphicx}\n%amsmath används ganska ofta graphicx är till för att använda grafik\n\n\\usepackage{verbatim}\n\\usepackage[T1]{fontenc}\n%\\usepackage{moreverb}\n%\\usepackage{xspace}\n%\\usepackage{float}\n\n%\\setlength{\\parindent}{0pt}     % tar bort indrag från stycken. Avslaget\n%\\setlength{\\parskip}{3pt}       % Ändra så att stycken skiljs av\n                                 % blankrader. Avslaget\n%\\addtolength{\\topmargin}{-0.8cm} %Minskar marginalerna litegrann\n%\\addtolength{\\textheight}{0.8cm}\n\n% Titel, författare etc.\n\\title{",
		props.title,
		"}\n",
	}

	if props.showLogo {
		content = append(content, "\\author{\\includegraphics[width=.8\\textwidth]{logga}}\n")
	}

	if props.showDate {
		content = append(content, "%")
	}

	content = append(content,
		"\\date{}                          %Ta bort kommentaren om du inte vill ha med datum.\n\n\\begin{document}\n",
		"\\pagenumbering{arabic}\n\\maketitle\n",
	)

	//
	// Main song adder loop
	//
	for _, song := range songs {
		content = append(content,
			"\\begin{sang}{",
			escapeAll(song.Title),
			"}\n",
		)

		if props.showMelody && song.Melody != nil {
			lines := strings.Split(*song.Melody, "\n")
			var filteredLines []string
			for _, line := range lines {
				if props.showSheetMusicNotice || !strings.Contains(line, "notkapitlet") {
					filteredLines = append(filteredLines, line)
				}
			}

			melodyContent := strings.Join(filteredLines, "\\hfil\\\\*\n\\hfil ")

			if melodyContent != "" {
				content = append(content,
					"\\hfil\\textit{",
					escapeAll(melodyContent),
					"}\\hfil\\\\*\n",
					"\\vspace*{0.1cm}\n",
				)
			}
		}

		// settingsSwitch()

		content = append(content, "\n")

		if props.showAuthor && song.Author != nil && *song.Author != "" {
			content = append(content,
				"\\\\* \\vspace*{0.1cm}\n",
				"\\raggedleft\\textit{",
				*song.Author,
				// escapeAll(songs[i].Author.replace("\n", "\\\\* ")),
				"}\n",
			)
		}

		content = append(content, "\\end{sang}\n")
	}

	content = append(content, "\n\\end{document}")

	return strings.Join(content, "")
}

// var addDefaultText = function (text) {
// 	content.push(escapeAll(text
// 		.replace(/\n\n\n/g, "\\\\ \\vspace*{0.5cm}")
// 		.replace(/\n\n/g, "\\\\ ")
// 		.replace(/\n/g, "\\\\*\n")
// 		.replace(/\\\\ /g, "\n\n")
// 		.replace(/\\vspace\*{0\.5cm}/g, "\\vspace*{0.5cm}\n")
// 	));
// };

func settingsSwitch() {
	// var settingsIndex = 0;
	// switch (d.findIndex(function (entry, currentIndex) {
	// 	return currentIndex >= 2 && entry.indexes.some(function (index) {
	// 		return index[0] == item[1] && index[1] == item[2];
	// 	});
	// })) {
	// 	case 2: //Årskursernas
	// 		var description = songs[i].text.split("\n").filter(function (line) {
	// 			return /^(?!\d\d)/.test(line);
	// 		});
	// 		var years = songs[i].text.split("\n").filter(function (line) {
	// 			return /^\d\d/.test(line);
	// 		});

	// 		addDefaultText(description.join("\n") + "\n");
	// 		var yearsContent = [];

	// 		var year = 1900;
	// 		var yearIndex = 0;
	// 		while (year < d[2].settings[0].value && ++yearIndex < years.length) {
	// 			var digits = years[yearIndex].slice(0, 2) * 1;
	// 			if (digits == 0)
	// 				year = Math.ceil(year / 100) * 100;
	// 			else
	// 				year = Math.floor(year / 100) * 100 + digits;
	// 		}
	// 		for (var j = yearIndex; j < years.length; j++)
	// 			yearsContent.unshift(years[j] + "\\\\\n");

	// 		if (d[2].settings[3].value)
	// 			yearsContent = yearsContent.reverse();

	// 		if (d[2].settings[1].value)
	// 			yearsContent.push("Gästerna\\\\\n");
	// 		if (d[2].settings[2].value)
	// 			yearsContent.push("Köket\\\\\n");

	// 		content = content.concat(yearsContent);

	// 		break;

	// 	case 3: //Regelbunden text
	// 		if (d[3].settings[0].value) {
	// 			content.push("\\begin{tabular}{llllll}\n")
	// 			content.push(escapeAll(songs[i].text
	// 				.split(/\n/g)
	// 				.map(function (s) { return s.trim().replace(/\s+/g, " & "); })
	// 				.join("\\\\*\n")
	// 			));
	// 			content.push("\n\\end{tabular}");
	// 		} else
	// 			addDefaultText(songs[i].text
	// 				.replace(/\n/g, "\\\\")
	// 				.replace(/\s+/g, " ")
	// 				.replace(/\\\\/g, "\n")
	// 			);
	// 		break;

	// 	case 4: //Monospace
	// 		if (d[4].settings[0].value)
	// 			content.push("\\texttt{");

	// 		addDefaultText(songs[i].text);

	// 		if (d[4].settings[0].value)
	// 			content.push("}");
	// 		break;

	// 	//Trunkeras
	// 	case 5:
	// 		if (settingsIndex == 0)
	// 			settingsIndex = 5;
	// 	case 6:
	// 		if (settingsIndex == 0)
	// 			settingsIndex = 6;
	// 	case 7:
	// 		if (settingsIndex == 0)
	// 			settingsIndex = 7;

	// 		addDefaultText(songs[i].text
	// 			.split("\n\n")
	// 			.slice(0, (d[settingsIndex].settings[0].value || d[settingsIndex].settings[0].max) * (settingsIndex == 5 ? 2 : 1))
	// 			.join("\n\n")
	// 		);
	// 		settingsIndex = 0;
	// 		break;

	// 	case 8: //Gamla klang
	// 		if (d[8].settings[0].value)
	// 		{
	// 			if (d[8].settings[1].value)
	// 				addDefaultText(songs[i].text.replace(/KÄRNAN/g, "\\textbf{KÄRNAN}"));
	// 			else
	// 				addDefaultText(songs[i].text
	// 					.replace(/KÄRNAN/g, "\\textbf{KÄRNAN}")
	// 					.split(/\n\n\n/g)[0]
	// 				);
	// 		}
	// 		else
	// 		{
	// 			if (d[8].settings[1].value)
	// 				addDefaultText(songs[i].text);
	// 			else
	// 				addDefaultText(songs[i].text.split(/\n\n\n/g)[0]);
	// 		}
	// 		break;

	// 	//Med info i slutet
	// 	case 9:
	// 		if (settingsIndex == 0)
	// 			settingsIndex = 9;

	// 	case 10:
	// 		if (settingsIndex == 0)
	// 			settingsIndex = 10;

	// 	case 11:
	// 		if (settingsIndex == 0)
	// 			settingsIndex = 11;

	// 	case 12:
	// 		if (settingsIndex == 0)
	// 			settingsIndex = 12;

	// 	case 13:
	// 		if (settingsIndex == 0)
	// 			settingsIndex = 13;

	// 		if (!d[settingsIndex].settings[0].value)
	// 			addDefaultText(songs[i].text.split(/\n\n\n/g)[0]);
	// 		else
	// 			addDefaultText(songs[i].text);
	// 		settingsIndex = 0;
	// 		break;

	// 	case 14: //Hyllningsvisa
	// 		if (!d[14].settings[0].value) {
	// 			addDefaultText(songs[i].text.split(/\n\n\n/g)[0]);
	// 			addDefaultText("\n\nDessa tekniska lik!!! Barampam!");
	// 		}
	// 		else
	// 			addDefaultText(songs[i].text.replace(/</g, "\\textit{").replace(/>/g, "}"));
	// 		break;

	// 	case 15: //ODE till en husvagn
	// 		if (d[15].settings[0].value) {
	// 			var verses = songs[i].text.split(/\n\n/g);
	// 			verses[4] = "\\begin{flalign*}m\\ddot{x}+c\\dot{x}+kx&=mg\n\\dot{x}&=A\\omega_n\\cos{\\omega_n t}\n\\tau&=\\frac{2\\pi}{\\omega_n}\n\\omega_n&=\\sqrt{\\frac{k}{m}}\\end{flalign*}";
	// 			addDefaultText(verses.join("\n\n"));
	// 		}
	// 		else
	// 			addDefaultText(songs[i].text);
	// 		break;

	// 	default:
	// 		if (item[1] == 8 && item[2] == 14) //Aris summavisa
	// 			addDefaultText(songs[i].text
	// 				.replace("trollat bort n", "trollat bort \\(n\\)")
	// 				.replace("Maclaurin av ln", "Maclaurin av \\(\\ln\\)")
	// 			);
	// 		else if (item[1] == 8 && item[2] == 16) //Liten visa om Gram-Schmidts metod
	// 			addDefaultText(songs[i].text
	// 				.replace(/M/g, "\\(M\\)")
	// 				.replace("vektor a", "vektor \\(\\boldsymbol{a}\\)")
	// 			);
	// 		else if (item[1] == 9 && item[2] == 15) //Stad i ljus
	// 			addDefaultText(songs[i].text.split(/\n\n\n/g)[0]);
	// 		else
	// 			addDefaultText(songs[i].text);
	// 		break;
	// }
}

func signature(page_count int) string {
	page_count_rounded := page_count
	for page_count_rounded%4 != 0 {
		page_count_rounded += 1
	}

	var res []int

	for block := 0; block < page_count_rounded/4; block++ { // Should be integer division
		res = append(res,
			page_count_rounded-(2*block),
			1+(2*block),
			2+(2*block),
			page_count_rounded-1-(2*block),
		)
	}

	var strs []string
	for _, x := range res {
		if x <= page_count {
			strs = append(strs, fmt.Sprint(x))
		} else {
			strs = append(strs, "{}")
		}
	}

	return "{" + strings.Join(strs, ",") + "}"
}
