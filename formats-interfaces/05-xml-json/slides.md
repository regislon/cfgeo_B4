---
marp: true
theme: cfgeo
paginate: true
footer: CFGéo B4 · Formats, interfaces · 5. XML et JSON
---

<!-- _class: lead -->
<!-- _paginate: false -->

# 5. XML et JSON

Module B4 « Géomatique & TI » — Formats, interfaces

---

## Objectifs

- Lire et écrire un document XML et JSON
- Distinguer document bien formé et document valide
- Comprendre le rôle d'un schéma (XSD, JSON Schema)
- Reconnaître GML, KML, GPX, XTF et GeoJSON

---

## 🧵 Un arrêt de bus, cinq encodages

« Yverdon-les-Bains, Faïencerie » (fil rouge, chapitre 3)

| Format | Langage | Coordonnées | Taille |
|---|---|---|---|
| GML | XML | **MN95** `2538964 1180177` | 369 o |
| KML | XML | WGS84 `6.639541,46.769964` | 280 o |
| GPX | XML | WGS84 `lat=… lon=…` | 244 o |
| INTERLIS 2 (XTF) | XML | **MN95** `<C1>` `<C2>` | 596 o |
| GeoJSON | JSON | WGS84 `[6.639541, 46.769964]` | **174 o** |

