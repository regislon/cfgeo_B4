---
marp: true
theme: cfgeo
paginate: true
footer: CFGéo B4 · Formats, interfaces · 9. Reformatage et ETL
---

<!-- _class: lead -->
<!-- _paginate: false -->

# 9. Reformatage et ETL

Module B4 « Géomatique & TI » — Formats, interfaces

---

## Objectifs

- Distinguer changement de format, de système de coordonnées et de modèle
- Connaître les principaux outils de conversion
- Réaliser une conversion simple de bout en bout

---

## Qu'est-ce que le reformatage ?

| Changement | Exemple |
|---|---|
| **Format** | Shapefile → GeoPackage, GPX → KML |
| **Coordonnées** | MN03 (EPSG:21781) → MN95 (EPSG:2056) |
| **Modèle** | Renommer, convertir les types, regrouper des valeurs, ligne → surface |

- Un seul, deux ou les trois à la fois

---

## ETL : Extract, Transform, Load

- **Extract** : lire une ou plusieurs sources
- **Transform** : format, coordonnées, modèle, géométrie, contrôles
- **Load** : écrire dans le système cible (fichier, base, service)
- = la mise en œuvre d'un **schema mapping** (chapitre 7)

---

## Panorama des outils

| Outil | Type | Licence |
|---|---|---|
| **FME** | ETL graphique | Commerciale |
| **GDAL/OGR** | Bibliothèque + ligne de commande | Libre |
| **QGIS** | SIG, modeleur graphique | Libre |
| **ili2db / ilivalidator** | INTERLIS | Libre |
| **GPSBabel** | Formats GPS | Libre |

---

## FME

- Safe Software (Canada), standard *de facto* de l'échange de géodonnées
- Plusieurs centaines de formats, dont INTERLIS, CAO, BIM, raster
- **Readers** → **Transformers** → **Writers**
- **FME Form** : Workbench (éditeur) + Data Inspector (visualisation, contrôle)
- **FME Flow** : exécution automatisée sur serveur

---

## GDAL/OGR

- Bibliothèque libre au cœur de QGIS et de nombreux logiciels
- GDAL = raster, OGR = vecteur
- `gdal_translate` (raster), `ogr2ogr` (vecteur), `ogrinfo`
- Idéal pour **scripter** et convertir en série

---

## ogr2ogr en pratique

Shapefile MN03 → GeoPackage MN95 :

```bash
ogr2ogr -f GPKG batiments.gpkg batiments.shp \
        -s_srs EPSG:21781 -t_srs EPSG:2056 -nln batiments
```

GeoPackage → GeoJSON (WGS84) :

```bash
ogr2ogr -f GeoJSON batiments.geojson batiments.gpkg batiments -t_srs EPSG:4326
```

---

## Attribuer ≠ reprojeter

```bash
gdal_translate -of GTiff -a_srs EPSG:2056 ortho.jpg ortho.tif
gdalwarp -t_srs EPSG:2056 ortho_wgs84.tif ortho_mn95.tif
```

- `-a_srs` : **déclare** le système, les coordonnées ne bougent pas
- `-t_srs` : **transforme** les coordonnées
- Erreur classique : données décalées de centaines de km !

---

## QGIS

- **Exporter → Sauvegarder les entités sous…** : format, CRS, champs, emprise
- **Boîte à outils de traitement** : reprojection, calculs, tampons, découpages…
- **Modeleur graphique** : enchaîner des algorithmes dans un **modèle** réutilisable
- Export du modèle en script Python

---

## Outils INTERLIS

- **ili2db** (`ili2pg`, `ili2gpkg`) : modèle `.ili` → schéma de base ; import/export `.xtf`
- **ilivalidator** : contrôle d'un fichier par rapport à son modèle (le *checker*)
- Modèles téléchargés depuis les dépôts (models.interlis.ch)
- Intégrés dans QGIS (**Model Baker**) et FME

```bash
java -jar ilivalidator.jar mo_commune.xtf
```

---

## GPSBabel

- Conversion entre des dizaines de formats GPS
- **Traces**, **points**, **itinéraires** ; filtres (simplification…)
- Interface graphique ou ligne de commande

```bash
gpsbabel -i gpx -f trace.gpx -o kml -F trace.kml
```

---

<!-- _class: exercice -->

# Exercice : Conversion GPX ↔ KML

[Consignes et données](https://regislon.github.io/cfgeo_B4/formats-interfaces/exercices/ex08-gpx-kml/)

---

## Services en ligne : prudence !

- Convertisseurs web (p. ex. GPS Visualizer, interface de GPSBabel)
- Pratique, mais vos données partent **chez un tiers**
- ❌ Données personnelles, de clients, sous licence
- ✅ Préférer un outil local : QGIS, GDAL, GPSBabel

---

## Écrire son propre script

```python
import geopandas as gpd

gdf = gpd.read_file("batiments.shp")
gdf = gdf.to_crs(2056)
gdf = gdf.rename(columns={"genre": "type_bat"})
gdf.to_file("batiments.gpkg", layer="batiments", driver="GPKG")
```

- **GeoPandas** / **Fiona** (basés sur GDAL)
- Reproductible, versionnable — si les formats sont documentés

---

<!-- _class: exercice -->

# Exercice : Modèle QGIS : reprojection et calcul

[Consignes et données](https://regislon.github.io/cfgeo_B4/formats-interfaces/exercices/ex09-modele-reprojection/)


---

<!-- _class: exercice -->

# Exercice : Modèle QGIS : tampon et découpage

[Consignes et données](https://regislon.github.io/cfgeo_B4/formats-interfaces/exercices/ex10-modele-cours-eau/)

---

## À retenir

- Reformater = changer **format**, **CRS** et/ou **modèle**
- **FME** : ETL commercial complet (Form, Flow)
- **GDAL/OGR** : `ogr2ogr`, `gdal_translate` — attention `-a_srs` ≠ `-t_srs`
- **QGIS** : export, traitements, **modeleur graphique**
- **ili2db / ilivalidator** pour INTERLIS, **GPSBabel** pour le GPS
- Pas de données sensibles sur des convertisseurs en ligne
