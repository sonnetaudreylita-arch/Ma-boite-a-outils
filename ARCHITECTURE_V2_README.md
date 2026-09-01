# Ma boîte à outils — architecture V2 (travail)

Cette version est une migration **non destructive**.

## Ce qui a été fait
- Les données originales sont conservées dans `data/_legacy/`.
- Des collections V2 ont été générées à partir des données existantes.
- `works.v2.json` sépare les œuvres des profils d'artistes.
- Les IDs d'ateliers et d'objets culturels sont rendus uniques.
- `media.v2.json` inventorie les médias actuellement présents sans leur attribuer arbitrairement une rubrique.
- `config/site.json` centralise les collections et les racines de fichiers.

## Ce qui n'a PAS été fait
- Aucun fichier image existant n'a été supprimé ou déplacé.
- Aucune association image -> rubrique n'a été inventée.
- Aucun contenu textuel n'a été supprimé.
- Le moteur `app.js` n'est pas encore remplacé.

## Prochaine phase
1. Valider le modèle V2.
2. Adapter le moteur pour charger les collections via `config/site.json`.
3. Réimporter les bonnes images depuis `PUBLISHED` dans une arborescence stable.
4. Faire correspondre les médias aux contenus.
5. Tester navigation, recherche, relations et ajout d'une nouvelle ressource.


## Phase 2 — ateliers reconstruits depuis PUBLISHED
- Les 6 ateliers ont été reconstruits à partir de `Ateliers dexprimentations.html`, sans inventer leur contenu.
- Les images sont associées aux ateliers uniquement lorsque leur référence est explicitement présente dans le HTML exporté.
- Les éléments du glossaire sont conservés dans l’ordre/source et reliés à un ID V2 uniquement lorsqu’un terme correspondant existe déjà.
- Les références artistiques sont reliées uniquement à partir des blocs d’artistes explicitement présents dans chaque atelier.
- 1 image source de l’atelier 5 (`28d53ec50b9839c3e4119669a4c7d87e.jpg`) est référencée par PUBLISHED mais absente du checkpoint d’assets actuel ; elle est signalée `missing-from-checkpoint`, pas remplacée.
- Le moteur `app.js` n’est volontairement pas basculé vers ces données à ce stade : le contenu atelier doit être validé avant changement de moteur.
