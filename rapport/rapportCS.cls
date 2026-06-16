\LoadClass[a4paper,12pt]{report} % Classe du document

%--------------------- Packages ------------------------

\RequirePackage[french]{babel} %Langue du document
\RequirePackage[utf8]{inputenc} %Caractères spéciaux
\RequirePackage[section]{placeins}%Pour placement de section
\RequirePackage[T1]{fontenc} %Quelques lettres qui sont pas inclus dans UTF-8
\RequirePackage{mathtools} %Paquet pour des équations et symboles mathématiques
\RequirePackage{siunitx} %Pour écrire avec la notation scientifique (Ex.: \num{2e+9})
\RequirePackage{float} %Pour placement d'images
\RequirePackage{graphicx} %Paquet pour insérer des images
\RequirePackage[justification=centering]{caption} %Pour les légendes centralisées
\RequirePackage{subcaption}
\RequirePackage{wallpaper}
\RequirePackage{nomencl}
\makenomenclature
\RequirePackage{fancyhdr} %personnaliser :en-tête pied de page numéros de page
%\pagestyle{fancy}
%\fancyheadoffset{1cm}
%\setlength{\headheight}{2cm}
\RequirePackage{url}
\RequirePackage[hidelinks]{hyperref}%Paquet pour insérer légendes dans des sous-figures comme Figure 1a, 1b
\RequirePackage[left=3cm,right=3cm,top=3cm,bottom=5cm,headheight=50pt]{geometry} %Configuration de la page



%-------------------- Informations sur le rapport ----------------------

\newcommand{\mention}[1]{\def\@mention{#1}}
\newcommand{\trigrammemention}[1]{\def\@trigrammemention{#1}}
\newcommand{\master}[1]{\def\@master{#1}}
\newcommand{\filiere}[1]{\def\@filiere{#1}}

\newcommand{\titre}[1]{\def\@titre{#1}}

\newcommand{\eleve}[1]{\def\@eleve{#1}}

\newcommand{\tuteuruniv}[1]{\def\@tuteuruniv{#1}}
\newcommand{\membresjury}[1]{\def\@membresjury{#1}}
\newcommand{\tuteurentreprise}[1]{\def\@tuteurentreprise{#1}}

\newcommand{\logoentreprise}[1]{\def\@logoentreprise{#1}}

\newcommand{\dates}[1]{\def\@dates{#1}}

% Initialisation
\def\@mention{}
\def\@trigrammemention{}
\def\@master{}
\def\@filiere{}
\def\@titre{}
\def\@eleve{}
\def\@tuteuruniv{}
\def\@membresjury{}
\def\@tuteurentreprise{}
\def\@logoentreprise{}
\def\@dates{}

\newcommand{\fairemarges}{
\pagestyle{fancy}
\fancyheadoffset{0.5cm}

\lhead{\ifx\@logoentreprise\@empty\includegraphics[scale=0.1]{logos/emsi.png}\else\includegraphics[scale=0.06]{\@logoentreprise}\fi}
\rhead{\nouppercase{\leftmark}}
\rfoot{\thepage}
\cfoot{}
\lfoot{\@trigrammemention}
}

\newcommand{\fairepagedegarde}{%
\begin{titlepage}
\ThisULCornerWallPaper{0.2}{logos/coin_haut.png}
\ThisLRCornerWallPaper{0.2}{logos/coin_bas.png}
\thispagestyle{empty}
\centering

\vspace*{1cm}
\ifx\@logoentreprise\@empty
    \includegraphics[width=0.4\linewidth]{logos/emsi.png}\par
\else
    \includegraphics[width=0.4\linewidth]{\@logoentreprise}\par
\fi

\vspace{2cm}

\rule{\linewidth}{0.2mm}\par
\vspace{0.5cm}
{\huge\bfseries \@titre}\par
\vspace{0.5cm}
\rule{\linewidth}{0.2mm}\par

\vspace{1.2cm}
{\Large\scshape 
  \renewcommand{\arraystretch}{1.3}
  \begin{tabular}{@{}c@{}}
    \@eleve
  \end{tabular}
}\par

\vspace{1.2cm}
{\large
    \ifx\@mention\@empty\else\@mention\par\fi
    \ifx\@filiere\@empty\else\@filiere\par\fi
    \ifx\@master\@empty\else\@master\par\fi
}\par

\vspace{1cm}
{\large \@dates}\par

\vfill
{\large\textbf{Tuteur(s) EMSI :}}\par
\vspace{0.2cm}
\@tuteuruniv\par

\vspace{1cm}

{\large\textbf{Membres du jury :}}\par
\vspace{0.2cm}
\@membresjury\par

\vspace{1cm}
\end{titlepage}
\newpage
}

\newcommand{\tabledematieres}{
\tableofcontents
\newpage
}


\newcommand{\insererfigure}[4]{
\begin{figure}[ht]
\centering
\includegraphics[height=#2]{#1}
\caption{#3}
\label{fig: #4}
\end{figure}
}
