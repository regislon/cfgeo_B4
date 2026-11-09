# Un même territoire, quatre accès

Chapitre : [8. Géoservices (GeoWeb)](../../08-geoservices/README.md)

**Objectif** : Accéder aux bâtiments de la tuile du fil rouge (2538-1180, Yverdon-les-Bains) de quatre manières différentes, et comparer ce que chaque accès renvoie.

## Données

Aucune donnée à télécharger : tout se fait en ligne, sur les services de la Confédération et sur ce site.

## Consignes

Logiciel : un navigateur web. Gardez les outils de développement ouverts (touche **F12**, onglet *Réseau*) pour voir les requêtes et la quantité de données téléchargée. [GeoLibre](https://web.geolibre.app) (à ouvrir dans **Chrome**) peut servir à afficher les résultats.

L'emprise de la tuile, en MN95, est `2538000,1180000,2539000,1181000`.

### Accès 1 : une carte (WMS)

Avec le [constructeur de requêtes du chapitre 8](../../08-geoservices/README.md#fil-rouge-la-tuile-dyverdon-en-wms-et-en-wmts), demandez la couche **Bâtiments RegBL** (`ch.bfs.gebaeude_wohnungs_register`) sur l'emprise de la tuile, puis ouvrez l'URL dans un nouvel onglet.

- Que contient la réponse ? Pouvez-vous connaître l'adresse d'un bâtiment à partir de ce que vous avez reçu ?
- Quelle est la taille de la réponse ? Change-t-elle si vous demandez 256 ou 512 pixels ?

### Accès 2 : des objets par une API

L'API REST de geo.admin.ch renvoie les objets d'une couche dans une emprise, en GeoJSON. Ouvrez cette URL (sur une seule ligne) :

```text
https://api3.geo.admin.ch/rest/services/api/MapServer/identify?geometryType=esriGeometryEnvelope
&geometry=2538000,1180000,2539000,1181000&imageDisplay=500,500,96&mapExtent=2538000,1180000,2539000,1181000
&tolerance=0&layers=all:ch.bfs.gebaeude_wohnungs_register&sr=2056&geometryFormat=geojson&limit=50
```

- Quel est le type de géométrie des bâtiments ? Dans quel système de coordonnées ?
- Relevez trois attributs utiles et leur signification. Certains sont des **codes** (`gkat`, `gstat`…) : où trouver leur signification ?
- Que se passe-t-il si vous remplacez `limit=50` par `limit=500` ? Pourquoi un service limite-t-il le nombre d'objets par requête ?

### Accès 3 : des fichiers par un catalogue (STAC)

Le catalogue STAC de swisstopo décrit les fichiers téléchargeables. Ouvrez :

```text
https://data.geo.admin.ch/api/stac/v1/collections/ch.swisstopo.swissbuildings3d_3_0/items?bbox=6.63,46.77,6.64,46.775
```

- Combien d'*items* couvrent la tuile ? Que représente chacun (date, emprise) ?
- Quels formats de fichiers (*assets*) sont proposés, et dans quel système de coordonnées (`proj:epsg`) ? Quelle est la taille d'un fichier ? (Ouvrez le lien `href` d'un *asset* : le navigateur indique la taille au début du téléchargement, que vous pouvez annuler.)
- Couvrent-ils seulement la tuile du fil rouge ? Que faut-il faire ensuite pour obtenir les bâtiments de la tuile ?

### Accès 4 : un fichier cloud-native (GeoParquet)

Dans la [démo DuckDB du chapitre 8](../../08-geoservices/README.md#du-big-data-dans-le-navigateur-avec-duckdb), lancez la requête « Fil rouge », puis écrivez une requête qui renvoie, pour la tuile, le nombre de bâtiments et la hauteur moyenne par source (`source`).

- Combien d'octets la requête a-t-elle téléchargés, sur combien ?
- Qui a fait le calcul : un serveur ou votre navigateur ?

### Synthèse

1. Complétez le tableau :

    | | WMS | API (objets) | STAC (fichiers) | GeoParquet |
    |---|---|---|---|---|
    | Ce que l'on reçoit | | | | |
    | Format | | | | |
    | Quantité téléchargée | | | | |
    | Filtrer par attribut ? | | | | |
    | Qui calcule ? | | | | |
    | Date des données | | | | |

2. Les accès 2, 3 et 4 ne donnent pas le même **nombre** de bâtiments sur la tuile. Proposez des explications : définition d'un bâtiment, source, date, règle de sélection (centroïde, intersection).
3. Quel accès choisiriez-vous pour :
    - afficher un fond de carte dans une application ;
    - calculer une statistique sur tous les bâtiments du canton ;
    - vérifier l'adresse officielle d'un bâtiment aujourd'hui ;
    - construire une maquette 3D du quartier ?
