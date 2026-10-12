# Compresser et diffuser un GeoTIFF

Chapitre : [2. Données raster](../../02-raster/README.md)

**Objectif** : Mesurer l'effet des compressions modernes (prédicteur, ZSTD, LERC, JPEG, WebP) sur une orthophoto et un MNT réels, et comprendre le fonctionnement d'un Cloud Optimized GeoTIFF.

## Données

Aucune donnée à télécharger : vous travaillez directement sur les fichiers de swisstopo, tuile **2538-1180** du fil rouge (Yverdon-les-Bains), en données ouvertes.

- SWISSIMAGE 10 cm :
  `https://data.geo.admin.ch/ch.swisstopo.swissimage-dop10/swissimage-dop10_2020_2538-1180/swissimage-dop10_2020_2538-1180_0.1_2056.tif`
- swissALTI3D 0,5 m :
  `https://data.geo.admin.ch/ch.swisstopo.swissalti3d/swissalti3d_2019_2538-1180/swissalti3d_2019_2538-1180_0.5_2056_5728.tif`

## Logiciels

- **QGIS** (version 3.28 ou plus récente).
- Les commandes **GDAL** sont disponibles dans le *OSGeo4W Shell* (Windows, installé avec QGIS) ou dans un terminal (macOS/Linux avec GDAL installé). Chaque étape peut aussi se faire dans QGIS, via le menu indiqué.

!!! tip "Gagner du temps"

    Dans le shell, enregistrez les deux adresses dans des variables pour ne pas les retaper. Sous Windows (OSGeo4W Shell) :
    ```bat
    set SI=/vsicurl/https://data.geo.admin.ch/ch.swisstopo.swissimage-dop10/swissimage-dop10_2020_2538-1180/swissimage-dop10_2020_2538-1180_0.1_2056.tif
    set MNT=/vsicurl/https://data.geo.admin.ch/ch.swisstopo.swissalti3d/swissalti3d_2019_2538-1180/swissalti3d_2019_2538-1180_0.5_2056_5728.tif
    ```
    et utilisez ensuite `%SI%` et `%MNT%`. Sous macOS/Linux : `SI=/vsicurl/https://…` puis `$SI`.

## Consignes

### Partie A — Lire un COG sans le télécharger

1. Dans QGIS, ajoutez la couche SWISSIMAGE par *Couche › Ajouter une couche › Ajouter une couche raster*, source **Protocole HTTP(S)**, en collant l'adresse ci-dessus. Zoomez et dézoomez. Le fichier pèse 65 Mo : est-il téléchargé entièrement ? Comment est-ce possible ?
2. Affichez les informations du fichier :
    ```bash
    gdalinfo %SI%
    gdalinfo %MNT%
    ```
    (ou dans QGIS : *Propriétés de la couche › Information*). Pour chacun des deux fichiers, relevez : la taille en pixels, la taille du pixel, le nombre de bandes, le type de données, la valeur NoData, la compression, la taille des blocs (`Block=`) et la liste des aperçus (`Overviews`).
3. Quel paramètre indique qu'il s'agit d'un COG ? À quoi servent les blocs et les aperçus ?

### Partie B — Extraire une zone de travail

