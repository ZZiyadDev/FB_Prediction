\LoadClass[a4paper,12pt]{report} % Classe du document

%--------------------- Packages ------------------------
\RequirePackage[export]{adjustbox}
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
\RequirePackage{url}
\RequirePackage[hidelinks]{hyperref}
\RequirePackage[left=3cm,right=3cm,top=3cm,bottom=3cm,headheight=50pt]{geometry}
\RequirePackage{setspace}
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
\newcommand{\logouniversite}[1]{\def\@logouniversite{#1}}
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
\def\@logouniversite{}
\def\@dates{}

\newcommand{\fairemarges}{
\pagestyle{fancy}
\fancyheadoffset{0.5cm}
\lhead{
  \ifx\@logoentreprise\@empty\includegraphics[scale=0.1]{logos/emsi.png}\else\includegraphics[scale=0.06]{\@logoentreprise}\fi
  % \ifx\@logouniversite\@empty\else\includegraphics[scale=0.06]{\@logouniversite}\fi
}
\rhead{\nouppercase{\leftmark}}
\rfoot{}
\cfoot{\thepage}
\lfoot{\@trigrammemention}
}

\newcommand{\fairepagedegarde}{%
\begin{titlepage}
  \vspace*{-4cm}
\ThisULCornerWallPaper{0.2}{logos/coin_haut.png}
\ThisLRCornerWallPaper{0.2}{logos/coin_bas.png}
\thispagestyle{empty}
\centering

\vspace*{-0.5cm}  % ← négatif pour monter les logos vers le haut
\begin{tabular}{@{}c@{\hspace{1cm}}c@{}}
\ifx\@logoentreprise\@empty
    \includegraphics[width=0.35\linewidth,valign=m]{logos/emsi.png}
\else
    \includegraphics[width=0.35\linewidth,valign=m]{\@logoentreprise}
\fi
&
\ifx\@logouniversite\@empty\else
    \includegraphics[width=0.50\linewidth,valign=m]{\@logouniversite}
\fi
\end{tabular}\par

\vspace{-0.5cm}  % ← espace réduit entre logos et trait

\rule{\linewidth}{0.2mm}\par
\vspace{0.5cm}
\begin{minipage}{0.92\linewidth}
\centering
\setstretch{1}\huge\bfseries \@titre
\end{minipage}\par
\vspace{0.5cm}
\rule{\linewidth}{0.2mm}\par
\vspace{1.5cm} 
{\normalsize\scshape
  \renewcommand{\arraystretch}{1.2}
  \begin{tabular}{@{}c@{}}
    \@eleve
  \end{tabular}
}\par

\vspace{0.8cm}
{\large
    \ifx\@mention\@empty\else\@mention\par\fi
    \ifx\@filiere\@empty\else\@filiere\par\fi
    \ifx\@master\@empty\else\@master\par\fi
}\par

\vspace{0.5cm}
{\large \@dates}\par

\vspace{1.5cm}
{\large\textbf{Tuteur(s) EMSI :}}\par
\vspace{0.4cm}
\@tuteuruniv\par

\vspace{0.8cm}

{\large\textbf{Membres du jury :}}\par
\vspace{0.2cm}
\@membresjury\par

\vspace{0.5cm}
\end{titlepage}
\newpage
}

\newcommand{\tabledematieres}{
\tableofcontents
\newpage
}

\newcommand{\listedabreviations}{
\addcontentsline{toc}{chapter}{Liste des abréviations}
\chapter*{Liste des abréviations}
\vspace{0.5cm}

\renewcommand{\arraystretch}{1.3}
\begin{center}
\begin{tabular}{>{\bfseries}p{3.5cm} p{10cm}}
\hline
Abréviation & Signification \\
\hline
AI & Artificial Intelligence \\
API & Application Programming Interface \\
CDN & Content Delivery Network \\
CI/CD & Continuous Integration / Continuous Deployment \\
DRF & Django Rest Framework \\
HTTP & Hypertext Transfer Protocol \\
JSON & JavaScript Object Notation \\
JWT & JSON Web Token \\
ML & Machine Learning \\
SMOTE & Synthetic Minority Oversampling Technique \\
UI/UX & User Interface / User Experience \\
UML & Unified Modeling Language \\
XGBoost & Extreme Gradient Boosting \\
\hline
\end{tabular}
\end{center}
\newpage
}

\newcommand{\listedesannexes}{
\addcontentsline{toc}{chapter}{Liste des annexes}
\chapter*{Liste des annexes}
\vspace{0.5cm}

\renewcommand{\arraystretch}{1.3}
\begin{center}
\begin{tabular}{>{\bfseries}p{3.5cm} p{10cm}}
\hline
Annexe A & Extraits de Code Source \\
\quad A.1 & Création du profil et des signaux (users/models.py) \\
\quad A.2 & Logique de Batching et Rate Limiting \\
\quad A.3 & Gestion globale de l'authentification avec Zustand \\
\hline
\end{tabular}
\end{center}
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