Même information, emballages différents · ▶ [voir les 5 fichiers](https://regislon.github.io/cfgeo_B4/formats-interfaces/05-xml-json/#fil-rouge-un-arret-de-bus-cinq-encodages)

---

## XML : un métalangage

- Standard du **W3C** (1998), fichier **texte** structuré **en arbre**
- Fixe les règles d'écriture, pas le vocabulaire
- Chaque domaine crée ses balises → « dialectes » XML
- Exemples : **GPX**, **KML**, **GML**, **INTERLIS 2 (XTF)**, SVG, `.docx`

---

## Balises, éléments, attributs

```xml
<trk>
  <name>Sortie à vélo</name>
  <trkseg>
    <trkpt lat="46.5194690" lon="6.5983470">
      <ele>382.1</ele>
      <time>2014-04-26T11:59:19Z</time>
    </trkpt>
  </trkseg>
</trk>
```

- **Élément** : `<ele>382.1</ele>` — **attribut** : `lat="46.519..."`
- Sensible à la **casse**, un seul élément **racine**

---

## Élément ou attribut ?

- Pas de règle absolue
- Attribut : une seule valeur, pas de structure, difficile à faire évoluer
- **Éléments** pour les données
- **Attributs** pour les infos complémentaires (id, unité, SRS…)
- Caractères réservés : `&lt;` `&gt;` `&amp;` `&apos;` `&quot;`

---

## Structure d'un document XML

1. **Prologue** : `<?xml version="1.0" encoding="UTF-8"?>`
2. **Modèle** (facultatif) : DTD ou schéma XSD
3. **Arbre des éléments** depuis la racine

Encodage : **UTF-8** (défaut, tous les caractères, €)
plutôt que ISO-8859-1 — et déclaré = réel !

---

## Espaces de noms

```xml
<gpx version="1.1"
     xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1
                         http://www.topografix.com/GPX/1/1/gpx.xsd">
```

- Évitent les conflits de noms entre vocabulaires
- Préfixe → URI unique : `xsi:`, `gml:`, `app:`
- `schemaLocation` indique où trouver le **schéma**

---

## DTD et XSD : la grammaire

| | DTD | XSD |
|---|---|---|
| Syntaxe | propre | **XML** |
| Types | texte seulement | entier, date, énumération… |
| Namespaces | mal gérés | oui |
| Usage | historique | **standard actuel** |

Ils définissent : éléments, ordre, occurrences, attributs, types

---

## Exemple de schéma XSD

```xml
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <xsd:element name="Ferme" type="FermeType"/>
  <xsd:complexType name="FermeType">
    <xsd:sequence>
      <xsd:element name="Batiment" type="BatimentType"
                   minOccurs="0" maxOccurs="unbounded"/>
    </xsd:sequence>
    <xsd:attribute name="ID" type="xsd:ID" use="required"/>
  </xsd:complexType>
</xsd:schema>
```

Un **schéma** décrit les données… mais n'en contient **aucune**

---

## Bien formé

- Un seul élément **racine**
- Chaque balise ouverte est **fermée**, même nom, même casse
- Imbrication correcte : `<a><b></b></a>`
- Vides : `<nom/>`
- Attributs entre guillemets, une fois par balise
- `<` et `&` remplacés par `&lt;` et `&amp;`

---

## Valide

- **Bien formé**
- **+** référence à une DTD ou un XSD
- **+** conforme à ce schéma

`<ferme><vache>Marguerite</vache></ferme>`
→ bien formé, mais **pas valide** (pas de `vache`, pas d'`ID`)

Valide ⇒ bien formé, mais pas l'inverse

---

## ▶ À vous : bien formé ?

- Éditeur en ligne : le **KML de l'arrêt**, vérifié **en direct**
- Boutons « Casser » : balise non fermée, `&` non échappé, guillemets, imbrication, majuscule
- **Arbre** du document : élément racine, enfants, attributs, texte

▶ [Ouvrir l'éditeur XML](https://regislon.github.io/cfgeo_B4/formats-interfaces/05-xml-json/#a-vous-de-jouer-bien-forme)

---

<!-- _class: lead -->

# Formats géographiques XML

---

## GML

- Dialecte XML de l'**OGC**, norme **ISO 19136** depuis 2007
- Fournit les géométries : `gml:Point`, `gml:Polygon`…
- Chaque domaine écrit son **schéma d'application** (ex. CityGML)
- **Tout système de coordonnées** (`srsName`)
- Format de réponse des services **WFS**

---

## Exemple GML

```xml
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

---

## KML

```xml
<Style id="style2">
  <LineStyle><color>73ff0000</color><width>5</width></LineStyle>
</Style>
<Placemark>
  <styleUrl>#style2</styleUrl>
  <LineString>
    <coordinates>7.748836,46.02021,0 7.747978,46.01878,0</coordinates>
  </LineString>
</Placemark>
```

- Google Earth, standard **OGC** (2008)

---

## KML : pièges

- **WGS84 uniquement** : longitude, latitude, altitude
- Couleurs **`aabbggrr`** : `73ff0000` = **bleu** semi-transparent
- **KMZ** = archive **ZIP** (Deflate) : `doc.kml` + images

---

## ▶ Couleur HTML ↔ KML

| | Ordre | Bleu à 45 % |
|---|---|---|
| HTML / QGIS | rouge · vert · bleu | `#0000ff` + 45 % |
| **KML** | **alpha · bleu · vert · rouge** | `73ff0000` |

▶ [Convertisseur de couleurs](https://regislon.github.io/cfgeo_B4/formats-interfaces/05-xml-json/#kml-keyhole-markup-language)

---

<!-- _class: exercice -->

# Exercice : Lire et modifier un fichier KML

[Consignes et données](https://regislon.github.io/cfgeo_B4/formats-interfaces/exercices/ex06-kml/)

---

## GPX et INTERLIS 2

- **GPX** : récepteurs GPS, sport
  - `wpt` (points), `rte` (routes), `trk` → `trkseg` → `trkpt`
  - WGS84 (`lat`, `lon`)
- **INTERLIS 2** : transfert en XML (`.xtf`)
  - structure dictée par le modèle `.ili`
  - cours séparé

---

<!-- _class: lead -->

# JSON et GeoJSON

---

## JSON

```json
{
  "page": "JSON sur EduTechWiki",
  "langues": ["fr", "en"],
  "visites": 1250,
  "archive": false,
  "info": { "createdAt": "2017-02-23", "createdBy": "MAF" }
}
```

- Objet `{ }`, tableau `[ ]`, clés entre `"`
- Types : chaîne, nombre, booléen, `null`, objet, tableau
- Pas de commentaires, pas de virgule finale

---

## XML vs JSON

| | XML | JSON |
|---|---|---|
| Structure | éléments + attributs | objets + tableaux |
| Taille | verbeux | léger |
| Types | texte (via XSD) | natifs |
| Namespaces | oui | non |
| Schéma | XSD | JSON Schema |
| Usage | GML, INTERLIS | API web, GeoJSON |

---

## GeoJSON (RFC 7946)

```json
{ "type": "FeatureCollection",
  "features": [
    { "type": "Feature",
      "geometry": { "type": "Point",
                    "coordinates": [6.6413, 46.7785] },
      "properties": { "nom": "Yverdon-les-Bains", "npa": 1400 }
    } ] }
```

- `FeatureCollection` → `Feature` → `geometry` + `properties`

---

## GeoJSON : WGS84, longitude d'abord

- Coordonnées **toujours en WGS84** (EPSG:4326)
- Ordre **[longitude, latitude]**
- Membre `"crs"` **obsolète** depuis 2016
- Un GeoJSON en MN95 n'est **pas conforme**

---

## ▶ Le piège [lat, lon]

- `[6.639541, 46.769964]` → Yverdon-les-Bains ✅
- `[46.769964, 6.639541]` → **Corne de l'Afrique** (Éthiopie / Somalie) ❌
- GeoJSON = **longitude d'abord**, toujours

▶ [GeoJSON sur une carte](https://regislon.github.io/cfgeo_B4/formats-interfaces/05-xml-json/#geojson)

---

## JSON-FG (OGC, 2025)

- Extension de GeoJSON : **reste un GeoJSON valide**
- `"place"` + `"coordRefSys"` → géométrie dans **un autre système**, p. ex. **MN95**
- `"geometry"` reste en WGS84 pour les logiciels « GeoJSON seulement »
- Ajoute aussi le **temps** (`"time"`) et le type d'objet

---

## JSON, le langage des API

- OGC API, **STAC**, API geo.admin.ch → réponses **JSON**
- Indenté (174 o) ou **compact** (149 o) : même contenu
- **NDJSON / GeoJSONSeq** : un objet par ligne → lecture en flux des gros fichiers

---

<!-- _class: exercice -->

# Exercice : GeoJSON et systèmes de coordonnées

[Consignes et données](https://regislon.github.io/cfgeo_B4/formats-interfaces/exercices/ex07-geojson/)

---

## JSON Schema

```json
{ "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "nom": { "type": "string" },
    "npa": { "type": "integer", "minimum": 1000, "maximum": 9999 }
  },
  "required": ["nom", "npa"] }
```

- L'équivalent du **XSD** pour JSON
- Exemple réel : schémas XML **et** JSON du cadastre **RDPPF**
  schemas.geo.admin.ch/V_D/OeREB/2.0/

---

## ▶ Bien formé **et** valide ?

- GeoJSON de l'arrêt vérifié par un **JSON Schema**
- `"Pointt"`, latitude supprimée, `"moyen": "Avion"` → **bien formé ✅ mais non valide ❌**
- Virgule en trop, guillemet manquant → **mal formé ❌**

▶ [Ouvrir le validateur](https://regislon.github.io/cfgeo_B4/formats-interfaces/05-xml-json/#a-vous-de-jouer-bien-forme-et-valide)

---

## ❓ Testez-vous

7 questions : élément racine, `&`, « Pointt », ordre des coordonnées, couleur KML, MN95, schémas

▶ [Faire le quiz](https://regislon.github.io/cfgeo_B4/formats-interfaces/05-xml-json/#testez-vous)

---

## À retenir

- XML : arbre, éléments + attributs, une racine, **UTF-8**
- **Bien formé** = syntaxe ; **valide** = + conforme au schéma (**XSD**)
- **GML** (ISO 19136, tout SRS), **KML** (WGS84, `aabbggrr`, KMZ = ZIP), **GPX**, **XTF**
- JSON : `{}` `[]`, types natifs, **JSON Schema**
- **GeoJSON** : WGS84, **[lon, lat]**, pas de `"crs"`
