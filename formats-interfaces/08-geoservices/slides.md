---
marp: true
theme: cfgeo
paginate: true
footer: CFGéo B4 · Formats, interfaces · 8. Géoservices (GeoWeb)
---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 Lire le chapitre](./)' -->
<!-- _class: lead -->
<!-- _paginate: false -->

# 8. Géoservices (GeoWeb)

Module B4 « Géomatique & TI » — Formats, interfaces

---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 Objectifs](./#objectifs)' -->
## Objectifs

- Expliquer le fonctionnement d'un géoservice
- Citer avantages et limites d'une architecture orientée services
- Interroger un service WMS, WMTS ou WFS
- Connaître les OGC API et les catalogues (STAC)

---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 Services web et géoservices](./#services-web-et-geoservices)' -->
## Service web, géoservice

- **Service web** : des applications dialoguent à distance via HTTP(S), quels que soient plateforme et langage
- **Géoservice** : service web avec une composante géographique
- LGéo, art. 3 : application **mise en réseau** donnant accès aux géodonnées **sous une forme structurée**
- Forme structurée = **normes OGC** : WMS, WMTS, WFS, CSW, OGC API…

---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 Principe de fonctionnement](./#principe-de-fonctionnement)' -->
## Principe : Capabilities d'abord

![w:900](img/principe-getcapabilities.png)

1. `GetCapabilities` → 2. document XML (le « mode d'emploi »)
3. Requête de données → 4. données au format demandé

---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 KVP et REST](./#kvp-et-rest)' -->
## KVP ou REST ?

- **KVP** : paramètres après `?`, séparés par `&`

```text
https://wms.geo.admin.ch/?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities
```

- **REST** : une URL par ressource, comme un chemin

```text
https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/2056/20/58/70.jpeg
```

---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 Architecture orientée services](./#du-modele-traditionnel-a-larchitecture-orientee-services)' -->
## Architecture orientée services (SOA)

![bg right:45% w:500](img/architecture-distribuee.png)

- Plus besoin de **posséder** une copie des données
- Les données restent chez le producteur
- Services standardisés → géoportails, SIG
- Ex. : map.geo.admin.ch, géoportails cantonaux

---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 Avantages et inconvénients](./#avantages-et-inconvenients)' -->
## Avantages et inconvénients

| ✅ Avantages | ❌ Inconvénients |
|---|---|
| Données toujours à jour | Dépendance au réseau |
| Un service réutilisé partout | Sécurité |
| Systèmes hétérogènes combinés | Pérennité des services tiers |
| | Simplification des données |

---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 Types de géoservices](./#types-de-geoservices)' -->
## Types de géoservices

| Type | Exemples |
|---|---|
| Recherche | recherche geo.admin.ch, géocodage |
| Catalogue | **CSW** (geocat.ch), **STAC** |
| Visualisation | **WMS**, **WMTS** |
| Téléchargement | **WFS**, OGC API – Features |
| Transformation | REFRAME, WPS / OGC API – Processes |

---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 Types de géoservices](./#types-de-geoservices)' -->
<!-- _class: lead -->

# WMS, WMTS, WFS

---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 WMS – Web Map Service](./#wms-web-map-service)' -->
## WMS – Web Map Service

![bg right:45% w:520](img/wms-requetes.png)

- Le serveur **dessine** une image à chaque requête
- Le client ne reçoit que des **pixels**
- `GetCapabilities`, `GetMap`, `GetFeatureInfo`
- Superposer des couches de serveurs différents (PNG transparent)

---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 Exemple : le WMS de la Confédération](./#exemple-le-wms-de-la-confederation)' -->
## WMS – une requête GetMap

```text
https://wms.geo.admin.ch/?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap
  &LAYERS=ch.swisstopo.pixelkarte-farbe&STYLES=
  &CRS=EPSG:2056&BBOX=2596000,1197000,2603000,1203000
  &WIDTH=700&HEIGHT=600&FORMAT=image/png
```

![bg right:35% w:380](img/wms-getmap-berne.jpg)

- `LAYERS`, `CRS`, `BBOX`, taille, format
- ⚠️ EPSG:4326 en 1.3.0 : **lat, lon** !

*© swisstopo*

---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 WMTS – Web Map Tile Service](./#wmts-web-map-tile-service)' -->
## WMTS – des tuiles précalculées

![bg right:40% w:420](img/wmts-pyramide-tuiles.png)

- Images de taille fixe (256 × 256 px)
- Échelles fixes → **pyramide**
- Pas de calcul à la volée : **rapide**, facile à mettre en cache
- `TileMatrixSet` = pyramide, `TileMatrix` = niveau

---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 WMTS – Web Map Tile Service](./#wmts-web-map-tile-service)' -->
## WMTS – adresser une tuile

```text
https://wmts.geo.admin.ch/EPSG/2056/1.0.0/WMTSCapabilities.xml
```

```text
.../1.0.0/{Layer}/default/{Time}/2056/{TileMatrix}/{TileCol}/{TileRow}.jpeg
.../1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/2056/{z}/{x}/{y}.jpeg
```

![bg right:30% w:256](img/wmts-tuile-2056.jpg)

- `TileCol` = **colonne** (axe X), `TileRow` = **ligne** (axe Y)
- Ordre : voir `ResourceURL` du GetCapabilities

---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 WMTS – Web Map Tile Service](./#wmts-web-map-tile-service)' -->
## À tester : GeoLibre (navigateur)

**WMS** : *Add Data › WMS Layer*
`https://wms.geo.admin.ch/` → **Retrieve layers** = GetCapabilities (~900 couches)
→ `ch.kantone.cadastralwebmap-farbe` → GetMap à chaque déplacement

**WMTS** : modèle d'URL REST, en **3857** (Web Mercator)
`…/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg`

F12 › *Réseau* : voir passer les requêtes

---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 WFS – Web Feature Service](./#wfs-web-feature-service)' -->
## WFS – Web Feature Service

- Renvoie les **objets** : géométrie + attributs (GML par défaut, parfois GeoJSON)
- `GetCapabilities`, `DescribeFeatureType`, `GetFeature`
- **WFS-T** : `Transaction` → insérer, modifier, supprimer

```text
https://geo.exemple.ch/wfs?SERVICE=WFS&VERSION=2.0.0
  &REQUEST=GetFeature&TYPENAMES=batiments&COUNT=100
```

*Serveur fictif — vérifiez qu'un service réel est encore actif.*

---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 WFS – Web Feature Service](./#wfs-web-feature-service)' -->
## WMS ou WFS ?

| | WMS / WMTS | WFS |
|---|---|---|
| Réponse | Image | Objets vectoriels |
| Usage | Visualiser | Analyser, réutiliser |
| Style | Choisi par le serveur | Choisi par le client |
| Volume | Constant | Dépend du nombre d'objets |

---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 Tuiles vectorielles (vector tiles)](./#tuiles-vectorielles-vector-tiles)' -->
<!-- _class: lead -->

# Tuiles vectorielles et OGC API

---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 Tuiles vectorielles (vector tiles)](./#tuiles-vectorielles-vector-tiles)' -->
## Tuiles vectorielles

![w:900](img/vector-tiles-principe.png)

- Grille de tuiles comme le WMTS, mais contenant des **géométries**
- Format courant : **Mapbox Vector Tile** (`.pbf`) ; standard : OGC API – Tiles
- **Style appliqué par le client**, net à toute résolution, interactif
- swisstopo : fonds de carte vectoriels (vectortiles.geo.admin.ch)

---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 Formats cloud-native : lire sans tout télécharger](./#formats-cloud-native-lire-sans-tout-telecharger)' -->
## Formats *cloud-native*

- Pas de serveur cartographique : de simples **fichiers** sur un serveur web
- Le client lit **seulement ce qu'il faut** : requêtes HTTP **partielles** + index

| Format | Type | Usage |
|---|---|---|
| COG | raster | orthophotos, MNT |
| Zarr | multidimensionnel | climat, météo |
| FlatGeobuf | vecteur | afficher une zone |
| GeoParquet | vecteur | SQL, analyses |
| PMTiles | tuiles | carte web sans serveur |

---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 Formats cloud-native : lire sans tout télécharger](./#formats-cloud-native-lire-sans-tout-telecharger)' -->
## 🧪 GeoParquet + SQL, directement en ligne

```sql
SELECT name, einwohnerzahl
FROM 'https://regislon.github.io/…/communes_vd.parquet'
ORDER BY einwohnerzahl DESC LIMIT 5;
```

Lausanne 144'873 · **Yverdon-les-Bains 30'292** · Montreux 26'955…

- DuckDB ne lit que **2 colonnes**, pas les géométries
- FlatGeobuf → GeoLibre · PMTiles → pmtiles.io
- Services **ou** fichiers ? Données changeantes → services · stables → fichiers
---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 OGC API : la nouvelle génération](./#ogc-api-la-nouvelle-generation)' -->
## OGC API : la nouvelle génération

- **REST** + **JSON/GeoJSON** + description **OpenAPI**

| OGC API | Remplace |
|---|---|
| Features | WFS |
| Tiles | WMTS |
| Maps | WMS |
| Processes | WPS |
| Records | CSW |

---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 OGC API : la nouvelle génération](./#ogc-api-la-nouvelle-generation)' -->
## OGC API – Features en pratique

```text
/collections                         → liste des collections
/collections/batiments/items?limit=10 → 10 objets en GeoJSON
/collections/batiments/items/42       → un objet
```

- Lisible dans un navigateur (HTML/JSON)
- QGIS lit WxS **et** OGC API

---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 STAC : un catalogue pour les données spatio-temporelles](./#stac-un-catalogue-pour-les-donnees-spatio-temporelles)' -->
## STAC – SpatioTemporal Asset Catalog

- Catalogue de **fichiers** décrits par emprise et date
- Catalog → **Collection** → **Item** → **Asset** (fichier)
- data.geo.admin.ch : téléchargement des données fédérales

```text
https://data.geo.admin.ch/api/stac/v1/collections/
  ch.swisstopo.swissimage-dop10/items?bbox=7.43,46.94,7.45,46.95
```

---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 STAC : un catalogue pour les données spatio-temporelles](./#stac-un-catalogue-pour-les-donnees-spatio-temporelles)' -->
## À tester : STAC dans GeoLibre

- *Add Data › STAC Layer*
- `https://data.geo.admin.ch/api/stac/v1/` → *Connect*
- Liste des **collections** swisstopo, recherche limitée à l'emprise de la carte
- Même JSON que la requête brute, mis en forme par le logiciel
- STAC + **Zarr** : démo de prévisions météo (chapitre 2)

---

<!-- _footer: 'CFGéo B4 · 8. Géoservices (GeoWeb) · [📖 À retenir](./#a-retenir)' -->
## À retenir

- Géoservice = accès aux géodonnées **par le réseau**, sous **forme normalisée**
- **GetCapabilities** d'abord, requête de données ensuite
- **WMS** = image à la demande ; **WMTS** = tuiles (`TileCol` X, `TileRow` Y) ; **WFS** = objets
- **Tuiles vectorielles** : stylées par le client
- **OGC API** : successeurs REST/JSON ; **STAC** : catalogue de fichiers
