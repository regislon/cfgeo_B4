# 3. Données vectorielles

[📽 Slides du chapitre](https://regislon.github.io/cfgeo_B4/formats-interfaces/03-vecteur/slides.html)

## Objectifs

À la fin de ce chapitre, vous êtes capables de :

- Connaître les primitives géométriques et les notions de topologie
- Comparer les familles de stockage (fichier simple, multiple, base de données)
- Distinguer codage binaire, texte (ASCII) et XML/JSON d'un format vectoriel
- Citer les caractéristiques et limites des principaux formats (DXF, Shapefile, GeoPackage, GeoJSON, KML, GML…)
- Choisir entre vecteur et raster selon le besoin

## Introduction

La géomatique fait très largement appel aux données **vectorielles** : les objets géographiques y sont décrits par les **coordonnées des points** qui les constituent, complétées par des **attributs**.

Les logiciels de DAO/CAO (AutoCAD, par exemple) comme les SIG (QGIS, ArcGIS) reposent sur cette approche. La frontière entre ces deux mondes est toutefois bien moins marquée qu'auparavant, et de nombreuses applications combinent vecteur et raster.

!!! note "« Format vecteur » ?"

    Par abus de langage, on parle parfois du « format vecteur ». L'expression est incorrecte : il existe de **très nombreux formats** capables de décrire des données vectorielles, chacun avec ses possibilités et ses limites.

## Primitives et géométries

### Les primitives de base

Tous les objets vectoriels sont construits à partir de **primitives géométriques** en 2 ou 3 dimensions :

- le **point** (une paire ou un triplet de coordonnées) ;
- la **ligne** (polyligne), suite de points reliés par des segments ;
- la **surface** (polygone), délimitée par une ligne fermée, avec d'éventuels trous (îlots).

Selon les formats et les logiciels, on trouve aussi des géométries plus complexes : **arcs de cercle**, courbes de Bézier, splines, ainsi que des **géométries multiples** (un objet composé de plusieurs parties, par exemple une commune constituée de plusieurs enclaves). Les coordonnées peuvent porter une altitude **Z** et une valeur de mesure **M**.

La norme *Simple Features* (OGC / ISO 19125) définit une hiérarchie de types de géométries reprise par la plupart des SIG et bases de données.

![Hiérarchie des géométries : Point, Curve/LineString, Surface/Polygon et collections MultiPoint, MultiLineString, MultiPolygon](img/postgis-types-geometries.png)

*Types de géométries supportés par PostGIS. Source : [11]*

### Au-delà de la géométrie

La plupart des systèmes modernes permettent en plus de décrire :

- la **topologie** : relations de voisinage entre objets (limites partagées, absence de recouvrement ou de vide entre deux parcelles, trous) ;
- les **réseaux** : connexions entre objets, sens d'écoulement (réseaux d'eau, routes) ;
- les **objets multiples** : plusieurs éléments géométriques pour un même objet de la base de données.

### Compatibilité entre les formats

Ces possibilités ne sont pas offertes par tous les formats. Convertir un objet appartenant à une topologie, ou constitué d'arcs de cercle, vers un format qui ne connaît pas ces notions **ne peut pas se faire sans perte** : les arcs sont remplacés par une suite de petits segments, les relations topologiques disparaissent.

Les changements de format représentent souvent une part importante du travail en géomatique (voir le chapitre [Reformatage et ETL](../09-reformatage-etl/README.md)). Il est donc important de choisir dès le départ, dans la mesure du possible, le format qui correspond le mieux aux besoins.

## Gestion des attributs

Contrairement au raster, qui ne stocke qu'une valeur par pixel et par bande, un objet vectoriel peut porter un **nombre quelconque d'attributs** en plus de sa géométrie (numéro de parcelle, propriétaire, surface, date…). Il est aussi possible de lier aux objets des données stockées dans d'autres tables.

L'organisation du stockage peut prendre des formes très différentes selon le niveau d'exigence. On distingue les catégories suivantes, par ordre croissant de complexité :

