# 5. XML et JSON

[📽 Slides du chapitre](https://regislon.github.io/cfgeo_B4/formats-interfaces/05-xml-json/slides.html)

## Objectifs

À la fin de ce chapitre, vous êtes capables de :

- Lire et écrire un document XML et JSON
- Distinguer document bien formé et document valide
- Comprendre le rôle d'un schéma (XSD, JSON Schema)
- Reconnaître les formats géographiques basés sur XML (GML, KML, GPX, INTERLIS 2) et sur JSON (GeoJSON)

## XML : balises, éléments, attributs

**XML** (*eXtensible Markup Language*, « langage de balisage extensible ») est un standard du **W3C** (*World Wide Web Consortium*) publié en 1998. Il permet de créer des fichiers **texte** lisibles à la fois par les humains et par les machines, structurés **en arbre**.

XML n'est pas un format en soi mais un **métalangage** : il fixe les règles d'écriture, et chaque domaine définit son propre vocabulaire de balises. GPX, KML, GML, INTERLIS 2 (XTF) ou encore SVG et les fichiers Office (`.docx`) sont tous des « dialectes » XML. C'est cette **extensibilité** qui fait sa force.

### Balises et éléments

Une **balise** (*tag*) est écrite entre chevrons `< >`. Elle peut être ouvrante (`<nom>`), fermante (`</nom>`) ou vide (`<nom/>`).

L'**élément** est le composant de base : il va d'une balise ouvrante à la balise fermante correspondante et contient du texte ou d'autres éléments.

```xml
<nom>Jean Latour</nom>
<prenom/>                 <!-- élément vide, notation abrégée -->
```

Les noms de balises sont libres, mais :

- ils sont **sensibles à la casse** (`<Nom>` ≠ `<nom>`) ;
- ils ne contiennent ni espace ni caractère spécial (`!`, `$`, `;`…) et ne commencent pas par un chiffre ;
- les lettres accentuées sont permises, mais il vaut mieux s'en tenir aux caractères ASCII pour éviter les problèmes.

### Attributs

Un **attribut** est une paire clé-valeur placée dans la balise ouvrante, sous la forme `cle="valeur"` :

```xml
<text x="15" y="135">AbcDef</text>
```

Il n'y a pas de règle absolue pour choisir entre élément et attribut. En pratique, les attributs présentent quelques limites :

- ils ne peuvent pas contenir plusieurs valeurs, ni de structure (les éléments oui) ;
- ils sont moins faciles à faire évoluer si le modèle change.

!!! tip "Bonne pratique"
    Utilisez des **éléments** pour les données et réservez les **attributs** aux informations complémentaires (identifiant, unité, langue, système de coordonnées…).

### Imbrication et élément racine

Un élément peut contenir d'autres éléments : on parle d'**imbrication** (ou d'encapsulation). L'élément le plus externe, qui contient tous les autres, est l'**élément racine** (*root element*). Il y en a **un seul** par document.

Exemple : une trace GPS au format **GPX**, avec un segment dont chaque point connaît son altitude et son heure de passage :

```xml
<trk>
  <name>Sortie à vélo en après-midi</name>
  <trkseg>
    <trkpt lat="46.5194690" lon="6.5983470">
      <ele>382.1</ele>
      <time>2014-04-26T11:59:19Z</time>
    </trkpt>
    <!-- ... autres points ... -->
  </trkseg>
</trk>
```

On voit ici les deux choix de modélisation : la position est donnée par des **attributs** (`lat`, `lon`), l'altitude et l'heure par des **éléments** (`ele`, `time`).

### Commentaires et caractères réservés

Les commentaires s'écrivent `<!-- commentaire -->`.

Certains caractères ont une signification en XML et doivent être remplacés par des **entités** dans le texte :

| Caractère | Entité |
|---|---|
| `<` | `&lt;` |
| `>` | `&gt;` |
| `&` | `&amp;` |
| `'` | `&apos;` |
| `"` | `&quot;` |

## Structure d'un document XML

Un document XML comporte trois parties.

**1. Le prologue** indique la version de XML et l'**encodage** des caractères :

```xml
<?xml version="1.0" encoding="UTF-8"?>
```

!!! note "Quel encodage choisir ?"
    Utilisez **UTF-8** : c'est l'encodage par défaut de XML (si rien n'est déclaré), il couvre tous les caractères (accents, €, alphabets non latins) et c'est la norme sur le web. L'ancien **ISO-8859-1** (Latin-1) ne couvre que les langues d'Europe occidentale et ne connaît pas le symbole €. L'essentiel est que l'encodage **déclaré** corresponde à l'encodage **réel** du fichier, sinon les accents s'affichent mal (`Ã©` au lieu de `é`). Voir le chapitre 1 sur le codage des caractères.

Le prologue peut ensuite contenir des **instructions de traitement** pour des applications particulières (`<?xml-stylesheet ...?>` par exemple).

**2. La déclaration du modèle** (facultative) : référence à une DTD ou à un schéma XSD qui décrit les règles du document.

**3. L'arbre des éléments**, à partir de l'élément racine.

Voici l'en-tête d'un vrai fichier GPX exporté par Strava :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<gpx creator="strava.com Android" version="1.1"
     xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1
                         http://www.topografix.com/GPX/1/1/gpx.xsd">
```

### Espaces de noms (namespaces)

Comme chacun peut inventer ses balises, deux vocabulaires peuvent utiliser le même nom (`<name>` en GPX et en KML, par exemple). Un **espace de noms** associe les balises à une URI unique, souvent via un **préfixe** :

- `xmlns="http://www.topografix.com/GPX/1/1"` : espace de noms par défaut (balises sans préfixe) ;
- `xmlns:xsi="..."` : les balises et attributs préfixés `xsi:` appartiennent au vocabulaire XML Schema ;
- de même, `gml:` désigne le vocabulaire GML.

L'URI sert d'identifiant ; elle ne pointe pas forcément vers une page web.

## DTD et XSD

Un document XML peut contenir n'importe quelles balises. Pour qu'un logiciel puisse l'interpréter, il faut une **grammaire** qui fixe :

- les noms des éléments et leur contenu autorisé (ordre, nombre d'occurrences) ;
- les attributs de chaque élément (nom, type, valeur par défaut, obligatoire ou non) ;
- les types de données (texte, nombre, date…).

Deux langages existent pour écrire cette grammaire :

| | DTD (*Document Type Definition*) | XSD (*XML Schema Definition*) |
|---|---|---|
| Syntaxe | Syntaxe propre, non XML | Écrit **en XML** |
| Types de données | Quasiment aucun (tout est texte) | Riches : entier, décimal, date, énumérations, motifs… |
| Espaces de noms | Mal gérés | Pris en charge |
| Usage actuel | Historique (HTML ancien, SGML) | **Standard actuel**, utilisé par GML, GPX, KML, INTERLIS 2… |

Une DTD peut être interne au document ou externe ; un schéma XSD est toujours un fichier séparé (`.xsd`), réutilisable par de nombreux documents. Dans l'en-tête GPX ci-dessus, l'attribut `xsi:schemaLocation` indique où trouver le schéma `gpx.xsd`.

Exemple d'**extrait de schéma XSD** : il définit qu'un élément `Ferme` contient zéro à n `Batiment` puis zéro à n `Champ`, et possède un attribut `ID` obligatoire :

```xml
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            elementFormDefault="qualified">
  <xsd:element name="Ferme" type="FermeType"/>
  <xsd:complexType name="FermeType">
    <xsd:sequence>
      <xsd:element name="Batiment" type="BatimentType" minOccurs="0" maxOccurs="unbounded"/>
      <xsd:element name="Champ" type="ChampType" minOccurs="0" maxOccurs="unbounded"/>
    </xsd:sequence>
    <xsd:attribute name="ID" type="xsd:ID" use="required"/>
  </xsd:complexType>
  <!-- BatimentType et ChampType sont définis plus loin -->
</xsd:schema>
```

!!! note "Schéma ≠ données"
    Ce fichier ne contient **aucune** ferme : il décrit seulement à quoi doit ressembler un fichier de fermes. C'est l'équivalent XML d'un modèle de données (comme un modèle INTERLIS `.ili` face à ses données `.xtf`).

## Bien formé vs valide

On vérifie un document XML à deux niveaux.

### Document bien formé

Un document est **bien formé** s'il respecte la **syntaxe** XML. Liste de contrôle :

- le prologue `<?xml ...?>` est présent (recommandé) et placé tout au début ;
- il y a **un seul élément racine** qui contient tous les autres ;
- chaque balise ouvrante a sa balise fermante, **avec le même nom** (casse comprise) ;
- les éléments vides sont écrits `<nom/>` ;
- les éléments sont correctement **imbriqués** : `<a><b></b></a>` et non `<a><b></a></b>` ;
- un attribut n'apparaît qu'**une fois** par balise, et sa valeur est entre guillemets `"` ou apostrophes `'` ;
- les caractères réservés (`<`, `&`) sont remplacés par des entités (`&lt;`, `&amp;`) ;
- sans DTD, seules les cinq entités prédéfinies sont utilisées.

Un document mal formé n'est **pas** du XML : tout logiciel doit refuser de le lire.

### Document valide

Un document est **valide** s'il :

1. est **bien formé** ;
2. fait référence à une **DTD** ou à un **schéma XSD** ;
3. **respecte** les règles de ce schéma (noms d'éléments, ordre, attributs, types de données).

Tout document valide est bien formé, mais l'inverse n'est pas vrai : `<ferme><vache>Marguerite</vache></ferme>` est bien formé, mais pas valide par rapport au schéma ci-dessus (l'élément `vache` n'est pas prévu, et l'attribut `ID` manque).

!!! tip "Outils de vérification"
    Un navigateur web ou un éditeur comme VS Code ou Notepad++ (extension XML Tools) détecte les erreurs de forme. Pour la validation contre un schéma, on utilise un validateur XSD (extension d'éditeur, `xmllint --schema`, ou pour INTERLIS l'outil ilivalidator).

## Formats géographiques basés sur XML

### GML (Geography Markup Language)

**GML** est un dialecte XML défini par l'**OGC** pour modéliser, échanger et stocker des informations géographiques : géométries (points, lignes, surfaces, volumes), systèmes de coordonnées et attributs non spatiaux. Depuis **2007**, GML 3.2 est aussi la norme internationale **ISO 19136**.

GML est un **langage de base** : il fournit les types géométriques (`gml:Point`, `gml:LineString`, `gml:Polygon`…), et chaque domaine définit, par un schéma XSD, son **schéma d'application** (ses propres classes d'objets). CityGML (chapitre 4) est un tel schéma d'application, tout comme les données INSPIRE en Europe. GML est aussi le format de réponse standard des services WFS (chapitre 8).

Exemple d'objet GML (un bâtiment ponctuel en MN95) :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<app:Batiment gml:id="bat.1"
    xmlns:app="http://www.example.org/batiments"
    xmlns:gml="http://www.opengis.net/gml/3.2">
  <app:nom>Collège</app:nom>
  <app:position>
    <gml:Point srsName="http://www.opengis.net/def/crs/EPSG/0/2056">
      <gml:pos>2538700 1180900</gml:pos>
    </gml:Point>
  </app:position>
</app:Batiment>
```

On y retrouve les notions vues plus haut : deux espaces de noms (`app:` pour le vocabulaire métier, `gml:` pour la géométrie), un attribut d'identifiant (`gml:id`) et le système de coordonnées dans l'attribut `srsName`. Contrairement à KML ou GeoJSON, **GML accepte n'importe quel système de coordonnées**.

### KML (Keyhole Markup Language)

**KML** est le format de **Google Earth**, devenu un standard **OGC** en 2008 (KML 2.2). Simple et très répandu, il décrit à la fois la **géométrie** et la **représentation** (styles, icônes, info-bulles), ainsi qu'une éventuelle dimension temporelle.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <Style id="style2">
      <LineStyle><color>73ff0000</color><width>5</width></LineStyle>
    </Style>
    <Placemark>
      <name>testZerm1</name>
      <styleUrl>#style2</styleUrl>
      <LineString>
        <coordinates>7.748836,46.02021,0 7.747978,46.01878,0 7.746692,46.018185,0</coordinates>
      </LineString>
    </Placemark>
  </Document>
</kml>
```

Points à connaître :

- **Coordonnées en WGS84 uniquement**, en degrés décimaux, dans l'ordre **longitude, latitude, altitude**. Des données MN95 doivent être reprojetées avant export.
- Les **couleurs** sont écrites en hexadécimal dans l'ordre **`aabbggrr`** (alpha, bleu, vert, rouge), et non `rrggbb` comme en HTML. Ici `73ff0000` = alpha `73` (≈ 45 % d'opacité), bleu `ff`, vert `00`, rouge `00` : un trait **bleu** semi-transparent.
- Un fichier **KMZ** est une **archive ZIP** (compression *Deflate*) contenant un fichier `doc.kml` et éventuellement des images ou icônes. On peut le renommer en `.zip` pour l'ouvrir.

!!! tip "Exercice"
    Mettez ces notions en pratique avec l'exercice [Lire et modifier un fichier KML](../exercices/ex06-kml/README.md).

### GPX (GPS Exchange Format)

**GPX** est le format d'échange des **récepteurs GPS** et des applications sportives (voir les exemples ci-dessus). Il connaît trois types d'objets : les points de passage (`wpt`), les routes (`rte`) et les traces (`trk`, découpées en segments `trkseg` de points `trkpt`). Comme KML, il est en **WGS84** (attributs `lat` et `lon`).

### INTERLIS 2 (XTF)

Le format de transfert d'**INTERLIS 2**, la norme suisse d'échange de géodonnées, est également du XML (extension `.xtf`). La structure du fichier est déterminée par le modèle de données INTERLIS (`.ili`). INTERLIS fait l'objet d'un cours séparé ; retenez simplement qu'un fichier XTF est un document XML que l'on peut ouvrir dans un éditeur de texte.

## JSON

**JSON** (*JavaScript Object Notation*) est un format texte d'échange de données issu de JavaScript et normalisé (RFC 8259, ECMA-404). Très utilisé sur le web et par les API, il remplace XML dans de nombreux usages. Il ne connaît pas de balises : uniquement des **paires clé-valeur** et des **listes**.

```json
{
  "page": "JSON sur EduTechWiki",
  "url": "https://edutechwiki.unige.ch/fr/JSON",
  "langues": ["fr", "en"],
  "visites": 1250,
  "archive": false,
  "info": {
    "createdAt": "2017-02-23",
    "createdBy": "MAF"
  }
}
```

*Exemple adapté de [16].*

### Syntaxe

- Un **objet** est délimité par `{ }` et contient des paires `"clé": valeur` séparées par des virgules.
- Un **tableau** est délimité par `[ ]` et contient des valeurs séparées par des virgules.
- Les clés sont **toujours entre guillemets doubles** `"` (pas d'apostrophes).
- **Pas de virgule** après le dernier élément d'un objet ou d'un tableau.
- **Pas de commentaires** en JSON.
- Encodage : UTF-8.

### Types de valeurs

| Type | Exemple |
|---|---|
| Chaîne de caractères | `"Lausanne"` |
| Nombre (entier ou décimal, point décimal) | `42`, `-3.5`, `2.6e6` |
| Booléen | `true`, `false` |
| Valeur nulle | `null` |
| Objet | `{"e": 2538700, "n": 1180900}` |
| Tableau | `[1, 2, 3]` |

### XML ou JSON ?

| | XML | JSON |
|---|---|---|
| Structure | Arbre d'éléments et d'attributs | Objets et tableaux imbriqués |
| Verbosité | Élevée (balises ouvrantes **et** fermantes) | Faible : fichiers plus légers |
| Types de données | Tout est texte (types via XSD) | Chaîne, nombre, booléen, null natifs |
| Espaces de noms | Oui | Non |
| Commentaires | Oui | Non |
| Schéma | DTD, **XSD** (très mûr) | **JSON Schema** |
| Usage typique | Échanges normalisés, documents (GML, INTERLIS, Office) | API web, applications JavaScript, GeoJSON |

## GeoJSON

**GeoJSON** est un format JSON pour les données géographiques vectorielles, normalisé par l'IETF dans la **RFC 7946** (2016). C'est le format vectoriel le plus courant sur le web (Leaflet, OpenLayers, API REST).

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [6.6413, 46.7785]
      },
      "properties": {
        "nom": "Yverdon-les-Bains",
        "npa": 1400
      }
    }
  ]
}
```

- Une `FeatureCollection` contient une liste de `Feature`.
- Chaque `Feature` a une `geometry` et des `properties` (les attributs).
- Types de géométrie : `Point`, `LineString`, `Polygon`, `MultiPoint`, `MultiLineString`, `MultiPolygon`, `GeometryCollection`.

!!! warning "GeoJSON = WGS84, longitude d'abord"
    Selon la RFC 7946, les coordonnées GeoJSON sont **toujours en WGS84** (EPSG:4326), en degrés décimaux, dans l'ordre **[longitude, latitude]** (éventuellement suivi de l'altitude). L'ancien membre `"crs"`, qui permettait d'indiquer un autre système (p. ex. MN95), est **obsolète** depuis 2016. Certains logiciels écrivent encore des GeoJSON en MN95 avec un membre `"crs"` : ces fichiers ne sont pas conformes et peuvent être mal interprétés par d'autres outils.

!!! tip "Exercice"
    L'exercice [GeoJSON et systèmes de coordonnées](../exercices/ex07-geojson/README.md) compare un GeoJSON en WGS84 et un GeoJSON en MN95.

## JSON Schema

Comme pour XML, on distingue en JSON :

- la vérification **syntaxique** (document bien formé) : une virgule ou un guillemet manquant rend le fichier illisible. Tout éditeur moderne (VS Code, Notepad++ avec l'extension JSON Tools) ou un site comme jsonlint.com le détecte ;
- la vérification du **contenu** (document valide) au moyen d'un **JSON Schema**, l'équivalent d'un XSD, lui-même écrit en JSON.

Exemple de schéma minimal :

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "nom": { "type": "string" },
    "npa": { "type": "integer", "minimum": 1000, "maximum": 9999 }
  },
  "required": ["nom", "npa"]
}
```

