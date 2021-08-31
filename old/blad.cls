% Filename: blad.cls
% Author: Arno Lepisk
% Version: 1

% This Is a LaTeX2e document class.


\NeedsTeXFormat{LaTeX2e}

\ProvidesClass{blad}[2003/01/24 Sangbladsklass]

\DeclareOption*{\PassOptionsToClass{\CurrentOption}{article}}

\ProcessOptions

\LoadClass[a4paper]{article}

\RequirePackage[swedish]{babel}     
\RequirePackage[utf8]{inputenc}

\RequirePackage{latexsym}
\RequirePackage{calc}
\RequirePackage{xspace}
\RequirePackage{ifthen}

\RequirePackage{verbatim}

\setlength{\hoffset}{-1in}
\setlength{\topmargin}{5mm}
\setlength{\headsep}{0in}
\setlength{\headheight}{0in}

\setlength{\oddsidemargin}{6mm}
\setlength{\evensidemargin}{6mm}

\setlength{\voffset}{-1in}
\setlength{\lineskip}{0pt}
\setlength{\parindent}{0pt}
\setlength{\marginparwidth}{0pt}
\setlength{\marginparsep}{0pt}

\setlength{\paperwidth}{.5\paperwidth}

\setlength{\textwidth}{.96\paperwidth}
\setlength{\textheight}{.95\paperheight}


\newenvironment{sang}[1]{\startasang{#1}}{\slutasang}

\newcommand{\startasang}[1]{%
%\makebox{%
\nopagebreak%
\subsection*{#1}%
\begin{verse}%
%\begin{verbatim}%
}

\newcommand{\slutasang}{%
%\end{verbatim}%
\end{verse}%
\nopagebreak%
}

\newcommand{\fkm}{\mbox{{\raisebox{-0.2ex}
    {\rotatebox{22}{\bf{f}}}\hspace{-0.16em}\raisebox{0.2ex}
    {\rotatebox{-15}{\bf{k}}}\hspace{-0.17em}\bf{m}\hspace{-0.15em}\raisebox{0.6ex}
    {\scalebox{0.6}{\bf{*}}}}}\xspace}

\pagenumbering{none}
\pagestyle{empty}
