---
marp: true
theme: cfgeo
paginate: true
footer: CFGéo B4 · Formats, interfaces · 2. Données raster
---

<!-- _class: lead -->
<!-- _paginate: false -->

# 2. Données raster

Module B4 « Géomatique & TI » — Formats, interfaces

---

## Objectifs

- Décrire la structure d'une image raster (pixel, résolution, bandes)
- Expliquer le géoréférencement (world file, GeoTIFF)
- Calculer la taille d'un fichier raster
- Distinguer format et algorithme de compression
- Choisir un format raster adapté à un usage

---

## Raster ou vecteur ?

| | Raster | Vecteur |
|---|---|---|
| Principe | Grille régulière de **pixels** | Points, lignes, polygones |
| Une forêt | Pixels « forêt » | Polygone + attribut |
| Exemples | Orthophoto, MNT, satellite | Mensuration officielle, routes |

- Raster : idéal pour les **phénomènes continus**, couverture complète

---

<!-- _class: lead -->

# Pixel et résolution

---

## Une image = un tableau de nombres

![w:800](img/pixels-niveaux-de-gris.png)

- 1 pixel = **1 valeur** par bande : couleur, classe ou mesure (altitude)
- Niveaux de gris : 0 (noir) à 255 (blanc) = 1 octet

---

## Bandes et types de données

- **Bandes** : 1 (gris, MNT), 3 (RVB), 4 (RVB + infrarouge), 13 (Sentinel‑2)
- **Type** de valeur :
  - Byte : 0–255 (photos)
  - UInt16 / Int16 : 2 octets (satellite)
  - Float32 : 4 octets (MNT en mètres)
- **NoData** : valeur conventionnelle pour « pas d'information » (ex. −9999)

---

## Résolution géographique

= **taille du pixel sur le terrain**

| Produit | Résolution |
|---|---|
| SWISSIMAGE | 10 cm |
| swissALTI3D | 0,5 m / 2 m |
| Sentinel‑2 | 10 m |
| Landsat | 30 m |

Carte 1:25'000 scannée à 400 dpi → pixel ≈ 1,6 m

---

## Résolution ≠ plus petit objet visible

- Un objet doit couvrir **plusieurs pixels** pour être reconnu
- À 5 m de résolution, une voiture n'est qu'une tache
- Pixel 2 × plus fin → **4 × plus** de pixels
- Suisse à 10 cm ≈ 4 · 10¹² pixels ≈ **12 To** en RVB non compressé

---

## Affinage panchromatique

![h:420](img/pansharpening.png)

Image couleur basse résolution + image panchromatique fine → couleur fine

*Source : ArcGIS [6]*

---

<!-- _class: lead -->

# Géoréférencement

---

## Du pixel au terrain

![h:380](img/georeferencement.jpg)

- Image : **lignes / colonnes** → terrain : **MN95 (EPSG:2056)**
- Transformation affine à **6 paramètres**

---

## Le world file (`.tfw`, `.jgw`, `.pgw`)

```text
0.1          A : taille du pixel en X
0.0          D : rotation
0.0          B : rotation
-0.1         E : taille du pixel en Y (négative !)
2540000.05   C : X du centre du pixel en haut à gauche
1150999.95   F : Y du centre du pixel en haut à gauche
```

- Tuile SWISSIMAGE 10 cm, km 2540-1150
- ⚠️ **Aucune indication du système de coordonnées**

---

## GeoTIFF

- Géoréférencement **et** système de coordonnées (EPSG) **dans** le fichier
- Un seul fichier, pas d'ambiguïté
- Non lisible avec un éditeur de texte → SIG ou `gdalinfo`
- Standard OGC, format de référence pour l'échange de rasters

---

<!-- _class: lead -->

# Codage de la couleur

---

## Profondeur de codage

| Bits / pixel | Valeurs | Usage |
|---|---|---|
| 1 | 2 | Noir / blanc |
| 4 | 16 | 16 gris ou couleurs |
| 8 | 256 | Gris ou palette |
| 24 | 16,7 millions | Couleurs vraies RVB |
| 32 | RVB + alpha | Transparence |

![h:160](img/16-niveaux-de-gris.gif) ![h:160](img/256-niveaux-de-gris.jpg)

---

## Palette ou couleurs vraies

- **Couleurs indexées** : chaque pixel = un indice dans une palette (≤ 256 couleurs)
- **Couleurs vraies** : 3 octets R, V, B par pixel — synthèse additive

![h:300](img/synthese-additive-rvb.png) ![h:300](img/separation-canaux-rvb.jpg)

*Sources : Wikimedia Commons [7] [8]*

---

<!-- _class: lead -->

# Compression

---

## Format ≠ compression

- **Format** : organisation du fichier (en-tête, métadonnées, données)
- **Compression** : algorithme qui réduit la taille des données
- Un TIFF peut être : non compressé, LZW, Deflate… ou **JPEG** !

---

## Ratio et taux

- **Ratio** = taille originale / taille compressée → **4:1**
- **Taux** = taille compressée / taille originale → **25 %**
- **Gain** = 1 − taux → 75 %
- 2 Mo compressés à 4:1 → 0,5 Mo
- Les définitions varient : toujours **indiquer sa formule**

