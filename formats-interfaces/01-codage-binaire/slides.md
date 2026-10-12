---
marp: true
theme: cfgeo
paginate: true
footer: CFGéo B4 · Formats, interfaces · 1. Codage binaire
---

<!-- _class: lead -->
<!-- _paginate: false -->

# 1. Codage binaire

Module B4 « Géomatique & TI » — Formats, interfaces

---

## Objectifs

- Expliquer pourquoi un ordinateur travaille en base 2
- Convertir un nombre entre binaire et décimal
- Calculer le nombre de valeurs représentables avec *n* bits
- Maîtriser les unités (bit, octet, ko/Kio, Mo/Mio…)

---

## Qu'est-ce qu'un format ?

- **Format de données** : manière d'encoder l'information pour qu'un logiciel puisse l'exploiter
- **Format d'échange** : format compris par plusieurs systèmes
- **Format ouvert** : spécification publique
- **Format fermé / propriétaire** : spécification secrète ou contrôlée par un éditeur
- Pour comparer les formats, il faut comprendre comment l'ordinateur code l'information

---

<!-- _class: lead -->

# Décimal et binaire

---

## Pourquoi la base 2 ?

- Nous comptons en base 10… parce que nous avons 10 doigts
- L'ordinateur ne connaît que **deux états** :
  - courant / pas de courant
  - allumé / éteint, vrai / faux
  - **1 / 0**
- Deux états = facile à produire, stocker et lire de manière fiable

---

## Représentation positionnelle

- Base 10 : symboles 0 à 9, chaque position = une puissance de 10
- Le 3 de **1934** vaut 30, celui de **3008** vaut 3'000

**Forme canonique** de 3'528 :

3'528 = 3·10³ + 5·10² + 2·10¹ + 8·10⁰

- Base 2 : même principe, mais seulement **0 et 1** et des puissances de 2

---

## Le bit

- **bit** = *binary digit* = 0 ou 1 (noté **b**)
- Plus petite unité d'information

| Bits | Valeurs possibles |
|---|---|
| 1 | 2 |
| 2 | 4 |
| 3 | 8 |
| *n* | **2ⁿ** |

---

## L'octet

- **Octet** (o) = *byte* (B) = **8 bits**
- 2⁸ = **256** valeurs : de `00000000` = 0 à `11111111` = **255**
- 1 octet ≈ 1 caractère ASCII, 1 pixel en niveaux de gris
- 2 octets → 65'536 valeurs ; 4 octets → ~4,3 milliards
- ⚠️ **b** = bit, **B** = byte : 100 Mb/s = 12,5 Mo/s

---

<!-- _class: lead -->

# Conversions

---

## Binaire → décimal

Somme des puissances de 2 là où il y a un 1 :

10101₍₂₎ = 1·2⁴ + 0·2³ + 1·2² + 0·2¹ + 1·2⁰ = 16 + 4 + 1 = **21**

| 2⁷ | 2⁶ | 2⁵ | 2⁴ | 2³ | 2² | 2¹ | 2⁰ | |
|---|---|---|---|---|---|---|---|---|
| 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 | |
| 0 | 0 | 1 | 0 | 1 | 0 | 1 | 0 | **= 42** |

Le bit de poids faible (2⁰) est **à droite**

---

## Décimal → binaire

Divisions successives par 2, lecture des restes **de bas en haut**

| 156 | 78 | 39 | 19 | 9 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|---|
| reste 0 | 0 | 1 | 1 | 1 | 0 | 0 | 1 |

156₍₁₀₎ = **10011100₍₂₎** (128 + 16 + 8 + 4)

---

## À vous !

1. 11001000₍₂₎ = ? en décimal
2. 77₍₁₀₎ = ? en binaire sur 8 bits
3. Combien de bits pour coder 26 lettres ?

<!-- Réponses : 200 ; 01001101 ; 5 bits -->

---

<!-- _class: lead -->

# Unités informatiques

---

## Deux familles de préfixes

| SI (décimal) | Valeur | CEI (binaire) | Valeur |
|---|---|---|---|
| ko | 1'000 o | **Kio** | 1'024 o |
| Mo | 10⁶ o | **Mio** | 2²⁰ = 1'048'576 o |
| Go | 10⁹ o | **Gio** | 2³⁰ o |
| To | 10¹² o | **Tio** | 2⁴⁰ o |

- Préfixes binaires (kibi, mébi, gibi…) normalisés par la CEI depuis 1998

---

## Dans la pratique

- Fabricants de disques : préfixes **décimaux** (1 To = 10¹² o)
- Windows : calcule en 2¹⁰ mais affiche « Go »
  → le disque de 1 To apparaît comme **931 Go** (en fait 931 Gio)
- Écart : 2,4 % (kilo) · 7,4 % (giga) · 10 % (téra)
- Image 4'000 × 3'000 px × 3 octets = **36 Mo ≈ 34,3 Mio**

---

## À retenir

- L'ordinateur code tout avec des **0 et des 1**
- *n* bits → **2ⁿ** valeurs ; 1 octet = 8 bits = 256 valeurs (0–255)
- Binaire ↔ décimal : somme des puissances de 2 / divisions par 2
- **ko = 1'000 o**, **Kio = 1'024 o** : préciser l'unité !
- Un format = une convention pour coder l'information en binaire
