% Filename: blad.cls
% Author: Arno Lepisk (v1.0, 2003)
%         Oskar Rune (v1.2.0, 2021 & v1.2.1, 2023)
% 
% Version: 1.2.1. Not backwards-compatible with versions 1.0-1.1.x.
%   Compatible with 1.2.0 when song indices are disabled. (I.e. use \newcommand{\songindex}[1]{})

% This is a LaTeX2e document class.

\NeedsTeXFormat{LaTeX2e}

\ProvidesClass{blad}[2021/11/12 Sångbladsklass]

\DeclareOption*{\PassOptionsToClass{\CurrentOption}{article}}

\ProcessOptions

\LoadClass[a4paper]{article}

%
% Packages
%
\RequirePackage[swedish]{babel}
\RequirePackage[utf8]{inputenc}
\RequirePackage[T1]{fontenc}

\RequirePackage{latexsym}
\RequirePackage{calc}
\RequirePackage{xspace}
\RequirePackage{ifthen}
\RequirePackage{quoting}
\RequirePackage{verbatim}
\RequirePackage{comment}

\RequirePackage{amsmath,amsfonts,amssymb,bm}
\RequirePackage{graphicx,svg}
\RequirePackage{fancyhdr}


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
\setlength{\textheight}{.95\paperheight-10mm} % One may want to remove the "-10mm" when not using page-numbering

%
% Booklet setup
%
\RequirePackage[print]{booklet}
\source{\magstep1}{\paperwidth}{\paperheight}
\target{\magstep1}{2\paperwidth}{\paperheight}

%
% Page numbering
%
\pagestyle{fancy} % May be set to "empty" if not using numbering
\pagenumbering{arabic} % May be set to "none" if not using numbering
\renewcommand{\headrulewidth}{0pt} % Removes the horizontal line from the header
\fancyhead{} % Clear default header
\fancyfoot[C]{\thepage} % Set footer (C = center) to display page numbers

\pagestyle{empty}

