---
marp: true
theme: cfgeo
paginate: true
footer: CFGéo B4 · Formats, interfaces · 1. Codage binaire
---

<!-- _class: lead -->
<!-- _paginate: false -->

# 1. Codage binaire

Module B4 « Géomatique & TI » — Formats, interfaces

---

## Objectifs

- Binaire, décimal, **hexadécimal**
- Entiers signés, **nombres à virgule** (Float32 / Float64)
- **Codage du texte** : ASCII, Latin-1, UTF-8
- Unités : ko / Kio, Mo / Mio…
- **Fichier texte** ou **fichier binaire** ?

---

## Qu'est-ce qu'un format ?

- **Format de données** : manière d'encoder l'information pour qu'un logiciel puisse l'exploiter
- **Format d'échange** : format compris par plusieurs systèmes
- **Format ouvert** : spécification publique
- **Format fermé / propriétaire** : spécification secrète ou contrôlée par un éditeur
- Pour comparer les formats, il faut comprendre comment l'ordinateur code l'information

---

## 🧵 Fil rouge : Yverdon en 0 et 1

| Information | Stockée comme |
|---|---|
| Pixel (toit de voiture) R 204, V 211, B 230 | `CC D3 E6` (3 octets) |
| Altitude 433,17 m | `C3 95 D8 43` (Float32) |
| Coordonnée E 2'538'500,12 | `F6 28 5C 0F 02 5E 43 41` (Float64) |
| Arrêt « Faïencerie » | 11 octets en UTF-8 |
| Tuile SWISSIMAGE | 65'004'150 octets |

Un fichier = une suite d'**octets** · un **format** = la convention pour les lire

---

<!-- _class: lead -->

# Décimal et binaire

---

## Pourquoi la base 2 ?

- Nous comptons en base 10… parce que nous avons 10 doigts
- L'ordinateur ne connaît que **deux états** :
  - courant / pas de courant
  - allumé / éteint, vrai / faux
  - **1 / 0**
- Deux états = facile à produire, stocker et lire de manière fiable

---

## Représentation positionnelle

- Base 10 : symboles 0 à 9, chaque position = une puissance de 10
- Le 3 de **1934** vaut 30, celui de **3008** vaut 3'000

**Forme canonique** de 3'528 :

3'528 = 3·10³ + 5·10² + 2·10¹ + 8·10⁰

- Base 2 : même principe, mais seulement **0 et 1** et des puissances de 2

---

## Le bit

- **bit** = *binary digit* = 0 ou 1 (noté **b**)
- Plus petite unité d'information

| Bits | Valeurs possibles |
|---|---|
| 1 | 2 |
| 2 | 4 |
| 3 | 8 |
| *n* | **2ⁿ** |

---

## L'octet

- **Octet** (o) = *byte* (B) = **8 bits**
- 2⁸ = **256** valeurs : de `00000000` = 0 à `11111111` = **255**
- 1 octet ≈ 1 caractère ASCII, 1 pixel en niveaux de gris
- 2 octets → 65'536 valeurs ; 4 octets → ~4,3 milliards
- ⚠️ **b** = bit, **B** = byte : 100 Mb/s = 12,5 Mo/s

---

<!-- _class: lead -->

# Conversions

---

## Binaire → décimal

Somme des puissances de 2 là où il y a un 1 :

10101₍₂₎ = 1·2⁴ + 0·2³ + 1·2² + 0·2¹ + 1·2⁰ = 16 + 4 + 1 = **21**

| 2⁷ | 2⁶ | 2⁵ | 2⁴ | 2³ | 2² | 2¹ | 2⁰ | |
|---|---|---|---|---|---|---|---|---|
| 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 | |
| 0 | 0 | 1 | 0 | 1 | 0 | 1 | 0 | **= 42** |

Le bit de poids faible (2⁰) est **à droite**

---

## Décimal → binaire

Divisions successives par 2, lecture des restes **de bas en haut**

| 156 | 78 | 39 | 19 | 9 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|---|
| reste 0 | 0 | 1 | 1 | 1 | 0 | 0 | 1 |

156₍₁₀₎ = **10011100₍₂₎** (128 + 16 + 8 + 4)

---

## À vous !

1. 11001000₍₂₎ = ? en décimal
2. 77₍₁₀₎ = ? en binaire sur 8 bits
3. Combien de bits pour coder 26 lettres ?

<!-- Réponses : 200 ; 01001101 ; 5 bits -->

