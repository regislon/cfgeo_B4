# Compression par dictionnaire

Chapitre : [2. Données raster](../../02-raster/README.md)

**Objectif** : Comprendre pourquoi une compression sans perte est efficace sur des données répétitives et inefficace sur des données aléatoires.

## Données

[⬇ Télécharger toutes les données (zip)](https://regislon.github.io/cfgeo_B4/formats-interfaces/exercices/ex02-compression-dictionnaire/donnees.zip)

- [`PythonLZW.py`](donnees/PythonLZW.py)
- [`PythonLZW_random_letter.py`](donnees/PythonLZW_random_letter.py)

## Consignes

Logiciel : Python 3 (ou la console Python de QGIS).

1. Exécutez `PythonLZW.py` : il crée un fichier texte qui répète l'alphabet. Notez la taille du fichier.
2. Exécutez `PythonLZW_random_letter.py` : il crée un fichier de même taille, mais avec des lettres tirées au hasard.
3. Compressez les deux fichiers en `.zip` et comparez les taux de compression. Expliquez la différence.
4. Augmentez `nombre_iteration` (100, 1000, 10000) et observez l'évolution des taux de compression.