| Catégorie | Caractéristiques | Exemples |
|---|---|---|
| **Fichier simple** | Géométrie et attributs sont stockés dans **un seul fichier**. Relation 1-1 entre la géométrie d'un objet et ses attributs. | DXF, KML, GeoJSON, GML, INTERLIS (.itf/.xtf) |
| **Fichiers multiples** | Les données sont réparties dans **plusieurs fichiers** : géométrie, attributs, index spatial… Pas de relations entre les objets. | Shapefile ESRI, MIF/MID (MapInfo) |
| **Base de données fichier** (embarquée, « mobile ») | Un seul fichier contient une base de données complète : plusieurs tables, géométries, attributs, relations entre objets. Pas de serveur. | GeoPackage, SpatiaLite, File Geodatabase ESRI |
| **Base de données professionnelle avec intergiciel** (*middleware*) | Une base de données classique (Oracle, SQL Server…) garde toutes ses capacités, complétée par une couche logicielle qui gère les objets spatiaux. | ArcSDE / géodatabase d'entreprise ESRI, Topobase |
| **Base de données à capacité spatiale native** | La base de données elle-même gère les types géométriques, les index et les fonctions spatiales. | PostgreSQL/PostGIS, Oracle Spatial, MySQL spatial, SQL Server spatial |

## Binaire, texte, XML

Un format vectoriel peut coder l'information de trois manières :

- **Binaire** : le système utilise son propre codage, proche de la représentation en mémoire. Avantages : fichiers compacts, lecture et écriture rapides. Inconvénient : illisible pour un humain, et tout logiciel qui veut lire le fichier doit connaître précisément ce codage. *Exemples : Shapefile, GeoPackage, DXF binaire, FlatGeobuf.*
- **Texte (ASCII)** : les objets et attributs sont décrits avec des caractères lisibles. L'information est retrouvée grâce à une structure convenue : colonnes de largeur fixe, séparateurs, codes ou mots-clés. Lisible et facile à échanger, mais plus volumineux et plus lent. *Exemples : DXF ASCII, Leica GSI, INTERLIS 1 (.itf), CSV avec coordonnées.*
- **XML (ou JSON)** : l'information est structurée par des **balises** (XML) ou des paires **clé-valeur** (JSON) qui nomment chaque élément. Chaque format définit ses propres balises. Très lisible et facilement validable, mais verbeux. *Exemples : GML, KML, INTERLIS 2 (.xtf) pour XML ; GeoJSON pour JSON.* Ces langages font l'objet du chapitre [XML et JSON](../05-xml-json/README.md).

## Formats d'échange : standards de jure et de facto

Un **format d'échange** est un compromis destiné à être compris par des systèmes différents. Il respecte en général les principes suivants :

- un niveau de description **simple** des éléments (souvent sans topologie ni liens thématiques), pour que tous les systèmes puissent l'interpréter ;
- un codage le plus souvent **texte** (ASCII, XML, JSON) ;
- une spécification publique, éventuellement **normalisée**.

On distingue :