Un objet `{"nom": "Yverdon-les-Bains", "npa": 1400}` est valide ; `{"nom": "Yverdon-les-Bains"}` ne l'est pas (`npa` manque).

!!! example "Exemple réel : le cadastre RDPPF"
    Pour le cadastre des restrictions de droit public à la propriété foncière (RDPPF / ÖREB), la Confédération publie à la fois les schémas **XML** (XSD) et **JSON** (JSON Schema) des extraits : <https://schemas.geo.admin.ch/V_D/OeREB/2.0/>. Un même contenu peut ainsi être échangé dans les deux formats, chacun vérifiable par son schéma.

## À retenir

- XML : métalangage du W3C, structure **en arbre**, **éléments** + **attributs**, un seul élément racine, encodage **UTF-8** recommandé.
- **Bien formé** = syntaxe correcte ; **valide** = bien formé **et** conforme à un schéma (DTD ou, aujourd'hui, **XSD**).
- Formats géo XML : **GML** (ISO 19136, tout système de coordonnées), **KML** (WGS84, couleurs `aabbggrr`, KMZ = ZIP), **GPX**, **INTERLIS 2 / XTF**.
- JSON : objets `{}`, tableaux `[]`, types natifs, plus léger que XML ; validé par **JSON Schema**.
- **GeoJSON** (RFC 7946) : WGS84, **[lon, lat]**, le membre `"crs"` est obsolète.

## Sources

- [16] *JSON*, EduTech Wiki, Université de Genève : <https://edutechwiki.unige.ch/fr/JSON>
- W3C, *Extensible Markup Language (XML) 1.0* : <https://www.w3.org/TR/xml/>
- W3C, *XML Schema* : <https://www.w3.org/XML/Schema>
- OGC, *Geography Markup Language* : <https://www.ogc.org/standards/gml/>
- OGC, *KML 2.2* : <https://www.ogc.org/standards/kml/>
- Google, *Référence KML* : <https://developers.google.com/kml/documentation/kmlreference>
- TopoGrafix, *GPX 1.1 Schema* : <https://www.topografix.com/GPX/1/1/>
- IETF, *RFC 7946 – The GeoJSON Format* : <https://datatracker.ietf.org/doc/html/rfc7946>
- *JSON Schema* : <https://json-schema.org/>
- Schémas RDPPF (ÖREB) 2.0 : <https://schemas.geo.admin.ch/V_D/OeREB/2.0/>

## Exercices

- [Lire et modifier un fichier KML](../exercices/ex06-kml/README.md)
- [GeoJSON et systèmes de coordonnées](../exercices/ex07-geojson/README.md)

---

← [3D et nuages de points](../04-3d-nuages-de-points/README.md) · [Interopérabilité et normes](../06-interoperabilite-normes/README.md) →
