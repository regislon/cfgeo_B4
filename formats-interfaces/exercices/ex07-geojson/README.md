# GeoJSON et systèmes de coordonnées

Chapitre : [5. XML et JSON](../../05-xml-json/README.md)

**Objectif** : Lire un GeoJSON et constater l'effet du système de coordonnées sur son contenu.

## Données

[⬇ Télécharger toutes les données (zip)](https://regislon.github.io/cfgeo_B4/formats-interfaces/exercices/ex07-geojson/donnees.zip)

- [`lacs.json`](donnees/lacs.json)
- [`lacs_mn95.json`](donnees/lacs_mn95.json)

## Consignes

Logiciels : un éditeur de texte et QGIS.

1. Ouvrez `lacs.json` dans l'éditeur. Identifiez la structure : `FeatureCollection`, `Feature`, `geometry`, `properties`.
2. Quel type de géométrie est utilisé ? Dans quel système de coordonnées sont exprimées les coordonnées ?
3. Ouvrez `lacs_mn95.json`. Quelle différence voyez-vous dans l'en-tête et dans les coordonnées ?
4. Comparez la taille des deux fichiers. D'où vient la différence ?
5. Chargez les deux fichiers dans QGIS. Se superposent-ils correctement ? Pourquoi ?
6. Validez `lacs.json` avec [geojsonlint.com](https://geojsonlint.com/). Faites de même avec `lacs_mn95.json` et expliquez le résultat.
