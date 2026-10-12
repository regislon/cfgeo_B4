# Shapefile, GeoPackage et raster

Chapitre : [3. Données vectorielles](../../03-vecteur/README.md)

**Objectif** : Comparer un shapefile et un GeoPackage, et réunir des données vecteur et raster dans un seul fichier.

## Données

[⬇ Télécharger toutes les données (zip)](https://regislon.github.io/cfgeo_B4/formats-interfaces/exercices/ex05-geopackage/donnees.zip)

- [`swissBOUNDARIES3D_1_3_TLM_HOHEITSGEBIET.gpkg`](donnees/swissBOUNDARIES3D_1_3_TLM_HOHEITSGEBIET.gpkg)
- [`swissimage-dop10_2020_2540-1150_2_2056.tif`](donnees/swissimage-dop10_2020_2540-1150_2_2056.tif)
- À télécharger : [swissBOUNDARIES3D](https://www.swisstopo.admin.ch/fr/modele-du-territoire-swissboundaries3d) (swisstopo, données ouvertes) — format shapefile.

## Consignes

Logiciel : QGIS.

1. Téléchargez swissBOUNDARIES3D au format shapefile (lien ci-dessous) et ouvrez la couche `HOHEITSGEBIET`.
2. Ouvrez `swissBOUNDARIES3D_1_3_TLM_HOHEITSGEBIET.gpkg`. Comparez le nombre de fichiers, la taille, les types de champs et la longueur des noms d'attributs avec le shapefile.
3. Créez un nouveau GeoPackage contenant à la fois la couche des communes et l'orthophoto `swissimage-dop10_…tif`.
4. Quelles tables le GeoPackage contient-il ? (Explorez-le avec le Gestionnaire de bases de données de QGIS ou DB Browser for SQLite.)
5. Enregistrez un style de couche dans le GeoPackage, puis rouvrez-le dans un nouveau projet.
