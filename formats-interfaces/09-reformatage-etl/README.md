# 9. Reformatage et ETL

[📽 Slides du chapitre](https://regislon.github.io/cfgeo_B4/formats-interfaces/09-reformatage-etl/slides.html)

## Objectifs

À la fin de ce chapitre, vous êtes capables de :

- Distinguer changement de format, de système de coordonnées et de modèle
- Connaître les principaux outils de conversion et savoir lequel choisir
- Réaliser une conversion simple de bout en bout (GDAL/OGR, QGIS, GPSBabel)
- Automatiser une chaîne de traitements avec le modeleur graphique de QGIS

## Qu'est-ce que le reformatage ?

On appelle **reformatage** la transformation de données d'un format vers un autre. En pratique, à cause des caractéristiques propres à chaque format, il faut très souvent modifier non seulement le format, mais aussi la **structure** des données. Les outils de reformatage permettent donc de modifier trois éléments, indépendamment les uns des autres :

| Changement | Exemple |
|---|---|
| **Format** | Shapefile → GeoPackage, GPX → KML, DXF → GeoJSON |
| **Système de coordonnées** | MN03 (EPSG:21781) → MN95 (EPSG:2056), WGS84 (EPSG:4326) → MN95 |
| **Modèle de données** | Renommer des attributs, convertir des types, regrouper des valeurs, transformer des lignes en surfaces (voir le [schema mapping](../07-echange-de-donnees/README.md#schema-mapping)) |

On peut changer un seul de ces éléments (p. ex. reprojeter un GeoPackage sans changer de format) ou les trois à la fois (p. ex. transformer un DXF en WGS84 en une couche GeoPackage en MN95 structurée selon un modèle cantonal).

!!! note "ETL"
    Les outils les plus complets sont appelés **ETL** (*Extract, Transform, Load*) : ils **extraient** les données d'une ou plusieurs sources, les **transforment** (format, coordonnées, modèle, géométrie, contrôles) puis les **chargent** dans un système cible (fichier, base de données, service).

Il existe de nombreux outils pour préparer et exécuter des interfaces de transfert. Voici les principaux.

| Outil | Type | Points forts | Licence |
|---|---|---|---|
| **FME** | ETL graphique | Très nombreux formats, transformations complexes, automatisation | Commerciale |
| **GDAL/OGR** | Bibliothèque + ligne de commande | Rapide, scriptable, au cœur de nombreux logiciels | Libre |
| **QGIS** | SIG bureautique | Export, outils de traitement, modeleur graphique | Libre |
| **ili2db, ilivalidator** | Outils INTERLIS | Import/export et contrôle INTERLIS | Libre |
| **GPSBabel** | Convertisseur spécialisé | Formats GPS (traces, points, routes) | Libre |

## FME

**FME** (*Feature Manipulation Engine*), développé par l'entreprise canadienne Safe Software, s'est imposé comme un standard *de facto* pour l'échange de données géographiques. Il lit et/ou écrit plusieurs centaines de formats (vecteur, raster, bases de données, services web, formats CAO et BIM, tableurs…), y compris **INTERLIS**. C'est un **ETL** : il permet non seulement d'enregistrer les données dans un autre format, mais aussi de changer leur système de coordonnées et d'établir des correspondances entre modèles de données.

### Fonctionnement

Pour FME, un **traitement** est l'ensemble des actions nécessaires pour faire passer un jeu de données source (un format, un modèle) vers un jeu de données cible (son propre format, son propre modèle). Les trois constituants **format**, **données** et **modèle** peuvent évoluer indépendamment : on peut modifier les données sans changer ni le format ni le modèle (généralisation, reprojection) ou changer les trois à la fois.

Un traitement FME se construit graphiquement :

- des **readers** lisent les données source ;
- des **transformers** (plusieurs centaines) modifient les objets : renommer un attribut (`AttributeRenamer`), remplacer des valeurs selon une table (`AttributeValueMapper`), reprojeter (`Reprojector`), filtrer, contrôler la géométrie… ;
- des **writers** écrivent le résultat dans le format cible.

### Les produits

- **FME Form** (anciennement *FME Desktop*) : l'application de bureau, qui comprend :
    - **FME Workbench**, l'éditeur graphique des traitements (*workspaces*) ;
    - **FME Data Inspector**, un visualiseur de données graphiques et attributaires, utilisé pour l'analyse et le contrôle qualité.
- **FME Flow** (anciennement *FME Server*) : la plateforme serveur qui exécute les traitements de manière automatisée (planification, déclenchement par un événement, services web).

!!! tip "Lien avec le schema mapping"
    La table de correspondance établie lors d'un schema mapping (colonnes `att_name_in`, `att_value_in`, `att_name_out`, `att_value_out`, voir l'[exercice 7](../exercices/ex07-schema-mapping/README.md)) peut être lue directement par FME pour piloter les transformations, au lieu d'être codée à la main.

## GDAL/OGR

**[GDAL](https://gdal.org/)** (*Geospatial Data Abstraction Library*) est une bibliothèque libre de lecture et d'écriture de géodonnées. Historiquement, **GDAL** désigne la partie raster et **OGR** la partie vecteur. Elle est utilisée par la plupart des logiciels SIG, dont QGIS : quand QGIS ouvre un shapefile ou un GeoTIFF, c'est GDAL qui travaille.

GDAL fournit aussi des **outils en ligne de commande**, très pratiques pour convertir rapidement des fichiers ou automatiser des traitements dans un script. Les deux principaux :

- `gdal_translate` : conversion de **rasters** ;
- `ogr2ogr` : conversion de **vecteurs**.

!!! note
    Les versions récentes de GDAL (3.11 et suivantes) introduisent une commande unifiée `gdal` (p. ex. `gdal vector convert`). Les commandes classiques présentées ici restent disponibles et sont les plus documentées.

### Exemples avec ogr2ogr

Lister les couches et la structure d'un fichier :

```bash
ogrinfo -so batiments.shp batiments
```

Convertir un shapefile en GeoPackage, en le reprojetant de MN03 en MN95 :

```bash
ogr2ogr -f GPKG batiments.gpkg batiments.shp \
        -s_srs EPSG:21781 -t_srs EPSG:2056 \
        -nln batiments
```

Exporter une couche d'un GeoPackage en GeoJSON (le GeoJSON standard est en WGS84) :

```bash
ogr2ogr -f GeoJSON batiments.geojson batiments.gpkg batiments \
        -t_srs EPSG:4326
```

Ne garder que certains objets et attributs (filtre attributaire) :

```bash
ogr2ogr -f GPKG habitations.gpkg batiments.gpkg \
        -sql "SELECT egid, genre AS type_bat FROM batiments WHERE genre = 'habitation'"
```

| Option | Rôle |
|---|---|
| `-f` | Format de sortie (`GPKG`, `GeoJSON`, `ESRI Shapefile`, `DXF`, `CSV`…) |
| `-s_srs`, `-t_srs` | Système de coordonnées source / cible |
| `-nln` | Nom de la couche de sortie |
| `-sql`, `-where` | Sélection d'objets et d'attributs (et renommage) |

### Exemple avec gdal_translate

Convertir une image en GeoTIFF compressé, en lui attribuant le système MN95 :

```bash
gdal_translate -of GTiff -a_srs EPSG:2056 -co COMPRESS=DEFLATE ortho.jpg ortho.tif
```

!!! warning "`-a_srs` n'est pas une reprojection"
    `-a_srs` **attribue** un système de coordonnées (les coordonnées ne bougent pas : on dit simplement « ces données sont en MN95 »). Pour **reprojeter** réellement un raster, on utilise `gdalwarp -t_srs EPSG:2056`. Pour les vecteurs, `ogr2ogr -t_srs` reprojette, `-a_srs` attribue.

## QGIS

QGIS (comme ArcGIS Pro) permet d'ouvrir des données de nombreux formats (shapefile, GeoPackage, GeoJSON, KML, GPX, CSV avec coordonnées, DXF, services web…) et de les **réenregistrer** dans un autre format.

### Export simple

Clic droit sur une couche → **Exporter → Sauvegarder les entités sous…** Cette boîte de dialogue permet de choisir en une fois :

- le **format** de sortie ;
- le **système de coordonnées** (reprojection à la volée) ;
- les **champs** à exporter ;
- l'**emprise** ou les seules entités sélectionnées.

C'est, en fait, une interface graphique sur `ogr2ogr`.

### Boîte à outils de traitement

La **boîte à outils de traitement** (*Processing*) regroupe des centaines d'algorithmes : reprojection, calculatrice de champs, tampon, découpage, réparation de géométries, conversion de types géométriques… Chaque algorithme peut produire sa sortie dans le format souhaité.

### Modeleur graphique

Le **modeleur graphique** permet d'enchaîner plusieurs algorithmes dans un **modèle** réutilisable : on définit des **entrées** (couches, paramètres), on relie les algorithmes entre eux, et on obtient un traitement que l'on peut relancer sur d'autres données, ou exporter en script Python. C'est un petit ETL intégré à QGIS, idéal pour automatiser une chaîne de reformatage simple.

Exemples de modèles (voir les exercices) :

- reprojeter une couche en MN95 puis calculer sa surface ([exercice 9](../exercices/ex09-modele-reprojection/README.md)) ;
- calculer un tampon autour de cours d'eau puis le découper par commune ([exercice 10](../exercices/ex10-modele-cours-eau/README.md)).

## Outils INTERLIS (ili2db, ilivalidator)

Pour les données au format INTERLIS (MO, géodonnées de base selon la LGéo), des outils libres, développés principalement par Eisenhut Informatik avec le soutien de la Confédération et de cantons, sont devenus la référence :

- **[ili2db](https://github.com/claeis/ili2db)** (déclinaisons `ili2pg` pour PostgreSQL/PostGIS, `ili2gpkg` pour GeoPackage…) : crée un schéma de base de données à partir d'un modèle INTERLIS (`.ili`), importe des fichiers de transfert (`.xtf`, `.itf`) dans la base et exporte les données de la base vers INTERLIS ;
- **[ilivalidator](https://github.com/claeis/ilivalidator)** : contrôle qu'un fichier de transfert respecte son modèle (types, cardinalités, géométries, contraintes). C'est le **checker** évoqué au [chapitre 7](../07-echange-de-donnees/README.md).

Exemples (outils Java en ligne de commande) :

```bash
# Contrôler un fichier de transfert
java -jar ilivalidator.jar mo_commune.xtf

# Importer un fichier INTERLIS dans un GeoPackage (le schéma est créé selon le modèle)
java -jar ili2gpkg.jar --schemaimport --import --dbfile mo_commune.gpkg mo_commune.xtf
```

Les modèles nécessaires sont recherchés automatiquement dans les **dépôts de modèles** en ligne (p. ex. models.interlis.ch). Ces outils sont aussi intégrés dans des interfaces graphiques, comme le plugin QGIS **Model Baker**, et dans FME.

!!! tip
    Les détails d'INTERLIS (langage, modèles, transfert) sont traités dans un cours séparé.

## Outils spécialisés : GPSBabel

**[GPSBabel](https://www.gpsbabel.org/)** est un logiciel libre de conversion de fichiers GPS entre plusieurs dizaines de formats (GPX, KML, CSV, formats de différents fabricants…). Il gère les trois types d'informations GPS : **traces** (*tracks*), **points** (*waypoints*) et **itinéraires** (*routes*). Il permet aussi de filtrer les données (simplifier une trace, supprimer les doublons…).

GPSBabel s'utilise avec une interface graphique ou en **ligne de commande**, ce qui permet de l'intégrer dans des traitements automatisés :

```bash
gpsbabel -i gpx -f trace.gpx -o kml -F trace.kml
```

(`-i`/`-o` : formats d'entrée et de sortie ; `-f`/`-F` : fichiers d'entrée et de sortie.)

Voir l'[exercice 8](../exercices/ex08-gpx-kml/README.md).

## Services en ligne

De nombreux services en ligne proposent des conversions de formats. Par exemple, [GPS Visualizer](https://www.gpsvisualizer.com/gpsbabel/) offre une interface web à GPSBabel pour convertir des fichiers GPS. Ces services évoluent et disparaissent rapidement.

!!! warning "Attention aux données confidentielles"
    Utiliser un service en ligne revient à **envoyer vos données à un tiers**, souvent à l'étranger, sans garantie sur leur traitement ni leur conservation. À proscrire pour des données personnelles, confidentielles ou soumises à des conditions d'utilisation (données de clients, de la MO, de réseaux…). Préférez un outil local : QGIS, GDAL ou GPSBabel font la même chose sur votre ordinateur.

## Écrire son propre script

Lorsque aucun outil ne fait exactement ce qu'il faut, on peut programmer soi-même l'interface. En **Python**, les bibliothèques **GeoPandas** (tableaux de données géographiques) et **Fiona** (lecture et écriture de fichiers vecteur), toutes deux basées sur GDAL, permettent d'écrire une conversion en quelques lignes :

```python
import geopandas as gpd

gdf = gpd.read_file("batiments.shp")
gdf = gdf.to_crs(2056)                                   # reprojection en MN95
gdf = gdf.rename(columns={"genre": "type_bat"})          # changement de modèle
gdf.to_file("batiments.gpkg", layer="batiments", driver="GPKG")
```

Un script a l'avantage d'être **reproductible**, versionnable et facile à relancer. Il suppose en revanche que les formats source et cible soient **documentés** et lisibles, ce qui n'est pas toujours le cas des formats propriétaires.

## À retenir

- Reformater, c'est changer le **format**, le **système de coordonnées** et/ou le **modèle de données**.
- **FME** (Workbench, Data Inspector ; Form/Flow) : ETL commercial complet, standard *de facto*.
- **GDAL/OGR** : la bibliothèque libre au cœur des SIG ; `ogr2ogr` (vecteur) et `gdal_translate` (raster) en ligne de commande.
- **QGIS** : export, boîte à outils de traitement et **modeleur graphique** pour automatiser.
- **ili2db** et **ilivalidator** : importer, exporter et contrôler des données INTERLIS.
- **GPSBabel** : conversions de fichiers GPS. Méfiance envers les **services en ligne** pour les données sensibles.

## Sources

- Cours « Formats, interfaces » CFGéo, versions R. Balanche (2003), J.-L. Miserez (jusqu'en 2019), mise à jour 2023.
- [FME – Safe Software](https://fme.safe.com/)
- [GDAL – documentation](https://gdal.org/)
- [Documentation QGIS – modeleur graphique](https://docs.qgis.org/latest/fr/docs/user_manual/processing/modeler.html)
- [ili2db (GitHub)](https://github.com/claeis/ili2db) et [ilivalidator (GitHub)](https://github.com/claeis/ilivalidator)
- [GPSBabel](https://www.gpsbabel.org/)
- [GeoPandas](https://geopandas.org/)

## Exercices

- [Conversion GPX ↔ KML](../exercices/ex08-gpx-kml/README.md)
- [Modèle QGIS : reprojection et calcul](../exercices/ex09-modele-reprojection/README.md)
- [Modèle QGIS : tampon et découpage](../exercices/ex10-modele-cours-eau/README.md)

---

← [Géoservices (GeoWeb)](../08-geoservices/README.md)
