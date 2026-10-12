# 1. Codage binaire

[📽 Slides du chapitre](https://regislon.github.io/cfgeo_B4/formats-interfaces/01-codage-binaire/slides.html)

## Objectifs

À la fin de ce chapitre, vous êtes capables de :

- Expliquer pourquoi un ordinateur travaille en base 2
- Convertir un nombre entre binaire et décimal
- Calculer le nombre de valeurs représentables avec *n* bits
- Maîtriser les unités (bit, octet, ko/Kio, Mo/Mio…) et la différence entre préfixes décimaux et binaires

## Introduction : qu'est-ce qu'un format ?

Pour être utilisée, toute information numérique (image, son, vidéo, texte, données vectorielles) doit être **codée** selon un format qui garantit qu'un logiciel pourra l'interpréter.

- Un **format de données** est une manière d'encoder de l'information numérique pour la rendre exploitable par un système informatique.
- Lorsqu'un format est destiné à être compris par plusieurs systèmes différents, on parle de **format d'échange**.
- Un **format ouvert** (ou normalisé) a une spécification publiquement accessible ; un **format fermé** (ou propriétaire) a une définition secrète ou laissée à la libre appréciation de son propriétaire.

Les géodonnées sont stockées dans une multitude de formats, chacun optimisant certains aspects (taille, vitesse de lecture, richesse du modèle, lisibilité…). Pour comprendre leurs différences, il faut d'abord savoir comment un ordinateur représente l'information : en **binaire**.

## Système décimal et système binaire

### Pourquoi la base 2 ?

La plupart des civilisations utilisent le système décimal… parce que nous avons dix doigts.

L'ordinateur, lui, n'a pas de doigts : il fonctionne à l'électricité. Il ne distingue que **deux états** : il y a du courant ou il n'y en a pas ; allumé ou éteint ; vrai ou faux ; **1 ou 0**. Ces deux états sont faciles à produire et à détecter de manière fiable : tension électrique présente ou absente, zone magnétisée dans un sens ou dans l'autre sur un disque, creux ou plat sur un DVD, cellule chargée ou non dans une mémoire flash.

On dit que l'ordinateur travaille en **système binaire**, ou en **base 2**.

### Le système décimal (base 10)

Le système décimal utilise 10 symboles, les chiffres : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9.

La valeur d'un chiffre dépend du chiffre lui-même **et de sa position** dans le nombre : le 3 de 1934 vaut 30, alors que le 3 de 3008 vaut 3'000. On parle de **représentation positionnelle**.

Pour connaître la valeur de chaque chiffre, on décompose le nombre selon les puissances de la base : c'est la **forme canonique**.

!!! example "🔎 Décomposition du nombre 3'528"

    - 8 unités
    - 2 dizaines
    - 5 centaines
    - 3 milliers

    Forme canonique : 3'528 = 3·10³ + 5·10² + 2·10¹ + 8·10⁰

### Le système binaire (base 2)

Le système binaire repose exactement sur le même principe positionnel, mais avec **seulement 2 symboles : 0 et 1**. Chaque position correspond à une puissance de 2 au lieu d'une puissance de 10.

Décimal et binaire sont deux représentations différentes **d'un même nombre** : 21 en décimal et 10101 en binaire désignent la même quantité. Pour éviter toute confusion, on note parfois la base en indice : 10101₍₂₎ = 21₍₁₀₎.

## Bits et octets

### Le bit

Le **bit** (de l'anglais *binary digit*, noté **b** minuscule) est un chiffre binaire : 0 ou 1. C'est la plus petite unité d'information manipulable par une machine numérique.

En combinant plusieurs bits, on peut représenter des informations de plus en plus riches :

| Nombre de bits | Combinaisons possibles | Nombre de valeurs |
|---|---|---|
| 1 | 0, 1 | 2 |
| 2 | 00, 01, 10, 11 | 2 × 2 = 4 |
| 3 | 000, 001, 010, 011, 100, 101, 110, 111 | 2 × 2 × 2 = 8 |
| *n* | … | **2ⁿ** |

!!! tip "À retenir"

    Avec un groupe de *n* bits, on peut représenter **2ⁿ valeurs différentes**, par exemple les entiers de 0 à 2ⁿ − 1.

Avec 3 bits, on peut ainsi compter de 0 à 7 :

| Binaire (3 bits) | Décimal |
|---|---|
| 000 | 0 |
| 001 | 1 |
| 010 | 2 |
| 011 | 3 |
| 100 | 4 |
| 101 | 5 |
| 110 | 6 |
| 111 | 7 |

### L'octet

L'**octet** (noté **o** en français, **B** majuscule pour *byte* en anglais) est un groupe de **8 bits**. Il permet par exemple de stocker un caractère (une lettre, un chiffre) dans un texte ASCII.

Regrouper les bits par 8 améliore la lisibilité, de la même façon qu'on regroupe les chiffres par trois en décimal : « 1'256'245 » se lit plus facilement que « 1256245 ».

Un octet peut prendre 2⁸ = **256 valeurs** différentes :

- la plus petite est `00000000` = 0 ;
- la plus grande est `11111111` = **255**.

!!! warning "Attention aux majuscules"

    **b** (minuscule) = bit, **B** (majuscule) = byte = octet. Un débit internet de 100 Mb/s (mégabits par seconde) correspond à 12,5 Mo/s (mégaoctets par seconde).

Cette limite de 255 revient très souvent en géomatique : une image en niveaux de gris codée sur un octet par pixel a des valeurs de 0 à 255, une bande d'une orthophoto RVB aussi, etc. Pour stocker des valeurs plus grandes (une altitude en centimètres, un identifiant), on utilise 2, 4 ou 8 octets.

| Taille | Nombre de valeurs | Plage (entiers non signés) |
|---|---|---|
| 1 octet (8 bits) | 256 | 0 à 255 |
| 2 octets (16 bits) | 65'536 | 0 à 65'535 |
| 4 octets (32 bits) | 4'294'967'296 | 0 à env. 4,3 milliards |

## Conversions

### Du binaire vers le décimal

Il suffit de faire la **somme des puissances de 2** correspondant aux positions où se trouve un 1.

!!! example "🔎 Conversion de 10101₍₂₎"

    10101₍₂₎ = 1·2⁴ + 0·2³ + 1·2² + 0·2¹ + 1·2⁰ = 16 + 0 + 4 + 0 + 1 = **21₍₁₀₎**

Pour un octet, un tableau des poids facilite le calcul. On place le **bit de poids faible** (2⁰) **à droite**, comme les unités en décimal.

!!! example "🔎 Conversion de l'octet 00101010"

    | Poids | 2⁷ | 2⁶ | 2⁵ | 2⁴ | 2³ | 2² | 2¹ | 2⁰ | |
    |---|---|---|---|---|---|---|---|---|---|
    | Valeur | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 | |
    | Bits | 0 | 0 | 1 | 0 | 1 | 0 | 1 | 0 | |
    | Total | 0 | 0 | 32 | 0 | 8 | 0 | 2 | 0 | **Σ = 42** |

### Du décimal vers le binaire

Deux méthodes équivalentes :

1. **Soustraction des puissances de 2** : on cherche la plus grande puissance de 2 contenue dans le nombre, on écrit un 1 à cette position, on la soustrait, et on recommence avec le reste.
2. **Divisions successives par 2** : on divise le nombre par 2 jusqu'à obtenir 0 en notant chaque reste ; le nombre binaire se lit **de bas en haut** (dernier reste = bit de poids fort).

!!! example "🔎 Conversion de 156₍₁₀₎ par divisions successives"

    | Division | Quotient | Reste |
    |---|---|---|
    | 156 / 2 | 78 | 0 |
    | 78 / 2 | 39 | 0 |
    | 39 / 2 | 19 | 1 |
    | 19 / 2 | 9 | 1 |
    | 9 / 2 | 4 | 1 |
    | 4 / 2 | 2 | 0 |
    | 2 / 2 | 1 | 0 |
    | 1 / 2 | 0 | 1 |

    Lecture de bas en haut : 156₍₁₀₎ = **10011100₍₂₎**

    Vérification : 128 + 16 + 8 + 4 = 156 ✔

??? question "Exercice rapide"

    1. Convertissez 11001000₍₂₎ en décimal.
    2. Convertissez 77₍₁₀₎ en binaire sur 8 bits.
    3. Combien de bits faut-il au minimum pour coder les 26 lettres de l'alphabet ?

    **Réponses** : 1) 128 + 64 + 8 = 200 ; 2) 01001101 ; 3) 5 bits (2⁴ = 16 < 26 ≤ 32 = 2⁵).

