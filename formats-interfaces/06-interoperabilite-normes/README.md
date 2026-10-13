# 6. Interopérabilité et normes

[📽 Slides du chapitre](https://regislon.github.io/cfgeo_B4/formats-interfaces/06-interoperabilite-normes/slides.html)

## Objectifs

À la fin de ce chapitre, vous êtes capables de :

- Définir interface et interopérabilité
- Distinguer compatibilité, standard de fait et interopérabilité
- Distinguer norme, standard ouvert, norme à distribution restreinte et format propriétaire
- Situer les organismes de normalisation (ISO, CEN, SNV, eCH, OGC) et leurs principales productions en géoinformation
- Distinguer les niveaux d'interopérabilité : technique, syntaxique, sémantique, organisationnel et juridique
- Connaître le cadre légal suisse (LGéo, OGéo, modèles de géodonnées minimaux) et le rôle des licences
- Décrire les étapes de l'élaboration d'une norme

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

## Les niveaux d'interopérabilité

Deux systèmes qui échangent des fichiers sans erreur ne se « comprennent » pas forcément. Le **cadre européen d'interopérabilité** (*European Interoperability Framework*, EIF) distingue plusieurs **niveaux**, qui doivent tous être réglés pour qu'un échange fonctionne vraiment. L'EIF en compte quatre (juridique, organisationnel, sémantique, technique) ; en géomatique, on isole souvent en plus le niveau **syntaxique**.

| Niveau | Question posée | Exemples de solutions |
|---|---|---|
| **Technique** | Les systèmes peuvent-ils se connecter et lire les fichiers ? | Protocoles (HTTP), formats de fichiers, systèmes de coordonnées |
| **Syntaxique** | La structure des données est-elle correcte ? | XML, JSON, schémas XSD et JSON Schema (chapitre 5) |
| **Sémantique** | Les deux parties donnent-elles **le même sens** aux données ? | Modèles de données (INTERLIS), catalogues d'objets, listes de valeurs |
| **Organisationnel** | Qui fournit quoi, à qui, quand et comment ? | Accords entre services, portails, processus de mise à jour |
| **Juridique** | A-t-on le **droit** d'utiliser et de diffuser les données ? | Lois, conditions d'utilisation, **licences** |

### 🧵 Fil rouge : ce que la préparation de ce cours nous a appris

Assembler les données du kilomètre carré d'Yverdon (chapitres 1 à 5) a fait rencontrer **chacun** de ces niveaux :

| Niveau | Ce qui s'est passé | Solution |
|---|---|---|
| Technique | swissTLM3D n'est diffusé qu'en un **fichier national de 3 à 5 Go** : impossible d'en extraire un km² sans tout télécharger. | Passer par l'**API REST** de geo.admin.ch, limitée à **200 objets par requête** : il a fallu enchaîner les requêtes. |
| Technique | GeoLibre n'affiche la carte nationale qu'en **Web Mercator** (EPSG:3857), pas en MN95. La maquette IFC d'exemple est géoréférencée en **UTM 60 Sud** (EPSG:32760). | Utiliser la pyramide de tuiles en 3857 ; transformer les coordonnées. |
| Syntaxique | Le DXF exporté déclare l'encodage **Windows-1252** et non UTF-8. | Connaître et déclarer l'encodage (chapitre 1). |
| Sémantique | Les attributs de swissBUILDINGS3D sont en allemand (`Gebaeude Einzelhaus`, `Hochhaus`) et le champ hauteur est vide. Le nuage de points 2025 contient des classes **14, 15, 26 et 27** absentes de la documentation. | Traduire les valeurs (*schema mapping*, chapitre 7) ; calculer la hauteur ; regrouper les classes inconnues. |
| Organisationnel | Le WFS libre de la mensuration officielle sur geodienste.ch renvoie les parcelles de **Zoug**, mais **pas celles du canton de Vaud**. | Se rabattre sur d'autres données (swissBUILDINGS3D) ; s'adresser au canton. |
| Juridique | Les données de swisstopo sont libres, avec **mention de la source** ; la maquette IFC de buildingSMART est sous licence **CC BY 4.0**. | Citer « © swisstopo » et « buildingSMART, CC BY 4.0 » sous chaque figure. |

Le message : l'interopérabilité n'est pas une question abstraite de normes. C'est exactement ce sur quoi on bute **dès qu'on assemble des données de sources différentes**, et le travail du géomaticien consiste en bonne partie à résoudre ces problèmes.

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

### Qui a défini les formats de ce cours ?

<div class="demo" data-demo="normes"></div>

*Tous les formats, services et codages rencontrés dans ce cours. Filtrez par organisme ou par degré d'ouverture, et cliquez sur une carte pour sa fiche. Les dates indiquent l'adoption par l'organisme de normalisation, lorsqu'elle a pu être vérifiée.*

### À vous de jouer : trier les formats

<div class="demo" data-demo="trier"></div>

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

- **SN 612030** (édition 1998) : INTERLIS 1, langage de modélisation et méthode de transfert de données ; INTERLIS 2 est publié comme standard **eCH-0031** (manuel de référence, version 2.1.0 en 2024 pour INTERLIS 2.4) ;
- **SN 612040** : adresses de bâtiments ;
- **SN 612050** : modèle de métadonnées GM03 (profil suisse de l'ISO 19115).

### eCH et coordination nationale

**eCH** est l'association qui élabore les **standards de cyberadministration** en Suisse (Confédération, cantons, communes, économie privée). Son groupe spécialisé *Géoinformation* publie des standards et recommandations pour l'échange de géodonnées et les géoservices.

Au niveau fédéral, **swisstopo** coordonne l'infrastructure nationale de données géographiques, notamment via son service **KOGIS** (Coordination, Géo-Information et Services), en collaboration avec les cantons.

### Le cadre légal suisse : LGéo, modèles minimaux, INTERLIS

En Suisse, l'interopérabilité des **géodonnées de base** (celles qui reposent sur un acte législatif : mensuration officielle, plans d'affectation, cadastre des sites pollués…) n'est pas facultative : elle est inscrite dans la loi.

| Texte | Article | Ce qu'il dit |
|---|---|---|
| **LGéo** (RS 510.62) | art. 4 *Harmonisation* | Les exigences doivent être fixées « de telle manière qu'un échange simple et une large utilisation soient possibles », en tenant compte des **normes reconnues** au plan international ou national. |
| **LGéo** | art. 5 | Le Conseil fédéral fixe les exigences pour les géodonnées de base, notamment les **modèles de géodonnées**, la qualité et l'**échange**. |
| **OGéo** (RS 510.620) | art. 9 | Le service spécialisé de la Confédération prescrit un **modèle de géodonnées minimal** (MGDM) pour chaque jeu de géodonnées de base. |
| **OGéo** | art. 10 | Le langage de description des modèles doit correspondre à une **norme reconnue** ; swisstopo le spécifie. |
| **OGéo-swisstopo** (RS 510.620.1) | art. 5 | Ce langage est **INTERLIS** : norme SN 612030 (INTERLIS 1) ou eCH-0031 (INTERLIS 2). |
| **OGéo** | art. 34 | Les géodonnées de base sont rendues accessibles par des **géoservices** de consultation et, pour certaines, de téléchargement. |

En pratique :

- les **modèles de géodonnées minimaux** de la Confédération sont publiés en INTERLIS sur [models.geo.admin.ch](https://models.geo.admin.ch) ; ils définissent la **sémantique** commune (classes, attributs, listes de valeurs) ;
- les cantons diffusent leurs géodonnées de base selon ces modèles, notamment via la plateforme commune [geodienste.ch](https://www.geodienste.ch) ; les conditions d'accès varient d'un canton à l'autre, comme l'a montré le fil rouge ;
- dans l'Union européenne, la directive **INSPIRE** (2007/2/CE) poursuit le même but à l'échelle européenne, avec des spécifications de données communes et des services harmonisés.

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

L'OGC accepte aussi des **Community Standards** : des formats nés ailleurs et largement adoptés, comme 3D Tiles, CityJSON, I3S (chapitre 4) ou, depuis 2025, le catalogue **STAC** (chapitre 8).

!!! tip "Les OGC API : la nouvelle génération"
    Les services historiques (WMS, WFS…) reposent sur des requêtes et des réponses XML spécifiques. La famille **OGC API** les modernise selon les pratiques actuelles du web : architecture **REST**, réponses en **JSON**/GeoJSON ou HTML, description par OpenAPI. Par exemple **OGC API – Features** succède à WFS, **OGC API – Tiles** à WMTS, **OGC API – Maps** à WMS. Voir le chapitre 8.

### Comment naît un standard : JSON-FG et STAC

Une norme ne naît pas en un jour. Deux exemples récents, rencontrés dans ce cours, montrent les étapes à l'OGC :

<div class="demo" data-demo="frise"></div>

*Les mêmes grandes étapes se retrouvent à l'ISO (proposition, projets de travail et de comité, projet de norme, norme publiée) : rédaction par un groupe d'experts, **consultation publique**, **vote** des membres, puis **publication**. Entre la première version et la norme publiée, il s'écoule souvent plusieurs années.*

### OGC et ISO : une collaboration étroite

L'OGC et l'ISO/TC 211 collaborent : les standards OGC peuvent être vus comme des **implémentations** des normes conceptuelles de l'ISO, et plusieurs standards OGC sont devenus des normes ISO :

| Standard OGC | Norme ISO |
|---|---|
| Simple Features | ISO 19125 |
| WMS 1.3.0 | ISO 19128 |
| GML 3.2 | ISO 19136 |

Lorsque les catalogues et les services s'appuient sur ces normes, l'utilisateur peut combiner des données provenant de sources **hétérogènes, distantes et distribuées** : les systèmes deviennent réellement interopérables. C'est le principe des géoportails comme [map.geo.admin.ch](https://map.geo.admin.ch) et du catalogue de métadonnées [geocat.ch](https://www.geocat.ch).

## Licences : le droit d'utiliser les données

L'interopérabilité **juridique** est souvent oubliée : un format ouvert et un service bien documenté ne servent à rien si l'on n'a pas le **droit** d'utiliser les données. Avant toute utilisation, il faut lire les **conditions d'utilisation** :

- **Données ouvertes** (*Open Government Data*, OGD) : depuis 2021, les géodonnées de swisstopo sont **gratuites** et réutilisables, y compris commercialement, à condition de **mentionner la source** (« © swisstopo »). Le portail [opendata.swiss](https://opendata.swiss) recense les données ouvertes des administrations suisses.
- **Licences Creative Commons** : `CC BY` (attribution obligatoire, comme la maquette IFC de buildingSMART au chapitre 4), `CC BY-SA` (partage dans les mêmes conditions), `CC0` (domaine public)…
- **Licence ODbL** : celle d'**OpenStreetMap**, qui impose de partager les bases de données dérivées sous la même licence.
- **Données sous conditions** : certaines géodonnées cantonales ou communales ne sont accessibles qu'aux autorités, sur demande ou contre émolument (OGéo, art. 40 sur la transmission à des tiers).

!!! warning "Format ouvert ≠ données libres"
    Un fichier GeoPackage (format ouvert) peut contenir des données confidentielles ; un fichier dans un format propriétaire peut contenir des données libres. **Format** et **licence** sont deux questions distinctes.

## À retenir

- Une **interface** est une jonction entre systèmes, fondée sur des **règles communes**.
- **Interopérabilité** : communiquer sans ambiguïté et **sans dépendre** d'un acteur ; elle repose sur un **standard ouvert** (≠ compatibilité bilatérale ≠ standard de fait).
- **Norme** = organisme reconnu, consensus (ISO, CEN, SNV) ; **standard** = consortium (ouvert) ou entreprise (de fait).
- Formats **ouverts** (XML, GML, INTERLIS, IFC, PDF…), **restreints** (shapefile, RAR), **fermés** (File Geodatabase, DWG).
- **ISO/TC 211** (série 191xx) → **CEN/TC 287** (obligatoire) → **SNV** (INTERLIS) ; **eCH** et **swisstopo/KOGIS** pour la coordination suisse.
- **OGC** : GML, WMS, WFS, GeoPackage… et la nouvelle famille **OGC API** (REST/JSON).
- Cinq **niveaux** d'interopérabilité : technique, syntaxique, **sémantique**, organisationnel, **juridique**.
- En Suisse, la **LGéo** (art. 4 et 5) et l'**OGéo** (art. 9 et 10) imposent des **modèles de géodonnées minimaux** décrits en **INTERLIS** (OGéo-swisstopo, art. 5).
- **Licence** : toujours vérifier le droit d'utiliser des données ; format ouvert ≠ données libres.

## Testez-vous

<div class="demo" data-demo="quiz" data-quiz="interop"></div>

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
- Loi sur la géoinformation (LGéo, RS 510.62) : <https://www.fedlex.admin.ch/eli/cc/2008/388/fr>
- Ordonnance sur la géoinformation (OGéo, RS 510.620) : <https://www.fedlex.admin.ch/eli/cc/2008/389/fr>
- Ordonnance de swisstopo sur la géoinformation (OGéo-swisstopo, RS 510.620.1) : <https://www.fedlex.admin.ch/eli/cc/2008/390/fr>
- Modèles de géodonnées minimaux : <https://models.geo.admin.ch>
- European Interoperability Framework (Commission européenne) : <https://interoperable-europe.ec.europa.eu/collection/iopeu-monitoring/european-interoperability-framework-detail>
- JSON-FG (OGC) : <https://www.ogc.org/standards/json-fg/>
- STAC Community Standard (OGC) : <https://www.ogc.org/standard/stac/>

---

← [XML et JSON](../05-xml-json/README.md) · [Échange de données](../07-echange-de-donnees/README.md) →
