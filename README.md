# Ma boîte à outils

Portfolio étudiant statique pour GitHub Pages.

## Architecture
- `index.html` : point d’entrée
- `app.js` / `styles.css` : interface et navigation
- `data/*.json` : contenu éditable sans modifier l’interface
- `assets/images/` : images du site exporté
- `documents/` : CV et lettre de motivation

Le site fonctionne en navigation par URL/hash et peut être enrichi en ajoutant des objets dans les fichiers JSON.


## Phase 3 — moteur V2 branché
- `app.js` charge désormais les collections déclarées dans `config/site.json` au lieu des JSON legacy.
- Les routes utilisent les IDs V2 pour les ateliers, le glossaire, les artistes et les œuvres.
- Les œuvres sont exposées comme collection distincte et reliées aux artistes.
- Les galeries utilisent `media.v2.json` et résolvent les anciens noms `.jpg` vers les fichiers `.webp` présents.
- Les relations V2 ont été nettoyées uniquement par correspondance exacte/unique ; les références non résolues restent conservées dans les champs `_legacy`.
- `app.legacy.js` conserve le moteur précédent dans le dossier de travail.
- `tools/validate-v2.py` vérifie les intégrités de relations entre collections.

### Vérification
Le moteur a passé une vérification de syntaxe JavaScript et les fichiers déclarés dans `config/site.json` répondent correctement via un serveur HTTP local.
