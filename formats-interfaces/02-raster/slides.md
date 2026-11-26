---
marp: true
theme: cfgeo
paginate: true
footer: CFGéo B4 · Formats, interfaces · 2. Données raster
---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Lire le chapitre](./)' -->
<!-- _class: lead -->
<!-- _paginate: false -->

# 2. Données raster

Module B4 « Géomatique & TI » — Formats, interfaces

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Objectifs](./#objectifs)' -->
## Objectifs

- Décrire la structure d'une image raster (pixel, résolution, bandes)
- Distinguer les **4 résolutions** : spatiale, spectrale, radiométrique, temporelle
- Choisir un **type de données**, gérer **NoData**
- Comprendre une image **multispectrale** et le **NDVI**
- Expliquer le géoréférencement (world file, GeoTIFF)
- Calculer la taille d'un fichier raster
- Distinguer format et algorithme de compression
- Choisir un format raster adapté à un usage

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Raster ou vecteur ?](./#raster-ou-vecteur)' -->
## Raster ou vecteur ?

| | Raster | Vecteur |
|---|---|---|
| Principe | Grille régulière de **pixels** | Points, lignes, polygones |
| Une forêt | Pixels « forêt » | Polygone + attribut |
| Exemples | Orthophoto, MNT, satellite | Mensuration officielle, routes |

- Raster : idéal pour les **phénomènes continus**, couverture complète

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Fil rouge : un kilomètre carré à Yverdon-les-Bains](./#fil-rouge-un-kilometre-carre-a-yverdon-les-bains)' -->
## 🧵 Fil rouge : 1 km² à Yverdon (tuile 2538-1180)

| | SWISSIMAGE | swissALTI3D | Sentinel‑2 |
|---|---|---|---|
| Contenu | Orthophoto | MNT | Satellite multispectral |
| Pixel | 0,10 m | 0,50 m | 10 m |
| Bandes | 3 (RVB) | 1 (altitude) | 13 |
| Type | Byte | Float32 | UInt16 |
| Fichier | 65 Mo | 15,5 Mo | mosaïque CH |

Données ouvertes swisstopo : **data.geo.admin.ch**

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Fil rouge : un kilomètre carré à Yverdon-les-Bains](./#fil-rouge-un-kilometre-carre-a-yverdon-les-bains)' -->
## 🧵 Même territoire, autres pixels

![w:440](img/fil-rouge-swissimage.jpg) ![w:440](img/fil-rouge-swissalti3d-relief.jpg)

Une **couleur**… ou une **altitude** · *© swisstopo*

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Fil rouge : un kilomètre carré à Yverdon-les-Bains](./#fil-rouge-un-kilometre-carre-a-yverdon-les-bains)' -->
## Sans installation : GeoLibre

- SIG libre **dans le navigateur** : `web.geolibre.app`
- *Add Data › Raster Layer* → coller l'URL du COG → *Load*
- *Inspect pixel values* : valeur d'un pixel (433,17 m)
- Lit COG, GeoParquet, GeoPackage, WMS, WMTS, STAC…

⚠️ Affichage en **Web Mercator**, coordonnées **jamais en MN95**
→ QGIS / GDAL restent la référence pour le travail précis

⚠️ À ouvrir dans **Chrome** (pas Firefox)

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Valeur du pixel et résolution](./#valeur-du-pixel-et-resolution)' -->
<!-- _class: lead -->

# Pixel et résolution

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 La valeur du pixel](./#la-valeur-du-pixel)' -->
## Une image = un tableau de nombres

![w:800](img/pixels-niveaux-de-gris.png)

- 1 pixel = **1 valeur** par bande : couleur, classe ou mesure (altitude)
- Niveaux de gris : 0 (noir) à 255 (blanc) = 1 octet

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Bandes et types de données](./#bandes-et-types-de-donnees)' -->
## Bandes et types de données

- **Bandes** : 1 (gris, MNT), 3 (RVB), 4 (RVB + infrarouge), 13 (Sentinel‑2)
- **Type** = ce qu'on peut stocker **et** la taille du fichier

| Type | Octets | Fil rouge |
|---|---|---|
| Byte (0–255) | 1 | SWISSIMAGE : couleurs |
| UInt16 (0–65'535) | 2 | Sentinel‑2 : mesures sur 12 bits |
| Float32 | 4 | swissALTI3D : 432,77 m |

⚠️ MNT en Byte → écrêté à 255 · décimales en entier → perdues

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Bandes et types de données](./#bandes-et-types-de-donnees)' -->
## Mise à l'échelle et NoData

`valeur réelle = valeur stockée × échelle + décalage`

- Sentinel‑2 (swissEO) : échelle 0,0001, décalage −0,1
- 3'500 → 3'500 × 0,0001 − 0,1 = **0,25** de réflectance

**NoData** = « pas d'information », **déclaré** dans le fichier

- swissALTI3D : −9999 · Sentinel‑2 : 0
- ⚠️ Non déclaré → moyenne fausse, « falaise » de 10 km sur la pente

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Les quatre résolutions d’un capteur](./#les-quatre-resolutions-dun-capteur)' -->
## Les 4 résolutions d'un capteur

| Résolution | Question | 🧵 SWISSIMAGE | 🧵 Sentinel‑2 |
|---|---|---|---|
| **Spatiale** | Taille du pixel ? | 0,10 m | 10 m |
| **Spectrale** | Quelles bandes ? | 3 visibles | 13, jusqu'à l'infrarouge |
| **Radiométrique** | Combien de niveaux ? | 8 bits | 12 bits |
| **Temporelle** | Tous les combien ? | ~3 ans | 3 à 5 jours |

→ Toujours un **compromis** : aucun capteur n'est « le meilleur »

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Les quatre résolutions d’un capteur](./#les-quatre-resolutions-dun-capteur)' -->
## Résolution spatiale

= **taille du pixel sur le terrain** (GSD)

| Produit | Résolution |
|---|---|
| SWISSIMAGE | 10 cm |
| swissALTI3D | 0,5 m / 2 m |
| Sentinel‑2 | 10 m |
| Landsat | 30 m |

Carte 1:25'000 scannée à 400 dpi → pixel ≈ 1,6 m

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Plus petit objet visible](./#plus-petit-objet-visible)' -->
## Résolution ≠ plus petit objet visible

![w:740](img/fil-rouge-swissimage-zoom-pixels.jpg)

- Un objet doit couvrir **plusieurs pixels** : à 10 cm, une voiture ≈ 18 × 45 pixels
- À 10 m (Sentinel‑2), elle est **invisible**

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Résolution et taille de fichier](./#resolution-et-taille-de-fichier)' -->
<!-- _class: demo -->
## Combien pèse un raster ?

`colonnes × lignes × bandes × octets par valeur`

| 🧵 1 km² | Brut | Fichier |
|---|---|---|
| SWISSIMAGE : 10'000² × 3 × 1 | 300 Mo | 65 Mo (JPEG) |
| swissALTI3D : 2'000² × 1 × 4 | 16 Mo | 15,5 Mo (LZW) |

- Pixel 2 × plus fin → **4 × plus** de pixels
- Suisse à 10 cm ≈ **12 To** en RVB non compressé

<a class="go" href="https://regislon.github.io/cfgeo_B4/formats-interfaces/02-raster/#resolution-et-taille-de-fichier"><small>Démo sur la page du cours ↗</small>▶ Calculateur de taille d'un raster</a>

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 L’affinage panchromatique (pan-sharpening)](./#laffinage-panchromatique-pan-sharpening)' -->
## Affinage panchromatique

![h:360](img/pansharpening.png)

Image couleur basse résolution + image panchromatique fine → couleur fine

*Source : ArcGIS [6]*

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Géoréférencement (world file, GeoTIFF)](./#georeferencement-world-file-geotiff)' -->
<!-- _class: lead -->

# Géoréférencement

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Géoréférencement (world file, GeoTIFF)](./#georeferencement-world-file-geotiff)' -->
## Du pixel au terrain

![h:380](img/georeferencement.jpg)

- Image : **lignes / colonnes** → terrain : **MN95 (EPSG:2056)**
- Transformation affine à **6 paramètres**

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Le world file](./#le-world-file)' -->
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

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 GeoTIFF](./#geotiff)' -->
## GeoTIFF

- Géoréférencement **et** système de coordonnées (EPSG) **dans** le fichier
- Un seul fichier, pas d'ambiguïté
- Non lisible avec un éditeur de texte → SIG ou `gdalinfo`
- Standard OGC, format de référence pour l'échange de rasters

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Codage de la couleur](./#codage-de-la-couleur)' -->
<!-- _class: lead -->

# Codage de la couleur

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Codage de la couleur](./#codage-de-la-couleur)' -->
<!-- _class: demo -->
## Profondeur de codage

| Bits / pixel | Valeurs | Usage |
|---|---|---|
| 1 | 2 | Noir / blanc |
| 4 | 16 | 16 gris ou couleurs |
| 8 | 256 | Gris ou palette |
| 24 | 16,7 millions | Couleurs vraies RVB |
| 32 | RVB + alpha | Transparence |

![h:90](img/16-niveaux-de-gris.gif) ![h:90](img/256-niveaux-de-gris.jpg)
<a class="go" href="https://regislon.github.io/cfgeo_B4/formats-interfaces/02-raster/#codage-de-la-couleur"><small>Démo sur la page du cours ↗</small>▶ Pixels et profondeur</a>

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Couleurs indexées (palette)](./#couleurs-indexees-palette)' -->
## Palette ou couleurs vraies

- **Couleurs indexées** : chaque pixel = un indice dans une palette (≤ 256 couleurs)
- **Couleurs vraies** : 3 octets R, V, B par pixel — synthèse additive

![h:300](img/synthese-additive-rvb.png) ![h:300](img/separation-canaux-rvb.jpg)

*Sources : Wikimedia Commons [7] [8]*

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Au-delà du visible : images multispectrales](./#au-dela-du-visible-images-multispectrales)' -->
<!-- _class: lead -->

# Au-delà du visible

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Au-delà du visible : images multispectrales](./#au-dela-du-visible-images-multispectrales)' -->
## Le spectre électromagnétique

![w:1140](img/spectre-electromagnetique.svg)

L'œil : **400 à 700 nm** · Sentinel‑2 : du visible à l'**infrarouge moyen** · radar : micro-ondes

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Au-delà du visible : images multispectrales](./#au-dela-du-visible-images-multispectrales)' -->
## Un raster est une **mesure**

- Chaque bande = **réflectance** (0 à 1) dans une plage de longueurs d'onde

| Bande Sentinel‑2 | Domaine | Pixel |
|---|---|---|
| B02 · B03 · B04 | Bleu · Vert · Rouge | 10 m |
| B08 | **Proche infrarouge** (842 nm) | 10 m |
| B11 · B12 | Infrarouge moyen | 20 m |

- Écran = 3 canaux → on **choisit 3 bandes** : composition colorée

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Composition colorée](./#composition-coloree)' -->
## Vraies et fausses couleurs

![w:420](img/sentinel2-vraies-couleurs.jpg) ![w:420](img/sentinel2-fausses-couleurs.jpg)

R‑V‑B = B04‑B03‑B02 · R‑V‑B = **B08**‑B04‑B03 → végétation en **rouge**

*🧵 Yverdon, 12.07.2025 · swissEO S2‑SR © swisstopo, Copernicus*

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 L’indice de végétation (NDVI)](./#lindice-de-vegetation-ndvi)' -->
## NDVI : indice de végétation

`NDVI = (PIR − Rouge) / (PIR + Rouge)` → entre −1 et +1

- Plante saine : absorbe le **rouge**, réfléchit le **proche infrarouge**
- < 0 eau · 0–0,2 sol nu, bâti · > 0,5 végétation dense

🧵 Maïs : B04 = 1'500, B08 = 5'200
→ Rouge 0,05 · PIR 0,42 → **NDVI = 0,79**
⚠️ Sans échelle/décalage : 0,55 (faux !)

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 L’indice de végétation (NDVI)](./#lindice-de-vegetation-ndvi)' -->
## NDVI : le résultat

![bg right:45% fit](img/sentinel2-ndvi.jpg)

![w:520](img/ndvi-legende.png)

- Forêt, cultures : vert foncé
- Ville, champs récoltés : beige
- Raster **calculé** → Float32
- QGIS : *Calculatrice raster*

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 D’autres indices spectraux](./#dautres-indices-spectraux)' -->
<style scoped>
table { font-size: 21px; }
th, td { padding: 3px 10px !important; }
</style>
## D'autres indices spectraux

Même recette : **(A − B) / (A + B)** entre deux bandes, de −1 à +1

| Indice | Formule (Sentinel‑2) | Fait ressortir |
|---|---|---|
| **NDVI** | (B8 − B4) / (B8 + B4) | végétation |
| **GNDVI** | (B8 − B3) / (B8 + B3) | chlorophylle |
| **EVI** | 2,5 (B8 − B4) / (B8 + 6 B4 − 7,5 B2 + 1) | végétation dense |
| **SAVI** | 1,5 (B8 − B4) / (B8 + B4 + 0,5) | végétation clairsemée |
| **NDWI** · **MNDWI** | (B3 − B8) / (B3 + B8) · (B3 − B11) / (B3 + B11) | eau |
| **NDMI** | (B8 − B11) / (B8 + B11) | humidité des plantes |
| **NDBI** | (B11 − B8) / (B11 + B8) | bâti, sol nu |
| **NBR** | (B8 − B12) / (B8 + B12) | surfaces brûlées |

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 D’autres indices spectraux](./#dautres-indices-spectraux)' -->
<!-- _class: demo -->
## ▶ À vous : explorer les indices

<div class="todo">

1. Comparez **NDVI**, **NDWI** et **NDBI** : où sont l'eau, la ville, les cultures ?
2. Zoomez jusqu'aux **pixels de 10 m**, puis affichez le **MNDWI** : pixels de **20 m** (bande B11)
3. Cliquez sur un pixel : réflectances et valeur de l'indice
4. **Formule libre** : `B8 / B4`, puis votre propre indice

</div>

<a class="go" href="https://regislon.github.io/cfgeo_B4/formats-interfaces/02-raster/#demo-indices"><small>Démo sur la page du cours ↗</small>▶ Indices spectraux Sentinel‑2</a>

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Compression](./#compression)' -->
<!-- _class: lead -->

# Compression

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Compression](./#compression)' -->
## Format ≠ compression

- **Format** : organisation du fichier (en-tête, métadonnées, données)
- **Compression** : algorithme qui réduit la taille des données
- Un TIFF peut être : non compressé, LZW, Deflate… ou **JPEG** !

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Ratio et taux de compression](./#ratio-et-taux-de-compression)' -->
## Ratio et taux

- **Ratio** = taille originale / taille compressée → **4:1**
- **Taux** = taille compressée / taille originale → **25 %**
- **Gain** = 1 − taux → 75 %
- 2 Mo compressés à 4:1 → 0,5 Mo
- Les définitions varient : toujours **indiquer sa formule**

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Compression avec ou sans perte](./#compression-avec-ou-sans-perte)' -->
## Avec ou sans perte

![w:520](img/compression-sans-perte.png)
![w:520](img/compression-avec-perte.png)

- **Sans perte** : image restaurée identique (≈ 2:1)
- **Avec perte** : ratios élevés, information perdue
- Plan A0 **roulé** (sans perte) ou **plié** (avec perte)

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Quelques algorithmes de compression](./#quelques-algorithmes-de-compression)' -->
<style scoped>
table { font-size: 22px; }
th, td { padding: 4px 12px !important; }
</style>
## Quelques compressions

| Compression | Perte | Bon usage |
|---|---|---|
| **LZW** · **Deflate** | sans | les plus **compatibles** |
| **ZSTD** | sans | comme Deflate, plus rapide |
| **JPEG** | avec | photos, orthophotos |
| **WebP** | avec ou sans | successeur du JPEG |
| **JPEG 2000**, **ECW** | avec ou sans | grandes mosaïques |
| **LERC** | erreur max. fixée | MNT |

Pas besoin de savoir **comment** elles fonctionnent
⚠️ **Tous les logiciels ne les lisent pas toutes** → échange : **LZW** ou **Deflate**

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Exercices](./#exercices)' -->
<!-- _class: exercice -->

# Exercice : Compression par dictionnaire

[Consignes et données](https://regislon.github.io/cfgeo_B4/formats-interfaces/exercices/ex02-compression-dictionnaire/)

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 JPEG](./#jpeg)' -->
<!-- _class: demo -->
## JPEG

- **Avec perte**, pour les photos : blocs de **8 × 8 pixels** dont on supprime des détails
- Orthophoto : **10:1 à 25:1** · artefacts sur plans et textes
- **Qualité** = quantité de détails supprimés
  basse → petit fichier, blocs visibles, couleurs perdues · 75–90 : bon compromis
- ⚠️ Les pertes **s'accumulent** à chaque ré-enregistrement

<a class="go" href="https://regislon.github.io/cfgeo_B4/formats-interfaces/02-raster/#jpeg"><small>Démo sur la page du cours ↗</small>▶ Qualité JPEG / WebP</a>

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Compressions modernes dans GeoTIFF](./#compressions-modernes-dans-geotiff)' -->
## 🧵 swissALTI3D compressé (1 km², Float32, 16 Mo)

| Compression | Taille | Ratio | Erreur max. |
|---|---|---|---|
| LZW (fichier swisstopo) | 11,8 Mo | 1,4:1 | 0 |
| Deflate + prédicteur | 6,9 Mo | 2,3:1 | 0 |
| ZSTD + prédicteur | 6,7 Mo | 2,4:1 | 0 |
| **LERC + ZSTD, 1 cm** | **2,1 Mo** | **7,8:1** | 1 cm |

SWISSIMAGE : sans perte ≈ 2:1 · JPEG ou WebP → 15 à 18:1

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Exercices](./#exercices)' -->
<!-- _class: exercice -->

# Exercice : Formats d'images et compression

[Consignes et données](https://regislon.github.io/cfgeo_B4/formats-interfaces/exercices/ex01-images-compression/)


---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Séries temporelles et cubes de données](./#series-temporelles-et-cubes-de-donnees)' -->
## Séries temporelles et cubes de données

![w:1000](img/sentinel2-ndvi-saisons.jpg)

- Cube = **X, Y, bande, temps** : chaque pixel devient une courbe
- Volumes énormes → on calcule **là où sont les données** : COG + **STAC**, Zarr, openEO, Swiss Data Cube

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Métadonnées](./#metadonnees)' -->
## Métadonnées

- Capteur, date, position, orientation, résolution…
- **EXIF** : enregistré dans le JPEG/TIFF par l'appareil photo, le smartphone, le drone
- ⚠️ Coordonnées GPS dans les photos publiées !
- Jeux de géodonnées : ISO 19115, catalogue **geocat.ch**

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Formats raster](./#formats-raster)' -->
<!-- _class: lead -->

# Formats raster

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Formats d’image courants](./#formats-dimage-courants)' -->
## Formats d'image courants

- **BMP** : historique, non compressé, volumineux
- **GIF** : 256 couleurs, LZW, animation
- **PNG** : sans perte (Deflate), transparence → cartes, tuiles web
- **JPEG** : avec perte → photos
- **WebP, AVIF, JPEG XL** : successeurs de JPEG/PNG sur le web
- **TIFF** : balises, multi-bandes, toutes compressions, BigTIFF > 4 Gio
- **GeoTIFF** : TIFF + géoréférencement + SCR

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Cloud Optimized GeoTIFF (COG)](./#cloud-optimized-geotiff-cog)' -->
## Cloud Optimized GeoTIFF (COG)

- Un GeoTIFF **tuilé** avec **aperçus** (*overviews*)
- Lecture **partielle** par HTTP : seulement la zone et le zoom utiles
- Lisible par tout logiciel qui lit le GeoTIFF
- Standard OGC (2023), diffusion dans le cloud (data.geo.admin.ch)

🧵 SWISSIMAGE : blocs 256 × 256, aperçus 5000² → 313², `LAYOUT=COG`
→ QGIS lit l'aperçu 625² pour afficher toute la tuile

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Diffuser des rasters : tuiles, VRT et lecture distante](./#diffuser-des-rasters-tuiles-vrt-et-lecture-distante)' -->
## Diffuser des rasters

- **Tuiles raster** (PNG, JPEG, WebP) par niveau de zoom → WMTS
  - **MBTiles** : tuiles dans une base SQLite (cartes hors ligne)
  - **PMTiles** : un fichier lu **par morceaux** sur le web
  - **GeoPackage** : tuiles + vecteur
- **VRT** : raster **virtuel** (mosaïque) décrit en XML, sans copie
- **`/vsicurl/`** : GDAL/QGIS lit un fichier **directement sur le web**

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Exercices](./#exercices)' -->
<!-- _class: exercice -->

# Exercice : Compresser et diffuser un GeoTIFF

[Consignes](https://regislon.github.io/cfgeo_B4/formats-interfaces/exercices/ex03-compression-geotiff/)

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 ASCII Grid](./#ascii-grid)' -->
## Grilles et cubes de données

- **ASCII Grid** (`.asc`) : MNT en texte, lisible, volumineux
- **NetCDF** : données **multidimensionnelles** (x, y, z, temps), météo, climat
- **Zarr** : cubes découpés en blocs, pensé pour le cloud

![w:520](img/netcdf-multidimensionnel.png)

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Zarr](./#zarr)' -->
<!-- _class: demo -->
## ▶ Démo : un cube Zarr

![bg right:42% w:480](img/zarr-cube-previsions.jpg)

- Prévision ECMWF AIFS : X, Y + **échéance** (0–360 h) en hauteur
- Seuls les **blocs** utiles sont téléchargés · requêtes **SQL** (DuckDB) dans le navigateur
- Démo *zarr-sql-views* (G. Milevski) · données dynamical.org

<a class="go" href="https://regislon.github.io/cfgeo_B4/formats-interfaces/02-raster/#zarr"><small>Démo sur la page du cours ↗</small>▶ Le cube Zarr et sa démo en ligne</a>

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 Quel format choisir ?](./#quel-format-choisir)' -->
## Quel format choisir ?

| Besoin | Format |
|---|---|
| Échange orthophoto / MNT | GeoTIFF (LZW, Deflate) |
| MNT pour ses analyses | ZSTD/Deflate + prédicteur, LERC |
| Diffusion web / cloud | COG + STAC |
| Fond de carte web / hors ligne | WMTS, PMTiles, MBTiles |
| Photo pour affichage | JPEG, WebP, AVIF |
| Plan, carte, transparence | PNG, WebP |
| Climat, météo | NetCDF, Zarr |

---

<!-- _footer: 'CFGéo B4 · 2. Données raster · [📖 À retenir](./#a-retenir)' -->
## À retenir

- Raster = grille de pixels, **1 valeur par pixel et par bande** : une **mesure**
- 4 résolutions : spatiale, spectrale, radiométrique, temporelle
- Type de données, échelle/décalage, **NoData déclaré**
- Proche infrarouge → fausses couleurs, **NDVI**
- Taille brute = colonnes × lignes × bandes × octets
- World file : 6 paramètres **sans SCR** ; GeoTIFF : SCR inclus
- **Format ≠ compression** ; avec perte (JPEG, ondelettes) / sans perte (RLE, LZW, Deflate)
- Données à analyser → **sans perte** (ou LERC à erreur maîtrisée), jamais JPEG
- GeoTIFF / COG = choix par défaut en géomatique
