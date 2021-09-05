
% Filename: blad.cls
% Author: Arno Lepisk (2003, v 1.0)
%         Oskar Rune (2021, v 1.1)
% 
% Version: 1.1

% This is a LaTeX2e document class.

\NeedsTeXFormat{LaTeX2e}

\ProvidesClass{blad}[2021/09/05 Sångbladsklass]

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

%
% Layout
%
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

%
% Booklet setup
%
\usepackage[print]{booklet}
\source{\magstep1}{\paperwidth}{\paperheight}
\target{\magstep1}{2\paperwidth}{\paperheight}

%
% Song template
%
\newenvironment{sang}[1]{\startasang{#1}}{\slutasang}

\newcommand{\startasang}[1]{
\nopagebreak
\subsection*{#1}
\begin{verse}
}

\newcommand{\slutasang}{
\end{verse}
\nopagebreak
}

% fkm* logo
\newcommand{\fkm}{\mbox{{\raisebox{-0.2ex}
    {\rotatebox{22}{\bf{f}}}\hspace{-0.16em}\raisebox{0.2ex}
    {\rotatebox{-15}{\bf{k}}}\hspace{-0.17em}\bf{m}\hspace{-0.15em}\raisebox{0.6ex}
    {\scalebox{0.6}{\bf{*}}}}}\xspace}

\pagenumbering{none}
\pagestyle{empty}
