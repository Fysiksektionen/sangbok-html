#!/usr/bin/python
# -*- coding: utf8 -*-

import base64, glob, os.path, os, sys

def temp_filename(name):
    filename = name + ".txt"
    counter = 0
    while os.path.isfile(filename):
        counter += 1
        filename = name + str(counter) + ".txt"
    return filename

def signature(page_count):
    page_count_rounded = page_count
    while page_count_rounded % 4 != 0:
        page_count_rounded += 1
    
    res = []
    for block in range(page_count_rounded // 4):
        res.append(page_count_rounded - (2 * block))
        res.append(1 + (2 * block))
        res.append(2 + (2 * block))
        res.append(page_count_rounded - 1 - (2 * block))
    return "{" + ",".join(map(lambda x: str(x) if x <= page_count else r"{}", res)) + "}"


if __name__ == "__main__":
    total_pages_file = temp_filename("total_pages")
    blad_cls = r"""
<blad.cls>
"""

    logga_pdf = rb"<logga.64>"
    
    sangblad_tex = r"""
<sångblad.tex>
"""
    
    end_index = sangblad_tex.rindex(r"\end{document}")
    sangblad_tex = sangblad_tex[:end_index] + r"""
\AtEndDocument{%
\newwrite\tempfile
\immediate\openout\tempfile=""" + total_pages_file + r"""
\immediate\write\tempfile{\number\thepage}
\immediate\closeout\tempfile
}
""" + sangblad_tex[end_index:]

    skrev_blad_cls = False
    if os.path.isfile("blad.cls"):
        print ('"blad.cls" fanns redan')
    else:
        with open("blad.cls", "w") as f:
            f.write(blad_cls)
        skrev_blad_cls = True
        print ('Packade upp "blad.cls"')
    
    skrev_logga_pdf = False
    if len(logga_pdf) == 0: # ingen logga på förstasidan
        pass
    else:
        loggor = glob.glob("logga.*")
        if len(loggor) != 0: # det fanns redan loggor i mappen
            print ('Hittade ' + ('loggor: ' if len(loggor) != 1 else 'logga: ') + ', '.join(map(lambda s: '"' + s + '"', loggor)))
        else:
            with open("logga.pdf", "wb") as f:
                f.write(base64.b64decode(logga_pdf))
            skrev_logga_pdf = True
            print ('Packade upp "logga.pdf"')
    
    if "skrivöver" in sys.argv:
        if os.path.isfile("sångblad.tex"):
            with open("sångblad.tex", "w", encoding = "utf8") as f:
                f.write(sangblad_tex)
            print ('Skrev över "sångblad.tex"')
        else:
            with open("sångblad.tex", "w", encoding = "utf8") as f:
                f.write(sangblad_tex)
            print ('Packade upp "sångblad.tex" (fanns ingen att skriva över)')
    else:
        if os.path.isfile("sångblad.tex"):
            print ('Skriver inte över med ny version av "sångblad.tex"')
            # Här återanvänder vi en äldre version av sångblad.tex, så vi behöver hitta total_pages-filen, om den finns
            with open("sångblad.tex", "r", encoding = "utf8") as f:
                for line in f:
                    if r"\immediate\openout\tempfile=" in line:
                        total_pages_file = line[line.index("=") + 1:].rstrip()
                        break
        else:
            with open("sångblad.tex", "w", encoding = "utf8") as f:
                f.write(sangblad_tex)
            print ('Packade upp "sångblad.tex"')

    print ('Kompilerar LaTeXen med pdflatex')
    os.system("pdflatex sångblad.tex")

    if not os.path.isfile("sångblad.pdf"):
        print ('Nånting gick fel - hittade inte filen "sångblad.pdf" som ska innehålla ett halvfärdigt sångblad')
        print ('Detta beror nog på att vi inte lyckades kompilera "sångblad.tex" ordentligt')
        print ('Du kan prova att redigera "sångblad.tex" och fixa felet,')
        print ('och sedan köra om skriptet')
        quit()

    if not os.path.isfile(total_pages_file):
        print ('Nånting gick fel - hittade inte filen "' + total_pages_file + '", som ska innehålla antalet sidor i sångbladet')
        print ('Detta beror nog på att vi inte lyckades kompilera "sångblad.tex" ordentligt')
        print ('Du kan prova att redigera "sångblad.tex" och fixa felet,')
        print ('och sedan köra om skriptet')
        quit()

    pages = 0
    with open(total_pages_file, "r") as f:
        pages = int(f.readline())
    print (str(pages) + (" sida" if pages == 1 else " sidor") + " i sångbladet")
    
    sangblad_utskrivbar_tex = r"""
\documentclass{article}
\usepackage{pdfpages}
\usepackage[T1]{fontenc}
\begin{document}
  \includepdf[pages=""" + signature(pages) + r""",nup=2x1]{sångblad}
\end{document}
"""

    with open("sångblad_utskrivbar.tex", "w", encoding = "utf8") as f:
        f.write(sangblad_utskrivbar_tex)
    print ('Packade upp "sångblad_utskrivbar.tex"')
    print ('Kompilerar LaTeXen med pdflatex')
    os.system("pdflatex sångblad_utskrivbar.tex")

    if not os.path.isfile("sångblad_utskrivbar.pdf"):
        print ('Nånting gick fel - hittade inte filen "sångblad_utskrivbar.pdf" som ska innehålla det färdiga sångbladet')
        print ('Detta beror nog på att vi inte lyckades kompilera "sångblad_utskrivbar.tex" ordentligt')
        quit()

    if skrev_blad_cls and "spara" not in sys.argv:
        print ('Försöker rensa bort "blad.cls"')
        try:
            os.remove("blad.cls")
        except:
            pass

    if skrev_logga_pdf and "spara" not in sys.argv:
        print ('Försöker rensa bort "logga.pdf"')
        try:
            os.remove("logga.pdf")
        except:
            pass
    
    if "spara_allt" not in sys.argv:
        for tempfile in [total_pages_file, "sångblad.aux", "sångblad.log", "sångblad.pdf", "sångblad_utskrivbar.aux", "sångblad_utskrivbar.log", "sångblad_utskrivbar.tex"]:
            print ('Försöker rensa bort "' + tempfile + '"')
            try:
                os.remove(tempfile)
            except:
                pass
    
    print ('')
    print ('Klar! Ditt sångblad finns i filen "sångblad_utskrivbar.pdf"')