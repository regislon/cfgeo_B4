---
marp: true
theme: cfgeo
paginate: true
footer: CFGéo B4 · Formats, interfaces · 4. 3D et nuages de points
---

<!-- _class: lead -->
<!-- _paginate: false -->

# 4. 3D et nuages de points

Module B4 « Géomatique & TI » — Formats, interfaces

---

## Objectifs

- Distinguer 2D, 2.5D et 3D
- Citer des applications de la 3D
- Connaître les formats de nuages de points (LAS/LAZ, COPC, E57)
- Connaître les standards 3D du territoire (CityGML) et du bâtiment (IFC)
- Expliquer la diffusion 3D sur le web (3D Tiles)

---

## 2D, 2.5D, 3D

- **2D** : coordonnées E, N seulement
- **2.5D** : **une seule** altitude par position → Z = f(E, N)
  - MNT, courbes de niveau, points cotés
- **3D** : vrais volumes, **plusieurs Z** possibles pour un même (E, N)
  - surplomb, pont + rivière, étages, tunnel

> Question : un MNT peut-il représenter un pont ?

---

## À quoi sert la 3D ?

- Visualisation de projets (architecture, urbanisme)
- Visibilité, ensoleillement, potentiel solaire des toits
- Propagation du bruit, des ondes, des crues
- Propriété par étages (PPE, Genève)
- Réseaux souterrains, volumes, contrôle d'ouvrages

⚠ Saisie **et mise à jour** coûteuses

---

<!-- _class: lead -->

# Nuages de points

---

## Qu'est-ce qu'un nuage de points ?

- Ensemble de points X, Y, Z **sans topologie**
- Acquis par **LiDAR** (aérien, mobile, terrestre) ou **photogrammétrie** (drone)
- Attributs : intensité, n° de retour, **classe**, heure GPS, couleur RVB
- Classes ASPRS : 2 = sol, 3-5 = végétation, 6 = bâtiment, 9 = eau
- Des **centaines de millions** de points → volume et accès = enjeux majeurs

---

## Formats de nuages de points

| Format | En bref |
|---|---|
| **LAS** | Binaire ouvert de l'ASPRS (v1.4), la référence |
| **LAZ** | LAS compressé **sans perte** (5-10× plus petit) |
| **COPC** | LAZ organisé en **octree**, lecture partielle via HTTP |
| **E57** | Scanners terrestres : stations + images (ASTM) |
| XYZ / TXT | ASCII, lisible mais énorme |

---

## Exemple suisse : swissSURFACE3D

- Nuage de points LiDAR **classifié** de toute la Suisse (swisstopo)
- Format **LAZ**, dalles de 1 km × 1 km
- **MN95 (EPSG:2056)**, altitudes NF02
- Gratuit, téléchargeable sur swisstopo.admin.ch
- Sert à dériver swissALTI3D (MNT) et le MNS

---

## 🧵 Yverdon en nuage de points

Tuile **2538-1180**, swissSURFACE3D 2025 :

- **18,4 millions** de points (~18 pts/m²) · **COPC** de 113 Mo
- Extrait du cours : 300 m × 300 m, 260'000 points, LAS de 5,2 Mo
- Dans l'extrait : sol 52 % · végétation 22 % · bâtiments 18 %
- En-tête binaire : signature **`LASF`**, coordonnées en **entiers** × 0,01 m + décalage

