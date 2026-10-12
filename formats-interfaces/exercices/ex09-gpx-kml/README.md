# Conversion GPX ↔ KML

Chapitre : [9. Reformatage et ETL](../../09-reformatage-etl/README.md)

**Objectif** : Convertir une trace GPS entre deux formats et identifier ce qui est conservé ou perdu.

## Données

[⬇ Télécharger toutes les données (zip)](https://regislon.github.io/cfgeo_B4/formats-interfaces/exercices/ex09-gpx-kml/donnees.zip)

- [`Ex5.gpx`](donnees/Ex5.gpx)
- [`test_5.kml`](donnees/test_5.kml)

## Consignes

Logiciels : [GPSBabel](https://www.gpsbabel.org/) et QGIS.

1. Ouvrez `Ex5.gpx` dans un éditeur. Quelle est la structure du fichier (trace, segments, points) ? Quelles informations chaque point contient-il ?
2. Convertissez `Ex5.gpx` en KML avec GPSBabel.
3. Comparez le résultat avec `test_5.kml` : structure, taille, informations temporelles.
4. Chargez le GPX dans QGIS. Quelles couches apparaissent ?
5. Exportez la trace en GeoPackage en MN95 (EPSG:2056) et calculez sa longueur.