▶ [Exercices à volonté, corrigés pas à pas](https://regislon.github.io/cfgeo_B4/formats-interfaces/01-codage-binaire/#entrainez-vous)

---

## L'hexadécimal (base 16)

- 16 symboles : **0–9 puis A–F** (A = 10 … F = 15)
- **1 chiffre hexa = 4 bits** → **1 octet = 2 chiffres** (`00` à `FF`)

| | Rouge | Vert | Bleu |
|---|---|---|---|
| Décimal | 204 | 211 | 230 |
| Binaire | 1100 1100 | 1101 0011 | 1110 0110 |
| Hexa | **CC** | **D3** | **E6** |

→ couleur **`#CCD3E6`** · aussi : couleurs KML, WKB, éditeurs hexadécimaux

---

## Entiers signés

| Type | Octets | Plage |
|---|---|---|
| UInt8 | 1 | 0 à 255 |
| Int8 | 1 | −128 à 127 |
| UInt16 | 2 | 0 à 65'535 |
| Int16 | 2 | −32'768 à 32'767 |
| Int32 | 4 | ± 2,1 milliards |

Mêmes noms dans les rasters et les tables attributaires

---

## Nombres à virgule (IEEE 754)

- Signe + **mantisse** (chiffres) + **exposant** (position de la virgule)
- **Float32** : 4 octets, ~**7** chiffres · **Float64** : 8 octets, ~**15–16** chiffres
- Nombre de chiffres **fixe** : plus il y en a avant la virgule, moins il en reste après → l'espacement **double** quand le nombre double

| 🧵 Valeur | En Float32 | Pas |
|---|---|---|
| Altitude 433,17 | 433,170013 | 0,03 mm ✅ |
| E 2'538'500,12 | 2'538'500,000 | **25 cm** ❌ |

→ coordonnées MN95 en **Float64** (Shapefile, GeoPackage, PostGIS)

---

<!-- _class: lead -->

# Unités informatiques

---

## Deux familles de préfixes

| SI (décimal) | Valeur | CEI (binaire) | Valeur |
|---|---|---|---|
| ko | 1'000 o | **Kio** | 1'024 o |
| Mo | 10⁶ o | **Mio** | 2²⁰ = 1'048'576 o |
| Go | 10⁹ o | **Gio** | 2³⁰ o |
| To | 10¹² o | **Tio** | 2⁴⁰ o |

- Préfixes binaires (kibi, mébi, gibi…) normalisés par la CEI depuis 1998

---

## Dans la pratique

- Fabricants de disques : préfixes **décimaux** (1 To = 10¹² o)
- Windows : calcule en 2¹⁰ mais affiche « Go »
  → le disque de 1 To apparaît comme **931 Go** (en fait 931 Gio)
- Écart : 2,4 % (kilo) · 7,4 % (giga) · 10 % (téra)
- Image 4'000 × 3'000 px × 3 octets = **36 Mo ≈ 34,3 Mio**

---

<!-- _class: lead -->

# Le codage du texte

---

## ASCII, Latin-1, UTF-8

- **ASCII** : 128 caractères, **pas d'accents** · `A` = `41`
- **Latin-1 / Windows-1252** : 256 caractères, accents d'Europe occidentale · 1 octet
- **Unicode / UTF-8** : toutes les écritures · 1 à 4 octets · standard du web, XML, JSON

| 🧵 « Faïencerie » | Octets du « ï » | Total |
|---|---|---|
| ASCII | impossible | — |
| Latin-1 | `EF` | 10 octets |
| UTF-8 | `C3 AF` | 11 octets |

---

## Le problème d'encodage

UTF-8 lu comme du Latin-1 :

- « Faïencerie » → **« FaÃ¯encerie »**
- « Genève » → **« GenÃ¨ve »**

Causes typiques : `.cpg` oublié (Shapefile), `encoding` absent (XML), mauvais choix à l'import d'un CSV

▶ [Démo : inspecteur de texte](https://regislon.github.io/cfgeo_B4/formats-interfaces/01-codage-binaire/#le-codage-du-texte)

---

<!-- _class: lead -->

# Fichiers texte et fichiers binaires

---

## Fichier texte : des caractères

```text
  0          ← code 0 : nouvelle entité
POINT
 10          ← code 10 : coordonnée X
2538235      ← 7 caractères = 7 octets
 20
1180434
```

- 🧵 Un arrêt de bus dans un **DXF**
- **Lisible** dans un éditeur… mais seul le logiciel **comprend** les codes
- Codage déclaré : `ANSI_1252` (DXF 2004) · **UTF-8** depuis DXF 2007

---

## Fichier binaire : des nombres

```text
00 00 27 0A ...       → 9'994 : « je suis un shapefile »
05 00 00 00           → 5 = polygone
70 34 80 D7 3D 5D 43 41 → X min = 2'538'107,68 (Float64)
```

- 🧵 En-tête de `batiments.shp`
- Éditeur de texte : `··'···Îžè···p4€×=]CA u·šr·2AX±¿Œ` 🤯
- Le fichier n'est **pas abîmé** : QGIS connaît la **spécification**

▶ [Démo : un fichier, trois vues](https://regislon.github.io/cfgeo_B4/formats-interfaces/01-codage-binaire/#fichiers-texte-et-fichiers-binaires)

---

## Texte ou binaire ?

| | Texte | Binaire |
|---|---|---|
| Éditeur de texte | ✅ lisible | ❌ symboles |
| Taille / vitesse | plus gros, plus lent | compact, rapide |
| Risque | **encodage** | il faut la **spécification** |
| Exemples | DXF, CSV, GeoJSON, KML, XTF | SHP, GPKG, GeoTIFF, Parquet |

---

## ❓ Testez-vous

7 questions : octets, hexadécimal, UTF-8, « GenÃ¨ve », Float32, fichier .shp « illisible », disque de 931 Go

▶ [Faire le quiz sur le site](https://regislon.github.io/cfgeo_B4/formats-interfaces/01-codage-binaire/#testez-vous)

---

## À retenir

- L'ordinateur code tout avec des **0 et des 1**
- *n* bits → **2ⁿ** valeurs ; 1 octet = 8 bits = 256 valeurs (0–255)
- Binaire ↔ décimal : somme des puissances de 2 / divisions par 2
- **ko = 1'000 o**, **Kio = 1'024 o** : préciser l'unité !
- **Hexa** : 1 octet = 2 chiffres (`CC`) · coordonnées en **Float64**
- Texte : **UTF-8** ; « GenÃ¨ve » = mauvais encodage
- Fichier **texte** = caractères · fichier **binaire** = nombres, lisible grâce à la **spécification**
- Un format = une convention pour coder l'information en binaire
