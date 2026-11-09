# 8. Géoservices (GeoWeb)

[📽 Slides du chapitre](https://regislon.github.io/cfgeo_B4/formats-interfaces/08-geoservices/slides.html)

## Objectifs

À la fin de ce chapitre, vous êtes capables de :

- Expliquer le fonctionnement d'un géoservice (requête GetCapabilities puis requête de données)
- Citer les avantages et les limites d'une architecture orientée services
- Distinguer les types de géoservices et les grands standards OGC (WMS, WMTS, WFS, CSW)
- Interroger un service WMS, WMTS ou WFS, en KVP ou en REST
- Situer les tuiles vectorielles, les OGC API et les catalogues STAC
- Expliquer comment diffuser des géodonnées **sans serveur cartographique** (formats *cloud-native*, stockage web) et comparer cette approche aux géoservices
- Interroger un gros fichier GeoParquet en SQL directement dans le navigateur, avec DuckDB

## Services web et géoservices

### Définition

D'un point de vue technique, un **service web** est une technologie qui permet à des applications de **dialoguer à distance à travers Internet**, indépendamment des plateformes et des langages de programmation utilisés de part et d'autre. Le dialogue se fait via le protocole **HTTP(S)**, celui du web.

Un **géoservice** est un service web avec une composante géographique. La [loi fédérale sur la géoinformation (LGéo)](https://www.fedlex.admin.ch/eli/cc/2008/388/fr), art. 3, le définit comme une :

> application apte à être mise en réseau et simplifiant l'utilisation des géodonnées par des prestations de services informatisées y donnant accès sous une forme structurée.

Deux notions ressortent de cette définition :

- **la mise en réseau** : un géoservice permet à deux ordinateurs d'échanger des informations géographiques ;
- **la forme structurée** : l'échange suit un formalisme précis, défini par des **normes**. Les plus connues (WMS, WMTS, WFS, CSW, OGC API…) sont publiées par l'**OGC** (*Open Geospatial Consortium*) et sont indépendantes de tout logiciel : elles décrivent la manière d'appeler le service et la forme de la réponse.

### Principe de fonctionnement

![Principe d'un géoservice : requête Capabilities puis requête de données](img/principe-getcapabilities.png)

*Figure : dialogue entre un client et un serveur de géoservice.*

1. Le client contacte le serveur et demande le document **Capabilities** (les métadonnées du service).
2. Le serveur renvoie ce document, au format **XML**, qui décrit ce que le service sait faire : couches disponibles, systèmes de coordonnées, formats, emprises…
3. Le client demande des données au serveur, en formulant une requête compatible avec ce qu'il a appris.
4. Le serveur livre les données demandées dans le format exigé (image, GML, GeoJSON…).

La plupart des services OGC répondent ainsi à deux types de requêtes :

- **`GetCapabilities`** : le « mode d'emploi » du service. On se renseigne d'abord sur ce qu'il peut fournir…
- **les requêtes de données** (`GetMap`, `GetTile`, `GetFeature`…) : … puis on pose une question qui correspond.

!!! tip "Dans la pratique"
    Vous n'écrivez presque jamais ces requêtes à la main : QGIS, ArcGIS Pro ou une application web les construisent pour vous dès que vous indiquez l'URL du service. Mais savoir les lire permet de **comprendre et diagnostiquer** un service qui ne fonctionne pas.

### KVP et REST

Une requête à un géoservice peut prendre plusieurs formes :

| Style | Principe | Exemple |
|---|---|---|
| **KVP** (*key-value pairs*, paires clé-valeur) | Paramètres `clé=valeur` à la suite de l'URL, après un `?` et séparés par `&` | `...?SERVICE=WMS&REQUEST=GetCapabilities` |
| **REST** | Chaque ressource a sa propre URL, organisée comme un chemin de fichiers | `.../ch.swisstopo.pixelkarte-farbe/default/current/2056/20/58/70.jpeg` |
| SOAP | Messages XML envoyés en POST | Très peu utilisé, non traité ici |

WMS et WFS sont historiquement des services **KVP** ; WMTS propose les deux ; les **OGC API** récentes sont entièrement **REST**.

## Une nouvelle manière d'utiliser les géodonnées

### Du modèle traditionnel à l'architecture orientée services

Dans le modèle **traditionnel** :

- les données sont acquises (gratuitement ou non) ;
- elles sont stockées et gérées par l'utilisateur lui-même ;
- elles sont utilisées dans une application développée et maintenue par lui.

Dans une **architecture orientée services** (**SOA**, *Service-Oriented Architecture*), l'utilisateur n'a plus besoin de **posséder** une copie des données pour les utiliser : il accède à des services mis à disposition par d'autres, qu'il s'agisse de données ou de traitements.

![Clients accédant à des services hébergés sur plusieurs serveurs](img/soa-services.png)

*Figure : grâce à la standardisation, un client peut accéder à de multiples sources de données.*

Grâce à l'interopérabilité offerte par les géoservices, on peut construire des **SIG distribués** : les données restent chez leurs producteurs, les services les exposent de manière standardisée, et des géoportails ou des SIG bureautiques les combinent.

![Architecture multi-tiers : clients, géoportails, services standardisés, entrepôts de données](img/architecture-distribuee.png)

*Figure : architecture distribuée « multi-tiers ».*

Exemple suisse : [map.geo.admin.ch](https://map.geo.admin.ch) affiche des centaines de couches de la Confédération, servies par les géoservices de l'infrastructure fédérale de données géographiques ; les géoportails cantonaux en font autant pour les données cantonales et communales.

### Avantages et inconvénients

| Avantages | Inconvénients |
|---|---|
| Données **mises à jour en permanence** : les utilisateurs d'une base cadastrale centralisée voient chaque jour la version actuelle, sans gérer eux-mêmes les changements | **Dépendance au réseau** : sans connexion (ou avec une mauvaise connexion), l'application est inutilisable |
| **Rentabilisation** des développements : un même service (p. ex. transformation de coordonnées) sert dans de nombreux contextes | **Sécurité** : ouvrir un système au réseau crée une faille potentielle, parfois inacceptable pour des applications critiques |
| Intégration de données et services de **systèmes très différents**, moins de dépendance envers un fournisseur | **Pérennité** non garantie des services gérés par des tiers (URL qui change, service arrêté) |
| | La standardisation impose une **simplification** de la richesse des données échangées |

Ces architectures exigent aussi une **documentation** soignée : métadonnées des données et des services, et interfaces standardisées. Sans cela, impossible de mettre en commun des sources gérées par de nombreux intervenants.

## Types de géoservices

![Portail client s'appuyant sur des services de visualisation, de transformation et de catalogage](img/types-geoservices.png)

*Figure : un portail combine plusieurs types de services.*

| Type de service | Rôle | Standards / exemples |
|---|---|---|
| **Recherche** | Trouver des données ou des services | Recherche de geo.admin.ch, géocodage |
| **Catalogue** | Annoncer l'existence de données et de services, gérer leurs métadonnées | **CSW** (*Catalogue Service for the Web*), geocat.ch, **STAC** |
| **Visualisation** | Afficher les données sous forme de carte, pour une première évaluation | **WMS**, **WMTS** |
| **Téléchargement** (accès aux données) | Accéder aux objets eux-mêmes, avec géométrie et attributs | **WFS**, OGC API – Features, téléchargement de fichiers |
| **Transformation** (traitement) | Traiter les données à distance | Transformation de coordonnées (p. ex. REFRAME de swisstopo), WPS / OGC API – Processes |

!!! note "Catalogues en Suisse"
    [geocat.ch](https://www.geocat.ch) est le catalogue de métadonnées géographiques suisse. Il expose ses métadonnées notamment via le standard **CSW**, ce qui permet à un SIG de rechercher des données directement dans le catalogue.

## WMS – Web Map Service

Le **WMS** est un standard OGC qui permet de **produire dynamiquement des cartes** à partir de données géoréférencées. Le serveur WMS lit les données, les dessine avec une symbologie donnée et renvoie une **image** (PNG, JPEG…). Le client, lui, ne reçoit que des pixels : il ne connaît pas les objets eux-mêmes.

Usages typiques :

- voir à quoi ressemble un jeu de données ;
- superposer des couches provenant de **serveurs différents** (les formats avec transparence, comme le PNG, le permettent).

![Requêtes WMS : GetCapabilities, GetMap, GetFeatureInfo](img/wms-requetes.png)

*Figure : les trois requêtes principales d'un WMS. Source : [17]*

| Requête | Réponse |
|---|---|
| `GetCapabilities` | Document XML décrivant le service et ses couches |
| `GetMap` | Une image de la carte pour une emprise, une taille et des couches données |
| `GetFeatureInfo` (optionnelle) | Les attributs des objets à l'endroit cliqué |

### Exemple : le WMS de la Confédération

Requête `GetCapabilities` :

```text
https://wms.geo.admin.ch/?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities
```

Requête `GetMap` pour la carte nationale en couleur autour de Berne, en MN95 :

```text
https://wms.geo.admin.ch/?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap
    &LAYERS=ch.swisstopo.pixelkarte-farbe
    &STYLES=
    &CRS=EPSG:2056
    &BBOX=2596000,1197000,2603000,1203000
    &WIDTH=700&HEIGHT=600
    &FORMAT=image/png
```

*(L'URL doit être écrite sur une seule ligne ; elle est coupée ici pour la lisibilité.)*

| Paramètre | Signification |
|---|---|
| `SERVICE`, `VERSION`, `REQUEST` | Type de service, version de la norme, nom de la requête |
| `LAYERS` | Couche(s) demandée(s), séparées par des virgules |
| `STYLES` | Style de chaque couche (vide = style par défaut) |
| `CRS` | Système de coordonnées de la requête (ici MN95) |
| `BBOX` | Emprise : x min, y min, x max, y max (ici E et N en mètres) |
| `WIDTH`, `HEIGHT` | Taille de l'image en pixels |
| `FORMAT` | Format de l'image renvoyée |

![Extrait de carte nationale autour de Berne renvoyé par GetMap](img/wms-getmap-berne.jpg)

*Figure : réponse de la requête GetMap ci-dessus. Source : © swisstopo, wms.geo.admin.ch*

!!! warning "Ordre des axes en WMS 1.3.0"
    En WMS 1.3.0, l'ordre des coordonnées dans `BBOX` suit la définition du système de coordonnées. Pour EPSG:2056, c'est E puis N, sans surprise ; mais pour EPSG:4326 (WGS84), c'est **latitude puis longitude**. Source fréquente d'images vides !

??? question "Testez-vous"
    Copiez la requête GetMap dans votre navigateur, puis modifiez `BBOX` pour afficher votre lieu de travail. Que se passe-t-il si `WIDTH`/`HEIGHT` n'ont pas les mêmes proportions que la `BBOX` ?

    *Réponse : l'image est déformée, car le serveur remplit exactement la taille demandée avec l'emprise demandée.*

## WMTS – Web Map Tile Service

Le WMS calcule une nouvelle image à chaque requête, ce qui est coûteux pour le serveur. Le **WMTS** est un standard OGC né de l'usage très répandu des **tuiles** : des images de taille fixe (souvent 256 × 256 pixels) **précalculées** pour une série d'échelles fixes. Le serveur n'a plus qu'à renvoyer des fichiers déjà prêts, ce qui est très rapide et facile à mettre en cache.

![Pyramide de tuiles WMTS : peu de tuiles à petite échelle, beaucoup à grande échelle](img/wmts-pyramide-tuiles.png)

*Figure : la pyramide de tuiles prédéfinies d'un WMTS. Source : [18]*

### Vocabulaire

| Terme | Signification |
|---|---|
| `TileMatrixSet` | La pyramide complète, liée à un système de coordonnées (p. ex. `2056`, `3857`) |
| `TileMatrix` | Un niveau de la pyramide, correspondant à une échelle (niveau de zoom) |
| `TileRow` | Numéro de **ligne** de la tuile, compté selon l'axe **vertical (Y)**, depuis le haut |
| `TileCol` | Numéro de **colonne** de la tuile, compté selon l'axe **horizontal (X)**, depuis la gauche |

### GetCapabilities

En style REST :

```text
https://{URL-de-base}/{Version}/WMTSCapabilities.xml
```

Exemple pour les tuiles de geo.admin.ch en MN95 :

```text
https://wmts.geo.admin.ch/EPSG/2056/1.0.0/WMTSCapabilities.xml
```

La réponse est un document XML qui décrit les couches, les `TileMatrixSet` disponibles, l'origine et la résolution de chaque niveau, ainsi que le **modèle d'URL** des tuiles.

### GetTile

Paramètres d'une requête `GetTile` :

- `Layer` : nom de la couche (obligatoire) ;
- `Style` : style prédéfini mis à disposition par le service (obligatoire) ;
- `Dimensions` : zéro, une ou plusieurs dimensions supplémentaires, par exemple le temps (date de mise à jour, année d'une série historique) ;
- `TileMatrixSet`, `TileMatrix`, `TileRow`, `TileCol` : position de la tuile dans la pyramide (obligatoires) ;
- `Format` : format d'image renvoyé (obligatoire).

Sur geo.admin.ch, en style REST, ces paramètres sont placés dans le chemin de l'URL :

```text
https://wmts.geo.admin.ch/1.0.0/{Layer}/{Style}/{Time}/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.{Format}
```

Ce que l'on écrit souvent de façon abrégée :

```text
https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/2056/{z}/{x}/{y}.jpeg
```

avec `{z}` = `TileMatrix` (niveau de zoom), `{x}` = `TileCol` (colonne) et `{y}` = `TileRow` (ligne). Une tuile concrète :

```text
https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/2056/20/58/70.jpeg
```

![Tuile de 256 × 256 pixels de la carte nationale, région du Gibloux](img/wmts-tuile-2056.jpg)

*Figure : la tuile renvoyée (niveau 20, colonne 58, ligne 70). Source : © swisstopo, wmts.geo.admin.ch*

!!! warning "Attention à l'ordre des numéros"
    Dans l'URL de geo.admin.ch, la **colonne** (`TileCol`, X) vient **avant** la **ligne** (`TileRow`, Y). D'autres services utilisent un autre ordre : référez-vous toujours au modèle d'URL (`ResourceURL`) donné dans le GetCapabilities. De même, les numéros de niveaux et de tuiles valides dépendent du `TileMatrixSet` : ceux du système 2056 ne sont pas ceux du système 3857 (« Web Mercator », utilisé par la plupart des cartes web mondiales).

### 🧵 Fil rouge : la tuile d'Yverdon en WMS et en WMTS

Interrogeons les services de la Confédération sur la tuile **2538-1180** du fil rouge. Pour le **WMS**, la requête `GetMap` porte exactement sur l'emprise de la tuile (`BBOX=2538000,1180000,2539000,1181000` en MN95) : changez la couche, le format ou la taille, et le serveur **dessine** une nouvelle image. Pour le **WMTS**, on ne choisit plus l'emprise : on calcule l'**adresse** de la tuile précalculée qui contient Yverdon, et elle change avec le niveau de zoom.

<div class="demo" data-demo="getmap"></div>

*Les URL affichées sont de vraies requêtes : copiez-les dans votre navigateur. Couches © swisstopo, OFS.*

!!! tip "À vous de jouer, sans installation : WMS et WMTS dans GeoLibre"

    [GeoLibre](https://web.geolibre.app) (à ouvrir dans **Chrome**) est un SIG qui fonctionne dans le navigateur (voir [chapitre 2](../02-raster/README.md#fil-rouge-un-kilometre-carre-a-yverdon-les-bains)). Il suffit pour tester les services de la Confédération :

    **WMS** — *Add Data › WMS Layer* :

    1. *Service URL* : `https://wms.geo.admin.ch/`, puis cliquez sur **Retrieve layers**. GeoLibre envoie une requête **GetCapabilities** et liste les quelque 900 couches disponibles.
    2. *Layers* : par exemple `ch.kantone.cadastralwebmap-farbe` (plan cadastral), version 1.3.0, format PNG.
    3. Cliquez sur *Add layer* et zoomez sur une commune : chaque déplacement de la carte déclenche des requêtes **GetMap**.

    **WMTS** — *Add Data › WMTS Layer* : GeoLibre attend directement le **modèle d'URL** des tuiles (approche REST) :
    ```text
    https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg
    ```
    Notez le `TileMatrixSet` **3857** : comme la plupart des cartes web, GeoLibre affiche la carte en Web Mercator et ne peut donc pas utiliser la pyramide de tuiles en 2056. geo.admin.ch publie heureusement ses couches dans les deux systèmes.

    Ouvrez les outils de développement du navigateur (touche F12, onglet *Réseau*) pour **voir passer les requêtes** GetMap et les tuiles.

## WFS – Web Feature Service

Un **WFS** renvoie des **données vectorielles** : les objets eux-mêmes, avec leur géométrie et leurs attributs, et non une image. C'est donc un service de **téléchargement** : le client peut analyser, filtrer ou réutiliser les données.

Le standard définit trois niveaux d'opérations :

1. obtenir les métadonnées du service (`GetCapabilities`) et la structure des classes d'objets (`DescribeFeatureType`) ;
2. obtenir les objets eux-mêmes (`GetFeature`), éventuellement filtrés (emprise, attribut) ;
3. *(optionnel)* **modifier** les données : insérer, mettre à jour, supprimer des objets (`Transaction`).

Les deux premiers niveaux forment un WFS de base ; un service qui offre aussi le troisième est souvent appelé **WFS-T** (T pour *Transaction*). Il permet par exemple à des utilisateurs de terrain de saisir des objets directement dans une base centrale.

### GetCapabilities

```text
https://{serveur}/{chemin}?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetCapabilities
```

Avec :

- `SERVICE` = nom du service, ici **WFS** ;
- `VERSION` = version de la norme (souvent 2.0.0, parfois 1.1.0) ;
- `REQUEST` = nom de la requête, ici **GetCapabilities**.

La réponse est un document XML décrivant le service et la liste des classes d'objets (*feature types*) disponibles.

### GetFeature

Exemple générique (serveur fictif) qui demande au plus 100 bâtiments dans une emprise, au format GeoJSON :

```text
https://geo.exemple.ch/wfs?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature
    &TYPENAMES=batiments
    &BBOX=2537000,1151000,2539000,1153000,urn:ogc:def:crs:EPSG::2056
    &COUNT=100
    &OUTPUTFORMAT=application/json
```

Le format de sortie par défaut d'un WFS est le **GML** (XML) ; d'autres formats, comme GeoJSON, sont proposés selon le serveur (voir la liste dans le GetCapabilities).

!!! note "Où trouver des WFS ?"
    De nombreux géoportails cantonaux et communaux publient leurs données en WFS ; les adresses figurent dans leurs pages « géoservices » et dans [geocat.ch](https://www.geocat.ch). Les adresses changent parfois : vérifiez toujours qu'un service est encore actif avant de l'utiliser dans un projet.

## Tuiles vectorielles (vector tiles)

Les **tuiles vectorielles** reprennent le principe des tuiles raster du WMTS (une grille, des niveaux de zoom), mais chaque tuile contient des **données vectorielles** (géométries et attributs) découpées selon la grille, au lieu d'une image.

![Principe des tuiles vectorielles : un jeu vectoriel est découpé selon une grille de tuiles](img/vector-tiles-principe.png)

*Figure : découpage d'un jeu de données vectoriel en tuiles. Source : [20]*

Le format le plus répandu est le **Mapbox Vector Tile** (MVT, extension `.pbf` ou `.mvt`), un format binaire compact. Le standard **OGC API – Tiles** définit une manière normalisée de diffuser des tuiles, raster ou vectorielles.

Caractéristiques principales :

- **le style est appliqué par le client** : la même tuile peut être affichée en couleur, en gris, avec ou sans étiquettes… sans rien recalculer côté serveur ;
- **affichage net à toutes les résolutions** (écrans haute densité, rotation et inclinaison de la carte) ;
- **volume souvent plus faible** que les tuiles raster équivalentes ;
- **interactivité** : le client connaît les objets et peut les interroger (clic, survol, filtre).

En contrepartie, le client doit faire plus de travail (dessin des objets) et les données sont généralisées selon le niveau de zoom : ce ne sont pas des données de référence pour des mesures précises.

swisstopo propose des **fonds de carte en tuiles vectorielles** ([vectortiles.geo.admin.ch](https://www.geo.admin.ch/de/vector-tiles-service-verfuegbare-dienste-und-daten/)), utilisables avec des styles prêts à l'emploi ou personnalisés.

## Diffuser sans serveur cartographique

Les géoservices WMS, WMTS ou WFS nécessitent un **serveur cartographique** : un logiciel qui tourne en permanence et calcule les réponses. Une approche plus récente, dite ***cloud-native***, s'en passe : on dépose simplement des **fichiers** sur un serveur web ordinaire ou un **stockage objet** (Amazon S3, Azure Blob Storage, Google Cloud Storage, voire GitHub Pages), et c'est le **client** (QGIS, GeoLibre, un navigateur, DuckDB…) qui va lire **uniquement la partie dont il a besoin**.

Deux ingrédients rendent cela possible :

1. les **requêtes HTTP partielles** (*range requests*) : le client demande « les octets 120'000 à 180'000 du fichier » au lieu du fichier entier ;
2. une **organisation interne** du fichier qui permet de savoir où se trouvent les données utiles : en-tête ou pied de fichier qui sert d'index, index spatial, blocs (tuiles, *chunks*, groupes de lignes).

Vous connaissez déjà ces formats ; ce tableau rappelle seulement leur rôle dans la diffusion :

| Format | Type | Ce que le client lit à distance | Voir |
|---|---|---|---|
| **COG** | raster | les tuiles et l'aperçu de la zone affichée | [chapitre 2](../02-raster/README.md#cloud-optimized-geotiff-cog) |
| **Zarr** | raster multidimensionnel | les blocs (*chunks*) d'une date, d'une variable | [chapitre 2](../02-raster/README.md#zarr) |
| **FlatGeobuf** | vecteur | les objets de l'emprise, grâce à l'index spatial | [chapitre 3](../03-vecteur/README.md#formats-recents-flatgeobuf-geoparquet-et-pmtiles) |
| **GeoParquet** | vecteur, tableau | les colonnes et groupes de lignes utiles à la requête | [chapitre 3](../03-vecteur/README.md#formats-recents-flatgeobuf-geoparquet-et-pmtiles) |
| **PMTiles** | tuiles (vecteur ou raster) | les tuiles du niveau de zoom et de l'emprise | [chapitre 3](../03-vecteur/README.md#formats-recents-flatgeobuf-geoparquet-et-pmtiles) |
| **COPC** | nuage de points | les points de la zone et du niveau de détail | [chapitre 4](../04-3d-nuages-de-points/README.md#les-formats) |
| **GeoJSON**, **JSON-FG** | vecteur, texte | tout le fichier : simple, mais réservé aux petits volumes | [chapitre 5](../05-xml-json/README.md#geojson) |

Pour **trouver** ces fichiers, on les décrit dans un **catalogue STAC** (voir [plus bas](#stac-un-catalogue-pour-les-donnees-spatio-temporelles)) : c'est lui qui joue le rôle du GetCapabilities.

### Notre propre site, un exemple de diffusion sans serveur

Ce cours est publié par **GitHub Pages**, un hébergement de fichiers statiques : il n'y a aucun serveur cartographique derrière. Pourtant, les données des chapitres précédents s'y consultent comme un service.

!!! warning "Attention au serveur web"
    Pour les lectures partielles, le serveur doit renvoyer les **octets d'origine** du fichier. Or GitHub Pages compresse à la volée (gzip) les fichiers binaires demandés par un navigateur : les requêtes partielles portent alors sur le flux compressé, et le client reçoit des octets illisibles (DuckDB signale par exemple *No magic bytes found at end of file*). Les adresses ci-dessous passent donc par **raw.githubusercontent.com**, qui sert les mêmes fichiers du dépôt sans les compresser. Avant de diffuser des fichiers *cloud-native*, testez toujours une requête partielle depuis un navigateur.

!!! example "🧪 À vous de jouer : les communes vaudoises sur le web"

    **FlatGeobuf dans GeoLibre** — *Add Data › Vector Layer*, collez l'adresse puis *Load* :
    ```text
    https://raw.githubusercontent.com/regislon/cfgeo_B4/main/formats-interfaces/03-vecteur/donnees/communes_vd.fgb
    ```
    Les communes s'affichent, reprojetées à la volée depuis le MN95.

    **PMTiles dans un visualiseur web** — ouvrez [pmtiles.io](https://pmtiles.io/?url=https://raw.githubusercontent.com/regislon/cfgeo_B4/main/formats-interfaces/03-vecteur/donnees/communes_vd.pmtiles) : la carte est dessinée à partir des tuiles, téléchargées au fur et à mesure du zoom. Observez la simplification des limites communales quand on dézoome.

    **GeoParquet interrogé en SQL** — ouvrez le [shell DuckDB en ligne](https://shell.duckdb.org) (rien à installer ; ou DuckDB installé sur votre ordinateur, ou le *SQL Workspace* de GeoLibre), collez la requête, puis pressez Entrée. Elle lit directement le fichier en ligne :
    ```sql
    SELECT name, einwohnerzahl
    FROM 'https://raw.githubusercontent.com/regislon/cfgeo_B4/main/formats-interfaces/03-vecteur/donnees/communes_vd.parquet'
    ORDER BY einwohnerzahl DESC
    LIMIT 5;
    ```
    ```text
    ┌───────────────────┬───────────────┐
    │       name        │ einwohnerzahl │
    ├───────────────────┼───────────────┤
    │ Lausanne          │        144873 │
    │ Yverdon-les-Bains │         30292 │
    │ Montreux          │         26955 │
    │ Nyon              │         23351 │
    │ Renens (VD)       │         21541 │
    └───────────────────┴───────────────┘
    ```
    Grâce au stockage par colonnes, DuckDB ne lit que les colonnes `name` et `einwohnerzahl`, sans télécharger les géométries.

    Ouvrez l'onglet *Réseau* des outils de développement (F12) pendant ces essais pour voir les requêtes partielles.

### Overture Maps : une base de données mondiale, sans API

La **[Overture Maps Foundation](https://overturemaps.org/)** (Linux Foundation, avec Amazon, Meta, Microsoft, TomTom…) publie une carte du monde ouverte : bâtiments, routes, lieux, adresses, limites administratives. Elle n'offre **ni WMS, ni WFS, ni API** : uniquement des **fichiers GeoParquet** sur Amazon S3 et Azure, mis à jour chaque mois. Le thème « bâtiments » de la version 2026-10-21 compte à lui seul **512 fichiers et 277 Go**.

Pour en extraire les bâtiments du canton de Vaud, une seule requête **DuckDB** suffit, lancée depuis un ordinateur portable, sans rien télécharger au préalable :

```sql
INSTALL spatial; LOAD spatial; INSTALL httpfs; LOAD httpfs;
SET s3_region = 'us-west-2';

COPY (
  SELECT id, subtype, class, height, num_floors,
         sources[1].dataset AS source, geometry
  FROM read_parquet('s3://overturemaps-us-west-2/release/2026-10-21.0/theme=buildings/type=building/*')
  WHERE bbox.xmin < 7.25 AND bbox.xmax > 6.06      -- rectangle englobant le canton
    AND bbox.ymin < 46.99 AND bbox.ymax > 46.18
) TO 'vaud_raw.parquet' (FORMAT parquet, COMPRESSION zstd);
```

Résultat : **665'727 bâtiments en 3 min 22 s**. DuckDB lit d'abord le **pied** de chaque fichier Parquet, qui contient les valeurs minimales et maximales de `bbox` pour chaque groupe de lignes, et ne télécharge que les groupes qui touchent le rectangle. Une seconde requête (jointure spatiale avec les communes du [chapitre 3](../03-vecteur/README.md), reprojection en MN95) ne garde que les **216'994 bâtiments situés dans le canton** et produit un fichier de **6,7 Mo** : c'est lui que nous allons interroger.

!!! info "Licences"
    Les bâtiments d'Overture proviennent surtout d'**OpenStreetMap** et, pour environ 10 % d'entre eux dans le canton, de la détection automatique de **Microsoft** (*ML Buildings*). Ils sont diffusés sous licence **ODbL** : réutilisation libre, avec mention des sources et partage à l'identique des bases dérivées. Les lieux (*places*) sont sous **CDLA Permissive 2.0**, sauf ceux issus de Foursquare, sous **Apache 2.0**. Une même diffusion peut donc mélanger plusieurs licences : c'est le niveau **juridique** de l'interopérabilité vu au [chapitre 6](../06-interoperabilite-normes/README.md#licences-le-droit-dutiliser-les-donnees).

### ▶ Du « big data » dans le navigateur avec DuckDB

**[DuckDB](https://duckdb.org)** est une base de données d'analyse qui tient dans un seul programme et lit directement les fichiers Parquet, CSV ou JSON, en local ou sur le web. Sa version **WebAssembly** tourne dans une page web. La démo ci-dessous interroge l'extrait vaudois (6,7 Mo) hébergé sur ce site : choisissez une requête ou écrivez la vôtre, et observez la barre jaune. Elle indique la **part du fichier réellement téléchargée** : grâce au stockage par colonnes et aux groupes de lignes, une requête sur la hauteur ne lit pas les noms des communes, et une requête sur une commune ne lit que les groupes de lignes qui la contiennent.

<div class="demo" data-demo="duckdb" data-src="donnees/batiments_vd_overture.parquet"></div>

*Données : [Overture Maps Foundation](https://overturemaps.org/), version 2026-10-21 ; © OpenStreetMap contributors, Microsoft ; licence ODbL. Extrait préparé pour ce cours : [`batiments_vd_overture.parquet`](donnees/batiments_vd_overture.parquet).*

!!! question "🧵 Fil rouge : qui a raison ?"
    Lancez la requête « Fil rouge ». Sur la tuile 2538-1180, Overture compte **564 bâtiments**, contre **392** pour swissBUILDINGS3D (même règle : centroïde du bâtiment dans la tuile). Pourquoi une telle différence ? Pistes : OpenStreetMap découpe souvent un bâtiment en plusieurs parties (annexes, garages, abris) ; les deux jeux n'appliquent pas les mêmes règles de saisie (taille minimale, bâtiments souterrains ou en construction) ; ils n'ont pas la même date. Aucun n'est « faux » : ils n'ont pas la même **définition** d'un bâtiment. C'est exactement la question sémantique du [schema mapping](../07-echange-de-donnees/README.md#schema-mapping).

    Lancez aussi la requête « plus de 50 m » : certains objets mesurent plus de 120 m. Situez-les avec leurs coordonnées MN95 sur [map.geo.admin.ch](https://map.geo.admin.ch) : s'agit-il vraiment de bâtiments ? Une donnée ouverte et collaborative se **contrôle** avant d'être utilisée.

### ▶ En direct : interroger le fichier mondial sur Amazon S3

Pour aller plus loin, DuckDB peut interroger **directement** les fichiers d'Overture sur Amazon S3, sans extrait préparé. Les lieux (*places*) du monde entier tiennent dans 16 fichiers ; celui qui contient Yverdon pèse **713 Mo**. Le bouton ci-dessous cherche les lieux autour d'Yverdon dans ce fichier : DuckDB lit le pied du fichier, repère les groupes de lignes dont le `bbox` touche l'emprise, et ne télécharge qu'**environ 5 Mo**, moins de 1 % du fichier.

<div class="demo" data-demo="overture"></div>

*Données : Overture Maps Foundation, thème places ; licences CDLA Permissive 2.0 et Apache 2.0. La vitesse dépend de votre connexion : comptez quelques secondes.*

### Services ou fichiers ?

Les deux approches coexistent ; le choix dépend des données et des utilisateurs.

| Critère | Géoservice (WMS, WFS, OGC API) | Fichiers *cloud-native* |
|---|---|---|
| Infrastructure | serveur cartographique à maintenir | stockage web ordinaire, aucun logiciel serveur |
| Coût | serveur, licences, exploitation | stockage et trafic, souvent très faibles |
| Mise à jour | immédiate, objet par objet (WFS-T) | on republie un fichier (version datée) |
| Filtrage | par le serveur, selon les paramètres de la requête | par le client, qui ne lit que les blocs utiles |
| Sécurité, droits d'accès | fins (par couche, par utilisateur) | tout ou rien sur le fichier |
| Calcul | côté serveur (rendu de carte, traitements) | côté client (navigateur, DuckDB, QGIS) |
| Standards | OGC (WMS, WFS, OGC API) | formats ouverts (GeoParquet, COG…) et STAC ; pas de protocole de requête |
| Idéal pour | données qui changent souvent, accès contrôlé, cartes prêtes à l'emploi | données stables ou versionnées, gros volumes, analyses |

Les grands producteurs combinent les deux : swisstopo publie ses géodonnées à la fois par des **services** (WMS, WMTS, API) et par des **fichiers** téléchargeables décrits dans son **catalogue STAC** (COG, GeoPackage…). Overture, à l'inverse, ne publie que des fichiers.

## OGC API : la nouvelle génération

Les standards WMS, WFS, WMTS ou CSW (souvent regroupés sous le nom **WxS**) datent des années 2000 : ils reposent sur des requêtes KVP et des réponses XML. Depuis 2019, l'OGC publie une nouvelle famille de standards, les **[OGC API](https://ogcapi.ogc.org/)**, conçues selon les pratiques actuelles du web :

- architecture **REST** : chaque ressource (collection, objet, tuile) a sa propre URL ;
- réponses en **JSON**/**GeoJSON** (et HTML pour la consultation dans un navigateur) ;
- description de l'API au format **OpenAPI**, lisible par des outils de développement ;
- standards **modulaires** : un noyau commun, des extensions à la carte.

| OGC API | Rôle | Successeur de |
|---|---|---|
| **OGC API – Features** | Accès aux objets vectoriels | WFS |
| **OGC API – Tiles** | Diffusion de tuiles raster ou vectorielles | WMTS |
| **OGC API – Maps** | Génération de cartes (images) | WMS |
| **OGC API – Processes** | Exécution de traitements à distance | WPS |
| **OGC API – Records** | Catalogue de métadonnées | CSW |

Exemple de requêtes typiques d'une OGC API – Features (serveur fictif) :

```text
https://geo.exemple.ch/ogcapi/collections                        → liste des collections
https://geo.exemple.ch/ogcapi/collections/batiments/items?limit=10 → 10 bâtiments en GeoJSON
https://geo.exemple.ch/ogcapi/collections/batiments/items/42      → le bâtiment n° 42
```

!!! note
    Les services WxS restent très utilisés et ne vont pas disparaître rapidement. QGIS sait lire les deux familles.

## STAC : un catalogue pour les données spatio-temporelles

**[STAC](https://stacspec.org/)** (*SpatioTemporal Asset Catalog*) est une spécification ouverte pour **décrire et rechercher** des fichiers de géodonnées (images aériennes, MNT, nuages de points, mosaïques…) selon leur emprise et leur date. Elle repose sur GeoJSON et s'intègre à OGC API – Features.

Structure d'un catalogue STAC :

- **Catalog** : le point d'entrée ;
- **Collection** : un produit (p. ex. SWISSIMAGE 10 cm) ;
- **Item** : une unité géographique et temporelle (p. ex. une dalle de 1 km² pour une année) ;
- **Asset** : le fichier téléchargeable lui-même (GeoTIFF, LAZ…).

La Confédération diffuse ses données en téléchargement via une API STAC sur **data.geo.admin.ch** :

```text
https://data.geo.admin.ch/api/stac/v1/
https://data.geo.admin.ch/api/stac/v1/collections/ch.swisstopo.swissimage-dop10/items?bbox=7.43,46.94,7.45,46.95
```

La seconde requête renvoie, en GeoJSON, les dalles SWISSIMAGE qui touchent l'emprise demandée (en WGS84), avec pour chacune les liens de téléchargement des fichiers.

!!! tip "À vous de jouer : parcourir le catalogue STAC de swisstopo"

    Dans [GeoLibre](https://web.geolibre.app) (à ouvrir dans **Chrome**), ouvrez *Add Data › STAC Layer*, saisissez `https://data.geo.admin.ch/api/stac/v1/` et cliquez sur *Connect*. GeoLibre liste les collections du catalogue ; zoomez sur votre région et laissez cochée l'option *Limit search to the current map extent* pour ne rechercher que les items visibles. Comparez avec la réponse brute de la requête ci-dessus dans votre navigateur : c'est le même JSON, mis en forme par le logiciel.

    Autre exemple de catalogue STAC, cette fois pour des données **multidimensionnelles** au format Zarr : la [démo de prévisions météo](../02-raster/README.md#zarr) du chapitre 2.

## Et demain ?

- **Une plateforme unique** : selon la Confédération (mai 2026), le Géoportail fédéral, qui compte désormais plus de 1'000 jeux de données, doit fusionner progressivement avec le portail des cantons (geodienste.ch) et d'autres portails dans une plateforme unique, **SWISSGEO**.
- **Des interfaces pour les agents IA** : après les services pour les logiciels (WMS, OGC API) et les fichiers pour les clients d'analyse, apparaissent des interfaces conçues pour les **agents IA**, comme les serveurs MCP. swisstopo en teste un prototype ; voir le [chapitre 7](../07-echange-de-donnees/README.md#agents-ia-acces-aux-donnees-et-schema-mapping).

## Testez-vous

<div class="demo" data-demo="quiz" data-quiz="geoservices"></div>

## À retenir

- Un **géoservice** (LGéo) donne accès à des géodonnées par le réseau, sous une **forme structurée** définie par des normes (OGC).
- Principe : **GetCapabilities** (que sait faire le service ?) puis **requête de données**.
- Les architectures orientées services offrent des données **à jour** et **partagées**, au prix d'une **dépendance au réseau** et aux fournisseurs.
- **WMS** → image calculée à la demande ; **WMTS** → tuiles précalculées (`TileRow` = ligne/Y, `TileCol` = colonne/X) ; **WFS** → objets vectoriels (WFS-T : modification).
- **Tuiles vectorielles** : géométries découpées en tuiles, stylées par le client.
- **OGC API** (Features, Tiles, Maps, Processes, Records) : successeurs REST/JSON des WxS. **STAC** : catalogue de fichiers, utilisé par data.geo.admin.ch.
- **Sans serveur cartographique** : des fichiers *cloud-native* (COG, GeoParquet, FlatGeobuf, PMTiles, COPC) sur un stockage web, lus par morceaux grâce aux **requêtes HTTP partielles**. Exemple : Overture Maps, diffusé uniquement en GeoParquet.
- **DuckDB** interroge en SQL des fichiers Parquet locaux ou distants, même dans le navigateur, en ne lisant que les colonnes et blocs utiles.
- Services et fichiers sont **complémentaires** : mises à jour et droits d'accès fins d'un côté, simplicité et faible coût de l'autre.

## Sources

- [17] [Web Map Service (WMS) – wiki GeoRezo](https://georezo.net/wiki/main/standards/wms)
- [18] [QGIS comme client de données OGC – documentation QGIS](https://docs.qgis.org/latest/fr/docs/user_manual/working_with_ogc/ogc_client_support.html)
- [19] [GeoAdmin API 3.0 – services (WMTS, GetTile)](https://api3.geo.admin.ch/services/sdiservices.html)
- [20] [geometalab – Vector Tiles: The Web Mapping Technology of the Future?](https://geometalab.tumblr.com/post/169813788729/vector-tiles-the-web-mapping-technology-of-the)
- [Loi fédérale sur la géoinformation (LGéo, RS 510.62)](https://www.fedlex.admin.ch/eli/cc/2008/388/fr)
- [OGC API – site officiel](https://ogcapi.ogc.org/)
- [Cloud-Native Geospatial Formats Guide](https://guide.cloudnativegeo.org/)
- [STAC – SpatioTemporal Asset Catalog](https://stacspec.org/)
- [Documentation de geo.admin.ch](https://docs.geo.admin.ch/)
- [Service de tuiles vectorielles de geo.admin.ch](https://www.geo.admin.ch/de/vector-tiles-service-verfuegbare-dienste-und-daten/)
- [Overture Maps – documentation](https://docs.overturemaps.org/) et [notes de version (licences)](https://docs.overturemaps.org/release-notes/)
- [DuckDB](https://duckdb.org/) et [DuckDB-WASM](https://github.com/duckdb/duckdb-wasm)
- [Le Géoportail fédéral compte 1000 jeux de données (communiqué, 18.05.2026)](https://www.admin.ch/de/newnsb/-vbSMQwry06iCR89upt44)

## Exercices

- [Un même territoire, quatre accès](../exercices/ex12-quatre-acces/README.md)

---

← [Échange de données](../07-echange-de-donnees/README.md) · [Reformatage et ETL](../09-reformatage-etl/README.md) →
