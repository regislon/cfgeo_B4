# 6. Interopérabilité et normes

[📽 Slides du chapitre](https://regislon.github.io/cfgeo_B4/formats-interfaces/06-interoperabilite-normes/slides.html)

## Objectifs

À la fin de ce chapitre, vous êtes capables de :

- Définir interface et interopérabilité
- Distinguer compatibilité, standard de fait et interopérabilité
- Distinguer norme, standard ouvert, norme à distribution restreinte et format propriétaire
- Situer les organismes de normalisation (ISO, CEN, SNV, eCH, OGC) et leurs principales productions en géoinformation

## Qu'est-ce qu'une interface ?

Le terme d'**interface** est très vaste. On rencontre notamment :

- l'**interface utilisateur** : la partie visible d'un logiciel, qui gère l'interaction entre la machine et l'utilisateur ;
- l'**interface graphique** (GUI) : le système de fenêtres, d'icônes et de menus, inventé chez Xerox et popularisé par Apple (Macintosh, 1984), puis par Windows ;
- l'**interface de programmation** (API) : l'ensemble des fonctions qu'un logiciel ou un service met à disposition d'autres programmes ;
- l'**interface d'échange de données** : un format de fichier ou un service qui permet de transférer des données d'un système à un autre. C'est le sens principal dans ce cours.

!!! quote "Définitions"
    **Le Petit Robert** : « Jonction entre deux éléments d'un système informatique, permettant un transfert d'informations. »

    **Larousse** : en informatique, jonction entre deux matériels ou logiciels leur permettant d'échanger des informations par l'adoption de règles communes.

En résumé, l'interface est le **lien** entre des systèmes, mais aussi entre l'humain et la machine. Elle repose toujours sur des **règles communes**.

## Interopérabilité : définition et degrés

### Définition

L'**interopérabilité** est la capacité de plusieurs systèmes, identiques ou radicalement différents, à **communiquer sans ambiguïté** et à collaborer, sans dépendre d'un acteur particulier.

Cette notion n'est pas propre à la géomatique : elle est essentielle partout où des données gérées par un système doivent être utilisées par un autre.

!!! example "L'analogie ferroviaire"
    Les réseaux des **CFF** (voie normale, 1435 mm) et du **MOB** (voie métrique, 1000 mm) ne sont **pas interopérables** : à cause de l'écartement différent des rails, un train ne peut pas passer d'un réseau à l'autre. Les voyageurs doivent changer de train à Zweisimmen.

    Comme en informatique, la règle de base (l'écartement des voies) doit être fixée dans une **norme** acceptée et appliquée par tous les partenaires. Normalisation et interopérabilité sont donc étroitement liées.

    Depuis 2022, le *GoldenPass Express* relie Montreux à Interlaken sans changement grâce à des bogies à **écartement variable** : on a construit un **convertisseur** coûteux, plutôt que d'unifier la norme. En géomatique, c'est le rôle des outils de conversion (ETL, chapitre 9).

Les règles communes sont fixées dans un **métamodèle**, c'est-à-dire un modèle du langage de modélisation lui-même : il définit les concepts communs à tous les modèles d'un domaine (par exemple, INTERLIS définit comment décrire n'importe quel modèle de géodonnées).

### Interopérabilité en informatique

L'interopérabilité est cruciale pour le réseau téléphonique mondial et pour Internet, qui sont par nature **hétérogènes** : des matériels très variés y font tourner une panoplie encore plus vaste de logiciels. Cela ne fonctionne que parce que les communications obéissent à des **normes** claires et univoques. Une norme peut définir par exemple :

- les tensions et courants à utiliser ;
- les types de câbles et de connecteurs ;
- les séquences d'informations ou de commandes qu'un système doit envoyer, et comment son correspondant doit répondre ;
- la structure des fichiers échangés.

Si la norme est bien écrite, deux systèmes qui la respectent dialoguent sans problème. Chacun peut **évoluer librement** tant qu'il respecte la norme qui définit son interface.

### Degrés d'interopérabilité

| Degré | Schéma | Description |
|---|---|---|
| **Compatibilité** | ![A compatible avec B, C compatible avec D](img/degre-compatibilite.png) | Deux systèmes de types différents peuvent communiquer **deux à deux**, grâce à des accords bilatéraux. Chaque nouveau partenaire exige un nouvel accord. |
| **Standard de fait** | ![B, C et D compatibles avec A](img/degre-standard-de-fait.png) | Un acteur devient **dominant** et les autres s'alignent sur lui. *Avantage* : tout le monde peut à peu près communiquer. *Inconvénient* : l'acteur dominant contrôle cette possibilité et peut changer les règles. |
| **Interopérabilité** | ![A, B, C et D communiquent via un standard ouvert](img/degre-interoperabilite.png) | Tous les systèmes communiquent via un **standard ouvert**, sans dépendre d'un acteur particulier. |

*Schémas : cours CFGéo 2023.*

??? question "Le shapefile : standard de fait ou interopérabilité ?"
    Le shapefile a été créé par Esri, qui en a publié la description en 1998. Tous les SIG le lisent, mais c'est Esri seul qui en a fixé les règles, et ses limites (noms de champs de 10 caractères, 2 Go, pas de vrai encodage déclaré) n'ont jamais été corrigées. C'est un **standard de fait**. Le **GeoPackage**, standard ouvert de l'OGC, vise l'interopérabilité.

## Norme, standard, format propriétaire

### Norme ou standard ?

En français, on distingue :

- une **norme** : document établi par **consensus** et approuvé par un **organisme de normalisation reconnu** (ISO, CEN, SNV…), indépendant des producteurs, ce qui limite les modifications unilatérales ;
- un **standard** : spécification largement utilisée, qui peut être produite par un consortium (standard **ouvert**, p. ex. W3C, OGC) ou par une seule entreprise (standard **de fait**).

La confusion vient de l'anglais, qui n'a qu'un mot, *standard*, pour les deux notions (une norme ISO est un *International Standard*).

!!! warning "À retenir"
    Il est risqué de bâtir l'interopérabilité sur un standard **non ouvert** : son propriétaire peut le modifier, le rendre payant ou l'abandonner.

### Normes ouvertes et communautaires

Certains organismes (souvent des consortiums ou des associations) ont un processus de rédaction **collaboratif** : entreprises, administrations, universités et parfois individus peuvent participer aux groupes de travail. La norme est publiée d'abord comme **brouillon**, testée par des implémentations qui révèlent ses défauts, puis publiée comme **recommandation officielle**. La publication est **ouverte** : chacun peut la lire et développer un système conforme. La rédaction ouverte évite qu'une minorité impose un contenu qui ne servirait que ses intérêts.

| Organismes | Exemples de normes et standards ouverts |
|---|---|
| W3C, IETF | XML, HTML, PNG, JSON, GeoJSON |
| OGC | GML, KML, WMS, WMTS, WFS, GeoPackage, OGC API |
| buildingSMART | IFC |
| ISO | PDF (ISO 32000 depuis 2008) |
| SNV / associations professionnelles suisses (SIA, VSS, VSA) | INTERLIS, normes métier |

!!! note "PDF, un format devenu norme"
    Créé par Adobe en 1993, le **PDF** a longtemps été un format contrôlé par une seule entreprise. Depuis **2008**, il est la norme internationale **ISO 32000** ; il en existe aussi des profils normalisés pour l'archivage (PDF/A).

### Normes payantes

Entre ces deux mondes, de nombreux organismes officiels (ISO, CEN, SNV, ANSI, AFNOR…) élaborent leurs normes par consensus entre membres, mais vendent les documents : les normes sont **publiques** (n'importe qui peut les acheter et les appliquer), mais **pas gratuites**.

### Normes à distribution restreinte

Parfois, c'est une très petite assemblée, voire une seule entreprise, qui décide d'une norme, en écoutant plus ou moins ses utilisateurs. La spécification peut être publiée, mais son évolution n'est pas partagée.

Exemples : le **shapefile** (Esri), le format de compression **RAR**, le langage **Java** (Oracle).

Dans certains pays (notamment les États-Unis et le Japon), une technique normalisée peut être protégée par un **brevet** : son utilisation exige alors le paiement de redevances.

!!! example "Des brevets aujourd'hui expirés"
    - **GIF** : l'algorithme de compression LZW était breveté (Unisys) ; les brevets ont expiré en 2003-2004. C'est d'ailleurs pour contourner ce brevet que le format **PNG** a été créé.
    - **MP3** : les brevets ont expiré en 2017 ; le format est désormais libre d'utilisation.

### Formats opaques et propriétaires

À l'opposé de l'interopérabilité, les **formats propriétaires fermés** ne sont connus que de leur concepteur. Seule une poignée d'acteurs peut développer des outils pour les lire et les écrire ; les autres doivent recourir à la **rétro-ingénierie** (*reverse engineering*), avec un risque d'erreurs à chaque nouvelle version.

Exemples :

- les anciens formats binaires de Microsoft Office (`.doc`, `.xls`) ; les formats actuels (`.docx`, `.xlsx`) sont en revanche normalisés (ISO/IEC 29500) ;
- la **File Geodatabase** d'Esri ;
- le **DWG** d'Autodesk (lu par d'autres logiciels grâce à la rétro-ingénierie de l'Open Design Alliance) ;
- les formats natifs de nombreux instruments (scanners laser, récepteurs GNSS).

## Normalisation en géoinformation

Les organismes de normalisation s'emboîtent du niveau mondial au niveau national :

| Niveau | Organisme | Comité géoinformation |
|---|---|---|
| Mondial | **ISO** (*International Organization for Standardization*) | **ISO/TC 211** *Geographic information/Geomatics* |
| Européen | **CEN** (Comité européen de normalisation) | **CEN/TC 287** *Geographic Information* |
| Suisse | **SNV** (Association suisse de normalisation) | comité national pour la géoinformation |
| Suisse (cyberadministration) | **eCH** | groupe spécialisé Géoinformation |
| Consortium mondial | **OGC** (*Open Geospatial Consortium*) | — |

### ISO/TC 211

L'**ISO** édicte les normes internationales dans de nombreux domaines (management, industrie, informatique, géoinformation…). Ses membres sont les organismes **nationaux** de normalisation ; la **SNV** y représente la Suisse.

Le comité technique **ISO/TC 211** (<https://www.isotc211.org>) est responsable des normes de l'information géographique : la **série ISO 191xx**. Quelques exemples :

| Norme | Sujet |
|---|---|
| ISO 19107 | Schéma spatial (géométrie et topologie) |
| ISO 19111 | Référencement par coordonnées (systèmes de coordonnées) |
| ISO 19115 | Métadonnées |
| ISO 19125 | Simple Features (géométries simples) |
| ISO 19128 | Web Map Server (WMS) |
| ISO 19136 | GML |

L'élaboration d'une norme ISO est longue et passe par des étapes bien définies, chacune soumise au vote des membres :

1. proposition de nouveau sujet (*New Work Item Proposal*) ;
2. projet de travail (*Working Draft*, WD) ;
3. projet de comité (*Committee Draft*, CD) ;
4. projet de norme internationale (*Draft International Standard*, DIS, puis FDIS) ;
5. norme internationale (*International Standard*, IS).

### CEN/TC 287

Le **CEN** édicte les normes européennes (EN). Il reprend en principe les normes ISO existantes (elles deviennent alors des normes « EN ISO 191xx ») et les complète si nécessaire. Ses membres sont aussi les organismes nationaux de normalisation, dont la SNV.

!!! note "ISO recommande, CEN oblige"
    Les membres de l'ISO sont **libres** d'adopter ou non une norme ISO. En revanche, lorsqu'une norme **CEN** est publiée, les pays membres **doivent** la reprendre comme norme nationale et retirer les normes nationales contradictoires.

### SNV et normes suisses

La SNV étant membre du CEN, elle doit adopter les normes CEN, et donc les normes ISO reprises par le CEN. Une norme suisse en contradiction devrait en principe être retirée. La Suisse a donc tout intérêt à ce que les normes internationales répondent à ses besoins : ses représentants participent activement aux travaux de l'ISO et du CEN.

Exemples de normes suisses (SN) en géoinformation :

- **SN 612030** et **SN 612031** : INTERLIS 1 et INTERLIS 2, langage de modélisation et méthode de transfert de données ;
- **SN 612040** : adresses de bâtiments ;
- **SN 612050** : modèle de métadonnées GM03 (profil suisse de l'ISO 19115).

### eCH et coordination nationale

**eCH** est l'association qui élabore les **standards de cyberadministration** en Suisse (Confédération, cantons, communes, économie privée). Son groupe spécialisé *Géoinformation* publie des standards et recommandations pour l'échange de géodonnées et les géoservices.

Au niveau fédéral, **swisstopo** coordonne l'infrastructure nationale de données géographiques, notamment via son service **KOGIS** (Coordination, Géo-Information et Services), en collaboration avec les cantons. La loi sur la géoinformation (LGéo) impose de décrire les géodonnées de base par des **modèles de géodonnées** (en INTERLIS) : la normalisation a ainsi un ancrage légal en Suisse.

### Open Geospatial Consortium (OGC)

L'**OGC** (<https://www.ogc.org>) est un consortium international fondé en 1994, qui réunit plus de 500 membres : éditeurs de logiciels, producteurs de données, agences gouvernementales (dont swisstopo), universités et instituts de recherche. Son but est de rendre les systèmes d'information géographique **interopérables** grâce à des **interfaces ouvertes** définies dans des spécifications techniques.

Ses objectifs :

- promouvoir des applications ouvertes pour le traitement de l'information géographique ;
- aligner les technologies géographiques sur les standards généraux de l'informatique et du web ;
- faire coopérer fournisseurs et utilisateurs pour développer des interfaces ouvertes ;
- impliquer toute la communauté (industrie, administrations, milieux académiques, organismes de normalisation).

L'OGC produit deux types de documents :

- l'**Abstract Specification** : le cadre **conceptuel**, qui décrit les principes de l'interopérabilité (par exemple les *Simple Features* : points, lignes, polygones et systèmes de coordonnées, briques de base de tous les objets géographiques) ;
- les **OGC Standards** (anciennement *Implementation Specifications*) : les spécifications **techniques** directement implémentables, testées lors de bancs d'essai (*testbeds*) : GML, KML, WMS, WMTS, WFS, WCS, CSW, GeoPackage…

L'OGC accepte aussi des **Community Standards** : des formats nés ailleurs et largement adoptés, comme 3D Tiles, CityJSON ou I3S (chapitre 4).

!!! tip "Les OGC API : la nouvelle génération"
    Les services historiques (WMS, WFS…) reposent sur des requêtes et des réponses XML spécifiques. La famille **OGC API** les modernise selon les pratiques actuelles du web : architecture **REST**, réponses en **JSON**/GeoJSON ou HTML, description par OpenAPI. Par exemple **OGC API – Features** succède à WFS, **OGC API – Tiles** à WMTS, **OGC API – Maps** à WMS. Voir le chapitre 8.

### OGC et ISO : une collaboration étroite

L'OGC et l'ISO/TC 211 collaborent : les standards OGC peuvent être vus comme des **implémentations** des normes conceptuelles de l'ISO, et plusieurs standards OGC sont devenus des normes ISO :

| Standard OGC | Norme ISO |
|---|---|
| Simple Features | ISO 19125 |
| WMS 1.3.0 | ISO 19128 |
| GML 3.2 | ISO 19136 |

Lorsque les catalogues et les services s'appuient sur ces normes, l'utilisateur peut combiner des données provenant de sources **hétérogènes, distantes et distribuées** : les systèmes deviennent réellement interopérables. C'est le principe des géoportails comme [map.geo.admin.ch](https://map.geo.admin.ch) et du catalogue de métadonnées [geocat.ch](https://www.geocat.ch).

## À retenir

- Une **interface** est une jonction entre systèmes, fondée sur des **règles communes**.
- **Interopérabilité** : communiquer sans ambiguïté et **sans dépendre** d'un acteur ; elle repose sur un **standard ouvert** (≠ compatibilité bilatérale ≠ standard de fait).
- **Norme** = organisme reconnu, consensus (ISO, CEN, SNV) ; **standard** = consortium (ouvert) ou entreprise (de fait).
- Formats **ouverts** (XML, GML, INTERLIS, IFC, PDF…), **restreints** (shapefile, RAR), **fermés** (File Geodatabase, DWG).
- **ISO/TC 211** (série 191xx) → **CEN/TC 287** (obligatoire) → **SNV** (INTERLIS) ; **eCH** et **swisstopo/KOGIS** pour la coordination suisse.
- **OGC** : GML, WMS, WFS, GeoPackage… et la nouvelle famille **OGC API** (REST/JSON).

## Sources

- [4] M. Thériault, *Systèmes d'information géographiques, concepts fondamentaux*, notes de cours, Université Laval, 1996.
- Interopérabilité, *Wikipédia* : <https://fr.wikipedia.org/wiki/Interop%C3%A9rabilit%C3%A9>
- ISO/TC 211 *Geographic information/Geomatics* : <https://www.isotc211.org>
- CEN/TC 287 *Geographic Information* : <https://www.cencenelec.eu>
- SNV, Association suisse de normalisation : <https://www.snv.ch>
- eCH, standards de cyberadministration : <https://www.ech.ch>
- swisstopo, KOGIS : <https://www.swisstopo.admin.ch>
- Open Geospatial Consortium, standards : <https://www.ogc.org/standards/>
- OGC API : <https://ogcapi.ogc.org>
- ISO 32000 (PDF), PDF Association : <https://pdfa.org/resource/iso-32000-pdf/>

---

← [XML et JSON](../05-xml-json/README.md) · [Échange de données](../07-echange-de-donnees/README.md) →
