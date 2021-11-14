% Filename: blad.cls
% Author: Arno Lepisk (2003, v 1.0)
%         Oskar Rune (2021, v 1.1.3)
% 
% Version: 1.1.3. Backwards-compatible with v 1.0.

% This is a LaTeX2e document class.

\NeedsTeXFormat{LaTeX2e}

\ProvidesClass{blad}[2021/11/12 Sångbladsklass]

\DeclareOption*{\PassOptionsToClass{\CurrentOption}{article}}

\ProcessOptions

\LoadClass[a4paper]{article}

\RequirePackage[swedish]{babel}
\RequirePackage[utf8]{inputenc}
\RequirePackage[T1]{fontenc}

\RequirePackage{latexsym}
\RequirePackage{calc}
\RequirePackage{xspace}
\RequirePackage{ifthen}

\RequirePackage{verbatim}

\RequirePackage{amsmath,amsfonts,amssymb,graphicx}
\RequirePackage{svg}

%
% Layout
%

% LaTeX automatically adds 1in of offset margin. This resets that.
\setlength{\hoffset}{-1in}
\setlength{\voffset}{-1in}

% Misc. resets
\setlength{\headsep}{0in}
\setlength{\headheight}{0in}
\setlength{\lineskip}{0pt}
\setlength{\parindent}{0pt}
\setlength{\marginparwidth}{0pt}
\setlength{\marginparsep}{0pt}

% Even sides end up on the left, hence we want 6mm margin here.
% The right (even) side margin is computed from the edge of the left subpage, but since we have set
% hoffset to -1in, we need to undo this overlap by setting oddsidemargin to 1in.
% We don't add 6mm to oddsidemargin, since the position is computed relative to the left subpage,
% which is already offset by 6mm.
\setlength{\oddsidemargin}{1in} 
\setlength{\evensidemargin}{6mm}
\setlength{\topmargin}{5mm}

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
\newenvironment{sang}[1]{
 \nopagebreak
 \subsection*{#1}
 \begin{verse}
}{
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

%
% Special character handling 
%
\DeclareUnicodeCharacter{0394}{$\Delta$} % Δ
\DeclareUnicodeCharacter{03A9}{$\Omega$} % Ω
\DeclareUnicodeCharacter{03B2}{$\beta$} % β
\DeclareUnicodeCharacter{03B4}{$\delta$} % δ
\DeclareUnicodeCharacter{03B5}{$\varepsilon$} % ε
\DeclareUnicodeCharacter{03B6}{$\zeta$} % ζ
\DeclareUnicodeCharacter{03C0}{$\pi$} % π
\DeclareUnicodeCharacter{03C1}{$\rho$} % ρ
\DeclareUnicodeCharacter{03C3}{$\sigma$} % σ
\DeclareUnicodeCharacter{03C4}{$\tau$} % τ
\DeclareUnicodeCharacter{03C9}{$\omega$} % ω
\DeclareUnicodeCharacter{03D5}{$\varphi$} % ϕ
\DeclareUnicodeCharacter{2207}{$\nabla$} % ∇

\DeclareUnicodeCharacter{00B0}{$^\circ$} % °
\DeclareUnicodeCharacter{00B2}{$^2$} % ²
\DeclareUnicodeCharacter{00B3}{$^3$} % ³
\DeclareUnicodeCharacter{2082}{$_2$} % ₂
\DeclareUnicodeCharacter{2099}{$_n$} % ₙ

\DeclareUnicodeCharacter{1E8D}{$\ddot{x}$} % ẍ
\DeclareUnicodeCharacter{1E8B}{$\dot{x}$} % ẋ
\DeclareUnicodeCharacter{2205}{$\emptyset$} % ∅
\DeclareUnicodeCharacter{2229}{$\cap$} % ∩
\DeclareUnicodeCharacter{222A}{$\cup$} % ∪
\DeclareUnicodeCharacter{222B}{$\int$} % ∫
\DeclareUnicodeCharacter{22C5}{$\cdot$} % ⋅
\DeclareUnicodeCharacter{2227}{$\land$} % ∧
\DeclareUnicodeCharacter{27F8}{$\Leftarrow$} % ⟸
\DeclareUnicodeCharacter{2202}{$\partial$} % ∂
\DeclareUnicodeCharacter{2260}{$\neq$} % ≠
\DeclareUnicodeCharacter{2228}{$\lor$} % ∨