4. Extrayez un carré de 200 m × 200 m de l'orthophoto, et copiez le MNT entier (1 km × 1 km), sans compression :
    ```bash
    gdal_translate -projwin 2538300 1180700 2538500 1180500 %SI% si.tif
    gdal_translate %MNT% mnt.tif
    ```
    (QGIS : *Raster › Extraction › Découper un raster selon une emprise* pour l'orthophoto, *Exporter › Enregistrer sous…* pour le MNT). Combien de pixels contient chaque fichier ? Calculez leur taille brute (colonnes × lignes × bandes × octets) et comparez-la à la taille des fichiers obtenus. Seules les données nécessaires ont-elles été téléchargées pour l'extrait d'orthophoto ?

### Partie C — Compresser l'orthophoto

5. Créez les variantes suivantes de `si.tif` et notez la taille de chaque fichier :

    | Fichier | Options GDAL (`-co`) |
    |---|---|
    | `si_lzw.tif` | `COMPRESS=LZW` |
    | `si_deflate.tif` | `COMPRESS=DEFLATE` |
    | `si_deflate_p2.tif` | `COMPRESS=DEFLATE` `PREDICTOR=2` |
    | `si_zstd_p2.tif` | `COMPRESS=ZSTD` `PREDICTOR=2` |
    | `si_jpeg95.tif` | `COMPRESS=JPEG` `JPEG_QUALITY=95` `PHOTOMETRIC=YCBCR` |
    | `si_jpeg50.tif` | `COMPRESS=JPEG` `JPEG_QUALITY=50` `PHOTOMETRIC=YCBCR` |
    | `si_webp75.tif` | `COMPRESS=WEBP` `WEBP_LEVEL=75` |

    Exemple : `gdal_translate -co COMPRESS=DEFLATE -co PREDICTOR=2 -co TILED=YES si.tif si_deflate_p2.tif`
    (QGIS : clic droit sur la couche › *Exporter › Enregistrer sous…* › *Options de création*).

6. Calculez le ratio de compression de chaque variante. Pourquoi les compressions sans perte gagnent-elles si peu sur une orthophoto ? Pourquoi le prédicteur aide-t-il ?
7. Ouvrez `si.tif`, `si_jpeg95.tif` et `si_jpeg50.tif` dans QGIS et comparez-les en zoomant fortement sur un marquage routier ou une voiture. Décrivez les artefacts.

### Partie D — Compresser le MNT

8. Créez les variantes suivantes de `mnt.tif` et notez leur taille :

    | Fichier | Options GDAL (`-co`) |
    |---|---|
    | `mnt_lzw.tif` | `COMPRESS=LZW` |
    | `mnt_deflate_p3.tif` | `COMPRESS=DEFLATE` `PREDICTOR=3` |
    | `mnt_zstd_p3.tif` | `COMPRESS=ZSTD` `PREDICTOR=3` |
    | `mnt_lerc_1cm.tif` | `COMPRESS=LERC_ZSTD` `MAX_Z_ERROR=0.01` |
    | `mnt_lerc_50cm.tif` | `COMPRESS=LERC_ZSTD` `MAX_Z_ERROR=0.5` |
    | `mnt_jpeg.tif` | `COMPRESS=JPEG` (que se passe-t-il ?) |

9. Avec la *Calculatrice raster* de QGIS, calculez la différence `mnt_lerc_50cm - mnt` puis affichez ses statistiques (minimum, maximum). L'erreur maximale annoncée est-elle respectée ?
10. Calculez une carte des pentes (*Raster › Analyse › Pente*) sur `mnt.tif` et sur `mnt_lerc_50cm.tif`. Les résultats diffèrent-ils ? Quelle erreur maximale vous paraît acceptable pour ce MNT, sachant que sa précision altimétrique est de l'ordre de quelques décimètres ?

### Partie E — Créer un COG

11. Convertissez votre meilleure variante du MNT en COG :
    ```bash
    gdal_translate -of COG -co COMPRESS=ZSTD -co PREDICTOR=YES mnt.tif mnt_cog.tif
    ```
    Vérifiez avec `gdalinfo` la présence de `LAYOUT=COG`, des blocs et des aperçus. Comparez la taille avec `mnt_zstd_p3.tif` : que coûtent les aperçus ? Comparez enfin avec le fichier original de swisstopo (15,5 Mo, compressé en LZW).

## Synthèse

Complétez le tableau suivant et justifiez vos choix :

| Usage | Compression choisie | Pourquoi ? |
|---|---|---|
| Envoyer l'orthophoto à un architecte pour un fond de plan | | |
| Archiver le MNT pour des calculs de volumes | | |
| Diffuser l'orthophoto sur un site web | | |
| Échanger le MNT avec un bureau qui utilise un ancien logiciel | | |
