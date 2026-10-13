# 1. Codage binaire

[📽 Slides du chapitre](https://regislon.github.io/cfgeo_B4/formats-interfaces/01-codage-binaire/slides.html)

## Objectifs

À la fin de ce chapitre, vous êtes capables de :

- Expliquer pourquoi un ordinateur travaille en base 2
- Convertir un nombre entre binaire et décimal
- Calculer le nombre de valeurs représentables avec *n* bits
- Lire et écrire un nombre en hexadécimal
- Expliquer comment sont codés les nombres négatifs et les nombres à virgule, et pourquoi une coordonnée MN95 ne doit pas être stockée en Float32
- Expliquer comment un texte est codé (ASCII, Latin-1, UTF-8) et reconnaître un problème d'encodage
- Maîtriser les unités (bit, octet, ko/Kio, Mo/Mio…) et la différence entre préfixes décimaux et binaires
- Distinguer un fichier texte d'un fichier binaire, et comprendre pourquoi un logiciel sait lire un fichier « illisible »

## Introduction : qu'est-ce qu'un format ?

Pour être utilisée, toute information numérique (image, son, vidéo, texte, données vectorielles) doit être **codée** selon un format qui garantit qu'un logiciel pourra l'interpréter.

- Un **format de données** est une manière d'encoder de l'information numérique pour la rendre exploitable par un système informatique.
- Lorsqu'un format est destiné à être compris par plusieurs systèmes différents, on parle de **format d'échange**.
- Un **format ouvert** (ou normalisé) a une spécification publiquement accessible ; un **format fermé** (ou propriétaire) a une définition secrète ou laissée à la libre appréciation de son propriétaire.

Les géodonnées sont stockées dans une multitude de formats, chacun optimisant certains aspects (taille, vitesse de lecture, richesse du modèle, lisibilité…). Pour comprendre leurs différences, il faut d'abord savoir comment un ordinateur représente l'information : en **binaire**.

## Fil rouge : Yverdon en 0 et 1

Les chapitres suivants étudient tous le même kilomètre carré d'Yverdon-les-Bains, la tuile **2538-1180** : orthophoto et MNT au [chapitre 2](../02-raster/README.md#fil-rouge-un-kilometre-carre-a-yverdon-les-bains), bâtiments, routes et arrêts de bus au [chapitre 3](../03-vecteur/README.md#fil-rouge-le-meme-kilometre-carre-en-vecteur). Dans l'ordinateur, tout cela n'est qu'une longue suite de **0 et de 1**. Ce chapitre explique comment on passe de l'un à l'autre, à travers cinq exemples tirés de la tuile :

| Information | Valeur | Ce qui est stocké | Voir |
|---|---|---|---|
| Couleur d'un pixel de l'orthophoto (toit d'une voiture) | rouge 204, vert 211, bleu 230 | 3 octets : `CC D3 E6` | [Hexadécimal](#lhexadecimal) |
| Altitude d'un point du MNT | 433,17 m | 4 octets (Float32) : `C3 95 D8 43` | [Nombres à virgule](#les-nombres-a-virgule) |
| Coordonnée Est d'un point | 2'538'500,12 m | 8 octets (Float64) : `F6 28 5C 0F 02 5E 43 41` | [Nombres à virgule](#les-nombres-a-virgule) |
| Nom d'un arrêt de bus | « Faïencerie » | 11 octets en UTF-8 : `46 61 C3 AF 65 6E 63 65 72 69 65` | [Codage du texte](#le-codage-du-texte) |
| Taille de la tuile SWISSIMAGE | 65 Mo | 65'004'150 octets | [Unités](#unites-informatiques) |

Le message de ce chapitre : **un fichier n'est qu'une suite d'octets**. Le **format** est la convention qui dit comment interpréter ces octets : comme des couleurs, des nombres, des lettres… Sans connaître la convention, les octets ne veulent rien dire.

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

<div class="demo" data-demo="bits"></div>

*Cliquez sur les bits pour les allumer ou les éteindre. En mode « couleur RVB », les trois octets décrivent un pixel : le bouton 🧵 charge le pixel du toit de voiture de l'orthophoto du fil rouge.*

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

### Entraînez-vous

<div class="demo" data-demo="exercices"></div>

*Les nombres sont tirés au hasard : cliquez sur « Nouvel exercice » autant de fois que vous le souhaitez. La correction détaille chaque étape.*

## L'hexadécimal

Écrire des octets en binaire est long et source d'erreurs : `11001100 11010011 11100110`. On utilise donc souvent la **base 16**, ou **hexadécimal**, qui a 16 symboles : les chiffres 0 à 9, puis les lettres **A à F** pour les valeurs 10 à 15.

L'intérêt est simple : **un chiffre hexadécimal correspond exactement à 4 bits**, donc **un octet s'écrit toujours avec 2 chiffres hexadécimaux**, de `00` (0) à `FF` (255).

| Binaire | Hexa | Décimal | | Binaire | Hexa | Décimal |
|---|---|---|---|---|---|---|
| 0000 | 0 | 0 | | 1000 | 8 | 8 |
| 0001 | 1 | 1 | | 1001 | 9 | 9 |
| 0010 | 2 | 2 | | 1010 | A | 10 |
| 0011 | 3 | 3 | | 1011 | B | 11 |
| 0100 | 4 | 4 | | 1100 | C | 12 |
| 0101 | 5 | 5 | | 1101 | D | 13 |
| 0110 | 6 | 6 | | 1110 | E | 14 |
| 0111 | 7 | 7 | | 1111 | F | 15 |

!!! example "🧵 Fil rouge : la couleur d'un pixel"
    Un pixel de l'orthophoto, sur le toit d'une voiture, vaut rouge = 204, vert = 211, bleu = 230 :

    | | Rouge | Vert | Bleu |
    |---|---|---|---|
    | Décimal | 204 | 211 | 230 |
    | Binaire | 1100 1100 | 1101 0011 | 1110 0110 |
    | Hexadécimal | **CC** | **D3** | **E6** |

    En HTML et dans la plupart des logiciels, cette couleur s'écrit **`#CCD3E6`**. Pour convertir, on découpe chaque octet en deux groupes de 4 bits : `1100` = C, `1100` = C.

On rencontre l'hexadécimal partout en géomatique :

- les **couleurs** : `#CCD3E6` en HTML ou dans QGIS, `ff0000ff` en KML (voir [chapitre 5](../05-xml-json/README.md)) ;
- les **géométries binaires** (WKB) : `0101000000…` (voir [chapitre 3](../03-vecteur/README.md#un-modele-commun-ogc-simple-features)) ;
- les **éditeurs hexadécimaux**, qui affichent le contenu brut d'un fichier octet par octet (voir [plus bas](#fichiers-texte-et-fichiers-binaires)).

## Nombres négatifs et nombres à virgule

### Les nombres entiers signés

Pour représenter aussi des nombres **négatifs**, on réserve en pratique la moitié des combinaisons aux valeurs négatives (méthode dite du *complément à deux*, dont le détail dépasse ce cours). Avec le même nombre de bits, on peut donc coder autant de valeurs, mais décalées :

| Type | Taille | Plage |
|---|---|---|
| UInt8 (non signé) | 1 octet | 0 à 255 |
| Int8 (signé) | 1 octet | −128 à 127 |
| UInt16 | 2 octets | 0 à 65'535 |
| Int16 | 2 octets | −32'768 à 32'767 |
| Int32 | 4 octets | environ −2,1 à +2,1 milliards |

Ces noms de types (Byte, UInt16, Int32…) se retrouvent dans les propriétés des rasters (voir [chapitre 2](../02-raster/README.md#bandes-et-types-de-donnees)) et dans les champs des tables attributaires.

### Les nombres à virgule

Les nombres à virgule (altitudes, coordonnées, surfaces) sont codés en **virgule flottante**, selon la norme IEEE 754 : un peu comme une notation scientifique (6,0221 · 10²³), le nombre est stocké sous la forme d'un **signe**, d'une **mantisse** (les chiffres significatifs) et d'un **exposant** (la position de la virgule).

| Type | Taille | Chiffres significatifs |
|---|---|---|
| **Float32** (simple précision) | 4 octets | environ **7** |
| **Float64** (double précision) | 8 octets | environ **15 à 16** |

Comme la mantisse a une taille limitée, un nombre à virgule n'est presque jamais stocké **exactement** : il est arrondi à la valeur représentable la plus proche, comme une mesure lue sur une règle graduée qu'on arrondit à la graduation la plus proche.

Pourquoi l'écart dépend-il de la **taille** du nombre ? Parce que le nombre de **chiffres significatifs est fixe** (environ 7 en Float32), où que soit la virgule. Imaginez une calculatrice qui n'aurait que 7 cases d'affichage : pour `433,1700`, il reste 4 cases pour les décimales ; pour `2538500`, les 7 cases sont déjà occupées avant la virgule et il n'en reste aucune pour les décimales. En binaire, l'espacement entre deux valeurs possibles **double chaque fois que le nombre double** :

| Plage de valeurs | Exemple | Espacement en Float32 |
|---|---|---|
| 256 à 512 | altitude 433 m | 0,03 mm |
| 131'072 à 262'144 | coordonnée Y en MN03 (200'000) | 1,6 cm |
| 524'288 à 1'048'576 | coordonnée X en MN03 (600'000) | 6,3 cm |
| 1'048'576 à 2'097'152 | coordonnée N en MN95 (1'180'000) | 12,5 cm |
| 2'097'152 à 4'194'304 | coordonnée E en MN95 (2'538'000) | **25 cm** |

En Float64, la mantisse est beaucoup plus longue (environ 16 chiffres significatifs) : pour une coordonnée MN95, l'espacement tombe à moins d'un nanomètre.

!!! example "🧵 Fil rouge : une altitude et une coordonnée en Float32"
    | Valeur | Stockée en Float32 | Erreur | Pas entre deux valeurs voisines |
    |---|---|---|---|
    | Altitude 433,17 m | 433,170013 m | 0,01 mm | 0,03 mm |
    | Coordonnée N 1'180'500,12 m | 1'180'500,125 m | 5 mm | **12,5 cm** |
    | Coordonnée E 2'538'500,12 m | 2'538'500,000 m | **12 cm** | **25 cm** |

    Pour une altitude, le Float32 suffit largement : c'est d'ailleurs le type du MNT swissALTI3D. Mais une **coordonnée MN95**, avec ses 7 chiffres avant la virgule, ne peut plus être stockée qu'au **quart de mètre près** : inacceptable pour la mensuration ! C'est pourquoi les coordonnées sont stockées en **Float64** (Shapefile, GeoPackage, WKB, PostGIS…), où le pas est inférieur au nanomètre.

!!! warning "Piège classique"
    Exporter des coordonnées MN95 dans un champ ou un format « simple précision », ou dans un tableur mal configuré, peut dégrader silencieusement leur précision. Les coordonnées WGS84 en degrés souffrent du même problème : en Float32, la longitude d'Yverdon (6,634257°) n'est représentable qu'au pas de 0,0000005°, soit environ **4 cm** sur le terrain.

<div class="demo" data-demo="float"></div>

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

!!! example "🧵 Fil rouge : combien pèse la tuile SWISSIMAGE ?"
    Le serveur de swisstopo indique **65'004'150 octets**, soit **65,0 Mo**. Téléchargée sous Windows, la même tuile s'affiche comme « 62,0 Mo », car Windows divise par 1'048'576 : ce sont en réalité **62,0 Mio**.

<div class="demo" data-demo="unites"></div>

## Le codage du texte

Un ordinateur ne connaît que des nombres. Pour stocker du texte, on associe donc à chaque **caractère** un **numéro**, selon une table de correspondance : c'est le **codage des caractères** (en anglais *encoding*, ou *charset*).

### ASCII

La table **ASCII** (1963) code **128 caractères** sur 7 bits : les lettres latines **sans accents**, les chiffres, la ponctuation et quelques caractères de contrôle (retour à la ligne…). Par exemple `A` = 65 = `41` en hexa, `a` = 97 = `61`, `0` = 48 = `30`.

Pour l'anglais, c'est suffisant. Pour le français ou l'allemand, il manque é, è, à, ç, ä, ö, ü…

### Latin-1 et Windows-1252

Avec un octet entier (8 bits), on dispose de 256 numéros : les 128 premiers reprennent l'ASCII, les 128 suivants sont utilisés pour les **caractères accentués**. Le problème : chaque région du monde a défini **sa propre** table pour ces 128 numéros. Pour l'Europe occidentale, on utilise **Latin-1** (ISO 8859-1) ou sa variante **Windows-1252** (`ANSI_1252` dans un fichier DXF). Le même octet `EF` y désigne « ï », mais un autre caractère dans une table cyrillique ou grecque.

### Unicode et UTF-8

**Unicode** attribue un numéro unique à **chaque caractère de toutes les écritures du monde** (plus de 150'000 caractères). **UTF-8** est la manière la plus répandue de les écrire en octets :

- les caractères ASCII occupent **1 octet**, identique à l'ASCII (un texte ASCII est donc aussi de l'UTF-8 valide) ;
- les caractères accentués européens occupent **2 octets** ; d'autres écritures et les émojis en occupent 3 ou 4.

UTF-8 est aujourd'hui le standard du web, de XML, de JSON et de la plupart des formats récents.

!!! example "🧵 Fil rouge : l'arrêt « Faïencerie »"
    | Codage | Octets (hexadécimal) | Nombre d'octets |
    |---|---|---|
    | ASCII | impossible : le « ï » n'existe pas | — |
    | Latin-1 / Windows-1252 | `46 61` **`EF`** `65 6E 63 65 72 69 65` | 10 |
    | UTF-8 | `46 61` **`C3 AF`** `65 6E 63 65 72 69 65` | 11 |

    Les lettres sans accent ont les mêmes octets partout ; seul le « ï » diffère.

!!! warning "Le problème d'encodage (*mojibake*)"
    Si un logiciel lit un texte avec le **mauvais** codage, les caractères accentués sont mal affichés. Les octets UTF-8 `C3 AF` lus comme du Latin-1 donnent deux caractères : « Ã¯ ». « Faïencerie » devient **« FaÃ¯encerie »**, et « Genève » devient « GenÃ¨ve ». C'est exactement ce qui arrive avec un shapefile dont le fichier `.cpg` (qui indique le codage des attributs) a été oublié (voir [chapitre 3](../03-vecteur/README.md#shapefile)). C'est aussi pourquoi un fichier XML commence par `<?xml version="1.0" encoding="UTF-8"?>` (voir [chapitre 5](../05-xml-json/README.md)).

<div class="demo" data-demo="texte"></div>

## Fichiers texte et fichiers binaires

Nous pouvons maintenant comprendre une distinction essentielle pour la suite du cours. **Tous** les fichiers sont des suites d'octets ; ce qui change, c'est **la manière d'interpréter ces octets**.

### Les fichiers texte

Dans un **fichier texte**, **chaque octet (ou groupe d'octets) représente un caractère**, selon un codage (ASCII, Latin-1, UTF-8…). Un éditeur de texte (Bloc-notes, Notepad++, VS Code) sait justement faire cette traduction : il affiche des lettres et des chiffres lisibles par un humain.

Mais **lisible ne veut pas dire compris** : l'éditeur affiche les caractères, alors que le logiciel SIG les **interprète** selon les règles du format. Dans un fichier DXF, par exemple, chaque valeur est précédée d'un **code de groupe** qui dit ce qu'elle représente :

!!! example "🧵 Fil rouge : un arrêt de bus dans un fichier DXF (texte)"
    ```text
      0
    POINT
      8
    0
     10
    2538235
     20
    1180434
    ```
    L'éditeur affiche simplement ces lignes. AutoCAD ou QGIS, qui connaissent la spécification DXF, comprennent : « `0` → début d'une entité de type POINT ; `8` → sur le calque 0 ; `10` → coordonnée X = 2'538'235 ; `20` → coordonnée Y = 1'180'434 ».

    La coordonnée `2538235` est stockée comme **7 caractères**, soit 7 octets (`32 35 33 38 32 33 35` en hexa), et non comme un nombre. Pour savoir comment traduire ces octets en caractères, le DXF indique son codage dans son en-tête : ici `$DWGCODEPAGE ANSI_1252` (Windows-1252, version DXF 2004) ; depuis la version 2007, les DXF sont en **UTF-8**.

D'autres formats texte : CSV, GeoJSON, KML, GML, INTERLIS (`.itf`, `.xtf`), ASCII Grid, WKT.

### Les fichiers binaires

Dans un **fichier binaire**, les octets ne représentent **pas des caractères**, mais directement des **nombres** (entiers, Float64…), des pixels, des index… exactement comme en mémoire. Ouvert dans un éditeur de texte, qui essaie de les traduire en caractères, un tel fichier affiche une suite de **symboles incompréhensibles**. Le fichier n'est pourtant **pas abîmé** : il n'est simplement pas fait pour être lu de cette manière.

Le logiciel qui connaît la **spécification** du format sait, lui, exactement où se trouve chaque information et comment la décoder.

!!! example "🧵 Fil rouge : l'en-tête du shapefile des bâtiments (binaire)"
    Les 100 premiers octets de `batiments.shp`, vus dans un éditeur hexadécimal (16 octets par ligne) :
    ```text
    00 00 27 0A 00 00 00 00 00 00 00 00 00 00 00 00
    00 00 00 00 00 00 00 00 00 00 CE 9E E8 03 00 00
    05 00 00 00 70 34 80 D7 3D 5D 43 41 20 75 02 9A
    72 01 32 41 58 B1 BF 8C 0E 5F 43 41 00 DE 02 A9
    7F 05 32 41 00 00 00 00 00 00 00 00 00 00 00 00
    ...
    ```
    La spécification publiée par Esri dit comment lire ces octets :

    | Octets | Contenu | Codage | Valeur |
    |---|---|---|---|
    | 0 à 3 | Code du fichier | entier 32 bits | `00 00 27 0A` = **9'994** (identifie un shapefile) |
    | 24 à 27 | Longueur du fichier | entier 32 bits, en mots de 2 octets | 52'894 → **105'788 octets** |
    | 28 à 31 | Version | entier 32 bits | **1'000** |
    | 32 à 35 | Type de géométrie | entier 32 bits | **5** = polygone |
    | 36 à 67 | Emprise : X min, Y min, X max, Y max | 4 × Float64 | **2'538'107,68 / 1'180'018,60 / 2'539'037,10 / 1'181'055,66** |

    On retrouve l'emprise de la tuile du fil rouge, en MN95 ! Ouvert dans un éditeur de texte (en Windows-1252), ce même en-tête affiche : `··'·······················Îžè·······p4€×=]CA u·šr·2AX±¿Œ·_CA·Þ·©··2A` (les `·` remplacent les caractères invisibles).

<div class="demo" data-demo="fichier"></div>

### Texte ou binaire : que choisir ?

| | Fichier texte | Fichier binaire |
|---|---|---|
| Lisible dans un éditeur | ✅ oui | ❌ non (symboles incompréhensibles) |
| Taille | plus grande (2538235 = 7 octets) | plus petite (un Float64 = 8 octets pour n'importe quelle coordonnée, avec décimales) |
| Vitesse de lecture | plus lente (il faut convertir le texte en nombres) | plus rapide (les octets sont directement des nombres) |
| Précision des nombres | dépend du nombre de décimales écrites | fixée par le type (Float32, Float64) |
| Risques | problèmes d'**encodage** des caractères | il faut **connaître la spécification** pour lire le fichier |
| Exemples | DXF ASCII, CSV, GeoJSON, KML, GML, XTF, ASCII Grid | Shapefile, GeoPackage, GeoTIFF, FlatGeobuf, GeoParquet, PMTiles |

!!! tip "À retenir"
    - Un fichier = une suite d'octets ; un **format** = la convention qui dit comment les interpréter.
    - Un fichier **texte** se lit dans un éditeur parce que ses octets sont des **caractères** ; un logiciel doit tout de même connaître le format pour en **comprendre** le contenu.
    - Un fichier **binaire** paraît illisible dans un éditeur, mais un logiciel qui connaît sa **spécification** le lit parfaitement, et plus vite.
    - Ces notions reviennent tout au long du cours : formats raster ([chapitre 2](../02-raster/README.md)), formats vectoriels ([chapitre 3](../03-vecteur/README.md#binaire-texte-xml)), XML et JSON ([chapitre 5](../05-xml-json/README.md)).

## Testez-vous

<div class="demo" data-demo="quiz" data-quiz="codage"></div>

## Sources

- \[1\] [Apprendre – Modulo informatique](https://dev-apprendre.modulo-info.ch/)
- \[2\] [Code binaire : principe, codage, règles, symboles – CommentCaMarche](https://www.commentcamarche.net/informatique/technologies/24919-code-binaire-principe-codage-regles-symboles/)
- \[3\] [Les unités de mesure en informatique – apcpedagogie](https://apcpedagogie.com/les-unites-de-mesure-en-informatique/)
- [Préfixe binaire – Wikipédia](https://fr.wikipedia.org/wiki/Pr%C3%A9fixe_binaire)
- [UTF-8 – Wikipédia](https://fr.wikipedia.org/wiki/UTF-8)
- [IEEE 754 – Wikipédia](https://fr.wikipedia.org/wiki/IEEE_754)
- [ESRI Shapefile Technical Description (1998)](https://www.esri.com/content/dam/esrisites/sitecore-archive/Files/Pdfs/library/whitepapers/pdfs/shapefile.pdf)

---

[Données raster](../02-raster/README.md) →