%
% Song template
%
\newcommand{\songindex}[1]{#1. } % Extracted so that it can be overridden.
\newcommand{\songtitle}[2][]{
    \begin{flushleft}
        \subsection*{\boldmath\songindex{#1}#2\unboldmath}
    \end{flushleft}
    % \nopagebreak
}
\newcommand{\melody}[1]{
    % \nopagebreak
    \vspace*{0.1cm}
    \begin{quoting}[leftmargin=6mm]\small{\textit{#1}}\end{quoting}
    \vspace*{-3mm}
    % \nopagebreak
}
\newcommand{\auth}[1]{
    % \nopagebreak
    \vspace*{0.1cm}
    \begin{verse}
        \begin{flushright}
            \textit{#1}
        \end{flushright}
    \end{verse}
}
\newenvironment{lyrics}{
%  \nopagebreak
 \vspace*{1mm}
 \begin{verse}
}{
 \end{verse}
%  \nopagebreak
}

% fkm* logo
\newcommand{\fkm}{\mbox{{\raisebox{-0.2ex}
    {\rotatebox{22}{\bf{f}}}\hspace{-0.16em}\raisebox{0.2ex}
    {\rotatebox{-15}{\bf{k}}}\hspace{-0.17em}\bf{m}\hspace{-0.15em}\raisebox{0.6ex}
    {\scalebox{0.6}{\bf{*}}}}}\xspace}

%
% Special character handling
%

% Greek uppercase
\DeclareUnicodeCharacter{0391}{A} % Α
\DeclareUnicodeCharacter{0392}{B} % Β
\DeclareUnicodeCharacter{0393}{$\Gamma$} % Γ
\DeclareUnicodeCharacter{0394}{$\Delta$} % Δ
\DeclareUnicodeCharacter{0395}{E} % Ε
\DeclareUnicodeCharacter{0396}{Z} % Ζ
\DeclareUnicodeCharacter{0397}{H} % Η
\DeclareUnicodeCharacter{0398}{$\Theta$} % Θ
\DeclareUnicodeCharacter{0399}{I} % Ι
\DeclareUnicodeCharacter{039A}{K} % Κ
\DeclareUnicodeCharacter{039B}{$\Lambda$} % Λ
\DeclareUnicodeCharacter{039C}{M} % Μ
\DeclareUnicodeCharacter{039D}{N} % Ν
\DeclareUnicodeCharacter{039E}{$\Xi$} % Ξ
\DeclareUnicodeCharacter{039F}{O} % Ο
\DeclareUnicodeCharacter{03A0}{$\Pi$} % Π
\DeclareUnicodeCharacter{03A1}{P} % Ρ
% \DeclareUnicodeCharacter{03A2}{$\CHANGEME$} % ΢
\DeclareUnicodeCharacter{03A3}{$\Sigma$} % Σ
\DeclareUnicodeCharacter{03A4}{T} % Τ
\DeclareUnicodeCharacter{03A5}{Y} % Υ
\DeclareUnicodeCharacter{03A6}{$\Phi$} % Φ
\DeclareUnicodeCharacter{03A7}{X} % Χ
\DeclareUnicodeCharacter{03A8}{$\Psi$} % Ψ
\DeclareUnicodeCharacter{03A9}{$\Omega$} % Ω

% Greek lowercase
\DeclareUnicodeCharacter{03B1}{$\alpha$} % α
\DeclareUnicodeCharacter{03B2}{$\beta$} % β
\DeclareUnicodeCharacter{03B3}{$\gamma$} % γ
\DeclareUnicodeCharacter{03B4}{$\delta$} % δ
\DeclareUnicodeCharacter{03B5}{$\varepsilon$} % ε
\DeclareUnicodeCharacter{03B6}{$\zeta$} % ζ
\DeclareUnicodeCharacter{03B7}{$\eta$} % η
\DeclareUnicodeCharacter{03B8}{$\theta$} % θ
\DeclareUnicodeCharacter{03B9}{$\iota$} % ι
\DeclareUnicodeCharacter{03BA}{$\kappa$} % κ
\DeclareUnicodeCharacter{03BB}{$\lambda$} % λ
\DeclareUnicodeCharacter{03BC}{$\mu$} % μ
\DeclareUnicodeCharacter{03BD}{$\nu$} % ν
\DeclareUnicodeCharacter{03BE}{$\xi$} % ξ
\DeclareUnicodeCharacter{03BF}{o} % ο
\DeclareUnicodeCharacter{03C0}{$\pi$} % π
\DeclareUnicodeCharacter{03C1}{$\rho$} % ρ
\DeclareUnicodeCharacter{03C3}{$\sigma$} % σ
\DeclareUnicodeCharacter{03C4}{$\tau$} % τ
\DeclareUnicodeCharacter{03C5}{$\upsilon$} % υ
\DeclareUnicodeCharacter{03C6}{$\phi$} % φ
\DeclareUnicodeCharacter{03C7}{$\chi$} % χ
\DeclareUnicodeCharacter{03C8}{$\psi$} % ψ
\DeclareUnicodeCharacter{03C9}{$\omega$} % ω
\DeclareUnicodeCharacter{03D1}{$\vartheta$} % ϑ
\DeclareUnicodeCharacter{03D5}{$\varphi$} % ϕ
\DeclareUnicodeCharacter{03F1}{$\varrho$} % ϱ

% Math, sub-/superscripts
\DeclareUnicodeCharacter{00B0}{$^\circ$} % °
\DeclareUnicodeCharacter{00B2}{$^2$} % ²
\DeclareUnicodeCharacter{00B3}{$^3$} % ³
\DeclareUnicodeCharacter{2082}{$_2$} % ₂
\DeclareUnicodeCharacter{2099}{$_n$} % ₙ

% Math, other
\DeclareUnicodeCharacter{1E8D}{$\ddot{x}$} % ẍ
\DeclareUnicodeCharacter{1E8B}{$\dot{x}$} % ẋ
\DeclareUnicodeCharacter{2124}{$\mathbb{Z}$} % ℤ
\DeclareUnicodeCharacter{2200}{$\forall$} % ∀
\DeclareUnicodeCharacter{2208}{$\in$} % ∈
\DeclareUnicodeCharacter{2297}{$\otimes$} % ⊗
\DeclareUnicodeCharacter{221E}{$\infty$} % ∞
\DeclareUnicodeCharacter{2205}{$\emptyset$} % ∅
\DeclareUnicodeCharacter{2207}{$\nabla$} % ∇
\DeclareUnicodeCharacter{2229}{$\cap$} % ∩
\DeclareUnicodeCharacter{222A}{$\cup$} % ∪
\DeclareUnicodeCharacter{222B}{$\int$} % ∫
\DeclareUnicodeCharacter{22C5}{$\cdot$} % ⋅
\DeclareUnicodeCharacter{2227}{$\land$} % ∧
\DeclareUnicodeCharacter{27F8}{$\Leftarrow$} % ⟸
\DeclareUnicodeCharacter{2202}{$\partial$} % ∂
\DeclareUnicodeCharacter{2260}{$\neq$} % ≠
\DeclareUnicodeCharacter{2228}{$\lor$} % ∨
\DeclareUnicodeCharacter{230A}{$\lfloor$} % ⌊
\DeclareUnicodeCharacter{230B}{$\rfloor$} % ⌋