## Unités informatiques

### Préfixes décimaux (SI)

Dans les systèmes d'unités habituels (mètres, grammes…), les préfixes progressent par pas de **1'000** :

- 1 km = 1'000 m
- 1 kg = 1'000 g
- (peu utilisé) 1 Mm (mégamètre) = 1'000 km

Ces mêmes préfixes du Système international s'appliquent aux octets : **1 ko = 1'000 octets**, 1 Mo = 1'000 ko, etc.

### Préfixes binaires (CEI/IEC)

Comme l'informatique travaille en puissances de 2, on a longtemps utilisé « kilo » pour 2¹⁰ = **1'024** (proche de 1'000). Cette double signification créait une ambiguïté : un « Mo » valait-il 1'000'000 ou 1'048'576 octets ?

Depuis 1998, la Commission électrotechnique internationale (CEI, en anglais IEC) a défini des **préfixes binaires** distincts : kibi, mébi, gibi… On écrit alors **Kio** (kibioctet), **Mio**, **Gio**, etc. (en anglais KiB, MiB, GiB).

| Préfixe décimal (SI) | Valeur | Préfixe binaire (CEI) | Valeur |
|---|---|---|---|
| kilooctet (ko) | 10³ = 1'000 o | kibioctet (Kio) | 2¹⁰ = 1'024 o |
| mégaoctet (Mo) | 10⁶ o | mébioctet (Mio) | 2²⁰ = 1'048'576 o |
| gigaoctet (Go) | 10⁹ o | gibioctet (Gio) | 2³⁰ ≈ 1,074 · 10⁹ o |
| téraoctet (To) | 10¹² o | tébioctet (Tio) | 2⁴⁰ ≈ 1,100 · 10¹² o |
| pétaoctet (Po) | 10¹⁵ o | pébioctet (Pio) | 2⁵⁰ |
| exaoctet (Eo) | 10¹⁸ o | exbioctet (Eio) | 2⁶⁰ |

!!! note "Dans la pratique"

    - Les fabricants de disques durs et de clés USB utilisent les **préfixes décimaux** : un disque « 1 To » contient 10¹² octets.
    - Windows affiche les tailles en puissances de 2 mais avec les symboles « ko, Mo, Go » : ce même disque y apparaît comme « 931 Go » (en réalité 931 Gio). Rien n'a disparu, c'est une question d'unité !
    - macOS et de nombreux outils Linux affichent les tailles en préfixes décimaux, ou en Kio/Mio explicites.

    L'écart grandit avec la taille : environ 2,4 % pour kilo, 7,4 % pour giga, 10 % pour téra. Dans ce cours, lorsque la différence compte, on précise **ko** (1'000) ou **Kio** (1'024).

!!! example "🔎 Taille d'une image"

    Une image de 4'000 × 3'000 pixels en couleurs vraies (3 octets par pixel) occupe sans compression :

    4'000 × 3'000 × 3 = 36'000'000 octets = **36 Mo** = 36'000'000 / 1'048'576 ≈ **34,3 Mio**

## Sources

- \[1\] [Apprendre – Modulo informatique](https://dev-apprendre.modulo-info.ch/)
- \[2\] [Code binaire : principe, codage, règles, symboles – CommentCaMarche](https://www.commentcamarche.net/informatique/technologies/24919-code-binaire-principe-codage-regles-symboles/)
- \[3\] [Les unités de mesure en informatique – apcpedagogie](https://apcpedagogie.com/les-unites-de-mesure-en-informatique/)
- [Préfixe binaire – Wikipédia](https://fr.wikipedia.org/wiki/Pr%C3%A9fixe_binaire)

---

[Données raster](../02-raster/README.md) →