---

## Avec ou sans perte

![w:520](img/compression-sans-perte.png)
![w:520](img/compression-avec-perte.png)

- **Sans perte** : image restaurée identique (≈ 2:1)
- **Avec perte** : ratios élevés, information perdue
- Plan A0 **roulé** (sans perte) ou **plié** (avec perte)

---

## Exemple : la marguerite

![bg right:35% w:300](img/marguerite-originale.png)

- 300 × 300 = 90'000 pixels × 3 octets = 270'000 o ≈ **264 Kio**
- **256 couleurs** : 1 octet/pixel → 88 Kio (avec perte)
- **Palette adaptative** : sans perte si peu de couleurs
- **Répétition** : 4'500 pixels de fond = compteur (2 octets) + couleur (1 octet) = **3 octets**
- ⚠️ Un compteur d'1 octet ne dépasse pas **255**

---

## RLE — *Run Length Encoding*

- Nombre de répétitions + valeur
- `AAAAAABBBBBCCCC` → `6A5B4C`
- Sans perte, efficace sur les grandes plages uniformes
- ⚠️ Échiquier : 64 octets → **128** octets en RLE !
- Utilisé dans BMP, TGA, TIFF (PackBits), JPEG

---

## Compression par dictionnaire

- **LZW** : dictionnaire des séquences déjà vues → TIFF, GIF
  - brevet Unisys, libre depuis le début des années 2000
- **Deflate** = LZ77 + codage de Huffman → **ZIP**, KMZ, **PNG**, TIFF
- Sans perte
- Données répétitives → bonne compression ; aléatoires → presque rien

---

<!-- _class: exercice -->

# Exercice : Compression par dictionnaire

[Consignes et données](https://regislon.github.io/cfgeo_B4/formats-interfaces/exercices/ex02-compression-dictionnaire/)


---

## JPEG

1. RVB → luminance + chrominance
2. Sous-échantillonnage de la chrominance
3. Blocs 8 × 8 → fréquences (DCT)
4. **Quantification** (perte, selon la qualité)
5. Zigzag + RLE + Huffman

- Ratio 10:1 à 25:1 sur les photos ; artefacts sur plans et textes
- ⚠️ Les pertes **s'accumulent** à chaque ré-enregistrement

---

## Ondelettes

- Analogie : pyramide en **grosses briques** + petites briques pour les détails
- Décomposition multi-résolution de l'image
- Excellente qualité **et** ratio élevé
- Formats **JPEG 2000** (norme ISO) et **ECW** (propriétaire)
- Orthophoto du canton de Neuchâtel (~20 milliards de pixels) sur un DVD

---

<!-- _class: exercice -->

# Exercice : Formats d'images et compression

[Consignes et données](https://regislon.github.io/cfgeo_B4/formats-interfaces/exercices/ex01-images-compression/)


---

## Métadonnées

- Capteur, date, position, orientation, résolution…
- **EXIF** : enregistré dans le JPEG/TIFF par l'appareil photo, le smartphone, le drone
- ⚠️ Coordonnées GPS dans les photos publiées !
- Jeux de géodonnées : ISO 19115, catalogue **geocat.ch**

---

<!-- _class: lead -->

# Formats raster

---

## Formats d'image courants

- **BMP** : simple, peu ou pas compressé, volumineux
- **GIF** : 256 couleurs, LZW, animation
- **PNG** : sans perte (Deflate), transparence → cartes, tuiles web
- **JPEG** : avec perte → photos
- **TIFF** : balises, multi-bandes, toutes compressions, BigTIFF > 4 Gio
- **GeoTIFF** : TIFF + géoréférencement + SCR

---

## Cloud Optimized GeoTIFF (COG)

- Un GeoTIFF **tuilé** avec **aperçus** (*overviews*)
- Lecture **partielle** par HTTP : seulement la zone et le zoom utiles
- Lisible par tout logiciel qui lit le GeoTIFF
- Standard OGC (2023), diffusion dans le cloud (data.geo.admin.ch)

---

## Grilles et cubes de données

- **ASCII Grid** (`.asc`) : MNT en texte, lisible, volumineux
- **NetCDF** : données **multidimensionnelles** (x, y, z, temps), météo, climat
- **Zarr** : cubes découpés en blocs, pensé pour le cloud

![w:520](img/netcdf-multidimensionnel.png)

---

## Quel format choisir ?

| Besoin | Format |
|---|---|
| Échange orthophoto / MNT | GeoTIFF (LZW, Deflate) |
| Diffusion web / cloud | COG |
| Grande mosaïque compacte | JPEG 2000, ECW |
| Photo pour affichage | JPEG |
| Plan, carte, transparence | PNG |
| Climat, météo | NetCDF, Zarr |

---

## À retenir

- Raster = grille de pixels, **1 valeur par pixel et par bande**
- Résolution = taille du pixel au sol ; taille du fichier ∝ résolution²
- World file : 6 paramètres **sans SCR** ; GeoTIFF : SCR inclus
- **Format ≠ compression** ; avec perte (JPEG, ondelettes) / sans perte (RLE, LZW, Deflate)
- Données à analyser → compression **sans perte**
- GeoTIFF / COG = choix par défaut en géomatique
