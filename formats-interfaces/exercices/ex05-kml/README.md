# Lire et modifier un fichier KML

Chapitre : [5. XML et JSON](../../05-xml-json/README.md)

**Objectif** : Lire la structure XML d'un fichier KML et la modifier à la main.

## Données

[⬇ Télécharger toutes les données (zip)](https://regislon.github.io/cfgeo_B4/formats-interfaces/exercices/ex05-kml/donnees.zip)

- [`Neuch.kml`](donnees/Neuch.kml)
- [`Chaumont.kml`](donnees/Chaumont.kml)
- [`ExoPoint.kml`](donnees/ExoPoint.kml)
- [`funi_chaumont.jpg`](donnees/funi_chaumont.jpg)

## Consignes

Logiciels : un éditeur de texte (VS Code, Notepad++) et Google Earth (ou QGIS).

1. Ouvrez `Neuch.kml` dans l'éditeur. Quelle primitive géométrique est utilisée ? Combien de points constituent cet objet ?
2. Ouvrez le fichier dans Google Earth. Quelle est la couleur de l'objet ?
3. Dans l'éditeur, passez la largeur du trait à 6, enregistrez et rechargez dans Google Earth.
4. Modifiez la couleur du trait. Attention, KML code les couleurs en `aabbggrr` (alpha, bleu, vert, rouge). Faites quelques essais.
5. En gardant ces réglages, remplacez le tracé par celui contenu dans `Chaumont.kml`.
6. Quelle est l'altitude des points d'après le fichier KML ? Comparez avec l'altitude affichée dans Google Earth. Que signifie la valeur du fichier ?
7. Quel est le système de référence utilisé par ces fichiers ?
8. Dans `Chaumont.kml`, copiez la balise `<Placemark>` qui contient `<name>Funiculaire de Chaumont</name>` et collez-la dans `Neuch.kml`, à l'extérieur de la balise existante. Quel est l'effet ?
9. Optionnel : remplacez l'image du funiculaire par `funi_chaumont.jpg`, puis ajoutez un point en vous inspirant de `ExoPoint.kml`.