▶ [Visionneuse : couleur par classe, altitude, intensité](https://regislon.github.io/cfgeo_B4/formats-interfaces/04-3d-nuages-de-points/#fil-rouge-le-kilometre-carre-dyverdon-en-nuage-de-points)

---

<!-- _class: lead -->

# Modèles 3D de villes : CityGML

---

## CityGML

- Standard **OGC** pour les modèles 3D de villes et paysages
- Versions : 1.0 (2008), 2.0 (2012), **3.0 (2021)**
- Modèle UML + encodage **GML** (XML)
- **Sémantique** : toit, mur, sol sont des objets classés
- Modulaire : bâtiments, routes, eau, végétation, ponts, tunnels…
- Extensible par des **ADE** (bruit, énergie…)

---

## Niveaux de détail (LOD)

![w:700](img/citygml-lod.png)

LOD0 empreinte · LOD1 blocs · LOD2 toits · LOD3 façades détaillées

---

## CityGML 3.0 : ce qui change

- **LOD4 supprimé** (il servait aux intérieurs)
- Intérieur et extérieur modélisés **séparément**, chacun en LOD0-3
- Gestion des **versions** et des valeurs **dans le temps**
- **CityJSON** : encodage **JSON** du modèle, bien plus compact
- Exemple suisse : **swissBUILDINGS3D** (tous les bâtiments, toits détaillés)

---

<!-- _class: lead -->

# BIM et IFC

---

## BIM : Building Information Modelling

- Base de données d'un ouvrage : **objets + propriétés + relations**
- Pas seulement de la géométrie

![w:180](img/mur-cao.png) ![w:420](img/mur-bim.png)

---

## Le BIM sur tout le cycle de vie

![h:430](img/bim-cycle-de-vie.jpg)

Conception → construction → exploitation → démolition

---

## openBIM vs closedBIM

- **closedBIM** : une seule suite logicielle pour tous (p. ex. Revit)
  - simple, mais dépendance à un éditeur
- **openBIM** : logiciels différents, échange par **standards ouverts**
  - en premier lieu **IFC**
- → application directe de l'**interopérabilité** (chap. 6)

---

## IFC : Industry Foundation Classes

- Maintenu par **buildingSMART**, norme **ISO 16739**
- **IFC 4.3** : ajoute routes, rail, ponts (infrastructures)
- Chaque objet a une **classe** : `IfcWall`, `IfcDoor`, `IfcSpace`…
- Géométrie + propriétés + relations (étage ⊃ espace ⊃ porte)
- Fichier `.ifc` texte (STEP), aussi ifcXML, ifcZIP
- ⚠ Classes limitées : pas d'`IfcTree` → classe générique

---

## ▶ Démo : une maquette IFC dans le navigateur

- Maison d'exemple **buildingSMART** (IFC 4.3, 142 Ko, CC BY 4.0)
- Lue par la bibliothèque libre **web-ifc**
- **Clic** sur un élément → classe (`IfcWall`, `IfcSlab`…), nom, `GlobalId`
- … et sa **ligne dans le fichier texte** : `#285=IFCSLAB('12UVOn4w…', …)`
- Géoréférencement : `IfcMapConversion` (ici EPSG:32760)

▶ [Ouvrir la visionneuse IFC](https://regislon.github.io/cfgeo_B4/formats-interfaces/04-3d-nuages-de-points/#ifc)

---

## SIG et BIM

- CityGML : le territoire vu de l'**extérieur**
- IFC : l'ouvrage vu de l'**intérieur**
- Difficultés : coordonnées locales vs **MN95**, géométries, LOD
- Géoréférencer une maquette IFC = tâche de géomaticien

---

## Diffusion web : 3D Tiles

- Impossible de charger tout un pays d'un coup → **tuiles hiérarchiques**
- **3D Tiles** (OGC, issu de Cesium) : `tileset.json` + contenu **glTF**
- Bâtiments, maillages, nuages de points
- Alternatives : I3S (Esri), COPC pour les nuages
- En Suisse : vue **3D** de **map.geo.admin.ch**

---

## À retenir

- 2.5D = un Z par position ; 3D = vrais volumes
- Nuages : **LAS**, **LAZ**, **COPC**, **E57** ; swissSURFACE3D en LAZ/MN95
- **CityGML 3.0** : LOD0-3, sémantique ; **CityJSON** = version JSON
- **BIM** = maquette sur tout le cycle de vie ; **IFC** (ISO 16739) = openBIM
- Web : **3D Tiles** + glTF
