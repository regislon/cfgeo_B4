# Modèle QGIS : reprojection et calcul

Chapitre : [9. Reformatage et ETL](../../09-reformatage-etl/README.md)

**Objectif** : Automatiser une chaîne de traitements simple avec le modeleur graphique de QGIS.

## Données

[⬇ Télécharger toutes les données (zip)](https://regislon.github.io/cfgeo_B4/formats-interfaces/exercices/ex10-modele-reprojection/donnees.zip)

- [`data.gpkg`](donnees/data.gpkg)
- [`map.geo.admin.ch_KML_20230522085715.kml`](donnees/map.geo.admin.ch_KML_20230522085715.kml)

## Consignes

Logiciel : QGIS (modeleur graphique).

1. Ouvrez `data.gpkg`. Dans quel système de coordonnées est la couche `terrain` ? La surface stockée dans `_area` est-elle juste ?
2. Ouvrez le KML exporté de map.geo.admin.ch. Dans quel système est-il ?
3. Dans le modeleur graphique, créez un modèle qui reprojette une couche en MN95 (EPSG:2056) puis calcule sa surface dans un nouveau champ.
4. Appliquez le modèle aux deux jeux de données et comparez les surfaces obtenues avant et après reprojection.
