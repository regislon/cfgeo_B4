# Formats d'images et compression

Chapitre : [2. Données raster](../../02-raster/README.md)

**Objectif** : Constater l'effet du format et de l'algorithme de compression sur la taille et la qualité d'une image.

## Données

[⬇ Télécharger toutes les données (zip)](https://regislon.github.io/cfgeo_B4/formats-interfaces/exercices/ex01-images-compression/donnees.zip)

- [`IMG_2087.jpg`](donnees/IMG_2087.jpg)
- [`IMG_0390.jpg`](donnees/IMG_0390.jpg)

## Consignes

Logiciel : [XnView MP](https://www.xnview.com/fr/xnviewmp/) (gratuit) ou GIMP.

1. Ouvrez `IMG_2087.jpg` et consultez ses propriétés. Combien de couleurs cette image peut-elle utiliser ?
2. Identifiez le nombre de couleurs réellement utilisées.
3. Convertissez l'image en 256 couleurs (palette adaptative). Décrivez l'effet de cette opération, notamment sur les nuages. Annulez.
4. Exportez l'image en JPEG avec un facteur de qualité de 80, puis de 20. Comparez la taille des fichiers et la qualité de l'image.
5. Faites la même analyse avec JPEG 2000.
6. Enregistrez l'image en JPEG qualité 20 sous `IMG_2087_20.jpg`. Ouvrez-la et réenregistrez-la en qualité 100. Quel est l'effet sur l'image ? Expliquez.
7. Ouvrez `IMG_0390.jpg` et exportez-la au format TGA avec compression RLE. Calculez le taux de compression obtenu.
8. Réduisez la profondeur de couleurs à 256 couleurs et calculez à nouveau le taux de compression. Expliquez la différence.
