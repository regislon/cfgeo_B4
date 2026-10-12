# Du fichier de base de données au shapefile

Chapitre : [3. Données vectorielles](../../03-vecteur/README.md)

**Objectif** : Mettre en évidence ce qui se perd lors du passage d'une base de données spatiale à un shapefile.

## Données

[⬇ Télécharger toutes les données (zip)](https://regislon.github.io/cfgeo_B4/formats-interfaces/exercices/ex04-shapefile/donnees.zip)

- [`Ex4.mdb`](donnees/Ex4.mdb)

## Consignes

Logiciel : FME, ou QGIS / `ogr2ogr` (lecture `.mdb` selon la plateforme).

1. Ouvrez la classe d'objets « Polygone » de la base `Ex4.mdb`. Selon la classification vue au cours, quel type de stockage a-t-on ici ?
2. Quels types d'objets sont présents ?
3. Convertissez les données en shapefile.
4. Ouvrez le fichier `.dbf` avec un tableur. Quels sont les attributs des objets ?
5. Comment le système de coordonnées est-il décrit dans le shapefile ?
6. Chargez les deux jeux de données (mdb et shp) et comparez les sommets (vertex). Que constatez-vous ?
7. Déduisez-en une caractéristique du format shapefile.
