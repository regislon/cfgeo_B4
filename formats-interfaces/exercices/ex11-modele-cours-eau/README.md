# Modèle QGIS : tampon et découpage

Chapitre : [9. Reformatage et ETL](../../09-reformatage-etl/README.md)

**Objectif** : Construire un modèle de traitement réutilisable sur plusieurs jeux de données.

## Données

[⬇ Télécharger toutes les données (zip)](https://regislon.github.io/cfgeo_B4/formats-interfaces/exercices/ex11-modele-cours-eau/donnees.zip)

- [`donnees_eau.gpkg`](donnees/donnees_eau.gpkg)
- [`donnees_le_flon.gpkg`](donnees/donnees_le_flon.gpkg)

## Consignes

Logiciel : QGIS (modeleur graphique).

1. Ouvrez `donnees_eau.gpkg` (couches `cours_eau` et `commune`).
2. Créez un modèle qui prend en entrée une couche de cours d'eau, une couche de communes et une distance, puis calcule un tampon autour des cours d'eau, découpé selon les communes.
3. Exécutez-le sur `donnees_eau.gpkg`, puis réutilisez-le tel quel sur `donnees_le_flon.gpkg`.
4. Exportez le modèle en script Python et identifiez les algorithmes utilisés.
