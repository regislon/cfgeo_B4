# Schema mapping

Chapitre : [7. Échange de données](../../07-echange-de-donnees/README.md)

**Objectif** : Établir la table de correspondance entre deux modèles de données.

## Données

[⬇ Télécharger toutes les données (zip)](https://regislon.github.io/cfgeo_B4/formats-interfaces/exercices/ex07-schema-mapping/donnees.zip)

- [`Normat.xlsx`](donnees/Normat.xlsx)

## Consignes

Logiciel : un tableur.

Le fichier `Normat.xlsx` contient, d'un côté, les valeurs de l'attribut `vd_Designation` d'un modèle d'affectation du sol, et de l'autre, la liste des valeurs `TYPE_PRINCIPAL` du modèle cible.

1. Pour chaque valeur source, choisissez la valeur cible correspondante.
2. Repérez les valeurs sources sans équivalent et celles qui se regroupent sur une même valeur cible. Quelle information perd-on ?
3. Présentez votre table sous la forme `att_name_in`, `att_value_in`, `att_name_out`, `att_value_out`, directement utilisable par un outil ETL.