- les **standards de jure** (« de droit »), définis par un organisme de normalisation (ISO, OGC, SNV, IETF…) :
    - **INTERLIS** (norme suisse SN 612030, imposée par la législation sur la géoinformation pour l'échange de géodonnées de base) ;
    - **GML** (OGC, norme ISO 19136 depuis 2007) ;
    - **KML** (standard OGC depuis 2008) ;
    - **GeoPackage** (standard OGC) ;
    - **GeoJSON** (IETF, RFC 7946) ;
    - **IFC** (BIM, ISO 16739) ;
- les **standards de facto** (« de fait »), qui se sont imposés par leur large diffusion sur le marché, sans normalisation formelle :
    - **DXF** (Autodesk) ;
    - **Shapefile** (ESRI) ;
    - **MIF/MID** (MapInfo).

## Les principaux formats vectoriels

### DXF

Le format **DXF** (*Drawing eXchange Format*) a été développé par Autodesk, éditeur d'AutoCAD, pour faciliter l'échange de dessins entre logiciels de DAO/CAO. Sa compatibilité avec les logiciels les plus répandus l'a rapidement imposé comme standard de fait, y compris pour échanger des plans avec les bureaux d'ingénieurs et d'architectes.

Un fichier DXF contient à la fois la géométrie et des informations associées (calques, couleurs, blocs avec attributs). Il existe en version **ASCII** et **binaire**.

Le DXF ASCII est une suite de **couples code / valeur**, chacun sur sa propre ligne : le **code de groupe** indique le type de la valeur qui suit. Le fichier est organisé en sections (HEADER, TABLES, BLOCKS, ENTITIES…).

!!! example "🔎 Début d'un fichier DXF ASCII"

    ```text
      0
    SECTION
      2
    HEADER
      9
    $ACADVER
      1
    AC1018
      9
    $DWGCODEPAGE
      3
    ANSI_1252
    ```

    Le code `0` annonce le début d'un élément (ici une section), le code `2` son nom, le code `9` le nom d'une variable d'en-tête, puis les codes `1` ou `3` sa valeur (`AC1018` = version AutoCAD 2004).

Le DXF binaire (depuis AutoCAD R10) contient les mêmes informations, mais occupe environ 25 % de place en moins et se lit et s'écrit environ 5 fois plus vite.

!!! warning "Limites du DXF en géomatique"

    DXF est un format de **dessin** : il ne connaît ni système de coordonnées, ni structure d'attributs comparable à une table, ni topologie. La « sémantique » des objets repose souvent uniquement sur le nom des calques.

### Leica GSI

Le format **GSI** de Leica (GSI-8 et GSI-16) est ancien et de moins en moins utilisé, mais il donne un exemple très clair d'**ASCII structuré** : il servait à transférer les mesures d'un instrument (tachéomètre, niveau) vers le logiciel de calcul.

Chaque ligne commence par `*` et représente un bloc : un **bloc de code** (informations complémentaires) ou un **bloc de mesure**. Chaque bloc est composé de **mots** séparés par un espace. Un mot contient :

![Structure d'un mot GSI-8 et GSI-16 : Word Index, informations additionnelles, données, séparateur](img/leica-gsi-structure.png)

*Structure d'un mot GSI. Source : documentation Leica.*

- **WI** (*Word Index*) : 2 chiffres indiquant le type de donnée (11 = numéro de point, 71 = code/remarque, 81 = coordonnée Est, 82 = coordonnée Nord, 83 = altitude…) ;
- **ZS** (informations additionnelles) : 4 caractères (unité, mode de saisie…) ;
- **DA** (données) : le signe et la valeur, sur 8 chiffres (GSI-8) ou 16 chiffres (GSI-16) ;
- **LE** : un espace qui sépare les mots.

!!! example "🔎 Extrait d'un fichier GSI-16"

    ```text
    *410001+0000000000000010 42....+00000000U020513ac 43....+0000000020020513 44....+0000000000010.23 45....+0000000000000BPW ...
    *110002+0000000000005303 71....+00000000001F4091 81..00+0000000075781205 82..00+0000000070718513 83..00+0000000000032760
    *110003+0000000000005304 71....+000000000001F500 81..00+0000000075795261 82..00+0000000070720649 83..00+0000000000032953
    *110005+0000000000005305 71....+000000000001F500 81..00+0000000075792266 82..00+0000000070725521 83..00+0000000000033081
    ```

    - La première ligne est un bloc de code (mots 41 à 49) : informations libres comme la date ou les initiales de l'opérateur (`BPW`).
    - La deuxième ligne décrit le point n° 5303 (mot `11`), de code `1F4091` (mot `71`), de coordonnées E = 75'781,205 m, N = 70'718,513 m et H = 32,760 m (mots `81`, `82`, `83` ; le `0` en 6ᵉ position indique des valeurs en millimètres).
    - Chaque mot GSI-16 compte 23 caractères + 1 séparateur.

### Shapefile

Le **Shapefile** a été introduit par ESRI avec le logiciel ArcView au début des années 1990. Grâce à la très large diffusion de ce logiciel, presque tous les SIG le lisent et l'écrivent : c'est le **standard de fait** de l'échange vectoriel depuis 30 ans.

Un « shapefile » est en réalité un **ensemble de fichiers** portant le même nom :

| Extension | Contenu | |
|---|---|---|
| `.shp` | Géométrie | obligatoire |
| `.shx` | Index des géométries | obligatoire |
| `.dbf` | Attributs (format dBase) | obligatoire |
| `.prj` | Système de coordonnées (en WKT) | facultatif, mais indispensable en pratique |
| `.cpg` | Encodage des caractères des attributs (UTF-8, Latin-1…) | facultatif |
| `.sbn`, `.sbx` | Index spatial (ESRI) | facultatif |
| `.qix` | Index spatial (QGIS / GDAL) | facultatif |

!!! warning "Limites du Shapefile"

    - **Plusieurs fichiers** : il suffit d'en oublier un (souvent le `.prj`) lors d'un envoi pour que les données soient inutilisables ou mal positionnées.
    - **Noms de champs limités à 10 caractères**, valeurs texte limitées à 254 caractères, types de données réduits (pas de date-heure, pas de distinction claire entre vide et zéro).
    - **Taille limitée à 2 Go** par fichier (`.shp` et `.dbf`).
    - **Un seul type de géométrie** par fichier (points *ou* lignes *ou* polygones) et une seule couche par shapefile.
    - **Pas de topologie**, pas de relations entre objets, **pas d'arcs de cercle** (ils sont convertis en segments).
    - Problèmes d'**encodage** des caractères accentués si le `.cpg` est absent.

    Pour ces raisons, on lui préfère aujourd'hui le **GeoPackage** pour le travail courant.

### GeoPackage

**GeoPackage** (`.gpkg`) est un format **ouvert**, non propriétaire et indépendant du système d'exploitation, standardisé par l'OGC (2014). Il est implémenté sous la forme d'une **base de données SQLite** contenue dans **un seul fichier**.

Un GeoPackage peut contenir :

- un nombre quelconque de **couches vectorielles** (2D, avec Z et/ou M), sans les limites du Shapefile (noms de champs longs, types variés, taille pratiquement illimitée) ;
- des **rasters** sous forme de tuiles (PNG, JPEG, TIFF), avec leur pyramide de résolutions ;
- des **tables non spatiales**, des relations, et même des **styles** de couches ou un **projet QGIS** ;
- un **index spatial** (extension *RTree*) qui accélère les requêtes spatiales.

Chaque couche vectorielle est une table de la base. L'index spatial ajoute quelques tables techniques (`rtree_<couche>_geom`, `rtree_<couche>_geom_node`, `rtree_<couche>_geom_parent`, `rtree_<couche>_geom_rowid`), ainsi que des tables de métadonnées (`gpkg_contents`, `gpkg_spatial_ref_sys`, `gpkg_geometry_columns`…).

Léger et autonome, GeoPackage convient à l'usage sur le terrain (terminaux mobiles hors connexion), au partage par clé USB ou stockage cloud, et à l'échange courant de données. C'est le format par défaut de QGIS, et swisstopo diffuse plusieurs de ses produits (swissBOUNDARIES3D, swissTLM3D…) dans ce format.

*Texte adapté de [12].*

### GeoJSON

**GeoJSON** est un format **texte** basé sur **JSON**, normalisé par l'IETF (RFC 7946, 2016). Un fichier contient en général une `FeatureCollection`, liste d'objets (`Feature`) ayant chacun une géométrie et des propriétés.

!!! example "🔎 Un point en GeoJSON"

    ```json
    {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": { "type": "Point", "coordinates": [7.4386, 46.9511] },
          "properties": { "nom": "Palais fédéral", "commune": "Berne" }
        }
      ]
    }
    ```

- **Avantages** : simple, lisible, natif dans les navigateurs web et les API (JavaScript), très répandu pour les applications web et les échanges entre services.
- **Limites** : volumineux et lent pour de gros jeux de données (pas d'index spatial) ; selon la norme, les coordonnées doivent être en **WGS84, ordre longitude, latitude** (beaucoup de logiciels écrivent toutefois d'autres systèmes, comme MN95, ce qui peut poser des problèmes d'interprétation).

### KML

**KML** (*Keyhole Markup Language*) est un format **XML** relativement simple, popularisé par **Google Earth**. Il est devenu un **standard OGC en 2008** et de nombreux outils le lisent et l'écrivent. Il décrit non seulement la géométrie, mais aussi la **représentation** (styles, icônes, étiquettes) et éventuellement une **information temporelle** (*TimeStamp*, *TimeSpan*), ce qui permet d'animer des données dans le temps.

!!! example "🔎 Une ligne dans un fichier KML"

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <kml xmlns="http://www.opengis.net/kml/2.2">
      <Document>
        <name>testZerm1.kml</name>
        <Style id="style2">
          <LineStyle>
            <color>73ff0000</color>
            <width>5</width>
          </LineStyle>
        </Style>
        <Placemark>
          <name>testZerm1</name>
          <styleUrl>#style2</styleUrl>
          <LineString>
            <coordinates>
              7.748836,46.02021,0 7.747978,46.01878,0 7.746692,46.018185,0
              7.744932,46.01741,0 7.744888,46.017765,0 7.74536,46.018929,0
            </coordinates>
          </LineString>
        </Placemark>
      </Document>
    </kml>
    ```

    - Les coordonnées sont écrites `longitude,latitude,altitude`, en degrés décimaux WGS84.
    - Les couleurs KML s'écrivent **`aabbggrr`** (alpha, bleu, vert, rouge, en hexadécimal) — l'ordre inverse du HTML ! Ici `73ff0000` = alpha 0x73 (≈ 45 % d'opacité), bleu ff, vert 00, rouge 00 : une ligne **bleue semi-transparente**.

KML n'accepte que des coordonnées **WGS84 en degrés décimaux** (le système de Google Earth). Toute donnée en MN95 doit donc être transformée.

Un fichier KML peut être **compressé au format ZIP** (algorithme Deflate) avec ses éventuelles images et icônes : on obtient un fichier **KMZ** (`.kmz`), directement lisible par Google Earth.

### GML

**GML** (*Geography Markup Language*) est une application de **XML**, définie par l'OGC et normalisée **ISO 19136 depuis 2007**, qui permet de modéliser, d'échanger et de stocker des informations géographiques, avec leurs propriétés spatiales et non spatiales.

GML est avant tout une **boîte à outils** : il fournit les types de base (points, lignes, surfaces, systèmes de référence…) avec lesquels chaque domaine définit son propre **schéma d'application** (cadastre, réseaux, aménagement…). Il est utilisé notamment par les services WFS, par la directive européenne INSPIRE et par CityGML (modèles 3D de villes).

!!! example "🔎 Un point GML en MN95"

    ```xml
    <gml:Point gml:id="pt1" srsName="urn:ogc:def:crs:EPSG::2056">
      <gml:pos>2600000.00 1200000.00</gml:pos>
    </gml:Point>
    ```

### INTERLIS

**INTERLIS** est le standard suisse d'échange de géodonnées ; il sera traité en détail dans d'autres cours de la formation. Du point de vue des formats, retenons qu'il décrit non seulement les **données**, mais aussi le **modèle de données**, dans un fichier texte (`.ili`). Les données sont transférées en ASCII avec INTERLIS 1 (`.itf`) et en XML avec INTERLIS 2 (`.xtf`).

### Formats modernes : FlatGeobuf et GeoParquet

Les volumes de données augmentant et le stockage dans le cloud se généralisant, de nouveaux formats **binaires** sont apparus :

- **FlatGeobuf** (`.fgb`) : un fichier unique, binaire, avec un **index spatial** intégré. Très rapide à lire, il peut être lu **en flux** (*streaming*) et interrogé partiellement sur un serveur web, sans tout télécharger. Idéal pour **diffuser** de gros jeux de données en lecture seule. Il n'est pas prévu pour être modifié.
- **GeoParquet** (`.parquet`) : extension géographique du format **Apache Parquet**, spécifiée par l'OGC (version 1.0 en 2023). Les données sont stockées **par colonnes** et fortement compressées, ce qui rend très efficaces les **analyses sur de très gros volumes** (millions d'objets) avec des outils comme DuckDB, Python (GeoPandas) ou les plateformes de données cloud.

### Quel format choisir ?

| Besoin | Format conseillé |
|---|---|
| Travail courant dans un SIG, échange entre collègues | **GeoPackage** |
| Compatibilité avec d'anciens logiciels | Shapefile (en connaissant ses limites) |
| Échange avec un bureau d'architectes ou d'ingénieurs (DAO) | DXF |
| Application web, API, petit jeu de données | GeoJSON |
| Visualisation dans Google Earth, partage grand public | KML / KMZ |
| Échange officiel de géodonnées de base en Suisse | INTERLIS |
| Services web OGC (WFS), INSPIRE, maquettes 3D de villes | GML / CityGML |
| Diffusion de gros volumes sur le web | FlatGeobuf |
| Analyse de très gros volumes, cloud | GeoParquet |
| Données multi-utilisateurs, centralisées | Base de données spatiale (PostGIS) |

## Vecteur vs raster

Selon le contexte, on choisira des données vectorielles ou raster. Chaque mode a ses avantages et ses inconvénients.

| | Vecteur | Raster |
|---|---|---|
| **Adapté pour** | Objets discrets aux limites nettes : parcelles, bâtiments, routes, réseaux | Phénomènes continus : altitude, température, occupation du sol, images |
| **Précision géométrique** | Élevée, indépendante de l'échelle ; limitée seulement par la précision de saisie | Dépend de la résolution ; représentation « en escalier » des objets |
| **Attributs** | Nombreux attributs par objet ; symbolisation pilotée par les attributs | Une valeur par pixel et par bande ; valeurs continues |
| **Topologie, réseaux** | Possible (voisinage, connectivité) | Implicite (cellules voisines), pas de réseau |
| **Volume de données** | Généralement compact | Souvent volumineux ; croît avec le carré de la résolution |
| **Superposition, analyses** | Superposition (intersection de polygones) complexe et coûteuse ; petits polygones résiduels à nettoyer | Superposition et algèbre de cartes simples : il suffit de comparer les pixels correspondants |
| **Acquisition** | Saisie, levé, numérisation : souvent coûteuse | Capteurs (photos aériennes, satellites, lidar), numérisation par scanner : économique |
| **Échelle** | Zoom sans perte apparente, mais attention : la donnée peut paraître plus précise qu'elle ne l'est | La qualité d'affichage dépend de la résolution |
| **Généralisation** | Peu automatisée : on stocke souvent des données distinctes selon l'échelle | Rééchantillonnage simple |
| **Conversion** | Vecteur → raster (rastérisation) simple | Raster → vecteur (vectorisation) délicate |

!!! tip "En pratique"

    La plupart des projets combinent les deux : un plan vectoriel (mensuration officielle, swissTLM3D) superposé à une orthophoto ou à un MNT raster. Les SIG modernes et les formats comme le GeoPackage gèrent d'ailleurs les deux modes.

## Sources

- \[11\] [Introduction – Introduction to PostGIS](https://postgis.net/workshops/postgis-intro/introduction.html)
- \[12\] [Geopackage – Wikipédia](https://fr.wikipedia.org/wiki/Geopackage)
- [RFC 7946 – The GeoJSON Format (IETF)](https://datatracker.ietf.org/doc/html/rfc7946)
- [KML – Open Geospatial Consortium](https://www.ogc.org/standard/kml/)
- [FlatGeobuf](https://flatgeobuf.org/)
- [GeoParquet](https://geoparquet.org/)

## Exercices

- [Du fichier de base de données au shapefile](../exercices/ex04-shapefile/README.md)
- [Shapefile, GeoPackage et raster](../exercices/ex05-geopackage/README.md)

---

← [Données raster](../02-raster/README.md) · [3D et nuages de points](../04-3d-nuages-de-points/README.md) →
